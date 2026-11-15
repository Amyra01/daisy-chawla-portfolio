import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Billboard, Text } from '@react-three/drei';
import * as THREE from 'three';
import useGameStore from '../stores/gameStore';

export default function TriggerPad({
  id,
  position = [0, 0.08, 0],
  radius = 3.0,
  color = '#00ffcc',
  title = 'Terminal',
  subtitle = 'Press [E] to open',
  type = 'about',
  data = null,
  promptHeight = 3.2,
}) {
  const ringRef = useRef();
  const innerRef = useRef();
  const [active, setActive] = useState(false);
  const activeRef = useRef(false);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const store = useGameStore.getState();
    const [rx, , rz] = store.roverPosition;
    const dx = rx - position[0];
    const dz = rz - position[2];
    const dist = Math.sqrt(dx * dx + dz * dz);
    const isInside = dist <= radius + 1.5;

    if (isInside !== activeRef.current) {
      activeRef.current = isInside;
      setActive(isInside);
      if (isInside) {
        store.setNearbyTrigger({
          id,
          type,
          title,
          subtitle,
          color,
          data,
          position,
        });
      } else {
        store.clearNearbyTrigger(id);
      }
    }

    if (ringRef.current) {
      const pulse = 1 + Math.sin(t * (isInside ? 5 : 2)) * (isInside ? 0.07 : 0.03);
      ringRef.current.scale.set(pulse, pulse, 1);
      ringRef.current.material.emissiveIntensity = isInside ? 3.0 : 1.4;
    }
    if (innerRef.current) {
      innerRef.current.material.opacity = isInside ? 0.35 : 0.14;
    }
  });

  const handleClick = (e) => {
    e.stopPropagation();
    const store = useGameStore.getState();
    store.setNearbyTrigger({ id, type, title, subtitle, color, data, position });
    store.activateNearbyTrigger();
  };

  return (
    <group position={position}>
      {/* Clean glowing floor ring */}
      <mesh
        ref={ringRef}
        rotation={[-Math.PI / 2, 0, 0]}
        onClick={handleClick}
        onPointerEnter={() => { document.body.style.cursor = 'pointer'; }}
        onPointerLeave={() => { document.body.style.cursor = 'default'; }}
      >
        <ringGeometry args={[radius * 0.82, radius, 36]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={1.5}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Soft translucent disc */}
      <mesh
        ref={innerRef}
        position={[0, -0.02, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        onClick={handleClick}
      >
        <circleGeometry args={[radius * 0.82, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.8}
          transparent
          opacity={0.14}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Flat floor label inside the ring (zero floating clutter!) */}
      <Text
        position={[0, 0.04, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.42}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        {title}
      </Text>

      {/* Clean pop-up prompt ONLY when rover parks on the pad */}
      {active && (
        <Billboard position={[0, promptHeight, 0]}>
          <group onClick={handleClick}>
            <mesh position={[0, 0, -0.05]}>
              <planeGeometry args={[5.2, 1.35]} />
              <meshStandardMaterial
                color="#040814"
                emissive={color}
                emissiveIntensity={0.35}
                transparent
                opacity={0.94}
              />
            </mesh>
            <Text
              position={[0, 0.22, 0.02]}
              fontSize={0.38}
              color="#ffffff"
              anchorX="center"
              anchorY="middle"
            >
              {title}
            </Text>
            <Text
              position={[0, -0.24, 0.02]}
              fontSize={0.28}
              color={color}
              anchorX="center"
              anchorY="middle"
            >
              Press [E] or Click to Open
            </Text>
          </group>
        </Billboard>
      )}
    </group>
  );
}
