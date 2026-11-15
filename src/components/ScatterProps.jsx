import { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Billboard } from '@react-three/drei';
import { RigidBody } from '@react-three/rapier';
import * as THREE from 'three';
import useGameStore from '../stores/gameStore';
import { resumeData } from '../data/resumeData';
import sound from '../utils/sound';

// ─── 1. Giant Chunky 3D Extruded Block Letters "DAISY CHAWLA" at Spawn Plaza (Screenshot 2 Match!) ───
function Giant3DNameLetters() {
  const letters = 'DAISY CHAWLA'.split('');
  const setShowAboutModal = useGameStore((s) => s.setShowAboutModal);

  return (
    <group
      position={[0, 0, 21.5]}
      rotation={[0, 0.14, 0]}
      onClick={() => setShowAboutModal(true)}
      onPointerEnter={() => { document.body.style.cursor = 'pointer'; }}
      onPointerLeave={() => { document.body.style.cursor = 'default'; }}
    >
      {letters.map((char, idx) => {
        if (char === ' ') return null;
        const x = (idx - (letters.length - 1) / 2) * 1.72;
        return (
          <group key={idx} position={[x, 0, 0]}>
            {/* Extruded 3D Periwinkle-Violet Backing Block */}
            <mesh position={[0, 1.15, -0.22]} castShadow receiveShadow>
              <boxGeometry args={[1.45, 2.3, 0.68]} />
              <meshStandardMaterial
                color="#818cf8"
                emissive="#6366f1"
                emissiveIntensity={0.35}
                roughness={0.35}
              />
            </mesh>
            {/* Bright Lavender-White Front 3D Letter */}
            <Text
              position={[0, 1.18, 0.16]}
              fontSize={2.15}
              color="#e0e7ff"
              anchorX="center"
              anchorY="middle"
              outlineWidth={0.06}
              outlineColor="#4338ca"
            >
              {char}
            </Text>
            {/* Back-side 3D Letter so it is readable from both sides */}
            <Text
              position={[0, 1.18, -0.6]}
              rotation={[0, Math.PI, 0]}
              fontSize={2.15}
              color="#c7d2fe"
              anchorX="center"
              anchorY="middle"
              outlineWidth={0.06}
              outlineColor="#312e81"
            >
              {char}
            </Text>
          </group>
        );
      })}

      {/* Decorative Stacked Wooden/Copper Crates next to Name (Screenshot 2!) */}
      <group position={[11.8, 0, -1.8]}>
        {[
          [0, 0.6, 0, 0.1],
          [1.3, 0.6, 0.4, -0.2],
          [0.6, 1.8, 0.2, 0.25],
        ].map(([cx, cy, cz, rot], i) => (
          <mesh key={i} position={[cx, cy, cz]} rotation={[0, rot, 0]} castShadow>
            <boxGeometry args={[1.15, 1.15, 1.15]} />
            <meshStandardMaterial color="#d97757" roughness={0.5} />
          </mesh>
        ))}
      </group>

      {/* Roofed Noticeboard Kiosk with Shingled Roof & White Diamond Marker (Screenshot 2!) */}
      <group position={[9.5, 0, -6.5]} rotation={[0, -0.28, 0]}>
        <mesh position={[-1.6, 1.6, 0]} castShadow>
          <boxGeometry args={[0.28, 3.2, 0.28]} />
          <meshStandardMaterial color="#583868" />
        </mesh>
        <mesh position={[1.6, 1.6, 0]} castShadow>
          <boxGeometry args={[0.28, 3.2, 0.28]} />
          <meshStandardMaterial color="#583868" />
        </mesh>
        {/* Noticeboard Backing */}
        <mesh position={[0, 1.85, 0]} castShadow>
          <boxGeometry args={[3.1, 2.0, 0.22]} />
          <meshStandardMaterial color="#b45309" />
        </mesh>
        {/* Burgundy Shingled Roof */}
        <mesh position={[0, 3.15, 0]} rotation={[0.2, 0, 0]} castShadow>
          <boxGeometry args={[3.8, 0.65, 1.25]} />
          <meshStandardMaterial color="#881337" roughness={0.6} />
        </mesh>
        <Text position={[0, 2.1, 0.15]} fontSize={0.28} color="#fef08a" anchorX="center">
          PORTFOLIO DIRECTORY
        </Text>
        <Text position={[0, 1.6, 0.15]} fontSize={0.2} color="#ffffff" anchorX="center" maxWidth={2.7} textAlign="center">
          Drive North for Projects & Timeline • Press [M] for Map
        </Text>
        {/* Floating White Diamond ◆ Badge */}
        <mesh position={[0, 0.65, 0.35]} rotation={[0, 0, Math.PI / 4]}>
          <planeGeometry args={[0.45, 0.45]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      </group>
    </group>
  );
}

// ─── 2. Floor Career Timeline Lanes (2023–2027) with Large 3D Text on Floor & Standing 3D Signs! ───
function FloorCareerTimeline() {
  const setActiveExperience = useGameStore((s) => s.setActiveExperience);
  const setShowAboutModal = useGameStore((s) => s.setShowAboutModal);

  const lanes = [
    {
      year: '2023',
      color: '#38bdf8',
      x: 9.2,
      zStart: 5.5,
      zEnd: -30,
      laneTitle: 'EDUCATION & CORE CS',
      nodes: [
        {
          z: -2,
          yearTag: '2023',
          title: 'B.TECH CSE @ PCTE',
          subtitle: 'CGPA 8.39 / 10 • Dean’s List',
          expIdx: 0,
        },
        {
          z: -13,
          yearTag: '2024',
          title: 'ACMEGRADE INTERN',
          subtitle: 'Web Development • HTML/CSS/JS',
          expIdx: 4,
        },
        {
          z: -24,
          yearTag: '2026',
          title: 'DSA & AI SPECIALIZATION',
          subtitle: 'Java • Python • TensorFlow',
          expIdx: 0,
        },
      ],
    },
    {
      year: '2024',
      color: '#e879f9',
      x: 15.0,
      zStart: 5.5,
      zEnd: -30,
      laneTitle: 'LEADERSHIP & OPEN SOURCE',
      nodes: [
        {
          z: -6,
          yearTag: '2025',
          title: 'GSSoC ’25 CONTRIBUTOR',
          subtitle: 'GirlScript Summer of Code',
          expIdx: 2,
        },
        {
          z: -18,
          yearTag: '2025',
          title: 'GOOGLE AMBASSADOR',
          subtitle: 'Campus AI Workshops & Hackathons',
          expIdx: 0,
        },
      ],
    },
    {
      year: '2025',
      color: '#fbbf24',
      x: 20.8,
      zStart: 5.5,
      zEnd: -30,
      laneTitle: 'AI/ML & JAVA INTERNSHIPS',
      nodes: [
        {
          z: -3,
          yearTag: '2025',
          title: 'DIGIMANTRA LABS',
          subtitle: 'Java Developer Intern • REST APIs',
          expIdx: 3,
        },
        {
          z: -14,
          yearTag: '2025',
          title: 'IIT ROORKEE AI/ML',
          subtitle: '92% CNN Model • Deep Learning',
          expIdx: 1,
        },
        {
          z: -25,
          yearTag: '2025–26',
          title: 'HACKATHON FINALIST',
          subtitle: 'Thapar • NIT Delhi • Code for Bharat',
          expIdx: 1,
        },
      ],
    },
  ];

  return (
    <group position={[0, 0.08, 0]}>
      {/* Giant Standing 3D Header Arch + Floor Banner for Career Timeline */}
      <group position={[15.0, 0, 9.2]}>
        <mesh position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[17.5, 2.8]} />
          <meshStandardMaterial color="#1e1035" emissive="#a855f7" emissiveIntensity={0.45} />
        </mesh>
        <Text
          position={[0, 0.08, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.85}
          color="#fef08a"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.04}
          outlineColor="#000000"
        >
          DAISY CAREER TIMELINE (2023 — 2027)
        </Text>
        {/* Standing 3D Title above Timeline Entrance so you can read it from afar */}
        <Billboard position={[0, 3.6, 0]}>
          <Text
            fontSize={0.92}
            color="#fef08a"
            outlineWidth={0.06}
            outlineColor="#1e1035"
            anchorX="center"
          >
            ✨ CAREER TIMELINE LANES (2023–2027)
          </Text>
          <Text
            position={[0, -0.75, 0]}
            fontSize={0.42}
            color="#e0e7ff"
            outlineWidth={0.04}
            outlineColor="#000000"
            anchorX="center"
          >
            Drive along the glowing floor lanes or click any 3D milestone board!
          </Text>
        </Billboard>
      </group>

      {lanes.map((lane) => {
        const len = Math.abs(lane.zEnd - lane.zStart);
        const midZ = (lane.zStart + lane.zEnd) / 2;
        return (
          <group key={lane.year}>
            {/* Year Start Slab ("2023", "2024", "2025" like "2008" in Bruno Simon!) */}
            <group
              position={[lane.x, 0.03, lane.zStart]}
              onClick={() => setShowAboutModal(true)}
              onPointerEnter={() => { document.body.style.cursor = 'pointer'; }}
              onPointerLeave={() => { document.body.style.cursor = 'default'; }}
            >
              <mesh rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[4.2, 2.1]} />
                <meshStandardMaterial color="#1e1035" />
              </mesh>
              <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[1.25, 1.45, 4]} />
                <meshStandardMaterial color={lane.color} emissive={lane.color} emissiveIntensity={2.2} />
              </mesh>
              <Text
                position={[0, 0.05, -0.15]}
                rotation={[-Math.PI / 2, 0, 0]}
                fontSize={1.05}
                color="#ffffff"
                anchorX="center"
                anchorY="middle"
                outlineWidth={0.04}
                outlineColor="#000000"
              >
                {lane.year}
              </Text>
              <Text
                position={[0, 0.05, 0.68]}
                rotation={[-Math.PI / 2, 0, 0]}
                fontSize={0.26}
                color={lane.color}
                anchorX="center"
                anchorY="middle"
              >
                {lane.laneTitle}
              </Text>
            </group>

            {/* Glowing Colored Lane Line on Floor */}
            <mesh position={[lane.x, 0.03, midZ]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[0.52, len]} />
              <meshStandardMaterial
                color={lane.color}
                emissive={lane.color}
                emissiveIntensity={2.6}
              />
            </mesh>
            <mesh position={[lane.x, 0.015, midZ]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[0.98, len + 0.5]} />
              <meshStandardMaterial color="#1e1035" />
            </mesh>

            {/* Interactive Glowing Square Nodes + Standing 3D Readable Milestone Boards */}
            {lane.nodes.map((node, nIdx) => (
              <group
                key={nIdx}
                position={[lane.x, 0.05, node.z]}
                onClick={() => {
                  const exp = resumeData.experience[node.expIdx] || resumeData.experience[0];
                  setActiveExperience(exp);
                }}
                onPointerEnter={() => { document.body.style.cursor = 'pointer'; }}
                onPointerLeave={() => { document.body.style.cursor = 'default'; }}
              >
                {/* Glowing Square Floor Node */}
                <mesh rotation={[-Math.PI / 2, 0, 0]}>
                  <planeGeometry args={[1.7, 1.7]} />
                  <meshStandardMaterial
                    color={lane.color}
                    emissive={lane.color}
                    emissiveIntensity={3.0}
                  />
                </mesh>
                <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                  <planeGeometry args={[0.92, 0.92]} />
                  <meshStandardMaterial color="#1e1035" />
                </mesh>

                {/* Large Floor 3D Text directly in front of node */}
                <Text
                  position={[0, 0.06, 1.55]}
                  rotation={[-Math.PI / 2, 0, 0]}
                  fontSize={0.42}
                  color="#ffffff"
                  outlineWidth={0.04}
                  outlineColor="#000000"
                  anchorX="center"
                >
                  {node.title}
                </Text>

                {/* Standing Angled 3D Signboard so you can read the full text from normal driving view! */}
                <group position={[0, 1.35, -0.9]} rotation={[-0.2, 0, 0]}>
                  <mesh castShadow>
                    <boxGeometry args={[4.4, 1.55, 0.14]} />
                    <meshStandardMaterial
                      color="#1e1035"
                      emissive={lane.color}
                      emissiveIntensity={0.22}
                    />
                  </mesh>
                  <mesh position={[0, 0.8, 0.02]}>
                    <boxGeometry args={[4.5, 0.1, 0.18]} />
                    <meshStandardMaterial color={lane.color} emissive={lane.color} emissiveIntensity={2} />
                  </mesh>
                  <Text
                    position={[0, 0.42, 0.1]}
                    fontSize={0.24}
                    color={lane.color}
                    anchorX="center"
                  >
                    {node.yearTag} • CLICK FOR CERTIFICATE
                  </Text>
                  <Text
                    position={[0, 0.02, 0.1]}
                    fontSize={0.36}
                    color="#ffffff"
                    anchorX="center"
                    outlineWidth={0.02}
                    outlineColor="#000"
                  >
                    {node.title}
                  </Text>
                  <Text
                    position={[0, -0.42, 0.1]}
                    fontSize={0.23}
                    color="#fde68a"
                    anchorX="center"
                  >
                    {node.subtitle}
                  </Text>
                </group>
              </group>
            ))}
          </group>
        );
      })}
    </group>
  );
}

