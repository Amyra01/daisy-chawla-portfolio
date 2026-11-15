import useGameStore from '../stores/gameStore';
import { resumeData } from '../data/resumeData';
import projects from '../data/projects.json';
import { skills, skillCategories } from '../data/skills';

export default function Portfolio2D() {
  const setIs2DMode = useGameStore((s) => s.setIs2DMode);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 350,
        overflowY: 'auto',
        background: 'radial-gradient(circle at top, #0f172a 0%, #040814 100%)',
        color: '#f8fafc',
        fontFamily: 'var(--font-sans, Inter, sans-serif)',
      }}
    >
      {/* Sticky Top Header */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 20,
          padding: '1rem 2rem',
          background: 'rgba(4, 8, 20, 0.88)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(0,255,204,0.2)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <div>
          <strong style={{ fontSize: '1.1rem', color: '#00ffcc' }}>⚡ {resumeData.name}</strong>
          <span style={{ marginLeft: 10, fontSize: '0.82rem', color: '#94a3b8' }}>
            2D Fast Recruiter View
          </span>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <a
            href="/resume.pdf"
            download="Daisy_Chawla_Resume.pdf"
            style={{
              padding: '8px 14px',
              borderRadius: 8,
              background: 'rgba(239,68,68,0.2)',
              border: '1px solid #ef4444',
              color: '#fca5a5',
              textDecoration: 'none',
              fontSize: '0.8rem',
              fontWeight: 700,
            }}
          >
            ⬇ Download Resume PDF
          </a>
          <button
            onClick={() => setIs2DMode(false)}
            style={{
              padding: '8px 16px',
              borderRadius: 8,
              background: 'linear-gradient(135deg, #00ffcc, #06b6d4)',
              border: 'none',
              color: '#040814',
              fontSize: '0.82rem',
              fontWeight: 800,
              cursor: 'pointer',
            }}
          >
            🎮 Back to 3D Motherboard World
          </button>
        </div>
      </div>

      {/* Main Content Container */}
      <div style={{ maxWidth: 980, margin: '0 auto', padding: '2.5rem 1.5rem 4rem' }}>
        {/* Hero */}
        <div
          style={{
            padding: '2rem',
            borderRadius: 18,
            background: 'rgba(15,23,42,0.75)',
            border: '1px solid rgba(0,255,204,0.25)',
            marginBottom: '2rem',
          }}
        >
          <div style={{ fontSize: '0.75rem', color: '#00ffcc', fontWeight: 700, letterSpacing: '0.15em' }}>
            CREATIVE DEVELOPER & APPLIED AI ENGINEER
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 900, margin: '6px 0 10px' }}>{resumeData.name}</h1>
          <p style={{ color: '#cbd5e1', lineHeight: 1.65, fontSize: '0.95rem', marginBottom: '1.25rem' }}>
            {resumeData.summary}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {resumeData.quickStats.map((s, i) => (
              <span
                key={i}
                style={{
                  padding: '6px 12px',
                  borderRadius: 8,
                  background: `${s.color}18`,
                  border: `1px solid ${s.color}55`,
                  color: s.color,
                  fontSize: '0.8rem',
                  fontWeight: 700,
                }}
              >
                {s.label}: {s.value}
              </span>
            ))}
          </div>
        </div>

        {/* Featured Projects */}
        <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#a855f7', marginBottom: '1rem' }}>
          🚀 Featured Projects (GPU Boulevard)
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: 16, marginBottom: '2.5rem' }}>
          {projects.map((p) => (
            <div
              key={p.id}
              style={{
                padding: '1.35rem',
                borderRadius: 14,
                background: 'rgba(15,23,42,0.8)',
                border: `1px solid ${p.bannerColor}44`,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ fontSize: '0.7rem', color: p.bannerColor, fontWeight: 700, marginBottom: 4 }}>
                  ★ {p.event}
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 6 }}>{p.title}</h3>
                <p style={{ fontSize: '0.82rem', color: '#cbd5e1', lineHeight: 1.55, marginBottom: 12 }}>
                  {p.description}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 14 }}>
                  {p.techStack.map((t) => (
                    <span key={t} className="tech-chip">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                {p.liveUrl && (
                  <a
                    href={p.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      flex: 1,
                      padding: '8px',
                      borderRadius: 8,
                      background: p.bannerColor,
                      color: '#040814',
                      textAlign: 'center',
                      textDecoration: 'none',
                      fontSize: '0.78rem',
                      fontWeight: 800,
                    }}
                  >
                    Live Demo ↗
                  </a>
                )}
                {p.githubUrl && (
                  <a
                    href={p.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      flex: 1,
                      padding: '8px',
                      borderRadius: 8,
                      background: 'rgba(255,255,255,0.08)',
                      color: '#fff',
                      textAlign: 'center',
                      textDecoration: 'none',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                    }}
                  >
                    GitHub ↗
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Experience Timeline */}
        <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#f59e0b', marginBottom: '1rem' }}>
          🏆 Experience & Achievements (Expansion Bus)
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: 14, marginBottom: '2.5rem' }}>
          {resumeData.experience.map((exp, i) => (
            <div
              key={i}
              style={{
                padding: '1.15rem',
                borderRadius: 12,
                background: 'rgba(15,23,42,0.8)',
                borderLeft: `4px solid ${exp.color}`,
              }}
            >
              <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{exp.period}</div>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: '#fff', margin: '2px 0' }}>{exp.role}</div>
              <div style={{ fontSize: '0.82rem', color: exp.color, fontWeight: 600, marginBottom: 6 }}>{exp.company}</div>
              <p style={{ fontSize: '0.8rem', color: '#cbd5e1', lineHeight: 1.5 }}>{exp.description}</p>
            </div>
          ))}
        </div>

        {/* Skills */}
        <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#06b6d4', marginBottom: '1rem' }}>
          💻 Technical Skills (RAM Alley)
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14 }}>
          {skillCategories.map((cat) => (
            <div
              key={cat.key}
              style={{
                padding: '1.15rem',
                borderRadius: 12,
                background: 'rgba(15,23,42,0.8)',
                border: `1px solid ${cat.color}44`,
              }}
            >
              <div style={{ fontSize: '0.8rem', fontWeight: 800, color: cat.color, marginBottom: 8 }}>
                {cat.name.toUpperCase()}
              </div>
              {skills[cat.key].map((s) => (
                <div key={s.name} style={{ marginBottom: 6, fontSize: '0.8rem' }}>
                  <strong style={{ color: '#fff' }}>
                    {s.icon} {s.name}
                  </strong>{' '}
                  <span style={{ color: '#94a3b8' }}>— {s.builtWith}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
