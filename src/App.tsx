import React, { useState, useEffect } from 'react';
import { Home, BarChart2, Settings, User, Play, Pause, RotateCcw, ChevronLeft, Volume2, Bell, Moon } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

// --- THEME ---
const LIGHT_COLORS = {
  bg: '#F8FAFC',
  bluePrimary: '#6C63FF',
  greenAccent: '#00C897',
  purpleAccent: '#9D4EDD',
  white: '#FFFFFF',
  textMain: '#1A1E23',
  textSub: '#6E7A89',
  cardBg: '#FFFFFF',
};

const DARK_COLORS = {
  bg: '#1A1E23',
  bluePrimary: '#8B82FF',
  greenAccent: '#00E5A0',
  purpleAccent: '#B76EF5',
  white: '#2D3238',
  textMain: '#FFFFFF',
  textSub: '#B0B8C1',
  cardBg: '#2D3238',
};

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
    // Already studied today, keep streak
    return stored.streak;
  }

  const lastDate = stored.lastStudyDate ? new Date(stored.lastStudyDate) : null;
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  let newStreak;
  if (!lastDate || lastDate.toDateString() === yesterday.toDateString()) {
    // Consecutive day or first time
    newStreak = stored.streak + 1;
  } else {
    // Streak broken
    newStreak = 1;
  }

  localStorage.setItem('studyStreak', JSON.stringify({
    streak: newStreak,
    lastStudyDate: today
  }));

  return newStreak;
};

// --- COMPONENTS ---

// 1. Bouncy Button (Web Version)
const BouncyBtn = ({ text, icon: Icon, color, onClick, small }: {
  text?: string;
  icon?: LucideIcon;
  color: string;
  onClick: () => void;
  small?: boolean;
}) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.95, translateY: 2 }}
    onClick={onClick}
    style={{
      backgroundColor: color,
      width: small ? 'auto' : '100%',
      padding: small ? '12px 24px' : '18px',
      borderRadius: '30px',
      border: 'none',
      borderBottom: '4px solid rgba(0,0,0,0.1)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      color: 'white',
      fontWeight: 'bold',
      fontSize: small ? '14px' : '18px',
      marginBottom: '8px',
      fontFamily: 'Segoe UI, sans-serif',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      transition: 'background-color 0.2s'
    }}
  >
    {Icon && <Icon size={small ? 18 : 24} style={{ marginRight: text ? 8 : 0 }} />}
    {text}
  </motion.button>
);

// 2. Animated Progress Ring (Web Version)
const CircularTimer = ({ totalSeconds, isRunning, colors }: { totalSeconds: number; isRunning: boolean; colors: typeof LIGHT_COLORS }) => {
  const size = 280;
  const strokeWidth = 12;
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
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {/* Background Track */}
        <circle cx={size/2} cy={size/2} r={radius} stroke="#E0E0E0" strokeWidth={strokeWidth} fill="none" />
        {/* Animated Progress Path */}
        <motion.circle
          cx={size/2} cy={size/2} r={radius}
          stroke={colors.bluePrimary}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          animate={{ strokeDashoffset: dashOffset }}
          strokeLinecap="round"
          transition={{ duration: 1, ease: "linear" }}
          filter="url(#glow)"
        />
      </svg>
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
        <h1 style={{ fontSize: '64px', margin: 0, color: colors.textMain, fontFamily: 'monospace', fontWeight: 'bold' }}>
          {formatTime(timeLeft)}
        </h1>
      </div>
    </div>
  );
};

// 3. Fire Streak Badge
const FireStreakBadge = ({ streak }: { streak: number }) => (
  <motion.div
    initial={{ scale: 0 }}
    animate={{ scale: 1 }}
    transition={{ type: "spring", duration: 0.5 }}
    style={{
      background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)',
      padding: '16px 24px',
      borderRadius: '24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 8px 20px rgba(255, 107, 107, 0.3)',
      marginBottom: '20px'
    }}
  >
    <span style={{ fontSize: '32px', marginRight: '12px' }}>🔥</span>
    <div style={{ textAlign: 'left' }}>
      <div style={{ color: 'white', fontSize: '28px', fontWeight: 'bold', lineHeight: 1 }}>
        {streak}
      </div>
      <div style={{ color: 'rgba(255,255,255,0.9)', fontSize: '12px', fontWeight: '600' }}>
        DAY STREAK
      </div>
    </div>
  </motion.div>
);

