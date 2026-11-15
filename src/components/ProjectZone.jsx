import { useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Billboard } from '@react-three/drei';
import { RigidBody } from '@react-three/rapier';
import useGameStore from '../stores/gameStore';
import projects from '../data/projects.json';
import TriggerPad from './TriggerPad';
import sound from '../utils/sound';

// Live Interactive Framed Project Station matching Screenshot 3 (Ref 3)!
function FramedProjectBillboard({
  project: initialProject,
  projectIndex: initialIndex,
  position,
  showSideProps = true,
}) {
  const [localProjIdx, setLocalProjIdx] = useState(initialIndex);
  const [slideIdx, setSlideIdx] = useState(0);
  const [bellMsg, setBellMsg] = useState(null);
  const portalRingRef = useRef();
  const fansRef = useRef([]);

  const setActiveProject = useGameStore((s) => s.setActiveProject);
  const focusProjectStation = useGameStore((s) => s.focusProjectStation);
  const exitProjectStation = useGameStore((s) => s.exitProjectStation);
  const cameraMode = useGameStore((s) => s.cameraMode);
  const focusedStation = useGameStore((s) => s.focusedStation);
  const globalSlideIdx = useGameStore((s) => s.stationSlideIndex);

  const project = projects[localProjIdx] || initialProject;
  const prevProject = projects[(localProjIdx - 1 + projects.length) % projects.length];
  const nextProject = projects[(localProjIdx + 1) % projects.length];

  const isStationFocused =
    cameraMode === 'station' &&
    focusedStation &&
    Math.hypot(focusedStation.position[0] - position[0], focusedStation.position[2] - position[2]) < 2;

  const activeSlide = isStationFocused ? globalSlideIdx : slideIdx;

  const handleNextSlide = (e) => {
    e?.stopPropagation?.();
    if (isStationFocused) {
      useGameStore.getState().nextStationSlide(4);
    } else {
      sound.playBitCollect(4);
      setSlideIdx((s) => (s + 1) % 4);
    }
  };

  const handlePrevSlide = (e) => {
    e?.stopPropagation?.();
    if (isStationFocused) {
      useGameStore.getState().prevStationSlide(4);
    } else {
      sound.playBitCollect(2);
      setSlideIdx((s) => (s - 1 + 4) % 4);
    }
  };

  const handleSwitchProject = (dir, e) => {
    e?.stopPropagation?.();
    sound.playChime();
    setLocalProjIdx((idx) => (idx + dir + projects.length) % projects.length);
    setSlideIdx(0);
  };

  useFrame((state, delta) => {
    if (portalRingRef.current) {
      portalRingRef.current.rotation.z += delta * 1.4;
    }
    fansRef.current.forEach((fan, fIdx) => {
      if (fan) fan.rotation.z += delta * (2.6 + fIdx * 0.4);
    });
  });

  const shortUrl = project.liveUrl?.includes('justiceflow')
    ? 'JUSTICEFLOW-THREE.VERCEL.APP'
    : 'GITHUB.COM/AMYRA01';

  return (
    <group position={position}>
      {/* Main Framed Billboard Collider */}
      <RigidBody type="fixed" colliders="cuboid">
        <mesh position={[0, 4.4, 0]} castShadow receiveShadow>
          <boxGeometry args={[7.6, 8.2, 0.85]} />
          <meshStandardMaterial color="#1e1035" metalness={0.35} roughness={0.45} />
        </mesh>
      </RigidBody>

      {/* Left & Right Warm Coral-Timber Frame Pillars (Screenshot 3!) */}
      {[-3.95, 3.95].map((px, i) => (
        <group key={i} position={[px, 0, 0]}>
          <mesh position={[0, 0.45, 0]} castShadow>
            <boxGeometry args={[0.98, 0.9, 1.35]} />
            <meshStandardMaterial color="#4c1d95" roughness={0.6} />
          </mesh>
          <mesh position={[0, 4.6, 0]} castShadow>
            <boxGeometry args={[0.62, 8.4, 0.82]} />
            <meshStandardMaterial color="#e07a5f" roughness={0.45} />
          </mesh>
          <mesh position={[0, 8.95, 0]} castShadow>
            <boxGeometry args={[0.88, 0.38, 1.05]} />
            <meshStandardMaterial color="#4c1d95" roughness={0.5} />
          </mesh>
        </group>
      ))}

      {/* Top Warm Timber Header Beam + Lower Sill Beam */}
      <mesh position={[0, 8.05, 0.15]} castShadow>
        <boxGeometry args={[8.3, 1.5, 0.68]} />
        <meshStandardMaterial color="#d97757" roughness={0.45} />
      </mesh>
      <mesh position={[0, 1.15, 0.15]} castShadow>
        <boxGeometry args={[8.3, 0.65, 0.74]} />
        <meshStandardMaterial color="#d97757" roughness={0.45} />
      </mesh>

      {/* Header Title & Clickable Purple Pill URL Badge (Exact Match to Screenshot 3!) */}
      <Text
        position={[0, 8.26, 0.54]}
        fontSize={0.56}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        {project.title.toUpperCase()}
      </Text>

      <group
        position={[0, 7.45, 0.56]}
        onClick={(e) => {
          e.stopPropagation();
          const url = project.liveUrl || project.githubUrl || 'https://github.com/Amyra01';
          window.open(url, '_blank', 'noopener,noreferrer');
        }}
        onPointerEnter={() => { document.body.style.cursor = 'pointer'; }}
        onPointerLeave={() => { document.body.style.cursor = 'default'; }}
      >
        <mesh>
          <planeGeometry args={[3.4, 0.48]} />
          <meshStandardMaterial color="#9333ea" emissive="#7e22ce" emissiveIntensity={0.8} />
        </mesh>
        <Text position={[0, 0, 0.03]} fontSize={0.22} color="#ffffff" anchorX="center" anchorY="middle">
          {shortUrl} ↗
        </Text>
      </group>

      {/* ── Left & Right Hanging Wooden Neighbour-Project Signboards with Purple [←] / [→] Buttons (Screenshot 3!) ── */}
      {/* Left Hanging Board (Previous Project) */}
      <group
        position={[-5.45, 6.4, 0.15]}
        onClick={(e) => handleSwitchProject(-1, e)}
        onPointerEnter={() => { document.body.style.cursor = 'pointer'; }}
        onPointerLeave={() => { document.body.style.cursor = 'default'; }}
      >
        {/* Horizontal Support Arm */}
        <mesh position={[0.7, 1.1, 0]}>
          <boxGeometry args={[2.4, 0.24, 0.24]} />
          <meshStandardMaterial color="#e07a5f" />
        </mesh>
        {/* Hanging Wooden Planks */}
        <mesh position={[0, 0.15, 0]} castShadow>
          <boxGeometry args={[2.25, 1.25, 0.18]} />
          <meshStandardMaterial color="#d97757" />
        </mesh>
        <Text position={[0, 0.18, 0.12]} fontSize={0.23} color="#ffffff" maxWidth={2.0} textAlign="center">
          {prevProject.title.toUpperCase()}
        </Text>
        {/* Purple [←] Arrow Button */}
        <mesh position={[0, -0.78, 0.05]}>
          <boxGeometry args={[0.92, 0.56, 0.18]} />
          <meshStandardMaterial color="#9333ea" emissive="#a855f7" emissiveIntensity={1.2} />
        </mesh>
        <Text position={[0, -0.78, 0.16]} fontSize={0.34} color="#ffffff">
          ←
        </Text>
      </group>

      {/* Right Hanging Board (Next Project) */}
      <group
        position={[5.45, 6.4, 0.15]}
        onClick={(e) => handleSwitchProject(1, e)}
        onPointerEnter={() => { document.body.style.cursor = 'pointer'; }}
        onPointerLeave={() => { document.body.style.cursor = 'default'; }}
      >
        <mesh position={[-0.7, 1.1, 0]}>
          <boxGeometry args={[2.4, 0.24, 0.24]} />
          <meshStandardMaterial color="#e07a5f" />
        </mesh>
        <mesh position={[0, 0.15, 0]} castShadow>
          <boxGeometry args={[2.25, 1.25, 0.18]} />
          <meshStandardMaterial color="#d97757" />
        </mesh>
        <Text position={[0, 0.18, 0.12]} fontSize={0.23} color="#ffffff" maxWidth={2.0} textAlign="center">
          {nextProject.title.toUpperCase()}
        </Text>
        {/* Purple [→] Arrow Button */}
        <mesh position={[0, -0.78, 0.05]}>
          <boxGeometry args={[0.92, 0.56, 0.18]} />
          <meshStandardMaterial color="#9333ea" emissive="#a855f7" emissiveIntensity={1.2} />
        </mesh>
        <Text position={[0, -0.78, 0.16]} fontSize={0.34} color="#ffffff">
          →
        </Text>
      </group>

      {/* ── Interactive Live 3D Multi-Slide Screen ── */}
      <group
        position={[0, 4.65, 0.48]}
        onClick={() => {
          if (!isStationFocused) {
            focusProjectStation(position, localProjIdx);
          } else {
            setActiveProject(project);
          }
        }}
        onPointerEnter={() => { document.body.style.cursor = 'pointer'; }}
        onPointerLeave={() => { document.body.style.cursor = 'default'; }}
      >
        <mesh>
          <planeGeometry args={[7.1, 4.9]} />
          <meshStandardMaterial
            color="#191636"
            emissive={project.bannerColor}
            emissiveIntensity={0.18}
          />
        </mesh>

        {/* Top-Left Slide Number Badge ("01 / Portal" like "06 / Portal" in Screenshot 3!) */}
        <Text position={[-3.15, 1.92, 0.04]} fontSize={0.52} color="#e2e8f0" anchorX="left">
          {`0${activeSlide + 1}`}
        </Text>
        <Text position={[-3.15, 1.48, 0.04]} fontSize={0.22} color="#c4b5fd" anchorX="left">
          {['Overview', 'Tech Stack', 'Key Impact', 'Live Links'][activeSlide]}
        </Text>

        {/* SLIDE 0: 3D Isometric Portal Diorama + Project Title (Matches Screenshot 3!) */}
        {activeSlide === 0 && (
          <group position={[0, 0.05, 0.06]}>
            {/* Miniature Isometric Diorama Base Platform inside Screen */}
            <group position={[-0.4, -0.35, 0.12]} rotation={[0.25, -0.45, 0]}>
              <mesh position={[0, -0.5, 0]}>
                <boxGeometry args={[3.4, 0.35, 2.4]} />
                <meshStandardMaterial color="#d9f99d" />
              </mesh>
              {/* Glowing Blue Portal Arch */}
              <mesh position={[-0.7, 0.45, -0.4]} ref={portalRingRef}>
                <torusGeometry args={[0.72, 0.14, 12, 24]} />
                <meshStandardMaterial color="#38bdf8" emissive="#0ea5e9" emissiveIntensity={2.8} />
              </mesh>
              <mesh position={[-0.7, 0.45, -0.42]}>
                <circleGeometry args={[0.62, 20]} />
                <meshBasicMaterial color="#0284c7" />
              </mesh>
              {/* Tiny fences & lanterns */}
              <mesh position={[0.6, -0.1, 0.4]}>
                <boxGeometry args={[1.2, 0.35, 0.12]} />
                <meshStandardMaterial color="#e07a5f" />
              </mesh>
            </group>

            <Text
              position={[0.4, 0.15, 0.35]}
              fontSize={0.46}
              color="#ffffff"
              anchorX="center"
              outlineWidth={0.04}
              outlineColor="#1e1035"
            >
              {project.title}
            </Text>
            <Text
              position={[0.4, -0.55, 0.35]}
              fontSize={0.25}
              color="#fde68a"
              anchorX="center"
              maxWidth={6.2}
              textAlign="center"
            >
              {project.subtitle}
            </Text>
            <Text
              position={[0, -1.55, 0.1]}
              fontSize={0.22}
              color="#a5f3fc"
              anchorX="center"
            >
              Click screen to focus • Click ◀ / ▶ below to flip slides!
            </Text>
          </group>
        )}

        {/* SLIDE 1: Architecture & Tech Stack */}
        {activeSlide === 1 && (
          <group position={[0, 0.1, 0.06]}>
            <Text position={[0, 1.15, 0.04]} fontSize={0.36} color="#fef08a" anchorX="center">
              SYSTEM ARCHITECTURE &amp; TECH STACK
            </Text>
            <Text
              position={[0, 0.25, 0.04]}
              fontSize={0.26}
              color="#ffffff"
              maxWidth={6.1}
              textAlign="center"
              anchorX="center"
            >
              {project.description}
            </Text>
            <Text
              position={[0, -0.95, 0.04]}
              fontSize={0.3}
              color="#00ffcc"
              anchorX="center"
            >
              {project.techStack.join('  •  ')}
            </Text>
          </group>
        )}

        {/* SLIDE 2: Highlights & Hackathon Impact */}
        {activeSlide === 2 && (
          <group position={[0, 0.1, 0.06]}>
            <Text position={[0, 1.2, 0.04]} fontSize={0.36} color="#f472b6" anchorX="center">
              {project.event.toUpperCase()}
            </Text>
            {(project.highlights || []).slice(0, 3).map((hl, idx) => (
              <Text
                key={idx}
                position={[0, 0.45 - idx * 0.68, 0.04]}
                fontSize={0.24}
                color="#f1f5f9"
                maxWidth={6.2}
                textAlign="center"
                anchorX="center"
              >
                • {hl}
              </Text>
            ))}
          </group>
        )}

        {/* SLIDE 3: Direct Live Demo & GitHub Launchers */}
        {activeSlide === 3 && (
          <group position={[0, 0.1, 0.08]}>
            <Text position={[0, 1.1, 0.04]} fontSize={0.38} color="#fef08a" anchorX="center">
              LAUNCH LIVE PROJECT OR VIEW CODE
            </Text>
            <group
              position={[-1.65, -0.1, 0.06]}
              onClick={(e) => {
                e.stopPropagation();
                window.open(project.liveUrl || project.githubUrl, '_blank', 'noopener,noreferrer');
              }}
            >
              <mesh>
                <planeGeometry args={[2.8, 0.85]} />
                <meshStandardMaterial color="#10b981" emissive="#059669" emissiveIntensity={1.2} />
              </mesh>
              <Text position={[0, 0, 0.04]} fontSize={0.26} color="#ffffff">
                🚀 OPEN LIVE SITE
              </Text>
            </group>

            <group
              position={[1.65, -0.1, 0.06]}
              onClick={(e) => {
                e.stopPropagation();
                window.open(project.githubUrl || 'https://github.com/Amyra01', '_blank', 'noopener,noreferrer');
              }}
            >
              <mesh>
                <planeGeometry args={[2.8, 0.85]} />
                <meshStandardMaterial color="#8b5cf6" emissive="#7c3aed" emissiveIntensity={1.2} />
              </mesh>
              <Text position={[0, 0, 0.04]} fontSize={0.26} color="#ffffff">
                🐙 GITHUB REPO
              </Text>
            </group>
          </group>
        )}
      </group>

      {/* ── Interactive Pink/Coral Bottom Carousel Bar: [←] [■ □ □ □] [→] (Screenshot 3!) ── */}
      <group position={[0, 2.08, 0.56]}>
        {/* Left [←] Slide Button */}
        <group
          position={[-1.45, 0, 0]}
          onClick={handlePrevSlide}
          onPointerEnter={() => { document.body.style.cursor = 'pointer'; }}
          onPointerLeave={() => { document.body.style.cursor = 'default'; }}
        >
          <mesh>
            <boxGeometry args={[0.62, 0.44, 0.12]} />
            <meshStandardMaterial color="#e11d48" emissive="#f43f5e" emissiveIntensity={1.2} />
          </mesh>
          <Text position={[0, 0, 0.08]} fontSize={0.26} color="#ffffff">
            ←
          </Text>
        </group>

        {/* Center 4 Square Indicator Dots */}
        <mesh position={[0, 0, -0.02]}>
          <boxGeometry args={[1.95, 0.44, 0.1]} />
          <meshStandardMaterial color="#be123c" />
        </mesh>
        {[0, 1, 2, 3].map((dIdx) => {
          const dx = (dIdx - 1.5) * 0.42;
          const isCur = activeSlide === dIdx;
          return (
            <mesh
              key={dIdx}
              position={[dx, 0, 0.05]}
              onClick={(e) => {
                e.stopPropagation();
                sound.playBitCollect(3);
                setSlideIdx(dIdx);
              }}
            >
              <planeGeometry args={[0.22, 0.22]} />
              <meshStandardMaterial
                color={isCur ? '#ffffff' : '#fda4af'}
                emissive={isCur ? '#ffffff' : '#f43f5e'}
                emissiveIntensity={isCur ? 2.2 : 0.5}
              />
            </mesh>
          );
        })}

        {/* Right [→] Slide Button */}
        <group
          position={[1.45, 0, 0]}
          onClick={handleNextSlide}
          onPointerEnter={() => { document.body.style.cursor = 'pointer'; }}
          onPointerLeave={() => { document.body.style.cursor = 'default'; }}
        >
          <mesh>
            <boxGeometry args={[0.62, 0.44, 0.12]} />
            <meshStandardMaterial color="#e11d48" emissive="#f43f5e" emissiveIntensity={1.2} />
          </mesh>
          <Text position={[0, 0, 0.08]} fontSize={0.26} color="#ffffff">
            →
          </Text>
        </group>
      </group>

      {/* ── Foreground & Side Props matching Screenshot 3 (Chalkboard, ROLE/WITH, DISTINCTIONS Table, Desk & Forge!) ── */}
      {showSideProps && (
        <>
          {/* Left Interactive A-Frame Chalkboard ("NEXT → / PREV ← / OPEN ↵ / EXIT ESC") */}
          <group position={[-4.95, 0, 1.95]} rotation={[0, 0.28, 0]}>
            <mesh position={[0, 1.55, 0]} rotation={[-0.12, 0, 0]} castShadow>
              <boxGeometry args={[2.05, 2.95, 0.16]} />
              <meshStandardMaterial color="#e07a5f" roughness={0.5} />
            </mesh>
            <mesh position={[0, 1.58, 0.1]} rotation={[-0.12, 0, 0]}>
              <planeGeometry args={[1.75, 2.5]} />
              <meshStandardMaterial color="#18181b" roughness={0.85} />
            </mesh>

            {/* Clickable rows on the chalkboard! */}
            <Text
              position={[0, 2.32, 0.15]}
              rotation={[-0.12, 0, 0]}
              fontSize={0.26}
              color="#ffffff"
              onClick={handleNextSlide}
            >
              NEXT  →
            </Text>
            <Text
              position={[0, 1.82, 0.15]}
              rotation={[-0.12, 0, 0]}
              fontSize={0.26}
              color="#ffffff"
              onClick={handlePrevSlide}
            >
              PREV  ←
            </Text>
            <Text
              position={[0, 1.32, 0.15]}
              rotation={[-0.12, 0, 0]}
              fontSize={0.26}
              color="#fef08a"
              onClick={() => setActiveProject(project)}
            >
              OPEN  ↵
            </Text>
            <Text
              position={[0, 0.82, 0.15]}
              rotation={[-0.12, 0, 0]}
              fontSize={0.25}
              color="#fda4af"
              onClick={exitProjectStation}
            >
              EXIT [ESC]
            </Text>
          </group>

          {/* Warm Glowing Cage Lantern beside Chalkboard */}
          <group position={[-6.35, 0, 2.1]}>
            <mesh position={[0, 0.9, 0]} castShadow>
              <boxGeometry args={[0.78, 1.6, 0.78]} />
              <meshStandardMaterial color="#e07a5f" roughness={0.5} />
            </mesh>
            <mesh position={[0, 0.9, 0]}>
              <boxGeometry args={[0.56, 1.2, 0.56]} />
              <meshStandardMaterial color="#fef08a" emissive="#fb923c" emissiveIntensity={4.5} />
            </mesh>
          </group>

          {/* Right ROLE / WITH Wooden Signpost (Screenshot 3!) */}
          <group position={[5.35, 0, 1.75]} rotation={[0, -0.25, 0]}>
            <mesh position={[0, 2.2, 0]} castShadow>
              <cylinderGeometry args={[0.18, 0.22, 4.4, 8]} />
              <meshStandardMaterial color="#4c1d95" roughness={0.5} />
            </mesh>
            <group position={[0, 3.25, 0.15]}>
              <mesh castShadow>
                <boxGeometry args={[2.85, 0.78, 0.16]} />
                <meshStandardMaterial color="#e07a5f" roughness={0.5} />
              </mesh>
              <Text position={[0.65, 0.45, 0.1]} fontSize={0.2} color="#fef08a">
                ROLE
              </Text>
              <Text position={[0, 0.02, 0.1]} fontSize={0.22} color="#ffffff">
                AI &amp; FULL-STACK DEV
              </Text>
            </group>
            <group position={[0, 2.15, 0.15]}>
              <mesh castShadow>
                <boxGeometry args={[2.85, 0.78, 0.16]} />
                <meshStandardMaterial color="#d97757" roughness={0.5} />
              </mesh>
              <Text position={[0.65, 0.45, 0.1]} fontSize={0.2} color="#fef08a">
                WITH
              </Text>
              <Text position={[0, 0.02, 0.1]} fontSize={0.21} color="#ffffff">
                {project.event.slice(0, 18).toUpperCase()}
              </Text>
            </group>
          </group>

          {/* ── Foreground Props from Screenshot 3: Forge Brazier, Open Book & Bell Desk, DISTINCTIONS Trophy Table ── */}
          {/* 1. Glowing Forge Brazier on Front-Left */}
          <group position={[-2.9, 0, 3.1]}>
            <mesh position={[0, 0.55, 0]} castShadow>
              <boxGeometry args={[1.4, 1.1, 1.4]} />
              <meshStandardMaterial color="#4c1d95" />
            </mesh>
            <mesh position={[0, 1.12, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[1.05, 1.05]} />
              <meshStandardMaterial color="#fef08a" emissive="#f97316" emissiveIntensity={4.0} />
            </mesh>
          </group>

          {/* 2. Open Book & Ringable Bell Desk in Front-Center */}
          <group
            position={[0.1, 0, 3.5]}
            onClick={(e) => {
              e.stopPropagation();
              sound.playChime();
              setBellMsg('🔔 Ding-dong! Thanks for visiting Daisy’s Project Station!');
              setTimeout(() => setBellMsg(null), 3200);
            }}
            onPointerEnter={() => { document.body.style.cursor = 'pointer'; }}
            onPointerLeave={() => { document.body.style.cursor = 'default'; }}
          >
            <mesh position={[0, 0.55, 0]} castShadow>
              <boxGeometry args={[2.8, 0.85, 1.35]} />
              <meshStandardMaterial color="#e07a5f" />
            </mesh>
            {/* Open 3D Book */}
            <mesh position={[-0.25, 1.02, 0]} rotation={[0, 0.1, 0]}>
              <boxGeometry args={[0.95, 0.1, 0.68]} />
              <meshStandardMaterial color="#fef3c7" />
            </mesh>
            {/* Golden Desk Bell */}
            <mesh position={[0.85, 1.08, 0.1]}>
              <sphereGeometry args={[0.22, 12, 12]} />
              <meshStandardMaterial color="#fbbf24" emissive="#f59e0b" emissiveIntensity={0.8} metalness={0.8} />
            </mesh>
            {bellMsg && (
              <Billboard position={[0, 2.3, 0]}>
                <Text fontSize={0.32} color="#fef08a" outlineWidth={0.04} outlineColor="#1e1035">
                  {bellMsg}
                </Text>
              </Billboard>
            )}
          </group>

          {/* 3. "DISTINCTIONS" Trophy Table & Ribbon Medal on Front-Right (Screenshot 3!) */}
          <group position={[3.35, 0, 2.95]} rotation={[0, -0.18, 0]}>
            <mesh position={[0, 0.65, 0]} castShadow>
              <boxGeometry args={[2.65, 1.15, 1.3]} />
              <meshStandardMaterial color="#e07a5f" />
            </mesh>
            {/* "DISTINCTIONS" Banner */}
            <mesh position={[-0.15, 0.78, 0.68]}>
              <planeGeometry args={[1.95, 0.36]} />
              <meshStandardMaterial color="#d97706" />
            </mesh>
            <Text position={[-0.15, 0.78, 0.71]} fontSize={0.21} color="#ffffff">
              DISTINCTIONS
            </Text>
            {/* Purple Award Rosette Badge */}
            <mesh position={[0.95, 0.72, 0.7]}>
              <circleGeometry args={[0.24, 12]} />
              <meshStandardMaterial color="#a855f7" emissive="#9333ea" emissiveIntensity={1.2} />
            </mesh>
            <Text position={[0.95, 0.72, 0.73]} fontSize={0.2} color="#ffffff">
              #1
            </Text>
            {/* 3D Trophy Sculpture on Top of Table */}
            <mesh position={[0, 1.42, 0]} castShadow>
              <boxGeometry args={[1.45, 0.42, 0.35]} />
              <meshStandardMaterial color="#18181b" />
            </mesh>
            <Text position={[0, 1.42, 0.2]} fontSize={0.26} color="#f9a8d4">
              ★ FINALIST
            </Text>
          </group>
        </>
      )}

      {/* Floor Trigger Pad in Front of Station */}
      <TriggerPad
        id={`gpu-project-${project.id}-${position[0]}`}
        position={[0, 0.14, 5.6]}
        radius={2.5}
        color={project.bannerColor}
        title={project.title}
        subtitle="Click Board for Live Slides or Press [Enter] for Details"
        type="project"
        data={project}
      />
    </group>
  );
}

export default function ProjectZone() {
  return (
    <group>
      {/* Featured Live Project Station right beside the Floor Career Timeline (Screenshot 3 & 6!) */}
      <FramedProjectBillboard
        project={projects[0]}
        projectIndex={0}
        position={[27.5, 0, -2.5]}
        showSideProps={true}
      />

      {/* Full Row of 5 Live Project Stations along GPU Boulevard North [0, 0, -49] */}
      {projects.map((project, i) => {
        const spread = (i - (projects.length - 1) / 2) * 12.2;
        return (
          <FramedProjectBillboard
            key={project.id}
            project={project}
            projectIndex={i}
            position={[spread, 0, -49]}
            showSideProps={i === 2}
          />
        );
      })}
    </group>
  );
}
