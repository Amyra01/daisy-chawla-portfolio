import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { RigidBody } from '@react-three/rapier';
import useGameStore from '../stores/gameStore';
import { skillCratesList } from '../data/skills';
import TriggerPad from './TriggerPad';
import sound from '../utils/sound';

// Clean DDR5 RAM Stick Tower flanking RAM Alley at [44, 0, 0]
function RamStickTower({ position, index }) {
  const rgbRef = useRef();

  useFrame((state) => {
    if (rgbRef.current) {
      const hue = (state.clock.elapsedTime * 0.2 + index * 0.15) % 1;
      rgbRef.current.material.color.setHSL(hue, 1, 0.55);
      rgbRef.current.material.emissive.setHSL(hue, 1, 0.5);
    }
  });

  return (
    <group position={position}>
      <RigidBody type="fixed" colliders="cuboid">
        <mesh position={[0, 5.5, 0]} castShadow receiveShadow>
          <boxGeometry args={[10, 10.5, 0.9]} />
          <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.22} />
        </mesh>
      </RigidBody>
      <mesh position={[0, 0.35, 0]}>
        <boxGeometry args={[9.6, 0.65, 0.96]} />
        <meshStandardMaterial color="#fbbf24" emissive="#d97706" emissiveIntensity={0.6} metalness={1} roughness={0.15} />
      </mesh>
      <mesh ref={rgbRef} position={[0, 11.0, 0]}>
        <boxGeometry args={[10.1, 0.75, 0.98]} />
        <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={2.5} />
      </mesh>
    </group>
  );
}

// Neat 2-row pyramid behind the Skills Pad at x = 48
function getCrateHomePosition(index) {
  const row = index < 6 ? 0 : 1;
  const col = index % 6;
  const z = (col - 2.5) * 2.2;
  const x = 48 + row * 2.2;
  return [x, 1.0, z];
}

function SkillCrate({ crate, index }) {
  const bodyRef = useRef();
  const meshRef = useRef();
  const lastHitTime = useRef(0);
  const crateResetCounter = useGameStore((s) => s.crateResetCounter);
  const highlightedSkill = useGameStore((s) => s.highlightedSkill);
  const homePos = getCrateHomePosition(index);

  useEffect(() => {
    if (!bodyRef.current) return;
    const [hx, hy, hz] = getCrateHomePosition(index);
    bodyRef.current.setTranslation({ x: hx, y: hy, z: hz }, true);
    bodyRef.current.setRotation({ x: 0, y: 0, z: 0, w: 1 }, true);
    bodyRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
    bodyRef.current.setAngvel({ x: 0, y: 0, z: 0 }, true);
  }, [crateResetCounter, index]);

  const isHighlighted = highlightedSkill === crate.name;

  useFrame(() => {
    if (!meshRef.current || !bodyRef.current) return;
    const vel = bodyRef.current.linvel();
    const speed = Math.hypot(vel.x, vel.y, vel.z);
    if (speed > 4.5 && performance.now() - lastHitTime.current > 260) {
      lastHitTime.current = performance.now();
      sound.playClank(speed / 6);
    }
    meshRef.current.material.emissiveIntensity = isHighlighted ? 2.5 : 0.45;
  });

  return (
    <RigidBody
      ref={bodyRef}
      position={homePos}
      mass={1.0}
      restitution={0.35}
      friction={0.45}
      colliders="cuboid"
    >
      <group>
        <mesh
          ref={meshRef}
          castShadow
          onClick={() => useGameStore.getState().setShowSkillModal(true)}
        >
          <boxGeometry args={[1.65, 1.65, 1.65]} />
          <meshStandardMaterial
            color="#0b1120"
            emissive={crate.color}
            emissiveIntensity={0.45}
            metalness={0.75}
            roughness={0.25}
          />
        </mesh>
        <Text
          position={[-0.86, 0, 0]}
          rotation={[0, -Math.PI / 2, 0]}
          fontSize={0.32}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          {crate.name}
        </Text>
      </group>
    </RigidBody>
  );
}

export default function SkillZone() {
  const ramStickPositions = [
    [44, 0, -11],
    [44, 0, -13],
    [44, 0, 11],
    [44, 0, 13],
  ];

  return (
    <group>
      {ramStickPositions.map((pos, i) => (
        <RamStickTower key={i} position={pos} index={i} />
      ))}

      {skillCratesList.map((crate, i) => (
        <SkillCrate key={crate.name} crate={crate} index={i} />
      ))}

      {/* Main Skills Terminal Pad right where East road arrives */}
      <TriggerPad
        id="ram-skills-pad"
        position={[39, 0.14, 0]}
        radius={3.2}
        color="#06b6d4"
        title="💻 SKILLS & TECH"
        subtitle="Press [E] to View All Skills"
        type="skill"
      />
    </group>
  );
}
