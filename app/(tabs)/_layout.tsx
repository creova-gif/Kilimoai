import React from 'react';
import { Tabs } from 'expo-router';
import { Platform, StyleSheet, View } from 'react-native';
import { Home, Map, ClipboardList, User } from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import { useTheme } from '../../constants/Theme';
import { useKilimoStore } from '../../store/useKilimoStore';

export default function TabLayout() {
  const { colors, isDark } = useTheme();
  const language = useKilimoStore((s) => s.language);
  
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: '#5A6E85',
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          elevation: 0,
          height: Platform.OS === 'ios' ? 88 : 72,
          paddingBottom: Platform.OS === 'ios' ? 32 : 16,
          paddingTop: 12,
          backgroundColor: '#FFFFFF',
          borderTopColor: '#E2E8F0',
          borderTopWidth: 1,
        },
        tabBarBackground: () => (
          <View style={[StyleSheet.absoluteFill, { backgroundColor: '#FFFFFF' }]} />
        ),
        tabBarLabelStyle: {
          fontFamily: 'Inter_700Bold',
          fontSize: 10,
          textTransform: 'uppercase',
          letterSpacing: 0.5,
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: language === 'sw' ? 'NYUMBANI' : 'HOME',
          tabBarIcon: ({ color, size }) => <Home color={color} size={size - 2} strokeWidth={2} />,
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: language === 'sw' ? 'RAMANI VRA' : 'VRA MAP',
          tabBarIcon: ({ color, size }) => <Map color={color} size={size - 2} strokeWidth={2} />,
        }}
      />
      <Tabs.Screen
        name="farm"
        options={{
          title: language === 'sw' ? 'KUMBUKUMBU' : 'TRACK RECORDS',
          tabBarIcon: ({ color, size }) => <ClipboardList color={color} size={size - 2} strokeWidth={2} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: language === 'sw' ? 'WASIFU' : 'PROFILE',
          tabBarIcon: ({ color, size }) => <User color={color} size={size - 2} strokeWidth={2} />,
        }}
      />
      <Tabs.Screen
        name="ai"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="market"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="features"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
