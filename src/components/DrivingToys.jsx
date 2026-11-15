import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import useGameStore from '../stores/gameStore';

// 4 Clean Speed-Boost Pads on the 4 main compass highways (North, East, West, South)
const BOOST_PADS = [
  { pos: [0, 0.08, -22], rot: Math.PI, color: '#a855f7' },       // North -> Projects
  { pos: [22, 0.08, 0], rot: -Math.PI / 2, color: '#06b6d4' },   // East -> Skills
  { pos: [-22, 0.08, 0], rot: Math.PI / 2, color: '#f59e0b' },   // West -> Experience
  { pos: [0, 0.08, 22], rot: 0, color: '#ef4444' },              // South -> Resume
];

export default function DrivingToys() {
  const lastBoostTime = useRef(0);

  useFrame(() => {
    const now = performance.now();
    if (now - lastBoostTime.current < 900) return;
    const [rx, , rz] = useGameStore.getState().roverPosition;
    for (let i = 0; i < BOOST_PADS.length; i++) {
      const bp = BOOST_PADS[i];
      if (Math.hypot(rx - bp.pos[0], rz - bp.pos[2]) < 2.8) {
        lastBoostTime.current = now;
        useGameStore.getState().triggerBoostKick();
        break;
      }
    }
  });

  return (
    <group>
      {BOOST_PADS.map((bp, i) => (
        <group key={i} position={bp.pos} rotation={[0, bp.rot, 0]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[3.4, 4.0]} />
            <meshStandardMaterial
              color="#040814"
              emissive={bp.color}
              emissiveIntensity={0.75}
              transparent
              opacity={0.85}
            />
          </mesh>
          {[-1.0, 0, 1.0].map((zOff, j) => (
            <mesh key={j} position={[0, 0.04, zOff]} rotation={[-Math.PI / 2, 0, 0]}>
              <coneGeometry args={[1.1, 1.0, 3]} />
              <meshStandardMaterial color="#ffffff" emissive={bp.color} emissiveIntensity={3.0} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}
