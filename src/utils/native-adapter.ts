
import { Capacitor } from "@capacitor/core";
import { Haptics, ImpactStyle } from "@capacitor/haptics";
import { StatusBar, Style } from "@capacitor/status-bar";
import { NativeBiometric } from "capacitor-native-biometric";

/**
 * NativeAdapter
 * Bridges the gap between Capacitor (Native Shell) and Expo (WebView Shell)
 */
export const NativeAdapter = {
  isNative: () => Capacitor.isNativePlatform() || (window as any).ReactNativeWebView !== undefined,
  
  isExpo: () => (window as any).ReactNativeWebView !== undefined,
  
  isCapacitor: () => Capacitor.isNativePlatform(),

  /**
   * Haptics
   */
  haptics: async (style: ImpactStyle = ImpactStyle.Medium) => {
    if (NativeAdapter.isCapacitor()) {
      await Haptics.impact({ style });
    } else if (NativeAdapter.isExpo()) {
      (window as any).ReactNativeWebView.postMessage(JSON.stringify({
        type: 'HAPTICS',
        style: style === ImpactStyle.Heavy ? 'HEAVY' : style === ImpactStyle.Light ? 'LIGHT' : 'MEDIUM'
      }));
    }
  },

  /**
   * Status Bar
   */
  setStatusBar: async (style: Style = Style.Default) => {
    if (NativeAdapter.isCapacitor()) {
      await StatusBar.setStyle({ style });
    } else if (NativeAdapter.isExpo()) {
      (window as any).ReactNativeWebView.postMessage(JSON.stringify({
        type: 'STATUS_BAR',
        style: style === Style.Dark ? 'DARK' : style === Style.Light ? 'LIGHT' : 'DEFAULT'
      }));
    }
  },

  /**
   * Biometrics
   */
  verifyIdentity: async (options: { reason: string; title: string }) => {
    if (NativeAdapter.isCapacitor()) {
      const availability = await NativeBiometric.isAvailable();
      if (availability.isAvailable) {
        return await NativeBiometric.verifyIdentity({
          reason: options.reason,
          title: options.title,
          subtitle: "Identity Verification",
          description: "Confirm your identity to continue"
        });
      }
      return false;
    } else if (NativeAdapter.isExpo()) {
      // In Expo Go, we'll request the parent app to handle it
      return new Promise((resolve) => {
        const handler = (event: MessageEvent) => {
          try {
            const data = JSON.parse(event.data);
            if (data.type === 'BIOMETRIC_RESULT') {
              window.removeEventListener('message', handler);
              resolve(data.success);
            }
          } catch (e) {}
        };
        window.addEventListener('message', handler);
        (window as any).ReactNativeWebView.postMessage(JSON.stringify({
          type: 'BIOMETRIC_REQUEST',
          ...options
        }));
      });
    }
    return true; // Mock success on web
  }
};
