import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Billboard } from '@react-three/drei';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import * as THREE from 'three';
import { ZONES, ROADS, CIRCUIT_TRACES } from '../data/zones';
import useGameStore from '../stores/gameStore';

// Procedural Canvas Texture for Soothing Sunset Coral-Violet / Pastel / Cyber Tiled PCB Floor
function usePcbSilkscreenTexture(lightingMode) {
  return useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 2048;
    const ctx = canvas.getContext('2d');

    const isGolden = lightingMode === 'golden';
    const isPastel = lightingMode === 'pastel';

    // Base soothing floor fill (Warm Sunset Coral-Apricot like Screenshots 2 & 3!)
    ctx.fillStyle = isGolden ? '#df8562' : isPastel ? '#b497d6' : '#051914';
    ctx.fillRect(0, 0, 2048, 2048);

    // Individual PCB floor tiles with soothing subtle variation
    const tileSize = 32;
    for (let y = 0; y < 2048; y += tileSize) {
      for (let x = 0; x < 2048; x += tileSize) {
        const hash = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
        const v = hash - Math.floor(hash);
        if (isGolden || isPastel) {
          const alpha = 0.035 + v * 0.065;
          ctx.fillStyle = v > 0.5 ? `rgba(255, 228, 205, ${alpha})` : `rgba(115, 45, 75, ${alpha})`;
        } else {
          const alpha = 0.02 + v * 0.045;
          ctx.fillStyle = `rgba(0, 255, 180, ${alpha})`;
        }
        ctx.fillRect(x + 1, y + 1, tileSize - 2, tileSize - 2);
      }
    }

    // Tile mortar / grid lines
    ctx.strokeStyle =
      isGolden || isPastel
        ? 'rgba(88, 28, 69, 0.18)'
        : 'rgba(0, 255, 170, 0.065)';
    ctx.lineWidth = 1.5;
    for (let i = 0; i <= 2048; i += tileSize) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, 2048);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(2048, i);
      ctx.stroke();
    }

    // Outer Race Circuit Track painted on the West & North-West perimeter
    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    const trackPts = [
      [340, 1640],
      [220, 1640],
      [220, 1180],
      [520, 1020],
      [520, 680],
      [220, 680],
      [220, 240],
      [620, 240],
      [620, 640],
      [820, 640],
      [820, 240],
      [1480, 240],
      [1480, 520],
      [920, 880],
      [860, 1540],
      [340, 1640],
    ];
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 118;
    ctx.beginPath();
    trackPts.forEach(([tx, ty], idx) => (idx === 0 ? ctx.moveTo(tx, ty) : ctx.lineTo(tx, ty)));
    ctx.closePath();
    ctx.stroke();

    ctx.setLineDash([28, 28]);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 118;
    ctx.beginPath();
    trackPts.forEach(([tx, ty], idx) => (idx === 0 ? ctx.moveTo(tx, ty) : ctx.lineTo(tx, ty)));
    ctx.closePath();
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.strokeStyle = '#3b3346';
    ctx.lineWidth = 92;
    ctx.beginPath();
    trackPts.forEach(([tx, ty], idx) => (idx === 0 ? ctx.moveTo(tx, ty) : ctx.lineTo(tx, ty)));
    ctx.closePath();
    ctx.stroke();
    ctx.restore();

    // Silkscreen ink color
    const ink =
      isGolden || isPastel
        ? 'rgba(255, 245, 238, 0.58)'
        : 'rgba(226, 232, 240, 0.38)';
    ctx.strokeStyle = ink;
    ctx.fillStyle = ink;
    ctx.lineWidth = 3;

    ctx.strokeRect(48, 48, 1952, 1952);
    ctx.strokeRect(60, 60, 1928, 1928);

    ctx.font = 'bold 26px monospace';
    const labels = [
      ['CPU_SOCKET_LGA1700', 920, 1040],
      ['VRM_16PHASE_CORE', 920, 760],
      ['DDR5_DIMM_A1_B2', 1420, 920],
      ['PCIE_5.0_X16_GPU_ARRAY', 880, 440],
      ['PCIE_4.0_EXP_BUS', 420, 920],
      ['ATX_1200W_PSU_24PIN', 1320, 1420],
      ['M2_NVME_GEN5_1', 740, 1260],
      ['CMOS_CR2032_BATT', 540, 1380],
    ];
    labels.forEach(([txt, x, y]) => {
      ctx.fillText(txt, x, y);
      ctx.strokeRect(x - 12, y - 30, txt.length * 16 + 24, 42);
    });

    ctx.font = 'bold 42px monospace';
    ctx.fillText('DAISY CHAWLA // Z790 GOLDEN-HOUR MOTHERBOARD ISLAND (2026)', 210, 1940);

    // Subtle scattered blossom/confetti speckles on floor (Screenshot 2!)
    if (isGolden || isPastel) {
      for (let i = 0; i < 240; i++) {
        const rx = 100 + ((i * 173) % 1848);
        const ry = 100 + ((i * 293) % 1848);
        ctx.fillStyle = i % 3 === 0 ? 'rgba(136, 19, 55, 0.36)' : 'rgba(107, 33, 168, 0.3)';
        ctx.fillRect(rx, ry, 10, 7);
      }
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.anisotropy = 8;
    tex.needsUpdate = true;
    return tex;
  }, [lightingMode]);
}

