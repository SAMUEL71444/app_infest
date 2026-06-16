import { useMemo, useState } from 'react';
import SectionWrapper from './SectionWrapper';
import model from '../data/predictor_model.json';
import segmentasi from '../data/segmentasi.json';

/* ──────────────────────────────────────────────────────────────
   Live predictor (client-side).
   The headline competition model is CatBoost (ROC-AUC 0.994) which
   cannot run in a static bundle. This form runs a transparent
   logistic regression (trained on the SAME features + FE blocks:
   readiness + age_started + ratio) whose coefficients live in
   predictor_model.json. Inference = standardize → linear → sigmoid.
   ────────────────────────────────────────────────────────────── */

type FormState = {
  Age: number;
  Education: number;
  Initial_Capital: number;
  Financial_Record_Keeping: number;
  Internet_Usage: number;
  Business_Plan: number;
  Marketing_Effort: number;
  Partnership: number;
  Parent_Business_Experience: number;
  Industry_Experience: number;
  Owner_Gender: number;
  Professional_Advice: number;
};

const DEFAULTS: FormState = {
  Age: 35,
  Education: 3,
  Initial_Capital: 1,
  Financial_Record_Keeping: 1,
  Internet_Usage: 1,
  Business_Plan: 1,
  Marketing_Effort: 4,
  Partnership: 0,
  Parent_Business_Experience: 0,
  Industry_Experience: 8,
  Owner_Gender: 1,
  Professional_Advice: 4,
};

const EDU_LABELS: Record<number, string> = {
  1: 'SD / sederajat',
  2: 'SMP / sederajat',
  3: 'SMA / SMK',
  4: 'Diploma / S1',
  5: 'S2 / S3',
};

/* Field metadata, grouped to reinforce the "what you DO vs who you are" message */
const TOGGLES: { key: keyof FormState; label: string; hint: string }[] = [
  { key: 'Initial_Capital', label: 'Modal Awal Memadai', hint: 'Modal cukup untuk memulai usaha' },
  { key: 'Financial_Record_Keeping', label: 'Pembukuan Keuangan', hint: 'Mencatat keuangan usaha secara rutin' },
  { key: 'Internet_Usage', label: 'Pemanfaatan Internet', hint: 'Menggunakan internet untuk usaha' },
  { key: 'Business_Plan', label: 'Rencana Bisnis', hint: 'Memiliki business plan tertulis' },
  { key: 'Partnership', label: 'Kemitraan / Partner', hint: 'Punya rekanan atau mitra usaha' },
  { key: 'Parent_Business_Experience', label: 'Pengalaman Bisnis Keluarga', hint: 'Orang tua pernah berwirausaha' },
];

function sigmoid(z: number): number {
  if (z < -35) return 0;
  if (z > 35) return 1;
  return 1 / (1 + Math.exp(-z));
}

function buildFeatureVector(f: FormState): Record<string, number> {
  const readiness = f.Initial_Capital + f.Internet_Usage + f.Financial_Record_Keeping + f.Business_Plan;
  const ageStarted = Math.max(f.Age - f.Industry_Experience, 0);
  const expPerAge = f.Age ? f.Industry_Experience / f.Age : 0;
  return {
    ...f,
    Readiness_Score: readiness,
    Age_Started: ageStarted,
    Exp_per_Age: expPerAge,
  };
}

function predict(f: FormState) {
  const fv = buildFeatureVector(f);
  const order = model.feature_order;
  let z = model.bias;
  const contributions: { name: string; value: number }[] = [];
  order.forEach((name, j) => {
    const std = (fv[name] - model.means[j]) / model.stds[j];
    const contribution = std * model.weights[j];
    z += contribution;
    contributions.push({ name, value: contribution });
  });
  const proba = sigmoid(z);
  return { proba, contributions, readiness: fv.Readiness_Score };
}

function segmentFor(p: number) {
  const t = model.segment_thresholds;
  if (p >= t.A) return segmentasi.find((s) => s.segment === 'A')!;
  if (p >= t.B) return segmentasi.find((s) => s.segment === 'B')!;
  if (p >= t.C) return segmentasi.find((s) => s.segment === 'C')!;
  return segmentasi.find((s) => s.segment === 'D')!;
}

/* Friendly labels for the contribution chart */
const FEATURE_LABELS: Record<string, string> = {
  Readiness_Score: 'Skor Kesiapan Usaha',
  Age_Started: 'Usia Saat Memulai',
  Exp_per_Age: 'Rasio Pengalaman',
  Initial_Capital: 'Modal Awal',
  Internet_Usage: 'Pemanfaatan Internet',
  Financial_Record_Keeping: 'Pembukuan Keuangan',
  Business_Plan: 'Rencana Bisnis',
  Professional_Advice: 'Nasihat Profesional',
  Marketing_Effort: 'Upaya Pemasaran',
  Industry_Experience: 'Pengalaman Industri',
  Partnership: 'Kemitraan',
  Parent_Business_Experience: 'Pengalaman Bisnis Keluarga',
  Age: 'Usia Pemilik',
  Education: 'Tingkat Pendidikan',
  Owner_Gender: 'Gender Pemilik',
};

