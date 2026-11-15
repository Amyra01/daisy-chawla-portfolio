import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useGameStore from '../stores/gameStore';
import projects from '../data/projects.json';
import { resumeData } from '../data/resumeData';

export const MAP_DIAMOND_POINTS = [
  {
    id: 'cpu-spawn',
    num: 1,
    title: 'CPU Socket & 3D DAISY CHAWLA Letters',
    italicHint: 'Start here! See the giant 3D block letters, lemon stand & glowing CPU socket.',
    howToGo: 'Center of the board — follow the main highways in any direction.',
    pos: [0, 2.6, 15],
    mapX: 66,
    mapY: 57,
    color: '#00ff88',
    action: 'about',
  },
  {
    id: 'career-timeline',
    num: 2,
    title: 'Floor Career Timeline (2023–2027)',
    italicHint: 'Drive along the Cyan, Purple & Gold floor lanes with 3D milestone boards!',
    howToGo: 'Drive slightly North-East from Spawn past the 2023–2025 floor slabs.',
    pos: [15.0, 2.6, 7.5],
    mapX: 63,
    mapY: 48,
    color: '#38bdf8',
    action: 'experience',
  },
  {
    id: 'featured-billboard',
    num: 3,
    title: 'JusticeFlow AI Live Project Station',
    italicHint: 'Interactive 3D billboard with live slide carousel, chalkboard & bell desk!',
    howToGo: 'Right beside the Career Timeline lanes at [27.5, -2.5].',
    pos: [27.5, 2.6, 6.5],
    stationPos: [27.5, 0, -2.5],
    mapX: 75,
    mapY: 44,
    color: '#f43f5e',
    action: 'station',
  },
  {
    id: 'gpu-boulevard',
    num: 4,
    title: 'GPU Boulevard (5 Project Stations)',
    italicHint: 'Explore JusticeFlow AI, Code Slayer 2K25, Code for Bharat, Zomatothon & more.',
    howToGo: 'Take the North Purple Highway straight up to GPU Boulevard.',
    pos: [0, 2.6, -40],
    stationPos: [0, 0, -49],
    mapX: 61,
    mapY: 37,
    color: '#a855f7',
    action: 'project-0',
  },
  {
    id: 'ram-skills',
    num: 5,
    title: 'DDR5 RAM Alley & Physics Skill Crates',
    italicHint: 'Smash through 22 skill crates or inspect the 4 glowing DDR5 memory towers.',
    howToGo: 'Take the East Cyan Highway to RAM Alley.',
    pos: [36, 2.6, -4],
    mapX: 87,
    mapY: 37,
    color: '#06b6d4',
    action: 'skill',
  },
  {
    id: 'expansion-experience',
    num: 6,
    title: 'PCIe Expansion Bus (Internships & Roles)',
    italicHint: 'Google Student Ambassador, IIT Roorkee AI/ML, Digimantra Java & GSSoC’25.',
    howToGo: 'Take the West Gold Highway to the PCIe Expansion Cards.',
    pos: [-36, 2.6, -8],
    mapX: 35,
    mapY: 52,
    color: '#f59e0b',
    action: 'experience',
  },
  {
    id: 'psu-resume',
    num: 7,
    title: '1200W PSU Bay (Official Resume & Certificates)',
    italicHint: 'Download Daisy’s verified PDF resume and open all Google Drive certificates.',
    howToGo: 'Drive South-East to the glowing Red Power Supply Unit.',
    pos: [28, 2.6, 28],
    mapX: 84,
    mapY: 59,
    color: '#ef4444',
    action: 'resume',
  },
  {
    id: 'garage-paint',
    num: 8,
    title: 'Rover Paint Shop & Customization Garage',
    italicHint: 'Customize monster-truck paint, flames/rainbow trail & horn synth.',
    howToGo: 'Located just East of CPU Spawn at [11, 8].',
    pos: [11, 2.6, 8],
    mapX: 71,
    mapY: 68,
    color: '#ec4899',
    action: 'garage',
  },
  {
    id: 'bowling-alley',
    num: 9,
    title: 'Transistor Bowling Alley (10 Physics Pins)',
    italicHint: 'Boost with Shift into the 10 transistor pins for a Strike!',
    howToGo: 'Drive South-West from Spawn toward [-22, 16].',
    pos: [-22, 2.6, 16],
    mapX: 55,
    mapY: 67,
    color: '#fbbf24',
    action: 'guide-only',
  },
  {
    id: 'coolant-bridge',
    num: 10,
    title: 'Turquoise Coolant Lake & Ribbon Bridge',
    italicHint: 'Scenic liquid-cooling reservoir with glowing cyan shoreline & rubber duck.',
    howToGo: 'Drive South-West past the stepping tiles to cross the wooden ribbon bridge.',
    pos: [-16.5, 2.6, 19],
    mapX: 55,
    mapY: 59,
    color: '#2dd4bf',
    action: 'guide-only',
  },
  {
    id: 'race-circuit',
    num: 11,
    title: 'Outer Motherboard Race Circuit & Time Trial',
    italicHint: 'Red & white curbed racing loop with 5 glowing Boot Sequence checkpoints!',
    howToGo: 'Drive West or North-West onto the asphalt circuit track.',
    pos: [0, 2.6, -15],
    mapX: 21,
    mapY: 17,
    color: '#ef4444',
    action: 'timetrial',
  },
  {
    id: 'south-plaza',
    num: 12,
    title: 'South Bios & Social Beacons Plaza',
    italicHint: 'Direct 1-click beacons for GitHub (@Amyra01), LinkedIn, JusticeFlow & Email.',
    howToGo: 'Drive South from CPU Spawn to the BIOS & Social Plaza.',
    pos: [0, 2.6, 26],
    mapX: 52,
    mapY: 84,
    color: '#38bdf8',
    action: 'about',
  },
];

