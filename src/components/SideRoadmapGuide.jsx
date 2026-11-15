import { motion, AnimatePresence } from 'framer-motion';
import useGameStore from '../stores/gameStore';
import { MAP_DIAMOND_POINTS } from './WorldMapModal';
import projects from '../data/projects.json';
import { resumeData } from '../data/resumeData';

const TOUR_STEPS = [
  {
    step: 1,
    badge: 'START HERE • CENTER',
    title: 'CPU Socket & 3D Name Plaza',
    italicGuide: '“See the giant 3D DAISY CHAWLA letters, lemon stand & CPU socket!”',
    howToGo: 'Right at the center plaza — drive forward or click Teleport.',
    pos: [0, 2.6, 15],
    color: '#00ff88',
    action: 'about',
  },
  {
    step: 2,
    badge: 'NORTH-EAST • 3D TIMELINE',
    title: 'Career Timeline Lanes (2023–2027)',
    italicGuide: '“Read the 3D milestone boards along the Cyan, Purple & Gold floor lanes!”',
    howToGo: 'Drive North-East to [15, 4] to drive over the 2023–2025 slabs.',
    pos: [15.0, 2.6, 7.5],
    color: '#38bdf8',
    action: 'experience',
  },
  {
    step: 3,
    badge: 'LIVE STATION • SHOWCASE',
    title: 'Live JusticeFlow Project Station',
    italicGuide: '“Interactive 3D billboard with live slide carousel, chalkboard & bell desk!”',
    howToGo: 'Located right beside the Career Timeline at [27.5, -2.5].',
    pos: [27.5, 2.6, 6.5],
    stationPos: [27.5, 0, -2.5],
    color: '#f43f5e',
    action: 'station',
  },
  {
    step: 4,
    badge: 'NORTH • GPU BOULEVARD',
    title: '5 Framed Project Stations',
    italicGuide: '“Explore JusticeFlow AI, Code Slayer 2K25, Code for Bharat & Zomatothon.”',
    howToGo: 'Follow the North Purple Highway straight up to GPU Boulevard.',
    pos: [0, 2.6, -40],
    stationPos: [0, 0, -49],
    color: '#a855f7',
    action: 'project',
  },
  {
    step: 5,
    badge: 'EAST • DDR5 RAM ALLEY',
    title: 'Skills Stack & Physics Crates',
    italicGuide: '“Smash through 22 physics skill crates or inspect the 4 DDR5 memory towers.”',
    howToGo: 'Follow the East Cyan Highway from the center CPU socket.',
    pos: [36, 2.6, -4],
    color: '#06b6d4',
    action: 'skill',
  },
  {
    step: 6,
    badge: 'SOUTH-EAST • 1200W PSU BAY',
    title: 'Official Resume PDF & Certificates',
    italicGuide: '“Download Daisy’s verified resume PDF and open all Google Drive certificates.”',
    howToGo: 'Drive South-East to the glowing Red 1200W Power Supply Unit.',
    pos: [28, 2.6, 28],
    color: '#ef4444',
    action: 'resume',
  },
];

