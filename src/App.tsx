import React, { useState, useEffect } from 'react';
import { Home, BarChart2, Settings as SettingsIcon, User, Play, Pause, RotateCcw, Volume2, Bell, Moon } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

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

// --- SOFT ANIMATIONS ---
const SOFT_SPRING = { type: "spring" as const, stiffness: 100, damping: 20 };
const GENTLE_PRESS = { scale: 0.96 };

// --- ANIMATED MESH GRADIENT BACKGROUND ---
const AnimatedMeshGradient: React.FC = () => (
  <>
    {/* Lavender Orb */}
    <motion.div
      animate={{
        x: [0, 150, -100, 0],
        y: [0, -100, 150, 0],
        scale: [1, 1.2, 0.8, 1],
      }}
      transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
      style={{
        position: 'absolute',
        top: '5%',
        left: '15%',
        width: 500,
        height: 500,
        background: 'radial-gradient(circle, rgba(230, 210, 255, 0.4) 0%, transparent 70%)',
        filter: 'blur(80px)',
        pointerEvents: 'none',
        zIndex: 0
      }}
    />
    {/* Mint Orb */}
    <motion.div
      animate={{
        x: [0, -130, 120, 0],
        y: [0, 120, -90, 0],
        scale: [1, 0.9, 1.1, 1],
      }}
      transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
      style={{
        position: 'absolute',
        top: '40%',
        right: '10%',
        width: 450,
        height: 450,
        background: 'radial-gradient(circle, rgba(200, 255, 230, 0.35) 0%, transparent 70%)',
        filter: 'blur(80px)',
        pointerEvents: 'none',
        zIndex: 0
      }}
    />
    {/* Pale Blue Orb */}
    <motion.div
      animate={{
        x: [0, 100, -140, 0],
        y: [0, -130, 80, 0],
        scale: [1, 1.1, 0.85, 1],
      }}
      transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
      style={{
        position: 'absolute',
        bottom: '10%',
        left: '50%',
        width: 480,
        height: 480,
        background: 'radial-gradient(circle, rgba(200, 230, 255, 0.38) 0%, transparent 70%)',
        filter: 'blur(80px)',
        pointerEvents: 'none',
        zIndex: 0
      }}
    />
  </>
);

// --- SOFT GLASS CARD ---
const SoftGlassCard: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={SOFT_SPRING}
    style={{
      background: 'rgba(255, 255, 255, 0.6)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderRadius: '32px',
      padding: '32px',
      boxShadow: '0 8px 32px rgba(147, 197, 253, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.5)',
      ...style
    }}
  >
    {children}
  </motion.div>
);

// --- SOFT BUTTON ---
const SoftButton: React.FC<{
  text?: string;
  icon?: LucideIcon;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
}> = ({ text, icon: Icon, onClick, variant = 'primary' }) => {
  const colors = {
    primary: {
      bg: 'linear-gradient(135deg, rgba(167, 139, 250, 0.7) 0%, rgba(139, 92, 246, 0.7) 100%)',
      shadow: '0 4px 20px rgba(167, 139, 250, 0.3)',
      hoverShadow: '0 6px 30px rgba(167, 139, 250, 0.4)'
    },
    secondary: {
      bg: 'rgba(255, 255, 255, 0.5)',
      shadow: '0 4px 20px rgba(147, 197, 253, 0.2)',
      hoverShadow: '0 6px 30px rgba(147, 197, 253, 0.3)'
    },
    ghost: {
      bg: 'rgba(255, 255, 255, 0.3)',
      shadow: '0 4px 15px rgba(147, 197, 253, 0.15)',
      hoverShadow: '0 6px 25px rgba(147, 197, 253, 0.25)'
    }
  };

  const style = colors[variant];

  return (
    <motion.button
      whileHover={{ scale: 1.02, boxShadow: style.hoverShadow }}
      whileTap={GENTLE_PRESS}
      onClick={onClick}
      transition={SOFT_SPRING}
      style={{
        background: style.bg,
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        border: 'none',
        borderRadius: '20px',
        padding: text ? '16px 32px' : '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        cursor: 'pointer',
        color: variant === 'primary' ? 'white' : 'rgba(100, 100, 150, 1)',
        fontSize: '15px',
        fontWeight: 600,
        boxShadow: style.shadow,
        outline: 'none',
      }}
    >
      {Icon && <Icon size={20} strokeWidth={2.5} />}
      {text}
    </motion.button>
  );
};

