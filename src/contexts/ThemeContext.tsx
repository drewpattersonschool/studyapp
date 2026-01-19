import React, { createContext, useContext, useMemo } from 'react';
import type { ReactNode } from 'react';
import { useUserData } from '../hooks/useUserData';
import type { ThemeColor } from '../types';

interface ThemeContextType {
  theme: ThemeColor;
  setTheme: (theme: ThemeColor) => void;
  getGradientClass: () => string;
  gradientClass: string;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { userData, updateSettings } = useUserData();
  const currentTheme = userData.settings.selectedTheme;

  const setTheme = (theme: ThemeColor) => {
    updateSettings({ selectedTheme: theme });
  };

  const gradientClass = useMemo(() => {
    switch (currentTheme) {
      case 'blue':
        return 'gradient-bg-blue';
      case 'green':
        return 'gradient-bg-green';
      case 'purple':
        return 'gradient-bg-purple';
      case 'peach':
        return 'gradient-bg-peach';
      case 'beige':
        return 'gradient-bg-beige';
      default:
        return 'gradient-bg-purple';
    }
  }, [currentTheme]);

  const getGradientClass = () => gradientClass;

  const value = useMemo(
    () => ({ theme: currentTheme, setTheme, getGradientClass, gradientClass }),
    [currentTheme, gradientClass]
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
