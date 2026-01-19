import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.studybuddy.app',
  appName: 'StudyBuddy',
  webDir: 'dist',
  server: {
    cleartext: true
  },
  ios: {
    limitsNavigationsToAppBoundDomains: false
  }
};

export default config;
