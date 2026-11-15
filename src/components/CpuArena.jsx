import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { RigidBody } from '@react-three/rapier';
import useGameStore from '../stores/gameStore';
import TriggerPad from './TriggerPad';

export default function CpuArena() {
  const fanBladesRef = useRef();
  const rgbRingRef = useRef();

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const [rx, , rz] = useGameStore.getState().roverPosition;
    const dist = Math.hypot(rx, rz);
    const nearFactor = dist < 20 ? 1.6 : 1;

    if (fanBladesRef.current) {
      fanBladesRef.current.rotation.y += delta * 2.0 * nearFactor;
    }
    if (rgbRingRef.current) {
      const hue = (t * 0.15) % 1;
      rgbRingRef.current.material.color.setHSL(hue, 1, 0.55);
      rgbRingRef.current.material.emissive.setHSL(hue, 1, 0.5);
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Central CPU Heat Spreader Plate on Floor */}
      <group position={[0, 0.12, -2.5]}>
        <mesh receiveShadow>
          <boxGeometry args={[10, 0.16, 10]} />
          <meshStandardMaterial
            color="#1e293b"
            emissive="#00ff88"
            emissiveIntensity={0.22}
            metalness={0.9}
            roughness={0.2}
          />
        </mesh>
        <Text
          position={[0, 0.12, -1.6]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.68}
          color="#00ff88"
          anchorX="center"
          anchorY="middle"
        >
          DAISY CHAWLA
        </Text>
        <Text
          position={[0, 0.12, -0.3]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.36}
          color="#e2e8f0"
          anchorX="center"
          anchorY="middle"
        >
          CREATIVE DEVELOPER & AI ENGINEER
        </Text>
        <Text
          position={[0, 0.12, 0.8]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.3}
          color="#94a3b8"
          anchorX="center"
          anchorY="middle"
        >
          B.TECH CSE • CGPA 8.10
        </Text>
      </group>

      {/* Clean Overhead Spinning RGB CPU Fan Canopy (9u high so view is never blocked!) */}
      <group position={[0, 9.2, -2.5]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[5.8, 0.38, 16, 48]} />
          <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh ref={rgbRingRef} position={[0, -0.3, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[5.5, 0.15, 12, 48]} />
          <meshStandardMaterial color="#00ffcc" emissive="#00ffcc" emissiveIntensity={2.2} />
        </mesh>
        <group ref={fanBladesRef}>
          <mesh>
            <cylinderGeometry args={[1.2, 1.2, 0.7, 20]} />
            <meshStandardMaterial color="#0b1120" emissive="#00ff88" emissiveIntensity={0.8} />
          </mesh>
          {Array.from({ length: 7 }).map((_, i) => (
            <group key={i} rotation={[0, (i / 7) * Math.PI * 2, 0]}>
              <mesh position={[3.1, 0, 0]} rotation={[0.35, 0, 0]}>
                <boxGeometry args={[3.9, 0.1, 1.0]} />
                <meshStandardMaterial color="#cbd5e1" transparent opacity={0.8} metalness={0.7} />
              </mesh>
            </group>
          ))}
        </group>
      </group>

      {/* 4 Clean Corner Support Columns */}
      {[
        [-8.5, -8.5],
        [8.5, -8.5],
        [-8.5, 8.5],
        [8.5, 8.5],
      ].map(([px, pz], i) => (
        <RigidBody key={i} type="fixed" colliders="cuboid" position={[px, 1.6, pz]}>
          <mesh castShadow>
            <boxGeometry args={[1.6, 3.2, 1.6]} />
            <meshStandardMaterial color="#1e293b" emissive="#00ff88" emissiveIntensity={0.25} metalness={0.9} roughness={0.2} />
          </mesh>
        </RigidBody>
      ))}

      {/* ── 4 Clear Floor Compass Direction Signs around Spawn ── */}
      <Text position={[0, 0.08, -12.5]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.62} color="#a855f7">
        ▲ NORTH: PROJECTS (GPU)
      </Text>
      <Text position={[13.5, 0.08, 0]} rotation={[-Math.PI / 2, 0, -Math.PI / 2]} fontSize={0.62} color="#06b6d4">
        ▲ EAST: SKILLS (RAM)
      </Text>
      <Text position={[-13.5, 0.08, 0]} rotation={[-Math.PI / 2, 0, Math.PI / 2]} fontSize={0.62} color="#f59e0b">
        ▲ WEST: EXPERIENCE (PCIe)
      </Text>
      <Text position={[0, 0.08, 12.5]} rotation={[-Math.PI / 2, 0, Math.PI]} fontSize={0.62} color="#ef4444">
        ▲ SOUTH: RESUME & LINKS (PSU)
      </Text>

      {/* About Terminal Trigger Pad right in front of Spawn */}
      <TriggerPad
        id="cpu-about-pad"
        position={[0, 0.14, 0.5]}
        radius={2.8}
        color="#00ff88"
        title="⚡ ABOUT DAISY"
        subtitle="Intro • Education • Leadership"
        type="about"
      />
    </group>
  );
}
