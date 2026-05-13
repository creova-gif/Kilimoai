import { Platform } from 'react-native';
import * as Device from 'expo-device';

// In production, this should be your deployed URL
// In development, it points to your local machine IP
const DEV_URL = 'http://192.168.68.108:5173'; // Update this if your IP changes
const PROD_URL = 'https://kilimo-ai.vercel.app'; // Placeholder - update with real URL

export const getAppUrl = () => {
  if (__DEV__) {
    return DEV_URL;
  }
  return PROD_URL;
};

export const getNativeMetadata = () => {
  return {
    platform: Platform.OS,
    version: Platform.Version,
    isDevice: Device.isDevice,
    brand: Device.brand,
    modelName: Device.modelName,
  };
};

export const INJECTED_JAVASCRIPT = `
  window.isNativeApp = true;
  window.nativePlatform = "${Platform.OS}";
  window.nativeMetadata = ${JSON.stringify(getNativeMetadata())};
  true; // note: this is required for the script to execute correctly
`;
