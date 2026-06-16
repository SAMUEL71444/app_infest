import SectionWrapper from './SectionWrapper';
import shapData from '../data/shap_importance.json';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

/* ── helpers ─────────────────────────────────────────────────── */

/** Sort descending by importance */
const sortedData = [...shapData].sort((a, b) => b.importance - a.importance);

/** Color palette — teal gradient for behavioral, gray for demographic, red for gender */
function getBarColor(feature: string, index: number): string {
  if (feature === 'Owner_Gender') return '#ef4444';
  if (feature === 'Education_Level' || feature === 'Owner_Age') return '#64748b';
  // Behavioral: gradient from bright teal to muted teal based on rank
  const tealShades = [
    '#06b6d4', // Readiness_Score (brightest)
    '#0ea5e9',
    '#0891b2',
    '#0e7490',
    '#0d9488',
    '#14b8a6',
    '#2dd4bf',
  ];
  return tealShades[Math.min(index, tealShades.length - 1)];
}

/* ── custom tooltip ──────────────────────────────────────────── */

interface TooltipPayloadItem {
  value: number;
  payload: {
    label: string;
    feature: string;
    importance: number;
    category: string;
  };
}

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: TooltipPayloadItem[];
}) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;

  const categoryLabel: Record<string, string> = {
    behavioral: 'Faktor Perilaku',
    demographic: 'Faktor Demografi',
  };

  return (
    <div className="rounded-xl border border-surface-700/60 bg-surface-900/95 px-4 py-3 shadow-xl backdrop-blur-md">
      <p className="mb-1 text-sm font-semibold text-surface-100">{d.label}</p>
      <p className="text-xs text-surface-400">{d.feature}</p>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-lg font-bold text-brand-400">
          {d.importance.toFixed(4)}
        </span>
        <span className="text-xs text-surface-500">SHAP importance</span>
      </div>
      <span
        className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
          d.category === 'behavioral'
            ? 'bg-brand-500/15 text-brand-400'
            : 'bg-surface-600/20 text-surface-400'
        }`}
      >
        {categoryLabel[d.category] ?? d.category}
      </span>
    </div>
  );
}

/* ── component ───────────────────────────────────────────────── */

export default function ShapImportance() {
  return (
    <SectionWrapper
      id="shap"
      title="Faktor Penentu Keberhasilan"
      subtitle="Analisis SHAP feature importance mengungkap faktor-faktor yang benar-benar menentukan keberhasilan UMKM."
      badge="SHAP Analysis"
    >
      {/* ── Horizontal Bar Chart ────────────────────────────── */}
      <div className="glass-card p-6 md:p-8">
        <div className="mb-4 flex items-center gap-3">
          <h3 className="text-lg font-bold text-surface-100">
            SHAP Feature Importance
          </h3>
          <span className="rounded-full bg-brand-500/10 border border-brand-500/20 px-3 py-0.5 text-[10px] font-semibold tracking-wider uppercase text-brand-400">
            Mean |SHAP|
          </span>
        </div>

        {/* Legend */}
        <div className="mb-6 flex flex-wrap gap-4 text-xs text-surface-400">
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ background: '#06b6d4' }} />
            Faktor Perilaku
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ background: '#64748b' }} />
            Faktor Demografi
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ background: '#ef4444' }} />
            Gender (Fairness)
          </span>
        </div>

        <div className="h-[420px] w-full md:h-[480px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={sortedData}
              layout="vertical"
              margin={{ top: 8, right: 32, bottom: 8, left: 8 }}
              barCategoryGap="20%"
            >
              <CartesianGrid
                horizontal={false}
                strokeDasharray="3 3"
                stroke="rgba(148,163,184,0.08)"
              />
              <XAxis
                type="number"
                tick={{ fill: '#94a3b8', fontSize: 12 }}
                axisLine={{ stroke: 'rgba(148,163,184,0.15)' }}
                tickLine={false}
              />
              <YAxis
                dataKey="label"
                type="category"
                width={180}
                tick={{ fill: '#e2e8f0', fontSize: 13 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: 'rgba(6,182,212,0.06)' }}
              />
              <Bar
                dataKey="importance"
                radius={[0, 6, 6, 0]}
                maxBarSize={28}
                animationDuration={1200}
                animationEasing="ease-out"
              >
                {sortedData.map((entry, idx) => (
                  <Cell
                    key={entry.feature}
                    fill={getBarColor(entry.feature, idx)}
                    style={{
                      filter:
                        entry.feature === 'Readiness_Score'
                          ? 'drop-shadow(0 0 6px rgba(6,182,212,0.4))'
                          : undefined,
                    }}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Insight Callouts ────────────────────────────────── */}
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {/* Success insight */}
        <div className="insight-box insight-box-success">
          <div className="mb-2 flex items-center gap-2">
            <svg className="w-5 h-5 text-success-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0" />
            </svg>
            <span className="text-sm font-bold text-success-400">
              Temuan Utama
            </span>
          </div>
          <p className="text-sm leading-relaxed text-surface-300">
            <strong className="text-success-400">Readiness Score</strong>{' '}
            (Skor Kesiapan Usaha) adalah faktor paling dominan dengan SHAP
            importance{' '}
            <span className="font-mono font-bold text-success-400">~3.70</span>{' '}
            — hampir{' '}
            <span className="font-bold text-surface-100">3× lipat</span> faktor
            terpenting kedua. Ini menunjukkan bahwa kesiapan usaha adalah
            prediktor utama keberhasilan.
          </p>
        </div>

        {/* Warning insight */}
        <div className="insight-box insight-box-warning">
          <div className="mb-2 flex items-center gap-2">
            <svg className="w-5 h-5 text-warning-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0012 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 01-2.031.352 5.988 5.988 0 01-2.031-.352c-.483-.174-.711-.703-.589-1.202L18.75 4.971zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 01-2.031.352 5.989 5.989 0 01-2.031-.352c-.483-.174-.711-.703-.589-1.202L5.25 4.971z" />
            </svg>
            <span className="text-sm font-bold text-warning-400">
              Fairness Finding
            </span>
          </div>
          <p className="text-sm leading-relaxed text-surface-300">
            <strong className="text-warning-400">Owner Gender</strong> memiliki
            importance mendekati 0{' '}
            <span className="font-mono font-bold text-warning-400">
              (0.011)
            </span>
            . Ini adalah temuan fairness yang penting: model tidak diskriminatif
            terhadap gender. Keberhasilan UMKM benar-benar ditentukan oleh
            praktik, bukan demografi.
          </p>
        </div>
      </div>

      {/* ── Core Message ───────────────────────────────────── */}
      <div className="mt-12 text-center">
        <p className="gradient-text text-2xl font-extrabold leading-snug sm:text-3xl md:text-4xl">
          Keberhasilan = Apa yang Anda LAKUKAN,
          <br className="hidden sm:block" /> bukan siapa Anda
        </p>
        <p className="mx-auto mt-3 max-w-xl text-sm text-surface-500">
          Data membuktikan: faktor perilaku dan persiapan jauh lebih menentukan
          daripada faktor demografis seperti usia atau gender.
        </p>
      </div>
    </SectionWrapper>
  );
}
