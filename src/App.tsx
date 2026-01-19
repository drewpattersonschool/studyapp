import React, { useState, useEffect, useRef } from 'react';
import { Home, BarChart2, Settings as SettingsIcon, User, Play, Pause, RotateCcw, Volume2, Bell, Moon, Flame } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { motion, useMotionValue, useTransform } from 'framer-motion';

// --- STORAGE HELPERS ---
const getDarkMode = () => {
  const stored = localStorage.getItem('darkMode');
  return stored === 'true';
};

const setDarkMode = (enabled: boolean) => {
  localStorage.setItem('darkMode', String(enabled));
};

const getStoredStreak = () => {
  const data = localStorage.getItem('studyStreak');
  if (data) {
    const parsed = JSON.parse(data);
    return parsed;
  }
  return { streak: 0, lastStudyDate: null };
};

const updateStreak = () => {
  const today = new Date().toDateString();
  const stored = getStoredStreak();

  if (stored.lastStudyDate === today) {
    return stored.streak;
  }

  const lastDate = stored.lastStudyDate ? new Date(stored.lastStudyDate) : null;
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  let newStreak;
  if (!lastDate || lastDate.toDateString() === yesterday.toDateString()) {
    newStreak = stored.streak + 1;
  } else {
    newStreak = 1;
  }

  localStorage.setItem('studyStreak', JSON.stringify({
    streak: newStreak,
    lastStudyDate: today
  }));

  return newStreak;
};

// --- PHYSICS CONFIG ---
const SPRING_CONFIG = { type: "spring" as const, stiffness: 400, damping: 25 };
const TACTILE_PRESS = { scale: 0.92 };

// --- GRADIENT ORBS BACKGROUND ---
const GradientOrbs: React.FC = () => (
  <>
    <motion.div
      animate={{
        x: [0, 100, -50, 0],
        y: [0, -80, 120, 0],
      }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      style={{
        position: 'absolute',
        top: '10%',
        left: '20%',
        width: 300,
        height: 300,
        background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)',
        filter: 'blur(100px)',
        pointerEvents: 'none',
        zIndex: 0
      }}
    />
    <motion.div
      animate={{
        x: [0, -120, 80, 0],
        y: [0, 100, -60, 0],
      }}
      transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      style={{
        position: 'absolute',
        top: '60%',
        right: '10%',
        width: 400,
        height: 400,
        background: 'radial-gradient(circle, rgba(249, 115, 22, 0.1) 0%, transparent 70%)',
        filter: 'blur(100px)',
        pointerEvents: 'none',
        zIndex: 0
      }}
    />
    <motion.div
      animate={{
        x: [0, 60, -100, 0],
        y: [0, -120, 40, 0],
      }}
      transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      style={{
        position: 'absolute',
        bottom: '20%',
        left: '50%',
        width: 350,
        height: 350,
        background: 'radial-gradient(circle, rgba(139, 130, 255, 0.12) 0%, transparent 70%)',
        filter: 'blur(100px)',
        pointerEvents: 'none',
        zIndex: 0
      }}
    />
  </>
);

// --- 3D TILT CARD ---
const TiltCard: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-100, 100], [5, -5]);
  const rotateY = useTransform(x, [-100, 100], [-5, 5]);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(event.clientX - centerX);
    y.set(event.clientY - centerY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: 1000,
        ...style
      }}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
          background: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '32px',
          padding: '32px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
        }}
        transition={SPRING_CONFIG}
      >
        {children}
      </motion.div>
    </motion.div>
  );
};

