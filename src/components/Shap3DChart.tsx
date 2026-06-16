/**
 * Shap3DChart.tsx
 * True 3D interactive SHAP bar chart using React Three Fiber.
 * Data: reads shap_importance.json — ALL bars are 3D Box geometries.
 * Users can drag/rotate the entire scene 360 degrees.
 */
import { useRef, useState, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
  OrbitControls,
  Text,
  Environment,
  Sparkles,
} from '@react-three/drei';
import * as THREE from 'three';
import SectionWrapper from './SectionWrapper';
import shapData from '../data/shap_importance.json';

/* ─── Color logic per category ─────────────────────────── */
function getBarColor(feature: string, category: string): string {
  if (feature === 'Readiness_Score') return '#06b6d4';   // Champion: bright teal
  if (feature === 'Owner_Gender') return '#ef4444';       // Fairness: red (near-zero)
  if (category === 'demographic') return '#64748b';       // Demographic: gray
  // Behavioral gradient: teal → green → slate
  const behavioralColors = ['#06b6d4', '#0891b2', '#0d9488', '#0f766e', '#10b981', '#059669'];
  const behavioralFeatures = shapData.filter(d => d.category === 'behavioral');
  const idx = behavioralFeatures.findIndex(d => d.feature === feature);
  return behavioralColors[idx % behavioralColors.length] ?? '#3b82f6';
}

/* ─── Single 3D Bar ─────────────────────────────────────── */
function Bar3D({
  importance,
  maxImportance,
  xPos,
  label,
  feature,
  category,
  onHover,
  isHovered,
}: {
  importance: number;
  maxImportance: number;
  xPos: number;
  label: string;
  feature: string;
  category: string;
  onHover: (label: string | null) => void;
  isHovered: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const normalizedH = (importance / maxImportance) * 4.5;   // Max height = 4.5 units
  const color = getBarColor(feature, category);
  const barY = normalizedH / 2 - 2.25;                       // Center pivot at bottom

  useFrame(() => {
    if (!meshRef.current) return;
    const targetScale = isHovered ? 1.08 : 1.0;
    meshRef.current.scale.x = THREE.MathUtils.lerp(meshRef.current.scale.x, targetScale, 0.1);
    meshRef.current.scale.z = THREE.MathUtils.lerp(meshRef.current.scale.z, targetScale, 0.1);
  });

  return (
    <group position={[xPos, barY, 0]}>
      {/* Main bar */}
      <mesh
        ref={meshRef}
        castShadow
        receiveShadow
        onPointerEnter={() => onHover(label)}
        onPointerLeave={() => onHover(null)}
      >
        <boxGeometry args={[0.55, normalizedH, 0.55]} />
        <meshPhysicalMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isHovered ? 0.6 : 0.2}
          metalness={0.3}
          roughness={0.2}
          transparent
          opacity={isHovered ? 1.0 : 0.85}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </mesh>

      {/* Top glow cap */}
      <mesh position={[0, normalizedH / 2 + 0.03, 0]}>
        <boxGeometry args={[0.57, 0.06, 0.57]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isHovered ? 1.2 : 0.5}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Importance value on top of bar */}
      <Text
        position={[0, normalizedH / 2 + 0.25, 0]}
        fontSize={0.16}
        color={isHovered ? '#ffffff' : '#e2e8f0'}
        anchorX="center"
        anchorY="bottom"
        rotation={[0, 0, 0]}
        font="https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2"
        outlineWidth={0.008}
        outlineColor="#000000"
      >
        {importance.toFixed(2)}
      </Text>

      {/* Label below bar — rotated for readability */}
      <Text
        position={[0, -2.5, 0]}
        fontSize={0.13}
        color={isHovered ? color : '#94a3b8'}
        anchorX="center"
        anchorY="top"
        rotation={[0, 0, -Math.PI / 4]}
        maxWidth={1.5}
        font="https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2"
        outlineWidth={0.005}
        outlineColor="#000000"
      >
        {label}
      </Text>
    </group>
  );
}

/* ─── Floor grid ────────────────────────────────────────── */
function FloorGrid() {
  return (
    <gridHelper
      args={[20, 20, '#1e293b', '#0f172a']}
      position={[0, -2.25, 0]}
      rotation={[0, 0, 0]}
    />
  );
}

/* ─── Axis ──────────────────────────────────────────────── */
function AxisLine() {
  const geo = useMemo(() => {
    const points = [
      new THREE.Vector3(-6.5, -2.25, 0),
      new THREE.Vector3(6.5, -2.25, 0),
    ];
    return new THREE.BufferGeometry().setFromPoints(points);
  }, []);

  const mat = useMemo(() => new THREE.LineBasicMaterial({ color: '#334155' }), []);
  const lineObj = useMemo(() => new THREE.Line(geo, mat), [geo, mat]);

  return <primitive object={lineObj} />;
}