// --- ETHEREAL TIMER ---
const EtherealTimer: React.FC<{ totalSeconds: number; isRunning: boolean }> = ({ totalSeconds, isRunning }) => {
  const size = 280;
  const strokeWidth = 6;
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
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        {/* Background Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(200, 220, 255, 0.3)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Animated Progress Path */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#lavenderGradient)"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          animate={{ strokeDashoffset: dashOffset }}
          strokeLinecap="round"
          transition={{ duration: 1, ease: "easeInOut" }}
        />
        <defs>
          <linearGradient id="lavenderGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(167, 139, 250, 0.8)" />
            <stop offset="100%" stopColor="rgba(139, 92, 246, 0.8)" />
          </linearGradient>
        </defs>
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
          animate={{ scale: [1, 1.01, 1] }}
          transition={{ duration: 1 }}
          style={{
            fontSize: '3.5rem',
            margin: 0,
            color: 'rgba(100, 100, 150, 0.9)',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontWeight: 300,
            letterSpacing: '0.05em',
          }}
        >
          {formatTime(timeLeft)}
        </motion.h1>
      </div>
    </div>
  );
};

// --- LIVING PLANT MASCOT ---
const LivingPlant: React.FC = () => (
  <motion.div
    animate={{
      rotate: [-2, 2, -2],
      scale: [1, 1.03, 1],
    }}
    transition={{
      rotate: { duration: 4, repeat: Infinity, ease: "easeInOut" },
      scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }
    }}
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      margin: '32px 0'
    }}
  >
    <img src="https://img.icons8.com/doodle/96/sprout.png" alt="Plant" width="100" />
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, ...SOFT_SPRING }}
      style={{
        background: 'rgba(255, 255, 255, 0.5)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        padding: '8px 20px',
        borderRadius: '20px',
        marginTop: '16px',
        boxShadow: '0 4px 15px rgba(147, 197, 253, 0.2)',
        fontSize: '13px',
        fontWeight: 600,
        color: 'rgba(100, 100, 150, 1)',
      }}
    >
      Sprout · Stage 1
    </motion.div>
  </motion.div>
);

// --- SOFT STATS CHART ---
const SoftStatsChart: React.FC = () => {
  const data = [35, 50, 30, 45, 65, 55, 25];
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: 120, gap: '12px' }}>
      {data.map((val, i) => (
        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: `${(val / 70) * 100}%` }}
            transition={{ ...SOFT_SPRING, delay: i * 0.08 }}
            style={{
              width: '100%',
              background: i % 2 === 0
                ? 'linear-gradient(180deg, rgba(167, 139, 250, 0.6) 0%, rgba(167, 139, 250, 0.3) 100%)'
                : 'linear-gradient(180deg, rgba(147, 197, 253, 0.6) 0%, rgba(147, 197, 253, 0.3) 100%)',
              borderRadius: '12px',
              boxShadow: i % 2 === 0
                ? '0 4px 15px rgba(167, 139, 250, 0.2)'
                : '0 4px 15px rgba(147, 197, 253, 0.2)',
            }}
          />
          <span style={{ fontSize: '12px', color: 'rgba(100, 100, 150, 0.7)', fontWeight: 600 }}>
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'][i]}
          </span>
        </div>
      ))}
    </div>
  );
};

