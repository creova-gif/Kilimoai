import React from 'react';
import { Tabs } from 'expo-router';
import { Platform, StyleSheet, View, Text } from 'react-native';
import { Home, Bot, Tractor, Store, User } from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import { useTheme } from '../../constants/Theme';
import { useKilimoStore } from '../../store/useKilimoStore';

export default function TabLayout() {
  const { colors, isDark } = useTheme();
  const language = useKilimoStore((s) => s.language);
  
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#FFFFFF',
        tabBarInactiveTintColor: isDark ? '#707D6D' : '#8C9A89',
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: Platform.OS === 'ios' ? 28 : 16,
          left: 16,
          right: 16,
          height: 68,
          borderRadius: 34,
          elevation: 6,
          shadowColor: '#1A3B14',
          shadowOpacity: 0.08,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: 6 },
          backgroundColor: isDark ? 'rgba(23, 29, 21, 0.94)' : 'rgba(255, 255, 255, 0.94)',
          borderTopWidth: 0,
        },
        tabBarBackground: () => (
          <View style={{ ...StyleSheet.absoluteFillObject, borderRadius: 34, overflow: 'hidden' }}>
            <BlurView 
              intensity={isDark ? 30 : 80} 
              tint={isDark ? 'dark' : 'light'} 
              style={StyleSheet.absoluteFill} 
            />
          </View>
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color, focused }) => (
            focused ? (
              <View style={[styles.activePill, { backgroundColor: colors.primary }]}>
                <Home color="#FFFFFF" size={18} strokeWidth={2.5} />
                <Text style={styles.activeLabel}>{language === 'sw' ? 'NYUMBANI' : 'HOME'}</Text>
              </View>
            ) : (
              <Home color={color} size={22} strokeWidth={2} />
            )
          ),
        }}
      />
      <Tabs.Screen
        name="ai"
        options={{
          tabBarIcon: ({ color, focused }) => (
            focused ? (
              <View style={[styles.activePill, { backgroundColor: colors.primary }]}>
                <Bot color="#FFFFFF" size={18} strokeWidth={2.5} />
                <Text style={styles.activeLabel}>SANKOFA</Text>
              </View>
            ) : (
              <Bot color={color} size={22} strokeWidth={2} />
            )
          ),
        }}
      />
      <Tabs.Screen
        name="farm"
        options={{
          tabBarIcon: ({ color, focused }) => (
            focused ? (
              <View style={[styles.activePill, { backgroundColor: colors.primary }]}>
                <Tractor color="#FFFFFF" size={18} strokeWidth={2.5} />
                <Text style={styles.activeLabel}>{language === 'sw' ? 'SHAMBA' : 'FARM'}</Text>
              </View>
            ) : (
              <Tractor color={color} size={22} strokeWidth={2} />
            )
          ),
        }}
      />
      <Tabs.Screen
        name="market"
        options={{
          tabBarIcon: ({ color, focused }) => (
            focused ? (
              <View style={[styles.activePill, { backgroundColor: colors.primary }]}>
                <Store color="#FFFFFF" size={18} strokeWidth={2.5} />
                <Text style={styles.activeLabel}>{language === 'sw' ? 'SOKO' : 'MARKET'}</Text>
              </View>
            ) : (
              <Store color={color} size={22} strokeWidth={2} />
            )
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color, focused }) => (
            focused ? (
              <View style={[styles.activePill, { backgroundColor: colors.primary }]}>
                <User color="#FFFFFF" size={18} strokeWidth={2.5} />
                <Text style={styles.activeLabel}>{language === 'sw' ? 'WASIFU' : 'PROFILE'}</Text>
              </View>
            ) : (
              <User color={color} size={22} strokeWidth={2} />
            )
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  activePill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
    shadowColor: '#4CA137',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  activeLabel: {
    color: '#FFFFFF',
    fontFamily: 'Inter_800ExtraBold',
    fontSize: 10,
    letterSpacing: 0.5,
  },
});