/* ─── Tooltip overlay ───────────────────────────────────── */
function TooltipOverlay({ hovered, data }: { hovered: string | null; data: typeof shapData }) {
  if (!hovered) return null;
  const item = data.find(d => d.label === hovered);
  if (!item) return null;
  return (
    <div className="pointer-events-none absolute top-4 left-1/2 -translate-x-1/2 glass-card px-5 py-3 text-sm z-10 min-w-[220px] text-center">
      <div className="font-bold text-white mb-1">{item.label}</div>
      <div className="text-brand-400 font-mono text-lg font-black">{item.importance.toFixed(4)}</div>
      <div className="text-surface-400 text-xs mt-1 capitalize">{item.category} factor</div>
      {item.feature === 'Owner_Gender' && (
        <div className="mt-2 text-[11px] text-red-400 bg-red-900/20 rounded-lg px-2 py-1">
          ≈ 0 → Tidak berpengaruh terhadap prediksi
        </div>
      )}
    </div>
  );
}

/* ─── Main exported component ───────────────────────────── */
export default function Shap3DChart() {
  const [hovered, setHovered] = useState<string | null>(null);

  // Sort by importance descending and space evenly
  const sorted = [...shapData].sort((a, b) => b.importance - a.importance);
  const maxImportance = sorted[0].importance;
  const totalBars = sorted.length;
  const spacing = 1.1;
  const startX = -((totalBars - 1) * spacing) / 2;

  return (
    <SectionWrapper
      id="shap"
      title="Faktor Penentu Keberhasilan"
      subtitle="Visualisasi 3D interaktif SHAP importance — drag dan putar untuk eksplorasi 360°."
      badge="3D SHAP Analysis"
    >
      {/* Drag hint */}
      <div className="flex items-center justify-center gap-2 mb-4 text-xs text-surface-500">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 3.75H6A2.25 2.25 0 003.75 6v1.5M16.5 3.75H18A2.25 2.25 0 0120.25 6v1.5m0 9V18A2.25 2.25 0 0118 20.25h-1.5m-9 0H6A2.25 2.25 0 013.75 18v-1.5M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span>Drag untuk memutar · Scrool untuk zoom · Hover bar untuk detail</span>
      </div>

      {/* 3D Canvas */}
      <div className="relative w-full rounded-2xl overflow-hidden border border-surface-800 bg-surface-950" style={{ height: '520px' }}>
        <TooltipOverlay hovered={hovered} data={shapData} />

        <Canvas
          dpr={[1, 1.5]}
          camera={{ position: [0, 2, 10], fov: 50 }}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          style={{ background: 'transparent' }}
          shadows
        >
          {/* Lighting */}
          <ambientLight intensity={0.5} color="#1e293b" />
          <directionalLight position={[5, 10, 5]} intensity={1.5} color="#ffffff" castShadow />
          <directionalLight position={[-5, 5, -5]} intensity={0.5} color="#06b6d4" />
          <pointLight position={[0, 5, 0]} intensity={1} color="#06b6d4" distance={15} decay={2} />

          <Suspense fallback={null}>
            <Environment preset="night" />
          </Suspense>

          {/* Subtle sparkles */}
          <Sparkles count={30} scale={12} size={0.8} speed={0.1} opacity={0.3} color="#06b6d4" />

          {/* Floor & axis */}
          <FloorGrid />
          <AxisLine />

          {/* 3D Bars */}
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

          {/* Y-axis label */}
          <Text
            position={[-6.8, 0, 0]}
            fontSize={0.18}
            color="#475569"
            anchorX="center"
            anchorY="middle"
            rotation={[0, 0, Math.PI / 2]}
            font="https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2"
          >
            SHAP Importance
          </Text>

          {/* OrbitControls — full 360° drag */}
          <OrbitControls
            enableZoom
            enablePan={false}
            autoRotate
            autoRotateSpeed={0.3}
            maxPolarAngle={Math.PI * 0.85}
            minPolarAngle={Math.PI * 0.1}
            dampingFactor={0.08}
            enableDamping
            minDistance={5}
            maxDistance={18}
          />
        </Canvas>
      </div>

      {/* 2D Legend overlay */}
      <div className="mt-6 flex flex-wrap gap-4 justify-center">
        {[
          { color: '#06b6d4', label: 'Readiness Score (Dominan)', key: 'readiness' },
          { color: '#10b981', label: 'Faktor Behavioral lain', key: 'behavioral' },
          { color: '#64748b', label: 'Faktor Demografis', key: 'demographic' },
          { color: '#ef4444', label: 'Owner Gender (≈0, Fairness)', key: 'gender' },
        ].map(item => (
          <div key={item.key} className="flex items-center gap-2 text-sm text-surface-300">
            <span className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: item.color }} />
            {item.label}
          </div>
        ))}
      </div>

      {/* Insight callouts */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
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

      {/* Core message */}
      <div className="mt-8 text-center">
        <p className="gradient-text text-2xl font-black">
          Keberhasilan = Apa yang Anda LAKUKAN, bukan siapa Anda
        </p>
        <p className="text-surface-400 text-sm mt-2">
          Dibuktikan secara visual dalam ruang 3D: tinggi bar = pengaruh nyata terhadap prediksi
        </p>
      </div>
    </SectionWrapper>
  );
}
