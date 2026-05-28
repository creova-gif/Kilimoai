import React from 'react';
import { View, Text, StyleSheet, Appearance } from 'react-native';

export const PROVIDER_GOOGLE = 'google' as const;
export type Region = {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
};

export function MapView({ style, children }: { style?: any; children?: React.ReactNode }) {
  const isDark = Appearance.getColorScheme() === 'dark';
  return (
    <View style={[styles.stub, { backgroundColor: isDark ? '#0d1f0d' : '#c8d6c8' }, style]}>
      <Text style={[styles.label, { color: isDark ? 'rgba(34,209,90,0.5)' : 'rgba(34,209,90,0.7)' }]}>🗺 Map (mobile only)</Text>
      {children}
    </View>
  );
}

export function Polygon(_props: any) { return null; }
export function Marker({ children }: { children?: React.ReactNode }) {
  return <>{children}</>;
}

export default MapView;

const styles = StyleSheet.create({
  stub: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
  },
});
