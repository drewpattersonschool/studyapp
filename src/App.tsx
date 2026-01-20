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

const getUserData = () => {
  const data = localStorage.getItem('userData');
  if (data) {
    return JSON.parse(data);
  }
  return { level: 1, xp: 0, sessionsCompleted: 0 };
};

const saveUserData = (data: { level: number; xp: number; sessionsCompleted: number }) => {
  localStorage.setItem('userData', JSON.stringify(data));
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

// --- GAME LOGIC ---
const calculateXpForLevel = (level: number) => {
  return 100 * level; // Level 1 needs 100 XP, Level 2 needs 200 XP, etc.
};

const getCharacterStage = (level: number) => {
  if (level < 5) return 0; // Seedling
  if (level < 10) return 1; // Toddler
  if (level < 20) return 2; // Bloomer
  return 3; // Guardian
};

const getBackgroundTheme = (level: number) => {
  if (level < 10) return 'morning'; // Cyan/Mint/Lavender
  if (level < 20) return 'twilight'; // Purple/Pink/Indigo
  return 'golden'; // Gold/Orange/Amber
};

// --- SOFT ANIMATIONS ---
const SOFT_SPRING = { type: "spring" as const, stiffness: 100, damping: 20 };
const GENTLE_PRESS = { scale: 0.96 };

// --- BACKGROUND THEMES ---
const BACKGROUND_THEMES = {
  morning: {
    gradient: 'linear-gradient(180deg, #F0F4FF 0%, #F5F0FF 50%, #F0FFF5 100%)',
    orbs: [
      { color: 'rgba(230, 210, 255, 0.4)', size: 500 },
      { color: 'rgba(200, 255, 230, 0.35)', size: 450 },
      { color: 'rgba(200, 230, 255, 0.38)', size: 480 }
    ]
  },
  twilight: {
    gradient: 'linear-gradient(180deg, #1E1B4B 0%, #4C1D95 50%, #831843 100%)',
    orbs: [
      { color: 'rgba(167, 139, 250, 0.3)', size: 500 },
      { color: 'rgba(236, 72, 153, 0.25)', size: 450 },
      { color: 'rgba(99, 102, 241, 0.28)', size: 480 }
    ]
  },
  golden: {
    gradient: 'linear-gradient(180deg, #FEF3C7 0%, #FDE68A 50%, #FBBF24 100%)',
    orbs: [
      { color: 'rgba(251, 191, 36, 0.3)', size: 500 },
      { color: 'rgba(249, 115, 22, 0.25)', size: 450 },
      { color: 'rgba(245, 158, 11, 0.28)', size: 480 }
    ]
  }
};

// --- ANIMATED MESH GRADIENT BACKGROUND ---
const AnimatedMeshGradient: React.FC<{ theme: 'morning' | 'twilight' | 'golden' }> = ({ theme }) => {
  const orbs = BACKGROUND_THEMES[theme].orbs;

  return (
    <>
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
          width: orbs[0].size,
          height: orbs[0].size,
          background: `radial-gradient(circle, ${orbs[0].color} 0%, transparent 70%)`,
          filter: 'blur(80px)',
          pointerEvents: 'none',
          zIndex: 0
        }}
      />
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
          width: orbs[1].size,
          height: orbs[1].size,
          background: `radial-gradient(circle, ${orbs[1].color} 0%, transparent 70%)`,
          filter: 'blur(80px)',
          pointerEvents: 'none',
          zIndex: 0
        }}
      />
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
          width: orbs[2].size,
          height: orbs[2].size,
          background: `radial-gradient(circle, ${orbs[2].color} 0%, transparent 70%)`,
          filter: 'blur(80px)',
          pointerEvents: 'none',
          zIndex: 0
        }}
      />
    </>
  );
};

