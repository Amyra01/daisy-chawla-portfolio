import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useGameStore from '../stores/gameStore';
import { skills, skillCategories } from '../data/skills';

export default function SkillModal() {
  const showSkillModal = useGameStore((s) => s.showSkillModal);
  const setShowSkillModal = useGameStore((s) => s.setShowSkillModal);
  const setHighlightedSkill = useGameStore((s) => s.setHighlightedSkill);
  const resetSkillCrates = useGameStore((s) => s.resetSkillCrates);
  const [activeFilter, setActiveFilter] = useState('all');

  if (!showSkillModal) return null;

  const visibleCategories =
    activeFilter === 'all'
      ? skillCategories
      : skillCategories.filter((c) => c.key === activeFilter);

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
        onClick={() => setShowSkillModal(false)}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            width: '92vw',
            maxWidth: 740,
            maxHeight: '86vh',
            background: 'rgba(8, 12, 28, 0.96)',
            border: '1px solid rgba(6, 182, 212, 0.45)',
            boxShadow: '0 0 40px rgba(6, 182, 212, 0.18)',
            borderRadius: 18,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '1.25rem 1.75rem',
              background: 'linear-gradient(135deg, rgba(6,182,212,0.14), rgba(236,72,153,0.1))',
              borderBottom: '1px solid rgba(255,255,255,0.08)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 10,
            }}
          >
            <div>
              <div style={{ fontSize: '0.68rem', color: '#06b6d4', fontWeight: 700, letterSpacing: '0.14em' }}>
                RAM ALLEY // SKILLS & TECH STACK
              </div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#fff' }}>
                💻 Skills & What I Built With Them
              </h2>
            </div>

            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <button
                onClick={resetSkillCrates}
                style={{
                  padding: '7px 13px',
                  borderRadius: 8,
                  background: 'rgba(236,72,153,0.18)',
                  border: '1px solid #ec4899',
                  color: '#f472b6',
                  fontSize: '0.76rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                🔄 Reset 3D Crates
              </button>
              <button
                onClick={() => setShowSkillModal(false)}
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
          </div>

          {/* Category Filter Buttons: [ All ] [ Frontend ] [ 3D and Graphics ] [ Backend ] [ AI/ML ] [ Tools ] */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 6,
              padding: '0.8rem 1.75rem',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              background: 'rgba(4,8,20,0.6)',
            }}
          >
            <button
              onClick={() => setActiveFilter('all')}
              style={{
                padding: '6px 13px',
                borderRadius: 999,
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer',
                background: activeFilter === 'all' ? 'rgba(6,182,212,0.22)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${activeFilter === 'all' ? '#06b6d4' : 'rgba(255,255,255,0.08)'}`,
                color: activeFilter === 'all' ? '#06b6d4' : '#94a3b8',
              }}
            >
              All Stacks
            </button>
            {skillCategories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveFilter(cat.key)}
                style={{
                  padding: '6px 13px',
                  borderRadius: 999,
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  background: activeFilter === cat.key ? `${cat.color}28` : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${activeFilter === cat.key ? cat.color : 'rgba(255,255,255,0.08)'}`,
                  color: activeFilter === cat.key ? cat.color : '#94a3b8',
                }}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Skills List */}
          <div className="custom-scroll" style={{ overflowY: 'auto', padding: '1.35rem 1.75rem', flex: 1 }}>
            {visibleCategories.map((cat) => (
              <div key={cat.key} style={{ marginBottom: '1.5rem' }}>
                <div
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: cat.color,
                    marginBottom: '0.75rem',
                  }}
                >
                  {cat.name}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 10 }}>
                  {skills[cat.key].map((skill) => (
                    <div
                      key={skill.name}
                      onMouseEnter={() => setHighlightedSkill(skill.name)}
                      onMouseLeave={() => setHighlightedSkill(null)}
                      style={{
                        padding: '10px 13px',
                        borderRadius: 12,
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.07)',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ fontSize: '0.86rem', fontWeight: 700, color: '#fff' }}>
                          {skill.icon} {skill.name}
                        </span>
                        <span style={{ fontSize: '0.74rem', fontFamily: 'var(--font-mono)', color: cat.color }}>
                          {skill.level}%
                        </span>
                      </div>
                      <div
                        style={{
                          height: 5,
                          background: 'rgba(255,255,255,0.08)',
                          borderRadius: 999,
                          overflow: 'hidden',
                          marginBottom: 6,
                        }}
                      >
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${skill.level}%` }}
                          transition={{ duration: 0.55 }}
                          style={{
                            height: '100%',
                            background: cat.color,
                            borderRadius: 999,
                          }}
                        />
                      </div>
                      <div style={{ fontSize: '0.74rem', color: '#94a3b8', lineHeight: 1.35 }}>
                        {skill.builtWith}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
