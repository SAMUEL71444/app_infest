# Prediksi Keberhasilan UMKM — Dashboard DSC INFEST 2026

Dashboard data science yang menampilkan hasil analisis & model prediksi keberhasilan UMKM di Indonesia.

## Tim Peneliti
- Andreas Edward Putra Jatmiko
- Laura Marcella Pratama
- Komang Samuel Arie Wicaksana

## Pesan Inti
> **Keberhasilan UMKM ditentukan oleh *apa yang dilakukan* pemilik (praktik yang dapat diperbaiki seperti kesiapan usaha), BUKAN oleh *siapa* pemiliknya (faktor demografis seperti usia/gender yang terbukti hampir tidak berpengaruh).**

## Fitur
- **Dashboard hasil** — Performa model, faktor penentu (SHAP), Top-5 rekomendasi aksi, segmentasi UMKM (A/B/C/D), Lift & Cumulative Gains, dan analisis augmentasi.
- **Top-5 UMKM Berpeluang Sukses** — Lima UMKM dengan probabilitas tertinggi menurut model, di-skor dari seluruh dataset (`scripts/rank_umkm.py` → `top_umkm.json`).
- **Prediksi Interaktif** — Masukkan karakteristik sebuah UMKM, lalu model menghitung probabilitas keberhasilan + segmen (A/B/C/D) secara langsung di browser. Lihat [Predictor Interaktif](#predictor-interaktif).

## Tech Stack
- React + TypeScript
- Vite
- Tailwind CSS v4
- Recharts

## Run Locally

```bash
npm install
npm run dev
```

Buka [http://localhost:5173](http://localhost:5173) di browser.

## Deploy ke Vercel

1. Push ke GitHub repository
2. Buka [vercel.com](https://vercel.com) dan import repository
3. Vercel akan otomatis mendeteksi Vite dan build project
4. Deploy otomatis setiap push ke branch `main`

## Struktur Data

Semua data dimuat dari file JSON statis di `src/data/`:

| File | Isi |
|------|-----|
| `metrik_unggulan.json` | 10 metrik lengkap model unggulan (Oblivious GBT + TVAE) |
| `top5_model_pdf.json` | Top-5 model perbandingan |
| `shap_importance.json` | SHAP feature importance ranking |
| `rekomendasi.json` | Top-5 rekomendasi aksi |
| `segmentasi.json` | 4 segmen UMKM (A/B/C/D) |
| `lift_gains.json` | Data Lift per decile & Cumulative Gains |
| `model_results.json` | Hasil eksperimen augmentasi & feature engineering |
| `predictor_model.json` | Koefisien model regresi logistik untuk prediksi interaktif (inference di browser) |
| `top_umkm.json` | Top-5 UMKM dengan probabilitas tertinggi (hasil `scripts/rank_umkm.py`) |

## Predictor Interaktif

Seksi **"Coba Prediksi UMKM Baru"** memungkinkan juri/pengguna memasukkan profil UMKM
dan langsung mendapat estimasi probabilitas keberhasilan + segmennya.

**Cara kerja (jujur & transparan):**
- Model unggulan lomba — *Oblivious Gradient-Boosted Tree + TVAE* (ROC-AUC 0.993) —
  tidak bisa dijalankan di dalam bundle statis browser.
- Untuk prediksi *real-time* dipakai **regresi logistik ringan** yang dilatih pada **fitur yang sama**
  (+ feature engineering `readiness + age_started + ratio`). Akurasi 5-fold CV ≈ **94.4%**, ROC-AUC tinggi (≈ **0.99**).
- Koefisiennya di-*export* ke `src/data/predictor_model.json`; inferensi (standardize → linear → sigmoid)
  berjalan **sepenuhnya di sisi klien** sehingga tetap bisa di-deploy gratis di Vercel tanpa backend.
- Pembagian segmen mengikuti notebook: `p > 0.80` → A, `> 0.50` → B, `> 0.30` → C, sisanya → D.

**Melatih ulang model** (mis. jika data diperbarui):

```bash
cd scripts
python3 train_predictor.py   # tanpa dependensi pihak ketiga; menulis ulang src/data/predictor_model.json
python3 rank_umkm.py         # skor ulang seluruh dataset → menulis ulang src/data/top_umkm.json
```

## Sumber
- **Konfigurasi:** 1.792 konfigurasi via Stratified 5-Fold Cross Validation
- **Kaggle:** [Notebook](https://www.kaggle.com/code/andreasedo/notebook-infestyaudahlahya)

## Lisensi
Proyek ini dibuat untuk keperluan kompetisi DSC INFEST 2026 — BINUS University.
