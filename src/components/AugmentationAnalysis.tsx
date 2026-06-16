import SectionWrapper from './SectionWrapper';
import modelResults from '../data/model_results.json';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine, ErrorBar } from 'recharts';

/* ── Chart data ── */
const augData = modelResults.augmentation_effect.map(d => ({
  name: d.label,
  roc_auc: Math.round(d.roc_auc_mean * 10000) / 10000,
  std: Math.round(d.roc_auc_std * 10000) / 10000,
  method: d.method,
}));

/* ── Bar color logic ── */
function getBarColor(method: string): string {
  if (method === 'TVAE') return '#06b6d4';          // brand-500
  if (method === 'No Augmentation') return '#10b981'; // success-500
  return '#64748b';                                   // surface-500
}

/* ── Custom tooltip ── */
const ChartTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="rounded-xl border border-surface-700/60 bg-surface-900/95 backdrop-blur-md px-4 py-3 shadow-xl min-w-[200px]">
      <p className="text-xs font-semibold text-surface-300 mb-2">{label}</p>
      <p className="text-sm text-surface-400">
        ROC-AUC: <span className="font-bold text-white">{d.roc_auc.toFixed(4)}</span>
      </p>
      <p className="text-sm text-surface-400">
        Std: <span className="font-bold text-surface-300">± {d.std.toFixed(4)}</span>
      </p>
    </div>
  );
};

/* ── Custom bar shape with error bar lines ── */
const ErrorBarShape = (props: any) => {
  const { x, y, width, payload } = props;
  if (!payload || !payload.std) return null;
  const centerX = x + width / 2;
  const errorPixels = payload.std * 8000; // scale for visibility
  const capWidth = 6;
  return (
    <g>
      {/* Vertical line */}
      <line x1={centerX} y1={y - errorPixels} x2={centerX} y2={y + errorPixels} stroke="#94a3b8" strokeWidth={1.5} />
      {/* Top cap */}
      <line x1={centerX - capWidth} y1={y - errorPixels} x2={centerX + capWidth} y2={y - errorPixels} stroke="#94a3b8" strokeWidth={1.5} />
      {/* Bottom cap */}
      <line x1={centerX - capWidth} y1={y + errorPixels} x2={centerX + capWidth} y2={y + errorPixels} stroke="#94a3b8" strokeWidth={1.5} />
    </g>
  );
};

export default function AugmentationAnalysis() {
  return (
    <SectionWrapper
      id="augmentation"
      title="Analisis Augmentasi"
      subtitle="Evaluasi jujur terhadap efek augmentasi data — transparansi metodologis sebagai prinsip riset."
      badge="Kejujuran Metodologis"
    >
      {/* ── Bar Chart ── */}
      <div className="glass-card p-6 mb-8">
        <h3 className="text-base font-bold text-white mb-1">Efek Metode Augmentasi terhadap ROC-AUC</h3>
        <p className="text-xs text-surface-500 mb-5">Perbandingan ROC-AUC (mean ± std) dari berbagai metode augmentasi data</p>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={augData} margin={{ top: 20, right: 20, left: 8, bottom: 4 }} barCategoryGap="20%">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.08)" vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                interval={0}
                angle={-15}
                textAnchor="end"
                height={60}
              />
              <YAxis
                tick={{ fill: '#94a3b8', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                domain={[0.985, 0.998]}
                tickFormatter={(v: number) => v.toFixed(3)}
              />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(148,163,184,0.06)' }} />
              <ReferenceLine
                y={augData.find(d => d.method === 'No Augmentation')?.roc_auc}
                stroke="#10b981"
                strokeDasharray="6 4"
                strokeWidth={1.5}
                label={{ value: 'No Augmentation Baseline', position: 'insideTopRight', fill: '#10b981', fontSize: 11 }}
              />
              <Bar dataKey="roc_auc" name="ROC-AUC" radius={[8, 8, 0, 0]} maxBarSize={52}>
                {augData.map((entry, i) => (
                  <Cell key={i} fill={getBarColor(entry.method)} fillOpacity={0.85} />
                ))}
                <ErrorBar dataKey="std" width={6} strokeWidth={1.5} stroke="#94a3b8" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-5 mt-4 px-2">
          <div className="flex items-center gap-2 text-xs text-surface-400">
            <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#06b6d4' }} />
            TVAE (Dipilih)
          </div>
          <div className="flex items-center gap-2 text-xs text-surface-400">
            <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#10b981' }} />
            Tanpa Augmentasi
          </div>
          <div className="flex items-center gap-2 text-xs text-surface-400">
            <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#64748b' }} />
            Metode Lainnya
          </div>
        </div>
      </div>

      {/* ── Honesty Narrative (Warning) ── */}
      <div className="insight-box insight-box-warning mb-6">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-warning-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <div>
            <p className="text-sm font-semibold text-warning-400 mb-1">Temuan Utama — Transparansi Metodologis</p>
            <p className="text-sm text-surface-300 leading-relaxed">{modelResults.key_finding}</p>
          </div>
        </div>
      </div>

      {/* ── Honesty Note ── */}
      <div className="insight-box mb-6">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-brand-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="text-sm font-semibold text-brand-400 mb-1">Catatan Tambahan</p>
            <p className="text-sm text-surface-300 leading-relaxed">{modelResults.honesty_note}</p>
          </div>
        </div>
      </div>

      {/* ── Small Insight ── */}
      <div className="glass-card p-5">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-brand-500/10 border border-brand-500/20 flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <p className="text-sm text-surface-300 leading-relaxed">
            <span className="font-semibold text-brand-300">Mengapa TVAE?</span>{' '}
            TVAE dipilih bukan karena performa lebih tinggi, melainkan untuk memberikan{' '}
            <span className="font-semibold text-white">robustness</span> terhadap class imbalance — sebuah keputusan
            yang mengutamakan <span className="font-semibold text-white">reliabilitas model</span>.
          </p>
        </div>
      </div>
    </SectionWrapper>
  );
}