// --- TACTILE BUTTON ---
const TactileButton: React.FC<{
  text?: string;
  icon?: LucideIcon;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
}> = ({ text, icon: Icon, onClick, variant = 'primary' }) => {
  const colors = {
    primary: {
      bg: '#3B82F6',
      glow: '0 0 20px rgba(59, 130, 246, 0.5), 0 0 40px rgba(59, 130, 246, 0.3)',
      hoverGlow: '0 0 30px rgba(59, 130, 246, 0.7), 0 0 60px rgba(59, 130, 246, 0.4)'
    },
    secondary: {
      bg: 'rgba(255, 255, 255, 0.05)',
      glow: '0 0 15px rgba(255, 255, 255, 0.1)',
      hoverGlow: '0 0 25px rgba(255, 255, 255, 0.2)'
    },
    ghost: {
      bg: 'rgba(255, 255, 255, 0.03)',
      glow: 'none',
      hoverGlow: '0 0 20px rgba(255, 255, 255, 0.15)'
    }
  };

  const style = colors[variant];

  return (
    <motion.button
      whileHover={{ scale: 1.02, boxShadow: style.hoverGlow }}
      whileTap={TACTILE_PRESS}
      onClick={onClick}
      transition={SPRING_CONFIG}
      style={{
        background: style.bg,
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '16px',
        padding: text ? '16px 32px' : '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        cursor: 'pointer',
        color: 'white',
        fontSize: '16px',
        fontWeight: 600,
        boxShadow: style.glow,
        outline: 'none',
      }}
    >
      {Icon && <Icon size={20} />}
      {text}
    </motion.button>
  );
};

// --- GLOWING TIMER RING ---
const GlowingTimer: React.FC<{ totalSeconds: number; isRunning: boolean }> = ({ totalSeconds, isRunning }) => {
  const size = 320;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const [timeLeft, setTimeLeft] = useState(totalSeconds);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((t: number) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const progress = 1 - (timeLeft / totalSeconds);
  const dashOffset = circumference * (1 - progress);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div style={{ position: 'relative', width: size, height: size, margin: '0 auto' }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)', overflow: 'visible' }}>
        <defs>
          <filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {/* Background Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255, 255, 255, 0.05)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Animated Progress Path with Glow */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#3B82F6"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          animate={{ strokeDashoffset: dashOffset }}
          strokeLinecap="round"
          transition={{ duration: 1, ease: "linear" }}
          filter="url(#neonGlow)"
          style={{
            filter: 'drop-shadow(0 0 12px rgba(59, 130, 246, 0.8))'
          }}
        />
      </svg>
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center'
      }}>
        <motion.h1
          key={timeLeft}
          initial={{ scale: 1 }}
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 1 }}
          style={{
            fontSize: '5rem',
            margin: 0,
            color: 'white',
            fontFamily: 'monospace',
            fontWeight: 100,
            letterSpacing: '0.1em',
            textShadow: '0 0 20px rgba(59, 130, 246, 0.5)'
          }}
        >
          {formatTime(timeLeft)}
        </motion.h1>
      </div>
    </div>
  );
};

