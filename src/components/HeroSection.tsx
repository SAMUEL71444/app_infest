/**
 * HeroSection.tsx — Two-column layout with protected 3D Canvas
 * Left: core message + KPI grid
 * Right: WebGL 3D scene (wrapped in ErrorBoundary + Suspense)
 */
import { useEffect, useState, Suspense, lazy } from 'react';
import metrik from '../data/metrik_unggulan.json';
import WebGLErrorBoundary from './WebGLErrorBoundary';

const Hero3DScene = lazy(() => import('./Hero3DScene'));

const KPI_MINI = [
  { label: 'ROC-AUC',  value: metrik.metrics[1].mean.toFixed(3),                    color: 'text-brand-400' },
  { label: 'Accuracy', value: `${(metrik.metrics[0].mean * 100).toFixed(1)}%`,      color: 'text-success-400' },
  { label: 'MCC',      value: metrik.metrics[3].mean.toFixed(3),                    color: 'text-violet-400' },
  { label: 'PR-AUC',   value: metrik.metrics[2].mean.toFixed(3),                    color: 'text-amber-400' },
];

export default function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-center overflow-hidden"
    >
      {/* ── Background ── */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(6,182,212,0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(6,182,212,0.5) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse 80% 60% at 50% 50%, transparent 20%, rgba(2,6,23,0.85) 100%)',
          }}
        />
      </div>

      {/* ── Main content grid ── */}
      <div
        className={`
          relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-8 w-full
          grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center
          transition-all duration-1000
          ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
        `}
      >
        {/* ── LEFT: Text & KPI ── */}
        <div className="flex flex-col gap-6 order-2 lg:order-1">

          {/* Badge */}
          <span className="self-start inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold tracking-widest uppercase rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20 animate-pulse-glow">
            ✦ DSC INFEST 2026 — BINUS University ✦
          </span>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl xl:text-6xl font-black tracking-tight leading-tight">
            <span className="gradient-text">Prediksi</span>{' '}
            <span className="text-white">Keberhasilan</span>
            <br />
            <span className="text-white">UMKM</span>
          </h1>

          {/* Research subtitle */}
          <p className="text-sm text-surface-400 leading-relaxed font-light italic max-w-lg">
            &ldquo;Pendekatan Variational Tabular Synthesis terhadap Rekonstruksi Distribusi Karakteristik
            Kewirausahaan untuk Pemodelan Keberhasilan UMKM Menggunakan Symmetric Oblivious
            Gradient-Boosted Tree&rdquo;
          </p>

          {/* Team */}
          <p className="text-sm text-surface-500">
            Andreas Edward Putra Jatmiko ·{' '}
            Laura Marcella Pratama ·{' '}
            Komang Samuel Arie Wicaksana
          </p>

          {/* Core message */}
          <div className="relative glass-card p-5 glow-brand">
            <div className="absolute -top-3 left-5">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-400 to-success-500 flex items-center justify-center shadow-lg shadow-brand-500/30">
                <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H14.017zM0 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151C7.546 6.068 5.983 8.789 5.983 11H10v10H0z" />
                </svg>
              </div>
            </div>
            <p className="text-sm sm:text-base leading-relaxed text-surface-200 pt-1">
              Keberhasilan UMKM ditentukan oleh{' '}
              <strong className="text-success-400 underline decoration-success-400/30 decoration-2 underline-offset-4">
                apa yang dilakukan pemilik
              </strong>
              {' '}— BUKAN oleh{' '}
              <span className="text-surface-500 line-through">siapa pemiliknya</span>.
            </p>
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-brand-500 via-success-500 to-brand-500 rounded-b-2xl opacity-60" />
          </div>

          {/* KPI grid */}
          <div className="grid grid-cols-2 gap-3">
            {KPI_MINI.map((kpi) => (
              <div key={kpi.label} className="glass-card p-3 text-center">
                <div className={`text-xl font-black number-display ${kpi.color}`}>{kpi.value}</div>
                <div className="text-[11px] text-surface-500 uppercase tracking-wider font-semibold mt-0.5">
                  {kpi.label}
                </div>
              </div>
            ))}
          </div>

          {/* Configs badge */}
          <div className="flex items-center gap-3 text-sm text-surface-400">
            <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse" />
            <span>
              <strong className="text-brand-400">
                {metrik.total_configurations_tested.toLocaleString('id-ID')}
              </strong>{' '}
              konfigurasi model diuji · Stratified 5-Fold CV
            </span>
          </div>
        </div>

        {/* ── RIGHT: 3D Canvas ── */}
        <div className="order-1 lg:order-2 w-full" style={{ height: '480px' }}>
          <div className="relative w-full h-full rounded-2xl overflow-hidden border border-surface-800/50">
            {/* Hint */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
              <span className="text-[11px] text-surface-400 bg-surface-900/80 backdrop-blur-sm px-3 py-1 rounded-full border border-surface-700">
                🖱 Drag untuk memutar · Auto-rotating
              </span>
            </div>

            {/* Protected 3D Canvas */}
            <WebGLErrorBoundary>
              <Suspense fallback={
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-10 h-10 border-2 border-brand-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                    <p className="text-surface-500 text-sm">Loading 3D Scene...</p>
                  </div>
                </div>
              }>
                <Hero3DScene />
              </Suspense>
            </WebGLErrorBoundary>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="flex justify-center pb-8 animate-bounce relative z-10">
        <svg className="w-6 h-6 text-surface-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </div>
    </section>
  );
}
