import SectionWrapper from './SectionWrapper';
import data from '../data/top_umkm.json';
import segmentasi from '../data/segmentasi.json';

/* ──────────────────────────────────────────────────────────────
   Top-N UMKM ranked by the model's predicted success probability
   (precomputed in scripts/rank_umkm.py from umkm_success.csv using
   the same logistic-regression coefficients as the live predictor).
   ────────────────────────────────────────────────────────────── */

const segMeta = (seg: string) => segmentasi.find((s) => s.segment === seg)!;

const ages = data.top.map((t) => t.age);
const minAge = Math.min(...ages);
const maxAge = Math.max(...ages);

export default function TopUMKM() {
  return (
    <SectionWrapper
      id="top-umkm"
      title="Top-5 UMKM Berpeluang Sukses"
      subtitle="Lima UMKM dengan probabilitas keberhasilan tertinggi menurut model, dipilih dari seluruh dataset."
      badge="Peringkat Model"
    >
      <div className="flex flex-col gap-4">
        {data.top.map((u, idx) => {
          const seg = segMeta(u.segment);
          const isFirst = idx === 0;
          return (
            <div
              key={u.id}
              className="glass-card p-5 sm:p-6 animate-fade-in-up"
              style={{
                animationDelay: `${idx * 90}ms`,
                ...(isFirst ? { borderColor: `${seg.color}55`, boxShadow: `0 0 28px ${seg.color}18` } : {}),
              }}
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                {/* Rank */}
                <div className="flex items-center gap-4 sm:w-44 shrink-0">
                  <span
                    className={`flex items-center justify-center w-11 h-11 rounded-full font-black text-lg shrink-0 ${
                      isFirst
                        ? 'bg-gradient-to-br from-brand-400 to-success-500 text-white shadow-lg'
                        : 'bg-surface-800 text-surface-300 ring-1 ring-surface-700'
                    }`}
                  >
                    {u.rank}
                  </span>
                  <div>
                    <p className="font-bold text-surface-100 number-display">{u.id}</p>
                    <p className="text-[11px] text-surface-500">Readiness {u.readiness_score}/4</p>
                  </div>
                </div>

                {/* Profile chips */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2.5 text-[11px] text-surface-400">
                    <span className="rounded-md bg-surface-800/70 px-2 py-1">{u.age} thn</span>
                    <span className="rounded-md bg-surface-800/70 px-2 py-1">{u.education_label}</span>
                    <span className="rounded-md bg-surface-800/70 px-2 py-1">{u.industry_experience} thn pengalaman</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {u.practices.map((p) => (
                      <span
                        key={p}
                        className="inline-flex items-center gap-1 rounded-full border border-success-500/25 bg-success-500/10 px-2.5 py-0.5 text-[11px] font-medium text-success-300"
                      >
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                        {p}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Probability + verdict */}
                <div className="flex sm:flex-col items-center sm:items-end gap-3 sm:gap-1.5 sm:w-40 shrink-0 sm:text-right">
                  <span className="text-3xl font-black number-display" style={{ color: seg.color }}>
                    {(u.probability * 100).toFixed(1)}%
                  </span>
                  <div className="flex flex-wrap gap-1.5 sm:justify-end">
                    <span
                      className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold"
                      style={{ color: seg.color, borderColor: `${seg.color}55`, backgroundColor: `${seg.color}14` }}
                    >
                      Segmen {u.segment}
                    </span>
                    {u.success_actual === 1 && (
                      <span className="inline-flex items-center gap-1 rounded-full border border-success-500/30 bg-success-500/10 px-2 py-0.5 text-[10px] font-bold text-success-300">
                        <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Sukses Aktual
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Insight */}
      <div className="insight-box insight-box-success mt-8">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-success-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm text-surface-300 leading-relaxed">
            <span className="font-semibold text-success-300">Bukti "praktik &gt; profil":</span>{' '}
            <span className="font-bold text-white">{data.actual_success_in_top} dari {data.top_n}</span> UMKM teratas
            benar-benar berhasil di data aktual. Semuanya memiliki{' '}
            <span className="font-bold text-white">Readiness Score 4/4</span> — meski usianya tersebar dari{' '}
            <span className="font-bold text-white">{minAge}</span> hingga <span className="font-bold text-white">{maxAge}</span> tahun
            dan pendidikan dari SD sampai S2/S3. Kesiapan usaha (yang dapat diperbaiki) jauh lebih menentukan daripada faktor bawaan.
          </p>
        </div>
      </div>
    </SectionWrapper>
  );
}
