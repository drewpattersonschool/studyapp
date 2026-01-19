import React, { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { useUserData } from '../hooks/useUserData';
import type { ThemeColor } from '../types';

interface ThemeContextType {
  theme: ThemeColor;
  setTheme: (theme: ThemeColor) => void;
  getGradientClass: () => string;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { userData, updateSettings } = useUserData();

  const setTheme = (theme: ThemeColor) => {
    updateSettings({ selectedTheme: theme });
  };

  const getGradientClass = () => {
    switch (userData.settings.selectedTheme) {
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
        return 'gradient-bg-blue';
    }
  };

  return (
    <ThemeContext.Provider value={{ theme: userData.settings.selectedTheme, setTheme, getGradientClass }}>
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
