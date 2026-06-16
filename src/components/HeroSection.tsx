import { useEffect, useState } from 'react';
import Tilt from 'react-parallax-tilt';
import metrik from '../data/metrik_unggulan.json';

const kpiData = [
  {
    label: 'ROC-AUC',
    value: metrik.metrics[1].mean.toFixed(3),
    description: 'Area Under ROC Curve',
    accent: 'from-brand-400 to-cyan-400',
    glow: 'shadow-brand-500/30',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
      </svg>
    ),
  },
  {
    label: 'Accuracy',
    value: `${(metrik.metrics[0].mean * 100).toFixed(1)}%`,
    description: 'Ketepatan Klasifikasi',
    accent: 'from-success-400 to-emerald-400',
    glow: 'shadow-success-500/30',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    label: 'MCC',
    value: metrik.metrics[3].mean.toFixed(3),
    description: "Matthew's Correlation",
    accent: 'from-violet-400 to-purple-400',
    glow: 'shadow-violet-500/30',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5" />
      </svg>
    ),
  },
  {
    label: 'PR-AUC',
    value: metrik.metrics[2].mean.toFixed(3),
    description: 'Precision-Recall AUC',
    accent: 'from-pink-400 to-rose-400',
    glow: 'shadow-pink-500/30',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
  },
  {
    label: 'Konfigurasi',
    value: metrik.total_configurations_tested.toLocaleString('id-ID'),
    description: 'Total Eksperimen Diuji',
    accent: 'from-amber-400 to-orange-400',
    glow: 'shadow-amber-500/30',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
      </svg>
    ),
  },
];

/* Floating orb config for 3D hero background */
const ORBS = [
  { w: 480, h: 480, top: '8%',  left: '10%', color: 'rgba(6,182,212,0.07)',  blur: 120, delay: '0s',   dur: '18s' },
  { w: 380, h: 380, top: '55%', left: '65%', color: 'rgba(16,185,129,0.06)', blur: 100, delay: '3s',   dur: '22s' },
  { w: 300, h: 300, top: '20%', left: '70%', color: 'rgba(139,92,246,0.05)', blur: 80,  delay: '6s',   dur: '15s' },
  { w: 250, h: 250, top: '70%', left: '20%', color: 'rgba(6,182,212,0.04)', blur: 90,  delay: '9s',   dur: '25s' },
  { w: 200, h: 200, top: '40%', left: '45%', color: 'rgba(251,191,36,0.04)', blur: 70,  delay: '12s',  dur: '20s' },
];

