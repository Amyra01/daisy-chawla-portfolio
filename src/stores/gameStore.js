import { create } from 'zustand';
import { SPAWN_POSITION } from '../data/zones';
import sound from '../utils/sound';

const loadSavedCustomization = () => {
  try {
    const raw = localStorage.getItem('daisy_rover_custom_v4');
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore storage errors
  }
  return {
    color: '#e11d48',       // Chunky Crimson/Orange Monster-Truck
    accentColor: '#fb923c', // Warm Golden-Orange accent
    trailStyle: 'flames',   // 'electric' | 'rainbow' | 'flames'
    hornType: 'cyber',      // 'cyber' | 'synth' | 'arcade'
  };
};

const loadBestLap = () => {
  try {
    const raw = localStorage.getItem('daisy_best_lap_v2');
    return raw ? parseFloat(raw) : null;
  } catch {
    return null;
  }
};

const loadWhispers = () => {
  try {
    const raw = localStorage.getItem('daisy_whispers_v1');
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return [
    { id: 1, tag: 'DEV', text: 'LOVE IT!! The 3D DAISY CHAWLA letters & lemon stand are so fun!', time: '2m ago' },
    { id: 2, tag: 'AI', text: 'JusticeFlow AI live station carousel works just like Bruno Simon!', time: '6m ago' },
    { id: 3, tag: '3D', text: 'Trackpad scrolling makes driving around super smooth!', time: '12m ago' },
  ];
};

const useGameStore = create((set, get) => ({
  // Rover live state (updated by Rover.jsx)
  roverPosition: [...SPAWN_POSITION],
  roverAngle: Math.PI,
  currentSpeed: 0,
  isNitro: false,
  isBraking: false,
  isDrifting: false,
  boostKickUntil: 0,
  cameraShake: 0,
  hydraulicsPulse: 0,
  hydraulicsCorner: 0,
  roverSpeedMultiplier: 1.0,
  trackpadDriveEnabled: true,
  forceTouchControls: false,
  setRoverSpeedMultiplier: (mult) => {
    sound.playChime();
    set({
      roverSpeedMultiplier: mult,
      toastMessage: mult > 1 ? '🚀 Rover Speed: TURBO OVERCLOCK!' : '🚗 Rover Speed: Smooth Cruise',
    });
  },
  setTrackpadDriveEnabled: (enabled) => {
    sound.playChime();
    set({
      trackpadDriveEnabled: enabled,
      toastMessage: enabled
        ? '🖱️ Trackpad Two-Finger Scroll & Click-to-Drive Enabled!'
        : '🖱️ Trackpad Scroll set to Camera Zoom Only',
    });
  },
  setForceTouchControls: (show) => {
    sound.playChime();
    set({
      forceTouchControls: show,
      toastMessage: show ? '📱 On-Screen Touch Joystick Enabled!' : '📱 On-Screen Touch Joystick Hidden',
    });
  },
  setRoverTelemetry: (pos, angle) => set({ roverPosition: pos, roverAngle: angle }),
  setRoverSpeed: (speed) => set({ currentSpeed: speed }),
  setNitroState: (isNitro) => set({ isNitro }),
  triggerBoostKick: () => {
    sound.playBoost();
    set({ boostKickUntil: performance.now() + 1400, cameraShake: 0.4 });
  },
  triggerCameraShake: (amount = 0.35) => set({ cameraShake: amount }),
  triggerHydraulics: (corner = 0) => {
    sound.playBoost();
    set({ hydraulicsPulse: performance.now(), hydraulicsCorner: corner });
  },

  // Camera View Modes: 'follow' (45° Ref 1) | 'aerial' (High Full-Board View) | 'orbit360' (360° Cinematic View) | 'station' (Close-up Live Billboard View Ref 3)
  cameraMode: 'follow',
  setCameraMode: (mode) => {
    sound.playChime();
    const labels = {
      follow: '🚗 Third-Person Follow Camera',
      aerial: '🦅 Full Aerial Motherboard View from Height',
      orbit360: '🔄 360° Panoramic Motherboard Orbit View',
      station: '📺 Live Project Station Close-Up View',
    };
    set({
      cameraMode: mode,
      focusedStation: mode === 'station' ? get().focusedStation : null,
      toastMessage: labels[mode] || 'Camera mode updated',
    });
  },
  cycleCameraMode: () => {
    const order = ['follow', 'aerial', 'orbit360'];
    const cur = get().cameraMode;
    const next = order[(order.indexOf(cur) + 1) % order.length];
    get().setCameraMode(next);
  },

  // Live 3D Project Station Focus & Carousel State (Matching Screenshot 3!)
  focusedStation: null, // { position: [x,y,z], projectIndex: 0 }
  stationSlideIndex: 0,
  focusProjectStation: (position, projectIndex = 0) => {
    sound.playChime();
    set({
      focusedStation: { position: [...position], projectIndex },
      stationSlideIndex: 0,
      cameraMode: 'station',
      toastMessage: '📺 Station Focused! Use ← / → to flip slides, ENTER to open live link, ESC to exit.',
    });
  },
  exitProjectStation: () => {
    sound.playChime();
    set({
      focusedStation: null,
      cameraMode: 'follow',
    });
  },
  nextStationSlide: (totalSlides = 4) => {
    sound.playBitCollect(4);
    set((s) => ({ stationSlideIndex: (s.stationSlideIndex + 1) % totalSlides }));
  },
  prevStationSlide: (totalSlides = 4) => {
    sound.playBitCollect(2);
    set((s) => ({ stationSlideIndex: (s.stationSlideIndex - 1 + totalSlides) % totalSlides }));
  },

  // Interactive Side Roadmap / Teaching Guide
  showRoadmapGuide: true,
  setShowRoadmapGuide: (show) => set({ showRoadmapGuide: show }),
  activeTourStep: 0,
  setActiveTourStep: (step) => set({ activeTourStep: step }),

  // Full-Screen Illustrated Top-Down World Map
  showWorldMap: false,
  setShowWorldMap: (show) => {
    sound.playChime();
    set({ showWorldMap: show, showMainMenu: false });
  },
  toggleWorldMap: () => {
    const next = !get().showWorldMap;
    sound.playChime();
    set({ showWorldMap: next, showMainMenu: false });
  },

  // Bruno-Style Split-Screen Diorama Tabbed Menu
  showMainMenu: false,
  activeMenuTab: 'home', // 'home' | 'settings' | 'controls' | 'achievements' | 'circuit' | 'whispers' | 'credits'
  setShowMainMenu: (show, tab) => {
    sound.playChime();
    set((s) => ({
      showMainMenu: show,
      activeMenuTab: tab || s.activeMenuTab,
      showWorldMap: false,
    }));
  },
  setActiveMenuTab: (tab) => {
    sound.playChime();
    set({ activeMenuTab: tab });
  },

  // Visitor Whispers
  whispers: loadWhispers(),
  addWhisper: (tag, text) =>
    set((s) => {
      const cleanTag = (tag || 'VIS').toUpperCase().slice(0, 3);
      const cleanText = (text || 'Awesome 3D Motherboard Portfolio!').slice(0, 80);
      const next = [
        { id: Date.now(), tag: cleanTag, text: cleanText, time: 'Just now' },
        ...s.whispers.slice(0, 9),
      ];
      try {
        localStorage.setItem('daisy_whispers_v1', JSON.stringify(next));
      } catch {
        // ignore
      }
      sound.playChime();
      return { whispers: next, toastMessage: `💬 Whisper [${cleanTag}] posted to the board!` };
    }),

  // Horn shockwave pulse
  hornPulseTime: 0,
  hornOrigin: [0, 0, 0],
  triggerHorn: () => {
    const { roverPosition, roverCustomization } = get();
    sound.playHorn(roverCustomization.hornType);
    set({
      hornPulseTime: performance.now(),
      hornOrigin: [...roverPosition],
    });
  },

  // Teleport / Quick-Warp (Always creates a fresh object with timestamp so repeated clicks always fire!)
  teleportTarget: null,
  setTeleportTo: (position, label = '') => {
    sound.playBoost();
    set({
      teleportTarget: {
        pos: [position[0], position[1] ?? 2.6, position[2]],
        ts: performance.now(),
      },
      autoDriveTarget: null,
      focusedStation: null,
      cameraMode: 'follow',
      showWorldMap: false,
      showMainMenu: false,
      toastMessage: label ? `⚡ Teleported to ${label}!` : '⚡ Teleported Rover!',
    });
  },
  clearTeleport: () => set({ teleportTarget: null }),

  // Auto-Drive Target (Click on floor or click "Auto-Drive" on Roadmap / Trackpad)
  autoDriveTarget: null,
  setAutoDriveTarget: (pos, label = 'Destination') => {
    sound.playChime();
    set({
      autoDriveTarget: [pos[0], 0, pos[2]],
      waypoint: [pos[0], 2.6, pos[2]],
      waypointLabel: label,
      waypointSetTime: performance.now(),
      focusedStation: null,
      cameraMode: 'follow',
      showWorldMap: false,
      showMainMenu: false,
      toastMessage: `🧭 Auto-Driving & Guiding to: ${label}`,
    });
  },
  clearAutoDriveTarget: () => set({ autoDriveTarget: null }),

  // Waypoint navigation (set from Side Roadmap Guide or World Map)
  waypoint: null,
  waypointLabel: '',
  waypointSetTime: 0,
  setWaypoint: (pos, label = 'Waypoint') => {
    sound.playChime();
    set({
      waypoint: [pos[0], pos[1] ?? 2.6, pos[2]],
      waypointLabel: label,
      waypointSetTime: performance.now(),
      focusedStation: null,
      cameraMode: 'follow',
      showWorldMap: false,
      showMainMenu: false,
      toastMessage: `🧭 Glowing Path Activated → ${label}!`,
    });
  },
  clearWaypoint: () => set({ waypoint: null, waypointLabel: '' }),

  // Zone tracking & Explore tracker
  currentZone: 'cpu',
  exploredZones: ['cpu'],
  setCurrentZone: (zone) =>
    set((state) => {
      const explored = state.exploredZones.includes(zone)
        ? state.exploredZones
        : [...state.exploredZones, zone];
      return { currentZone: zone, exploredZones: explored };
    }),

  // Drive-in Trigger Pad system
  nearbyTrigger: null,
  setNearbyTrigger: (trigger) => {
    const prev = get().nearbyTrigger;
    if (trigger && (!prev || prev.id !== trigger.id)) {
      sound.playChime();
    }
    set({ nearbyTrigger: trigger });
  },
  clearNearbyTrigger: (id) => {
    const cur = get().nearbyTrigger;
    if (!id || (cur && cur.id === id)) {
      set({ nearbyTrigger: null });
    }
  },

  activateNearbyTrigger: () => {
    const state = get();
    const t = state.nearbyTrigger;
    if (t) {
      if (t.type === 'about') set({ showAboutModal: true });
      else if (t.type === 'skill') set({ showSkillModal: true });
      else if (t.type === 'project') set({ activeProject: t.data });
      else if (t.type === 'experience') set({ activeExperience: t.data });
      else if (t.type === 'resume') set({ showResumeModal: true });
      else if (t.type === 'garage') set({ showGarageModal: true });
      else if (t.type === 'reset-crates') state.resetSkillCrates();
      else if (t.type === 'reset-pins') state.resetBowlingPins();
      else if (t.type === 'timetrial') state.startTimeTrial();
      else if (t.type === 'contact' && t.data?.href) {
        window.open(t.data.href, '_blank', 'noopener,noreferrer');
        state.showToast(`Opened ${t.title} (${t.subtitle})`);
      }
      return true;
    }
    return false;
  },

  // Modals
  showAboutModal: false,
  setShowAboutModal: (show) => set({ showAboutModal: show }),

  showSkillModal: false,
  setShowSkillModal: (show) => set({ showSkillModal: show }),
  highlightedSkill: null,
  setHighlightedSkill: (name) => set({ highlightedSkill: name }),

  activeProject: null,
  setActiveProject: (project) => set({ activeProject: project }),

  activeExperience: null,
  setActiveExperience: (exp) => set({ activeExperience: exp }),

  showResumeModal: false,
  setShowResumeModal: (show) => set({ showResumeModal: show }),

  showGarageModal: false,
  setShowGarageModal: (show) => set({ showGarageModal: show }),

  closeAllModals: () =>
    set({
      showAboutModal: false,
      showSkillModal: false,
      activeProject: null,
      activeExperience: null,
      showResumeModal: false,
      showGarageModal: false,
      showControls: false,
      showWorldMap: false,
      showMainMenu: false,
      focusedStation: null,
      cameraMode: get().cameraMode === 'station' ? 'follow' : get().cameraMode,
    }),

  // Physics Skill Crates & Bowling Pins reset counters
  crateResetCounter: 0,
  resetSkillCrates: () => {
    sound.playChime();
    set((s) => ({
      crateResetCounter: s.crateResetCounter + 1,
      toastMessage: '📦 Skill crates restacked in RAM Alley!',
    }));
  },

  pinResetCounter: 0,
  knockedPinsCount: 0,
  setKnockedPinsCount: (count) => set({ knockedPinsCount: count }),
  resetBowlingPins: () => {
    sound.playChime();
    set((s) => ({
      pinResetCounter: s.pinResetCounter + 1,
      knockedPinsCount: 0,
      toastMessage: '🎳 Transistor bowling pins reset!',
    }));
  },

  // Collectibles: 50 Data Bits & 5 Golden Capacitors
  collectedBits: [],
  totalBits: 50,
  collectBit: (index) =>
    set((state) => {
      if (state.collectedBits.includes(index)) return state;
      const next = [...state.collectedBits, index];
      sound.playBitCollect(next.length);
      return {
        collectedBits: next,
        toastMessage:
          next.length % 10 === 0
            ? `⚡ ${next.length} / ${state.totalBits} Data Bits Collected!`
            : state.toastMessage,
      };
    }),

  collectedGoldCaps: [],
  totalGoldCaps: 5,
  collectGoldCap: (index, rewardLabel) =>
    set((state) => {
      if (state.collectedGoldCaps.includes(index)) return state;
      const next = [...state.collectedGoldCaps, index];
      sound.playFirework();
      return {
        collectedGoldCaps: next,
        toastMessage: `🌟 Golden Capacitor ${next.length}/5 Found! Unlocked: ${rewardLabel}`,
      };
    }),

  // Boot Sequence Time Trial
  timeTrial: {
    active: false,
    startTime: 0,
    checkpoint: 0,
    totalCheckpoints: 5,
    lastTime: null,
    bestTime: loadBestLap(),
  },
  startTimeTrial: () => {
    sound.playChime();
    set((s) => ({
      timeTrial: {
        ...s.timeTrial,
        active: true,
        startTime: performance.now(),
        checkpoint: 0,
      },
      toastMessage: '🏁 Boot Sequence Time Trial Started! Pass through all 5 glowing gates!',
    }));
  },
  advanceCheckpoint: (cpIndex) =>
    set((state) => {
      const tt = state.timeTrial;
      if (!tt.active || cpIndex !== tt.checkpoint) return state;
      const nextCp = tt.checkpoint + 1;
      if (nextCp >= tt.totalCheckpoints) {
        const elapsed = +((performance.now() - tt.startTime) / 1000).toFixed(2);
        const best = tt.bestTime === null ? elapsed : Math.min(tt.bestTime, elapsed);
        try {
          localStorage.setItem('daisy_best_lap_v2', String(best));
        } catch {
          // ignore
        }
        sound.playFirework();
        return {
          timeTrial: {
            ...tt,
            active: false,
            checkpoint: 0,
            lastTime: elapsed,
            bestTime: best,
          },
          toastMessage: `🏆 Boot Sequence Complete in ${elapsed}s! (Best: ${best}s)`,
        };
      }
      sound.playBitCollect(nextCp * 3);
      return {
        timeTrial: { ...tt, checkpoint: nextCp },
        toastMessage: `⚡ Checkpoint ${nextCp}/${tt.totalCheckpoints}!`,
      };
    }),

  // Rover Personalization
  roverCustomization: loadSavedCustomization(),
  updateRoverCustomization: (patch) =>
    set((state) => {
      const updated = { ...state.roverCustomization, ...patch };
      try {
        localStorage.setItem('daisy_rover_custom_v4', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return { roverCustomization: updated };
    }),

  // Surprise Events: Power Surge
  powerSurgeActive: false,
  triggerPowerSurge: () => {
    sound.playPowerSurge();
    set({
      powerSurgeActive: true,
      toastMessage: '⚡ MOTHERBOARD OVERCLOCK SURGE DETECTED!',
    });
    setTimeout(() => set({ powerSurgeActive: false }), 4500);
  },

  // Lighting Mode: 'golden' (Soothing Sunset Coral-Violet Default) | 'pastel' (Bright Pastel Dream) | 'cyberpunk' (Neon Cyber)
  lightingMode: 'golden',
  setLightingMode: (mode) => {
    sound.playChime();
    set({ lightingMode: mode });
  },
  cycleLightingMode: () =>
    set((s) => {
      const order = ['golden', 'pastel', 'cyberpunk'];
      const next = order[(order.indexOf(s.lightingMode) + 1) % order.length];
      return { lightingMode: next };
    }),

  quality: 'high', // 'low' | 'medium' | 'high'
  setQuality: (q) => {
    sound.playChime();
    set({ quality: q, toastMessage: `✨ Graphics Quality set to ${q.toUpperCase()}` });
  },
  cycleQuality: () =>
    set((s) => {
      const order = ['high', 'medium', 'low'];
      const next = order[(order.indexOf(s.quality) + 1) % order.length];
      return { quality: next };
    }),

  // 2D Portfolio Mode toggle
  is2DMode: false,
  setIs2DMode: (val) => set({ is2DMode: val }),

  // Audio
  isMuted: false,
  toggleMute: () =>
    set((state) => {
      const next = !state.isMuted;
      sound.setMuted(next);
      return { isMuted: next };
    }),

  // Mobile touch controls
  touchControls: {
    forward: false,
    backward: false,
    left: false,
    right: false,
    jump: false,
    nitro: false,
    horn: false,
    respawn: false,
  },
  setTouchControls: (controls) =>
    set((state) => ({
      touchControls: { ...state.touchControls, ...controls },
    })),

  // Welcome banner & controls help
  showWelcome: true,
  dismissWelcome: () => {
    sound.ensureContext();
    sound.setMuted(get().isMuted);
    sound.playChime();
    set({ showWelcome: false });
  },

  showControls: false,
  setShowControls: (show) => set({ showControls: show }),

  // Toast notifications
  toastMessage: null,
  showToast: (msg) => set({ toastMessage: msg }),
  clearToast: () => set({ toastMessage: null }),
}));

export default useGameStore;