// --- KAWAII SPROUT CHARACTER (SVG) ---
const SproutCharacter: React.FC<{ size?: number; level: number }> = ({ size = 120, level }) => {
  const [isBlinking, setIsBlinking] = useState(false);
  const stage = getCharacterStage(level);
  const scale = 1 + (stage * 0.2); // Grows 20% per stage

  // Random blink effect
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 150);
    }, Math.random() * 2000 + 3000); // 3-5s

    return () => clearInterval(blinkInterval);
  }, []);

  // Stage-based colors
  const leafColor = stage === 3 ? "#FCD34D" : "#10B981"; // Golden leaves for Stage 4
  const leafDarkColor = stage === 3 ? "#F59E0B" : "#059669";

  return (
    <motion.svg
      width={size * scale}
      height={size * scale}
      viewBox="0 0 100 100"
      animate={{
        rotate: [-2, 2, -2],
        scale: [1, 1.03, 1],
      }}
      transition={{
        rotate: { duration: 4, repeat: Infinity, ease: "easeInOut" },
        scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }
      }}
    >
      <defs>
        {/* Body Gradient - 3D Shiny Effect */}
        <radialGradient id="bodyGradient" cx="45%" cy="35%">
          <stop offset="0%" stopColor="#D9F99D" />
          <stop offset="50%" stopColor="#A3E635" />
          <stop offset="100%" stopColor="#65A30D" />
        </radialGradient>
        {/* Golden Halo Gradient */}
        <radialGradient id="haloGradient" cx="50%" cy="50%">
          <stop offset="0%" stopColor="rgba(251, 191, 36, 0.6)" />
          <stop offset="100%" stopColor="rgba(251, 191, 36, 0)" />
        </radialGradient>
        {/* Shadow */}
        <ellipse id="shadow" cx="50" cy="88" rx="22" ry="6" fill="rgba(0,0,0,0.15)" />
      </defs>

      {/* Stage 4: Golden Halo/Aura (Behind everything) */}
      {stage === 3 && (
        <motion.circle
          cx="50"
          cy="50"
          r="40"
          fill="url(#haloGradient)"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.6, 0.8, 0.6]
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
      )}

      {/* Shadow */}
      <use href="#shadow" />

      {/* Body - Organic bean/pear shape */}
      <motion.path
        d="M 35 42 Q 30 50, 32 62 Q 35 72, 42 77 Q 50 80, 58 77 Q 65 72, 68 62 Q 70 50, 65 42 Q 60 32, 50 30 Q 40 32, 35 42 Z"
        fill="url(#bodyGradient)"
        animate={{
          d: [
            "M 35 42 Q 30 50, 32 62 Q 35 72, 42 77 Q 50 80, 58 77 Q 65 72, 68 62 Q 70 50, 65 42 Q 60 32, 50 30 Q 40 32, 35 42 Z",
            "M 36 43 Q 31 50, 33 62 Q 36 71, 43 76 Q 50 79, 57 76 Q 64 71, 67 62 Q 69 50, 64 43 Q 60 33, 50 31 Q 41 33, 36 43 Z",
            "M 35 42 Q 30 50, 32 62 Q 35 72, 42 77 Q 50 80, 58 77 Q 65 72, 68 62 Q 70 50, 65 42 Q 60 32, 50 30 Q 40 32, 35 42 Z"
          ]
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Stage 2+: Left Arm Nub */}
      {stage >= 1 && (
        <motion.ellipse
          cx="28"
          cy="58"
          rx="5"
          ry="7"
          fill="#84CC16"
          animate={{
            cx: [28, 27, 28],
            cy: [58, 60, 58]
          }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        />
      )}

      {/* Stage 2+: Right Arm Nub */}
      {stage >= 1 && (
        <motion.ellipse
          cx="72"
          cy="58"
          rx="5"
          ry="7"
          fill="#84CC16"
          animate={{
            cx: [72, 73, 72],
            cy: [58, 60, 58]
          }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
        />
      )}

      {/* Left Leaf - Grows bigger in Stage 2+ */}
      <motion.g
        animate={{
          rotate: [-5, 5, -5],
          originX: "40px",
          originY: stage >= 1 ? "22px" : "25px"
        }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <path
          d={stage >= 1
            ? "M 40 22 Q 33 16, 28 14 Q 25 12, 22 14 Q 19 18, 24 26 Q 32 30, 40 27 Z"
            : "M 40 25 Q 35 20, 32 18 Q 30 16, 28 18 Q 26 22, 30 28 Q 35 30, 40 28 Z"
          }
          fill={leafColor}
        />
        <path
          d={stage >= 1
            ? "M 40 22 Q 33 18, 28 16"
            : "M 40 25 Q 35 22, 32 20"
          }
          stroke={leafDarkColor}
          strokeWidth="0.5"
          fill="none"
        />
      </motion.g>

      {/* Right Leaf - Grows bigger in Stage 2+ */}
      <motion.g
        animate={{
          rotate: [5, -5, 5],
          originX: "60px",
          originY: stage >= 1 ? "22px" : "25px"
        }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
      >
        <path
          d={stage >= 1
            ? "M 60 22 Q 67 16, 72 14 Q 75 12, 78 14 Q 81 18, 76 26 Q 68 30, 60 27 Z"
            : "M 60 25 Q 65 20, 68 18 Q 70 16, 72 18 Q 74 22, 70 28 Q 65 30, 60 28 Z"
          }
          fill={leafColor}
        />
        <path
          d={stage >= 1
            ? "M 60 22 Q 67 18, 72 16"
            : "M 60 25 Q 65 22, 68 20"
          }
          stroke={leafDarkColor}
          strokeWidth="0.5"
          fill="none"
        />
      </motion.g>

      {/* Stage 3: Pink Flower on top of head */}
      {stage === 2 && (
        <motion.g
          animate={{
            rotate: [-3, 3, -3],
            scale: [1, 1.05, 1]
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* Flower Petals */}
          <circle cx="50" cy="18" r="4" fill="#FCA5A5" />
          <circle cx="45" cy="20" r="4" fill="#FCA5A5" />
          <circle cx="55" cy="20" r="4" fill="#FCA5A5" />
          <circle cx="47" cy="24" r="4" fill="#FCA5A5" />
          <circle cx="53" cy="24" r="4" fill="#FCA5A5" />
          {/* Flower Center */}
          <circle cx="50" cy="21" r="3" fill="#FDE047" />
        </motion.g>
      )}

      {/* Left Eye */}
      <motion.g>
        <motion.ellipse
          cx="42"
          cy="52"
          rx="3.5"
          ry={isBlinking ? "0.3" : "4.5"}
          fill="#065F46"
          animate={{ ry: isBlinking ? 0.3 : 4.5 }}
          transition={{ duration: 0.1 }}
        />
        {/* Eye Reflection */}
        {!isBlinking && (
          <ellipse
            cx="43"
            cy="50.5"
            rx="1.2"
            ry="1.5"
            fill="white"
            opacity="0.9"
          />
        )}
      </motion.g>

      {/* Right Eye */}
      <motion.g>
        <motion.ellipse
          cx="58"
          cy="52"
          rx="3.5"
          ry={isBlinking ? "0.3" : "4.5"}
          fill="#065F46"
          animate={{ ry: isBlinking ? 0.3 : 4.5 }}
          transition={{ duration: 0.1 }}
        />
        {/* Eye Reflection */}
        {!isBlinking && (
          <ellipse
            cx="59"
            cy="50.5"
            rx="1.2"
            ry="1.5"
            fill="white"
            opacity="0.9"
          />
        )}
      </motion.g>

      {/* Smile */}
      <path
        d="M 40 60 Q 50 65, 60 60"
        stroke="#065F46"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />

      {/* Left Blush */}
      <ellipse
        cx="35"
        cy="57"
        rx="4.5"
        ry="3"
        fill="rgba(252, 165, 165, 0.6)"
      />

      {/* Right Blush */}
      <ellipse
        cx="65"
        cy="57"
        rx="4.5"
        ry="3"
        fill="rgba(252, 165, 165, 0.6)"
      />
    </motion.svg>
  );
};

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
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(200, 220, 255, 0.3)"
          strokeWidth={strokeWidth}
          fill="none"
        />
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

// --- XP PROGRESS BAR ---
const XpProgressBar: React.FC<{ currentXp: number; requiredXp: number }> = ({ currentXp, requiredXp }) => {
  const percentage = (currentXp / requiredXp) * 100;

  return (
    <div style={{ width: '100%' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '8px',
        fontSize: '13px',
        color: 'rgba(100, 100, 150, 0.7)',
        fontWeight: 600
      }}>
        <span>{currentXp} XP</span>
        <span>{requiredXp} XP</span>
      </div>
      <div style={{
        width: '100%',
        height: '12px',
        background: 'rgba(200, 220, 255, 0.3)',
        borderRadius: '100px',
        overflow: 'hidden'
      }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={SOFT_SPRING}
          style={{
            height: '100%',
            background: 'linear-gradient(90deg, rgba(167, 139, 250, 0.8) 0%, rgba(139, 92, 246, 0.8) 100%)',
            boxShadow: '0 2px 10px rgba(167, 139, 250, 0.4)'
          }}
        />
      </div>
    </div>
  );
};

// --- EVOLUTION STAGES GRID ---
const EvolutionStages: React.FC<{ currentLevel: number }> = ({ currentLevel }) => {
  const stages = [
    { name: 'Seed', level: 0, emoji: '🌰' },
    { name: 'Sprout', level: 5, emoji: '🌱' },
    { name: 'Flower', level: 15, emoji: '🌸' },
    { name: 'Tree', level: 30, emoji: '🌳' }
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '16px',
      marginTop: '24px'
    }}>
      {stages.map((stage, i) => {
        const isUnlocked = currentLevel >= stage.level;
        return (
          <motion.div
            key={i}
            whileHover={{ scale: isUnlocked ? 1.05 : 1 }}
            style={{
              background: isUnlocked
                ? 'rgba(255, 255, 255, 0.5)'
                : 'rgba(200, 220, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              padding: '20px',
              borderRadius: '20px',
              textAlign: 'center',
              boxShadow: isUnlocked
                ? '0 4px 15px rgba(167, 139, 250, 0.2)'
                : '0 2px 10px rgba(147, 197, 253, 0.1)',
              opacity: isUnlocked ? 1 : 0.5,
              cursor: isUnlocked ? 'default' : 'not-allowed'
            }}
          >
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>
              {isUnlocked ? stage.emoji : '🔒'}
            </div>
            <div style={{
              fontSize: '14px',
              fontWeight: 600,
              color: 'rgba(100, 100, 150, 0.8)',
              marginBottom: '4px'
            }}>
              {stage.name}
            </div>
            <div style={{
              fontSize: '12px',
              color: 'rgba(100, 100, 150, 0.6)'
            }}>
              Level {stage.level}+
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

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
  const [userData, setUserData] = useState(getUserData());
  const [devLevel, setDevLevel] = useState(userData.level);

  const theme = getBackgroundTheme(userData.level);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    setDarkMode(newMode);
  };

  const handleCompleteSession = () => {
    updateStreak();
    setIsRunning(false);

    // Award XP
    const xpGained = 100;
    const newXp = userData.xp + xpGained;
    const requiredXp = calculateXpForLevel(userData.level);

    let newLevel = userData.level;
    let remainingXp = newXp;

    // Level up if needed
    if (newXp >= requiredXp) {
      newLevel = userData.level + 1;
      remainingXp = newXp - requiredXp;
    }

    const newData = {
      level: newLevel,
      xp: remainingXp,
      sessionsCompleted: userData.sessionsCompleted + 1
    };

    setUserData(newData);
    saveUserData(newData);
  };

  const handleDevLevelChange = (level: number) => {
    setDevLevel(level);
    const newData = {
      ...userData,
      level: level,
      xp: 0
    };
    setUserData(newData);
    saveUserData(newData);
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

          <div style={{ margin: '32px 0', display: 'flex', justifyContent: 'center' }}>
            <SproutCharacter size={120} level={userData.level} />
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.5)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            padding: '8px 20px',
            borderRadius: '20px',
            boxShadow: '0 4px 15px rgba(147, 197, 253, 0.2)',
            fontSize: '13px',
            fontWeight: 600,
            color: 'rgba(100, 100, 150, 1)',
            display: 'inline-block'
          }}>
            {getCharacterStage(userData.level) === 0 && 'Seed'}
            {getCharacterStage(userData.level) === 1 && 'Sprout'}
            {getCharacterStage(userData.level) === 2 && 'Flower'}
            {getCharacterStage(userData.level) === 3 && 'Tree'}
            {' · Level '}{userData.level}
          </div>
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
              <div style={{ fontSize: '18px', fontWeight: 600, color: 'rgba(100, 100, 150, 0.9)' }}>
                {userData.sessionsCompleted} Sessions
              </div>
              <div style={{ fontSize: '14px', color: 'rgba(100, 100, 150, 0.6)' }}>
                Total Completed
              </div>
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
        style={{ padding: '40px 24px', textAlign: 'center', position: 'relative', zIndex: 1 }}
      >
        <h1 style={{
          fontSize: '1.5rem',
          fontWeight: 300,
          color: 'rgba(100, 100, 150, 0.8)',
          marginBottom: '32px',
          letterSpacing: '0.1em'
        }}>
          Your Character
        </h1>

        <SoftGlassCard>
          {/* Character */}
          <div style={{ marginBottom: '32px' }}>
            <SproutCharacter size={160} level={userData.level} />
          </div>

          {/* Level Badge */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.5)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            padding: '12px 24px',
            borderRadius: '24px',
            marginBottom: '24px',
            boxShadow: '0 4px 15px rgba(167, 139, 250, 0.2)',
            display: 'inline-block'
          }}>
            <div style={{ fontSize: '24px', fontWeight: 700, color: 'rgba(100, 100, 150, 0.9)' }}>
              Level {userData.level}
            </div>
          </div>

          {/* XP Progress */}
          <XpProgressBar
            currentXp={userData.xp}
            requiredXp={calculateXpForLevel(userData.level)}
          />

          {/* Evolution Stages */}
          <EvolutionStages currentLevel={userData.level} />
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

        <SoftGlassCard style={{ marginBottom: '20px' }}>
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

        {/* Developer Tools */}
        <SoftGlassCard>
          <h3 style={{
            margin: '0 0 20px 0',
            fontSize: '16px',
            color: 'rgba(100, 100, 150, 0.8)',
            fontWeight: 600
          }}>
            Developer Tools
          </h3>

          <div style={{ marginBottom: '16px' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '12px',
              fontSize: '14px',
              color: 'rgba(100, 100, 150, 0.7)',
              fontWeight: 600
            }}>
              <span>Force Level</span>
              <span>Level {devLevel}</span>
            </div>

            <input
              type="range"
              min="1"
              max="50"
              value={devLevel}
              onChange={(e) => handleDevLevelChange(parseInt(e.target.value))}
              style={{
                width: '100%',
                height: '8px',
                borderRadius: '10px',
                outline: 'none',
                background: 'linear-gradient(90deg, rgba(167, 139, 250, 0.3) 0%, rgba(139, 92, 246, 0.3) 100%)',
                WebkitAppearance: 'none',
                cursor: 'pointer'
              }}
            />
          </div>

          <div style={{
            fontSize: '12px',
            color: 'rgba(100, 100, 150, 0.6)',
            textAlign: 'center',
            marginTop: '12px'
          }}>
            Current Theme: {theme === 'morning' ? '🌅 Morning' : theme === 'twilight' ? '🌆 Twilight' : '🌇 Golden Hour'}
          </div>
        </SoftGlassCard>
      </motion.div>
    );
  };

  return (
    <motion.div
      animate={{
        background: BACKGROUND_THEMES[theme].gradient
      }}
      transition={{ duration: 2, ease: "easeInOut" }}
      style={{
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Animated Mesh Gradient */}
      <AnimatedMeshGradient theme={theme} />

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
    </motion.div>
  );
}
