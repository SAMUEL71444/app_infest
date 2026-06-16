import SectionWrapper from './SectionWrapper';
import rekomendasi from '../data/rekomendasi.json';

/* ── helpers ─────────────────────────────────────────────────── */

/** Format rank as zero-padded string */
function padRank(rank: number): string {
  return String(rank).padStart(2, '0');
}

/** Map SHAP importance to a percentage bar width (relative to highest) */
const maxShap = Math.max(...rekomendasi.map((r) => r.shap_importance));

/* ── component ───────────────────────────────────────────────── */

export default function Recommendations() {
  return (
    <SectionWrapper
      id="recommendations"
      title="Rekomendasi Aksi"
      subtitle="Top-5 faktor penentu keberhasilan beserta langkah konkret yang dapat diambil oleh pelaku dan pembina UMKM."
      badge="Kontribusi Utama"
    >
      {/* ── Intro Callout ──────────────────────────────────── */}
      <div className="insight-box insight-box-success animate-fade-in-up mb-10">
        <div className="mb-2 flex items-center gap-2">
          <svg className="w-5 h-5 text-success-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
          </svg>
          <span className="text-sm font-bold text-success-400">
            Temuan Utama
          </span>
        </div>
        <p className="text-sm leading-relaxed text-surface-300 md:text-base">
          <strong className="text-success-400">4 dari 5</strong> faktor penentu
          teratas adalah faktor yang{' '}
          <strong className="text-surface-100">DAPAT DIPERBAIKI</strong>. Ini
          berarti keberhasilan UMKM sangat bergantung pada persiapan dan praktik
          yang tepat — bukan pada faktor bawaan yang tidak bisa diubah.
        </p>
      </div>

      {/* ── Recommendation Cards ───────────────────────────── */}
      <div className="flex flex-col gap-6">
        {rekomendasi.map((item, idx) => (
          <div
            key={item.rank}
            className="highlight-card group"
            style={{ animationDelay: `${idx * 120}ms` }}
          >
            {/* Card Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-start gap-4 sm:gap-5">
                {/* Big rank number */}
                <span className="flex-shrink-0 select-none text-5xl sm:text-6xl font-black leading-none text-brand-500/10 transition-colors group-hover:text-brand-500/20">
                  {padRank(item.rank)}
                </span>

                <div className="min-w-0">
                  <h3 className="text-lg font-bold text-surface-100 sm:text-xl">
                    {item.label}
                  </h3>
                  <p className="mt-0.5 text-xs font-medium tracking-wide text-surface-500">
                    {item.factor}
                  </p>
                </div>
              </div>

              {/* Changeable badge */}
              {item.changeable ? (
                <span className="badge-changeable can-change flex-shrink-0">
                  ✓ Dapat Diperbaiki
                </span>
              ) : (
                <span className="badge-changeable inherent flex-shrink-0">
                  — Faktor Bawaan
                </span>
              )}
            </div>

            {/* SHAP importance indicator */}
            <div className="mt-4 flex items-center gap-3">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-surface-500">
                SHAP
              </span>
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-800">
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{
                    width: `${(item.shap_importance / maxShap) * 100}%`,
                    background: item.changeable
                      ? 'linear-gradient(90deg, #06b6d4, #10b981)'
                      : 'linear-gradient(90deg, #64748b, #94a3b8)',
                  }}
                />
              </div>
              <span className="font-mono text-xs font-bold text-surface-400">
                {item.shap_importance.toFixed(4)}
              </span>
            </div>

            {/* Description */}
            <p className="mt-5 text-sm leading-relaxed text-surface-400">
              {item.description}
            </p>

            {/* Action Box */}
            <div className="mt-5 rounded-xl border border-surface-700/40 bg-surface-800/50 p-4 sm:p-5">
              <div className="mb-2 flex items-center gap-2">
                <svg className="w-4 h-4 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 12h7.5m0 0l-3-3m3 3l-3 3M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h4 className="text-sm font-bold text-brand-400">
                  Aksi yang Disarankan
                </h4>
              </div>
              <p className="text-sm leading-relaxed text-surface-300">
                {item.action}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Bottom Emphasis ─────────────────────────────────── */}
      <div className="mt-12 text-center">
        <div className="mx-auto inline-block rounded-2xl border border-brand-500/20 bg-brand-500/5 px-8 py-5 backdrop-blur-sm">
          <p className="gradient-text text-lg font-extrabold sm:text-xl md:text-2xl">
            4/5 faktor = Dapat Diperbaiki
          </p>
          <p className="mt-2 text-sm text-surface-400">
            Persiapan yang matang adalah kunci keberhasilan UMKM — dan itu ada
            di tangan Anda.
          </p>
        </div>
      </div>
    </SectionWrapper>
  );
}