// Wide Main Road with glowing border rails & animated chevron arrows
function MainHighway({ from, to, width = 5, color = '#00ffcc' }) {
  const chevronsRef = useRef([]);
  const lightingMode = useGameStore((s) => s.lightingMode);
  const dx = to[0] - from[0];
  const dz = to[2] - from[2];
  const len = Math.sqrt(dx * dx + dz * dz);
  const angle = Math.atan2(dx, dz);
  const mid = [(from[0] + to[0]) / 2, 0.04, (from[2] + to[2]) / 2];
  const numChevrons = Math.max(3, Math.floor(len / 6));

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    for (let i = 0; i < chevronsRef.current.length; i++) {
      const mesh = chevronsRef.current[i];
      if (mesh) {
        const wave = (Math.sin(t * 4 - i * 0.9) + 1) * 0.5;
        mesh.material.emissiveIntensity = 0.6 + wave * 2.0;
      }
    }
  });

  const roadBedColor =
    lightingMode === 'golden'
      ? '#c86d51'
      : lightingMode === 'pastel'
      ? '#9b7ec4'
      : '#071022';

  return (
    <group position={mid} rotation={[0, angle, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[width, len]} />
        <meshStandardMaterial
          color={roadBedColor}
          emissive={color}
          emissiveIntensity={lightingMode === 'cyberpunk' ? 0.14 : 0.06}
          roughness={0.5}
          metalness={0.3}
        />
      </mesh>

      {[-width / 2, width / 2].map((rx, i) => (
        <mesh key={i} position={[rx, 0.05, 0]}>
          <boxGeometry args={[0.16, 0.1, len]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.6} />
        </mesh>
      ))}

      <mesh position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.2, len]} />
        <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.9} />
      </mesh>

      {Array.from({ length: numChevrons }).map((_, i) => {
        const zOffset = -len / 2 + (i + 0.5) * (len / numChevrons);
        return (
          <group key={i} position={[0, 0.05, zOffset]}>
            <mesh
              ref={(el) => (chevronsRef.current[i] = el)}
              rotation={[-Math.PI / 2, 0, 0]}
            >
              <coneGeometry args={[width * 0.18, 0.8, 3]} />
              <meshStandardMaterial
                color={color}
                emissive={color}
                emissiveIntensity={1.4}
                transparent
                opacity={0.85}
              />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

// Raised Copper & Gold Circuit Traces with Via Holes and Solder Pads
function RaisedCircuitTraces() {
  const segments = useMemo(() => {
    const segs = [];
    const vias = [];
    CIRCUIT_TRACES.forEach((trace) => {
      const pts = trace.points;
      for (let i = 0; i < pts.length - 1; i++) {
        const [x1, z1] = pts[i];
        const [x2, z2] = pts[i + 1];
        const dx = x2 - x1;
        const dz = z2 - z1;
        const len = Math.sqrt(dx * dx + dz * dz);
        const angle = Math.atan2(dx, dz);
        segs.push({
          mid: [(x1 + x2) / 2, 0.05, (z1 + z2) / 2],
          len,
          angle,
          color: trace.color,
        });
        vias.push([x1, 0.06, z1]);
      }
      const last = pts[pts.length - 1];
      vias.push([last[0], 0.06, last[1]]);
    });
    return { segs, vias };
  }, []);

  return (
    <group>
      {segments.segs.map((s, i) => (
        <mesh key={i} position={s.mid} rotation={[0, s.angle, 0]}>
          <boxGeometry args={[0.35, 0.08, s.len]} />
          <meshStandardMaterial
            color={s.color}
            emissive={s.color}
            emissiveIntensity={0.45}
            metalness={0.9}
            roughness={0.2}
          />
        </mesh>
      ))}
      {segments.vias.map((v, i) => (
        <group key={i} position={v}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.2, 0.42, 16]} />
            <meshStandardMaterial color="#fbbf24" emissive="#d97706" emissiveIntensity={0.8} metalness={1} roughness={0.15} />
          </mesh>
          <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.2, 12]} />
            <meshBasicMaterial color="#020617" />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// Travelling Light Pulses flowing along all roads & traces
function TravellingDataPulses() {
  const instRef = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const paths = useMemo(() => {
    const list = [];
    ROADS.forEach((r) => {
      list.push({ start: r.from, end: r.to, speed: 0.35 + Math.random() * 0.25, offset: Math.random() });
      list.push({ start: r.from, end: r.to, speed: 0.35 + Math.random() * 0.25, offset: (Math.random() + 0.5) % 1 });
    });
    CIRCUIT_TRACES.forEach((t) => {
      for (let i = 0; i < t.points.length - 1; i++) {
        const [x1, z1] = t.points[i];
        const [x2, z2] = t.points[i + 1];
        list.push({
          start: [x1, 0, z1],
          end: [x2, 0, z2],
          speed: 0.4 + Math.random() * 0.35,
          offset: Math.random(),
        });
      }
    });
    return list;
  }, []);

  const count = paths.length * 3;

  useFrame((state) => {
    if (!instRef.current) return;
    const t = state.clock.elapsedTime;
    const surge = useGameStore.getState().powerSurgeActive ? 2.8 : 1;

    let idx = 0;
    for (let p = 0; p < paths.length; p++) {
      const path = paths[p];
      for (let k = 0; k < 3; k++) {
        const prog = (t * path.speed * surge + path.offset + k / 3) % 1;
        const x = path.start[0] + (path.end[0] - path.start[0]) * prog;
        const z = path.start[2] + (path.end[2] - path.start[2]) * prog;
        dummy.position.set(x, 0.18, z);
        const s = surge > 1 ? 1.8 : 1;
        dummy.scale.set(s, s, s);
        dummy.updateMatrix();
        instRef.current.setMatrixAt(idx++, dummy.matrix);
      }
    }
    instRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={instRef} args={[null, null, count]}>
      <sphereGeometry args={[0.24, 8, 8]} />
      <meshStandardMaterial color="#00ffcc" emissive="#00ffcc" emissiveIntensity={3.5} />
    </instancedMesh>
  );
}

// Drifting Falling Bit-Flakes / Golden-Hour Confetti Leaves
function DriftingBitFlakes() {
  const instRef = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const colorObj = useMemo(() => new THREE.Color(), []);

  const flakes = useMemo(() => {
    const palette = ['#f472b6', '#fb923c', '#facc15', '#38bdf8', '#c084fc'];
    return Array.from({ length: 85 }).map((_, i) => ({
      x: (Math.random() - 0.5) * 130,
      y: 2 + Math.random() * 24,
      z: (Math.random() - 0.5) * 130,
      speedY: 1.2 + Math.random() * 1.4,
      driftX: (Math.random() - 0.5) * 1.5,
      color: palette[i % palette.length],
    }));
  }, []);

  useFrame((state) => {
    if (!instRef.current) return;
    const t = state.clock.elapsedTime;
    for (let i = 0; i < flakes.length; i++) {
      const f = flakes[i];
      const y = ((f.y - t * f.speedY) % 24 + 24) % 24;
      const x = f.x + Math.sin(t * 0.8 + i) * 2.5;
      const z = f.z + Math.cos(t * 0.7 + i) * 2.5;
      dummy.position.set(x, y, z);
      dummy.rotation.set(t * 1.8 + i, t * 1.4 + i, t);
      dummy.scale.set(0.28, 0.06, 0.22);
      dummy.updateMatrix();
      instRef.current.setMatrixAt(i, dummy.matrix);
      colorObj.set(f.color);
      instRef.current.setColorAt(i, colorObj);
    }
    instRef.current.instanceMatrix.needsUpdate = true;
    if (instRef.current.instanceColor) instRef.current.instanceColor.needsUpdate = true;
  });

  return (
    <instancedMesh ref={instRef} args={[null, null, flakes.length]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#ffffff" emissive="#fb923c" emissiveIntensity={0.6} />
    </instancedMesh>
  );
}

// Zone Floor Pad & Silkscreen Border
function ZonePad({ zone }) {
  const lightingMode = useGameStore((s) => s.lightingMode);
  const [x, , z] = zone.position;
  const [w, , d] = zone.size;
  const h = 0.09;

  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, h / 2, 0]} receiveShadow>
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial
          color={lightingMode === 'cyberpunk' ? '#060d1f' : '#b85d48'}
          emissive={zone.color}
          emissiveIntensity={lightingMode === 'cyberpunk' ? 0.14 : 0.08}
          roughness={0.45}
          metalness={0.4}
        />
      </mesh>

      {[-w / 2, w / 2].map((bx, i) => (
        <mesh key={`lr${i}`} position={[bx, h + 0.03, 0]}>
          <boxGeometry args={[0.24, 0.08, d]} />
          <meshStandardMaterial color={zone.color} emissive={zone.color} emissiveIntensity={2.2} />
        </mesh>
      ))}
      {[-d / 2, d / 2].map((bz, i) => (
        <mesh key={`fb${i}`} position={[0, h + 0.03, bz]}>
          <boxGeometry args={[w, 0.08, 0.24]} />
          <meshStandardMaterial color={zone.color} emissive={zone.color} emissiveIntensity={2.2} />
        </mesh>
      ))}
    </group>
  );
}

// Giant Rear Motherboard I/O Panel Wall along West Edge
function MotherboardIOWall() {
  return (
    <group position={[-76, 0, 0]}>
      <RigidBody type="fixed" colliders="cuboid">
        <mesh position={[0, 7, 0]} castShadow receiveShadow>
          <boxGeometry args={[3, 14, 110]} />
          <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.25} />
        </mesh>
      </RigidBody>

      <mesh position={[1.6, 13.5, 0]}>
        <boxGeometry args={[0.3, 0.5, 108]} />
        <meshStandardMaterial color="#00ffcc" emissive="#00ffcc" emissiveIntensity={2.5} />
      </mesh>
      <Text
        position={[1.7, 11.5, 0]}
        rotation={[0, Math.PI / 2, 0]}
        fontSize={1.5}
        color="#00ffcc"
        anchorX="center"
        anchorY="middle"
      >
        REAR I/O SHIELD // USB 3.2 • HDMI 2.1 • 2.5G LAN • HD AUDIO
      </Text>

      {[-38, -26, -14].map((z, i) => (
        <group key={i} position={[2.2, 4.5, z]}>
          <mesh castShadow>
            <boxGeometry args={[2.5, 8.5, 6]} />
            <meshStandardMaterial color="#475569" metalness={0.95} roughness={0.2} />
          </mesh>
          {[-2, 0, 2].map((y, j) => (
            <mesh key={j} position={[1.3, y, 0]}>
              <boxGeometry args={[0.2, 1.1, 4.2]} />
              <meshStandardMaterial color="#0284c7" emissive="#0ea5e9" emissiveIntensity={1.2} />
            </mesh>
          ))}
        </group>
      ))}

      <group position={[2.2, 3.5, 0]}>
        <mesh castShadow>
          <boxGeometry args={[2.4, 6.5, 9]} />
          <meshStandardMaterial color="#334155" metalness={0.9} roughness={0.2} />
        </mesh>
        <Text position={[1.3, 1.8, 0]} rotation={[0, Math.PI / 2, 0]} fontSize={0.7} color="#38bdf8">
          HDMI 2.1 / DP
        </Text>
      </group>

      <group position={[2.4, 4.8, 16]}>
        <mesh castShadow>
          <boxGeometry args={[2.8, 9, 7.5]} />
          <meshStandardMaterial color="#64748b" metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[1.45, 3.2, -2.2]}>
          <boxGeometry args={[0.2, 0.8, 1.2]} />
          <meshStandardMaterial color="#00ff88" emissive="#00ff88" emissiveIntensity={4} />
        </mesh>
        <mesh position={[1.45, 3.2, 2.2]}>
          <boxGeometry args={[0.2, 0.8, 1.2]} />
          <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={4} />
        </mesh>
      </group>

      <group position={[2.2, 4.2, 34]}>
        <mesh castShadow>
          <boxGeometry args={[2.4, 8, 12]} />
          <meshStandardMaterial color="#1e293b" metalness={0.85} roughness={0.3} />
        </mesh>
        {[
          ['#ec4899', -3.5, 1.6],
          ['#22c55e', 0, 1.6],
          ['#38bdf8', 3.5, 1.6],
          ['#f97316', -3.5, -1.6],
          ['#e2e8f0', 0, -1.6],
          ['#a855f7', 3.5, -1.6],
        ].map(([col, oz, oy], idx) => (
          <mesh key={idx} position={[1.4, oy, oz]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[1.1, 1.1, 0.8, 18]} />
            <meshStandardMaterial color={col} emissive={col} emissiveIntensity={1.4} metalness={0.6} roughness={0.2} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

// East Edge Skyline: Tall VRM Power Phase Inductors & Capacitor Bank
function VrmPowerSkyline() {
  return (
    <group position={[74, 0, 0]}>
      <RigidBody type="fixed" colliders="cuboid">
        <mesh position={[0, 4, 0]} visible={false}>
          <boxGeometry args={[6, 8, 110]} />
        </mesh>
      </RigidBody>
      {Array.from({ length: 12 }).map((_, i) => {
        const z = -48 + i * 8.8;
        return (
          <group key={i} position={[0, 0, z]}>
            <mesh position={[0, 3.2, 0]} castShadow>
              <boxGeometry args={[5.2, 6.4, 5.2]} />
              <meshStandardMaterial color="#18181b" metalness={0.85} roughness={0.35} />
            </mesh>
            <Text
              position={[-2.65, 3.5, 0]}
              rotation={[0, -Math.PI / 2, 0]}
              fontSize={0.95}
              color="#f59e0b"
            >
              R22
            </Text>
            <mesh position={[-4.2, 2.0, 0]} castShadow>
              <cylinderGeometry args={[1.2, 1.2, 4.0, 16]} />
              <meshStandardMaterial color="#cbd5e1" metalness={0.95} roughness={0.15} />
            </mesh>
            <mesh position={[-4.2, 4.02, 0]}>
              <cylinderGeometry args={[1.0, 1.0, 0.1, 16]} />
              <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={1.2} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

// 3D Waypoint Beam + Stepping Guidance Line (Never auto-clears prematurely!)
function WaypointBeam() {
  const waypoint = useGameStore((s) => s.waypoint);
  const waypointLabel = useGameStore((s) => s.waypointLabel);
  const beamRef = useRef();
  const guideDotsRef = useRef([]);

  useFrame((state) => {
    if (!waypoint || !beamRef.current) return;
    const store = useGameStore.getState();
    const [rx, , rz] = store.roverPosition;
    const dx = waypoint[0] - rx;
    const dz = waypoint[2] - rz;
    const ageMs = performance.now() - (store.waypointSetTime || 0);

    // Only clear after at least 2.2 seconds AND when the rover has arrived right at the target (< 3.2 units)
    if (ageMs > 2200 && dx * dx + dz * dz < 10.5) {
      store.clearWaypoint();
      return;
    }
    beamRef.current.rotation.y = state.clock.elapsedTime * 2.2;

    // Position 12 animated guidance stepping chevron tiles from rover to waypoint
    for (let i = 0; i < guideDotsRef.current.length; i++) {
      const dot = guideDotsRef.current[i];
      if (dot) {
        const f = (i + 1) / (guideDotsRef.current.length + 1);
        dot.position.set(rx + dx * f, 0.2, rz + dz * f);
        dot.rotation.y = Math.atan2(dx, dz);
        const pulse = (Math.sin(state.clock.elapsedTime * 6 - i * 0.6) + 1) * 0.5;
        dot.scale.setScalar(0.9 + pulse * 0.4);
      }
    }
  });

  if (!waypoint) return null;

  return (
    <group>
      {/* Dynamic Glowing Guide Tiles leading directly from Rover to Target */}
      {Array.from({ length: 12 }).map((_, i) => (
        <mesh
          key={i}
          ref={(el) => (guideDotsRef.current[i] = el)}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <planeGeometry args={[1.4, 1.8]} />
          <meshStandardMaterial
            color="#fef08a"
            emissive="#00ffcc"
            emissiveIntensity={3.2}
            transparent
            opacity={0.9}
          />
        </mesh>
      ))}

      {/* Target Destination Beacon */}
      <group position={[waypoint[0], 0, waypoint[2]]} ref={beamRef}>
        <mesh position={[0, 22, 0]}>
          <cylinderGeometry args={[0.5, 2.0, 44, 16, 1, true]} />
          <meshStandardMaterial
            color="#00ffcc"
            emissive="#00ffcc"
            emissiveIntensity={3.2}
            transparent
            opacity={0.4}
            side={THREE.DoubleSide}
          />
        </mesh>
        <Billboard position={[0, 14, 0]}>
          <Text fontSize={1.45} color="#fef08a" outlineWidth={0.08} outlineColor="#000">
            ▼ {waypointLabel}
          </Text>
        </Billboard>
      </group>
    </group>
  );
}

export default function World() {
  const lightingMode = useGameStore((s) => s.lightingMode);
  const quality = useGameStore((s) => s.quality);
  const pcbTexture = usePcbSilkscreenTexture(lightingMode);

  const isCyber = lightingMode === 'cyberpunk';
  const isPastel = lightingMode === 'pastel';

  const fogColor = isCyber ? '#040816' : isPastel ? '#3b245e' : '#2d1846';

  return (
    <>
      {/* ── Surrounding Crystal Aqua Coolant Sea around the Motherboard Island ── */}
      <mesh position={[0, -0.45, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[280, 280]} />
        <meshStandardMaterial
          color="#0891b2"
          emissive="#06b6d4"
          emissiveIntensity={isCyber ? 0.2 : 0.42}
          roughness={0.2}
          metalness={0.55}
        />
      </mesh>
      <mesh position={[0, -0.25, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[174, 174]} />
        <meshStandardMaterial
          color="#a5f3fc"
          emissive="#22d3ee"
          emissiveIntensity={1.35}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* ── Main Beveled PCB Island Slab (Double-Click Anywhere on Floor to Auto-Drive!) ── */}
      <RigidBody type="fixed" colliders={false} position={[0, -1.5, 0]}>
        <CuboidCollider args={[85, 1.5, 85]} friction={0} />
        <CuboidCollider args={[85, 8, 1]} position={[0, 8, -84]} />
        <CuboidCollider args={[85, 8, 1]} position={[0, 8, 84]} />
        <CuboidCollider args={[1, 8, 85]} position={[84, 8, 0]} />

        <mesh
          receiveShadow
          onDoubleClick={(e) => {
            e.stopPropagation();
            useGameStore
              .getState()
              .setAutoDriveTarget([e.point.x, 2.6, e.point.z], 'Clicked Destination');
          }}
        >
          <boxGeometry args={[168, 3, 168]} />
          <meshStandardMaterial
            map={pcbTexture}
            roughness={isCyber ? 0.38 : 0.52}
            metalness={isCyber ? 0.35 : 0.16}
          />
        </mesh>

        {/* Gold PCB Copper Edge Banding */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[168.4, 0.5, 168.4]} />
          <meshStandardMaterial color="#d97706" emissive="#b45309" emissiveIntensity={0.4} metalness={0.95} roughness={0.15} />
        </mesh>
      </RigidBody>

      {/* 4 Giant Corner Mounting Screw Holes with Gold Washers */}
      {[
        [-72, 0.05, -72],
        [72, 0.05, -72],
        [-72, 0.05, 72],
        [72, 0.05, 72],
      ].map((pos, i) => (
        <group key={i} position={pos}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[1.8, 3.8, 24]} />
            <meshStandardMaterial color="#fbbf24" emissive="#d97706" emissiveIntensity={0.6} metalness={1} roughness={0.15} />
          </mesh>
          <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[1.8, 24]} />
            <meshBasicMaterial color="#010409" />
          </mesh>
        </group>
      ))}

      {/* Main Highways with Animated Chevrons */}
      {ROADS.map((road, i) => (
        <MainHighway key={i} {...road} />
      ))}

      <RaisedCircuitTraces />
      <TravellingDataPulses />
      <DriftingBitFlakes />

      {Object.values(ZONES).map((zone) => (
        <ZonePad key={zone.id} zone={zone} />
      ))}

      <MotherboardIOWall />
      <VrmPowerSkyline />
      <WaypointBeam />

      {/* ── Soothing, Bright, Magnetic Sunset-Lavender & Coral Lighting ── */}
      <ambientLight
        intensity={isCyber ? 0.48 : 0.96}
        color={isCyber ? '#1e1b4b' : '#e9d5ff'}
      />
      <hemisphereLight
        skyColor={isCyber ? '#38bdf8' : '#fdba74'}
        groundColor={isCyber ? '#0f172a' : '#6b21a8'}
        intensity={isCyber ? 0.38 : 0.85}
      />
      <directionalLight
        position={[-48, 55, 38]}
        intensity={isCyber ? 0.95 : 1.95}
        color={isCyber ? '#e0f2fe' : '#fff7ed'}
        castShadow={quality !== 'low'}
        shadow-mapSize={quality === 'high' ? [2048, 2048] : [1024, 1024]}
        shadow-camera-left={-78}
        shadow-camera-right={78}
        shadow-camera-top={78}
        shadow-camera-bottom={-78}
      />

      {/* Per-zone colored accent point lights */}
      <pointLight position={[0, 14, 0]} color={isCyber ? '#00ff88' : '#fb923c'} intensity={3.5} distance={42} decay={2} />
      <pointLight position={[42, 12, -8]} color="#06b6d4" intensity={3} distance={38} decay={2} />
      <pointLight position={[0, 14, -48]} color="#a855f7" intensity={3.5} distance={45} decay={2} />
      <pointLight position={[-42, 12, -8]} color="#f59e0b" intensity={3} distance={40} decay={2} />
      <pointLight position={[32, 12, 34]} color="#ef4444" intensity={3} distance={38} decay={2} />

      <fog attach="fog" args={[fogColor, 95, 225]} />
    </>
  );
}