export default function WorldMapModal() {
  const showWorldMap = useGameStore((s) => s.showWorldMap);
  const setShowWorldMap = useGameStore((s) => s.setShowWorldMap);
  const roverPosition = useGameStore((s) => s.roverPosition);
  const roverAngle = useGameStore((s) => s.roverAngle);
  const setTeleportTo = useGameStore((s) => s.setTeleportTo);
  const setAutoDriveTarget = useGameStore((s) => s.setAutoDriveTarget);
  const focusProjectStation = useGameStore((s) => s.focusProjectStation);
  const [selectedPt, setSelectedPt] = useState(MAP_DIAMOND_POINTS[0]);

  if (!showWorldMap) return null;

  const roverMapX = Math.min(90, Math.max(10, ((roverPosition[0] + 75) / 150) * 78 + 11));
  const roverMapY = Math.min(90, Math.max(10, ((roverPosition[2] + 75) / 150) * 78 + 11));

  // 1. Teleport Car directly to 3D spot (without covering the 3D view with a 2D modal unless requested!)
  const handleTeleportOnly = (pt) => {
    setTeleportTo(pt.pos, pt.title);
    setShowWorldMap(false);
    if (pt.action === 'station' && pt.stationPos) {
      setTimeout(() => focusProjectStation(pt.stationPos, 0), 120);
    } else if (pt.action === 'timetrial') {
      useGameStore.getState().startTimeTrial();
    }
  };

  // 2. Teleport AND Open Modal Info
  const handleTeleportAndOpen = (pt) => {
    const store = useGameStore.getState();
    setTeleportTo(pt.pos, pt.title);
    setShowWorldMap(false);
    if (pt.action === 'about') store.setShowAboutModal(true);
    else if (pt.action === 'skill') store.setShowSkillModal(true);
    else if (pt.action === 'project-0' || pt.action === 'station') store.setActiveProject(projects[0]);
    else if (pt.action === 'experience') store.setActiveExperience(resumeData.experience[0]);
    else if (pt.action === 'resume') store.setShowResumeModal(true);
    else if (pt.action === 'garage') store.setShowGarageModal(true);
    else if (pt.action === 'timetrial') store.startTimeTrial();
  };

  // 3. Guide Path + Smooth Auto-Drive
  const handleGuidePath = (pt) => {
    setAutoDriveTarget(pt.pos, pt.title);
    setShowWorldMap(false);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setShowWorldMap(false)}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 240,
          background: 'rgba(14, 10, 28, 0.86)',
          backdropFilter: 'blur(12px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.5rem',
        }}
      >
        <motion.div
          initial={{ scale: 0.94, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.94, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(440px, 640px) 350px',
            maxWidth: 1030,
            width: '100%',
            height: 'min(86vh, 680px)',
            background: '#1a132e',
            borderRadius: 18,
            border: '2px solid rgba(232,121,249,0.28)',
            overflow: 'hidden',
            boxShadow: '0 28px 80px rgba(0,0,0,0.75)',
          }}
        >
          {/* ── LEFT: Illustrated Top-Down Island & Circuit World Map ── */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: '100%',
              background: 'radial-gradient(circle at 50% 50%, #1e293b 0%, #0f172a 100%)',
              overflow: 'hidden',
              userSelect: 'none',
            }}
          >
            <svg
              viewBox="0 0 1000 1000"
              style={{ width: '100%', height: '100%', display: 'block' }}
            >
              <defs>
                <filter id="cyanGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="14" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
                <pattern id="curbRedWhite" width="36" height="36" patternUnits="userSpaceOnUse" patternTransform="rotate(25)">
                  <rect width="18" height="36" fill="#ef4444" />
                  <rect x="18" width="18" height="36" fill="#ffffff" />
                </pattern>
                <pattern id="checkeredGrid" width="16" height="16" patternUnits="userSpaceOnUse">
                  <rect width="8" height="8" fill="#ffffff" />
                  <rect x="8" width="8" height="8" fill="#18181b" />
                  <rect y="8" width="8" height="8" fill="#18181b" />
                  <rect x="8" y="8" width="8" height="8" fill="#ffffff" />
                </pattern>
              </defs>

              <rect width="1000" height="1000" fill="#1e293b" />

              <path
                d="M 110,120 Q 480,45 840,100 Q 940,220 900,450 Q 950,680 910,850 Q 750,950 480,940 Q 140,950 75,820 Q 40,620 95,460 Q 45,260 110,120 Z"
                fill="#2dd4bf"
                opacity="0.65"
                filter="url(#cyanGlow)"
              />

              <path
                d="M 125,135 Q 480,65 825,115 Q 920,230 880,450 Q 930,670 890,835 Q 740,930 480,920 Q 155,930 90,805 Q 60,620 110,460 Q 65,260 125,135 Z"
                fill="#e08e6d"
                stroke="#99f6e4"
                strokeWidth="12"
              />

              {[
                'M 490,145 Q 580,130 650,175 Q 640,235 540,225 Q 470,205 490,145 Z',
                'M 145,125 Q 250,115 260,210 Q 220,260 165,215 Z',
                'M 175,620 Q 285,600 300,720 Q 225,795 160,725 Z',
                'M 685,435 Q 795,435 795,555 Q 725,605 685,495 Z',
                'M 615,630 Q 695,625 685,725 Q 610,735 615,630 Z',
                'M 785,695 Q 855,695 850,820 Q 775,830 785,695 Z',
              ].map((d, i) => (
                <path
                  key={i}
                  d={d}
                  fill="#22d3ee"
                  fillOpacity="0.68"
                  stroke="#a5f3fc"
                  strokeWidth="8"
                />
              ))}

              {[
                'M 135,180 Q 195,175 215,280 Q 170,335 125,295 Z',
                'M 330,130 Q 395,140 385,295 Q 335,310 330,130 Z',
                'M 465,305 Q 665,260 725,365 Q 685,430 570,375 Q 520,515 475,470 Z',
                'M 185,650 Q 255,645 270,735 Q 210,775 185,650 Z',
                'M 575,815 Q 675,785 695,885 Q 600,910 575,815 Z',
                'M 305,830 Q 395,825 405,895 Q 315,905 305,830 Z',
              ].map((d, i) => (
                <path key={i} d={d} fill="#65a30d" opacity="0.88" />
              ))}

              <path
                d="M 300,360 L 130,360 Q 95,360 95,210 Q 95,85 210,85 L 295,85 Q 305,85 305,210 L 305,520 Q 305,580 180,610 Q 95,640 95,760 Q 95,870 220,870 Q 340,860 400,720 L 435,620 L 435,440 L 600,260 Q 780,220 780,145 Q 780,85 600,85 L 440,85 Q 410,85 410,200 L 410,360 Z"
                fill="none"
                stroke="url(#curbRedWhite)"
                strokeWidth="76"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
              <path
                d="M 300,360 L 130,360 Q 95,360 95,210 Q 95,85 210,85 L 295,85 Q 305,85 305,210 L 305,520 Q 305,580 180,610 Q 95,640 95,760 Q 95,870 220,870 Q 340,860 400,720 L 435,620 L 435,440 L 600,260 Q 780,220 780,145 Q 780,85 600,85 L 440,85 Q 410,85 410,200 L 410,360 Z"
                fill="none"
                stroke="#44403c"
                strokeWidth="56"
                strokeLinejoin="round"
                strokeLinecap="round"
              />

              <rect x="408" y="485" width="56" height="16" fill="url(#checkeredGrid)" />

              <line x1="610" y1="435" x2="610" y2="535" stroke="#c084fc" strokeWidth="6" />
              <line x1="635" y1="435" x2="635" y2="545" stroke="#38bdf8" strokeWidth="6" />
              <line x1="660" y1="435" x2="660" y2="535" stroke="#fbbf24" strokeWidth="6" />

              <rect x="595" y="685" width="55" height="22" rx="4" fill="#ea580c" stroke="#9a3412" strokeWidth="3" transform="rotate(14 620 695)" />

              {[
                [575, 455, '#f472b6'], [695, 415, '#fb923c'], [745, 585, '#f472b6'],
                [565, 725, '#f472b6'], [385, 675, '#f472b6'], [485, 255, '#f472b6'],
                [355, 250, '#f472b6'], [855, 330, '#f472b6'], [905, 565, '#f472b6'],
                [245, 435, '#84cc16'], [165, 265, '#84cc16'], [635, 355, '#84cc16'],
              ].map(([cx, cy, col], i) => (
                <circle key={i} cx={cx} cy={cy} r="14" fill={col} opacity="0.92" />
              ))}
            </svg>

            {/* ── 12 Clickable White Diamond (◆) Markers ── */}
            {MAP_DIAMOND_POINTS.map((pt) => {
              const isSel = selectedPt?.id === pt.id;
              return (
                <button
                  key={pt.id}
                  onClick={() => setSelectedPt(pt)}
                  title={`${pt.num}. ${pt.title}`}
                  style={{
                    position: 'absolute',
                    left: `${pt.mapX}%`,
                    top: `${pt.mapY}%`,
                    width: isSel ? 28 : 22,
                    height: isSel ? 28 : 22,
                    transform: 'translate(-50%, -50%) rotate(45deg)',
                    background: isSel ? '#fef08a' : '#ffffff',
                    border: `3.5px solid ${isSel ? pt.color : '#1e1b4b'}`,
                    boxShadow: isSel
                      ? `0 0 18px ${pt.color}, 0 4px 10px rgba(0,0,0,0.6)`
                      : '0 4px 10px rgba(0,0,0,0.55)',
                    cursor: 'pointer',
                    transition: 'all 0.18s ease',
                    zIndex: isSel ? 20 : 10,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <span
                    style={{
                      transform: 'rotate(-45deg)',
                      fontSize: '0.62rem',
                      fontWeight: 900,
                      color: '#0f172a',
                    }}
                  >
                    {pt.num}
                  </span>
                </button>
              );
            })}

            {/* ── Direct Floating Action Bar at Bottom of Left Map so Clicking on Left Map Works Immediately! ── */}
            {selectedPt && (
              <div
                style={{
                  position: 'absolute',
                  left: 14,
                  right: 14,
                  bottom: 14,
                  zIndex: 30,
                  padding: '10px 14px',
                  borderRadius: 12,
                  background: 'rgba(22, 16, 40, 0.95)',
                  border: `1.5px solid ${selectedPt.color}`,
                  boxShadow: '0 10px 30px rgba(0,0,0,0.75)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 10,
                }}
              >
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#ffffff' }}>
                    ◆ {selectedPt.num}. {selectedPt.title}
                  </div>
                  <div className="font-italic-accent" style={{ fontSize: '0.72rem', color: '#fde68a' }}>
                    {selectedPt.howToGo}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                  <button
                    onClick={() => handleGuidePath(selectedPt)}
                    style={{
                      padding: '7px 11px',
                      borderRadius: 8,
                      background: 'rgba(0, 255, 204, 0.18)',
                      border: '1px solid #00ffcc',
                      color: '#00ffcc',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                    }}
                  >
                    🧭 Guide Path
                  </button>
                  <button
                    onClick={() => handleTeleportOnly(selectedPt)}
                    style={{
                      padding: '7px 11px',
                      borderRadius: 8,
                      background: selectedPt.color,
                      border: 'none',
                      color: '#09090b',
                      fontSize: '0.72rem',
                      fontWeight: 900,
                      cursor: 'pointer',
                    }}
                  >
                    ⚡ Teleport Car
                  </button>
                  <button
                    onClick={() => handleTeleportAndOpen(selectedPt)}
                    style={{
                      padding: '7px 11px',
                      borderRadius: 8,
                      background: 'rgba(255,255,255,0.14)',
                      border: '1px solid rgba(255,255,255,0.3)',
                      color: '#ffffff',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                    }}
                  >
                    📖 Open
                  </button>
                </div>
              </div>
            )}

            {/* Highlighted Red/Orange Monster-Truck Rover Icon on Map */}
            <div
              title="Your Monster-Truck Rover Location"
              style={{
                position: 'absolute',
                left: `${roverMapX}%`,
                top: `${roverMapY}%`,
                transform: `translate(-50%, -50%) rotate(${(-roverAngle * 180) / Math.PI}deg)`,
                width: 44,
                height: 62,
                borderRadius: 12,
                background: 'linear-gradient(180deg, #f97316 0%, #e11d48 100%)',
                border: '3px solid #ffffff',
                boxShadow: '0 8px 22px rgba(0,0,0,0.75), 0 0 16px rgba(249,115,22,0.8)',
                zIndex: 15,
                pointerEvents: 'none',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 5,
              }}
            >
              <div style={{ width: 26, height: 10, borderRadius: 3, background: '#18181b' }} />
              <div style={{ fontSize: '0.6rem', fontWeight: 900, color: '#fff' }}>YOU</div>
              <div style={{ width: 28, height: 8, borderRadius: 2, background: '#fef08a' }} />
            </div>

            <div
              style={{
                position: 'absolute',
                top: 14,
                left: 16,
                padding: '6px 14px',
                borderRadius: 999,
                background: 'rgba(15, 23, 42, 0.88)',
                border: '1px solid rgba(255,255,255,0.18)',
                color: '#ffffff',
                fontSize: '0.78rem',
                fontWeight: 800,
              }}
            >
              🗺️ MOTHERBOARD ISLAND MAP • CLICK ANY ◆ DIAMOND
            </div>
          </div>

          {/* ── RIGHT: Interactive Teaching Guide & Selected Diamond Inspector ── */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '1.4rem',
              background: '#1a132e',
              borderLeft: '1px solid rgba(255,255,255,0.1)',
              overflowY: 'auto',
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <h2 className="font-display-tall" style={{ fontSize: '2.1rem', color: '#ffffff', lineHeight: 1 }}>
                  WORLD ROADMAP &amp; GUIDE
                </h2>
                <button
                  onClick={() => setShowWorldMap(false)}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 8,
                    background: '#991b1b',
                    border: '1px solid #f87171',
                    color: '#ffffff',
                    fontSize: '1.05rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                  }}
                >
                  ✕
                </button>
              </div>

              <p className="font-italic-accent" style={{ color: '#f5d0fe', fontSize: '0.88rem', marginBottom: 14 }}>
                “Click any numbered diamond marker on the map or below to auto-drive, teleport, or open details.”
              </p>

              {selectedPt && (
                <div
                  style={{
                    padding: '0.9rem',
                    borderRadius: 14,
                    background: 'rgba(255,255,255,0.05)',
                    border: `1.5px solid ${selectedPt.color}`,
                    marginBottom: 14,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <span
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: 6,
                        background: selectedPt.color,
                        color: '#09090b',
                        fontWeight: 900,
                        fontSize: '0.78rem',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      ◆ {selectedPt.num}
                    </span>
                    <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#ffffff' }}>
                      {selectedPt.title}
                    </div>
                  </div>

                  <div className="font-italic-accent" style={{ fontSize: '0.82rem', color: '#fde68a', marginBottom: 8 }}>
                    {selectedPt.italicHint}
                  </div>

                  <div style={{ fontSize: '0.74rem', color: '#cbd5e1', marginBottom: 10 }}>
                    <strong style={{ color: '#38bdf8' }}>How to go:</strong> {selectedPt.howToGo}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6 }}>
                    <button
                      onClick={() => handleGuidePath(selectedPt)}
                      style={{
                        padding: '8px 6px',
                        borderRadius: 8,
                        background: 'rgba(0, 255, 204, 0.16)',
                        border: '1px solid #00ffcc',
                        color: '#00ffcc',
                        fontSize: '0.7rem',
                        fontWeight: 800,
                        cursor: 'pointer',
                      }}
                    >
                      🧭 Guide Path
                    </button>
                    <button
                      onClick={() => handleTeleportOnly(selectedPt)}
                      style={{
                        padding: '8px 6px',
                        borderRadius: 8,
                        background: selectedPt.color,
                        border: 'none',
                        color: '#09090b',
                        fontSize: '0.7rem',
                        fontWeight: 900,
                        cursor: 'pointer',
                      }}
                    >
                      ⚡ Teleport
                    </button>
                    <button
                      onClick={() => handleTeleportAndOpen(selectedPt)}
                      style={{
                        padding: '8px 6px',
                        borderRadius: 8,
                        background: 'rgba(255,255,255,0.14)',
                        border: '1px solid rgba(255,255,255,0.3)',
                        color: '#ffffff',
                        fontSize: '0.7rem',
                        fontWeight: 800,
                        cursor: 'pointer',
                      }}
                    >
                      📖 Open Info
                    </button>
                  </div>
                </div>
              )}

              <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#94a3b8', letterSpacing: '0.08em', marginBottom: 6 }}>
                ALL 12 MOTHERBOARD STOPS
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, maxHeight: 235, overflowY: 'auto', paddingRight: 4 }}>
                {MAP_DIAMOND_POINTS.map((pt) => {
                  const active = selectedPt?.id === pt.id;
                  return (
                    <div
                      key={pt.id}
                      onClick={() => setSelectedPt(pt)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '6px 8px',
                        borderRadius: 8,
                        background: active ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.03)',
                        border: `1px solid ${active ? pt.color : 'rgba(255,255,255,0.07)'}`,
                        color: '#ffffff',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      <span>
                        <strong style={{ color: pt.color }}>◆ {pt.num}.</strong> {pt.title}
                      </span>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleGuidePath(pt);
                          }}
                          style={{
                            padding: '2px 6px',
                            borderRadius: 5,
                            background: 'rgba(0,255,204,0.16)',
                            border: '1px solid #00ffcc',
                            color: '#00ffcc',
                            fontSize: '0.6rem',
                            fontWeight: 800,
                            cursor: 'pointer',
                          }}
                        >
                          Guide
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTeleportOnly(pt);
                          }}
                          style={{
                            padding: '2px 6px',
                            borderRadius: 5,
                            background: pt.color,
                            border: 'none',
                            color: '#09090b',
                            fontSize: '0.6rem',
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
            </div>

            <div style={{ fontSize: '0.72rem', color: '#94a3b8', textAlign: 'center', marginTop: 10 }}>
              Press <span className="keycap">M</span> or <span className="keycap">ESC</span> anytime to toggle map
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
