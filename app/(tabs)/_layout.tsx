import React, { useEffect } from 'react';
import { Tabs, router } from 'expo-router';
import { Platform, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Home, Tv, GraduationCap, User, Settings, Bot, Tractor, Store, LayoutGrid, Plus } from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import { useTheme } from '../../constants/Theme';
import { useKilimoStore } from '../../store/useKilimoStore';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming } from 'react-native-reanimated';

function TabIcon({ focused, children, backgroundColor }: { focused: boolean; children: React.ReactNode; backgroundColor?: string }) {
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
      <View style={{
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: focused && backgroundColor ? backgroundColor : 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {children}
      </View>
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
            <TabIcon focused={focused} backgroundColor={colors.primary}>
              <Home color={focused ? "#FFFFFF" : color} size={focused ? 24 : 22} strokeWidth={focused ? 2.5 : 2} />
            </TabIcon>
          ),
        }}
      />
      <Tabs.Screen
        name="fields"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon focused={focused} backgroundColor={colors.primary}>
              <Tractor color={focused ? "#FFFFFF" : color} size={focused ? 24 : 22} strokeWidth={focused ? 2.5 : 2} />
            </TabIcon>
          ),
        }}
      />
      <Tabs.Screen
        name="action"
        options={{
          tabBarLabel: () => null,
          tabBarIcon: () => null,
          tabBarButton: ({ ref, onPress: defaultOnPress, ...props }: any) => (
            <TouchableOpacity 
              {...props} 
              activeOpacity={0.8}
              onPress={(e) => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                router.push('/features');
              }}
              style={{
                top: -20,
                justifyContent: 'center',
                alignItems: 'center',
                width: 64,
                height: 64,
                borderRadius: 32,
                backgroundColor: colors.primary,
                shadowColor: colors.primary,
                shadowOpacity: 0.3,
                shadowRadius: 10,
                shadowOffset: { width: 0, height: 6 },
                elevation: 5,
                borderWidth: 4,
                borderColor: colors.background,
              }}
            >
              <Plus color="#FFFFFF" size={32} strokeWidth={3} />
            </TouchableOpacity>
          ),
        }}
      />
      <Tabs.Screen
        name="ai"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon focused={focused} backgroundColor={colors.primary}>
              <Bot color={focused ? "#FFFFFF" : color} size={focused ? 24 : 22} strokeWidth={focused ? 2.5 : 2} />
            </TabIcon>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon focused={focused} backgroundColor={colors.primary}>
              <User color={focused ? "#FFFFFF" : color} size={focused ? 24 : 22} strokeWidth={focused ? 2.5 : 2} />
            </TabIcon>
          ),
        }}
      />
      <Tabs.Screen
        name="market"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="video-hub"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="ai-training-hub"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="edit-profile"
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
