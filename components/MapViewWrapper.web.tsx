import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const PROVIDER_GOOGLE = 'google' as const;
export type Region = {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
};

export function MapView({ style, children }: { style?: any; children?: React.ReactNode }) {
  return (
    <View style={[styles.stub, style]}>
      <Text style={styles.label}>🗺 Map (mobile only)</Text>
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
    backgroundColor: '#0d1f0d',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    color: 'rgba(34,209,90,0.5)',
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
  },
});
