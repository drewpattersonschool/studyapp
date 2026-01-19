import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const JournalScreen: React.FC = () => {
  const { getGradientClass } = useTheme();

  return (
    <div className={`min-h-screen ${getGradientClass()} transition-all duration-700 pb-20 px-6 pt-8`}>
      {/* Header */}
      <div className="flex items-center mb-8">
        <h1 className="text-2xl font-semibold text-text-primary">Study Journal</h1>
      </div>

      {/* Coming Soon Card */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-soft text-center">
        <div className="text-6xl mb-4">📚</div>
        <h2 className="text-xl font-semibold text-text-primary mb-2">Coming Soon</h2>
        <p className="text-text-secondary">
          Track your study notes and reflections here
        </p>
      </div>

      {/* Feature Preview */}
      <div className="mt-6 space-y-4">
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 shadow-soft">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-pastel-blue flex items-center justify-center">
              <svg className="w-5 h-5 text-text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <div>
              <h3 className="font-medium text-text-primary">Daily Notes</h3>
              <p className="text-sm text-text-secondary">Record what you learned</p>
            </div>
          </div>
        </div>

        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 shadow-soft">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-pastel-purple flex items-center justify-center">
              <svg className="w-5 h-5 text-text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h3 className="font-medium text-text-primary">Study Goals</h3>
              <p className="text-sm text-text-secondary">Set and track your goals</p>
            </div>
          </div>
        </div>

        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 shadow-soft">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-pastel-green flex items-center justify-center">
              <svg className="w-5 h-5 text-text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-medium text-text-primary">Session History</h3>
              <p className="text-sm text-text-secondary">Review past study sessions</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JournalScreen;