// --- SOFT TOGGLE SWITCH ---
const SoftToggle: React.FC<{ enabled: boolean; onToggle: () => void }> = ({ enabled, onToggle }) => (
  <motion.div
    onClick={onToggle}
    whileTap={{ scale: 0.95 }}
    style={{
      width: 48,
      height: 26,
      background: enabled ? 'rgba(167, 139, 250, 0.4)' : 'rgba(200, 220, 255, 0.3)',
      borderRadius: '100px',
      position: 'relative',
      cursor: 'pointer',
      boxShadow: enabled ? '0 4px 15px rgba(167, 139, 250, 0.3)' : '0 2px 10px rgba(147, 197, 253, 0.2)',
    }}
  >
    <motion.div
      animate={{ left: enabled ? 24 : 2 }}
      transition={SOFT_SPRING}
      style={{
        width: 20,
        height: 20,
        background: 'white',
        borderRadius: '50%',
        position: 'absolute',
        top: 2,
        boxShadow: '0 2px 8px rgba(100, 100, 150, 0.2)',
      }}
    />
  </motion.div>
);

// --- MAIN APP ---
export default function App() {
  const [activeTab, setActiveTab] = useState('Timer');
  const [isRunning, setIsRunning] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(getDarkMode());

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    setDarkMode(newMode);
  };

  const handleCompleteSession = () => {
    updateStreak();
    setIsRunning(false);
  };

  const renderContent = () => {
    if (activeTab === 'Timer') return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={SOFT_SPRING}
        style={{ padding: '40px 24px', textAlign: 'center', position: 'relative', zIndex: 1 }}
      >
        <h1 style={{
          fontSize: '1.5rem',
          fontWeight: 300,
          color: 'rgba(100, 100, 150, 0.8)',
          marginBottom: '40px',
          letterSpacing: '0.1em'
        }}>
          Focus Session
        </h1>

        <SoftGlassCard style={{ marginBottom: '24px' }}>
          <EtherealTimer totalSeconds={1500} isRunning={isRunning} />
          <LivingPlant />
        </SoftGlassCard>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '300px', margin: '0 auto' }}>
          {!isRunning ? (
            <SoftButton text="Start Focus" icon={Play} onClick={() => setIsRunning(true)} variant="primary" />
          ) : (
            <>
              <SoftButton text="Pause" icon={Pause} onClick={() => setIsRunning(false)} variant="secondary" />
              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ flex: 1 }}>
                  <SoftButton text="Complete" onClick={handleCompleteSession} variant="primary" />
                </div>
                <SoftButton icon={RotateCcw} onClick={() => setIsRunning(false)} variant="ghost" />
              </div>
            </>
          )}
        </div>
      </motion.div>
    );

    if (activeTab === 'Stats') return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={SOFT_SPRING}
        style={{ padding: '40px 24px', position: 'relative', zIndex: 1 }}
      >
        <h1 style={{
          fontSize: '1.5rem',
          fontWeight: 300,
          color: 'rgba(100, 100, 150, 0.8)',
          marginBottom: '32px',
          letterSpacing: '0.1em'
        }}>
          Statistics
        </h1>

        <SoftGlassCard style={{ marginBottom: '20px' }}>
          <h3 style={{ margin: '0 0 24px 0', fontSize: '16px', color: 'rgba(100, 100, 150, 0.8)', fontWeight: 600 }}>
            Weekly Activity
          </h3>
          <SoftStatsChart />
        </SoftGlassCard>

        <SoftGlassCard>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              background: 'rgba(167, 139, 250, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 15px rgba(167, 139, 250, 0.2)'
            }}>
              <User size={24} color="rgba(139, 92, 246, 0.8)" strokeWidth={2.5} />
            </div>
            <div>
              <div style={{ fontSize: '18px', fontWeight: 600, color: 'rgba(100, 100, 150, 0.9)' }}>Level 5</div>
              <div style={{ fontSize: '14px', color: 'rgba(100, 100, 150, 0.6)' }}>450 / 1000 XP</div>
            </div>
          </div>
        </SoftGlassCard>
      </motion.div>
    );

    if (activeTab === 'Avatar') return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={SOFT_SPRING}
        style={{ padding: '80px 24px', textAlign: 'center', position: 'relative', zIndex: 1 }}
      >
        <SoftGlassCard>
          <motion.img
            animate={{
              rotate: [-3, 3, -3],
              scale: [1, 1.05, 1],
            }}
            transition={{
              rotate: { duration: 4, repeat: Infinity, ease: "easeInOut" },
              scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }
            }}
            src="https://img.icons8.com/doodle/96/happy.png"
            width="120"
            style={{ marginBottom: 24 }}
            alt="avatar"
          />
          <h2 style={{ fontSize: '24px', fontWeight: 300, color: 'rgba(100, 100, 150, 0.9)', marginBottom: '12px' }}>
            Break Time
          </h2>
          <p style={{ color: 'rgba(100, 100, 150, 0.6)', fontSize: '14px' }}>
            Take a deep breath and relax
          </p>
        </SoftGlassCard>
      </motion.div>
    );

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={SOFT_SPRING}
        style={{ padding: '40px 24px', position: 'relative', zIndex: 1 }}
      >
        <h1 style={{
          fontSize: '1.5rem',
          fontWeight: 300,
          color: 'rgba(100, 100, 150, 0.8)',
          marginBottom: '32px',
          letterSpacing: '0.1em'
        }}>
          Settings
        </h1>

        <SoftGlassCard>
          {[
            { icon: Volume2, label: 'Sound', enabled: false, toggle: () => { } },
            { icon: Bell, label: 'Notifications', enabled: false, toggle: () => { } },
            { icon: Moon, label: 'Dark Mode', enabled: isDarkMode, toggle: toggleDarkMode }
          ].map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ x: 2 }}
              transition={SOFT_SPRING}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '20px 0',
                borderBottom: i !== 2 ? '1px solid rgba(200, 220, 255, 0.2)' : 'none',
              }}
            >
              <item.icon size={20} color="rgba(100, 100, 150, 0.7)" strokeWidth={2.5} />
              <span style={{ marginLeft: 16, flex: 1, color: 'rgba(100, 100, 150, 0.8)', fontSize: '16px', fontWeight: 500 }}>
                {item.label}
              </span>
              <SoftToggle enabled={item.enabled} onToggle={item.toggle} />
            </motion.div>
          ))}
        </SoftGlassCard>
      </motion.div>
    );
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #F0F4FF 0%, #F5F0FF 50%, #F0FFF5 100%)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Animated Mesh Gradient */}
      <AnimatedMeshGradient />

      {/* Content */}
      <div style={{
        maxWidth: '480px',
        margin: '0 auto',
        paddingBottom: '120px',
        position: 'relative',
      }}>
        {renderContent()}
      </div>

      {/* Floating Glass Pill Navigation */}
      <div style={{
        position: 'fixed',
        bottom: 32,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 100,
        display: 'flex',
        justifyContent: 'center',
      }}>
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={SOFT_SPRING}
          style={{
            background: 'rgba(255, 255, 255, 0.6)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderRadius: '30px',
            boxShadow: '0 8px 32px rgba(147, 197, 253, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.5)',
            display: 'flex',
            gap: '8px',
            padding: '12px 20px',
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
                whileTap={GENTLE_PRESS}
                transition={SOFT_SPRING}
                style={{
                  cursor: 'pointer',
                  padding: '10px',
                  borderRadius: '16px',
                  background: isActive ? 'rgba(167, 139, 250, 0.2)' : 'transparent',
                  boxShadow: isActive ? '0 4px 15px rgba(167, 139, 250, 0.2)' : 'none',
                }}
              >
                <tab.icon
                  color={isActive ? 'rgba(139, 92, 246, 0.9)' : 'rgba(100, 100, 150, 0.5)'}
                  size={22}
                  strokeWidth={isActive ? 2.5 : 2}
                />
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}
