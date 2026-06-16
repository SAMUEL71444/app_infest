/**
 * Hero3DScene.tsx — Robust WebGL Hero Scene
 * Tidak menggunakan CDN font atau Environment HDR.
 * Labels pakai Html component (pure HTML overlay dalam Canvas).
 */
import { useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Float, Sparkles, MeshDistortMaterial, Html } from '@react-three/drei';
import * as THREE from 'three';
import metrik from '../data/metrik_unggulan.json';

const KPI_ITEMS = [
  { label: 'ROC-AUC', value: metrik.metrics[1].mean.toFixed(3), color: '#06b6d4' },
  { label: 'Accuracy', value: `${(metrik.metrics[0].mean * 100).toFixed(1)}%`, color: '#10b981' },
  { label: 'MCC', value: metrik.metrics[3].mean.toFixed(3), color: '#8b5cf6' },
  { label: 'PR-AUC', value: metrik.metrics[2].mean.toFixed(3), color: '#f59e0b' },
];

/* ── Central glowing sphere ─────────────────────────────── */
function DataSphere() {
  const meshRef = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }) => {
    meshRef.current.rotation.y = clock.getElapsedTime() * 0.1;
  });
  return (
    <mesh ref={meshRef} castShadow>
      <sphereGeometry args={[1.5, 64, 64]} />
      <MeshDistortMaterial
        color="#0c1a2e"
        emissive="#06b6d4"
        emissiveIntensity={0.25}
        metalness={0.95}
        roughness={0.05}
        distort={0.2}
        speed={1.2}
        transparent
        opacity={0.95}
      />
    </mesh>
  );
}

/* ── Outer wireframe shell ──────────────────────────────── */
function WireShell() {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }) => {
    ref.current.rotation.y = -clock.getElapsedTime() * 0.05;
    ref.current.rotation.x = clock.getElapsedTime() * 0.02;
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[1.8, 20, 20]} />
      <meshBasicMaterial color="#06b6d4" wireframe transparent opacity={0.07} />
    </mesh>
  );
}

/* ── Orbital rings ──────────────────────────────────────── */
function OrbitalRing({ radius, speed, color }: { radius: number; speed: number; color: string }) {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }) => {
    ref.current.rotation.x = clock.getElapsedTime() * speed;
    ref.current.rotation.z = clock.getElapsedTime() * speed * 0.6;
  });
  return (
    <mesh ref={ref}>
      <torusGeometry args={[radius, 0.007, 8, 80]} />
      <meshBasicMaterial color={color} transparent opacity={0.22} />
    </mesh>
  );
}

/* ── Orbiting KPI node with HTML label ──────────────────── */
function KPINode({ kpi, index, total }: { kpi: typeof KPI_ITEMS[0]; index: number; total: number }) {
  const groupRef = useRef<THREE.Group>(null!);
  const baseAngle = (index / total) * Math.PI * 2;

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * 0.14 + baseAngle;
    groupRef.current.position.x = Math.cos(t) * 3.0;
    groupRef.current.position.z = Math.sin(t) * 3.0;
    groupRef.current.position.y = Math.sin(t * 0.8) * 0.5;
  });

  return (
    <group ref={groupRef}>
      {/* Glowing dot */}
      <mesh>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial
          color={kpi.color}
          emissive={kpi.color}
          emissiveIntensity={1.5}
        />
      </mesh>
      {/* Disc halo */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.18, 0.26, 24]} />
        <meshBasicMaterial color={kpi.color} transparent opacity={0.35} side={THREE.DoubleSide} />
      </mesh>
      {/* HTML label — no CDN font needed */}
      <Html
        center
        position={[0, 0.45, 0]}
        style={{ pointerEvents: 'none', whiteSpace: 'nowrap' }}
      >
        <div style={{
          background: 'rgba(15,23,42,0.85)',
          border: `1px solid ${kpi.color}40`,
          borderRadius: '8px',
          padding: '4px 10px',
          backdropFilter: 'blur(6px)',
          textAlign: 'center',
          minWidth: '70px',
        }}>
          <div style={{ color: kpi.color, fontSize: '13px', fontWeight: 900, fontFamily: 'Inter, sans-serif' }}>
            {kpi.value}
          </div>
          <div style={{ color: '#94a3b8', fontSize: '9px', fontFamily: 'Inter, sans-serif', marginTop: '1px' }}>
            {kpi.label}
          </div>
        </div>
      </Html>
    </group>
  );
}

/* ── Responsive camera setup ────────────────────────────── */
function CameraSetup() {
  const { size, camera } = useThree();
  const isMobile = size.width < 640;
  const cam = camera as THREE.PerspectiveCamera;
  cam.fov = isMobile ? 70 : 55;
  cam.position.z = isMobile ? 8.5 : 7;
  cam.updateProjectionMatrix();
  return null;
}

/* ── Main Canvas export ─────────────────────────────────── */
export default function Hero3DScene() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0.5, 7], fov: 55 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      style={{ background: 'transparent', width: '100%', height: '100%' }}
    >
      <CameraSetup />

      {/* Lighting — no external HDR needed */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[4, 6, 4]} intensity={1.8} color="#ffffff" />
      <directionalLight position={[-4, -2, -4]} intensity={0.6} color="#06b6d4" />
      <pointLight position={[0, 0, 2]} intensity={3} color="#06b6d4" distance={7} decay={2} />
      <pointLight position={[2, 2, -2]} intensity={1.5} color="#10b981" distance={6} decay={2} />

      {/* Sparkles */}
      <Sparkles count={60} scale={9} size={1.0} speed={0.25} opacity={0.4} color="#06b6d4" />

      {/* Central sphere group */}
      <Float speed={0.7} rotationIntensity={0.15} floatIntensity={0.25}>
        <DataSphere />
        <WireShell />
        <OrbitalRing radius={2.1} speed={0.18} color="#06b6d4" />
        <OrbitalRing radius={2.4} speed={-0.13} color="#10b981" />
        <OrbitalRing radius={2.65} speed={0.09} color="#8b5cf6" />
      </Float>

      {/* Orbiting KPI nodes */}
      {KPI_ITEMS.map((kpi, i) => (
        <KPINode key={kpi.label} kpi={kpi} index={i} total={KPI_ITEMS.length} />
      ))}

      {/* OrbitControls — drag to rotate, scroll to zoom */}
      <OrbitControls
        enableZoom={true}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.6}
        maxPolarAngle={Math.PI * 0.75}
        minPolarAngle={Math.PI * 0.25}
        dampingFactor={0.08}
        enableDamping
        minDistance={4}
        maxDistance={12}
      />
    </Canvas>
  );
}
