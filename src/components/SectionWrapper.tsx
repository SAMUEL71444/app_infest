import { useEffect, useRef, useState, type ReactNode } from 'react';

interface SectionWrapperProps {
  id: string;
  title: string;
  subtitle?: string;
  badge?: string;
  children: ReactNode;
  className?: string;
}

export default function SectionWrapper({ id, title, subtitle, badge, children, className = '' }: SectionWrapperProps) {
  const ref = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id={id} ref={ref} className={`section-container ${isVisible ? 'animate-fade-in-up' : 'opacity-0'} ${className}`}>
      {badge && (
        <span className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-wider uppercase rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20">
          {badge}
        </span>
      )}
      <h2 className="section-title gradient-text">{title}</h2>
      {subtitle && <p className="section-subtitle">{subtitle}</p>}
      <div className="mt-10">{children}</div>
    </section>
  );
}