export default function SideRoadmapGuide() {
  const showRoadmapGuide = useGameStore((s) => s.showRoadmapGuide);
  const setShowRoadmapGuide = useGameStore((s) => s.setShowRoadmapGuide);
  const activeTourStep = useGameStore((s) => s.activeTourStep);
  const setActiveTourStep = useGameStore((s) => s.setActiveTourStep);
  const cameraMode = useGameStore((s) => s.cameraMode);
  const setCameraMode = useGameStore((s) => s.setCameraMode);
  const setAutoDriveTarget = useGameStore((s) => s.setAutoDriveTarget);
  const setTeleportTo = useGameStore((s) => s.setTeleportTo);
  const focusProjectStation = useGameStore((s) => s.focusProjectStation);
  const setShowWorldMap = useGameStore((s) => s.setShowWorldMap);
  const roverPosition = useGameStore((s) => s.roverPosition);

  const curStep = TOUR_STEPS[activeTourStep] || TOUR_STEPS[0];

  // 1. "🧭 Guide Path" -> Sets glowing path AND smoothly auto-drives rover along the path!
  const handleGuideStep = (stepObj, index, e) => {
    e?.stopPropagation?.();
    setActiveTourStep(index);
    setAutoDriveTarget(stepObj.pos, `Step ${stepObj.step}: ${stepObj.title}`);
  };

  // 2. "⚡ Teleport" -> Instantly teleports rover in 3D to the location (and focuses live 3D station if applicable)
  const handleTeleportStep = (stepObj, index, e) => {
    e?.stopPropagation?.();
    const store = useGameStore.getState();
    setActiveTourStep(index);
    store.closeAllModals();
    setTeleportTo(stepObj.pos, stepObj.title);
    if (stepObj.action === 'station' && stepObj.stationPos) {
      setTimeout(() => {
        focusProjectStation(stepObj.stationPos, 0);
      }, 120);
    }
  };

  // 3. "📖 Open Card" -> Teleports AND opens the detailed modal popup
  const handleOpenModalStep = (stepObj, index, e) => {
    e?.stopPropagation?.();
    const store = useGameStore.getState();
    setActiveTourStep(index);
    store.closeAllModals();
    setTeleportTo(stepObj.pos, stepObj.title);
    if (stepObj.action === 'about') store.setShowAboutModal(true);
    else if (stepObj.action === 'skill') store.setShowSkillModal(true);
    else if (stepObj.action === 'project' || stepObj.action === 'station') store.setActiveProject(projects[0]);
    else if (stepObj.action === 'experience') store.setActiveExperience(resumeData.experience[0]);
    else if (stepObj.action === 'resume') store.setShowResumeModal(true);
  };

  const roverDotX = Math.min(90, Math.max(10, ((roverPosition[0] + 75) / 150) * 78 + 11));
  const roverDotY = Math.min(90, Math.max(10, ((roverPosition[2] + 75) / 150) * 78 + 11));

  return (
    <div
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
      style={{
        position: 'fixed',
        left: 16,
        top: 68,
        zIndex: 130,
        width: showRoadmapGuide ? 302 : 'auto',
        pointerEvents: 'auto',
      }}
    >
      {/* Collapsed Pill Button when minimized */}
      {!showRoadmapGuide && (
        <motion.button
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => setShowRoadmapGuide(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '9px 14px',
            borderRadius: 12,
            background: 'rgba(26, 18, 46, 0.95)',
            border: '1.5px solid #fb923c',
            color: '#ffffff',
            fontWeight: 800,
            fontSize: '0.78rem',
            cursor: 'pointer',
            boxShadow: '0 10px 28px rgba(0,0,0,0.55)',
          }}
        >
          <span>🗺️ Open Side Roadmap &amp; Tour Guide</span>
        </motion.button>
      )}

      {/* Expanded Side Roadmap & Teaching Guide */}
      <AnimatePresence>
        {showRoadmapGuide && (
          <motion.div
            initial={{ opacity: 0, x: -18 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -18 }}
            style={{
              background: 'rgba(26, 18, 46, 0.94)',
              backdropFilter: 'blur(16px)',
              border: '1.5px solid rgba(232, 121, 249, 0.42)',
              borderRadius: 16,
              padding: '0.85rem',
              boxShadow: '0 18px 48px rgba(0, 0, 0, 0.65)',
              color: '#ffffff',
            }}
          >
            {/* Header Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <div>
                <div className="font-display-tall" style={{ fontSize: '1.45rem', color: '#ffffff', lineHeight: 1 }}>
                  🗺️ ROADMAP &amp; TOUR GUIDE
                </div>
                <div className="font-italic-accent" style={{ fontSize: '0.74rem', color: '#f5d0fe' }}>
                  Click any stop to auto-drive, teleport, or open
                </div>
              </div>
              <button
                onClick={() => setShowRoadmapGuide(false)}
                title="Minimize Roadmap"
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: 7,
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.16)',
                  color: '#cbd5e1',
                  fontSize: '0.72rem',
                  cursor: 'pointer',
                }}
              >
                —
              </button>
            </div>

            {/* ── Mini Illustrated Top-Down Island Map Preview ── */}
            <div
              onClick={() => setShowWorldMap(true)}
              title="Click to open Full Interactive World Map [M]"
              style={{
                position: 'relative',
                width: '100%',
                height: 118,
                borderRadius: 11,
                overflow: 'hidden',
                border: '1.5px solid rgba(45, 212, 191, 0.55)',
                marginBottom: 8,
                cursor: 'pointer',
                background: '#1e293b',
              }}
            >
              <svg viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%' }}>
                <rect width="1000" height="1000" fill="#1e293b" />
                <path
                  d="M 125,135 Q 480,65 825,115 Q 920,230 880,450 Q 930,670 890,835 Q 740,930 480,920 Q 155,930 90,805 Q 60,620 110,460 Q 65,260 125,135 Z"
                  fill="#e08e6d"
                  stroke="#5eead4"
                  strokeWidth="22"
                />
                <path
                  d="M 300,360 L 130,360 Q 95,360 95,210 Q 95,85 210,85 L 295,85 Q 305,85 305,210 L 305,520 Q 305,580 180,610 Q 95,640 95,760 Q 95,870 220,870 Q 340,860 400,720 L 435,620 L 435,440 L 600,260 Q 780,220 780,145 Q 780,85 600,85 L 440,85 Q 410,85 410,200 L 410,360 Z"
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="84"
                  strokeDasharray="34 34"
                />
                <path
                  d="M 300,360 L 130,360 Q 95,360 95,210 Q 95,85 210,85 L 295,85 Q 305,85 305,210 L 305,520 Q 305,580 180,610 Q 95,640 95,760 Q 95,870 220,870 Q 340,860 400,720 L 435,620 L 435,440 L 600,260 Q 780,220 780,145 Q 780,85 600,85 L 440,85 Q 410,85 410,200 L 410,360 Z"
                  fill="none"
                  stroke="#44403c"
                  strokeWidth="58"
                />
                <circle cx="570" cy="180" r="55" fill="#22d3ee" opacity="0.7" />
                <circle cx="235" cy="700" r="65" fill="#22d3ee" opacity="0.7" />
                <circle cx="740" cy="500" r="55" fill="#22d3ee" opacity="0.7" />
              </svg>

              {MAP_DIAMOND_POINTS.slice(0, 6).map((pt, idx) => (
                <div
                  key={pt.id}
                  style={{
                    position: 'absolute',
                    left: `${pt.mapX}%`,
                    top: `${pt.mapY}%`,
                    width: activeTourStep === idx ? 11 : 8,
                    height: activeTourStep === idx ? 11 : 8,
                    transform: 'translate(-50%, -50%) rotate(45deg)',
                    background: activeTourStep === idx ? '#fef08a' : '#ffffff',
                    border: '1.5px solid #1e1b4b',
                  }}
                />
              ))}

              <div
                style={{
                  position: 'absolute',
                  left: `${roverDotX}%`,
                  top: `${roverDotY}%`,
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  transform: 'translate(-50%, -50%)',
                  background: '#f97316',
                  border: '2px solid #ffffff',
                  boxShadow: '0 0 8px #f97316',
                }}
              />

              <div
                style={{
                  position: 'absolute',
                  bottom: 5,
                  right: 6,
                  padding: '2px 8px',
                  borderRadius: 6,
                  background: 'rgba(15, 23, 42, 0.9)',
                  fontSize: '0.62rem',
                  fontWeight: 800,
                  color: '#5eead4',
                }}
              >
                🔍 Click for Full Map [M]
              </div>
            </div>

            {/* ── Aerial & 360° Motherboard Camera View Toggle Bar ── */}
            <div style={{ marginBottom: 8 }}>
              <div style={{ fontSize: '0.62rem', fontWeight: 800, color: '#cbd5e1', letterSpacing: '0.06em', marginBottom: 4 }}>
                CAMERA VIEWS (OR TWO-FINGER TRACKPAD SCROLL)
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 4 }}>
                {[
                  { id: 'follow', label: '🚗 Drive' },
                  { id: 'aerial', label: '🦅 High View' },
                  { id: 'orbit360', label: '🔄 360° View' },
                ].map((m) => {
                  const active = cameraMode === m.id;
                  return (
                    <button
                      key={m.id}
                      onClick={() => setCameraMode(m.id)}
                      style={{
                        padding: '5px 4px',
                        borderRadius: 7,
                        fontSize: '0.68rem',
                        fontWeight: 800,
                        cursor: 'pointer',
                        background: active ? '#e879f9' : 'rgba(255,255,255,0.06)',
                        border: `1px solid ${active ? '#f5d0fe' : 'rgba(255,255,255,0.14)'}`,
                        color: active ? '#1e1035' : '#e2e8f0',
                      }}
                    >
                      {m.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ── Active Step Teaching Card ("Where to go & How to go") ── */}
            <div
              style={{
                padding: '0.65rem',
                borderRadius: 11,
                background: 'rgba(255,255,255,0.06)',
                border: `1.5px solid ${curStep.color}`,
                marginBottom: 8,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
                <span style={{ fontSize: '0.6rem', fontWeight: 900, color: curStep.color, letterSpacing: '0.06em' }}>
                  STEP {curStep.step}/6 • {curStep.badge}
                </span>
              </div>
              <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#ffffff', marginBottom: 4 }}>
                {curStep.title}
              </div>
              <div
                className="font-italic-accent"
                style={{ fontSize: '0.76rem', color: '#fde68a', lineHeight: 1.35, marginBottom: 5 }}
              >
                {curStep.italicGuide}
              </div>
              <div style={{ fontSize: '0.68rem', color: '#cbd5e1', marginBottom: 8 }}>
                <strong style={{ color: '#38bdf8' }}>How to go:</strong> {curStep.howToGo}
              </div>

              {/* 3 Reliable 1-Click Action Buttons */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 5 }}>
                <button
                  onClick={(e) => handleGuideStep(curStep, activeTourStep, e)}
                  title="Show glowing path & auto-drive car there"
                  style={{
                    padding: '6px 4px',
                    borderRadius: 7,
                    background: 'rgba(0,255,204,0.18)',
                    border: '1px solid #00ffcc',
                    color: '#00ffcc',
                    fontSize: '0.66rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                  }}
                >
                  🧭 Guide Path
                </button>
                <button
                  onClick={(e) => handleTeleportStep(curStep, activeTourStep, e)}
                  title="Teleport car directly to this 3D zone"
                  style={{
                    padding: '6px 4px',
                    borderRadius: 7,
                    background: curStep.color,
                    border: 'none',
                    color: '#09090b',
                    fontSize: '0.66rem',
                    fontWeight: 900,
                    cursor: 'pointer',
                  }}
                >
                  ⚡ Teleport
                </button>
                <button
                  onClick={(e) => handleOpenModalStep(curStep, activeTourStep, e)}
                  title="Teleport & open details popup"
                  style={{
                    padding: '6px 4px',
                    borderRadius: 7,
                    background: 'rgba(255,255,255,0.14)',
                    border: '1px solid rgba(255,255,255,0.3)',
                    color: '#ffffff',
                    fontSize: '0.66rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                  }}
                >
                  📖 Open Info
                </button>
              </div>
            </div>

            {/* ── Clickable 6-Stop Roadmap Step List ── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {TOUR_STEPS.map((st, idx) => {
                const isCur = idx === activeTourStep;
                return (
                  <div
                    key={st.step}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '4px 7px',
                      borderRadius: 7,
                      background: isCur ? `${st.color}26` : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${isCur ? st.color : 'rgba(255,255,255,0.07)'}`,
                      color: isCur ? '#ffffff' : '#cbd5e1',
                      fontSize: '0.69rem',
                      fontWeight: isCur ? 800 : 600,
                    }}
                  >
                    <span
                      onClick={(e) => handleGuideStep(st, idx, e)}
                      style={{ flex: 1, cursor: 'pointer' }}
                    >
                      <strong style={{ color: st.color }}>◆ {st.step}.</strong> {st.title}
                    </span>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button
                        onClick={(e) => handleGuideStep(st, idx, e)}
                        style={{
                          padding: '2px 6px',
                          borderRadius: 5,
                          background: 'rgba(0,255,204,0.16)',
                          border: '1px solid #00ffcc',
                          color: '#00ffcc',
                          fontSize: '0.58rem',
                          fontWeight: 800,
                          cursor: 'pointer',
                        }}
                      >
                        Guide
                      </button>
                      <button
                        onClick={(e) => handleTeleportStep(st, idx, e)}
                        style={{
                          padding: '2px 6px',
                          borderRadius: 5,
                          background: st.color,
                          border: 'none',
                          color: '#09090b',
                          fontSize: '0.58rem',
                          fontWeight: 900,
                          cursor: 'pointer',
                        }}
                      >
                        Jump
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
