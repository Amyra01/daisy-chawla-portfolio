import { useEffect, useRef, useState } from 'react';
import nipplejs from 'nipplejs';
import useGameStore from '../stores/gameStore';

export default function MobileControls() {
  const joystickRef = useRef(null);
  const managerRef = useRef(null);
  const setTouchControls = useGameStore((s) => s.setTouchControls);
  const touchControls = useGameStore((s) => s.touchControls);
  const nearbyTrigger = useGameStore((s) => s.nearbyTrigger);
  const activateNearbyTrigger = useGameStore((s) => s.activateNearbyTrigger);
  const forceTouchControls = useGameStore((s) => s.forceTouchControls);
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const isMobile = isMobileDevice || forceTouchControls;

  useEffect(() => {
    const checkMobile = () => setIsMobileDevice(window.innerWidth < 820 || 'ontouchstart' in window);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!isMobile || !joystickRef.current) return;

    managerRef.current = nipplejs.create({
      zone: joystickRef.current,
      mode: 'static',
      position: { left: '50%', top: '50%' },
      color: '#00ffcc',
      size: 100,
    });

    const mgr = managerRef.current;

    mgr.on('move', (_, data) => {
      const { angle, force } = data;
      const rad = angle.radian;
      const threshold = force > 0.25;

      setTouchControls({
        forward: threshold && Math.sin(rad) > 0.3,
        backward: threshold && Math.sin(rad) < -0.3,
        left: threshold && Math.cos(rad) < -0.3,
        right: threshold && Math.cos(rad) > 0.3,
      });
    });

    mgr.on('end', () => {
      setTouchControls({ forward: false, backward: false, left: false, right: false });
    });

    return () => mgr.destroy();
  }, [isMobile, setTouchControls]);

  if (!isMobile) return null;

  const ActionButton = ({ label, control, color = '#00ffcc', emoji }) => {
    const handleStart = (e) => {
      e.preventDefault();
      setTouchControls({ [control]: true });
    };
    const handleEnd = (e) => {
      e.preventDefault();
      setTouchControls({ [control]: false });
    };
    return (
      <button
        className={`action-btn ${touchControls[control] ? 'active' : ''}`}
        style={{ borderColor: touchControls[control] ? color : undefined }}
        onPointerDown={handleStart}
        onPointerUp={handleEnd}
        onPointerCancel={handleEnd}
        title={label}
      >
        {emoji}
      </button>
    );
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: 175,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 18px 18px',
        zIndex: 110,
        pointerEvents: 'none',
      }}
    >
      {/* Left: Virtual Joystick */}
      <div
        style={{
          width: 115,
          height: 115,
          position: 'relative',
          pointerEvents: 'all',
        }}
        ref={joystickRef}
      />

      {/* Center: Tap-to-Interact Button when on a Trigger Pad */}
      {nearbyTrigger && (
        <button
          onClick={activateNearbyTrigger}
          style={{
            pointerEvents: 'all',
            padding: '12px 18px',
            borderRadius: 12,
            background: nearbyTrigger.color,
            color: '#040814',
            border: 'none',
            fontWeight: 800,
            fontSize: '0.82rem',
            boxShadow: `0 0 20px ${nearbyTrigger.color}`,
          }}
        >
          ⚡ Tap to Open: {nearbyTrigger.title}
        </button>
      )}

      {/* Right: Jump, Nitro, Horn, Respawn */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 8,
          pointerEvents: 'all',
        }}
      >
        <ActionButton label="Jump" control="jump" emoji="⬆️" color="#00ffcc" />
        <ActionButton label="Nitro" control="nitro" emoji="⚡" color="#f59e0b" />
        <ActionButton label="Horn" control="horn" emoji="📯" color="#a855f7" />
        <ActionButton label="Respawn" control="respawn" emoji="🔄" color="#ef4444" />
      </div>
    </div>
  );
}
