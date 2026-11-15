import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useGameStore from '../stores/gameStore';
import { ZONES } from '../data/zones';
import { resumeData } from '../data/resumeData';
import projects from '../data/projects.json';
import SideRoadmapGuide from './SideRoadmapGuide';
import WorldMapModal from './WorldMapModal';
import BrunoMenuModal from './BrunoMenuModal';

const ZONE_DEFAULT_ACTIONS = {
  cpu: { label: 'Open About Daisy', emoji: '⚡', color: '#00ff88', action: 'about' },
  gpu: { label: 'Browse Projects', emoji: '🚀', color: '#a855f7', action: 'projects' },
  ram: { label: 'View Skills Stack', emoji: '💻', color: '#06b6d4', action: 'skill' },
  expansion: { label: 'View Experience', emoji: '🏆', color: '#f59e0b', action: 'experience' },
  psu: { label: 'Open Resume & PDF', emoji: '📄', color: '#ef4444', action: 'resume' },
};

export default function HUD() {
  const currentZone = useGameStore((s) => s.currentZone);
  const currentSpeed = useGameStore((s) => s.currentSpeed);
  const isNitro = useGameStore((s) => s.isNitro);
  const nearbyTrigger = useGameStore((s) => s.nearbyTrigger);
  const cameraMode = useGameStore((s) => s.cameraMode);
  const setCameraMode = useGameStore((s) => s.setCameraMode);
  const setIs2DMode = useGameStore((s) => s.setIs2DMode);
  const isMuted = useGameStore((s) => s.isMuted);
  const toggleMute = useGameStore((s) => s.toggleMute);
  const setTeleportTo = useGameStore((s) => s.setTeleportTo);
  const toggleWorldMap = useGameStore((s) => s.toggleWorldMap);
  const setShowMainMenu = useGameStore((s) => s.setShowMainMenu);
  const toastMessage = useGameStore((s) => s.toastMessage);
  const clearToast = useGameStore((s) => s.clearToast);

  useEffect(() => {
    if (!toastMessage) return;
    const id = setTimeout(() => clearToast(), 3400);
    return () => clearTimeout(id);
  }, [toastMessage, clearToast]);

  const zone = ZONE_DEFAULT_ACTIONS[currentZone] || ZONE_DEFAULT_ACTIONS.cpu;
  const zoneData = Object.values(ZONES).find((z) => z.id === currentZone);

  const openZoneModal = (actionKey) => {
    const store = useGameStore.getState();
    store.closeAllModals();
    if (actionKey === 'about') store.setShowAboutModal(true);
    else if (actionKey === 'skill') store.setShowSkillModal(true);
    else if (actionKey === 'projects') store.setActiveProject(projects[0]);
    else if (actionKey === 'experience') store.setActiveExperience(resumeData.experience[0]);
    else if (actionKey === 'resume') store.setShowResumeModal(true);
  };

  const handlePrimaryAction = () => {
    const store = useGameStore.getState();
    if (store.activateNearbyTrigger()) return;
    openZoneModal(zone.action);
  };

  useEffect(() => {
    const onKey = (e) => {
      const s = useGameStore.getState();
      if (s.showWelcome) return;
      const tag = e.target?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;

      if (e.code === 'Escape') {
        s.closeAllModals();
      } else if (e.code === 'KeyM') {
        e.preventDefault();
        s.toggleWorldMap();
      } else if (e.code === 'KeyL') {
        e.preventDefault();
        s.toggleMute();
      } else if (e.code === 'KeyT') {
        e.preventDefault();
        s.setShowMainMenu(true, 'whispers');
      } else if (e.code === 'KeyE' || e.code === 'Enter') {
        const anyOpen =
          s.showAboutModal ||
          s.showSkillModal ||
          s.activeProject ||
          s.activeExperience ||
          s.showResumeModal ||
          s.showGarageModal ||
          s.showWorldMap ||
          s.showMainMenu;
        if (!anyOpen) {
          e.preventDefault();
          handlePrimaryAction();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  return (
    <>
      {/* Subtle Tilt-Shift Top/Bottom Vignette */}
      <div className="tilt-shift-edges" />

      {/* ── Clean Top Navigation Bar ── */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: 58,
          zIndex: 120,
          display: 'flex',
          alignItems: 'center',
          padding: '0 1.15rem',
          background: 'rgba(18, 14, 30, 0.88)',
          backdropFilter: 'blur(14px)',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          justifyContent: 'space-between',
        }}
      >
        {/* Left: Brand Identity */}
        <div
          onClick={() => setShowMainMenu(true, 'home')}
          style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}
        >
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 9,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'linear-gradient(135deg, #fb923c, #e11d48)',
              fontSize: '1.05rem',
            }}
          >
            ⚡
          </div>
          <div>
            <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#fff' }}>
              {resumeData.name}
            </div>
            <div className="font-italic-accent" style={{ fontSize: '0.68rem', color: '#fdba74' }}>
              Golden-Hour 3D Motherboard Portfolio
            </div>
          </div>
        </div>

        {/* Center: 5 Section Pills + Quick Camera View Pills (Aerial & 360°) */}
        <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
          {Object.values(ZONES).map((z) => {
            const isCur = currentZone === z.id;
            const act = ZONE_DEFAULT_ACTIONS[z.id]?.action;
            return (
              <button
                key={z.id}
                onClick={() => {
                  setTeleportTo([z.position[0], 2.6, z.position[2] + 6]);
                  openZoneModal(act);
                }}
                style={{
                  padding: '5px 11px',
                  borderRadius: 999,
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  background: isCur ? `${z.color}28` : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${isCur ? z.color : 'rgba(255,255,255,0.12)'}`,
                  color: isCur ? z.color : '#e2e8f0',
                }}
              >
                {z.label}
              </button>
            );
          })}

          {/* Divider */}
          <div style={{ width: 1, height: 22, background: 'rgba(255,255,255,0.15)', margin: '0 4px' }} />

          {/* Direct Full Aerial View & 360° Orbit View Buttons */}
          <button
            onClick={() => setCameraMode(cameraMode === 'aerial' ? 'follow' : 'aerial')}
            title="View the full working motherboard from high above [V]"
            style={{
              padding: '5px 11px',
              borderRadius: 999,
              fontSize: '0.72rem',
              fontWeight: 800,
              cursor: 'pointer',
              background: cameraMode === 'aerial' ? '#fb923c' : 'rgba(251, 146, 60, 0.14)',
              border: '1px solid #fb923c',
              color: cameraMode === 'aerial' ? '#09090b' : '#fdba74',
            }}
          >
            🦅 {cameraMode === 'aerial' ? 'Back to Car' : 'Full Aerial View'}
          </button>

          <button
            onClick={() => setCameraMode(cameraMode === 'orbit360' ? 'follow' : 'orbit360')}
            title="360° revolving panoramic view of the working motherboard [V]"
            style={{
              padding: '5px 11px',
              borderRadius: 999,
              fontSize: '0.72rem',
              fontWeight: 800,
              cursor: 'pointer',
              background: cameraMode === 'orbit360' ? '#38bdf8' : 'rgba(56, 189, 248, 0.14)',
              border: '1px solid #38bdf8',
              color: cameraMode === 'orbit360' ? '#09090b' : '#7dd3fc',
            }}
          >
            🔄 {cameraMode === 'orbit360' ? 'Stop 360°' : '360° View'}
          </button>
        </div>

        {/* Right: Utility Buttons */}
        <div style={{ display: 'flex', gap: 7, alignItems: 'center' }}>
          <button
            onClick={() => setIs2DMode(true)}
            style={{
              padding: '6px 11px',
              borderRadius: 8,
              fontSize: '0.72rem',
              fontWeight: 800,
              background: 'rgba(0,255,204,0.15)',
              border: '1px solid rgba(0,255,204,0.4)',
              color: '#00ffcc',
              cursor: 'pointer',
            }}
          >
            📋 2D View
          </button>
          <button
            onClick={() => useGameStore.getState().setShowGarageModal(true)}
            title="Customize Monster-Truck Paint & Trail"
            style={{
              padding: '6px 9px',
              borderRadius: 8,
              fontSize: '0.72rem',
              background: 'rgba(255,255,255,0.07)',
              border: '1px solid rgba(255,255,255,0.14)',
              color: '#cbd5e1',
              cursor: 'pointer',
            }}
          >
            🎨 Paint
          </button>
          <button
            onClick={toggleMute}
            title="Toggle Sound [L]"
            style={{
              padding: '6px 9px',
              borderRadius: 8,
              fontSize: '0.72rem',
              background: 'rgba(255,255,255,0.07)',
              border: '1px solid rgba(255,255,255,0.14)',
              color: '#cbd5e1',
              cursor: 'pointer',
            }}
          >
            {isMuted ? '🔇' : '🔊'}
          </button>
        </div>
      </div>

      {/* ── Top-Right Stacked Solid Rounded Square Buttons: [☰ Menu] & [📍 Map Pin] (Matching Ref 1 Screenshot 6!) ── */}
      <div
        style={{
          position: 'fixed',
          right: 18,
          top: 72,
          zIndex: 120,
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
        }}
      >
        <button
          onClick={() => setShowMainMenu(true, 'home')}
          title="Open Main Menu & Controls (Home, Settings, Controls, Links)"
          style={{
            width: 46,
            height: 46,
            borderRadius: 8,
            background: 'linear-gradient(180deg, #581c45 0%, #3b1230 100%)',
            border: '1.5px solid rgba(255, 255, 255, 0.32)',
            color: '#ffffff',
            fontSize: '1.3rem',
            fontWeight: 800,
            cursor: 'pointer',
            boxShadow: '0 8px 22px rgba(0,0,0,0.55)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          ☰
        </button>

        <button
          onClick={toggleWorldMap}
          title="Open Full Illustrated World Map [M]"
          style={{
            width: 46,
            height: 46,
            borderRadius: 8,
            background: 'linear-gradient(180deg, #581c45 0%, #3b1230 100%)',
            border: '1.5px solid rgba(255, 255, 255, 0.32)',
            color: '#ffffff',
            fontSize: '1.25rem',
            cursor: 'pointer',
            boxShadow: '0 8px 22px rgba(0,0,0,0.55)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          📍
        </button>
      </div>

      {/* ── Interactive Left-Side Roadmap & Teaching Guide ── */}
      <SideRoadmapGuide />

      {/* ── Full-Screen Illustrated Top-Down World Map Modal ([M] or 📍) ── */}
      <WorldMapModal />

      {/* ── Bruno-Style Split-Screen Diorama Tabbed Menu Modal (☰) ── */}
      <BrunoMenuModal />

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            style={{
              position: 'fixed',
              top: 70,
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 160,
              padding: '7px 16px',
              borderRadius: 999,
              background: 'rgba(22, 19, 36, 0.95)',
              border: '1.5px solid #fb923c',
              color: '#fde68a',
              fontSize: '0.78rem',
              fontWeight: 700,
              boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
            }}
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Bottom-Center: Zone Info + Speed + Primary Action Button ── */}
      <div
        style={{
          position: 'fixed',
          bottom: 18,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 100,
          display: 'flex',
          gap: 10,
          alignItems: 'center',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '9px 16px',
            background: 'rgba(22, 19, 36, 0.9)',
            backdropFilter: 'blur(12px)',
            border: `1px solid ${zone.color}66`,
            borderRadius: 12,
          }}
        >
          <span style={{ fontSize: '1.15rem' }}>{zone.emoji}</span>
          <div>
            <div style={{ fontSize: '0.62rem', color: '#cbd5e1', letterSpacing: '0.06em', fontWeight: 700 }}>
              {zoneData?.name}
            </div>
            <div className="font-italic-accent" style={{ fontSize: '0.82rem', color: zone.color }}>
              {zoneData?.description}
            </div>
          </div>
        </div>

        <div
          style={{
            padding: '8px 14px',
            background: 'rgba(22, 19, 36, 0.9)',
            backdropFilter: 'blur(12px)',
            border: `1px solid ${isNitro ? '#fb923c' : 'rgba(255,255,255,0.14)'}`,
            borderRadius: 12,
            fontFamily: 'var(--font-mono)',
            textAlign: 'center',
            minWidth: 72,
          }}
        >
          <div style={{ fontSize: '1.1rem', fontWeight: 800, color: isNitro ? '#fb923c' : '#00ffcc' }}>
            {currentSpeed}
          </div>
          <div style={{ fontSize: '0.58rem', color: '#94a3b8' }}>km/h</div>
        </div>

        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={handlePrimaryAction}
          style={{
            padding: '10px 18px',
            borderRadius: 12,
            cursor: 'pointer',
            background: nearbyTrigger ? nearbyTrigger.color : `${zone.color}28`,
            border: `1.5px solid ${nearbyTrigger ? '#ffffff' : zone.color}`,
            color: nearbyTrigger ? '#040814' : zone.color,
            fontWeight: 800,
            fontSize: '0.82rem',
          }}
        >
          {nearbyTrigger
            ? `⚡ Open: ${nearbyTrigger.title} [Enter]`
            : `${zone.emoji} ${zone.label} [Enter]`}
        </motion.button>
      </div>

      {/* Bottom-Right: Verified Social & Live Project Links */}
      <div
        style={{
          position: 'fixed',
          right: 18,
          bottom: 18,
          zIndex: 100,
          display: 'flex',
          gap: 8,
        }}
      >
        {[
          { href: resumeData.socialLinks.github, label: 'GitHub (@Amyra01)', text: '🐙 GitHub' },
          { href: resumeData.socialLinks.linkedin, label: 'LinkedIn', text: '🔗 LinkedIn' },
          { href: resumeData.socialLinks.justiceFlowLive, label: 'JusticeFlow AI Live', text: '🚀 JusticeFlow' },
          { href: resumeData.socialLinks.email, label: 'Email', text: '✉️ Email' },
        ].map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            title={link.label}
            style={{
              padding: '7px 12px',
              borderRadius: 10,
              background: 'rgba(22, 19, 36, 0.9)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.16)',
              color: '#e2e8f0',
              fontSize: '0.74rem',
              fontWeight: 700,
              textDecoration: 'none',
            }}
          >
            {link.text}
          </a>
        ))}
      </div>
    </>
  );
}
