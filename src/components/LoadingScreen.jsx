import { motion } from 'framer-motion';
import { resumeData } from '../data/resumeData';

export default function LoadingScreen({ progress = 0 }) {
  const pct = Math.min(100, Math.round(progress));
  const statusMessages = [
    'POST CHECK: LGA1700 CPU CORE OK',
    'CALIBRATING DDR5-8000 DUAL-CHANNEL RAM...',
    'MOUNTING PCIE 5.0 X16 GPU SKYSCRAPERS...',
    'ROUTING COPPER TRACES & RAPIER PHYSICS...',
    'SYSTEM READY — LAUNCHING ROVER',
  ];
  const msgIdx = Math.min(statusMessages.length - 1, Math.floor((pct / 100) * statusMessages.length));

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 400,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#030712',
        fontFamily: 'var(--font-mono)',
      }}
    >
      {/* PCB Circuit Grid Background */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.07,
          backgroundImage:
            'linear-gradient(#00ff88 1px, transparent 1px), linear-gradient(90deg, #00ff88 1px, transparent 1px)',
          backgroundSize: '36px 36px',
        }}
      />

      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
        style={{
          width: 72,
          height: 72,
          borderRadius: '50%',
          border: '3px dashed #00ffcc',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '2rem',
          marginBottom: '1.25rem',
          zIndex: 1,
          boxShadow: '0 0 28px rgba(0,255,204,0.28)',
        }}
      >
        ⚡
      </motion.div>

      <div style={{ fontSize: '0.7rem', color: '#00ff88', letterSpacing: '0.2em', marginBottom: 4, zIndex: 1 }}>
        Z790-AI BIOS UEFI v2.0
      </div>

      <h1
        style={{
          fontSize: '1.65rem',
          fontWeight: 900,
          zIndex: 1,
          marginBottom: '0.35rem',
          fontFamily: 'var(--font-sans)',
          background: 'linear-gradient(135deg, #ffffff, #00ffcc, #a855f7)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        {resumeData.name}
      </h1>

      <p style={{ color: '#94a3b8', fontSize: '0.8rem', zIndex: 1, marginBottom: '1.75rem' }}>
        Booting system... {pct}%
      </p>

      {/* Motherboard Segmented Trace Progress Bar */}
      <div style={{ zIndex: 1, width: 310 }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(20, 1fr)',
            gap: 4,
            padding: 6,
            borderRadius: 8,
            background: 'rgba(15,23,42,0.9)',
            border: '1px solid rgba(0,255,204,0.3)',
          }}
        >
          {Array.from({ length: 20 }).map((_, i) => {
            const lit = (i + 1) * 5 <= pct;
            return (
              <div
                key={i}
                style={{
                  height: 12,
                  borderRadius: 2,
                  background: lit ? '#00ffcc' : 'rgba(255,255,255,0.06)',
                  boxShadow: lit ? '0 0 8px #00ffcc' : 'none',
                  transition: 'all 0.15s',
                }}
              />
            );
          })}
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: 8,
            fontSize: '0.66rem',
            color: '#00ffcc',
          }}
        >
          <span>{statusMessages[msgIdx]}</span>
          <span>{pct}%</span>
        </div>
      </div>
    </div>
  );
}