// ─── 3. Fun Reactive Props with Proximity Speech Bubbles ("Yay I love lemons!", "LOVE IT!!", etc.) ───
const FUN_PROPS_DATA = [
  {
    id: 'lemon-stand',
    pos: [-6.8, 0, 15.2],
    color: '#facc15',
    accent: '#84cc16',
    type: 'lemon',
    bubble: '🍋 YAY! I love lemons! Fresh 5V citrus power squeezed daily!',
  },
  {
    id: 'spawn-lantern-love',
    pos: [-9.2, 0, 11.2],
    color: '#fb923c',
    accent: '#e879f9',
    type: 'badge',
    bubble: '🇨🇦 LOVE IT!! Sit on the heatsink bench & enjoy the sunset!',
  },
  {
    id: 'coffee-mug',
    pos: [6.8, 0, -5.5],
    color: '#f97316',
    accent: '#fef08a',
    type: 'coffee',
    bubble: '☕ 99% Iced Coffee + 1% Java & React = Daisy’s Code!',
  },
  {
    id: 'coolant-duck',
    pos: [25.0, 0.15, -22.5],
    color: '#facc15',
    accent: '#fb923c',
    type: 'duck',
    bubble: '🦆 Quack quack! The liquid coolant lake is a soothing 32°C!',
  },
  {
    id: 'mascot-bot',
    pos: [6.5, 0, -22.5],
    color: '#38bdf8',
    accent: '#e879f9',
    type: 'robot',
    bubble: '🤖 Beep Boop! CGPA 8.39 detected — certified big brain energy!',
  },
  {
    id: 'hackathon-pizza',
    pos: [-8.5, 0, -24.5],
    color: '#ef4444',
    accent: '#facc15',
    type: 'pizza',
    bubble: '🍕 Late-night Hackathon Pizza! 36 hours of non-stop shipping!',
  },
  {
    id: 'cherry-tree-talk',
    pos: [-11.5, 0, 12.5],
    color: '#f472b6',
    accent: '#fef08a',
    type: 'badge',
    bubble: '🌸 Wheee! Watch the pink blossom bits floating in the breeze!',
  },
  {
    id: 'bridge-guard',
    pos: [-16.5, 0, 19.0],
    color: '#2dd4bf',
    accent: '#fef08a',
    type: 'badge',
    bubble: '🌉 Clack-clack! Crossing the Ribbon-Cable Coolant Bridge!',
  },
];

