import SectionWrapper from './SectionWrapper';
import liftGains from '../data/lift_gains.json';
import { BarChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine, Area, ComposedChart } from 'recharts';

/* ── Lift chart data ── */
const liftData = liftGains.lift_data.map(d => ({
  decile: `D${d.decile}`,
  lift: d.lift,
}));

/* ── Gains chart data — include origin point for proper line ── */
const gainsData = [
  { decile: '0%', model: 0, random: 0 },
  ...liftGains.lift_data.map(d => ({
    decile: `${d.decile * 10}%`,
    model: d.cumulative_gain_model,
    random: d.cumulative_gain_random,
  })),
];

/* ── Custom tooltips ── */
const LiftTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-surface-700/60 bg-surface-900/95 backdrop-blur-md px-4 py-3 shadow-xl">
      <p className="text-xs font-semibold text-surface-300 mb-1.5">Decile {label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} className="text-sm">
          <span className="text-surface-400">{p.name}: </span>
          <span className="font-bold" style={{ color: p.color }}>{p.value.toFixed(2)}×</span>
        </p>
      ))}
    </div>
  );
};

const GainsTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-surface-700/60 bg-surface-900/95 backdrop-blur-md px-4 py-3 shadow-xl">
      <p className="text-xs font-semibold text-surface-300 mb-1.5">Populasi: {label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} className="text-sm">
          <span className="text-surface-400">{p.name}: </span>
          <span className="font-bold" style={{ color: p.color }}>{p.value.toFixed(1)}%</span>
        </p>
      ))}
    </div>
  );
};

/* ── Quick-stat items from data ── */
const quickStats = [
  { label: 'Top-20% Capture', value: `${liftGains.top_20_capture}%`, icon: '🎯' },
  { label: 'vs Random', value: `${liftGains.random_20_capture}%`, icon: '🎲' },
  { label: 'Improvement Factor', value: `${liftGains.improvement_factor}×`, icon: '⚡' },
];

export default function LiftGains() {
  return (
    <SectionWrapper
      id="lift-gains"
      title="Nilai Praktis Model"
      subtitle="Lift dan Cumulative Gains menunjukkan efektivitas model dalam mengarahkan sumber daya ke UMKM dengan potensi tertinggi."
      badge="Lift & Gains"
    >
      {/* ── Charts Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Lift per Decile */}
        <div className="glass-card p-6">
          <h3 className="text-base font-bold text-white mb-1">Lift per Decile</h3>
          <p className="text-xs text-surface-500 mb-5">Peningkatan performa model dibandingkan baseline per decile</p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={liftData} margin={{ top: 8, right: 12, left: -8, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.08)" vertical={false} />
                <XAxis dataKey="decile" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} domain={[0, 'auto']} />
                <Tooltip content={<LiftTooltip />} cursor={{ fill: 'rgba(148,163,184,0.06)' }} />
                <ReferenceLine
                  y={1.0}
                  stroke="#f59e0b"
                  strokeDasharray="6 4"
                  strokeWidth={1.5}
                  label={{ value: 'Baseline (1.0)', position: 'right', fill: '#f59e0b', fontSize: 11 }}
                />
                <Bar dataKey="lift" name="Lift" radius={[8, 8, 0, 0]} maxBarSize={48} fill="#06b6d4" fillOpacity={0.85} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Cumulative Gains */}
        <div className="glass-card p-6">
          <h3 className="text-base font-bold text-white mb-1">Cumulative Gains</h3>
          <p className="text-xs text-surface-500 mb-5">Perbandingan capture rate model vs seleksi acak</p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={gainsData} margin={{ top: 8, right: 12, left: -8, bottom: 4 }}>
                <defs>
                  <linearGradient id="gainsArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.15} />
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.08)" vertical={false} />
                <XAxis dataKey="decile" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} domain={[0, 105]} unit="%" />
                <Tooltip content={<GainsTooltip />} />
                <Legend
                  verticalAlign="top"
                  align="right"
                  wrapperStyle={{ paddingBottom: 12, fontSize: 12 }}
                  formatter={(val: string) => <span className="text-surface-400 text-xs">{val}</span>}
                />
                <Area type="monotone" dataKey="model" stroke="none" fill="url(#gainsArea)" name="Area Model" legendType="none" />
                <Line
                  type="monotone"
                  dataKey="model"
                  name="Model"
                  stroke="#06b6d4"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#06b6d4', strokeWidth: 0 }}
                  activeDot={{ r: 6, fill: '#06b6d4', stroke: '#0f172a', strokeWidth: 2 }}
                />
                <Line
                  type="monotone"
                  dataKey="random"
                  name="Random Baseline"
                  stroke="#64748b"
                  strokeWidth={2}
                  strokeDasharray="8 4"
                  dot={false}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ── Quick Stats Row ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {quickStats.map((stat, idx) => (
          <div
            key={stat.label}
            className="glass-card px-5 py-4 flex items-center gap-4 group"
            style={{ animationDelay: `${idx * 80}ms` }}
          >
            <span className="text-2xl">{stat.icon}</span>
            <div>
              <p className="text-[11px] uppercase tracking-wider text-surface-500">{stat.label}</p>
              <p className="text-2xl font-extrabold text-white number-display">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Key Insight ── */}
      <div className="insight-box insight-box-success">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-success-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm text-surface-300 leading-relaxed">
            <span className="font-semibold text-success-300">Nilai Praktis Model:</span>{' '}
            Dengan menargetkan hanya <span className="font-bold text-white">20%</span> populasi teratas berdasarkan prediksi model,
            kita dapat menangkap <span className="font-bold text-white">~81%</span> UMKM yang berpotensi berhasil — dibandingkan
            hanya <span className="font-bold text-white">20%</span> jika memilih secara acak. Peningkatan{' '}
            <span className="font-bold text-white">4× lipat</span> ini menunjukkan nilai praktis model yang sangat signifikan.
          </p>
        </div>
      </div>
    </SectionWrapper>
  );
}
