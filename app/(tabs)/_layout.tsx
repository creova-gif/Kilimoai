import React from 'react';
import { Tabs } from 'expo-router';
import { Platform, StyleSheet, View } from 'react-native';
import { LayoutDashboard, CloudRain, LayoutGrid, User } from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import { useTheme } from '../../constants/Theme';

export default function TabLayout() {
  const { colors, isDark } = useTheme();
  
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: isDark ? '#707070' : '#9a9a9a',
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          borderTopWidth: 0,
          elevation: 0,
          height: Platform.OS === 'ios' ? 88 : 72,
          paddingBottom: Platform.OS === 'ios' ? 32 : 16,
          paddingTop: 12,
          backgroundColor: Platform.OS === 'ios' ? 'transparent' : colors.card,
        },
        tabBarBackground: () => 
          Platform.OS === 'ios' ? (
            <BlurView intensity={isDark ? 50 : 80} tint={isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />
          ) : (
            <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.card, borderTopWidth: 1, borderTopColor: colors.border }]} />
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
          title: 'HUB',
          tabBarIcon: ({ color, size }) => <LayoutDashboard color={color} size={size - 2} strokeWidth={2.5} />,
        }}
      />
      <Tabs.Screen
        name="forecast"
        options={{
          title: 'CLIMATE',
          tabBarIcon: ({ color, size }) => <CloudRain color={color} size={size - 2} strokeWidth={2.5} />,
        }}
      />
      <Tabs.Screen
        name="features"
        options={{
          title: 'FEATURES',
          tabBarIcon: ({ color, size }) => <LayoutGrid color={color} size={size - 2} strokeWidth={2.5} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'NEXUS',
          tabBarIcon: ({ color, size }) => <User color={color} size={size - 2} strokeWidth={2.5} />,
        }}
      />
    </Tabs>
  );
}
