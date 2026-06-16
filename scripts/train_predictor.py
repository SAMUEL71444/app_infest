"""
Pure-Python logistic-regression trainer for the interactive UMKM predictor.

Why this exists
---------------
The competition's headline model is CatBoost ("Oblivious Gradient-Boosted Tree")
+ TVAE (ROC-AUC 0.994). That model cannot run inside a static browser bundle.
For the interactive "Coba Prediksi UMKM Baru" feature we train a lightweight,
fully transparent logistic regression on the SAME features + feature-engineering
blocks the report's best config used (readiness + age_started + ratio), then
export the coefficients to JSON so inference runs entirely client-side
(Vercel-friendly, no backend, no Python at runtime).

Output
------
../src/data/predictor_model.json   (consumed by src/components/Predictor.tsx)

Run
---
    cd scripts && python3 train_predictor.py

No third-party dependencies required (standard library only).
"""
import csv, json, math, os, random

random.seed(42)

HERE = os.path.dirname(os.path.abspath(__file__))
CSV_PATH = os.path.join(HERE, "umkm_success.csv")
OUT_PATH = os.path.join(HERE, "..", "src", "data", "predictor_model.json")

BASE_FEATURES = [
    "Age", "Education", "Initial_Capital", "Financial_Record_Keeping",
    "Internet_Usage", "Business_Plan", "Marketing_Effort", "Partnership",
    "Parent_Business_Experience", "Industry_Experience", "Owner_Gender",
    "Professional_Advice",
]

# ---- load ----
rows = []
with open(CSV_PATH) as f:
    for r in csv.DictReader(f):
        rows.append({k: float(v) for k, v in r.items()})

def engineer(r):
    """Replicate the report's best FE config: readiness + age_started + ratio."""
    readiness = r["Initial_Capital"] + r["Internet_Usage"] + r["Financial_Record_Keeping"] + r["Business_Plan"]
    age_started = max(r["Age"] - r["Industry_Experience"], 0.0)
    exp_per_age = r["Industry_Experience"] / r["Age"] if r["Age"] else 0.0
    return readiness, age_started, exp_per_age

FEATURES = BASE_FEATURES + ["Readiness_Score", "Age_Started", "Exp_per_Age"]

X, y = [], []
for r in rows:
    readiness, age_started, exp_per_age = engineer(r)
    X.append([r[c] for c in BASE_FEATURES] + [readiness, age_started, exp_per_age])
    y.append(r["Success"])

n, d = len(X), len(FEATURES)

# ---- standardize ----
means = [sum(row[j] for row in X) / n for j in range(d)]
stds = []
for j in range(d):
    var = sum((row[j] - means[j]) ** 2 for row in X) / n
    stds.append(math.sqrt(var) if var > 1e-12 else 1.0)

def standardize(row):
    return [(row[j] - means[j]) / stds[j] for j in range(d)]

Xs = [standardize(row) for row in X]

def sigmoid(z):
    if z < -35: return 0.0
    if z > 35: return 1.0
    return 1.0 / (1.0 + math.exp(-z))

def train(Xtr, ytr, lr=0.1, epochs=4000, l2=0.01):
    w = [0.0] * d
    b = 0.0
    m = len(Xtr)
    pos = sum(ytr) or 1
    neg = m - pos or 1
    wpos, wneg = m / (2 * pos), m / (2 * neg)  # class weights counter imbalance
    for _ in range(epochs):
        gw = [0.0] * d
        gb = 0.0
        for xi, yi in zip(Xtr, ytr):
            p = sigmoid(b + sum(w[j] * xi[j] for j in range(d)))
            err = (p - yi) * (wpos if yi == 1 else wneg)
            for j in range(d):
                gw[j] += err * xi[j]
            gb += err
        for j in range(d):
            w[j] -= lr * (gw[j] / m + l2 * w[j])
        b -= lr * (gb / m)
    return w, b

def proba(w, b, xi):
    return sigmoid(b + sum(w[j] * xi[j] for j in range(d)))

# ---- 5-fold CV for an honest performance estimate ----
idx = list(range(n)); random.shuffle(idx)
folds = [idx[i::5] for i in range(5)]

def evaluate(w, b, Xte, yte):
    correct = 0
    pairs = []
    for xi, yi in zip(Xte, yte):
        p = proba(w, b, xi)
        correct += 1 if (1 if p >= 0.5 else 0) == yi else 0
        pairs.append((p, yi))
    acc = correct / len(yte)
    pos = [p for p, yy in pairs if yy == 1]
    negs = [p for p, yy in pairs if yy == 0]
    auc = 0.0
    if pos and negs:
        cnt = sum(1.0 if pp > pn else 0.5 if pp == pn else 0.0 for pp in pos for pn in negs)
        auc = cnt / (len(pos) * len(negs))
    return acc, auc

accs, aucs = [], []
for k in range(5):
    te = set(folds[k])
    Xtr = [Xs[i] for i in range(n) if i not in te]; ytr = [y[i] for i in range(n) if i not in te]
    Xte = [Xs[i] for i in te]; yte = [y[i] for i in te]
    w, b = train(Xtr, ytr)
    a, u = evaluate(w, b, Xte, yte)
    accs.append(a); aucs.append(u)

cv_acc = sum(accs) / len(accs)
cv_auc = sum(aucs) / len(aucs)

# ---- final model on all data ----
w, b = train(Xs, y)

model = {
    "_comment": "Lightweight client-side logistic regression for the live predictor. "
                "The competition headline model is CatBoost (ROC-AUC 0.994); this LR is a "
                "transparent in-browser approximation trained on the same features + FE.",
    "base_features": BASE_FEATURES,
    "engineered": ["Readiness_Score", "Age_Started", "Exp_per_Age"],
    "feature_order": FEATURES,
    "means": [round(v, 6) for v in means],
    "stds": [round(v, 6) for v in stds],
    "weights": [round(v, 6) for v in w],
    "bias": round(b, 6),
    "segment_thresholds": {"A": 0.80, "B": 0.50, "C": 0.30},
    "cv_accuracy": round(cv_acc, 4),
    "cv_roc_auc": round(cv_auc, 4),
    "n_samples": n,
    "success_rate": round(sum(y) / n, 4),
}

with open(OUT_PATH, "w") as f:
    json.dump(model, f, indent=2)

print(f"Trained on {n} samples, {d} features.")
print(f"5-fold CV  accuracy = {cv_acc:.4f}  |  ROC-AUC = {cv_auc:.4f}")
print(f"Wrote {os.path.relpath(OUT_PATH, HERE)}")
