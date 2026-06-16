import SectionWrapper from './SectionWrapper';
import segmentasiData from '../data/segmentasi.json';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';

/* Mapping colors for Probability Badges */
const getBadgeColor = (segment: string) => {
  switch (segment) {
    case 'A': return 'bg-emerald-900 text-emerald-300 border-emerald-700'; // Dark green
    case 'B': return 'bg-teal-900 text-teal-300 border-teal-700';       // Teal / Light green
    case 'C': return 'bg-amber-900 text-amber-300 border-amber-700';     // Amber / Yellow
    case 'D': return 'bg-red-900 text-red-300 border-red-700';           // Red / Orange
    default: return 'bg-surface-800 text-surface-300 border-surface-700';
  }
};

/* Mapping border/accent colors for Cards */
const getAccentColor = (segment: string) => {
  switch (segment) {
    case 'A': return 'border-emerald-500 shadow-emerald-900/20';
    case 'B': return 'border-teal-500 shadow-teal-900/20';
    case 'C': return 'border-amber-500 shadow-amber-900/20';
    case 'D': return 'border-red-500 shadow-red-900/20';
    default: return 'border-surface-600 shadow-surface-900/20';
  }
};

/* Fallback data mapper */
const mapSegmentName = (segment: string, originalLabel: string) => {
  switch (segment) {
    case 'A': return 'Ready';
    case 'B': return 'Potential';
    case 'C': return 'Borderline';
    case 'D': return 'At-Risk';
    default: return originalLabel;
  }
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card p-3 text-sm min-w-[150px]">
      <p className="font-semibold text-surface-100 mb-1">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} className="text-surface-300">
          {p.name}: <span className="font-bold text-white">{p.value}{p.name.includes('%') || p.name.includes('Aktual') ? '%' : ''}</span>
        </p>
      ))}
    </div>
  );
};

export default function SegmentasiSection() {
  const chartData = segmentasiData.map(d => ({
    name: `Segmen ${d.segment}`,
    distribusi: d.percentage,
    sukses: d.success_rate,
    segment: d.segment
  }));

  return (
    <SectionWrapper
      id="segmentation"
      title="Segmentasi UMKM"
      subtitle="Analisis probabilitas keberhasilan untuk intervensi yang tepat sasaran."
      badge="Segmentasi"
    >
      {/* 4 Segment Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {segmentasiData.map((seg, idx) => (
          <div 
            key={seg.segment} 
            className={`glass-card p-5 border-t-4 transition-transform hover:-translate-y-1 ${getAccentColor(seg.segment)} flex flex-col h-full`}
            style={{ animationDelay: `${idx * 100}ms` }}
          >
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-2xl font-black text-white leading-none mb-1">{seg.segment}</h3>
                <p className="text-sm font-semibold text-surface-400 uppercase tracking-wider">{mapSegmentName(seg.segment, seg.label)}</p>
              </div>
              <div className={`px-2.5 py-1 text-xs font-bold rounded-full border ${getBadgeColor(seg.segment)}`}>
                {seg.segment === 'A' ? '>80%' : seg.segment === 'B' ? '50-80%' : seg.segment === 'C' ? '30-50%' : '<30%'}
              </div>
            </div>

            {/* Profile */}
            <p className="text-surface-300 text-sm mb-6 flex-grow">
              {seg.profile}
            </p>

            {/* Intervention */}
            <div className="mt-auto bg-surface-900/50 rounded-lg p-3 border border-surface-700/50">
              <p className="text-[10px] uppercase tracking-wider text-surface-500 font-bold mb-1">Rekomendasi Intervensi</p>
              <p className="text-xs text-surface-200 leading-relaxed">
                {seg.intervention}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Chart 1: Distribusi */}
        <div className="glass-card p-6 flex flex-col">
          <h3 className="text-lg font-bold text-white mb-6 text-center">Distribusi UMKM per Segmen</h3>
          <div className="h-64 mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148,163,184,0.1)" />
                <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                <Bar dataKey="distribusi" name="% Populasi" radius={[6, 6, 0, 0]} maxBarSize={60}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.segment === 'D' ? '#ef4444' : '#3b82f6'} fillOpacity={entry.segment === 'D' ? 0.9 : 0.6} />
                  ))}
                  <LabelList dataKey="distribusi" position="top" formatter={(val: any) => `${val}%`} fill="#cbd5e1" fontSize={11} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-auto pt-4 border-t border-surface-800">
            <p className="text-sm text-surface-300 italic">
              "Segmen D (At-Risk) mendominasi <span className="font-semibold text-red-400">72.8%</span> populasi, menegaskan urgensi intervensi dini."
            </p>
          </div>
        </div>

        {/* Chart 2: Sukses Aktual */}
        <div className="glass-card p-6 flex flex-col">
          <h3 className="text-lg font-bold text-white mb-6 text-center">% Sukses Aktual per Segmen</h3>
          <div className="h-64 mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148,163,184,0.1)" />
                <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 110]} tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                <Bar dataKey="sukses" name="% Sukses Aktual" radius={[6, 6, 0, 0]} maxBarSize={60}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.segment === 'A' ? '#10b981' : '#3b82f6'} fillOpacity={entry.segment === 'A' ? 0.9 : 0.6} />
                  ))}
                  <LabelList dataKey="sukses" position="top" formatter={(val: any) => `${val}%`} fill="#cbd5e1" fontSize={11} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-auto pt-4 border-t border-surface-800">
            <p className="text-sm text-surface-300 italic">
              "Segmen A mencapai <span className="font-semibold text-emerald-400">100%</span> keberhasilan aktual — membuktikan bahwa readiness tinggi adalah prediktor terkuat."
            </p>
          </div>
        </div>

      </div>
    </SectionWrapper>
  );
}
