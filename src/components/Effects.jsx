import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { EffectComposer, Bloom, ChromaticAberration, Vignette } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import useGameStore from '../stores/gameStore';

export default function Effects() {
  const quality = useGameStore((s) => s.quality);
  const isNitro = useGameStore((s) => s.isNitro);
  const powerSurgeActive = useGameStore((s) => s.powerSurgeActive);

  // Auto-downgrade quality if FPS stays under 30 for 4 seconds (Part C4 & I3)
  const lowFpsTimer = useRef(0);
  useFrame((_, delta) => {
    if (delta > 1 / 28) {
      lowFpsTimer.current += delta;
      if (lowFpsTimer.current > 4.5) {
        const cur = useGameStore.getState().quality;
        if (cur === 'high') useGameStore.getState().setQuality('medium');
        else if (cur === 'medium') useGameStore.getState().setQuality('low');
        lowFpsTimer.current = 0;
      }
    } else {
      lowFpsTimer.current = Math.max(0, lowFpsTimer.current - delta * 0.5);
    }
  });

  // Periodic Power Surge event every 70 seconds (Part E4)
  useEffect(() => {
    const id = setInterval(() => {
      if (!useGameStore.getState().showWelcome) {
        useGameStore.getState().triggerPowerSurge();
      }
    }, 70000);
    return () => clearInterval(id);
  }, []);

  if (quality === 'low') return null;

  const aberration = isNitro || powerSurgeActive ? 0.0022 : 0.0003;

  return (
    <EffectComposer multisampling={quality === 'high' ? 4 : 0}>
      <Bloom
        intensity={powerSurgeActive ? 1.35 : 0.65}
        luminanceThreshold={0.35}
        luminanceSmoothing={0.85}
        mipmapBlur
      />
      <ChromaticAberration
        blendFunction={BlendFunction.NORMAL}
        offset={[aberration, aberration]}
      />
      <Vignette
        offset={0.28}
        darkness={0.52}
        blendFunction={BlendFunction.NORMAL}
      />
    </EffectComposer>
  );
}
