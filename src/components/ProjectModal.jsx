import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useGameStore from '../stores/gameStore';
import projects from '../data/projects.json';

export default function ProjectModal() {
  const activeProject = useGameStore((s) => s.activeProject);
  const setActiveProject = useGameStore((s) => s.setActiveProject);
  const [slideIdx, setSlideIdx] = useState(0);

  if (!activeProject) return null;

  const currentIdx = projects.findIndex((p) => p.id === activeProject.id);
  const screens = activeProject.screens || [
    'System Architecture Overview',
    'Live Interactive Dashboard',
    'Production Benchmark Metrics',
  ];

  const goPrevProject = () => {
    const nextIdx = (currentIdx - 1 + projects.length) % projects.length;
    setSlideIdx(0);
    setActiveProject(projects[nextIdx]);
  };

  const goNextProject = () => {
    const nextIdx = (currentIdx + 1) % projects.length;
    setSlideIdx(0);
    setActiveProject(projects[nextIdx]);
  };

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
        onClick={() => setActiveProject(null)}
      >
        <motion.div
          key={activeProject.id}
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            width: '92vw',
            maxWidth: 640,
            maxHeight: '88vh',
            background: 'rgba(8, 12, 28, 0.97)',
            border: `1px solid ${activeProject.bannerColor}66`,
            boxShadow: `0 0 40px ${activeProject.bannerColor}25`,
            borderRadius: 18,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Header Banner */}
          <div
            style={{
              padding: '1.25rem 1.65rem',
              background: `linear-gradient(135deg, ${activeProject.bannerColor}33, rgba(8,12,28,0.95))`,
              borderBottom: `1px solid ${activeProject.bannerColor}44`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              gap: 12,
            }}
          >
            <div>
              {activeProject.event && (
                <span
                  style={{
                    display: 'inline-block',
                    fontSize: '0.68rem',
                    color: activeProject.bannerColor,
                    background: `${activeProject.bannerColor}22`,
                    padding: '3px 10px',
                    borderRadius: 999,
                    border: `1px solid ${activeProject.bannerColor}55`,
                    fontWeight: 700,
                    marginBottom: 6,
                  }}
                >
                  ★ {activeProject.event}
                </span>
              )}
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff' }}>{activeProject.title}</h2>
              {activeProject.subtitle && (
                <div style={{ fontSize: '0.8rem', color: '#cbd5e1', marginTop: 2 }}>{activeProject.subtitle}</div>
              )}
            </div>
            <button
              onClick={() => setActiveProject(null)}
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
          <div className="custom-scroll" style={{ padding: '1.35rem 1.65rem', overflowY: 'auto', flex: 1 }}>
            {/* Interactive Screenshot / Feature Preview Carousel */}
            <div
              style={{
                padding: '1rem 1.2rem',
                borderRadius: 12,
                background: `linear-gradient(135deg, rgba(15,23,42,0.9), ${activeProject.bannerColor}18)`,
                border: `1px solid ${activeProject.bannerColor}44`,
                marginBottom: '1.15rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <div style={{ fontSize: '0.65rem', color: activeProject.bannerColor, fontWeight: 700, letterSpacing: '0.12em' }}>
                  PREVIEW SCREEN {slideIdx + 1} / {screens.length}
                </div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', marginTop: 3 }}>
                  🖥️ {screens[slideIdx]}
                </div>
                <div style={{ fontSize: '0.74rem', color: '#00ffcc', marginTop: 2 }}>
                  ⚡ {activeProject.fpsMetric || 'Production Verified'}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                {screens.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setSlideIdx(i)}
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: 6,
                      border: `1px solid ${slideIdx === i ? activeProject.bannerColor : 'rgba(255,255,255,0.15)'}`,
                      background: slideIdx === i ? `${activeProject.bannerColor}33` : 'rgba(255,255,255,0.05)',
                      color: '#fff',
                      fontSize: '0.72rem',
                      cursor: 'pointer',
                    }}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>

            <p style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.6, marginBottom: '1rem' }}>
              {activeProject.description}
            </p>

            {/* Key Features (Max 3 short lines) */}
            {activeProject.features && (
              <div style={{ marginBottom: '1.15rem' }}>
                <div style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 700, letterSpacing: '0.12em', marginBottom: 6 }}>
                  KEY HIGHLIGHTS
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {activeProject.features.map((feat, i) => (
                    <div
                      key={i}
                      style={{
                        fontSize: '0.8rem',
                        color: '#e2e8f0',
                        padding: '6px 10px',
                        borderRadius: 8,
                        background: 'rgba(255,255,255,0.03)',
                        borderLeft: `3px solid ${activeProject.bannerColor}`,
                      }}
                    >
                      • {feat}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tech Stack Chips */}
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 700, letterSpacing: '0.12em', marginBottom: 6 }}>
                TECH STACK
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {activeProject.techStack.map((tech) => (
                  <span key={tech} className="tech-chip">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Prominent [ LIVE DEMO ] and [ GITHUB ] Buttons */}
            <div style={{ display: 'flex', gap: 10 }}>
              {activeProject.liveUrl && (
                <a
                  href={activeProject.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    flex: 1,
                    padding: '11px 14px',
                    borderRadius: 10,
                    background: activeProject.bannerColor,
                    color: '#040814',
                    textDecoration: 'none',
                    textAlign: 'center',
                    fontSize: '0.84rem',
                    fontWeight: 800,
                  }}
                >
                  🌐 LIVE DEMO ↗
                </a>
              )}
              {activeProject.githubUrl && (
                <a
                  href={activeProject.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    flex: 1,
                    padding: '11px 14px',
                    borderRadius: 10,
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    color: '#ffffff',
                    textDecoration: 'none',
                    textAlign: 'center',
                    fontSize: '0.84rem',
                    fontWeight: 700,
                  }}
                >
                  🐙 GITHUB REPO ↗
                </a>
              )}
            </div>
          </div>

          {/* Footer: [ ← Prev ] Project Counter [ Next → ] */}
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
              onClick={goPrevProject}
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
              ← Prev GPU
            </button>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>
              GPU {currentIdx + 1} / {projects.length}
            </span>
            <button
              onClick={goNextProject}
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
              Next GPU →
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