// --- PULSING FIRE STREAK PILL ---
const FireStreakPill: React.FC<{ streak: number }> = ({ streak }) => (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={SPRING_CONFIG}
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '12px',
      padding: '12px 24px',
      background: 'rgba(0, 0, 0, 0.4)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      border: '1px solid rgba(249, 115, 22, 0.3)',
      borderRadius: '100px',
      boxShadow: '0 0 20px rgba(249, 115, 22, 0.3), 0 8px 32px rgba(0, 0, 0, 0.4)',
    }}
  >
    <motion.div
      animate={{
        scale: [1, 1.2, 1],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      <Flame size={28} color="#F97316" fill="#F97316" />
    </motion.div>
    <div>
      <div style={{ fontSize: '24px', fontWeight: 700, color: 'white', lineHeight: 1 }}>
        {streak}
      </div>
      <div style={{ fontSize: '10px', color: 'rgba(255, 255, 255, 0.6)', fontWeight: 600, letterSpacing: '0.1em' }}>
        DAY STREAK
      </div>
    </div>
  </motion.div>
);

// --- GLASS STATS CARD ---
const StatsCard: React.FC = () => {
  const data = [35, 50, 30, 45, 65, 55, 25];
  return (
    <TiltCard style={{ marginBottom: '24px' }}>
      <h3 style={{ margin: '0 0 24px 0', fontSize: '20px', color: 'white', fontWeight: 600 }}>
        Weekly Activity
      </h3>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: 120, gap: '8px' }}>
        {data.map((val, i) => (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${(val / 70) * 100}%` }}
              transition={{ ...SPRING_CONFIG, delay: i * 0.1 }}
              style={{
                width: '100%',
                background: i % 2 === 0
                  ? 'linear-gradient(180deg, rgba(59, 130, 246, 0.8) 0%, rgba(59, 130, 246, 0.4) 100%)'
                  : 'linear-gradient(180deg, rgba(249, 115, 22, 0.8) 0%, rgba(249, 115, 22, 0.4) 100%)',
                borderRadius: '8px',
                boxShadow: i % 2 === 0
                  ? '0 0 15px rgba(59, 130, 246, 0.4)'
                  : '0 0 15px rgba(249, 115, 22, 0.4)',
              }}
            />
            <span style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.5)', fontWeight: 600 }}>
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'][i]}
            </span>
          </div>
        ))}
      </div>
    </TiltCard>
  );
};

// --- GLASS TOGGLE SWITCH ---
const GlassToggle: React.FC<{ enabled: boolean; onToggle: () => void }> = ({ enabled, onToggle }) => (
  <motion.div
    onClick={onToggle}
    whileTap={{ scale: 0.95 }}
    style={{
      width: 48,
      height: 26,
      background: enabled ? 'rgba(59, 130, 246, 0.3)' : 'rgba(255, 255, 255, 0.1)',
      border: enabled ? '1px solid rgba(59, 130, 246, 0.5)' : '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '100px',
      position: 'relative',
      cursor: 'pointer',
      boxShadow: enabled ? '0 0 15px rgba(59, 130, 246, 0.4)' : 'none',
    }}
  >
    <motion.div
      animate={{ left: enabled ? 24 : 2 }}
      transition={SPRING_CONFIG}
      style={{
        width: 20,
        height: 20,
        background: 'white',
        borderRadius: '50%',
        position: 'absolute',
        top: 2,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
      }}
    />
  </motion.div>
);

// --- MAIN APP ---
export default function App() {
  const [activeTab, setActiveTab] = useState('Timer');
  const [isRunning, setIsRunning] = useState(false);
  const [fireStreak, setFireStreak] = useState(getStoredStreak().streak);
  const [isDarkMode, setIsDarkMode] = useState(getDarkMode());

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    setDarkMode(newMode);
  };

  const handleCompleteSession = () => {
    const newStreak = updateStreak();
    setFireStreak(newStreak);
    setIsRunning(false);
  };

  const renderContent = () => {
    if (activeTab === 'Timer') return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={SPRING_CONFIG}
        style={{ padding: '32px 24px', textAlign: 'center', position: 'relative', zIndex: 1 }}
      >
        <h1 style={{
          fontSize: '2rem',
          fontWeight: 200,
          color: 'white',
          marginBottom: '48px',
          letterSpacing: '0.1em'
        }}>
          FOCUS SESSION
        </h1>

        <TiltCard style={{ marginBottom: '32px' }}>
          <GlowingTimer totalSeconds={1500} isRunning={isRunning} />
        </TiltCard>

        <div style={{ marginBottom: '32px' }}>
          <FireStreakPill streak={fireStreak} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '300px', margin: '0 auto' }}>
          {!isRunning ? (
            <TactileButton text="START FOCUS" icon={Play} onClick={() => setIsRunning(true)} variant="primary" />
          ) : (
            <>
              <TactileButton text="PAUSE" icon={Pause} onClick={() => setIsRunning(false)} variant="secondary" />
              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ flex: 1 }}>
                  <TactileButton text="COMPLETE" onClick={handleCompleteSession} variant="primary" />
                </div>
                <TactileButton icon={RotateCcw} onClick={() => setIsRunning(false)} variant="ghost" />
              </div>
            </>
          )}
        </div>
      </motion.div>
    );

    if (activeTab === 'Stats') return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={SPRING_CONFIG}
        style={{ padding: '32px 24px', position: 'relative', zIndex: 1 }}
      >
        <h1 style={{
          fontSize: '2rem',
          fontWeight: 200,
          color: 'white',
          marginBottom: '32px',
          letterSpacing: '0.1em'
        }}>
          STATISTICS
        </h1>

        <div style={{ marginBottom: '32px', textAlign: 'center' }}>
          <FireStreakPill streak={fireStreak} />
        </div>

        <StatsCard />

        <TiltCard>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              background: 'rgba(59, 130, 246, 0.2)',
              border: '1px solid rgba(59, 130, 246, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)'
            }}>
              <User size={24} color="#3B82F6" />
            </div>
            <div>
              <div style={{ fontSize: '18px', fontWeight: 600, color: 'white' }}>Level 5</div>
              <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.5)' }}>450 / 1000 XP</div>
            </div>
          </div>
        </TiltCard>
      </motion.div>
    );

    if (activeTab === 'Avatar') return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={SPRING_CONFIG}
        style={{ padding: '80px 24px', textAlign: 'center', position: 'relative', zIndex: 1 }}
      >
        <TiltCard>
          <img src="https://img.icons8.com/doodle/96/happy.png" width="120" style={{ marginBottom: 24 }} alt="avatar" />
          <h2 style={{ fontSize: '24px', fontWeight: 300, color: 'white', marginBottom: '12px' }}>Break Time</h2>
          <p style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '14px' }}>Take a deep breath and relax</p>
        </TiltCard>
      </motion.div>
    );

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={SPRING_CONFIG}
        style={{ padding: '32px 24px', position: 'relative', zIndex: 1 }}
      >
        <h1 style={{
          fontSize: '2rem',
          fontWeight: 200,
          color: 'white',
          marginBottom: '32px',
          letterSpacing: '0.1em'
        }}>
          SETTINGS
        </h1>

        <TiltCard>
          {[
            { icon: Volume2, label: 'Sound', enabled: false, toggle: () => { } },
            { icon: Bell, label: 'Notifications', enabled: false, toggle: () => { } },
            { icon: Moon, label: 'Dark Mode', enabled: isDarkMode, toggle: toggleDarkMode }
          ].map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ x: 4 }}
              transition={SPRING_CONFIG}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '20px 0',
                borderBottom: i !== 2 ? '1px solid rgba(255, 255, 255, 0.05)' : 'none',
              }}
            >
              <item.icon size={20} color="white" style={{ opacity: 0.7 }} />
              <span style={{ marginLeft: 16, flex: 1, color: 'white', fontSize: '16px', fontWeight: 500 }}>
                {item.label}
              </span>
              <GlassToggle enabled={item.enabled} onToggle={item.toggle} />
            </motion.div>
          ))}
        </TiltCard>
      </motion.div>
    );
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #050505 0%, #0F1115 100%)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Gradient Orbs */}
      <GradientOrbs />

      {/* Content */}
      <div style={{
        maxWidth: '480px',
        margin: '0 auto',
        paddingBottom: '100px',
        position: 'relative',
      }}>
        {renderContent()}
      </div>

      {/* Glass Tab Bar */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={SPRING_CONFIG}
        style={{
          position: 'fixed',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          maxWidth: '480px',
          background: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderBottom: 'none',
          borderRadius: '32px 32px 0 0',
          boxShadow: '0 -8px 32px rgba(0, 0, 0, 0.4)',
          display: 'flex',
          justifyContent: 'space-around',
          padding: '20px 16px 28px 16px',
          zIndex: 100
        }}
      >
        {[
          { id: 'Timer', icon: Home },
          { id: 'Stats', icon: BarChart2 },
          { id: 'Avatar', icon: User },
          { id: 'Settings', icon: SettingsIcon }
        ].map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <motion.div
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              whileTap={TACTILE_PRESS}
              transition={SPRING_CONFIG}
              style={{
                cursor: 'pointer',
                padding: '8px',
                borderRadius: '12px',
                background: isActive ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
                border: isActive ? '1px solid rgba(59, 130, 246, 0.3)' : '1px solid transparent',
                boxShadow: isActive ? '0 0 20px rgba(59, 130, 246, 0.3)' : 'none',
              }}
            >
              <tab.icon
                color={isActive ? '#3B82F6' : 'rgba(255, 255, 255, 0.4)'}
                size={24}
                strokeWidth={isActive ? 2.5 : 2}
              />
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
