import SectionWrapper from './SectionWrapper';
import segmentasi from '../data/segmentasi.json';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';

/* ── Recharts custom tooltip ── */
const ChartTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-surface-700/60 bg-surface-900/95 backdrop-blur-md px-4 py-3 shadow-xl">
      <p className="text-xs font-semibold text-surface-300 mb-1.5">Segmen {label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} className="text-sm" style={{ color: p.color }}>
          <span className="text-surface-400">{p.name}: </span>
          <span className="font-bold">{typeof p.value === 'number' && p.value < 10 ? p.value : p.value}{p.name.includes('%') || p.name.includes('Keberhasilan') ? '%' : ''}</span>
        </p>
      ))}
    </div>
  );
};

/* ── Chart data ── */
const countData = segmentasi.map(s => ({ name: `Segmen ${s.segment}`, value: s.count, color: s.color }));
const successData = segmentasi.map(s => ({ name: `Segmen ${s.segment}`, value: s.success_rate, color: s.color }));
const avgSuccess = segmentasi.reduce((sum, s) => sum + s.success_rate * s.count, 0) / segmentasi.reduce((sum, s) => sum + s.count, 0);

export default function Segmentation() {
  return (
    <SectionWrapper
      id="segmentation"
      title="Segmentasi UMKM"
      subtitle="Empat segmen UMKM berdasarkan probabilitas keberhasilan dan karakteristiknya."
      badge="Analisis Segmen"
    >
      {/* ── Segment Cards Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-12">
        {segmentasi.map((seg, idx) => (
          <div
            key={seg.segment}
            className="glass-card p-6 group"
            style={{ animationDelay: `${idx * 80}ms` }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <span
                className="w-3.5 h-3.5 rounded-full ring-4 ring-opacity-20 flex-shrink-0"
                style={{ backgroundColor: seg.color, boxShadow: `0 0 12px ${seg.color}40`, ringColor: seg.color }}
              />
              <div>
                <span className="text-xl font-extrabold text-white">Segmen {seg.segment}</span>
                <span
                  className="ml-2 text-sm font-semibold"
                  style={{ color: seg.color }}
                >
                  {seg.label}
                </span>
              </div>
            </div>

            {/* Profile */}
            <p className="text-sm text-surface-400 leading-relaxed mb-5">{seg.profile}</p>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3 mb-5">
              <div className="rounded-xl bg-surface-800/60 px-3 py-2.5 text-center">
                <p className="text-[11px] uppercase tracking-wider text-surface-500 mb-1">Jumlah UMKM</p>
                <p className="text-lg font-bold text-white number-display">{seg.count}</p>
              </div>
              <div className="rounded-xl bg-surface-800/60 px-3 py-2.5 text-center">
                <p className="text-[11px] uppercase tracking-wider text-surface-500 mb-1">% dari Total</p>
                <p className="text-lg font-bold text-white number-display">{seg.percentage}%</p>
              </div>
              <div className="rounded-xl bg-surface-800/60 px-3 py-2.5 text-center">
                <p className="text-[11px] uppercase tracking-wider text-surface-500 mb-1">% Sukses</p>
                <p className="text-lg font-bold number-display" style={{ color: seg.color }}>{seg.success_rate}%</p>
              </div>
            </div>

            {/* Probability range */}
            <div className="flex items-center gap-2 mb-4 text-xs text-surface-400">
              <svg className="w-4 h-4 text-surface-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <span>Rentang Probabilitas: <span className="font-semibold text-surface-300">{seg.probability_range}</span></span>
            </div>

            {/* Intervention */}
            <div className="insight-box !mt-0 !py-3 !px-4">
              <p className="text-xs font-semibold text-brand-400 uppercase tracking-wider mb-1">Rekomendasi Intervensi</p>
              <p className="text-sm text-surface-300 leading-relaxed">{seg.intervention}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Charts Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Chart A: Jumlah UMKM per Segmen */}
        <div className="glass-card p-6">
          <h3 className="text-base font-bold text-white mb-1">Jumlah UMKM per Segmen</h3>
          <p className="text-xs text-surface-500 mb-5">Distribusi jumlah UMKM di setiap segmen</p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={countData} margin={{ top: 8, right: 12, left: -8, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.08)" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(148,163,184,0.06)' }} />
                <Bar dataKey="value" name="Jumlah UMKM" radius={[8, 8, 0, 0]} maxBarSize={56}>
                  {countData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} fillOpacity={0.85} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart B: Tingkat Keberhasilan per Segmen */}
        <div className="glass-card p-6">
          <h3 className="text-base font-bold text-white mb-1">Tingkat Keberhasilan per Segmen</h3>
          <p className="text-xs text-surface-500 mb-5">Success rate (%) untuk setiap segmen</p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={successData} margin={{ top: 8, right: 12, left: -8, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.08)" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} domain={[0, 110]} />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(148,163,184,0.06)' }} />
                <ReferenceLine
                  y={Math.round(avgSuccess * 10) / 10}
                  stroke="#64748b"
                  strokeDasharray="6 4"
                  label={{ value: `Rata-rata ${(Math.round(avgSuccess * 10) / 10)}%`, position: 'right', fill: '#94a3b8', fontSize: 11 }}
                />
                <Bar dataKey="value" name="Tingkat Keberhasilan" radius={[8, 8, 0, 0]} maxBarSize={56}>
                  {successData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} fillOpacity={0.85} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ── Summary Insight ── */}
      <div className="insight-box">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-brand-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm text-surface-300 leading-relaxed">
            <span className="font-semibold text-brand-300">Temuan Kunci:</span>{' '}
            Segmen D (At-Risk) mendominasi dengan <span className="font-bold text-white">72.8%</span> dari total UMKM,
            sementara Segmen A (Ready &amp; Thriving) yang hanya <span className="font-bold text-white">17.6%</span> mencapai{' '}
            <span className="font-bold text-white">100%</span> tingkat keberhasilan. Ini menunjukkan perlunya program intervensi
            masif untuk mayoritas UMKM.
          </p>
        </div>
      </div>
    </SectionWrapper>
  );
}
