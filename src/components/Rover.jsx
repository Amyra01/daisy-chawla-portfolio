import { useRef, useEffect, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { RigidBody } from '@react-three/rapier';
import * as THREE from 'three';
import useGameStore from '../stores/gameStore';
import { ZONES, SPAWN_POSITION } from '../data/zones';
import sound from '../utils/sound';

const BASE_SPEED = 19.0; // cruise speed (units/sec)
const TURN_SPEED = 2.65; // radians/sec
const NITRO_MULT = 1.95;
const JUMP_FORCE = 12.0;

const keys = {
  forward: false,
  backward: false,
  left: false,
  right: false,
  jump: false,
  nitro: false,
  brake: false,
  respawn: false,
};

function checkZone(position) {
  for (const zone of Object.values(ZONES)) {
    const [zx, , zz] = zone.position;
    const [w, , d] = zone.size;
    if (Math.abs(position.x - zx) < w / 2 + 3 && Math.abs(position.z - zz) < d / 2 + 3) {
      return zone;
    }
  }
  return null;
}

export default function Rover() {
  const bodyRef = useRef();
  const meshRef = useRef();
  const chassisRef = useRef();
  const antennaRef = useRef();
  const wheelGroupsRef = useRef([]);
  const wheelSpinRef = useRef([]);
  const tailLightsRef = useRef([]);
  const underglowRef = useRef();
  const shockwaveRef = useRef();
  const trailInstRef = useRef();

  const { camera } = useThree();
  const camTarget = useRef(new THREE.Vector3());
  const roverAngle = useRef(Math.PI); // face North toward CPU die & GPU Boulevard on spawn
  const driveSpeed = useRef(0);
  const wheelRotation = useRef(0);
  const steerVisual = useRef(0);
  const squashY = useRef(1);
  const wasInAir = useRef(false);
  const jumpCooldown = useRef(0);
  const lastZoneId = useRef('cpu');
  const lastSpeed = useRef(-1);
  const orbitYaw = useRef(0);
  const orbitPitch = useRef(0);
  const zoomOffset = useRef(0);
  const isDraggingCam = useRef(false);

  // Trackpad two-finger scroll momentum
  const trackpadForwardImpulse = useRef(0);
  const trackpadTurnImpulse = useRef(0);

  const teleportTarget = useGameStore((s) => s.teleportTarget);
  const roverCustomization = useGameStore((s) => s.roverCustomization);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const colorObj = useMemo(() => new THREE.Color(), []);

  // 28 Particle Trail history slots
  const trailHistory = useMemo(
    () =>
      Array.from({ length: 28 }).map(() => ({
        x: SPAWN_POSITION[0],
        y: -50,
        z: SPAWN_POSITION[2],
        size: 0.01,
      })),
    []
  );
  const trailCursor = useRef(0);

  // ─── Global Keyboard + Trackpad Two-Finger Scroll + Drag Camera Listeners ───
  useEffect(() => {
    const GAME_KEYS = [
      'KeyW', 'KeyA', 'KeyS', 'KeyD',
      'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
      'Space', 'ShiftLeft', 'ShiftRight', 'ControlLeft', 'KeyB',
      'KeyR', 'KeyH', 'KeyV',
      'Digit1', 'Digit2', 'Digit3', 'Digit4',
      'Numpad1', 'Numpad2', 'Numpad3', 'Numpad4',
    ];

    const down = (e) => {
      const tag = e.target?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      sound.ensureContext();

      const store = useGameStore.getState();

      // If focused on a Live Project Station (Screenshot 3 mode), ArrowLeft / ArrowRight flip slides!
      if (store.cameraMode === 'station' && store.focusedStation) {
        if (e.code === 'ArrowRight' || e.code === 'KeyD') {
          e.preventDefault();
          store.nextStationSlide(4);
          return;
        }
        if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
          e.preventDefault();
          store.prevStationSlide(4);
          return;
        }
        if (e.code === 'Escape') {
          e.preventDefault();
          store.exitProjectStation();
          return;
        }
      }

      if (GAME_KEYS.includes(e.code)) {
        e.preventDefault();
        if (document.activeElement && document.activeElement !== document.body) {
          document.activeElement.blur();
        }
      }

      // Cancel auto-drive if user presses manual driving keys
      if (['KeyW', 'KeyA', 'KeyS', 'KeyD', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
        if (store.autoDriveTarget) store.clearAutoDriveTarget();
      }

      switch (e.code) {
        case 'KeyW': case 'ArrowUp':    keys.forward = true; break;
        case 'KeyS': case 'ArrowDown':  keys.backward = true; break;
        case 'KeyA': case 'ArrowLeft':  keys.left = true; break;
        case 'KeyD': case 'ArrowRight': keys.right = true; break;
        case 'Space':                   keys.jump = true; break;
        case 'ShiftLeft': case 'ShiftRight': keys.nitro = true; break;
        case 'ControlLeft': case 'KeyB': keys.brake = true; break;
        case 'KeyR':                    keys.respawn = true; break;
        case 'KeyH':
          if (!e.repeat) store.triggerHorn();
          break;
        case 'KeyV':
          if (!e.repeat) store.cycleCameraMode();
          break;
        case 'Digit1': case 'Numpad1':
          if (!e.repeat) store.triggerHydraulics(1);
          break;
        case 'Digit2': case 'Numpad2':
          if (!e.repeat) store.triggerHydraulics(2);
          break;
        case 'Digit3': case 'Numpad3':
          if (!e.repeat) store.triggerHydraulics(3);
          break;
        case 'Digit4': case 'Numpad4':
          if (!e.repeat) store.triggerHydraulics(4);
          break;
      }
    };

    const up = (e) => {
      switch (e.code) {
        case 'KeyW': case 'ArrowUp':    keys.forward = false; break;
        case 'KeyS': case 'ArrowDown':  keys.backward = false; break;
        case 'KeyA': case 'ArrowLeft':  keys.left = false; break;
        case 'KeyD': case 'ArrowRight': keys.right = false; break;
        case 'Space':                   keys.jump = false; break;
        case 'ShiftLeft': case 'ShiftRight': keys.nitro = false; break;
        case 'ControlLeft': case 'KeyB': keys.brake = false; break;
        case 'KeyR':                    keys.respawn = false; break;
      }
    };

    const reset = () => {
      Object.keys(keys).forEach((k) => { keys[k] = false; });
      isDraggingCam.current = false;
    };

    const onContextMenu = (e) => e.preventDefault();
    const onMouseDown = (e) => {
      if (e.button === 2 || (e.button === 0 && e.target?.tagName === 'CANVAS')) {
        isDraggingCam.current = true;
      }
    };
    const onMouseUp = () => {
      isDraggingCam.current = false;
    };
    const onMouseMove = (e) => {
      if (isDraggingCam.current) {
        orbitYaw.current -= e.movementX * 0.0065;
        orbitPitch.current = Math.max(-0.35, Math.min(0.45, orbitPitch.current + e.movementY * 0.004));
      }
    };

    // Trackpad Two-Finger Scroll & Pinch-to-Zoom on Canvas!
    const onWheel = (e) => {
      if (e.target?.tagName !== 'CANVAS') return;
      e.preventDefault();
      sound.ensureContext();
      const store = useGameStore.getState();

      // Pinch-to-zoom on trackpad (ctrlKey) or Alt+Scroll zooms camera in/out
      if (e.ctrlKey || e.altKey || !store.trackpadDriveEnabled) {
        zoomOffset.current = Math.max(-8, Math.min(18, zoomOffset.current + e.deltaY * 0.02));
        return;
      }

      // Two-finger trackpad scroll drives forward/back & steers left/right smoothly!
      if (store.autoDriveTarget) store.clearAutoDriveTarget();
      trackpadForwardImpulse.current = Math.max(
        -1.2,
        Math.min(1.5, trackpadForwardImpulse.current - e.deltaY * 0.012)
      );
      if (Math.abs(e.deltaX) > 1) {
        trackpadTurnImpulse.current = Math.max(
          -1.2,
          Math.min(1.2, trackpadTurnImpulse.current - e.deltaX * 0.015)
        );
      }
    };

    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    window.addEventListener('blur', reset);
    window.addEventListener('contextmenu', onContextMenu);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
      window.removeEventListener('blur', reset);
      window.removeEventListener('contextmenu', onContextMenu);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('wheel', onWheel);
    };
  }, []);

  // ─── Handle Teleport / Quick-Warp (Works 100% reliably on every click!) ───
  useEffect(() => {
    if (teleportTarget && teleportTarget.pos && bodyRef.current) {
      const [tx, ty, tz] = teleportTarget.pos;
      bodyRef.current.setTranslation({ x: tx, y: ty || 2.6, z: tz }, true);
      bodyRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
      bodyRef.current.setAngvel({ x: 0, y: 0, z: 0 }, true);
      roverAngle.current = Math.PI; // Face North toward the station/billboard!
      driveSpeed.current = 0;
      orbitYaw.current = 0;
      orbitPitch.current = 0;
      if (meshRef.current) {
        meshRef.current.position.set(tx, (ty || 2.6) - 0.6, tz);
        meshRef.current.rotation.y = Math.PI;
      }
      // Snap camera smoothly behind the new teleport position
      camera.position.set(tx, (ty || 2.6) + 13.5, tz + 16.5);
      useGameStore.getState().clearTeleport();
    }
  }, [teleportTarget, camera]);

  // ─── Main Physics, Auto-Drive, Trackpad & Camera Loop ─────────────
  useFrame((state, delta) => {
    if (!bodyRef.current || !meshRef.current) return;
    const t = state.clock.elapsedTime;
    const dt = Math.min(delta, 0.05);
    const store = useGameStore.getState();
    const tc = store.touchControls;
    const speedMult = store.roverSpeedMultiplier || 1.0;
    const SPEED = BASE_SPEED * speedMult;

    // Check if any full-screen modal is open
    const modalOpen =
      store.showWelcome ||
      store.showAboutModal ||
      store.showSkillModal ||
      store.activeProject ||
      store.activeExperience ||
      store.showResumeModal ||
      store.showGarageModal ||
      store.showWorldMap ||
      store.showMainMenu;

    const vel = bodyRef.current.linvel();
    const pos = bodyRef.current.translation();

    // Decay trackpad impulses smoothly
    trackpadForwardImpulse.current *= Math.max(0, 1 - dt * 4.2);
    trackpadTurnImpulse.current *= Math.max(0, 1 - dt * 5.0);
    if (Math.abs(trackpadForwardImpulse.current) < 0.02) trackpadForwardImpulse.current = 0;
    if (Math.abs(trackpadTurnImpulse.current) < 0.02) trackpadTurnImpulse.current = 0;

    let forward  = !modalOpen && (keys.forward  || tc.forward  || trackpadForwardImpulse.current > 0.08);
    let backward = !modalOpen && (keys.backward || tc.backward || trackpadForwardImpulse.current < -0.08);
    let left     = !modalOpen && (keys.left     || tc.left);
    let right    = !modalOpen && (keys.right    || tc.right);
    const nitro    = !modalOpen && (keys.nitro    || tc.nitro);
    const brakeKey = !modalOpen && keys.brake;
    const jump     = !modalOpen && (keys.jump     || tc.jump);
    const respawn  = !modalOpen && (keys.respawn  || tc.respawn);

    // ─── Auto-Drive Along Guide Path or Floor Click (`autoDriveTarget`) ───
    let autoTurn = 0;
    if (!modalOpen && store.autoDriveTarget) {
      const [ax, , az] = store.autoDriveTarget;
      const dx = ax - pos.x;
      const dz = az - pos.z;
      const dist = Math.hypot(dx, dz);
      if (dist < 3.6) {
        store.clearAutoDriveTarget();
        store.showToast('🎯 Arrived at destination! Press [Enter] to interact.');
      } else {
        forward = true;
        const desiredAngle = Math.atan2(dx, dz);
        let diff = desiredAngle - roverAngle.current;
        while (diff > Math.PI) diff -= Math.PI * 2;
        while (diff < -Math.PI) diff += Math.PI * 2;
        autoTurn = Math.max(-1, Math.min(1, diff * 2.2));
      }
    }

    if (tc.horn) {
      store.triggerHorn();
      store.setTouchControls({ horn: false });
    }

    // Respawn if R pressed or fell off board edge
    if (respawn || pos.y < -12) {
      bodyRef.current.setTranslation(
        { x: SPAWN_POSITION[0], y: 3, z: SPAWN_POSITION[2] },
        true
      );
      bodyRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
      bodyRef.current.setAngvel({ x: 0, y: 0, z: 0 }, true);
      roverAngle.current = Math.PI;
      driveSpeed.current = 0;
      orbitYaw.current = 0;
      if (pos.y < -12) store.showToast('⚡ Respawned at CPU Socket Arena!');
      return;
    }

    // Ground & landing squash-and-stretch detection
    const onGround = pos.y < 1.38 && Math.abs(vel.y) < 1.8;
    if (onGround && wasInAir.current) {
      squashY.current = 0.66;
      sound.playClank(0.8);
    }
    wasInAir.current = !onGround && pos.y > 1.7;
    squashY.current += (1 - squashY.current) * Math.min(1, 10 * dt);

    // Hydraulics bounce (Keys 1-4)
    const hydAge = (performance.now() - store.hydraulicsPulse) / 1000;
    const hydActive = hydAge < 0.45;
    if (hydActive && hydAge < 0.05 && onGround) {
      bodyRef.current.setLinvel({ x: vel.x, y: 6.5, z: vel.z }, true);
      squashY.current = 1.24;
    }

    // Check active speed-boost pad kick
    const boostPadActive = performance.now() < store.boostKickUntil;
    const isBoosting = nitro || boostPadActive;
    if (isBoosting !== store.isNitro) {
      store.setNitroState(isBoosting);
    }

    // Target speed calculation
    const maxSpd = boostPadActive
      ? SPEED * 2.35
      : nitro
      ? SPEED * NITRO_MULT
      : SPEED;

    let target = 0;
    if (brakeKey || store.cameraMode === 'station') target = 0;
    else if (boostPadActive) target = maxSpd;
    else if (forward) {
      const tpScale = trackpadForwardImpulse.current > 0.08 && !keys.forward && !tc.forward && !store.autoDriveTarget
        ? Math.min(1, trackpadForwardImpulse.current)
        : 1;
      target = maxSpd * tpScale;
    } else if (backward) {
      target = -SPEED * 0.65;
    }

    const accel = brakeKey ? 14.0 : target === 0 ? 7.5 : 4.5;
    driveSpeed.current += (target - driveSpeed.current) * Math.min(1, accel * dt);
    if (Math.abs(driveSpeed.current) < 0.05) driveSpeed.current = 0;

    // Smoothly recenter camera orbit yaw when driving forward and not dragging
    if (!isDraggingCam.current && Math.abs(driveSpeed.current) > 2) {
      orbitYaw.current *= Math.max(0, 1 - dt * 2.5);
      orbitPitch.current *= Math.max(0, 1 - dt * 2.5);
    }

    // Steering & visual front-wheel turn angle
    const steerDir = driveSpeed.current < -0.5 ? -1 : 1;
    const turnInput =
      autoTurn !== 0
        ? autoTurn
        : (left ? 1 : 0) - (right ? 1 : 0) + trackpadTurnImpulse.current;
    const driftTurnMult = nitro && Math.abs(driveSpeed.current) > 8 ? 1.25 : 1;
    roverAngle.current += turnInput * TURN_SPEED * driftTurnMult * dt * steerDir;
    steerVisual.current += (Math.max(-1, Math.min(1, turnInput)) * 0.44 - steerVisual.current) * Math.min(1, 12 * dt);

    const dirX = Math.sin(roverAngle.current);
    const dirZ = Math.cos(roverAngle.current);

    // Jump with cooldown
    let vy = vel.y;
    jumpCooldown.current = Math.max(0, jumpCooldown.current - dt);
    if (jump && onGround && jumpCooldown.current <= 0) {
      vy = JUMP_FORCE;
      squashY.current = 1.28;
      jumpCooldown.current = 0.55;
      sound.playBoost();
    }

    // Apply direct horizontal velocity
    bodyRef.current.setLinvel(
      { x: dirX * driveSpeed.current, y: vy, z: dirZ * driveSpeed.current },
      true
    );

    // Sync visual rover group
    meshRef.current.position.set(pos.x, pos.y - 0.6, pos.z);
    meshRef.current.rotation.y = roverAngle.current;

    // Chassis suspension pitch, roll, hydraulics tilt & squash
    if (chassisRef.current) {
      let pitch = (target - driveSpeed.current) * -0.009;
      let roll = turnInput * (driveSpeed.current / SPEED) * 0.11;
      if (hydActive) {
        const wave = Math.sin(hydAge * Math.PI * 4) * 0.22;
        if (store.hydraulicsCorner === 1) { pitch -= wave; roll += wave; }
        else if (store.hydraulicsCorner === 2) { pitch -= wave; roll -= wave; }
        else if (store.hydraulicsCorner === 3) { pitch += wave; roll += wave; }
        else { pitch += wave; roll -= wave; }
      }
      chassisRef.current.rotation.x = pitch;
      chassisRef.current.rotation.z = roll;
      chassisRef.current.scale.set(
        1 + (1 - squashY.current) * 0.35,
        squashY.current,
        1 + (1 - squashY.current) * 0.25
      );
    }

    // Whippy antenna sway
    if (antennaRef.current) {
      antennaRef.current.rotation.x = -driveSpeed.current * 0.025 + Math.sin(t * 10) * 0.05;
      antennaRef.current.rotation.z = -turnInput * 0.22 + Math.cos(t * 8) * 0.04;
    }

    // Spin all 4 monster wheels & steer front 2 wheels
    wheelRotation.current += driveSpeed.current * dt * 2.2;
    wheelSpinRef.current.forEach((w) => {
      if (w) w.rotation.x = wheelRotation.current;
    });
    if (wheelGroupsRef.current[0]) wheelGroupsRef.current[0].rotation.y = steerVisual.current;
    if (wheelGroupsRef.current[1]) wheelGroupsRef.current[1].rotation.y = steerVisual.current;

    // Brighten brake tail lights when reversing or decelerating
    const braking = brakeKey || backward || (Math.abs(driveSpeed.current) > 2 && !forward);
    tailLightsRef.current.forEach((tl) => {
      if (tl) tl.material.emissiveIntensity = braking ? 6.0 : 2.2;
    });

    // Update Horn Shockwave expanding ring visual
    if (shockwaveRef.current) {
      const hornAge = (performance.now() - store.hornPulseTime) / 1000;
      if (hornAge < 0.75) {
        shockwaveRef.current.visible = true;
        const r = 1 + hornAge * 26;
        shockwaveRef.current.scale.set(r, r, 1);
        shockwaveRef.current.material.opacity = Math.max(0, 1 - hornAge / 0.75);
      } else {
        shockwaveRef.current.visible = false;
      }
    }

    // Update Particle Trail
    if (trailInstRef.current) {
      if (Math.abs(driveSpeed.current) > 2.5) {
        const slot = trailHistory[trailCursor.current];
        slot.x = pos.x - dirX * 1.9 + (Math.random() - 0.5) * 0.7;
        slot.y = pos.y - 0.35 + Math.random() * 0.28;
        slot.z = pos.z - dirZ * 1.9 + (Math.random() - 0.5) * 0.7;
        slot.size = isBoosting ? 0.42 : 0.24;
        trailCursor.current = (trailCursor.current + 1) % trailHistory.length;
      }

      const style = store.roverCustomization.trailStyle;
      for (let i = 0; i < trailHistory.length; i++) {
        const p = trailHistory[i];
        p.size = Math.max(0.001, p.size - dt * 0.42);
        dummy.position.set(p.x, p.y, p.z);
        dummy.rotation.set(t * 3 + i, t * 2 + i, 0);
        dummy.scale.setScalar(p.size);
        dummy.updateMatrix();
        trailInstRef.current.setMatrixAt(i, dummy.matrix);

        if (style === 'rainbow') {
          colorObj.setHSL((t * 0.5 + i * 0.04) % 1, 1, 0.55);
        } else if (style === 'flames') {
          colorObj.set(i % 2 === 0 ? '#fb923c' : '#e11d48');
        } else {
          colorObj.set(isBoosting ? '#a855f7' : '#00ffcc');
        }
        trailInstRef.current.setColorAt(i, colorObj);
      }
      trailInstRef.current.instanceMatrix.needsUpdate = true;
      if (trailInstRef.current.instanceColor) trailInstRef.current.instanceColor.needsUpdate = true;
    }

    // Update store telemetry & engine hum
    store.setRoverTelemetry([pos.x, pos.y, pos.z], roverAngle.current);
    const spdKmh = Math.round(Math.abs(driveSpeed.current) * 3.6);
    if (spdKmh !== lastSpeed.current) {
      lastSpeed.current = spdKmh;
      store.setRoverSpeed(spdKmh);
    }
    sound.updateEngine(spdKmh, isBoosting);

    // Zone detection & dynamic zone underglow shift
    const zone = checkZone(pos);
    if (zone && zone.id !== lastZoneId.current) {
      lastZoneId.current = zone.id;
      store.setCurrentZone(zone.id);
      if (underglowRef.current) {
        underglowRef.current.material.color.set(zone.color);
        underglowRef.current.material.emissive.set(zone.color);
      }
    }

    // ─── 4 Camera Modes: 'follow' | 'aerial' | 'orbit360' | 'station' (Live Billboard Close-Up like Screenshot 3!) ───
    const camMode = store.cameraMode;
    if (camMode === 'station' && store.focusedStation) {
      const [sx, , sz] = store.focusedStation.position;
      const targetX = sx;
      const targetY = 5.0;
      const targetZ = sz + 11.2;
      camera.position.x += (targetX - camera.position.x) * 0.09;
      camera.position.y += (targetY - camera.position.y) * 0.09;
      camera.position.z += (targetZ - camera.position.z) * 0.09;
      camTarget.current.set(sx, 4.7, sz);
      camera.lookAt(camTarget.current);
    } else if (camMode === 'aerial') {
      const angle = orbitYaw.current;
      const targetX = Math.sin(angle) * 38;
      const targetY = 98 + zoomOffset.current * 2;
      const targetZ = Math.cos(angle) * 38 + 12;
      camera.position.x += (targetX - camera.position.x) * 0.06;
      camera.position.y += (targetY - camera.position.y) * 0.06;
      camera.position.z += (targetZ - camera.position.z) * 0.06;
      camTarget.current.set(0, 0, -4);
      camera.lookAt(camTarget.current);
    } else if (camMode === 'orbit360') {
      const orbitAngle = t * 0.32 + orbitYaw.current;
      const radius = 82 + zoomOffset.current * 2;
      const targetX = Math.sin(orbitAngle) * radius;
      const targetY = 54 + Math.sin(t * 0.5) * 6;
      const targetZ = Math.cos(orbitAngle) * radius;
      camera.position.x += (targetX - camera.position.x) * 0.06;
      camera.position.y += (targetY - camera.position.y) * 0.06;
      camera.position.z += (targetZ - camera.position.z) * 0.06;
      camTarget.current.set(0, 2, -2);
      camera.lookAt(camTarget.current);
    } else {
      // High ~48° Third-Person Follow Camera + Trackpad Zoom & Drag Orbit
      const camAngle = roverAngle.current + orbitYaw.current;
      const pullBack =
        16.2 +
        zoomOffset.current +
        (Math.abs(driveSpeed.current) / SPEED) * (isBoosting ? 4.5 : 2.2);
      const camHeight =
        13.6 +
        zoomOffset.current * 0.65 +
        orbitPitch.current * 12 +
        (isBoosting ? 1.4 : 0);

      const targetX = pos.x - Math.sin(camAngle) * pullBack;
      const targetY = Math.max(3.5, pos.y + camHeight);
      const targetZ = pos.z - Math.cos(camAngle) * pullBack;

      camera.position.x += (targetX - camera.position.x) * 0.095;
      camera.position.y += (targetY - camera.position.y) * 0.095;
      camera.position.z += (targetZ - camera.position.z) * 0.095;

      camTarget.current.set(pos.x + dirX * 3.8, pos.y + 0.8, pos.z + dirZ * 3.8);
      camera.lookAt(camTarget.current);
    }

    // Dynamic FOV
    const targetFov = camMode === 'station' ? 50 : camMode !== 'follow' ? 54 : isBoosting ? 68 : 56;
    if (Math.abs(camera.fov - targetFov) > 0.1) {
      camera.fov += (targetFov - camera.fov) * 0.08;
      camera.updateProjectionMatrix();
    }
  });

  const bodyColor = roverCustomization.color || '#e11d48';
  const accentColor = roverCustomization.accentColor || '#fb923c';

  return (
    <>
      {/* Physics Collider Body */}
      <RigidBody
        ref={bodyRef}
        position={SPAWN_POSITION}
        mass={1.5}
        linearDamping={0}
        angularDamping={10}
        lockRotations
        colliders="cuboid"
        restitution={0}
        friction={0}
        ccd
      >
        <mesh visible={false}>
          <boxGeometry args={[2.2, 1.3, 3.6]} />
          <meshStandardMaterial />
        </mesh>
      </RigidBody>

      {/* Instanced Speed / Nitro Particle Trail */}
      <instancedMesh ref={trailInstRef} args={[null, null, trailHistory.length]}>
        <dodecahedronGeometry args={[1, 0]} />
        <meshStandardMaterial color="#ffffff" emissive={accentColor} emissiveIntensity={2.8} />
      </instancedMesh>

      {/* Visual Chunky Monster-Truck Rover Group */}
      <group ref={meshRef}>
        {/* Horn Shockwave Ring */}
        <mesh
          ref={shockwaveRef}
          position={[0, 0.25, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          visible={false}
        >
          <ringGeometry args={[0.85, 1.05, 32]} />
          <meshStandardMaterial
            color={accentColor}
            emissive={accentColor}
            emissiveIntensity={4}
            transparent
            opacity={0.9}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Suspension & Squash-and-Stretch Chassis Group */}
        <group ref={chassisRef}>
          {/* Lower Dark Heavy Frame & Wheel Arches */}
          <mesh position={[0, 0.52, 0]} castShadow>
            <boxGeometry args={[2.05, 0.42, 3.55]} />
            <meshStandardMaterial color="#18181b" metalness={0.7} roughness={0.4} />
          </mesh>

          {/* Main Chunky Monster-Truck Body */}
          <mesh position={[0, 0.92, 0]} castShadow>
            <boxGeometry args={[2.22, 0.72, 3.5]} />
            <meshStandardMaterial
              color={bodyColor}
              metalness={0.35}
              roughness={0.32}
              emissive={bodyColor}
              emissiveIntensity={0.18}
            />
          </mesh>

          {/* Sculpted Hood Scoop & Black Vents */}
          <mesh position={[0, 1.31, 0.95]} castShadow>
            <boxGeometry args={[1.35, 0.14, 1.15]} />
            <meshStandardMaterial color="#18181b" metalness={0.6} roughness={0.4} />
          </mesh>
          {[-0.35, 0.35].map((vx, i) => (
            <mesh key={i} position={[vx, 1.39, 0.95]}>
              <boxGeometry args={[0.36, 0.04, 0.75]} />
              <meshStandardMaterial color="#09090b" />
            </mesh>
          ))}

          {/* Raised Cabin Roof */}
          <mesh position={[0, 1.54, -0.22]} castShadow>
            <boxGeometry args={[1.86, 0.68, 1.92]} />
            <meshStandardMaterial color={bodyColor} metalness={0.35} roughness={0.32} />
          </mesh>

          {/* Dark Tinted Cabin Windows */}
          <mesh position={[0, 1.54, -0.2]}>
            <boxGeometry args={[1.9, 0.52, 1.65]} />
            <meshStandardMaterial color="#1e1b4b" metalness={0.85} roughness={0.15} />
          </mesh>

          {/* External Black Roll-Cage Bars */}
          {[
            [-0.94, 1.56, -0.22, 0.1, 0.74, 1.98],
            [0.94, 1.56, -0.22, 0.1, 0.74, 1.98],
            [0, 1.92, 0.72, 1.96, 0.1, 0.12],
            [0, 1.92, -1.16, 1.96, 0.1, 0.12],
          ].map(([x, y, z, w, h, d], idx) => (
            <mesh key={idx} position={[x, y, z]} castShadow>
              <boxGeometry args={[w, h, d]} />
              <meshStandardMaterial color="#18181b" metalness={0.75} roughness={0.3} />
            </mesh>
          ))}

          {/* Roof LED Light Bar with 4 Warm Amber Lamps */}
          <group position={[0, 2.02, 0.62]}>
            <mesh castShadow>
              <boxGeometry args={[1.45, 0.18, 0.22]} />
              <meshStandardMaterial color="#18181b" metalness={0.8} roughness={0.25} />
            </mesh>
            {[-0.48, -0.16, 0.16, 0.48].map((lx, i) => (
              <mesh key={i} position={[lx, 0, 0.12]}>
                <boxGeometry args={[0.2, 0.11, 0.04]} />
                <meshStandardMaterial color="#fef08a" emissive="#f59e0b" emissiveIntensity={4.5} />
              </mesh>
            ))}
          </group>

          {/* Front Heavy Bull-Bar Bumper & Warm Glowing Grille Strip */}
          <mesh position={[0, 0.68, 1.82]} castShadow>
            <boxGeometry args={[2.16, 0.44, 0.26]} />
            <meshStandardMaterial color="#18181b" metalness={0.8} roughness={0.3} />
          </mesh>
          <mesh position={[0, 0.78, 1.94]}>
            <boxGeometry args={[1.45, 0.22, 0.06]} />
            <meshStandardMaterial color="#fef08a" emissive="#fb923c" emissiveIntensity={4.5} />
          </mesh>
          <pointLight position={[0, 0.9, 2.2]} color="#fb923c" intensity={4.0} distance={16} decay={2} />

          {/* Soft Purple / Zone-Reactive Underglow */}
          <mesh ref={underglowRef} position={[0, 0.18, 0]}>
            <boxGeometry args={[2.1, 0.07, 3.4]} />
            <meshStandardMaterial
              color="#a855f7"
              emissive="#a855f7"
              emissiveIntensity={2.6}
              transparent
              opacity={0.9}
            />
          </mesh>

          {/* Brake-Reactive Tail Lights */}
          {[-0.72, 0.72].map((x, i) => (
            <mesh
              key={i}
              ref={(el) => (tailLightsRef.current[i] = el)}
              position={[x, 0.88, -1.78]}
            >
              <boxGeometry args={[0.42, 0.18, 0.08]} />
              <meshStandardMaterial color="#ff2244" emissive="#ff2244" emissiveIntensity={2.5} />
            </mesh>
          ))}

          {/* Whippy Spring Antenna with Flag */}
          <group position={[-0.75, 1.9, -0.95]} ref={antennaRef}>
            <mesh position={[0, 0.55, 0]}>
              <cylinderGeometry args={[0.025, 0.04, 1.1, 6]} />
              <meshStandardMaterial color="#e2e8f0" metalness={0.9} roughness={0.15} />
            </mesh>
            <mesh position={[0, 1.12, 0]}>
              <sphereGeometry args={[0.09, 8, 8]} />
              <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={4} />
            </mesh>
          </group>
        </group>

        {/* 4 Chunky Oversized Monster-Truck Tires */}
        {[
          [-1.24, 0.54, 1.22],
          [1.24, 0.54, 1.22],
          [-1.24, 0.54, -1.22],
          [1.24, 0.54, -1.22],
        ].map((p, i) => (
          <group
            key={i}
            position={p}
            ref={(el) => (wheelGroupsRef.current[i] = el)}
          >
            <group ref={(el) => (wheelSpinRef.current[i] = el)}>
              <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
                <cylinderGeometry args={[0.56, 0.56, 0.52, 16]} />
                <meshStandardMaterial color="#18181b" metalness={0.25} roughness={0.8} />
              </mesh>
              {Array.from({ length: 8 }).map((_, tIdx) => {
                const a = (tIdx / 8) * Math.PI * 2;
                return (
                  <mesh
                    key={tIdx}
                    position={[0, Math.sin(a) * 0.56, Math.cos(a) * 0.56]}
                    rotation={[a, 0, 0]}
                  >
                    <boxGeometry args={[0.48, 0.08, 0.14]} />
                    <meshStandardMaterial color="#09090b" roughness={0.9} />
                  </mesh>
                );
              })}
              <mesh rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.3, 0.3, 0.55, 10]} />
                <meshStandardMaterial
                  color={bodyColor}
                  metalness={0.75}
                  roughness={0.25}
                  emissive={accentColor}
                  emissiveIntensity={0.45}
                />
              </mesh>
            </group>
          </group>
        ))}
      </group>
    </>
  );
}
