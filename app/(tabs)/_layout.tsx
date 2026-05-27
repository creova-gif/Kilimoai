import React, { useEffect } from 'react';
import { Tabs } from 'expo-router';
import { Platform, StyleSheet, View, Text } from 'react-native';
import { Home, Tv, GraduationCap, User, Settings, Bot, Tractor, Store, LayoutGrid } from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import { useTheme } from '../../constants/Theme';
import { useKilimoStore } from '../../store/useKilimoStore';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming } from 'react-native-reanimated';

function TabIcon({ focused, children }: { focused: boolean; children: React.ReactNode }) {
  const scale = useSharedValue(focused ? 1.15 : 1.0);
  const opacity = useSharedValue(focused ? 1.0 : 0.7);

  useEffect(() => {
    if (focused) {
      scale.value = withSpring(1.15, { damping: 10, stiffness: 100 });
      opacity.value = withTiming(1.0, { duration: 200 });
    } else {
      scale.value = withTiming(1.0, { duration: 150 });
      opacity.value = withTiming(0.7, { duration: 150 });
    }
  }, [focused]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  return (
    <Animated.View style={[{ alignItems: 'center', justifyContent: 'center', minWidth: 48, minHeight: 48 }, animatedStyle]}>
      {children}
    </Animated.View>
  );
}

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
            <TabIcon focused={focused}>
              {focused ? (
                <View style={[styles.activePill, { backgroundColor: colors.primary }]}>
                  <Home color="#FFFFFF" size={18} strokeWidth={2.5} />
                  <Text style={styles.activeLabel}>{language === 'sw' ? 'NYUMBANI' : 'HOME'}</Text>
                </View>
              ) : (
                <Home color={color} size={22} strokeWidth={2} />
              )}
            </TabIcon>
          ),
        }}
      />
      <Tabs.Screen
        name="video-hub"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon focused={focused}>
              {focused ? (
                <View style={[styles.activePill, { backgroundColor: colors.primary }]}>
                  <Tv color="#FFFFFF" size={18} strokeWidth={2.5} />
                  <Text style={styles.activeLabel}>{language === 'sw' ? 'VIDEO' : 'VIDEOS'}</Text>
                </View>
              ) : (
                <Tv color={color} size={22} strokeWidth={2} />
              )}
            </TabIcon>
          ),
        }}
      />
      <Tabs.Screen
        name="ai-training-hub"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon focused={focused}>
              {focused ? (
                <View style={[styles.activePill, { backgroundColor: colors.primary }]}>
                  <GraduationCap color="#FFFFFF" size={18} strokeWidth={2.5} />
                  <Text style={styles.activeLabel}>{language === 'sw' ? 'AI HUB' : 'AI HUB'}</Text>
                </View>
              ) : (
                <GraduationCap color={color} size={22} strokeWidth={2} />
              )}
            </TabIcon>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon focused={focused}>
              {focused ? (
                <View style={[styles.activePill, { backgroundColor: colors.primary }]}>
                  <User color="#FFFFFF" size={18} strokeWidth={2.5} />
                  <Text style={styles.activeLabel}>{language === 'sw' ? 'WASIFU' : 'PROFILE'}</Text>
                </View>
              ) : (
                <User color={color} size={22} strokeWidth={2} />
              )}
            </TabIcon>
          ),
        }}
      />
      <Tabs.Screen
        name="edit-profile"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon focused={focused}>
              {focused ? (
                <View style={[styles.activePill, { backgroundColor: colors.primary }]}>
                  <Settings color="#FFFFFF" size={18} strokeWidth={2.5} />
                  <Text style={styles.activeLabel}>{language === 'sw' ? 'MIPANGILIO' : 'SETTINGS'}</Text>
                </View>
              ) : (
                <Settings color={color} size={22} strokeWidth={2} />
              )}
            </TabIcon>
          ),
        }}
      />
      <Tabs.Screen
        name="ai"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="farm"
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
          tabBarIcon: ({ color, focused }) => (
            <TabIcon focused={focused}>
              {focused ? (
                <View style={[styles.activePill, { backgroundColor: colors.primary }]}>
                  <LayoutGrid color="#FFFFFF" size={18} strokeWidth={2.5} />
                  <Text style={styles.activeLabel}>{language === 'sw' ? 'VIPENGELE' : 'FEATURES'}</Text>
                </View>
              ) : (
                <LayoutGrid color={color} size={22} strokeWidth={2} />
              )}
            </TabIcon>
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
    shadowColor: '#1A3B14',
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
