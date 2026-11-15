import { motion, AnimatePresence } from 'framer-motion';
import useGameStore from '../stores/gameStore';
import { resumeData } from '../data/resumeData';

export default function ResumeModal() {
  const { showResumeModal, setShowResumeModal } = useGameStore();

  if (!showResumeModal) return null;

  const Section = ({ title, color = '#00ffcc', children }) => (
    <div style={{ marginBottom: '1.35rem' }}>
      <h3
        style={{
          fontSize: '0.7rem',
          fontWeight: 700,
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color,
          marginBottom: '0.65rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
        }}
      >
        <span style={{ flex: 1, height: 1, background: `${color}40` }} />
        {title}
        <span style={{ flex: 1, height: 1, background: `${color}40` }} />
      </h3>
      {children}
    </div>
  );

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
        onClick={() => setShowResumeModal(false)}
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
            background: 'rgba(8, 12, 28, 0.97)',
            border: '1px solid rgba(239, 68, 68, 0.45)',
            boxShadow: '0 0 40px rgba(239, 68, 68, 0.2)',
            borderRadius: 18,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '1.35rem 1.75rem',
              background: 'linear-gradient(135deg, rgba(239,68,68,0.16), rgba(245,158,11,0.1))',
              borderBottom: '1px solid rgba(255,255,255,0.08)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 10,
            }}
          >
            <div>
              <div style={{ fontSize: '0.68rem', color: '#ef4444', fontWeight: 700, letterSpacing: '0.14em' }}>
                OFFICIAL RESUME & VERIFIED CERTIFICATES
              </div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#fff' }}>{resumeData.name}</h2>
              <p style={{ color: '#00ffcc', fontSize: '0.82rem', fontWeight: 600 }}>{resumeData.title}</p>
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <a
                href="/resume.pdf"
                download="Daisy_Chawla_Resume.pdf"
                style={{
                  padding: '9px 15px',
                  borderRadius: 9,
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  background: '#ef4444',
                  color: '#fff',
                  textDecoration: 'none',
                  cursor: 'pointer',
                }}
              >
                ⬇ DOWNLOAD RESUME (PDF)
              </a>
              <button
                onClick={() => window.print()}
                style={{
                  padding: '9px 13px',
                  borderRadius: 9,
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.18)',
                  color: '#e2e8f0',
                  cursor: 'pointer',
                }}
              >
                🖨️ Print
              </button>
              <button
                onClick={() => setShowResumeModal(false)}
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.1)',
                  border: 'none',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '1rem',
                }}
              >
                ✕
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="custom-scroll" style={{ overflowY: 'auto', padding: '1.35rem 1.75rem', flex: 1 }}>
            {/* Verified Contact & Profile Links */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: '1.25rem' }}>
              {[
                { icon: '📍', text: resumeData.location },
                { icon: '📞', text: resumeData.phone },
                { icon: '✉️', text: resumeData.email, href: `mailto:${resumeData.email}` },
                { icon: '🔗', text: 'linkedin.com/in/daisy-chawla', href: resumeData.linkedin },
                { icon: '🐙', text: 'github.com/Amyra01', href: resumeData.github },
                { icon: '🚀', text: 'JusticeFlow AI (Live)', href: resumeData.featuredLiveUrl },
              ].map((item, i) =>
                item.href ? (
                  <a
                    key={i}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 5,
                      padding: '5px 10px',
                      background: 'rgba(0,255,204,0.08)',
                      borderRadius: 6,
                      fontSize: '0.75rem',
                      color: '#00ffcc',
                      textDecoration: 'none',
                      border: '1px solid rgba(0,255,204,0.25)',
                      fontWeight: 600,
                    }}
                  >
                    {item.icon} {item.text} ↗
                  </a>
                ) : (
                  <span
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 5,
                      padding: '5px 10px',
                      background: 'rgba(255,255,255,0.05)',
                      borderRadius: 6,
                      fontSize: '0.75rem',
                      color: '#cbd5e1',
                      border: '1px solid rgba(255,255,255,0.1)',
                    }}
                  >
                    {item.icon} {item.text}
                  </span>
                )
              )}
            </div>

            <Section title="Professional Summary">
              <p style={{ fontSize: '0.82rem', color: '#cbd5e1', lineHeight: 1.65 }}>{resumeData.summary}</p>
            </Section>

            <Section title="Professional Experience" color="#a855f7">
              {resumeData.experience.map((exp, i) => (
                <div
                  key={i}
                  style={{
                    marginBottom: '0.75rem',
                    padding: '0.75rem 1rem',
                    background: 'rgba(255,255,255,0.03)',
                    borderRadius: 10,
                    borderLeft: `3px solid ${exp.color}`,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 6, marginBottom: 3 }}>
                    <strong style={{ fontSize: '0.85rem', color: 'white' }}>
                      {exp.role} — <span style={{ color: exp.color }}>{exp.company}</span>
                    </strong>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      {exp.certificateUrl && (
                        <a
                          href={exp.certificateUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            fontSize: '0.7rem',
                            color: '#00ffcc',
                            background: 'rgba(0,255,204,0.12)',
                            padding: '2px 8px',
                            borderRadius: 4,
                            textDecoration: 'none',
                            border: '1px solid rgba(0,255,204,0.3)',
                          }}
                        >
                          📜 Certificate ↗
                        </a>
                      )}
                      <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{exp.period}</span>
                    </div>
                  </div>
                  <p style={{ fontSize: '0.78rem', color: '#cbd5e1', lineHeight: 1.5 }}>{exp.description}</p>
                </div>
              ))}
            </Section>

            <Section title="Education" color="#06b6d4">
              <div
                style={{
                  padding: '0.75rem 1rem',
                  background: 'rgba(6,182,212,0.08)',
                  borderRadius: 10,
                  border: '1px solid rgba(6,182,212,0.25)',
                }}
              >
                <strong style={{ fontSize: '0.88rem', color: '#fff' }}>{resumeData.education.degree}</strong>
                <p style={{ color: '#06b6d4', fontSize: '0.8rem', margin: '3px 0' }}>{resumeData.education.institution}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, fontSize: '0.76rem', color: '#cbd5e1' }}>
                  <span>📅 {resumeData.education.period}</span>
                  <span>🎯 Current CGPA: {resumeData.education.cgpa}</span>
                  <span>Class XII (CBSE): {resumeData.education.classXII}</span>
                  <span>Class X (ICSE): {resumeData.education.classX}</span>
                </div>
              </div>
            </Section>

            <Section title="Achievements & Certificates" color="#f59e0b">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {resumeData.achievements.map((a, i) => (
                  <div
                    key={i}
                    style={{
                      fontSize: '0.78rem',
                      color: '#e2e8f0',
                      padding: '8px 12px',
                      background: 'rgba(245,158,11,0.08)',
                      borderRadius: 8,
                      border: '1px solid rgba(245,158,11,0.2)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: 10,
                    }}
                  >
                    <span>🏆 {a.text}</span>
                    {a.link && (
                      <a
                        href={a.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          flexShrink: 0,
                          fontSize: '0.72rem',
                          color: '#fbbf24',
                          background: 'rgba(245,158,11,0.18)',
                          padding: '3px 9px',
                          borderRadius: 6,
                          textDecoration: 'none',
                          border: '1px solid rgba(245,158,11,0.4)',
                          fontWeight: 700,
                        }}
                      >
                        {a.linkLabel || 'Certificate'} ↗
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </Section>

            <Section title="References" color="#38bdf8">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 10 }}>
                {resumeData.references.map((ref, i) => (
                  <div
                    key={i}
                    style={{
                      padding: '10px 12px',
                      borderRadius: 10,
                      background: 'rgba(56,189,248,0.08)',
                      border: '1px solid rgba(56,189,248,0.25)',
                    }}
                  >
                    <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#fff' }}>{ref.name}</div>
                    <div style={{ fontSize: '0.74rem', color: '#cbd5e1', margin: '3px 0 8px' }}>{ref.role}</div>
                    <a
                      href={ref.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontSize: '0.72rem',
                        color: '#38bdf8',
                        textDecoration: 'none',
                        fontWeight: 700,
                      }}
                    >
                      📄 View Reference Letter ↗
                    </a>
                  </div>
                ))}
              </div>
            </Section>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
