import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTimer } from '../hooks/useTimer';
import { useUserData } from '../hooks/useUserData';
import { useTheme } from '../contexts/ThemeContext';
import Character from '../components/Character';
import type { TimerMode } from '../types';
import { getWeeklyMinutes } from '../utils/storage';

const TimerScreen: React.FC = () => {
  const navigate = useNavigate();
  const { userData, completeSession, updateSettings } = useUserData();
  const { getGradientClass } = useTheme();
  const [timerMode, setTimerMode] = useState<TimerMode>('study');
  const [showCelebration, setShowCelebration] = useState(false);
  const [weeklyMinutes, setWeeklyMinutes] = useState(0);
  const [customDuration, setCustomDuration] = useState(userData.settings.studyDuration);
  const [isDragging, setIsDragging] = useState(false);
  const circleRef = useRef<SVGSVGElement>(null);

  const getDuration = () => {
    switch (timerMode) {
      case 'study':
        return customDuration;
      case 'shortBreak':
        return userData.settings.shortBreakDuration;
      case 'longBreak':
        return userData.settings.longBreakDuration;
    }
  };

  const handleTimerComplete = () => {
    if (timerMode === 'study') {
      completeSession(customDuration);
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3000);

      // Auto switch to break
      setTimeout(() => {
        setTimerMode('shortBreak');
        timer.reset(userData.settings.shortBreakDuration);
      }, 3000);
    } else {
      // Break complete, switch back to study
      setTimerMode('study');
      timer.reset(customDuration);
    }
  };

  const timer = useTimer({
    initialMinutes: getDuration(),
    onComplete: handleTimerComplete,
    soundEnabled: userData.settings.soundEnabled,
  });

  useEffect(() => {
    setWeeklyMinutes(getWeeklyMinutes());
  }, [userData]);

  useEffect(() => {
    if (!timer.isRunning) {
      timer.reset(getDuration());
    }
  }, [customDuration]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progressSessionToNext = () => {
    const currentStage = userData.currentStage;
    if (currentStage >= 4) return 100;

    const currentRequired = currentStage === 1 ? 0 : currentStage === 2 ? 11 : currentStage === 3 ? 26 : 51;
    const nextRequired = currentStage === 1 ? 11 : currentStage === 2 ? 26 : currentStage === 3 ? 51 : 51;

    const progress = ((userData.totalCompletedSessions - currentRequired) / (nextRequired - currentRequired)) * 100;
    return Math.min(Math.max(progress, 0), 100);
  };

  // Handle drag to adjust time
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (timer.isRunning || timerMode !== 'study') return;
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragMove = (e: MouseEvent | TouchEvent) => {
    if (!isDragging || !circleRef.current) return;
    e.preventDefault();

    const circle = circleRef.current.getBoundingClientRect();
    const centerX = circle.left + circle.width / 2;
    const centerY = circle.top + circle.height / 2;

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const angle = Math.atan2(clientY - centerY, clientX - centerX);
    const degrees = ((angle * 180) / Math.PI + 90 + 360) % 360;

    // Map 360 degrees to 5-60 minutes
    const newMinutes = Math.round(5 + (degrees / 360) * 55);
    setCustomDuration(newMinutes);
  };

  const handleDragEnd = () => {
    if (isDragging) {
      setIsDragging(false);
      // Save the custom duration to settings
      updateSettings({ studyDuration: customDuration });
    }
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleDragMove);
      window.addEventListener('touchmove', handleDragMove, { passive: false });
      window.addEventListener('mouseup', handleDragEnd);
      window.addEventListener('touchend', handleDragEnd);

      return () => {
        window.removeEventListener('mousemove', handleDragMove);
        window.removeEventListener('touchmove', handleDragMove);
        window.removeEventListener('mouseup', handleDragEnd);
        window.removeEventListener('touchend', handleDragEnd);
      };
    }
  }, [isDragging, customDuration]);

  return (
    <div className={`min-h-screen ${getGradientClass()} transition-all duration-700 pb-20 px-6 pt-8`}>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold text-text-primary">
          {timerMode === 'study' ? 'Timer' : 'Break'}
        </h1>
        <button
          onClick={() => navigate('/settings')}
          className="w-10 h-10 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center"
        >
          <svg className="w-5 h-5 text-text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>

      {/* Timer Circle */}
      <div className="flex justify-center mb-6">
        <div className="relative">
          <svg
            ref={circleRef}
            className="transform -rotate-90 cursor-pointer"
            width="280"
            height="280"
            onMouseDown={handleDragStart}
            onTouchStart={handleDragStart}
          >
            <circle
              cx="140"
              cy="140"
              r="130"
              fill="white"
              opacity="0.2"
            />
            <circle
              cx="140"
              cy="140"
              r="120"
              fill="white"
              stroke="white"
              strokeWidth="2"
              opacity="0.3"
            />
            <circle
              cx="140"
              cy="140"
              r="120"
              fill="none"
              stroke="white"
              strokeWidth="8"
              strokeDasharray={`${2 * Math.PI * 120}`}
              strokeDashoffset={`${2 * Math.PI * 120 * (1 - timer.progress / 100)}`}
              strokeLinecap="round"
              opacity="0.9"
              className="transition-all duration-1000"
            />
            {/* Drag indicator when not running */}
            {!timer.isRunning && timerMode === 'study' && (
              <>
                {/* Outer glow for visibility */}
                <circle
                  cx="140"
                  cy="20"
                  r="16"
                  fill="rgba(0,0,0,0.2)"
                  className={isDragging ? 'scale-125' : ''}
                />
                {/* Main black draggable circle */}
                <circle
                  cx="140"
                  cy="20"
                  r="12"
                  fill="#2a2a2a"
                  stroke="white"
                  strokeWidth="2"
                  className={`cursor-grab ${isDragging ? 'scale-110 cursor-grabbing' : ''}`}
                  style={{ transition: 'transform 0.2s' }}
                />
                {/* Inner white dot for visibility */}
                <circle
                  cx="140"
                  cy="20"
                  r="4"
                  fill="white"
                />
                {isDragging && (
                  <text
                    x="140"
                    y="270"
                    textAnchor="middle"
                    fill="rgba(0,0,0,0.8)"
                    fontSize="16"
                    fontWeight="700"
                    className="rotate-90"
                  >
                    {customDuration} min
                  </text>
                )}
              </>
            )}
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-6xl font-light text-text-primary">
              {formatTime(timer.timeLeft)}
            </span>
          </div>
        </div>
      </div>

      {/* Drag instruction */}
      {!timer.isRunning && timerMode === 'study' && !isDragging && (
        <div className="text-center mb-4">
          <p className="text-sm font-medium text-text-primary mb-1">
            🔄 Drag the black circle to adjust time
          </p>
          <p className="text-xs text-text-secondary">
            Spin around to set 5-60 minutes
          </p>
        </div>
      )}

      {/* Character */}
      <div className="flex justify-center mb-4">
        <button onClick={() => navigate('/avatar')} className="transition-transform hover:scale-105 active:scale-95">
          <Character stage={userData.currentStage} />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="max-w-xs mx-auto mb-2">
        <div className="h-2 bg-white/30 rounded-full overflow-hidden">
          <div
            className="h-full bg-white/70 rounded-full transition-all duration-500"
            style={{ width: `${progressSessionToNext()}%` }}
          />
        </div>
      </div>

      {/* Weekly Minutes */}
      <p className="text-center text-sm text-text-secondary mb-8">
        {weeklyMinutes} minutes this week
      </p>

      {/* Control Buttons */}
      <div className="flex justify-center gap-4 mb-6">
        {!timer.isRunning ? (
          <button
            onClick={timer.start}
            className="px-12 py-3 bg-white text-text-primary rounded-full font-medium shadow-soft hover:shadow-soft-lg transition-all duration-200 active:scale-95"
          >
            Start
          </button>
        ) : (
          <button
            onClick={timer.pause}
            className="px-12 py-3 bg-pastel-purple text-text-primary rounded-full font-medium shadow-soft hover:shadow-soft-lg transition-all duration-200 active:scale-95"
          >
            Pause
          </button>
        )}
      </div>

      {/* Skip Break Button (only show during break) */}
      {timerMode !== 'study' && (
        <div className="flex justify-center">
          <button
            onClick={() => {
              setTimerMode('study');
              timer.reset(customDuration);
            }}
            className="px-8 py-2 bg-white/50 text-text-primary rounded-full text-sm font-medium hover:bg-white/70 transition-all duration-200"
          >
            Skip Break
          </button>
        </div>
      )}

      {/* Celebration Message */}
      {showCelebration && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
          <div className="bg-white rounded-3xl px-8 py-6 shadow-soft-lg animate-bounce">
            <p className="text-2xl font-semibold text-text-primary text-center mb-2">
              Great Work! 🎉
            </p>
            <p className="text-text-secondary text-center">
              You completed a study session!
            </p>
            <p className="text-sm text-pastel-green-dark text-center mt-2 font-medium">
              +100 XP
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimerScreen;
