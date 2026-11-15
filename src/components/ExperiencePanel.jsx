import { motion, AnimatePresence } from 'framer-motion';
import useGameStore from '../stores/gameStore';
import { resumeData } from '../data/resumeData';

export default function ExperiencePanel() {
  const activeExperience = useGameStore((s) => s.activeExperience);
  const setActiveExperience = useGameStore((s) => s.setActiveExperience);

  if (!activeExperience) return null;

  const list = resumeData.experience;
  const currentIdx = Math.max(
    0,
    list.findIndex((e) => e.role === activeExperience.role && e.company === activeExperience.company)
  );

  const goPrev = () => {
    const next = (currentIdx - 1 + list.length) % list.length;
    setActiveExperience(list[next]);
  };

  const goNext = () => {
    const next = (currentIdx + 1) % list.length;
    setActiveExperience(list[next]);
  };

  const accent = activeExperience.color || '#f59e0b';

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
        onClick={() => setActiveExperience(null)}
      >
        <motion.div
          key={activeExperience.id || currentIdx}
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            width: '92vw',
            maxWidth: 560,
            background: 'rgba(8, 12, 28, 0.97)',
            border: `1px solid ${accent}66`,
            boxShadow: `0 0 40px ${accent}25`,
            borderRadius: 18,
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '1.3rem 1.65rem',
              background: `linear-gradient(135deg, ${accent}28, rgba(8,12,28,0.95))`,
              borderBottom: `1px solid ${accent}44`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
            }}
          >
            <div>
              <span
                style={{
                  display: 'inline-block',
                  padding: '2px 10px',
                  borderRadius: 999,
                  background: `${accent}22`,
                  border: `1px solid ${accent}55`,
                  color: accent,
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  marginBottom: 6,
                }}
              >
                {activeExperience.period}
              </span>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#fff' }}>{activeExperience.role}</h2>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: accent, marginTop: 2 }}>
                {activeExperience.company}
              </div>
            </div>
            <button
              onClick={() => setActiveExperience(null)}
              style={{
                width: 34,
                height: 34,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.1)',
                border: 'none',
                color: '#fff',
                cursor: 'pointer',
              }}
            >
              ✕
            </button>
          </div>

          {/* Body */}
          <div style={{ padding: '1.35rem 1.65rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: '1.15rem' }}>
              {(activeExperience.bullets || [activeExperience.description]).map((b, i) => (
                <div
                  key={i}
                  style={{
                    fontSize: '0.82rem',
                    color: '#e2e8f0',
                    lineHeight: 1.5,
                    padding: '8px 12px',
                    borderRadius: 8,
                    background: 'rgba(255,255,255,0.03)',
                    borderLeft: `3px solid ${accent}`,
                  }}
                >
                  • {b}
                </div>
              ))}
            </div>

            {activeExperience.tech && (
              <div style={{ marginBottom: activeExperience.certificateUrl ? '1.15rem' : 0 }}>
                <div style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 700, letterSpacing: '0.12em', marginBottom: 6 }}>
                  TECHNOLOGIES USED
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {activeExperience.tech.map((t) => (
                    <span key={t} className="tech-chip">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Official Certificate Link from Resume PDF */}
            {activeExperience.certificateUrl && (
              <a
                href={activeExperience.certificateUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'block',
                  padding: '10px 14px',
                  borderRadius: 10,
                  background: `${accent}22`,
                  border: `1px solid ${accent}`,
                  color: '#ffffff',
                  textDecoration: 'none',
                  textAlign: 'center',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                }}
              >
                📜 View Official Internship Certificate ↗
              </a>
            )}
          </div>

          {/* Footer: [ ← Prev ] Role [ Next → ] */}
          <div
            style={{
              padding: '0.85rem 1.65rem',
              borderTop: '1px solid rgba(255,255,255,0.08)',
              background: 'rgba(4,8,20,0.75)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <button
              onClick={goPrev}
              style={{
                padding: '6px 14px',
                borderRadius: 8,
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.12)',
                color: '#cbd5e1',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              ← Previous Role
            </button>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>
              {currentIdx + 1} / {list.length}
            </span>
            <button
              onClick={goNext}
              style={{
                padding: '6px 14px',
                borderRadius: 8,
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.12)',
                color: '#cbd5e1',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Next Role →
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
