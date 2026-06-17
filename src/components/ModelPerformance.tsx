import SectionWrapper from './SectionWrapper';
import top5Models from '../data/top5_model_pdf.json';
import metrik from '../data/metrik_unggulan.json';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts';

/* ──────────────────────────────────── Types ──────────────────────────────── */

interface TopModel {
  rank: number;
  name: string;
  full_name: string;
  accuracy: number;
  roc_auc: number;
  pr_auc: number;
  mcc: number;
  ours: boolean;
}

interface Metric {
  key: string;
  label: string;
  mean: number;
  std: number;
  format: string;
}

/* ──────────────────────────────── Helpers ────────────────────────────────── */

const formatValue = (value: number, format: string): string => {
  switch (format) {
    case 'percent':
      return `${(value * 100).toFixed(2)}%`;
    case 'decimal':
      return value.toFixed(4);
    case 'decimal_low':
      return value.toFixed(4);
    default:
      return value.toFixed(4);
  }
};

/* ─────────────────────────── Custom Chart Tooltip ────────────────────────── */

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload) return null;
  return (
    <div className="glass-card p-3 text-sm">
      <p className="font-semibold text-surface-100 mb-1">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color }}>{p.name}: {p.value.toFixed(4)}</p>
      ))}
    </div>
  );
};

/* ────────────────────── Custom Legend ────────────────────────────────────── */

