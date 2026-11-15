import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useGameStore from '../stores/gameStore';
import { resumeData } from '../data/resumeData';
import { SPAWN_POSITION } from '../data/zones';

const MENU_TABS = [
  { id: 'home', icon: '🏠', label: "Daisy's Home" },
  { id: 'settings', icon: '⚙️', label: 'Settings & Camera' },
  { id: 'controls', icon: '🎮', label: 'Controls & Trackpad' },
  { id: 'achievements', icon: '🏅', label: 'Achievements' },
  { id: 'circuit', icon: '🛞', label: 'Circuit Leaderboard' },
  { id: 'whispers', icon: '💬', label: 'Whispers' },
  { id: 'credits', icon: '❓', label: 'Tech & Credits' },
];

// Left-Side Visual Diorama Preview
function DioramaPreview({ tab }) {
  if (tab === 'controls') {
    return (
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(155deg, #f3c6b6 0%, #d8a7b1 55%, #b592ac 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        <svg viewBox="0 0 500 500" style={{ width: '92%', height: '92%' }}>
          <ellipse cx="250" cy="310" rx="185" ry="95" fill="rgba(90, 60, 85, 0.18)" />
          <g transform="translate(55, 145) rotate(-14)">
            <rect x="0" y="0" width="230" height="92" rx="12" fill="#e2d5df" stroke="#cbb8c7" strokeWidth="4" />
            <rect x="38" y="18" width="20" height="18" rx="4" fill="#fef08a" stroke="#f59e0b" strokeWidth="2" />
            <rect x="16" y="40" width="20" height="18" rx="4" fill="#fef08a" stroke="#f59e0b" strokeWidth="2" />
            <rect x="38" y="40" width="20" height="18" rx="4" fill="#fef08a" stroke="#f59e0b" strokeWidth="2" />
            <rect x="60" y="40" width="20" height="18" rx="4" fill="#fef08a" stroke="#f59e0b" strokeWidth="2" />
            <rect x="90" y="18" width="20" height="18" rx="4" fill="#d1c2ce" />
            <rect x="115" y="18" width="20" height="18" rx="4" fill="#d1c2ce" />
            <rect x="140" y="18" width="20" height="18" rx="4" fill="#d1c2ce" />
            <rect x="65" y="64" width="95" height="16" rx="4" fill="#d1c2ce" />
          </g>
          <g transform="translate(155, 195)">
            <line x1="0" y1="0" x2="0" y2="-75" stroke="#a3e635" strokeWidth="8" />
            <polygon points="0,-95 -14,-68 14,-68" fill="#a3e635" />
            <line x1="0" y1="0" x2="-55" y2="32" stroke="#60a5fa" strokeWidth="8" />
            <polygon points="-72,42 -42,38 -54,18" fill="#60a5fa" />
            <line x1="0" y1="0" x2="62" y2="28" stroke="#f87171" strokeWidth="8" />
            <polygon points="80,36 52,36 62,16" fill="#f87171" />
          </g>
          <g transform="translate(275, 195)">
            <rect x="0" y="55" width="110" height="90" rx="14" fill="#d8cbd6" stroke="#c0aebd" strokeWidth="4" />
            <ellipse cx="55" cy="95" rx="34" ry="20" fill="#b39eb0" />
            <line x1="55" y1="90" x2="55" y2="38" stroke="#9e879b" strokeWidth="10" />
            <circle cx="55" cy="26" r="28" fill="#fef08a" />
          </g>
          <g transform="translate(95, 265) rotate(12)">
            <rect x="0" y="0" width="195" height="110" rx="46" fill="#d8cbd6" stroke="#c0aebd" strokeWidth="4" />
            <circle cx="52" cy="48" r="16" fill="#fef08a" />
            <circle cx="110" cy="68" r="14" fill="#fef08a" />
            <circle cx="145" cy="36" r="7" fill="#fef08a" />
            <circle cx="162" cy="48" r="7" fill="#fef08a" />
            <circle cx="145" cy="60" r="7" fill="#fef08a" />
            <circle cx="128" cy="48" r="7" fill="#fef08a" />
          </g>
        </svg>
      </div>
    );
  }

  if (tab === 'credits' || tab === 'circuit') {
    return (
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(160deg, #b85d38 0%, #9a4428 60%, #581c45 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        <svg viewBox="0 0 500 500" style={{ width: '95%', height: '95%' }}>
          <g transform="translate(250, 275) scale(1, 0.58) rotate(45)">
            <rect
              x="-135"
              y="-135"
              width="270"
              height="270"
              fill="#0b1026"
              stroke="#60a5fa"
              strokeWidth="8"
            />
            {[-90, -45, 0, 45, 90].map((pos, i) => (
              <g key={i}>
                <line x1={pos} y1="-135" x2={pos} y2="135" stroke="#818cf8" strokeWidth="3" />
                <line x1="-135" y1={pos} x2="135" y2={pos} stroke="#818cf8" strokeWidth="3" />
              </g>
            ))}
            <rect x="-125" y="-35" width="28" height="28" fill="none" stroke="#c084fc" strokeWidth="5" />
            <rect x="-35" y="-125" width="28" height="28" fill="none" stroke="#c084fc" strokeWidth="5" />
            <rect x="95" y="5" width="28" height="28" fill="none" stroke="#c084fc" strokeWidth="5" />
            <rect x="5" y="95" width="28" height="28" fill="none" stroke="#c084fc" strokeWidth="5" />
          </g>
          {[
            [75, 165],
            [365, 165],
          ].map(([gx, gy], idx) => (
            <g key={idx} transform={`translate(${gx}, ${gy})`}>
              <rect x="0" y="35" width="58" height="44" rx="6" fill="#d97706" stroke="#451a03" strokeWidth="3" />
              <line x1="29" y1="35" x2="29" y2="-15" stroke="#1e1b4b" strokeWidth="6" />
              <rect x="-5" y="-32" width="68" height="20" rx="3" fill="#1e1b4b" />
              <rect x="2" y="-28" width="14" height="12" fill="#fef08a" />
              <rect x="22" y="-28" width="14" height="12" fill="#fef08a" />
              <rect x="42" y="-28" width="14" height="12" fill="#fef08a" />
            </g>
          ))}
          {[
            [185, 155],
            [295, 162],
            [115, 315],
          ].map(([cx, cy], i) => (
            <g key={i} transform={`translate(${cx}, ${cy})`}>
              <polygon points="0,-28 -14,12 14,12" fill="#ea580c" />
              <polygon points="-8,-10 8,-10 10,-2 -10,-2" fill="#ffffff" />
            </g>
          ))}
        </svg>
      </div>
    );
  }

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        background: 'radial-gradient(circle at 50% 58%, #3b1d4a 0%, #1c1226 75%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      <svg viewBox="0 0 500 500" style={{ width: '96%', height: '96%' }}>
        {Array.from({ length: 7 }).map((_, r) =>
          Array.from({ length: 7 }).map((__, c) => (
            <text
              key={`${r}-${c}`}
              x={45 + c * 68}
              y={65 + r * 64}
              fill="rgba(168, 85, 247, 0.35)"
              fontSize="12"
            >
              +
            </text>
          ))
        )}

        <ellipse
          cx="255"
          cy="335"
          rx="165"
          ry="92"
          fill="#d97757"
          stroke="#f9a8d4"
          strokeWidth="5"
        />

        <rect x="148" y="195" width="18" height="115" fill="#5c2d38" />
        <circle cx="135" cy="185" r="54" fill="#ec4899" />
        <circle cx="185" cy="145" r="64" fill="#f472b6" />
        <circle cx="245" cy="165" r="48" fill="#ec4899" />
        <circle cx="295" cy="195" r="44" fill="#f472b6" />
        <circle cx="115" cy="235" r="42" fill="#f472b6" />

        <g transform="translate(225, 225) rotate(8)">
          <rect x="0" y="0" width="95" height="14" rx="3" fill="#e07a5f" />
          <rect x="0" y="18" width="95" height="14" rx="3" fill="#e07a5f" />
          <rect x="-4" y="36" width="102" height="16" rx="4" fill="#c8684b" />
          <rect x="6" y="-4" width="10" height="58" rx="3" fill="#4c1d95" />
          <rect x="80" y="-4" width="10" height="58" rx="3" fill="#4c1d95" />
        </g>

        <g transform="translate(125, 248)">
          <rect x="8" y="38" width="12" height="65" fill="#e07a5f" />
          <rect x="2" y="92" width="24" height="22" rx="3" fill="#4c1d95" />
          <polygon points="-4,10 32,10 24,42 4,42" fill="#5b21b6" />
          <polygon points="-8,10 36,10 14,-6" fill="#4c1d95" />
        </g>

        <g transform="translate(185, 265) rotate(-10)">
          <ellipse cx="14" cy="58" rx="22" ry="22" fill="#18181b" stroke="#3f3f46" strokeWidth="4" />
          <ellipse cx="64" cy="78" rx="24" ry="24" fill="#18181b" stroke="#3f3f46" strokeWidth="4" />
          <ellipse cx="116" cy="58" rx="22" ry="22" fill="#18181b" stroke="#3f3f46" strokeWidth="4" />
          <rect x="12" y="22" width="105" height="42" rx="10" fill="#e11d48" stroke="#18181b" strokeWidth="4" />
          <rect x="26" y="-2" width="72" height="32" rx="8" fill="#be123c" stroke="#18181b" strokeWidth="4" />
          <rect x="38" y="-6" width="48" height="8" rx="3" fill="#18181b" />
          <circle cx="46" cy="-2" r="2.5" fill="#fef08a" />
          <circle cx="56" cy="-2" r="2.5" fill="#fef08a" />
          <circle cx="66" cy="-2" r="2.5" fill="#fef08a" />
          <circle cx="76" cy="-2" r="2.5" fill="#fef08a" />
          <rect x="52" y="44" width="54" height="12" rx="4" fill="#fef08a" stroke="#f59e0b" strokeWidth="3" />
        </g>
      </svg>
    </div>
  );
}

export default function BrunoMenuModal() {
  const showMainMenu = useGameStore((s) => s.showMainMenu);
  const setShowMainMenu = useGameStore((s) => s.setShowMainMenu);
  const activeMenuTab = useGameStore((s) => s.activeMenuTab);
  const setActiveMenuTab = useGameStore((s) => s.setActiveMenuTab);

  const lightingMode = useGameStore((s) => s.lightingMode);
  const setLightingMode = useGameStore((s) => s.setLightingMode);
  const cameraMode = useGameStore((s) => s.cameraMode);
  const setCameraMode = useGameStore((s) => s.setCameraMode);
  const quality = useGameStore((s) => s.quality);
  const setQuality = useGameStore((s) => s.setQuality);
  const isMuted = useGameStore((s) => s.isMuted);
  const toggleMute = useGameStore((s) => s.toggleMute);
  const setIs2DMode = useGameStore((s) => s.setIs2DMode);

  const roverSpeedMultiplier = useGameStore((s) => s.roverSpeedMultiplier);
  const setRoverSpeedMultiplier = useGameStore((s) => s.setRoverSpeedMultiplier);
  const trackpadDriveEnabled = useGameStore((s) => s.trackpadDriveEnabled);
  const setTrackpadDriveEnabled = useGameStore((s) => s.setTrackpadDriveEnabled);
  const forceTouchControls = useGameStore((s) => s.forceTouchControls);
  const setForceTouchControls = useGameStore((s) => s.setForceTouchControls);
  const resetSkillCrates = useGameStore((s) => s.resetSkillCrates);
  const resetBowlingPins = useGameStore((s) => s.resetBowlingPins);
  const setTeleportTo = useGameStore((s) => s.setTeleportTo);

  const exploredZones = useGameStore((s) => s.exploredZones);
  const collectedBits = useGameStore((s) => s.collectedBits);
  const totalBits = useGameStore((s) => s.totalBits);
  const collectedGoldCaps = useGameStore((s) => s.collectedGoldCaps);
  const knockedPinsCount = useGameStore((s) => s.knockedPinsCount);
  const timeTrial = useGameStore((s) => s.timeTrial);
  const startTimeTrial = useGameStore((s) => s.startTimeTrial);
  const whispers = useGameStore((s) => s.whispers);
  const addWhisper = useGameStore((s) => s.addWhisper);

  const [controlSubTab, setControlSubTab] = useState('keyboard'); // 'keyboard' | 'mobile' | 'gamepad'
  const [whisperTag, setWhisperTag] = useState('DEV');
  const [whisperText, setWhisperText] = useState('');

  if (!showMainMenu) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setShowMainMenu(false)}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 250,
          background: 'rgba(12, 8, 24, 0.76)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.5rem',
        }}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            width: '100%',
            maxWidth: 960,
          }}
        >
          {/* ── Top Icon Tab Bar + Red Close [✕] Button ── */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
              gap: 6,
              marginBottom: 6,
            }}
          >
            {MENU_TABS.map((t) => {
              const active = activeMenuTab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveMenuTab(t.id)}
                  title={t.label}
                  style={{
                    width: 48,
                    height: 44,
                    borderRadius: 6,
                    background: active ? '#3b215c' : 'rgba(23, 19, 36, 0.92)',
                    border: `1.5px solid ${active ? '#e879f9' : 'rgba(255,255,255,0.18)'}`,
                    color: active ? '#ffffff' : '#94a3b8',
                    fontSize: '1.2rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {t.icon}
                </button>
              );
            })}

            <button
              onClick={() => setShowMainMenu(false)}
              title="Close Menu [Esc]"
              style={{
                width: 48,
                height: 44,
                borderRadius: 6,
                background: 'linear-gradient(180deg, #b91c1c 0%, #7f1d1d 100%)',
                border: '1.5px solid #f87171',
                color: '#ffffff',
                fontSize: '1.25rem',
                fontWeight: 800,
                cursor: 'pointer',
                marginLeft: 10,
              }}
            >
              ✕
            </button>
          </div>

          {/* ── Main Split-Screen Card ── */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1.12fr',
              height: 'min(78vh, 580px)',
              background: '#171324',
              borderRadius: 10,
              border: '1.5px solid rgba(255, 255, 255, 0.15)',
              overflow: 'hidden',
              boxShadow: '0 28px 80px rgba(0, 0, 0, 0.8)',
            }}
          >
            {/* LEFT HALF: Visual Diorama Preview */}
            <DioramaPreview tab={activeMenuTab} />

            {/* RIGHT HALF: Dark Tidy Text Content Panel */}
            <div
              style={{
                padding: '2rem 2.2rem',
                background: '#171324',
                color: '#e2e8f0',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              {/* TAB 1: HOME */}
              {activeMenuTab === 'home' && (
                <div>
                  <h1
                    className="font-display-tall"
                    style={{ fontSize: '2.9rem', color: '#ffffff', marginBottom: 16, lineHeight: 1 }}
                  >
                    DAISY&apos;S HOME
                  </h1>

                  <p style={{ fontSize: '1.02rem', lineHeight: 1.65, marginBottom: 14, color: '#f1f5f9' }}>
                    Welcome!
                  </p>

                  <p style={{ fontSize: '1.02rem', lineHeight: 1.65, marginBottom: 14, color: '#cbd5e1' }}>
                    My name is <strong style={{ color: '#ffffff' }}>Daisy Chawla</strong>, and I&apos;m an{' '}
                    <strong style={{ color: '#ffffff' }}>AI &amp; Full-Stack Developer</strong> (B.Tech CSE @ PCTE,{' '}
                    <span className="font-italic-accent" style={{ color: '#fde68a' }}>
                      CGPA 8.39 / 10
                    </span>
                    , Google Student Ambassador &amp; National Hackathon Finalist).
                  </p>

                  <p style={{ fontSize: '1.02rem', lineHeight: 1.65, marginBottom: 14, color: '#cbd5e1' }}>
                    This is my interactive 3D motherboard portfolio. Drive around with{' '}
                    <strong style={{ color: '#ffffff' }}>WASD / Arrows</strong> or{' '}
                    <strong style={{ color: '#f5d0fe' }}>two-finger trackpad scroll</strong>, check out the{' '}
                    <a
                      href={resumeData.socialLinks.justiceFlowLive}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bruno-link"
                    >
                      JusticeFlow AI
                    </a>{' '}
                    live 3D station, and drive near props (like the lemon crate &amp; rubber duck!) to see their fun messages!
                  </p>

                  <p className="font-italic-accent" style={{ fontSize: '1.05rem', color: '#fdba74', marginBottom: 20 }}>
                    And go ahead — smash all the skill crates!
                  </p>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                    <a href={resumeData.socialLinks.github} target="_blank" rel="noopener noreferrer" className="bruno-link">
                      GitHub (@Amyra01)
                    </a>
                    <span>•</span>
                    <a href={resumeData.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="bruno-link">
                      LinkedIn
                    </a>
                    <span>•</span>
                    <a href={resumeData.socialLinks.justiceFlowLive} target="_blank" rel="noopener noreferrer" className="bruno-link">
                      JusticeFlow Live
                    </a>
                    <span>•</span>
                    <a href="/Daisy_Chawla_Resume.pdf" download className="bruno-link">
                      Resume PDF
                    </a>
                  </div>
                </div>
              )}

              {/* TAB 2: SETTINGS & CAMERA VIEWS (All buttons working with live feedback!) */}
              {activeMenuTab === 'settings' && (
                <div>
                  <h1 className="font-display-tall" style={{ fontSize: '2.5rem', color: '#ffffff', marginBottom: 10, lineHeight: 1 }}>
                    SETTINGS &amp; CAMERA VIEWS
                  </h1>

                  <p className="font-italic-accent" style={{ color: '#f5d0fe', fontSize: '0.88rem', marginBottom: 14 }}>
                    Every setting below updates the 3D motherboard immediately!
                  </p>

                  {/* 1. Camera Mode Selector */}
                  <div style={{ marginBottom: 14 }}>
                    <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#94a3b8', marginBottom: 6 }}>
                      1. CAMERA PERSPECTIVE (PRESS <span className="keycap">V</span> ANYTIME)
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6 }}>
                      {[
                        { id: 'follow', label: '🚗 Follow Rover' },
                        { id: 'aerial', label: '🦅 Full Aerial View' },
                        { id: 'orbit360', label: '🔄 360° Board Orbit' },
                      ].map((m) => (
                        <button
                          key={m.id}
                          onClick={() => {
                            setCameraMode(m.id);
                            if (m.id !== 'follow') setShowMainMenu(false);
                          }}
                          style={{
                            padding: '9px 6px',
                            borderRadius: 8,
                            background: cameraMode === m.id ? '#fb923c' : 'rgba(255,255,255,0.06)',
                            border: `1.5px solid ${cameraMode === m.id ? '#fef08a' : 'rgba(255,255,255,0.16)'}`,
                            color: cameraMode === m.id ? '#09090b' : '#ffffff',
                            fontWeight: 800,
                            fontSize: '0.75rem',
                            cursor: 'pointer',
                          }}
                        >
                          {m.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 2. Soothing Color Palette Selector */}
                  <div style={{ marginBottom: 14 }}>
                    <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#94a3b8', marginBottom: 6 }}>
                      2. SOOTHING COLOR THEME
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6 }}>
                      {[
                        { id: 'golden', label: '🌅 Sunset Coral-Violet' },
                        { id: 'pastel', label: '🌸 Pastel Lavender' },
                        { id: 'cyberpunk', label: '⚡ Neon Cyber' },
                      ].map((m) => (
                        <button
                          key={m.id}
                          onClick={() => setLightingMode(m.id)}
                          style={{
                            padding: '9px 6px',
                            borderRadius: 8,
                            background: lightingMode === m.id ? '#e879f9' : 'rgba(255,255,255,0.06)',
                            border: `1.5px solid ${lightingMode === m.id ? '#ffffff' : 'rgba(255,255,255,0.16)'}`,
                            color: lightingMode === m.id ? '#1e1035' : '#ffffff',
                            fontWeight: 800,
                            fontSize: '0.74rem',
                            cursor: 'pointer',
                          }}
                        >
                          {m.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 3. Trackpad & Rover Handling */}
                  <div style={{ marginBottom: 14 }}>
                    <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#94a3b8', marginBottom: 6 }}>
                      3. TRACKPAD &amp; DRIVING COMFORT
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                      <button
                        onClick={() => setTrackpadDriveEnabled(!trackpadDriveEnabled)}
                        style={{
                          padding: '9px 8px',
                          borderRadius: 8,
                          background: trackpadDriveEnabled ? 'rgba(0, 255, 204, 0.18)' : 'rgba(255,255,255,0.06)',
                          border: `1.5px solid ${trackpadDriveEnabled ? '#00ffcc' : 'rgba(255,255,255,0.16)'}`,
                          color: trackpadDriveEnabled ? '#00ffcc' : '#cbd5e1',
                          fontWeight: 800,
                          fontSize: '0.74rem',
                          cursor: 'pointer',
                        }}
                      >
                        🖱️ Trackpad Scroll Drive: {trackpadDriveEnabled ? 'ON' : 'OFF'}
                      </button>

                      <button
                        onClick={() => setRoverSpeedMultiplier(roverSpeedMultiplier > 1 ? 1.0 : 1.45)}
                        style={{
                          padding: '9px 8px',
                          borderRadius: 8,
                          background: roverSpeedMultiplier > 1 ? 'rgba(251, 146, 60, 0.22)' : 'rgba(255,255,255,0.06)',
                          border: `1.5px solid ${roverSpeedMultiplier > 1 ? '#fb923c' : 'rgba(255,255,255,0.16)'}`,
                          color: roverSpeedMultiplier > 1 ? '#fde68a' : '#ffffff',
                          fontWeight: 800,
                          fontSize: '0.74rem',
                          cursor: 'pointer',
                        }}
                      >
                        🚀 Speed: {roverSpeedMultiplier > 1 ? 'TURBO (1.45x)' : 'NORMAL (1.0x)'}
                      </button>
                    </div>
                  </div>

                  {/* 4. Audio, Quality, Reset Crates/Pins & 2D Mode */}
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    <button
                      onClick={toggleMute}
                      style={{
                        padding: '8px 11px',
                        borderRadius: 8,
                        background: !isMuted ? 'rgba(0,255,136,0.16)' : 'rgba(255,255,255,0.08)',
                        border: `1px solid ${!isMuted ? '#00ff88' : 'rgba(255,255,255,0.18)'}`,
                        color: '#ffffff',
                        fontWeight: 800,
                        fontSize: '0.74rem',
                        cursor: 'pointer',
                      }}
                    >
                      {isMuted ? '🔇 Unmute Audio' : '🔊 Audio: ON'}
                    </button>

                    <button
                      onClick={() => setQuality(quality === 'high' ? 'low' : 'high')}
                      style={{
                        padding: '8px 11px',
                        borderRadius: 8,
                        background: 'rgba(255,255,255,0.08)',
                        border: '1px solid rgba(255,255,255,0.18)',
                        color: '#ffffff',
                        fontWeight: 800,
                        fontSize: '0.74rem',
                        cursor: 'pointer',
                      }}
                    >
                      ✨ Quality: {quality.toUpperCase()}
                    </button>

                    <button
                      onClick={resetSkillCrates}
                      style={{
                        padding: '8px 11px',
                        borderRadius: 8,
                        background: 'rgba(6, 182, 212, 0.16)',
                        border: '1px solid #06b6d4',
                        color: '#67e8f9',
                        fontWeight: 800,
                        fontSize: '0.74rem',
                        cursor: 'pointer',
                      }}
                    >
                      📦 Restack Crates
                    </button>

                    <button
                      onClick={resetBowlingPins}
                      style={{
                        padding: '8px 11px',
                        borderRadius: 8,
                        background: 'rgba(245, 158, 11, 0.16)',
                        border: '1px solid #f59e0b',
                        color: '#fde68a',
                        fontWeight: 800,
                        fontSize: '0.74rem',
                        cursor: 'pointer',
                      }}
                    >
                      🎳 Reset Pins
                    </button>

                    <button
                      onClick={() => {
                        setTeleportTo(SPAWN_POSITION, 'CPU Spawn Plaza');
                        setShowMainMenu(false);
                      }}
                      style={{
                        padding: '8px 11px',
                        borderRadius: 8,
                        background: 'rgba(232, 121, 249, 0.16)',
                        border: '1px solid #e879f9',
                        color: '#f5d0fe',
                        fontWeight: 800,
                        fontSize: '0.74rem',
                        cursor: 'pointer',
                      }}
                    >
                      🚗 Respawn Center
                    </button>

                    <button
                      onClick={() => {
                        setShowMainMenu(false);
                        setIs2DMode(true);
                      }}
                      style={{
                        padding: '8px 11px',
                        borderRadius: 8,
                        background: 'rgba(0,255,204,0.16)',
                        border: '1px solid #00ffcc',
                        color: '#00ffcc',
                        fontWeight: 800,
                        fontSize: '0.74rem',
                        cursor: 'pointer',
                      }}
                    >
                      📋 Classic 2D View
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 3: CONTROLS & TRACKPAD (All 3 sub-tabs interactive!) */}
              {activeMenuTab === 'controls' && (
                <div>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr 1fr',
                      gap: 8,
                      marginBottom: 18,
                    }}
                  >
                    {[
                      { id: 'keyboard', icon: '⌨️', label: 'Trackpad & Keyboard' },
                      { id: 'mobile', icon: '📱', label: 'Mobile / Touch' },
                      { id: 'gamepad', icon: '🎮', label: 'Gamepad' },
                    ].map((sub) => {
                      const active = controlSubTab === sub.id;
                      return (
                        <button
                          key={sub.id}
                          onClick={() => setControlSubTab(sub.id)}
                          style={{
                            padding: '9px 6px',
                            borderRadius: 8,
                            background: active ? 'rgba(232, 121, 249, 0.2)' : 'rgba(255,255,255,0.04)',
                            border: `1.5px solid ${active ? '#e879f9' : 'rgba(255,255,255,0.1)'}`,
                            textAlign: 'center',
                            color: active ? '#ffffff' : '#94a3b8',
                            fontSize: '0.76rem',
                            fontWeight: 800,
                            cursor: 'pointer',
                          }}
                        >
                          <div style={{ fontSize: '1.2rem', marginBottom: 2 }}>{sub.icon}</div>
                          {sub.label}
                        </button>
                      );
                    })}
                  </div>

                  {controlSubTab === 'keyboard' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {[
                        [['2-FINGER SCROLL'], 'Glide forward, back & steer on Trackpad!'],
                        [['DOUBLE CLICK FLOOR'], 'Auto-Drive car to any clicked point!'],
                        [['WASD', 'ARROWS'], 'Move around'],
                        [['SHIFT'], 'Boost'],
                        [['CTRL LEFT', 'B'], 'Brake'],
                        [['SPACE'], 'Jump'],
                        [['ENTER', 'E'], 'Interact / Open Station'],
                        [['M'], 'Full World Map'],
                        [['V'], 'Aerial / 360° Camera View'],
                        [['NUM KEYS 1-4'], 'Activate hydraulics'],
                        [['DRAG'], 'Orbit camera around car'],
                        [['H'], 'Honk'],
                      ].map(([keysArr, desc], idx) => (
                        <div
                          key={idx}
                          style={{
                            display: 'grid',
                            gridTemplateColumns: '195px 1fr',
                            alignItems: 'center',
                            gap: 12,
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 5 }}>
                            {keysArr.map((k, kIdx) => (
                              <span key={k} style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                                {kIdx > 0 && <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>or</span>}
                                <span className="keycap">{k}</span>
                              </span>
                            ))}
                          </div>
                          <div style={{ fontSize: '0.82rem', color: '#e2e8f0', fontWeight: 600 }}>{desc}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {controlSubTab === 'mobile' && (
                    <div>
                      <p className="font-italic-accent" style={{ color: '#fde68a', marginBottom: 14 }}>
                        You can enable the on-screen D-Pad &amp; Action buttons even on a laptop/desktop!
                      </p>
                      <button
                        onClick={() => setForceTouchControls(!forceTouchControls)}
                        style={{
                          padding: '10px 16px',
                          borderRadius: 8,
                          background: forceTouchControls ? '#00ff88' : '#e879f9',
                          border: 'none',
                          color: '#09090b',
                          fontWeight: 900,
                          fontSize: '0.82rem',
                          cursor: 'pointer',
                          marginBottom: 16,
                        }}
                      >
                        📱 {forceTouchControls ? 'On-Screen Touch Controls: ENABLED' : 'Enable On-Screen Touch Controls Now'}
                      </button>
                      <ul style={{ lineHeight: 1.8, fontSize: '0.86rem', color: '#cbd5e1', paddingLeft: 18 }}>
                        <li>Left D-Pad steers and drives the monster-truck rover.</li>
                        <li>Right action buttons trigger <strong>⚡ Boost</strong>, <strong>🔼 Jump</strong>, and <strong>📯 Horn</strong>.</li>
                        <li>Tap any 3D station or roadmap step to auto-drive or teleport!</li>
                      </ul>
                    </div>
                  )}

                  {controlSubTab === 'gamepad' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {[
                        ['LEFT STICK', 'Steer Monster-Truck Rover'],
                        ['RT / R2', 'Accelerate Forward'],
                        ['LT / L2', 'Brake / Reverse'],
                        ['A / CROSS', 'Jump'],
                        ['B / CIRCLE', 'Nitro Boost'],
                        ['X / SQUARE', 'Interact with Project Station'],
                        ['Y / TRIANGLE', 'Open World Map'],
                      ].map(([btn, desc]) => (
                        <div key={btn} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 10px', background: 'rgba(255,255,255,0.04)', borderRadius: 7 }}>
                          <span className="keycap">{btn}</span>
                          <span style={{ color: '#e2e8f0', fontSize: '0.84rem' }}>{desc}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: ACHIEVEMENTS */}
              {activeMenuTab === 'achievements' && (
                <div>
                  <h1 className="font-display-tall" style={{ fontSize: '2.7rem', color: '#ffffff', marginBottom: 14, lineHeight: 1 }}>
                    MOTHERBOARD ACHIEVEMENTS
                  </h1>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {[
                      {
                        title: 'Board Explorer',
                        desc: `Visited ${exploredZones.length} / 5 Motherboard Zones`,
                        done: exploredZones.length >= 5,
                      },
                      {
                        title: 'Data Harvester',
                        desc: `Collected ${collectedBits.length} / ${totalBits} Floating Data Bits`,
                        done: collectedBits.length >= 10,
                      },
                      {
                        title: 'Golden Overclocker',
                        desc: `Found ${collectedGoldCaps.length} / 5 Secret Golden Capacitors`,
                        done: collectedGoldCaps.length >= 1,
                      },
                      {
                        title: 'Transistor Striker',
                        desc: `Knocked down ${knockedPinsCount} / 10 Transistor Bowling Pins`,
                        done: knockedPinsCount >= 5,
                      },
                      {
                        title: 'Boot Sequence Racer',
                        desc: timeTrial.bestTime ? `Best Lap: ${timeTrial.bestTime}s` : 'Complete a 5-gate Boot Sequence lap',
                        done: Boolean(timeTrial.bestTime),
                      },
                    ].map((ach) => (
                      <div
                        key={ach.title}
                        style={{
                          padding: '10px 14px',
                          borderRadius: 10,
                          background: ach.done ? 'rgba(0, 255, 136, 0.12)' : 'rgba(255,255,255,0.04)',
                          border: `1px solid ${ach.done ? '#00ff88' : 'rgba(255,255,255,0.1)'}`,
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: 800, color: '#ffffff', fontSize: '0.9rem' }}>{ach.title}</div>
                          <div className="font-italic-accent" style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>
                            {ach.desc}
                          </div>
                        </div>
                        <span style={{ fontSize: '1.2rem' }}>{ach.done ? '🏆' : '🔒'}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: CIRCUIT LEADERBOARD */}
              {activeMenuTab === 'circuit' && (
                <div>
                  <h1 className="font-display-tall" style={{ fontSize: '2.7rem', color: '#ffffff', marginBottom: 14, lineHeight: 1 }}>
                    BOOT SEQUENCE CIRCUIT
                  </h1>
                  <p className="font-italic-accent" style={{ color: '#fdba74', marginBottom: 16 }}>
                    Race through all 5 glowing motherboard gates around the circuit track!
                  </p>
                  <button
                    onClick={() => {
                      startTimeTrial();
                      setShowMainMenu(false);
                    }}
                    style={{
                      padding: '10px 18px',
                      borderRadius: 8,
                      background: '#fb923c',
                      color: '#09090b',
                      fontWeight: 900,
                      border: 'none',
                      cursor: 'pointer',
                      marginBottom: 18,
                    }}
                  >
                    🏁 Start Boot Sequence Time Trial Now
                  </button>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {[
                      ['1. DSY', timeTrial.bestTime ? `${timeTrial.bestTime}s (YOU)` : '24.82s'],
                      ['2. IIT', '26.40s'],
                      ['3. GPU', '28.15s'],
                      ['4. RAM', '31.05s'],
                    ].map(([tag, time]) => (
                      <div
                        key={tag}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          padding: '8px 12px',
                          borderRadius: 8,
                          background: 'rgba(255,255,255,0.05)',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.86rem',
                        }}
                      >
                        <span style={{ color: '#fef08a', fontWeight: 700 }}>{tag}</span>
                        <span style={{ color: '#ffffff' }}>{time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 6: WHISPERS */}
              {activeMenuTab === 'whispers' && (
                <div>
                  <h1 className="font-display-tall" style={{ fontSize: '2.7rem', color: '#ffffff', marginBottom: 12, lineHeight: 1 }}>
                    VISITOR WHISPERS
                  </h1>
                  <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                    <input
                      value={whisperTag}
                      onChange={(e) => setWhisperTag(e.target.value)}
                      maxLength={3}
                      placeholder="TAG"
                      style={{
                        width: 64,
                        padding: '8px',
                        borderRadius: 8,
                        background: 'rgba(255,255,255,0.08)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        color: '#fef08a',
                        fontWeight: 800,
                        textTransform: 'uppercase',
                      }}
                    />
                    <input
                      value={whisperText}
                      onChange={(e) => setWhisperText(e.target.value)}
                      placeholder="Leave a message on the motherboard..."
                      style={{
                        flex: 1,
                        padding: '8px 12px',
                        borderRadius: 8,
                        background: 'rgba(255,255,255,0.08)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        color: '#ffffff',
                      }}
                    />
                    <button
                      onClick={() => {
                        if (whisperText.trim()) {
                          addWhisper(whisperTag, whisperText);
                          setWhisperText('');
                        }
                      }}
                      style={{
                        padding: '8px 14px',
                        borderRadius: 8,
                        background: '#fb923c',
                        color: '#09090b',
                        fontWeight: 900,
                        border: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      Post
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {whispers.map((w) => (
                      <div
                        key={w.id}
                        style={{
                          padding: '9px 12px',
                          borderRadius: 8,
                          background: 'rgba(255,255,255,0.04)',
                          border: '1px solid rgba(255,255,255,0.08)',
                        }}
                      >
                        <span style={{ color: '#fb923c', fontWeight: 800, marginRight: 8 }}>[{w.tag}]</span>
                        <span className="font-italic-accent" style={{ color: '#f1f5f9' }}>
                          “{w.text}”
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 7: TECH & CREDITS */}
              {activeMenuTab === 'credits' && (
                <div>
                  <h1 className="font-display-tall" style={{ fontSize: '2.6rem', color: '#ffffff', marginBottom: 12, lineHeight: 1 }}>
                    THREE.JS &amp; ARCHITECTURE
                  </h1>
                  <p style={{ fontSize: '0.96rem', lineHeight: 1.6, color: '#cbd5e1', marginBottom: 18 }}>
                    <a href="https://threejs.org" target="_blank" rel="noopener noreferrer" className="bruno-link">
                      Three.js
                    </a>{' '}
                    &amp; <strong style={{ color: '#ffffff' }}>React Three Fiber</strong> power this interactive 3D motherboard world, combined with{' '}
                    <strong style={{ color: '#ffffff' }}>Rapier 3D Physics</strong> and a procedural{' '}
                    <strong style={{ color: '#ffffff' }}>Web Audio API Synthesizer</strong>.
                  </p>

                  <h2 className="font-display-tall" style={{ fontSize: '2.3rem', color: '#ffffff', marginBottom: 10, lineHeight: 1 }}>
                    SOME MORE LINKS
                  </h2>
                  <ul style={{ listStyle: 'disc', paddingLeft: 20, lineHeight: 1.85, fontSize: '0.95rem', color: '#cbd5e1' }}>
                    <li>
                      Featured AI Platform ⇒{' '}
                      <a href={resumeData.socialLinks.justiceFlowLive} target="_blank" rel="noopener noreferrer" className="bruno-link">
                        JusticeFlow AI (Live on Vercel)
                      </a>
                    </li>
                    <li>
                      GitHub Repositories ⇒{' '}
                      <a href={resumeData.socialLinks.github} target="_blank" rel="noopener noreferrer" className="bruno-link">
                        github.com/Amyra01
                      </a>
                    </li>
                    <li>
                      LinkedIn Profile ⇒{' '}
                      <a href={resumeData.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="bruno-link">
                        linkedin.com/in/daisy-chawla
                      </a>
                    </li>
                    <li>
                      Hackathon &amp; Internship Certificates ⇒{' '}
                      <a href={resumeData.certificates.hackathonsFolder} target="_blank" rel="noopener noreferrer" className="bruno-link">
                        Google Drive Folder
                      </a>
                    </li>
                  </ul>

                  <div
                    className="font-italic-accent"
                    style={{ textAlign: 'right', color: '#94a3b8', marginTop: 18, fontSize: '1.05rem' }}
                  >
                    — Daisy Chawla
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
