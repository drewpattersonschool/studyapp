import { useState, useEffect, useCallback } from 'react';
import type { UserData, UserSettings } from '../types';
import { getUserData, updateSettings as updateStorageSettings, addCompletedSession } from '../utils/storage';

interface UseUserDataReturn {
  userData: UserData;
  updateSettings: (settings: Partial<UserSettings>) => void;
  completeSession: (minutes: number) => void;
  refreshData: () => void;
}

export const useUserData = (): UseUserDataReturn => {
  const [userData, setUserData] = useState<UserData>(getUserData());

  const refreshData = useCallback(() => {
    setUserData(getUserData());
  }, []);

  useEffect(() => {
    // Refresh data when component mounts
    refreshData();
  }, [refreshData]);

  const updateSettings = useCallback((settings: Partial<UserSettings>) => {
    updateStorageSettings(settings);
    refreshData();
  }, [refreshData]);

  const completeSession = useCallback((minutes: number) => {
    const newData = addCompletedSession(minutes);
    setUserData(newData);
  }, []);

  return {
    userData,
    updateSettings,
    completeSession,
    refreshData,
  };
};
