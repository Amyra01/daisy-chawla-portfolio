import { Text } from '@react-three/drei';
import { RigidBody } from '@react-three/rapier';
import useGameStore from '../stores/gameStore';
import { resumeData } from '../data/resumeData';
import TriggerPad from './TriggerPad';

function ExperienceCardBlade({ exp, index, total }) {
  const setActiveExperience = useGameStore((s) => s.setActiveExperience);
  // Clean spacious row along West Zone x = -48, spread across z = -15 to +15 (zero overlapping text!)
  const z = (index - (total - 1) / 2) * 6.2;
  const x = -49;

  return (
    <group position={[x, 0, z]} rotation={[0, Math.PI / 2, 0]}>
      <RigidBody type="fixed" colliders="cuboid">
        <mesh
          position={[0, 3.8, 0]}
          castShadow
          onClick={() => setActiveExperience(exp)}
          onPointerEnter={() => { document.body.style.cursor = 'pointer'; }}
          onPointerLeave={() => { document.body.style.cursor = 'default'; }}
        >
          <boxGeometry args={[5.2, 6.8, 0.9]} />
          <meshStandardMaterial
            color="#090d1a"
            emissive={exp.color}
            emissiveIntensity={0.28}
            metalness={0.85}
            roughness={0.22}
          />
        </mesh>
      </RigidBody>

      {/* Gold PCIe Base */}
      <mesh position={[0, 0.3, 0]}>
        <boxGeometry args={[4.8, 0.55, 1.0]} />
        <meshStandardMaterial color="#fbbf24" emissive="#d97706" emissiveIntensity={0.6} metalness={1} roughness={0.15} />
      </mesh>

      {/* Top Accent Bar */}
      <mesh position={[0, 7.25, 0]}>
        <boxGeometry args={[5.3, 0.16, 1.0]} />
        <meshStandardMaterial color={exp.color} emissive={exp.color} emissiveIntensity={2.2} />
      </mesh>

      <Text
        position={[0, 5.8, 0.5]}
        fontSize={0.28}
        color={exp.color}
        anchorX="center"
        anchorY="middle"
      >
        {exp.period}
      </Text>
      <Text
        position={[0, 4.5, 0.5]}
        fontSize={0.42}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        maxWidth={4.6}
        textAlign="center"
      >
        {exp.role}
      </Text>
      <Text
        position={[0, 3.2, 0.5]}
        fontSize={0.3}
        color="#cbd5e1"
        anchorX="center"
        anchorY="middle"
        maxWidth={4.6}
        textAlign="center"
      >
        {exp.company}
      </Text>
      <Text
        position={[0, 1.9, 0.5]}
        fontSize={0.24}
        color="#00ffcc"
        anchorX="center"
        anchorY="middle"
      >
        {exp.certificateUrl ? '📜 Certificate Included' : '★ Click / Press [E]'}
      </Text>
    </group>
  );
}

export default function ExperienceZone() {
  const list = resumeData.experience;
  return (
    <group>
      {list.map((exp, i) => (
        <ExperienceCardBlade
          key={exp.id || i}
          exp={exp}
          index={i}
          total={list.length}
        />
      ))}

      {/* Main Experience Terminal Trigger Pad right where West road arrives */}
      <TriggerPad
        id="exp-main-pad"
        position={[-38, 0.14, 0]}
        radius={3.2}
        color="#f59e0b"
        title="🏆 EXPERIENCE TIMELINE"
        subtitle="Internships • GSSoC • Google Ambassador"
        type="experience"
        data={list[0]}
      />
    </group>
  );
}
