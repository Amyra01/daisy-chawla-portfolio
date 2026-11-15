import { useEffect } from 'react';
import { motion } from 'framer-motion';
import useGameStore from '../stores/gameStore';
import { resumeData } from '../data/resumeData';

export default function WelcomeBanner() {
  const showWelcome = useGameStore((s) => s.showWelcome);
  const dismissWelcome = useGameStore((s) => s.dismissWelcome);
  const setCameraMode = useGameStore((s) => s.setCameraMode);
  const setIs2DMode = useGameStore((s) => s.setIs2DMode);

  useEffect(() => {
    if (!showWelcome) return;
    const onKey = (e) => {
      if (e.code === 'Enter' || e.code === 'Space') {
        e.preventDefault();
        dismissWelcome();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [showWelcome, dismissWelcome]);

  if (!showWelcome) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={dismissWelcome}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 300,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(circle at 50% 48%, #341d63 0%, #1d1038 58%, #120924 100%)',
        cursor: 'pointer',
        overflow: 'hidden',
        userSelect: 'none',
      }}
    >
      {/* Full-Screen Isometric Perspective Grid + Glowing Diorama Circle + "CLICK TO START 🔊" (Screenshot 1!) */}
      <svg
        viewBox="0 0 1200 720"
        style={{
          width: '100%',
          maxWidth: 1180,
          height: 'auto',
          maxHeight: '84vh',
          overflow: 'visible',
        }}
      >
        <defs>
          <filter id="circleNeonGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="12" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <radialGradient id="islandGrad" cx="45%" cy="45%" r="60%">
            <stop offset="0%" stopColor="#9d6b99" />
            <stop offset="70%" stopColor="#724c7d" />
            <stop offset="100%" stopColor="#583868" />
          </radialGradient>
        </defs>

        {/* Isometric Diagonal Grid Lines & '+' Crosses (Screenshot 1 Background!) */}
        <g opacity="0.45">
          {Array.from({ length: 14 }).map((_, i) => (
            <g key={i}>
              <line
                x1={-200 + i * 130}
                y1="0"
                x2={300 + i * 130}
                y2="720"
                stroke="#4338ca"
                strokeWidth="1.2"
              />
              <line
                x1={1400 - i * 130}
                y1="0"
                x2={900 - i * 130}
                y2="720"
                stroke="#4338ca"
                strokeWidth="1.2"
              />
            </g>
          ))}
          {Array.from({ length: 9 }).map((_, r) =>
            Array.from({ length: 13 }).map((__, c) => (
              <text
                key={`${r}-${c}`}
                x={60 + c * 92 + (r % 2) * 46}
                y={55 + r * 80}
                fill="#6366f1"
                fontSize="15"
                fontWeight="bold"
              >
                +
              </text>
            ))
          )}
        </g>

        {/* ── Center Glowing Circular Diorama Island (Screenshot 1!) ── */}
        <g transform="translate(560, 390)">
          {/* Outer Neon Pink-Violet Ring Halo */}
          <ellipse
            cx="0"
            cy="0"
            rx="210"
            ry="118"
            fill="none"
            stroke="#e879f9"
            strokeWidth="7"
            filter="url(#circleNeonGlow)"
          />
          {/* Inner Tiled Circular Ground */}
          <ellipse
            cx="0"
            cy="0"
            rx="208"
            ry="116"
            fill="url(#islandGrad)"
            stroke="#f5d0fe"
            strokeWidth="4"
          />

          {/* Subtle stone tiles & fallen leaves inside circle */}
          <rect x="-45" y="45" width="16" height="10" rx="2" fill="#3b1d54" transform="rotate(-15 -45 45)" />
          <rect x="85" y="32" width="14" height="9" rx="2" fill="#3b1d54" transform="rotate(20 85 32)" />
          <rect x="120" y="10" width="14" height="9" rx="2" fill="#3b1d54" />
          <ellipse cx="-105" cy="68" rx="16" ry="10" fill="#6366f1" />

          {/* Lush Violet-Pink Voxel Tree Canopy with Rim Highlights */}
          <g transform="translate(-55, -135)">
            <rect x="15" y="35" width="22" height="120" fill="#3b1d4a" />
            {/* Rim-lit white/pink outer edge */}
            <circle cx="-48" cy="-22" r="56" fill="#f5d0fe" opacity="0.85" />
            <circle cx="-42" cy="-22" r="55" fill="#7e22ce" />
            <circle cx="15" cy="-65" r="68" fill="#6b21a8" />
            <circle cx="78" cy="-35" r="54" fill="#581c87" />
            <circle cx="-68" cy="35" r="46" fill="#9333ea" />
            <circle cx="0" cy="-10" r="58" fill="#7e22ce" />
          </g>

          {/* Park Heatsink Bench behind Rover */}
          <g transform="translate(-25, -95) rotate(6)">
            <rect x="0" y="0" width="110" height="15" rx="3" fill="#6d4c7d" />
            <rect x="0" y="20" width="110" height="15" rx="3" fill="#6d4c7d" />
            <rect x="-5" y="40" width="120" height="16" rx="4" fill="#583868" />
            <rect x="8" y="-5" width="12" height="65" rx="3" fill="#312e81" />
            <rect x="92" y="-5" width="12" height="65" rx="3" fill="#312e81" />
          </g>

          {/* Warm Glowing Street Lantern on Left */}
          <g transform="translate(-145, -95)">
            <rect x="12" y="48" width="14" height="82" fill="#4c1d95" />
            <rect x="4" y="112" width="30" height="28" rx="4" fill="#312e81" />
            {/* Glowing Warm Yellow-Orange Lantern Glass */}
            <polygon
              points="-4,8 42,8 32,50 6,50"
              fill="#fef08a"
              stroke="#fb923c"
              strokeWidth="4"
              filter="url(#circleNeonGlow)"
            />
            <polygon points="-10,8 48,8 19,-12" fill="#312e81" />
          </g>

          {/* Chunky Monster-Truck Rover with Warm Glowing Bumper & 4 Roof LEDs */}
          <g transform="translate(-55, -45) rotate(-8)">
            {/* Fat Monster Tires */}
            <ellipse cx="12" cy="68" rx="26" ry="26" fill="#18181b" stroke="#312e81" strokeWidth="4" />
            <ellipse cx="74" cy="92" rx="28" ry="28" fill="#18181b" stroke="#312e81" strokeWidth="4" />
            <ellipse cx="136" cy="68" rx="26" ry="26" fill="#18181b" stroke="#312e81" strokeWidth="4" />
            {/* Chassis & Cabin */}
            <rect x="10" y="24" width="126" height="50" rx="12" fill="#4c1d4b" stroke="#18181b" strokeWidth="4" />
            <rect x="28" y="-4" width="86" height="38" rx="9" fill="#3b153b" stroke="#18181b" strokeWidth="4" />
            {/* 4 Glowing Roof Light Bar Dots */}
            <rect x="44" y="-8" width="56" height="10" rx="3" fill="#18181b" />
            <circle cx="53" cy="-3" r="3.2" fill="#fef08a" />
            <circle cx="65" cy="-3" r="3.2" fill="#fef08a" />
            <circle cx="77" cy="-3" r="3.2" fill="#fef08a" />
            <circle cx="89" cy="-3" r="3.2" fill="#fef08a" />
            {/* Glowing Warm Amber Front Headlight Strip */}
            <rect
              x="60"
              y="52"
              width="66"
              height="14"
              rx="4"
              fill="#fef08a"
              stroke="#f97316"
              strokeWidth="3"
              filter="url(#circleNeonGlow)"
            />
          </g>

          {/* ── "CLICK TO START 🔊" + Hand-Drawn Curved Arrow (Exact Match to Screenshot 1!) ── */}
          <g transform="translate(230, -85)">
            <text
              x="55"
              y="0"
              fill="#ffffff"
              fontFamily="'Amatic SC', cursive, sans-serif"
              fontSize="54"
              fontWeight="700"
              letterSpacing="3"
              textAnchor="middle"
              transform="rotate(6)"
            >
              CLICK TO
            </text>
            <text
              x="52"
              y="48"
              fill="#ffffff"
              fontFamily="'Amatic SC', cursive, sans-serif"
              fontSize="54"
              fontWeight="700"
              letterSpacing="3"
              textAnchor="middle"
              transform="rotate(6)"
            >
              START
            </text>

            {/* Curved White Arrow pointing left into the glowing circle */}
            <path
              d="M -5,22 Q -42,8 -68,34"
              fill="none"
              stroke="#ffffff"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            <path
              d="M -68,18 L -70,36 L -52,33"
              fill="none"
              stroke="#ffffff"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Speaker Sound Icon */}
            <g transform="translate(36, 74)">
              <polygon
                points="0,8 8,8 18,0 18,26 8,18 0,18"
                fill="none"
                stroke="#ffffff"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />
              <path d="M 23,7 Q 28,13 23,19" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M 27,3 Q 35,13 27,23" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
            </g>
          </g>
        </g>
      </svg>

      {/* Subtle Bottom Subtitle Bar */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'fixed',
          bottom: 24,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '8px 18px',
          borderRadius: 999,
          background: 'rgba(18, 12, 36, 0.82)',
          border: '1px solid rgba(232, 121, 249, 0.35)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#f5d0fe' }}>
          ⚡ {resumeData.name} • AI &amp; Full-Stack Developer (CGPA 8.39)
        </span>
        <button
          onClick={dismissWelcome}
          style={{
            padding: '5px 13px',
            borderRadius: 999,
            background: '#e879f9',
            border: 'none',
            color: '#1e1035',
            fontSize: '0.75rem',
            fontWeight: 900,
            cursor: 'pointer',
          }}
        >
          🚗 Start Driving
        </button>
        <button
          onClick={() => {
            setCameraMode('orbit360');
            dismissWelcome();
          }}
          style={{
            padding: '5px 12px',
            borderRadius: 999,
            background: 'rgba(56, 189, 248, 0.18)',
            border: '1px solid #38bdf8',
            color: '#7dd3fc',
            fontSize: '0.74rem',
            fontWeight: 800,
            cursor: 'pointer',
          }}
        >
          🔄 360° View
        </button>
        <button
          onClick={() => {
            dismissWelcome();
            setIs2DMode(true);
          }}
          style={{
            padding: '5px 12px',
            borderRadius: 999,
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.2)',
            color: '#e2e8f0',
            fontSize: '0.74rem',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          📋 2D Mode
        </button>
      </div>
    </motion.div>
  );
}
