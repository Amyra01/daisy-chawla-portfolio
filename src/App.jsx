import { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/rapier';
import { Stars, AdaptiveDpr } from '@react-three/drei';
import './index.css';
import useGameStore from './stores/gameStore';

// 3D Motherboard World & Zone Components
import World from './components/World';
import Rover from './components/Rover';
import CpuArena from './components/CpuArena';
import ScatterProps from './components/ScatterProps';
import SkillZone from './components/SkillZone';
import ProjectZone from './components/ProjectZone';
import ExperienceZone from './components/ExperienceZone';
import PsuZone from './components/PsuZone';
import DrivingToys from './components/DrivingToys';
import Effects from './components/Effects';

// 2D HUD, Modals & 2D Fallback
import HUD from './components/HUD';
import WelcomeBanner from './components/WelcomeBanner';
import LoadingScreen from './components/LoadingScreen';
import AboutModal from './components/AboutModal';
import SkillModal from './components/SkillModal';
import ProjectModal from './components/ProjectModal';
import ExperiencePanel from './components/ExperiencePanel';
import ResumeModal from './components/ResumeModal';
import GarageModal from './components/GarageModal';
import MobileControls from './components/MobileControls';
import Portfolio2D from './components/Portfolio2D';

function Scene() {
  const quality = useGameStore((s) => s.quality);
  return (
    <>
      <Stars
        radius={140}
        depth={55}
        count={quality === 'low' ? 900 : 2600}
        factor={4}
        fade
        speed={1}
      />
      <Physics gravity={[0, -22, 0]}>
        <World />
        <CpuArena />
        <ScatterProps />
        <SkillZone />
        <ProjectZone />
        <ExperienceZone />
        <PsuZone />
        <DrivingToys />
        <Rover />
      </Physics>
      <Effects />
    </>
  );
}

export default function App() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const is2DMode = useGameStore((s) => s.is2DMode);
  const lightingMode = useGameStore((s) => s.lightingMode);

  useEffect(() => {
    let p = 0;
    const interval = setInterval(() => {
      p += Math.random() * 22 + 8;
      if (p >= 100) {
        p = 100;
        setProgress(100);
        clearInterval(interval);
        setTimeout(() => setLoading(false), 350);
      } else {
        setProgress(p);
      }
    }, 95);
    return () => clearInterval(interval);
  }, []);

  const clearColor =
    lightingMode === 'golden'
      ? '#2d1846'
      : lightingMode === 'pastel'
      ? '#3b245e'
      : '#040814';

  return (
    <>
      {loading && <LoadingScreen progress={progress} />}

      {!loading && is2DMode && <Portfolio2D />}

      {!loading && !is2DMode && (
        <>
          <WelcomeBanner />
          <HUD />
          <AboutModal />
          <SkillModal />
          <ProjectModal />
          <ExperiencePanel />
          <ResumeModal />
          <GarageModal />
          <MobileControls />
        </>
      )}

      {!is2DMode && (
        <Canvas
          shadows
          dpr={[1, 1.5]}
          camera={{ fov: 64, near: 0.1, far: 300, position: [0, 10, 18] }}
          gl={{ antialias: true, powerPreference: 'high-performance' }}
          style={{ position: 'fixed', inset: 0, zIndex: 0, background: clearColor }}
          onCreated={({ gl }) => {
            gl.setClearColor(clearColor);
          }}
        >
          <AdaptiveDpr pixelated />
          <Suspense fallback={null}>
            <Scene />
          </Suspense>
        </Canvas>
      )}
    </>
  );
}