function FunReactiveProps() {
  const [activeId, setActiveId] = useState(null);
  const lastSoundId = useRef(null);
  const groupRefs = useRef({});

  useFrame((state) => {
    const [rx, , rz] = useGameStore.getState().roverPosition;
    const t = state.clock.elapsedTime;
    let closest = null;
    let minDist = 11.5;

    for (const p of FUN_PROPS_DATA) {
      const d = Math.hypot(rx - p.pos[0], rz - p.pos[2]);
      if (d < minDist) {
        minDist = d;
        closest = p.id;
      }
      const g = groupRefs.current[p.id];
      if (g) {
        const isNear = d < 11.5;
        g.position.y = p.pos[1] + (isNear ? Math.abs(Math.sin(t * 6)) * 0.45 : Math.sin(t * 2 + p.pos[0]) * 0.08);
      }
    }

    if (closest !== activeId) {
      setActiveId(closest);
      if (closest && closest !== lastSoundId.current) {
        lastSoundId.current = closest;
        sound.playBitCollect(6);
      }
    }
  });

  return (
    <group>
      {FUN_PROPS_DATA.map((p) => {
        const isNear = activeId === p.id;
        return (
          <group
            key={p.id}
            position={p.pos}
            ref={(el) => { groupRefs.current[p.id] = el; }}
            onClick={() => {
              sound.playBitCollect(8);
              useGameStore.getState().showToast(p.bubble);
            }}
            onPointerEnter={() => { document.body.style.cursor = 'pointer'; }}
            onPointerLeave={() => { document.body.style.cursor = 'default'; }}
          >
            {/* 3D Prop Geometry based on type */}
            {p.type === 'lemon' && (
              <group>
                {/* Wooden Lemon Crate */}
                <mesh position={[0, 0.55, 0]} castShadow>
                  <boxGeometry args={[1.6, 1.1, 1.6]} />
                  <meshStandardMaterial color="#d97736" roughness={0.5} />
                </mesh>
                {/* Giant Bright Yellow 3D Lemons on Top */}
                {[
                  [-0.35, 1.35, -0.2],
                  [0.35, 1.35, 0.2],
                  [0, 1.55, 0],
                ].map(([lx, ly, lz], i) => (
                  <mesh key={i} position={[lx, ly, lz]} scale={[1.25, 0.9, 0.9]} castShadow>
                    <sphereGeometry args={[0.38, 14, 14]} />
                    <meshStandardMaterial color="#facc15" emissive="#eab308" emissiveIntensity={0.45} />
                  </mesh>
                ))}
              </group>
            )}

            {p.type === 'coffee' && (
              <group>
                {/* Giant Glowing Developer Mug */}
                <mesh position={[0, 0.95, 0]} castShadow>
                  <cylinderGeometry args={[0.72, 0.62, 1.9, 18]} />
                  <meshStandardMaterial color="#f97316" roughness={0.3} />
                </mesh>
                <mesh position={[0, 1.86, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                  <circleGeometry args={[0.66, 16]} />
                  <meshBasicMaterial color="#451a03" />
                </mesh>
              </group>
            )}

            {p.type === 'duck' && (
              <group rotation={[0, -0.5, 0]}>
                {/* Giant Yellow Rubber Duck in the Coolant Pond */}
                <mesh position={[0, 0.55, 0]} scale={[1.2, 0.85, 1.4]} castShadow>
                  <sphereGeometry args={[0.95, 16, 16]} />
                  <meshStandardMaterial color="#facc15" emissive="#f59e0b" emissiveIntensity={0.3} />
                </mesh>
                <mesh position={[0, 1.45, 0.65]} castShadow>
                  <sphereGeometry args={[0.58, 16, 16]} />
                  <meshStandardMaterial color="#facc15" />
                </mesh>
                <mesh position={[0, 1.4, 1.25]} rotation={[Math.PI / 2, 0, 0]}>
                  <coneGeometry args={[0.28, 0.5, 8]} />
                  <meshStandardMaterial color="#f97316" />
                </mesh>
              </group>
            )}

            {p.type === 'robot' && (
              <group>
                {/* Cute AI Mascot Bot */}
                <mesh position={[0, 0.8, 0]} castShadow>
                  <boxGeometry args={[1.3, 1.4, 1.1]} />
                  <meshStandardMaterial color="#38bdf8" metalness={0.5} roughness={0.3} />
                </mesh>
                <mesh position={[0, 1.95, 0]} castShadow>
                  <boxGeometry args={[1.1, 0.9, 0.95]} />
                  <meshStandardMaterial color="#e0f2fe" />
                </mesh>
                {[-0.25, 0.25].map((ex, i) => (
                  <mesh key={i} position={[ex, 2.0, 0.49]}>
                    <sphereGeometry args={[0.12, 8, 8]} />
                    <meshStandardMaterial color="#e879f9" emissive="#e879f9" emissiveIntensity={3} />
                  </mesh>
                ))}
              </group>
            )}

            {p.type === 'pizza' && (
              <group>
                {/* Stacked Hackathon Pizza Boxes */}
                {[0.2, 0.45, 0.7].map((py, i) => (
                  <mesh key={i} position={[0, py, 0]} rotation={[0, i * 0.2, 0]} castShadow>
                    <boxGeometry args={[1.8, 0.2, 1.8]} />
                    <meshStandardMaterial color={i % 2 === 0 ? '#fef08a' : '#ef4444'} />
                  </mesh>
                ))}
              </group>
            )}

            {/* Floating Speech Bubble Above Prop (Always shows a subtle tag; pops up BIG when car drives near!) */}
            <Billboard position={[0, isNear ? 4.2 : 3.2, 0]}>
              {isNear ? (
                <group>
                  <mesh position={[0, 0, -0.04]}>
                    <planeGeometry args={[7.4, 1.35]} />
                    <meshBasicMaterial color="#1e1035" />
                  </mesh>
                  <mesh position={[0, 0, -0.06]}>
                    <planeGeometry args={[7.6, 1.5]} />
                    <meshBasicMaterial color={p.color} />
                  </mesh>
                  <Text
                    fontSize={0.36}
                    color="#ffffff"
                    anchorX="center"
                    anchorY="middle"
                    maxWidth={7.0}
                    textAlign="center"
                  >
                    {p.bubble}
                  </Text>
                </group>
              ) : (
                <Text
                  fontSize={0.38}
                  color="#fef08a"
                  outlineWidth={0.04}
                  outlineColor="#1e1035"
                  anchorX="center"
                >
                  💬 Drive near me!
                </Text>
              )}
            </Billboard>
          </group>
        );
      })}
    </group>
  );
}

// ─── 4. Stepping Tiles Path on Floor ─────────────────────────────────────────
function SteppingTilesPath() {
  const tiles = useMemo(
    () => [
      [-6.5, 14],
      [-7.2, 11.2],
      [-6.4, 8.4],
      [-7.0, 5.6],
      [-6.2, 2.8],
      [6.2, 14],
      [7.0, 11.2],
      [6.4, 8.4],
      [-5.5, -18],
      [-6.2, -21],
      [-5.4, -24],
      [-6.0, -27],
      [-5.2, -30],
    ],
    []
  );

  return (
    <group>
      {tiles.map(([tx, tz], i) => (
        <mesh
          key={i}
          position={[tx, 0.06, tz]}
          rotation={[-Math.PI / 2, 0, (i % 3 - 1) * 0.18]}
          receiveShadow
        >
          <planeGeometry args={[1.65, 1.35]} />
          <meshStandardMaterial
            color="#f5d0fe"
            emissive="#c084fc"
            emissiveIntensity={0.22}
            roughness={0.5}
          />
        </mesh>
      ))}
    </group>
  );
}

// ─── 5. Turquoise Liquid-Cooling Ponds & Ribbon-Cable Bridge ─────────────────
function CoolantPondsAndBridge() {
  const ponds = [
    { pos: [27, 0.03, -24], rx: 8.5, rz: 6.5 },
    { pos: [-24, 0.03, 22], rx: 9.0, rz: 6.8 },
    { pos: [-25, 0.03, -24], rx: 7.2, rz: 5.8 },
  ];

  return (
    <group>
      {ponds.map((p, idx) => (
        <group key={idx} position={p.pos}>
          <mesh rotation={[-Math.PI / 2, 0, 0]} scale={[p.rx * 1.12, p.rz * 1.12, 1]}>
            <circleGeometry args={[1, 32]} />
            <meshStandardMaterial
              color="#a5f3fc"
              emissive="#22d3ee"
              emissiveIntensity={1.6}
              transparent
              opacity={0.88}
            />
          </mesh>
          <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={[p.rx, p.rz, 1]}>
            <circleGeometry args={[1, 32]} />
            <meshStandardMaterial
              color="#06b6d4"
              emissive="#0891b2"
              emissiveIntensity={0.75}
              roughness={0.15}
              metalness={0.7}
            />
          </mesh>
        </group>
      ))}

      {/* Wooden / Copper Ribbon-Cable Bridge over SW Pond Edge */}
      <group position={[-16.5, 0.22, 19]} rotation={[0, 0.35, 0]}>
        {Array.from({ length: 7 }).map((_, i) => (
          <mesh key={i} position={[0, 0, (i - 3) * 0.95]} castShadow receiveShadow>
            <boxGeometry args={[4.2, 0.18, 0.72]} />
            <meshStandardMaterial color="#e07a5f" roughness={0.5} metalness={0.25} />
          </mesh>
        ))}
        {[-2.0, 2.0].map((bx, i) => (
          <mesh key={i} position={[bx, 0.45, 0]} castShadow>
            <boxGeometry args={[0.18, 0.7, 6.6]} />
            <meshStandardMaterial color="#6d4c7d" roughness={0.6} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

// ─── 6. Soothing & Vibrant Voxel Capacitor Trees ─────────────────────────────
function VoxelCapacitorTrees() {
  const trees = useMemo(
    () => [
      { pos: [-11.5, 0, 12.5], color: '#f472b6', scale: 1.15 },
      { pos: [11.5, 0, 13.5], color: '#c084fc', scale: 1.05 },
      { pos: [-13.5, 0, -11.5], color: '#fb923c', scale: 1.1 },
      { pos: [25.5, 0, -11.5], color: '#f472b6', scale: 1.2 },
      { pos: [33.5, 0, -26.5], color: '#a3e635', scale: 1.25 },
      { pos: [22.5, 0, -33.5], color: '#f472b6', scale: 1.0 },
      { pos: [36.5, 0, 12.5], color: '#fb923c', scale: 1.15 },
      { pos: [-32, 0, -44], color: '#f472b6', scale: 1.25 },
      { pos: [32, 0, -44], color: '#facc15', scale: 1.2 },
      { pos: [-31.5, 0, 26.5], color: '#a3e635', scale: 1.2 },
      { pos: [-18.5, 0, 28.5], color: '#f472b6', scale: 1.05 },
      { pos: [-34.5, 0, -24.5], color: '#fb923c', scale: 1.15 },
    ],
    []
  );

  const crownOffsets = [
    [0, 3.8, 0, 2.2],
    [-1.1, 3.3, 0.6, 1.65],
    [1.1, 3.4, -0.5, 1.7],
    [0.5, 4.5, 0.6, 1.55],
    [-0.6, 4.3, -0.7, 1.5],
  ];

  return (
    <group>
      {trees.map((t, i) => (
        <group key={i} position={t.pos} scale={t.scale}>
          <mesh position={[0, 1.5, 0]} castShadow>
            <cylinderGeometry args={[0.36, 0.48, 3.0, 10]} />
            <meshStandardMaterial color="#4a2c40" roughness={0.7} metalness={0.2} />
          </mesh>
          {crownOffsets.map(([ox, oy, oz, s], cIdx) => (
            <mesh key={cIdx} position={[ox, oy, oz]} castShadow receiveShadow>
              <dodecahedronGeometry args={[s * 0.78, 1]} />
              <meshStandardMaterial
                color={t.color}
                emissive={t.color}
                emissiveIntensity={0.28}
                roughness={0.55}
              />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}

// ─── 7. Heatsink Park Benches, Glowing Cage Lanterns & Directional Signposts ─
function ParkBenchesLanternsAndSignposts() {
  const setTeleportTo = useGameStore((s) => s.setTeleportTo);

  const benchesAndLanterns = [
    { pos: [-9.2, 0, 11.2], rot: 0.45 },
    { pos: [6.8, 0, -12.5], rot: -0.4 },
    { pos: [-10.5, 0, -34.5], rot: 0.2 },
    { pos: [24.5, 0, 14.5], rot: -0.6 },
  ];

  const signposts = [
    {
      pos: [-7.5, 0, -10.5],
      blades: [
        { text: '↑ GPU PROJECTS', color: '#a855f7', target: [0, 2.6, -40] },
        { text: '→ CAREER TIMELINE', color: '#38bdf8', target: [15, 2.6, 8] },
        { text: '← EXPANSION BUS', color: '#f59e0b', target: [-36, 2.6, -8] },
      ],
    },
    {
      pos: [7.8, 0, 12.5],
      blades: [
        { text: '→ RAM SKILLS ALLEY', color: '#06b6d4', target: [36, 2.6, -8] },
        { text: '↓ PSU RESUME BAY', color: '#ef4444', target: [28, 2.6, 28] },
      ],
    },
  ];

  return (
    <group>
      {benchesAndLanterns.map((item, idx) => (
        <group key={idx} position={item.pos} rotation={[0, item.rot, 0]}>
          <group position={[0, 0, 0]}>
            <mesh position={[0, 0.55, 0]} castShadow>
              <boxGeometry args={[2.8, 0.16, 0.95]} />
              <meshStandardMaterial color="#e07a5f" roughness={0.5} />
            </mesh>
            <mesh position={[0, 1.15, -0.42]} rotation={[0.12, 0, 0]} castShadow>
              <boxGeometry args={[2.8, 0.95, 0.14]} />
              <meshStandardMaterial color="#d97757" roughness={0.5} />
            </mesh>
            {[-1.15, 1.15].map((lx, lIdx) => (
              <mesh key={lIdx} position={[lx, 0.45, 0]} castShadow>
                <boxGeometry args={[0.18, 0.9, 0.98]} />
                <meshStandardMaterial color="#4c1d95" metalness={0.6} roughness={0.4} />
              </mesh>
            ))}
          </group>

          {/* Warm Glowing Cage Lantern beside Bench */}
          <group position={[-2.1, 0, 0.35]}>
            <mesh position={[0, 1.1, 0]} castShadow>
              <cylinderGeometry args={[0.12, 0.22, 2.2, 8]} />
              <meshStandardMaterial color="#4c1d95" metalness={0.7} roughness={0.3} />
            </mesh>
            <mesh position={[0, 2.35, 0]}>
              <boxGeometry args={[0.56, 0.68, 0.56]} />
              <meshStandardMaterial color="#fef08a" emissive="#fb923c" emissiveIntensity={4.2} />
            </mesh>
            <mesh position={[0, 2.78, 0]}>
              <coneGeometry args={[0.52, 0.32, 4]} />
              <meshStandardMaterial color="#4c1d95" />
            </mesh>
          </group>
        </group>
      ))}

      {/* Clickable Multi-Blade Arrow Signposts */}
      {signposts.map((sp, idx) => (
        <group key={idx} position={sp.pos}>
          <mesh position={[0, 1.8, 0]} castShadow>
            <cylinderGeometry args={[0.14, 0.16, 3.6, 8]} />
            <meshStandardMaterial color="#4c1d95" metalness={0.6} roughness={0.4} />
          </mesh>
          {sp.blades.map((b, bIdx) => (
            <group
              key={bIdx}
              position={[0, 3.1 - bIdx * 0.62, 0]}
              onClick={() => setTeleportTo(b.target, b.text)}
              onPointerEnter={() => { document.body.style.cursor = 'pointer'; }}
              onPointerLeave={() => { document.body.style.cursor = 'default'; }}
            >
              <mesh castShadow>
                <boxGeometry args={[3.2, 0.46, 0.14]} />
                <meshStandardMaterial color="#e07a5f" roughness={0.5} />
              </mesh>
              <Text
                position={[0, 0, 0.09]}
                fontSize={0.24}
                color="#ffffff"
                outlineWidth={0.02}
                outlineColor="#000"
              >
                {b.text}
              </Text>
            </group>
          ))}
        </group>
      ))}
    </group>
  );
}

// ─── 8. Swaying Pin-Header Grass Tufts ───────────────────────────────────────
function SwayingGrassTufts() {
  const instRef = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const colorObj = useMemo(() => new THREE.Color(), []);

  const tufts = useMemo(() => {
    const list = [];
    const centers = [
      [-11.5, 12.5],
      [11.5, 13.5],
      [-13.5, -11.5],
      [25.5, -11.5],
      [27, -24],
      [-24, 22],
      [-9, 11],
      [6.8, -12.5],
    ];
    centers.forEach(([cx, cz], cIdx) => {
      for (let i = 0; i < 18; i++) {
        const a = (i / 18) * Math.PI * 2 + (i % 3) * 0.3;
        const r = 1.6 + (i % 5) * 0.85;
        list.push({
          x: cx + Math.cos(a) * r,
          z: cz + Math.sin(a) * r,
          h: 0.55 + (i % 3) * 0.25,
          phase: cIdx + i * 0.4,
          color: i % 3 === 0 ? '#a3e635' : '#65a30d',
        });
      }
    });
    return list;
  }, []);

  useFrame((state) => {
    if (!instRef.current) return;
    const t = state.clock.elapsedTime;
    const [rx, , rz] = useGameStore.getState().roverPosition;

    for (let i = 0; i < tufts.length; i++) {
      const g = tufts[i];
      const dist = Math.hypot(rx - g.x, rz - g.z);
      const flatten = dist < 2.4 ? 0.35 : 1;
      dummy.position.set(g.x, (g.h * flatten) / 2, g.z);
      dummy.rotation.set(
        Math.sin(t * 2.2 + g.phase) * 0.14 + (dist < 2.4 ? 0.6 : 0),
        g.phase,
        Math.cos(t * 1.8 + g.phase) * 0.12
      );
      dummy.scale.set(0.28, g.h * flatten, 0.28);
      dummy.updateMatrix();
      instRef.current.setMatrixAt(i, dummy.matrix);
      colorObj.set(g.color);
      instRef.current.setColorAt(i, colorObj);
    }
    instRef.current.instanceMatrix.needsUpdate = true;
    if (instRef.current.instanceColor) instRef.current.instanceColor.needsUpdate = true;
  });

  return (
    <instancedMesh ref={instRef} args={[null, null, tufts.length]}>
      <coneGeometry args={[0.6, 1.2, 5]} />
      <meshStandardMaterial color="#84cc16" roughness={0.7} />
    </instancedMesh>
  );
}

// ─── 9. Runway Road LEDs ─────────────────────────────────────────────────────
function RunwayRoadLeds() {
  const instRef = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const colorObj = useMemo(() => new THREE.Color(), []);

  const ledCoords = useMemo(() => {
    const pts = [];
    for (let d = 14; d <= 30; d += 4) {
      pts.push([-3.5, -d], [3.5, -d]);
      pts.push([-3.5, d], [3.5, d]);
      pts.push([d, -3.5], [d, 3.5]);
      pts.push([-d, -3.5], [-d, 3.5]);
    }
    return pts;
  }, []);

  useFrame(() => {
    if (!instRef.current) return;
    const [rx, , rz] = useGameStore.getState().roverPosition;

    for (let i = 0; i < ledCoords.length; i++) {
      const [lx, lz] = ledCoords[i];
      const dist = Math.hypot(rx - lx, rz - lz);
      const isLit = dist < 14;
      const s = isLit ? 1.4 : 0.85;
      dummy.position.set(lx, 0.14, lz);
      dummy.scale.set(s, s, s);
      dummy.updateMatrix();
      instRef.current.setMatrixAt(i, dummy.matrix);
      colorObj.set(isLit ? '#00ffcc' : '#312e81');
      instRef.current.setColorAt(i, colorObj);
    }
    instRef.current.instanceMatrix.needsUpdate = true;
    if (instRef.current.instanceColor) instRef.current.instanceColor.needsUpdate = true;
  });

  return (
    <instancedMesh ref={instRef} args={[null, null, ledCoords.length]}>
      <boxGeometry args={[0.35, 0.16, 0.35]} />
      <meshStandardMaterial color="#ffffff" emissive="#00ffcc" emissiveIntensity={2} />
    </instancedMesh>
  );
}

export default function ScatterProps() {
  return (
    <group>
      <Giant3DNameLetters />
      <FloorCareerTimeline />
      <FunReactiveProps />
      <SteppingTilesPath />
      <CoolantPondsAndBridge />
      <VoxelCapacitorTrees />
      <ParkBenchesLanternsAndSignposts />
      <SwayingGrassTufts />
      <RunwayRoadLeds />
    </group>
  );
}
