import React, { useState, useRef } from 'react';
import { StyleSheet, View, SafeAreaView, StatusBar, ActivityIndicator, Text, Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import * as Haptics from 'expo-haptics';
import * as LocalAuthentication from 'expo-local-authentication';
import { setStatusBarStyle } from 'expo-status-bar';

export default function App() {
  const [loading, setLoading] = useState(true);
  const webviewRef = useRef(null);

  // 🚀 CONFIGURATION: Point this to your local Vite server IP for Expo Go development
  // You can find your IP by running `ipconfig getifaddr en0` or `ifconfig`
  const DEV_URL = 'http://192.168.68.108:5173'; 
  const PROD_URL = 'https://kilimo-ai.replit.app';

  // Expo's __DEV__ flag determines which URL to use
  const REPL_URL = __DEV__ ? DEV_URL : PROD_URL;

  console.log(`[KilimoAI] Loading: ${REPL_URL} (${__DEV__ ? 'DEV' : 'PROD'})`);

  const handleMessage = async (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      console.log('📱 [NATIVE BRIDGE] Message received:', data.type);

      switch (data.type) {
        case 'HAPTICS':
          if (data.style === 'HEAVY') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          else if (data.style === 'LIGHT') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          else Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          break;

        case 'STATUS_BAR':
          if (data.style === 'DARK') setStatusBarStyle('dark');
          else if (data.style === 'LIGHT') setStatusBarStyle('light');
          else setStatusBarStyle('auto');
          break;

        case 'BIOMETRIC_REQUEST':
          const result = await LocalAuthentication.authenticateAsync({
            promptMessage: data.reason || 'Confirm Identity',
          });
          webviewRef.current?.postMessage(JSON.stringify({
            type: 'BIOMETRIC_RESULT',
            success: result.success
          }));
          break;

        default:
          console.warn('Unhandled message type:', data.type);
      }
    } catch (e) {
      console.error('Bridge error:', e);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.content}>
        <WebView 
          ref={webviewRef}
          source={{ uri: REPL_URL }}
          style={styles.webview}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          onLoadStart={() => setLoading(true)}
          onLoadEnd={() => setLoading(false)}
          onMessage={handleMessage}
          scalesPageToFit={true}
          allowsBackForwardNavigationGestures={true}
        />
        {loading && (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#2E7D32" />
            <Text style={styles.loaderText}>Inapakia Kilimo AI...</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    position: 'relative',
  },
  webview: {
    flex: 1,
  },
  loaderContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  loaderText: {
    marginTop: 12,
    fontSize: 16,
    color: '#2E7D32',
    fontWeight: '600',
  },
});
