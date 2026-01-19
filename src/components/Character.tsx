import React from 'react';
import { CHARACTER_STAGES } from '../types';

interface CharacterProps {
  stage: number;
  className?: string;
}

const Character: React.FC<CharacterProps> = ({ stage, className = '' }) => {
  const currentStage = CHARACTER_STAGES[stage - 1] || CHARACTER_STAGES[0];
  const size = 60 + (stage - 1) * 20; // Size increases with stage

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div
        className="rounded-full flex items-center justify-center transition-all duration-500 shadow-soft"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          backgroundColor: currentStage.color,
        }}
      >
        {/* Sprout illustration */}
        {stage === 1 && (
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <ellipse cx="20" cy="28" rx="12" ry="8" fill="#8FA88F" opacity="0.6" />
            <circle cx="20" cy="20" r="10" fill="#A5C5A5" />
            <path d="M20 10 Q15 8 15 15 L20 20" fill="#7DB87D" />
            <path d="M20 10 Q25 8 25 15 L20 20" fill="#7DB87D" />
            <circle cx="18" cy="19" r="2" fill="#4A4A4A" opacity="0.8" />
            <circle cx="22" cy="19" r="2" fill="#4A4A4A" opacity="0.8" />
            <circle cx="18.5" cy="18.5" r="0.8" fill="white" />
            <circle cx="22.5" cy="18.5" r="0.8" fill="white" />
          </svg>
        )}

        {/* Seedling illustration */}
        {stage === 2 && (
          <svg width="50" height="50" viewBox="0 0 50 50" fill="none">
            <ellipse cx="25" cy="35" rx="14" ry="9" fill="#7DA87D" opacity="0.6" />
            <circle cx="25" cy="26" r="12" fill="#95B595" />
            <path d="M25 12 Q18 10 18 18 L25 26" fill="#6DAC6D" />
            <path d="M25 12 Q32 10 32 18 L25 26" fill="#6DAC6D" />
            <path d="M25 12 Q23 6 20 10 L23 16" fill="#7DB87D" />
            <path d="M25 12 Q27 6 30 10 L27 16" fill="#7DB87D" />
            <circle cx="23" cy="25" r="2.2" fill="#4A4A4A" opacity="0.8" />
            <circle cx="27" cy="25" r="2.2" fill="#4A4A4A" opacity="0.8" />
            <circle cx="23.6" cy="24.4" r="0.9" fill="white" />
            <circle cx="27.6" cy="24.4" r="0.9" fill="white" />
            <path d="M25 28 Q23 29 25 30 Q27 29 25 28" fill="#F4A4A4" opacity="0.6" />
          </svg>
        )}

        {/* Young Plant illustration */}
        {stage === 3 && (
          <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
            <ellipse cx="30" cy="45" rx="16" ry="10" fill="#6D986D" opacity="0.6" />
            <circle cx="30" cy="32" r="14" fill="#85A585" />
            <path d="M30 14 Q22 12 22 22 L30 32" fill="#5D9C5D" />
            <path d="M30 14 Q38 12 38 22 L30 32" fill="#5D9C5D" />
            <path d="M30 14 Q26 6 22 11 L26 20" fill="#6DAC6D" />
            <path d="M30 14 Q34 6 38 11 L34 20" fill="#6DAC6D" />
            <path d="M22 22 Q18 20 18 26 L22 30" fill="#7DB87D" />
            <path d="M38 22 Q42 20 42 26 L38 30" fill="#7DB87D" />
            <circle cx="28" cy="31" r="2.5" fill="#4A4A4A" opacity="0.8" />
            <circle cx="32" cy="31" r="2.5" fill="#4A4A4A" opacity="0.8" />
            <circle cx="28.7" cy="30.3" r="1" fill="white" />
            <circle cx="32.7" cy="30.3" r="1" fill="white" />
            <path d="M30 34 Q28 35 30 36.5 Q32 35 30 34" fill="#F4A4A4" opacity="0.7" />
            <circle cx="26" cy="28" r="1.5" fill="#FFB4B4" opacity="0.6" />
            <circle cx="34" cy="28" r="1.5" fill="#FFB4B4" opacity="0.6" />
          </svg>
        )}

        {/* Blooming illustration */}
        {stage === 4 && (
          <svg width="70" height="70" viewBox="0 0 70 70" fill="none">
            <ellipse cx="35" cy="55" rx="18" ry="11" fill="#5D885D" opacity="0.6" />
            <circle cx="35" cy="38" r="16" fill="#75957 5" />
            <path d="M35 18 Q26 16 26 28 L35 38" fill="#4D8C4D" />
            <path d="M35 18 Q44 16 44 28 L35 38" fill="#4D8C4D" />
            <path d="M35 18 Q30 8 25 14 L30 25" fill="#5D9C5D" />
            <path d="M35 18 Q40 8 45 14 L40 25" fill="#5D9C5D" />
            <path d="M26 28 Q20 26 20 34 L26 36" fill="#6DAC6D" />
            <path d="M44 28 Q50 26 50 34 L44 36" fill="#6DAC6D" />

            {/* Flower petals */}
            <circle cx="35" cy="15" r="4" fill="#FFB4D4" />
            <circle cx="30" cy="17" r="4" fill="#FFB4D4" opacity="0.8" />
            <circle cx="40" cy="17" r="4" fill="#FFB4D4" opacity="0.8" />
            <circle cx="32" cy="12" r="4" fill="#FFB4D4" opacity="0.9" />
            <circle cx="38" cy="12" r="4" fill="#FFB4D4" opacity="0.9" />
            <circle cx="35" cy="13" r="3" fill="#FFD4A4" />

            <circle cx="33" cy="37" r="2.8" fill="#4A4A4A" opacity="0.8" />
            <circle cx="37" cy="37" r="2.8" fill="#4A4A4A" opacity="0.8" />
            <circle cx="33.8" cy="36.2" r="1.1" fill="white" />
            <circle cx="37.8" cy="36.2" r="1.1" fill="white" />
            <path d="M35 40 Q33 41.5 35 43 Q37 41.5 35 40" fill="#F4A4A4" opacity="0.8" />
            <circle cx="30" cy="34" r="2" fill="#FFB4B4" opacity="0.7" />
            <circle cx="40" cy="34" r="2" fill="#FFB4B4" opacity="0.7" />
          </svg>
        )}
      </div>
      <p className="mt-3 text-sm font-medium text-text-primary">{currentStage.name} Stage {stage}</p>
    </div>
  );
};

export default Character;
