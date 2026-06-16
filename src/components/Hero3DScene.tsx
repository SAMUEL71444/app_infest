/**
 * Hero3DScene.tsx
 * Full WebGL 3D interactive hero using React Three Fiber.
 * Includes: draggable/rotatable data sphere, floating KPI rings, particle field.
 * Data: reads metrik_unggulan.json (read-only).
 */
import { useRef, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
  OrbitControls,
  Environment,
  Float,
  Text,
  Sparkles,
  MeshDistortMaterial,
} from '@react-three/drei';
import * as THREE from 'three';
import metrik from '../data/metrik_unggulan.json';

/* ─── KPI data ─────────────────────────────────────────── */
const KPI_ITEMS = [
  { label: 'ROC-AUC', value: metrik.metrics[1].mean.toFixed(3), color: '#06b6d4' },
  { label: 'Accuracy', value: `${(metrik.metrics[0].mean * 100).toFixed(1)}%`, color: '#10b981' },
  { label: 'MCC', value: metrik.metrics[3].mean.toFixed(3), color: '#8b5cf6' },
  { label: 'PR-AUC', value: metrik.metrics[2].mean.toFixed(3), color: '#f59e0b' },
];

/* ─── Central Data Sphere ───────────────────────────────── */
function DataSphere() {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = clock.getElapsedTime() * 0.08;
      meshRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.05) * 0.15;
    }
  });

  return (
    <mesh ref={meshRef} castShadow>
      <sphereGeometry args={[1.6, 64, 64]} />
      <MeshDistortMaterial
        color="#0f172a"
        emissive="#06b6d4"
        emissiveIntensity={0.15}
        metalness={0.9}
        roughness={0.1}
        distort={0.25}
        speed={1.5}
        transparent
        opacity={0.92}
        envMapIntensity={2}
      />
    </mesh>
  );
}

/* ─── Wireframe outer shell ─────────────────────────────── */
function WireframeSphere() {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.y = -clock.getElapsedTime() * 0.05;
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[1.85, 24, 24]} />
      <meshBasicMaterial color="#06b6d4" wireframe opacity={0.08} transparent />
    </mesh>
  );
}

/* ─── Orbiting KPI Ring labels ──────────────────────────── */
function OrbitingKPI({ label, value, color, index, total }: {
  label: string; value: string; color: string; index: number; total: number;
}) {
  const groupRef = useRef<THREE.Group>(null!);
  const angle = (index / total) * Math.PI * 2;
  const radius = 3.2;

  useFrame(({ clock }) => {
    if (groupRef.current) {
      const t = clock.getElapsedTime() * 0.12 + angle;
      groupRef.current.position.x = Math.cos(t) * radius;
      groupRef.current.position.z = Math.sin(t) * radius;
      groupRef.current.position.y = Math.sin(t * 0.7) * 0.5;
      groupRef.current.lookAt(0, groupRef.current.position.y, 0);
    }
  });

  return (
    <group ref={groupRef}>
      {/* Glowing disc */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.55, 0.55, 0.04, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.6}
          transparent
          opacity={0.25}
          metalness={0.5}
          roughness={0.3}
        />
      </mesh>
      {/* Value text */}
      <Text
        position={[0, 0.08, 0]}
        fontSize={0.22}
        color={color}
        anchorX="center"
        anchorY="middle"
        font="https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2"
        outlineWidth={0.005}
        outlineColor="#000000"
      >
        {value}
      </Text>
      <Text
        position={[0, -0.16, 0]}
        fontSize={0.1}
        color="#94a3b8"
        anchorX="center"
        anchorY="middle"
        font="https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2"
      >
        {label}
      </Text>
    </group>
  );
}

/* ─── Connecting line from sphere to KPI ───────────────── */
function PulsingRing({ radius, speed, color }: { radius: number; speed: number; color: string }) {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.x = clock.getElapsedTime() * speed;
      ref.current.rotation.z = clock.getElapsedTime() * speed * 0.7;
    }
  });
  return (
    <mesh ref={ref}>
      <torusGeometry args={[radius, 0.008, 8, 100]} />
      <meshBasicMaterial color={color} transparent opacity={0.18} />
    </mesh>
  );
}

/* ─── CAMERA RESPONSIVE ─────────────────────────────────── */
function ResponsiveCamera() {
  const { size, camera } = useThree();
  const isMobile = size.width < 640;
  (camera as THREE.PerspectiveCamera).fov = isMobile ? 70 : 55;
  camera.position.z = isMobile ? 8 : 6.5;
  camera.updateProjectionMatrix();
  return null;
}

/* ─── Main exported Canvas ──────────────────────────────── */
export default function Hero3DScene() {
  return (
    <div className="w-full h-full" style={{ touchAction: 'none' }}>
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 6.5], fov: 55 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        style={{ background: 'transparent' }}
      >
        <ResponsiveCamera />

        {/* ── Lighting ── */}
        <ambientLight intensity={0.3} color="#1e293b" />
        <directionalLight position={[5, 5, 5]} intensity={1.2} color="#06b6d4" castShadow />
        <directionalLight position={[-5, -3, -5]} intensity={0.6} color="#10b981" />
        <pointLight position={[0, 0, 0]} intensity={2} color="#06b6d4" distance={8} decay={2} />

        {/* ── Environment for reflections ── */}
        <Suspense fallback={null}>
          <Environment preset="city" />
        </Suspense>

        {/* ── Particle sparkles ── */}
        <Sparkles
          count={80}
          scale={10}
          size={1.2}
          speed={0.3}
          opacity={0.5}
          color="#06b6d4"
        />

        {/* ── Central sphere group ── */}
        <Float speed={0.8} rotationIntensity={0.2} floatIntensity={0.3}>
          <DataSphere />
          <WireframeSphere />

          {/* Pulsing orbital rings */}
          <PulsingRing radius={2.15} speed={0.2} color="#06b6d4" />
          <PulsingRing radius={2.4} speed={-0.15} color="#10b981" />
          <PulsingRing radius={2.65} speed={0.1} color="#8b5cf6" />

          {/* Center label */}
          <Text
            position={[0, 0, 1.7]}
            fontSize={0.18}
            color="#e2e8f0"
            anchorX="center"
            anchorY="middle"
            font="https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2"
            maxWidth={2.5}
            textAlign="center"
            outlineWidth={0.008}
            outlineColor="#000000"
          >
            CatBoost + TVAE
          </Text>
        </Float>

        {/* ── Orbiting KPI nodes ── */}
        {KPI_ITEMS.map((kpi, i) => (
          <OrbitingKPI
            key={kpi.label}
            label={kpi.label}
            value={kpi.value}
            color={kpi.color}
            index={i}
            total={KPI_ITEMS.length}
          />
        ))}

        {/* ── OrbitControls: judges can drag/rotate ── */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.5}
          maxPolarAngle={Math.PI * 0.7}
          minPolarAngle={Math.PI * 0.3}
          dampingFactor={0.08}
          enableDamping
        />
      </Canvas>
    </div>
  );
}