const CustomLegend = ({ payload }: any) => {
  if (!payload) return null;
  return (
    <div className="flex items-center justify-center gap-6 mt-4">
      {payload.map((entry: any, i: number) => (
        <div key={i} className="flex items-center gap-2">
          <span
            className="w-3 h-3 rounded-sm"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-sm text-surface-300">{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

/* ──────────────────────────── Bar Chart Data ─────────────────────────────── */

const chartData = (top5Models as TopModel[]).map((m) => ({
  name: m.name,
  'ROC-AUC': m.roc_auc,
  MCC: m.mcc,
  ours: m.ours,
}));

/* ═══════════════════════════ Main Component ═══════════════════════════════ */

export default function ModelPerformance() {
  return (
    <SectionWrapper
      id="model-performance"
      title="Performa Model"
      subtitle="Perbandingan top-5 model dan metrik lengkap model unggulan."
      badge="Evaluasi Model"
    >
      {/* ─── 1. Top-5 Model Table ─────────────────────────────────────────── */}
      <div className="glass-card p-6 md:p-8 mb-8 animate-fade-in-up">
        <h3 className="text-xl font-bold text-surface-100 mb-1 flex items-center gap-3">
          <span className="w-8 h-8 rounded-lg bg-brand-500/15 flex items-center justify-center text-brand-400">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </span>
          Top-5 Model Klasifikasi
        </h3>
        <p className="text-surface-400 text-sm mb-6 ml-11">
          Peringkat berdasarkan ROC-AUC &amp; akurasi dari {metrik.total_configurations_tested.toLocaleString('id-ID')} konfigurasi
        </p>

        <div className="overflow-x-auto -mx-6 md:-mx-8 px-6 md:px-8">
          <table className="w-full text-sm table-fixed min-w-[640px]">
            <colgroup>
              <col className="w-14" />
              <col />
              <col className="w-28" />
              <col className="w-28" />
              <col className="w-28" />
              <col className="w-28" />
            </colgroup>
            <thead>
              <tr className="border-b border-surface-700/60">
                {[
                  { label: 'Rank', align: 'text-left' },
                  { label: 'Model Name', align: 'text-left' },
                  { label: 'Accuracy', align: 'text-right' },
                  { label: 'ROC-AUC', align: 'text-right' },
                  { label: 'MCC', align: 'text-right' },
                  { label: 'PR-AUC', align: 'text-right' },
                ].map((h) => (
                  <th
                    key={h.label}
                    className={`pb-3 ${h.align} font-semibold text-surface-400 uppercase tracking-wider text-xs whitespace-nowrap px-3 first:pl-0 last:pr-0`}
                  >
                    {h.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(top5Models as TopModel[]).map((m, idx) => (
                <tr
                  key={m.rank}
                  className={`border-b border-surface-800/40 transition-colors duration-200 hover:bg-surface-800/40 ${m.ours ? 'model-ours' : ''}`}
                  style={{ animationDelay: `${idx * 80}ms` }}
                >
                  {/* Rank */}
                  <td className="py-4 px-3 first:pl-0">
                    <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${
                      m.rank === 1
                        ? 'bg-brand-500/20 text-brand-300 ring-1 ring-brand-500/30'
                        : 'bg-surface-700/50 text-surface-400'
                    }`}>
                      {m.rank}
                    </span>
                  </td>

                  {/* Model Name */}
                  <td className="py-4 px-3 font-medium text-surface-100">
                    <div className="flex flex-wrap items-center gap-2">
                      {m.full_name}
                      {m.ours && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-brand-500/15 text-brand-400 border border-brand-500/25">
                          <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Model Kami
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Accuracy */}
                  <td className="py-4 px-3 text-right font-mono text-surface-200 tabular-nums">
                    {(m.accuracy * 100).toFixed(2)}%
                  </td>

                  {/* ROC-AUC */}
                  <td className="py-4 px-3 text-right font-mono tabular-nums">
                    <span className={m.ours ? 'text-brand-300 font-semibold' : 'text-surface-200'}>
                      {m.roc_auc.toFixed(4)}
                    </span>
                  </td>

                  {/* MCC */}
                  <td className="py-4 px-3 text-right font-mono tabular-nums">
                    <span className={m.ours ? 'text-success-400 font-semibold' : 'text-surface-200'}>
                      {m.mcc.toFixed(4)}
                    </span>
                  </td>

                  {/* PR-AUC */}
                  <td className="py-4 px-3 last:pr-0 text-right font-mono text-surface-200 tabular-nums">
                    {m.pr_auc.toFixed(4)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── 2. Bar Chart Comparison ──────────────────────────────────────── */}
      <div className="glass-card p-6 md:p-8 mb-8 animate-fade-in-up delay-200">
        <h3 className="text-xl font-bold text-surface-100 mb-1 flex items-center gap-3">
          <span className="w-8 h-8 rounded-lg bg-success-500/15 flex items-center justify-center text-success-400">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </span>
          Perbandingan ROC-AUC &amp; MCC
        </h3>
        <p className="text-surface-400 text-sm mb-8 ml-11">
          Grouped bar chart untuk 5 model teratas
        </p>

        <div className="w-full h-[360px] md:h-[420px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -10, bottom: 5 }}
              barCategoryGap="20%"
              barGap={4}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(148,163,184,0.08)"
                vertical={false}
              />
              <XAxis
                dataKey="name"
                tick={{ fill: '#94a3b8', fontSize: 12 }}
                axisLine={{ stroke: 'rgba(148,163,184,0.15)' }}
                tickLine={false}
              />
              <YAxis
                domain={[0.8, 1]}
                tick={{ fill: '#94a3b8', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v: number) => v.toFixed(2)}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(148,163,184,0.06)' }} />
              <Legend content={<CustomLegend />} />

              <Bar dataKey="ROC-AUC" radius={[6, 6, 0, 0]} maxBarSize={42}>
                {chartData.map((entry, i) => (
                  <Cell
                    key={`roc-${i}`}
                    fill={entry.ours ? '#06b6d4' : 'rgba(6,182,212,0.5)'}
                    stroke={entry.ours ? '#22d3ee' : 'transparent'}
                    strokeWidth={entry.ours ? 1 : 0}
                  />
                ))}
              </Bar>

              <Bar dataKey="MCC" radius={[6, 6, 0, 0]} maxBarSize={42}>
                {chartData.map((entry, i) => (
                  <Cell
                    key={`mcc-${i}`}
                    fill={entry.ours ? '#10b981' : 'rgba(16,185,129,0.5)'}
                    stroke={entry.ours ? '#34d399' : 'transparent'}
                    strokeWidth={entry.ours ? 1 : 0}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Insight Box */}
        <div className="insight-box mt-6">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 flex-shrink-0 text-brand-400">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
            <p className="text-sm text-surface-300 leading-relaxed">
              Model unggulan <span className="font-semibold text-brand-300">Oblivious Gradient-Boosted Tree + TVAE</span> mencapai ROC-AUC{' '}
              <span className="font-bold text-brand-300">0.993</span>, menunjukkan kemampuan diskriminasi yang sangat tinggi antara UMKM berhasil dan tidak berhasil.
            </p>
          </div>
        </div>
      </div>

      {/* ─── 3. Full Metrics Table ────────────────────────────────────────── */}
      <div className="glass-card p-6 md:p-8 animate-fade-in-up delay-400">
        <h3 className="text-xl font-bold text-surface-100 mb-1 flex items-center gap-3">
          <span className="w-8 h-8 rounded-lg bg-brand-500/15 flex items-center justify-center text-brand-400">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </span>
          Metrik Lengkap Model Unggulan
        </h3>
        <p className="text-surface-400 text-sm mb-6 ml-11">
          {metrik.model_short} — {metrik.cv_strategy}
        </p>

        <div className="overflow-x-auto -mx-6 md:-mx-8 px-6 md:px-8">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-700/60">
                {['Metrik', 'Nilai (Mean)', 'Std Dev'].map((h) => (
                  <th
                    key={h}
                    className="pb-3 text-left font-semibold text-surface-400 uppercase tracking-wider text-xs whitespace-nowrap px-3 first:pl-0 last:pr-0"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(metrik.metrics as Metric[]).map((m, idx) => (
                <tr
                  key={m.key}
                  className="border-b border-surface-800/40 transition-colors duration-200 hover:bg-surface-800/40"
                  style={{ animationDelay: `${idx * 60}ms` }}
                >
                  <td className="py-3.5 px-3 first:pl-0 text-surface-200 font-medium">
                    {m.label}
                  </td>
                  <td className="py-3.5 px-3 font-mono tabular-nums">
                    <span className={
                      m.key === 'roc_auc'
                        ? 'text-brand-300 font-semibold'
                        : m.key === 'log_loss'
                          ? 'text-warning-400'
                          : 'text-surface-100'
                    }>
                      {formatValue(m.mean, m.format)}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 last:pr-0 font-mono text-surface-400 tabular-nums">
                    ± {m.std.toFixed(4)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </SectionWrapper>
  );
}
