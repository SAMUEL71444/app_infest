import { useEffect, useState } from 'react';

/* ──────────────────────────────────────────────────────────────
   Opening splash shown on load: animated background, then the
   title "Prediksi Keberhasilan UMKM · by YAUDAHLAHYA" reveals in
   the center, then the whole overlay fades out to reveal the
   dashboard. Click anywhere to skip.
   ────────────────────────────────────────────────────────────── */

export default function IntroSplash() {
  const [phase, setPhase] = useState<'in' | 'out' | 'done'>('in');

  // auto-dismiss after the reveal has settled
  useEffect(() => {
    const t = setTimeout(() => setPhase('out'), 2800);
    return () => clearTimeout(t);
  }, []);

  // once fading out, unmount after the fade completes
  useEffect(() => {
    if (phase !== 'out') return;
    const t = setTimeout(() => setPhase('done'), 800);
    return () => clearTimeout(t);
  }, [phase]);

  // lock scroll while visible
  useEffect(() => {
    if (phase === 'done') return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [phase]);

  if (phase === 'done') return null;

  return (
    <div
      onClick={() => setPhase('out')}
      role="presentation"
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden cursor-pointer transition-opacity duration-700 ease-out ${
        phase === 'out' ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{ background: 'radial-gradient(ellipse at center, #0b1220 0%, #020617 70%)' }}
    >
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-success-500/8 rounded-full blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(148,163,184,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.4) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 mb-7 text-[11px] font-semibold tracking-widest uppercase rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20 animate-fade-in-up delay-200">
          DSC INFEST 2026
        </span>

        <h1 className="animate-intro-reveal text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.05]">
          <span className="gradient-text">Prediksi Keberhasilan</span>
          <br />
          <span className="text-white">UMKM</span>
        </h1>

        {/* animated divider line */}
        <div className="mx-auto mt-7 mb-5 h-px max-w-[220px] overflow-hidden">
          <div className="h-full w-full bg-gradient-to-r from-transparent via-brand-400/70 to-transparent animate-intro-line" />
        </div>

        <p className="animate-fade-in-up delay-700 text-sm sm:text-base text-surface-400 font-medium tracking-[0.3em] uppercase">
          by YAUDAHLAHYA
        </p>
      </div>

      {/* Skip hint */}
      <p className="absolute bottom-10 text-[11px] text-surface-600 animate-fade-in delay-600 tracking-wide">
        ketuk untuk lewati
      </p>
    </div>
  );
}