export default function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-center overflow-hidden"
    >
      {/* ── 3D Animated Background ── */}
      <div className="absolute inset-0 pointer-events-none">

        {/* Floating animated orbs */}
        {ORBS.map((orb, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: orb.w,
              height: orb.h,
              top: orb.top,
              left: orb.left,
              background: orb.color,
              filter: `blur(${orb.blur}px)`,
              animation: `heroFloat ${orb.dur} ease-in-out infinite alternate`,
              animationDelay: orb.delay,
              transform: 'translate(-50%, -50%)',
            }}
          />
        ))}

        {/* 3D perspective grid (depth illusion) */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(6,182,212,0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(6,182,212,0.5) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
            transform: 'perspective(600px) rotateX(12deg) scaleY(1.6) translateY(-10%)',
            transformOrigin: 'center bottom',
          }}
        />

        {/* Radial vignette overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse 80% 60% at 50% 50%, transparent 30%, rgba(2,6,23,0.7) 100%)',
          }}
        />
      </div>

      {/* ── Content ── */}
      <div className={`relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-28 pb-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>

        {/* Badge */}
        <div className="flex justify-center mb-8">
          <span className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold tracking-widest uppercase rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20 animate-pulse-glow">
            ✦ DSC INFEST 2026 — BINUS University ✦
          </span>
        </div>

        {/* Title */}
        <h1 className="text-center text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-tight mb-6">
          <span className="gradient-text">Prediksi Keberhasilan</span>
          <br />
          <span className="text-white">UMKM</span>
        </h1>

        {/* Research Title */}
        <p className="text-center text-sm sm:text-base text-surface-400 max-w-4xl mx-auto leading-relaxed mb-8 font-light italic">
          &ldquo;Pendekatan Variational Tabular Synthesis terhadap Rekonstruksi Distribusi Karakteristik Kewirausahaan untuk Pemodelan Keberhasilan UMKM Menggunakan Symmetric Oblivious Gradient-Boosted Tree&rdquo;
        </p>

        {/* Team Names */}
        <p className="text-center text-sm text-surface-500 font-medium tracking-wide mb-12">
          Andreas Edward Putra Jatmiko · Laura Marcella Pratama · Komang Samuel Arie Wicaksana
        </p>

        {/* Core Message Callout */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="relative glass-card p-6 sm:p-8 glow-brand">
            {/* Quote icon */}
            <div className="absolute -top-4 left-6 sm:left-8">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-400 to-success-500 flex items-center justify-center shadow-lg shadow-brand-500/30">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H14.017zM0 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151C7.546 6.068 5.983 8.789 5.983 11H10v10H0z" />
                </svg>
              </div>
            </div>

            <p className="text-base sm:text-lg leading-relaxed text-surface-200 pt-2">
              Keberhasilan UMKM ditentukan oleh{' '}
              <span className="font-bold text-success-400 underline decoration-success-400/30 decoration-2 underline-offset-4">
                apa yang dilakukan pemilik
              </span>{' '}
              <span className="text-surface-400 text-sm">(praktik yang dapat diperbaiki seperti kesiapan usaha)</span>,{' '}
              <span className="font-bold text-white">BUKAN</span> oleh{' '}
              <span className="text-surface-500 line-through decoration-surface-500/50">
                siapa pemiliknya
              </span>{' '}
              <span className="text-surface-400 text-sm">(faktor demografis seperti usia/gender yang terbukti hampir tidak berpengaruh)</span>.
            </p>

            {/* Decorative bottom border */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-500 via-success-500 to-brand-500 rounded-b-2xl opacity-60" />
          </div>
        </div>

        {/* ── 3D Tilt KPI Cards ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {kpiData.map((kpi, index) => (
            <Tilt
              key={kpi.label}
              tiltMaxAngleX={15}
              tiltMaxAngleY={15}
              perspective={800}
              glareEnable={true}
              glareMaxOpacity={0.12}
              glareColor="#ffffff"
              glarePosition="all"
              glareBorderRadius="16px"
              transitionSpeed={500}
              scale={1.05}
              className={`kpi-card text-center transition-all duration-500 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
              style={{ animationDelay: `${300 + index * 100}ms`, transformStyle: 'preserve-3d' }}
            >
              {/* Inner depth layer */}
              <div style={{ transform: 'translateZ(20px)' }}>
                {/* Icon */}
                <div className="flex justify-center mb-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${kpi.accent} p-0.5 shadow-lg ${kpi.glow}`}>
                    <div className="w-full h-full rounded-[10px] bg-surface-900/80 flex items-center justify-center text-white">
                      {kpi.icon}
                    </div>
                  </div>
                </div>

                {/* Value */}
                <div className={`text-2xl sm:text-3xl font-black number-display bg-gradient-to-r ${kpi.accent} bg-clip-text text-transparent mb-1`}>
                  {kpi.value}
                </div>

                {/* Label */}
                <div className="text-xs font-bold text-surface-200 uppercase tracking-wider mb-0.5">
                  {kpi.label}
                </div>

                {/* Description */}
                <div className="text-[10px] text-surface-500 font-medium">
                  {kpi.description}
                </div>
              </div>
            </Tilt>
          ))}
        </div>

        {/* Scroll indicator */}
        <div className="flex justify-center mt-16 animate-bounce">
          <svg className="w-6 h-6 text-surface-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </div>
      </div>

      {/* ── Inline keyframe for floating orbs ── */}
      <style>{`
        @keyframes heroFloat {
          0%   { transform: translate(-50%, -50%) translateY(0px)   scale(1); }
          50%  { transform: translate(-50%, -50%) translateY(-30px) scale(1.04); }
          100% { transform: translate(-50%, -50%) translateY(10px)  scale(0.97); }
        }
      `}</style>
    </section>
  );
}


