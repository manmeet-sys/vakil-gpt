
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.0eb8ca5a194240b49b918482c56a4938',
  appName: 'vakil-gpt',
  webDir: 'dist',
  server: {
    url: 'https://0eb8ca5a-1942-40b4-9b91-8482c56a4938.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: "#f0f9ff",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: true,
      spinnerColor: "#3b82f6",
      spinnerStyle: "large",
      splashFullScreen: true,
      splashImmersive: true
    }
  }
};

export default config;
