
import { isPlatform } from '@capacitor/core';

export const DeviceService = {
  /**
   * Check if the app is running on a mobile device
   */
  isMobile(): boolean {
    return isPlatform('ios') || isPlatform('android');
  },
  
  /**
   * Check if the app is running on iOS
   */
  isIOS(): boolean {
    return isPlatform('ios');
  },
  
  /**
   * Check if the app is running on Android
   */
  isAndroid(): boolean {
    return isPlatform('android');
  },
  
  /**
   * Check if the app is running in a web browser
   */
  isWeb(): boolean {
    return isPlatform('web');
  },
  
  /**
   * Get the platform name
   */
  getPlatform(): string {
    if (this.isIOS()) return 'ios';
    if (this.isAndroid()) return 'android';
    return 'web';
  }
};