// 4. Hand-Drawn Chart (Web Version)
const SketchyBarChart = ({ colors }: { colors: typeof LIGHT_COLORS }) => {
  const data = [35, 50, 30, 45, 65, 55, 25];
  const height = 150;
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: height, padding: '0 10px' }}>
      {data.map((val, i) => (
        <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '12%' }}>
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: `${(val / 70) * 100}%` }}
            transition={{ type: 'spring', delay: i * 0.1 }}
            style={{
              width: '100%',
              backgroundColor: i % 2 === 0 ? '#CDEBC4' : '#E3DFFD',
              borderRadius: '8px 8px 4px 4px',
              border: '2px solid rgba(0,0,0,0.05)'
            }}
          />
          <span style={{ fontSize: '12px', color: colors.textSub, marginTop: '4px', fontFamily: 'sans-serif' }}>
            {['S','M','T','W','T','F','S'][i]}
          </span>
        </div>
      ))}
    </div>
  );
};

// --- MAIN APP ---
export default function App() {
  const [activeTab, setActiveTab] = useState('Timer');
  const [isRunning, setIsRunning] = useState(false);
  const [fireStreak, setFireStreak] = useState(getStoredStreak().streak);
  const [isDarkMode, setIsDarkMode] = useState(getDarkMode());

  // Get colors based on dark mode
  const COLORS = isDarkMode ? DARK_COLORS : LIGHT_COLORS;

  // Toggle dark mode
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

  const containerStyle: React.CSSProperties = {
    maxWidth: '480px', margin: '0 auto', minHeight: '100vh',
    backgroundColor: COLORS.bg, fontFamily: 'Segoe UI, sans-serif', position: 'relative', paddingBottom: '100px',
    overflow: 'hidden'
  };

  const renderContent = () => {
    if (activeTab === 'Timer') return (
      <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        style={{ padding: '24px', textAlign: 'center' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px', alignItems: 'flex-start' }}>
          <div style={{ textAlign: 'left' }}>
            <div style={{ color: COLORS.textSub, fontSize: '16px' }}>Good morning,</div>
            <h2 style={{ margin: 0, fontSize: '32px', color: COLORS.textMain, fontWeight: '800' }}>Focus Time</h2>
          </div>
          <Settings color={COLORS.textMain} style={{ background: COLORS.cardBg, padding: 8, borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }} />
        </div>

        {/* Fire Streak Badge */}
        <FireStreakBadge streak={fireStreak} />

        <CircularTimer totalSeconds={1500} isRunning={isRunning} colors={COLORS} />

        <div style={{ margin: '40px 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <img src="https://img.icons8.com/doodle/96/sprout.png" alt="Mascot" width="100" />
          <div style={{ background: COLORS.cardBg, padding: '6px 16px', borderRadius: '16px', marginTop: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', fontSize: '14px', fontWeight: 'bold', color: COLORS.textMain }}>
            Sprout Stage 1
          </div>
        </div>

        {!isRunning ? (
          <BouncyBtn text="Start Focus" color={COLORS.bluePrimary} icon={Play} onClick={() => setIsRunning(true)} />
        ) : (
          <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
            <BouncyBtn text="Pause" color={COLORS.purpleAccent} icon={Pause} onClick={() => setIsRunning(false)} />
            <div style={{ display: 'flex', gap: '10px' }}>
              <BouncyBtn small text="Complete Session" color={COLORS.greenAccent} onClick={handleCompleteSession} />
              <BouncyBtn small color={COLORS.textSub} icon={RotateCcw} onClick={() => setIsRunning(false)} />
            </div>
          </div>
        )}
      </motion.div>
    );

    if (activeTab === 'Stats') return (
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
          <ChevronLeft color={COLORS.textMain} />
          <h2 style={{ margin: '0 0 0 16px', fontSize: '28px', color: COLORS.textMain }}>Stats</h2>
        </div>

        {/* Fire Streak in Stats */}
        <FireStreakBadge streak={fireStreak} />

        <div style={{ background: COLORS.cardBg, padding: '24px', borderRadius: '32px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', marginBottom: '20px' }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '20px', color: COLORS.textMain }}>Study Time</h3>
          <SketchyBarChart colors={COLORS} />
        </div>
        <div style={{ background: COLORS.bluePrimary, padding: '20px', borderRadius: '24px', display: 'flex', alignItems: 'center', color: 'white' }}>
          <div style={{ background: 'rgba(255,255,255,0.2)', padding: '12px', borderRadius: '50%', marginRight: '16px' }}>
            <User color="white" />
          </div>
          <span style={{ fontSize: '18px', fontWeight: 'bold' }}>Level Up soon!</span>
        </div>
      </motion.div>
    );

    if (activeTab === 'Avatar') return (
        <div style={{ padding: '24px', textAlign: 'center', paddingTop: '100px' }}>
            <img src="https://img.icons8.com/doodle/96/happy.png" width="120" style={{marginBottom: 20}} />
            <h2 style={{color: COLORS.textMain}}>Break Time!</h2>
            <p style={{color: COLORS.textSub}}>Take a deep breath.</p>
        </div>
    );

    return (
        <div style={{ padding: '24px' }}>
            <h2 style={{ color: COLORS.textMain }}>Settings</h2>
            <div style={{ background: COLORS.cardBg, padding: '10px', borderRadius: '20px', marginTop: 20 }}>
                {[
                    { icon: Volume2, label: 'Sound', enabled: false, toggle: () => {} },
                    { icon: Bell, label: 'Notifications', enabled: false, toggle: () => {} },
                    { icon: Moon, label: 'Dark Mode', enabled: isDarkMode, toggle: toggleDarkMode }
                ].map((item, i) => (
                    <div
                        key={i}
                        onClick={item.toggle}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: '16px',
                            borderBottom: i !== 2 ? `1px solid ${isDarkMode ? '#3a3f47' : '#f0f0f0'}` : 'none',
                            cursor: 'pointer'
                        }}
                    >
                        <item.icon size={20} color={COLORS.textMain} />
                        <span style={{ marginLeft: 16, flex: 1, fontWeight: '500', color: COLORS.textMain }}>{item.label}</span>
                        <motion.div
                            style={{
                                width: 40,
                                height: 24,
                                background: item.enabled ? COLORS.greenAccent : '#E0E0E0',
                                borderRadius: 20,
                                position: 'relative',
                                transition: 'background-color 0.3s'
                            }}
                        >
                            <motion.div
                                animate={{ left: item.enabled ? 18 : 2 }}
                                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                style={{
                                    width: 20,
                                    height: 20,
                                    background: 'white',
                                    borderRadius: '50%',
                                    position: 'absolute',
                                    top: 2,
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                                }}
                            />
                        </motion.div>
                    </div>
                ))}
            </div>
        </div>
    );
  };

  return (
    <div style={containerStyle}>
      {renderContent()}

      {/* Tab Bar */}
      <div style={{
        position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
        width: '100%', maxWidth: '480px', background: COLORS.cardBg,
        borderRadius: '32px 32px 0 0', boxShadow: '0 -5px 20px rgba(0,0,0,0.05)',
        display: 'flex', justifyContent: 'space-around', padding: '16px 16px 24px 16px', zIndex: 100
      }}>
        {['Timer', 'Stats', 'Avatar', 'Settings'].map(tab => {
            const isActive = activeTab === tab;
            const Icon = { Timer: Home, Stats: BarChart2, Avatar: User, Settings: Settings }[tab] as LucideIcon;
            return (
              <div key={tab} onClick={() => setActiveTab(tab)} style={{ cursor: 'pointer', opacity: isActive ? 1 : 0.4, transition: '0.2s' }}>
                <Icon color={isActive ? COLORS.bluePrimary : COLORS.textMain} size={28} strokeWidth={isActive ? 2.5 : 2} />
              </div>
            );
        })}
      </div>
    </div>
  );
}
