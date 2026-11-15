import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { RigidBody } from '@react-three/rapier';
import useGameStore from '../stores/gameStore';
import { resumeData } from '../data/resumeData';
import TriggerPad from './TriggerPad';

// 4 Clean 3D Contact Monoliths in the South Resume & Contact Zone [0, 0, 44]
function ContactIconPads() {
  const iconRefs = useRef([]);
  const contacts = useMemo(
    () => [
      {
        id: 'contact-github',
        title: 'GitHub',
        subtitle: 'github.com/Amyra01',
        glyph: 'GH',
        color: '#a855f7',
        href: resumeData.socialLinks.github,
        pos: [-12, 0.14, 43],
      },
      {
        id: 'contact-linkedin',
        title: 'LinkedIn',
        subtitle: '/in/daisy-chawla',
        glyph: 'IN',
        color: '#38bdf8',
        href: resumeData.socialLinks.linkedin,
        pos: [-5.5, 0.14, 43],
      },
      {
        id: 'contact-justiceflow',
        title: 'JusticeFlow AI',
        subtitle: 'Try It Live ↗',
        glyph: 'AI',
        color: '#00ffcc',
        href: resumeData.socialLinks.justiceFlowLive,
        pos: [5.5, 0.14, 43],
      },
      {
        id: 'contact-email',
        title: 'Email Daisy',
        subtitle: resumeData.email,
        glyph: '@',
        color: '#00ff88',
        href: resumeData.socialLinks.email,
        pos: [12, 0.14, 43],
      },
    ],
    []
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    iconRefs.current.forEach((grp, i) => {
      if (grp) {
        grp.position.y = 2.6 + Math.sin(t * 2.0 + i) * 0.25;
      }
    });
  });

  return (
    <group>
      {contacts.map((c, i) => (
        <group key={c.id}>
          <group
            ref={(el) => (iconRefs.current[i] = el)}
            position={[c.pos[0], 2.6, c.pos[2] + 3.5]}
            onClick={() => {
              window.open(c.href, '_blank', 'noopener,noreferrer');
              useGameStore.getState().showToast(`Opened ${c.title}`);
            }}
            onPointerEnter={() => { document.body.style.cursor = 'pointer'; }}
            onPointerLeave={() => { document.body.style.cursor = 'default'; }}
          >
            <mesh castShadow>
              <boxGeometry args={[2.4, 2.4, 0.5]} />
              <meshStandardMaterial
                color="#090d1a"
                emissive={c.color}
                emissiveIntensity={0.6}
                metalness={0.85}
                roughness={0.2}
              />
            </mesh>
            <Text position={[0, 0.15, -0.3]} rotation={[0, Math.PI, 0]} fontSize={0.85} color="#ffffff">
              {c.glyph}
            </Text>
            <Text position={[0, -0.65, -0.3]} rotation={[0, Math.PI, 0]} fontSize={0.28} color={c.color}>
              {c.title}
            </Text>
          </group>

          <TriggerPad
            id={c.id}
            position={c.pos}
            radius={2.1}
            color={c.color}
            title={c.title}
            subtitle={c.subtitle}
            type="contact"
            data={{ href: c.href }}
          />
        </group>
      ))}
    </group>
  );
}

export default function PsuZone() {
  const psuFanRef = useRef();

  useFrame((_, delta) => {
    if (psuFanRef.current) psuFanRef.current.rotation.y += delta * 3.5;
  });

  return (
    <group>
      {/* Main 1200W Power Supply & Resume Monument at [0, 0, 51] */}
      <group position={[0, 0, 52]}>
        <RigidBody type="fixed" colliders="cuboid">
          <mesh position={[0, 4.8, 0]} castShadow receiveShadow>
            <boxGeometry args={[18, 9.6, 8]} />
            <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.25} />
          </mesh>
        </RigidBody>

        <mesh position={[0, 4.8, -4.08]}>
          <planeGeometry args={[16.8, 8.0]} />
          <meshStandardMaterial color="#070a14" emissive="#ef4444" emissiveIntensity={0.25} />
        </mesh>
        <Text position={[0, 6.8, -4.15]} rotation={[0, Math.PI, 0]} fontSize={1.0} color="#ef4444">
          📄 RESUME & CERTIFICATES HUB
        </Text>
        <Text position={[0, 5.1, -4.15]} rotation={[0, Math.PI, 0]} fontSize={0.55} color="#ffffff">
          DAISY CHAWLA — B.TECH CSE (CGPA 8.10)
        </Text>
        <Text position={[0, 3.6, -4.15]} rotation={[0, Math.PI, 0]} fontSize={0.38} color="#00ffcc">
          Download Official Resume PDF • Verified Certificates • References
        </Text>

        {/* Top Spinning PSU Fan */}
        <group position={[0, 9.7, 0]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[3.2, 3.7, 32]} />
            <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={2} />
          </mesh>
          <group ref={psuFanRef}>
            {Array.from({ length: 7 }).map((_, b) => (
              <mesh key={b} rotation={[0, (b / 7) * Math.PI * 2, 0]}>
                <boxGeometry args={[6.0, 0.2, 0.9]} />
                <meshStandardMaterial color="#334155" />
              </mesh>
            ))}
          </group>
        </group>
      </group>

      {/* Central Resume Terminal Trigger Pad right where South road arrives */}
      <TriggerPad
        id="psu-resume-pad"
        position={[0, 0.14, 38]}
        radius={3.0}
        color="#ef4444"
        title="📄 OPEN RESUME & PDF"
        subtitle="Full Resume • Certificates • References"
        type="resume"
      />

      {/* 4 Contact Icon Pads */}
      <ContactIconPads />
    </group>
  );
}