const kpiData = [
  {
    label: 'ROC-AUC',
    value: metrik.metrics[1].mean.toFixed(3),
    description: 'Area Under ROC Curve',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
      </svg>
    ),
  },
  {
    label: 'Accuracy',
    value: `${(metrik.metrics[0].mean * 100).toFixed(1)}%`,
    description: 'Ketepatan Klasifikasi',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    label: 'MCC',
    value: metrik.metrics[3].mean.toFixed(3),
    description: "Matthew's Correlation",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5" />
      </svg>
    ),
  },
  {
    label: 'PR-AUC',
    value: metrik.metrics[2].mean.toFixed(3),
    description: 'Precision-Recall AUC',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
  },
  {
    label: 'Konfigurasi Diuji',
    value: metrik.total_configurations_tested.toLocaleString('id-ID'),
    description: 'Total Eksperimen',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
      </svg>
    ),
  },
];

export default function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-center overflow-hidden"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-500/8 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-brand-600/6 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-success-500/4 rounded-full blur-3xl" />

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(148,163,184,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.3) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* Content */}
      <div className={`relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-28 pb-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        {/* Badge */}
        <div className="flex justify-center mb-8">
          <span className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold tracking-widest uppercase rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20 animate-pulse-glow">
            DSC INFEST 2026 — BINUS University
          </span>
        </div>

        {/* Title */}
        <h1 className="text-center text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-tight mb-6">
          <span className="gradient-text">Prediksi Keberhasilan</span>
          <br />
          <span className="text-white">UMKM</span>
        </h1>

        {/* Research Title */}
        <p className="text-center text-sm sm:text-base text-surface-400 max-w-4xl mx-auto leading-relaxed mb-8 font-light italic">
          &ldquo;Pendekatan Variational Tabular Synthesis terhadap Rekonstruksi Distribusi Karakteristik Kewirausahaan untuk Pemodelan Keberhasilan UMKM Menggunakan Symmetric Oblivious Gradient-Boosted Tree&rdquo;
        </p>

        {/* Team Names */}
        <p className="text-center text-sm text-surface-500 font-medium tracking-wide mb-12">
          Andreas Edward Putra Jatmiko · Laura Marcella Pratama · Komang Samuel Arie Wicaksana
        </p>

        {/* Core Message Callout */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="relative glass-card p-6 sm:p-8 glow-brand">
            {/* Quote icon */}
            <div className="absolute -top-4 left-6 sm:left-8">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-400 to-success-500 flex items-center justify-center shadow-lg shadow-brand-500/30">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H14.017zM0 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151C7.546 6.068 5.983 8.789 5.983 11H10v10H0z" />
                </svg>
              </div>
            </div>

            <p className="text-base sm:text-lg leading-relaxed text-surface-200 pt-2">
              Keberhasilan UMKM ditentukan oleh{' '}
              <span className="font-bold text-success-400 underline decoration-success-400/30 decoration-2 underline-offset-4">
                apa yang dilakukan pemilik
              </span>{' '}
              <span className="text-surface-400 text-sm">(praktik yang dapat diperbaiki seperti kesiapan usaha)</span>,{' '}
              <span className="font-bold text-white">BUKAN</span> oleh{' '}
              <span className="text-surface-500 line-through decoration-surface-500/50">
                siapa pemiliknya
              </span>{' '}
              <span className="text-surface-400 text-sm">(faktor demografis seperti usia/gender yang terbukti hampir tidak berpengaruh)</span>.
            </p>

            {/* Decorative bottom border */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-500 via-success-500 to-brand-500 rounded-b-2xl opacity-60" />
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {kpiData.map((kpi, index) => (
            <div
              key={kpi.label}
              className={`kpi-card text-center group transition-all duration-500 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
              style={{ animationDelay: `${300 + index * 100}ms` }}
            >
              {/* Icon */}
              <div className="flex justify-center mb-3">
                <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400 group-hover:bg-brand-500/20 group-hover:scale-110 transition-all">
                  {kpi.icon}
                </div>
              </div>

              {/* Value */}
              <div className="text-2xl sm:text-3xl font-black number-display gradient-text mb-1">
                {kpi.value}
              </div>

              {/* Label */}
              <div className="text-xs font-bold text-surface-200 uppercase tracking-wider mb-0.5">
                {kpi.label}
              </div>

              {/* Description */}
              <div className="text-[10px] text-surface-500 font-medium">
                {kpi.description}
              </div>
            </div>
          ))}
        </div>

        {/* Scroll indicator */}
        <div className="flex justify-center mt-16 animate-bounce">
          <svg className="w-6 h-6 text-surface-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </div>
      </div>
    </section>
  );
}
