/**
 * Shap3DChart.tsx — Robust 3D SHAP bar chart
 * Semua label pakai Html overlay (bukan Text CDN font).
 * Tidak ada Environment HDR.
 */
import { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import SectionWrapper from './SectionWrapper';
import shapData from '../data/shap_importance.json';

function getBarColor(feature: string, category: string): string {
  if (feature === 'Readiness_Score') return '#06b6d4';
  if (feature === 'Owner_Gender') return '#ef4444';
  if (category === 'demographic') return '#64748b';
  const colors = ['#0891b2', '#0d9488', '#0f766e', '#10b981', '#059669', '#0284c7'];
  const idx = shapData.filter(d => d.category === 'behavioral').findIndex(d => d.feature === feature);
  return colors[Math.max(0, idx) % colors.length];
}

/* ── Single 3D bar ──────────────────────────────────────── */
function Bar3D({ importance, maxImportance, xPos, label, feature, category, onHover, isHovered }: {
  importance: number; maxImportance: number; xPos: number;
  label: string; feature: string; category: string;
  onHover: (l: string | null) => void; isHovered: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const normalizedH = (importance / maxImportance) * 4.2;
  const color = getBarColor(feature, category);
  const barY = normalizedH / 2 - 2.1;

  useFrame(() => {
    if (!meshRef.current) return;
    const target = isHovered ? 1.1 : 1.0;
    meshRef.current.scale.x = THREE.MathUtils.lerp(meshRef.current.scale.x, target, 0.12);
    meshRef.current.scale.z = THREE.MathUtils.lerp(meshRef.current.scale.z, target, 0.12);
  });

  return (
    <group position={[xPos, barY, 0]}>
      {/* Bar body */}
      <mesh
        ref={meshRef}
        castShadow
        onPointerEnter={() => onHover(label)}
        onPointerLeave={() => onHover(null)}
      >
        <boxGeometry args={[0.52, normalizedH, 0.52]} />
        <meshPhysicalMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isHovered ? 0.7 : 0.2}
          metalness={0.3}
          roughness={0.2}
          transparent
          opacity={isHovered ? 1.0 : 0.82}
          clearcoat={0.8}
          clearcoatRoughness={0.15}
        />
      </mesh>

      {/* Top cap glow */}
      <mesh position={[0, normalizedH / 2 + 0.03, 0]}>
        <boxGeometry args={[0.54, 0.06, 0.54]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={isHovered ? 1.5 : 0.5} />
      </mesh>

      {/* Value label on top — Html, no CDN */}
      {isHovered && (
        <Html center position={[0, normalizedH / 2 + 0.6, 0]} style={{ pointerEvents: 'none' }}>
          <div style={{
            background: 'rgba(15,23,42,0.9)',
            border: `1px solid ${color}60`,
            borderRadius: '6px',
            padding: '3px 8px',
            fontSize: '11px',
            color: color,
            fontWeight: 700,
            whiteSpace: 'nowrap',
            fontFamily: 'Inter, sans-serif',
          }}>
            {importance.toFixed(4)}
          </div>
        </Html>
      )}

      {/* Bottom label — Html */}
      <Html
        center
        position={[0, -2.5, 0]}
        style={{ pointerEvents: 'none', width: '80px' }}
      >
        <div style={{
          fontSize: '9px',
          color: isHovered ? color : '#64748b',
          fontFamily: 'Inter, sans-serif',
          textAlign: 'center',
          lineHeight: '1.2',
          fontWeight: isHovered ? 700 : 400,
          transform: 'rotate(-35deg)',
          transformOrigin: 'top center',
          whiteSpace: 'nowrap',
        }}>
          {label.length > 18 ? label.slice(0, 16) + '…' : label}
        </div>
      </Html>
    </group>
  );
}

/* ── Floor grid ─────────────────────────────────────────── */
function FloorGrid() {
  return <gridHelper args={[18, 18, '#1e293b', '#0f172a']} position={[0, -2.1, 0]} />;
}

/* ── Axis line ──────────────────────────────────────────── */
function AxisLine() {
  const lineObj = useMemo(() => {
    const points = [new THREE.Vector3(-6.0, -2.1, 0), new THREE.Vector3(6.0, -2.1, 0)];
    const geo = new THREE.BufferGeometry().setFromPoints(points);
    const mat = new THREE.LineBasicMaterial({ color: '#334155' });
    return new THREE.Line(geo, mat);
  }, []);
  return <primitive object={lineObj} />;
}

/* ── Tooltip HTML overlay ───────────────────────────────── */
function Tooltip({ hovered }: { hovered: string | null }) {
  if (!hovered) return null;
  const item = shapData.find(d => d.label === hovered);
  if (!item) return null;
  const color = getBarColor(item.feature, item.category);
  return (
    <div className="pointer-events-none absolute top-4 left-1/2 -translate-x-1/2 z-20 glass-card px-5 py-3 text-sm min-w-[230px] text-center">
      <div className="font-bold text-white mb-1">{item.label}</div>
      <div className="font-mono text-lg font-black" style={{ color }}>{item.importance.toFixed(4)}</div>
      <div className="text-surface-400 text-xs mt-1 capitalize">{item.category} factor</div>
      {item.feature === 'Owner_Gender' && (
        <div className="mt-2 text-[11px] text-red-400 bg-red-900/20 rounded-lg px-2 py-1">
          ≈ 0 — Tidak berpengaruh · Model tidak diskriminatif
        </div>
      )}
    </div>
  );
}

/* ── Main export ────────────────────────────────────────── */
export default function Shap3DChart() {
  const [hovered, setHovered] = useState<string | null>(null);
  const sorted = useMemo(() => [...shapData].sort((a, b) => b.importance - a.importance), []);
  const maxImportance = sorted[0].importance;
  const spacing = 1.1;
  const startX = -((sorted.length - 1) * spacing) / 2;

  return (
    <SectionWrapper
      id="shap"
      title="Faktor Penentu Keberhasilan"
      subtitle="Visualisasi 3D interaktif SHAP importance — drag untuk memutar 360°, hover bar untuk detail."
      badge="3D SHAP Analysis"
    >
      {/* Drag hint */}
      <div className="flex items-center justify-center gap-2 mb-4 text-xs text-surface-500">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zM12 2.25V4.5m5.834.166l-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243l-1.59-1.59" />
        </svg>
        <span>Drag untuk memutar · Scroll untuk zoom · Hover bar untuk detail</span>
      </div>

      {/* 3D Canvas container */}
      <div
        className="relative w-full rounded-2xl overflow-hidden border border-surface-800 bg-surface-950"
        style={{ height: '500px' }}
      >
        <Tooltip hovered={hovered} />

        <Canvas
          dpr={[1, 1.5]}
          camera={{ position: [0, 2.5, 10], fov: 50 }}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          style={{ background: 'transparent' }}
          shadows
        >
          {/* Lighting — no CDN needed */}
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 10, 5]} intensity={1.5} color="#ffffff" castShadow />
          <directionalLight position={[-5, 5, -5]} intensity={0.5} color="#06b6d4" />
          <pointLight position={[0, 5, 0]} intensity={1.2} color="#06b6d4" distance={15} decay={2} />

          <Sparkles count={25} scale={12} size={0.7} speed={0.1} opacity={0.2} color="#06b6d4" />

          <FloorGrid />
          <AxisLine />

          {sorted.map((item, i) => (
            <Bar3D
              key={item.feature}
              importance={item.importance}
              maxImportance={maxImportance}
              xPos={startX + i * spacing}
              label={item.label}
              feature={item.feature}
              category={item.category}
              onHover={setHovered}
              isHovered={hovered === item.label}
            />
          ))}

          <OrbitControls
            enableZoom
            enablePan={false}
            autoRotate
            autoRotateSpeed={0.35}
            maxPolarAngle={Math.PI * 0.82}
            minPolarAngle={Math.PI * 0.1}
            dampingFactor={0.08}
            enableDamping
            minDistance={5}
            maxDistance={18}
          />
        </Canvas>
      </div>

      {/* Legend */}
      <div className="mt-5 flex flex-wrap gap-4 justify-center">
        {[
          { color: '#06b6d4', label: 'Readiness Score (Dominan)', key: 'r' },
          { color: '#10b981', label: 'Faktor Behavioral', key: 'b' },
          { color: '#64748b', label: 'Faktor Demografis', key: 'd' },
          { color: '#ef4444', label: 'Owner Gender (≈0, Fairness)', key: 'g' },
        ].map(item => (
          <div key={item.key} className="flex items-center gap-2 text-sm text-surface-300">
            <span className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: item.color }} />
            {item.label}
          </div>
        ))}
      </div>

      {/* Insight callouts */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="insight-box insight-box-success">
          <p className="text-sm text-surface-200 leading-relaxed">
            <strong className="text-success-400">Bar tertinggi: Readiness Score (3.70)</strong> — hampir 3× lebih dominan dibanding faktor kedua. Kesiapan usaha adalah prediktor utama.
          </p>
        </div>
        <div className="insight-box insight-box-warning">
          <p className="text-sm text-surface-200 leading-relaxed">
            <strong className="text-amber-400">Bar terpendek: Owner Gender (0.011)</strong> — nyaris tidak terlihat dalam ruang 3D. Model terbukti tidak diskriminatif terhadap gender.
          </p>
        </div>
      </div>

      <div className="mt-6 text-center">
        <p className="gradient-text text-xl font-black">
          Keberhasilan = Apa yang Anda LAKUKAN, bukan siapa Anda
        </p>
      </div>
    </SectionWrapper>
  );
}
