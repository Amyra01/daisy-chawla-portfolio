import { motion, AnimatePresence } from 'framer-motion';
import useGameStore from '../stores/gameStore';
import sound from '../utils/sound';

const PAINT_COLORS = [
  { name: 'Cyber Obsidian', body: '#150828', accent: '#00ffcc' },
  { name: 'Gemini Emerald', body: '#042f2e', accent: '#00ff88' },
  { name: 'RTX Purple', body: '#2e1065', accent: '#a855f7' },
  { name: 'Overclock Crimson', body: '#450a0a', accent: '#ef4444' },
  { name: 'Solar Gold', body: '#422006', accent: '#fbbf24' },
  { name: 'Arctic Titanium', body: '#1e293b', accent: '#38bdf8' },
];

const TRAIL_STYLES = [
  { id: 'electric', label: '⚡ Electric Cyan' },
  { id: 'rainbow', label: '🌈 RGB Wave' },
  { id: 'flames', label: '🔥 Overclock Flames' },
];

const HORN_TYPES = [
  { id: 'cyber', label: '🔊 Cyber Shockwave' },
  { id: 'synth', label: '🎹 Synth Arpeggio' },
  { id: 'arcade', label: '🕹️ Arcade Chime' },
];

export default function GarageModal() {
  const showGarageModal = useGameStore((s) => s.showGarageModal);
  const setShowGarageModal = useGameStore((s) => s.setShowGarageModal);
  const roverCustomization = useGameStore((s) => s.roverCustomization);
  const updateRoverCustomization = useGameStore((s) => s.updateRoverCustomization);

  if (!showGarageModal) return null;

  return (
    <AnimatePresence>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 220,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(2, 6, 23, 0.78)',
          backdropFilter: 'blur(12px)',
        }}
        onClick={() => setShowGarageModal(false)}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            width: '92vw',
            maxWidth: 540,
            background: 'rgba(8, 12, 28, 0.96)',
            border: '1px solid rgba(56, 189, 248, 0.5)',
            boxShadow: '0 0 40px rgba(56, 189, 248, 0.2)',
            borderRadius: 18,
            padding: '1.5rem 1.75rem',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <div style={{ fontSize: '0.68rem', color: '#38bdf8', fontWeight: 700, letterSpacing: '0.14em' }}>
                CMOS GARAGE // PERSONALIZATION
              </div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#fff' }}>🔧 Customize Your Rover</h2>
            </div>
            <button
              onClick={() => setShowGarageModal(false)}
              style={{
                width: 34,
                height: 34,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.08)',
                border: 'none',
                color: '#fff',
                cursor: 'pointer',
              }}
            >
              ✕
            </button>
          </div>

          {/* Paint Color Picker */}
          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ fontSize: '0.74rem', color: '#94a3b8', fontWeight: 700, marginBottom: 8 }}>
              CHASSIS PAINT & NEON TRIM
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
              {PAINT_COLORS.map((p) => {
                const selected = roverCustomization.accentColor === p.accent && roverCustomization.color === p.body;
                return (
                  <button
                    key={p.name}
                    onClick={() => {
                      sound.playChime();
                      updateRoverCustomization({ color: p.body, accentColor: p.accent });
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '9px 12px',
                      borderRadius: 10,
                      cursor: 'pointer',
                      background: selected ? `${p.accent}22` : 'rgba(255,255,255,0.04)',
                      border: `1px solid ${selected ? p.accent : 'rgba(255,255,255,0.1)'}`,
                      color: '#fff',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                    }}
                  >
                    <span
                      style={{
                        width: 18,
                        height: 18,
                        borderRadius: '50%',
                        background: p.body,
                        border: `2px solid ${p.accent}`,
                      }}
                    />
                    {p.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Trail Style */}
          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ fontSize: '0.74rem', color: '#94a3b8', fontWeight: 700, marginBottom: 8 }}>
              NITRO & SPEED PARTICLE TRAIL
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {TRAIL_STYLES.map((tr) => {
                const selected = roverCustomization.trailStyle === tr.id;
                return (
                  <button
                    key={tr.id}
                    onClick={() => {
                      sound.playChime();
                      updateRoverCustomization({ trailStyle: tr.id });
                    }}
                    style={{
                      flex: 1,
                      padding: '9px 10px',
                      borderRadius: 10,
                      cursor: 'pointer',
                      background: selected ? 'rgba(0,255,204,0.2)' : 'rgba(255,255,255,0.04)',
                      border: `1px solid ${selected ? '#00ffcc' : 'rgba(255,255,255,0.1)'}`,
                      color: selected ? '#00ffcc' : '#cbd5e1',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                    }}
                  >
                    {tr.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Horn Sound */}
          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ fontSize: '0.74rem', color: '#94a3b8', fontWeight: 700, marginBottom: 8 }}>
              SHOCKWAVE HORN [H KEY]
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {HORN_TYPES.map((h) => {
                const selected = roverCustomization.hornType === h.id;
                return (
                  <button
                    key={h.id}
                    onClick={() => {
                      updateRoverCustomization({ hornType: h.id });
                      sound.playHorn(h.id);
                    }}
                    style={{
                      flex: 1,
                      padding: '9px 10px',
                      borderRadius: 10,
                      cursor: 'pointer',
                      background: selected ? 'rgba(56,189,248,0.22)' : 'rgba(255,255,255,0.04)',
                      border: `1px solid ${selected ? '#38bdf8' : 'rgba(255,255,255,0.1)'}`,
                      color: selected ? '#38bdf8' : '#cbd5e1',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                    }}
                  >
                    {h.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ fontSize: '0.75rem', color: '#64748b', textAlign: 'center' }}>
            Saved automatically to localStorage • Press [H] while driving to fire your shockwave horn!
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
