import React from 'react';
import { Tabs } from 'expo-router';
import { Platform, StyleSheet, View, Text } from 'react-native';
import { LayoutDashboard, CloudRain, LayoutGrid, User } from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../constants/Theme';

function TabBackground({ isDark }: { isDark: boolean }) {
  return (
    <View style={[StyleSheet.absoluteFill, tb.wrap]}>
      <BlurView
        intensity={isDark ? 80 : 90}
        tint={isDark ? 'dark' : 'light'}
        style={StyleSheet.absoluteFill}
      />
      <LinearGradient
        colors={isDark
          ? ['rgba(15,23,42,0.6)', 'rgba(2,6,23,0.7)']
          : ['rgba(255,255,255,0.75)', 'rgba(248,250,252,0.85)']}
        style={StyleSheet.absoluteFill}
      />
      <View style={[StyleSheet.absoluteFill, tb.border]} />
    </View>
  );
}

function TabIcon({ icon: Icon, color, focused, label, isDark }: {
  icon: any; color: string; focused: boolean; label: string; isDark: boolean;
}) {
  return (
    <View style={[ti.wrap, focused && ti.wrapActive]}>
      {focused && (
        <View style={[ti.glow, { shadowColor: '#3ecf8e' }]} />
      )}
      <Icon
        color={focused ? '#3ecf8e' : isDark ? '#52525b' : '#a1a1aa'}
        size={22}
        strokeWidth={focused ? 2.5 : 2}
      />
    </View>
  );
}

export default function TabLayout() {
  const { colors, isDark } = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#3ecf8e',
        tabBarInactiveTintColor: isDark ? '#52525b' : '#a1a1aa',
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: Platform.OS === 'ios' ? 28 : 20,
          left: 20,
          right: 20,
          borderRadius: 30,
          height: 66,
          borderTopWidth: 0,
          elevation: 0,
          backgroundColor: 'transparent',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 12 },
          shadowOpacity: isDark ? 0.5 : 0.15,
          shadowRadius: 28,
        },
        tabBarBackground: () => <TabBackground isDark={isDark} />,
        tabBarItemStyle: {
          paddingVertical: 8,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon icon={LayoutDashboard} color={color} focused={focused} label="HUB" isDark={isDark} />
          ),
        }}
      />
      <Tabs.Screen
        name="forecast"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon icon={CloudRain} color={color} focused={focused} label="CLIMATE" isDark={isDark} />
          ),
        }}
      />
      <Tabs.Screen
        name="features"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon icon={LayoutGrid} color={color} focused={focused} label="FEATURES" isDark={isDark} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon icon={User} color={color} focused={focused} label="PROFAILI" isDark={isDark} />
          ),
        }}
      />
    </Tabs>
  );
}

const tb = StyleSheet.create({
  wrap: { borderRadius: 30, overflow: 'hidden' },
  border: { borderRadius: 30, borderWidth: 1, borderColor: 'rgba(255,255,255,0.10)' },
});

const ti = StyleSheet.create({
  wrap: { width: 48, height: 48, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  wrapActive: { backgroundColor: 'rgba(62,207,142,0.12)' },
  glow: {
    position: 'absolute', width: 48, height: 48, borderRadius: 16,
    shadowOpacity: 0.4, shadowRadius: 12, shadowOffset: { width: 0, height: 0 },
  },
});
