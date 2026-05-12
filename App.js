import React, { useState } from 'react';
import { StyleSheet, View, SafeAreaView, StatusBar, ActivityIndicator, Text } from 'react-native';
import { WebView } from 'react-native-webview';

export default function App() {
  const [loading, setLoading] = useState(true);

  // Replace this with your actual Replit URL for physical device testing
  // You can find it in the Replit address bar (e.g., https://kilimoai.justinmafie.repl.co)
  const REPL_URL = 'https://kilimoai.justinmafie.repl.co'; 
  const DEV_SERVER_URL = 'http://0.0.0.0:5173';

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.content}>
        <WebView 
          source={{ uri: DEV_SERVER_URL }}
          style={styles.webview}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          onLoadStart={() => setLoading(true)}
          onLoadEnd={() => setLoading(false)}
          scalesPageToFit={true}
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