export default function Predictor() {
  const [form, setForm] = useState<FormState>(DEFAULTS);

  const result = useMemo(() => predict(form), [form]);
  const segment = useMemo(() => segmentFor(result.proba), [result.proba]);
  const willSucceed = result.proba >= 0.5;

  const topContributions = useMemo(() => {
    return [...result.contributions]
      .sort((a, b) => Math.abs(b.value) - Math.abs(a.value))
      .slice(0, 5);
  }, [result.contributions]);
  const maxAbs = Math.max(...topContributions.map((c) => Math.abs(c.value)), 0.001);

  const set = (key: keyof FormState, value: number) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <SectionWrapper
      id="predictor"
      title="Coba Prediksi UMKM Baru"
      subtitle="Masukkan karakteristik sebuah UMKM, lalu model akan memperkirakan probabilitas keberhasilan dan segmennya secara langsung."
      badge="Prediksi Interaktif"
    >
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* ── INPUT FORM ── */}
        <div className="lg:col-span-3 glass-card p-6 sm:p-8">
          {/* Behavioral group */}
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-success-400" />
            <h3 className="text-base font-bold text-white">Praktik Usaha</h3>
            <span className="text-[11px] font-semibold text-success-400 uppercase tracking-wider">dapat diperbaiki</span>
          </div>
          <p className="text-xs text-surface-500 mb-5">Faktor yang paling menentukan menurut model.</p>

          {/* Toggles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            {TOGGLES.map((t) => {
              const on = form[t.key] === 1;
              return (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => set(t.key, on ? 0 : 1)}
                  className={`flex items-start justify-between gap-3 rounded-xl border px-4 py-3 text-left transition-all ${
                    on
                      ? 'border-success-500/40 bg-success-500/10'
                      : 'border-surface-700/60 bg-surface-800/40 hover:border-surface-600'
                  }`}
                >
                  <span>
                    <span className={`block text-sm font-semibold ${on ? 'text-success-300' : 'text-surface-300'}`}>{t.label}</span>
                    <span className="block text-[11px] text-surface-500 mt-0.5">{t.hint}</span>
                  </span>
                  <span
                    className={`mt-0.5 shrink-0 w-9 h-5 rounded-full p-0.5 transition-all ${on ? 'bg-success-500' : 'bg-surface-600'}`}
                  >
                    <span className={`block w-4 h-4 rounded-full bg-white transition-transform ${on ? 'translate-x-4' : ''}`} />
                  </span>
                </button>
              );
            })}
          </div>

          {/* Sliders */}
          <div className="space-y-5 mb-6">
            <SliderField
              label="Upaya Pemasaran" value={form.Marketing_Effort} min={1} max={7} suffix={` / 7`}
              onChange={(v) => set('Marketing_Effort', v)}
            />
            <SliderField
              label="Akses Nasihat Profesional" value={form.Professional_Advice} min={1} max={7} suffix={` / 7`}
              onChange={(v) => set('Professional_Advice', v)}
            />
            <SliderField
              label="Pengalaman Industri" value={form.Industry_Experience} min={0} max={20} suffix=" thn"
              onChange={(v) => set('Industry_Experience', v)}
            />
          </div>

          {/* Demographic group */}
          <div className="flex items-center gap-2 mb-1 pt-5 border-t border-surface-800">
            <span className="w-2 h-2 rounded-full bg-surface-500" />
            <h3 className="text-base font-bold text-white">Profil Pemilik</h3>
            <span className="text-[11px] font-semibold text-surface-500 uppercase tracking-wider">pengaruh kecil</span>
          </div>
          <p className="text-xs text-surface-500 mb-5">Faktor bawaan — model membuktikan ini hampir tidak menentukan.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <SliderField
              label="Usia Pemilik" value={form.Age} min={18} max={60} suffix=" thn"
              onChange={(v) => set('Age', v)}
            />
            <div>
              <label className="block text-sm font-semibold text-surface-300 mb-2">Tingkat Pendidikan</label>
              <select
                value={form.Education}
                onChange={(e) => set('Education', Number(e.target.value))}
                className="w-full rounded-xl border border-surface-700/60 bg-surface-800/60 px-3 py-2.5 text-sm text-surface-200 focus:border-brand-500 focus:outline-none"
              >
                {Object.entries(EDU_LABELS).map(([v, l]) => (
                  <option key={v} value={v}>{l}</option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-surface-300 mb-2">Gender Pemilik</label>
              <div className="grid grid-cols-2 gap-3">
                {[{ v: 1, l: 'Laki-laki' }, { v: 0, l: 'Perempuan' }].map((opt) => (
                  <button
                    key={opt.v}
                    type="button"
                    onClick={() => set('Owner_Gender', opt.v)}
                    className={`rounded-xl border px-4 py-2.5 text-sm font-medium transition-all ${
                      form.Owner_Gender === opt.v
                        ? 'border-brand-500/40 bg-brand-500/10 text-brand-300'
                        : 'border-surface-700/60 bg-surface-800/40 text-surface-400 hover:border-surface-600'
                    }`}
                  >
                    {opt.l}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setForm(DEFAULTS)}
            className="mt-6 text-xs font-medium text-surface-500 hover:text-brand-400 transition-colors"
          >
            ↺ Reset ke contoh
          </button>
        </div>

        {/* ── RESULT PANEL ── */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div
            className="glass-card p-6 sm:p-8 flex flex-col items-center text-center transition-all"
            style={{ borderColor: `${segment.color}55`, boxShadow: `0 0 32px ${segment.color}18` }}
          >
            <p className="text-xs uppercase tracking-widest text-surface-500 font-bold mb-4">Probabilitas Keberhasilan</p>

            {/* Gauge */}
            <Gauge value={result.proba} color={segment.color} />

            {/* Verdict */}
            <div className="mt-5">
              <span
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold border"
                style={{ color: segment.color, borderColor: `${segment.color}55`, backgroundColor: `${segment.color}14` }}
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: segment.color }} />
                {willSucceed ? 'Berpotensi Berhasil' : 'Berisiko / Perlu Pendampingan'}
              </span>
            </div>

            {/* Segment */}
            <div className="mt-6 w-full rounded-xl bg-surface-900/60 border border-surface-700/50 p-4">
              <div className="flex items-center justify-center gap-2 mb-1">
                <span className="text-2xl font-black" style={{ color: segment.color }}>Segmen {segment.segment}</span>
                <span className="text-sm font-semibold text-surface-300">{segment.label}</span>
              </div>
              <p className="text-xs text-surface-500">Rentang probabilitas {segment.probability_range}</p>
            </div>

            {/* Intervention */}
            <div className="mt-4 w-full text-left insight-box !mt-4 !py-3 !px-4">
              <p className="text-[11px] font-bold uppercase tracking-wider text-brand-400 mb-1">Rekomendasi Intervensi</p>
              <p className="text-xs text-surface-300 leading-relaxed">{segment.intervention}</p>
            </div>
          </div>

          {/* Contribution breakdown */}
          <div className="glass-card p-6">
            <h4 className="text-sm font-bold text-white mb-1">Faktor Paling Berpengaruh</h4>
            <p className="text-[11px] text-surface-500 mb-4">Kontribusi pada prediksi ini (hijau menaikkan, merah menurunkan).</p>
            <div className="space-y-2.5">
              {topContributions.map((c) => {
                const pct = (Math.abs(c.value) / maxAbs) * 100;
                const positive = c.value >= 0;
                return (
                  <div key={c.name}>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-surface-300">{FEATURE_LABELS[c.name] ?? c.name}</span>
                      <span className={positive ? 'text-success-400' : 'text-danger-400'}>
                        {positive ? '+' : '−'}{Math.abs(c.value).toFixed(2)}
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-surface-800 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${pct}%`, backgroundColor: positive ? 'var(--color-success-500)' : 'var(--color-danger-500)' }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

    </SectionWrapper>
  );
}

/* ── Slider sub-component ── */
function SliderField({
  label, value, min, max, suffix = '', onChange,
}: { label: string; value: number; min: number; max: number; suffix?: string; onChange: (v: number) => void }) {
  return (
    <div>
      <div className="flex justify-between items-baseline mb-2">
        <label className="text-sm font-semibold text-surface-300">{label}</label>
        <span className="text-sm font-bold text-brand-300 number-display">{value}{suffix}</span>
      </div>
      <input
        type="range" min={min} max={max} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-brand-500 cursor-pointer"
      />
    </div>
  );
}

/* ── Circular gauge ── */
function Gauge({ value, color }: { value: number; color: string }) {
  const pct = Math.round(value * 100);
  const r = 64;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - value);
  return (
    <div className="relative w-44 h-44">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
        <circle cx="80" cy="80" r={r} fill="none" stroke="rgba(148,163,184,0.12)" strokeWidth="12" />
        <circle
          cx="80" cy="80" r={r} fill="none" stroke={color} strokeWidth="12" strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.6s cubic-bezier(0.4,0,0.2,1), stroke 0.4s ease' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-black number-display" style={{ color }}>{pct}%</span>
        <span className="text-[11px] text-surface-500 font-medium uppercase tracking-wider mt-1">peluang sukses</span>
      </div>
    </div>
  );
}
