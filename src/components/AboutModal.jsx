import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useGameStore from '../stores/gameStore';
import { resumeData } from '../data/resumeData';
import projects from '../data/projects.json';

export default function AboutModal() {
  const showAboutModal = useGameStore((s) => s.showAboutModal);
  const setShowAboutModal = useGameStore((s) => s.setShowAboutModal);
  const setActiveProject = useGameStore((s) => s.setActiveProject);
  const setShowResumeModal = useGameStore((s) => s.setShowResumeModal);
  const [tab, setTab] = useState('intro');

  if (!showAboutModal) return null;

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
        onClick={() => setShowAboutModal(false)}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            width: '92vw',
            maxWidth: 640,
            maxHeight: '86vh',
            background: 'rgba(8, 12, 28, 0.96)',
            border: '1px solid rgba(0, 255, 136, 0.45)',
            boxShadow: '0 0 40px rgba(0, 255, 136, 0.18)',
            borderRadius: 18,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Header with Avatar & Quick Stats */}
          <div
            style={{
              padding: '1.35rem 1.75rem',
              background: 'linear-gradient(135deg, rgba(0,255,136,0.14), rgba(6,182,212,0.08))',
              borderBottom: '1px solid rgba(255,255,255,0.08)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 14,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div
                style={{
                  width: 54,
                  height: 54,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #00ff8833, #38bdf833)',
                  border: '2px solid #00ff88',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.65rem',
                  flexShrink: 0,
                }}
              >
                👩‍💻
              </div>
              <div>
                <div style={{ fontSize: '0.68rem', color: '#00ff88', fontWeight: 700, letterSpacing: '0.14em' }}>
                  CPU CORE // ABOUT TERMINAL
                </div>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#fff' }}>{resumeData.name}</h2>
                <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{resumeData.title}</p>
              </div>
            </div>
            <button
              onClick={() => setShowAboutModal(false)}
              style={{
                width: 34,
                height: 34,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.15)',
                color: '#fff',
                cursor: 'pointer',
              }}
            >
              ✕
            </button>
          </div>

          {/* Tab Bar: [ Intro ] [ Education ] [ Highlights ] */}
          <div
            style={{
              display: 'flex',
              gap: 8,
              padding: '0.85rem 1.75rem',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              background: 'rgba(4,8,20,0.6)',
            }}
          >
            {[
              ['intro', '⚡ Intro & Stats'],
              ['education', '🎓 Education'],
              ['highlights', '🏆 Highlights & Leadership'],
            ].map(([key, label]) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                style={{
                  padding: '7px 14px',
                  borderRadius: 999,
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  background: tab === key ? 'rgba(0,255,136,0.2)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${tab === key ? '#00ff88' : 'rgba(255,255,255,0.08)'}`,
                  color: tab === key ? '#00ff88' : '#94a3b8',
                }}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Body */}
          <div style={{ padding: '1.5rem 1.75rem', overflowY: 'auto', flex: 1 }}>
            {tab === 'intro' && (
              <div>
                <p style={{ fontSize: '0.88rem', color: '#e2e8f0', lineHeight: 1.65, marginBottom: '1.25rem' }}>
                  {resumeData.summary}
                </p>

                {/* Quick Stat Chips */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(115px, 1fr))', gap: 10, marginBottom: '1.35rem' }}>
                  {resumeData.quickStats.map((st, i) => (
                    <div
                      key={i}
                      style={{
                        padding: '10px 12px',
                        borderRadius: 12,
                        background: `${st.color}12`,
                        border: `1px solid ${st.color}44`,
                      }}
                    >
                      <div style={{ fontSize: '0.66rem', color: '#94a3b8', textTransform: 'uppercase' }}>{st.label}</div>
                      <div style={{ fontSize: '0.92rem', fontWeight: 800, color: st.color, marginTop: 2 }}>{st.value}</div>
                    </div>
                  ))}
                </div>

                {/* Quick Recruiter Shortcut Buttons */}
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  <button
                    onClick={() => {
                      setShowAboutModal(false);
                      setActiveProject(projects[0]);
                    }}
                    style={{
                      flex: 1,
                      padding: '10px 14px',
                      borderRadius: 10,
                      background: 'rgba(168,85,247,0.18)',
                      border: '1px solid #a855f7',
                      color: '#e9d5ff',
                      fontWeight: 700,
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                    }}
                  >
                    🚀 Featured Project: JusticeFlow AI
                  </button>
                  <button
                    onClick={() => {
                      setShowAboutModal(false);
                      setShowResumeModal(true);
                    }}
                    style={{
                      flex: 1,
                      padding: '10px 14px',
                      borderRadius: 10,
                      background: 'rgba(0,255,136,0.16)',
                      border: '1px solid #00ff88',
                      color: '#00ff88',
                      fontWeight: 700,
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                    }}
                  >
                    📄 Open Full Resume & PDF
                  </button>
                </div>
              </div>
            )}

            {tab === 'education' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div
                  style={{
                    padding: '1.1rem 1.25rem',
                    borderRadius: 12,
                    background: 'rgba(0,255,136,0.08)',
                    border: '1px solid rgba(0,255,136,0.3)',
                  }}
                >
                  <div style={{ fontSize: '0.72rem', color: '#00ff88', fontWeight: 700 }}>
                    {resumeData.education.period}
                  </div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fff', margin: '4px 0' }}>
                    {resumeData.education.degree}
                  </h3>
                  <div style={{ fontSize: '0.86rem', color: '#cbd5e1', marginBottom: 10 }}>
                    {resumeData.education.institution}
                  </div>
                  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', fontSize: '0.78rem' }}>
                    <span style={{ padding: '4px 10px', borderRadius: 6, background: 'rgba(0,255,136,0.18)', color: '#00ff88', fontWeight: 700 }}>
                      🎯 CGPA: {resumeData.education.cgpa} / 10
                    </span>
                    <span style={{ padding: '4px 10px', borderRadius: 6, background: 'rgba(255,255,255,0.06)', color: '#cbd5e1' }}>
                      Class XII: {resumeData.education.classXII}
                    </span>
                    <span style={{ padding: '4px 10px', borderRadius: 6, background: 'rgba(255,255,255,0.06)', color: '#cbd5e1' }}>
                      Class X: {resumeData.education.classX}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {tab === 'highlights' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ fontSize: '0.72rem', color: '#00ff88', fontWeight: 700, letterSpacing: '0.1em' }}>
                  KEY ACHIEVEMENTS
                </div>
                {resumeData.achievements.map((ach, i) => (
                  <div
                    key={i}
                    style={{
                      padding: '8px 12px',
                      borderRadius: 8,
                      background: 'rgba(255,255,255,0.04)',
                      borderLeft: '3px solid #00ff88',
                      fontSize: '0.82rem',
                      color: '#e2e8f0',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: 10,
                    }}
                  >
                    <span>★ {typeof ach === 'string' ? ach : ach.text}</span>
                    {ach.link && (
                      <a
                        href={ach.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          fontSize: '0.72rem',
                          color: '#00ff88',
                          textDecoration: 'none',
                          fontWeight: 700,
                          flexShrink: 0,
                        }}
                      >
                        {ach.linkLabel || 'Link'} ↗
                      </a>
                    )}
                  </div>
                ))}

                <div style={{ fontSize: '0.72rem', color: '#38bdf8', fontWeight: 700, letterSpacing: '0.1em', marginTop: 8 }}>
                  LEADERSHIP ROLES
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 10 }}>
                  {resumeData.leadership.map((ld, i) => (
                    <div
                      key={i}
                      style={{
                        padding: '10px 12px',
                        borderRadius: 10,
                        background: 'rgba(56,189,248,0.08)',
                        border: '1px solid rgba(56,189,248,0.25)',
                      }}
                    >
                      <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#fff' }}>{ld.role}</div>
                      <div style={{ fontSize: '0.74rem', color: '#38bdf8', marginBottom: 4 }}>{ld.org}</div>
                      <div style={{ fontSize: '0.76rem', color: '#94a3b8', lineHeight: 1.45 }}>{ld.description}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
