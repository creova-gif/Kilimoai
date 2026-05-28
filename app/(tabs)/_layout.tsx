import React, { useEffect } from 'react';
import { Tabs, router } from 'expo-router';
import { Platform, StyleSheet, View, TouchableOpacity } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Home, User, Bot, Tractor, Plus } from 'lucide-react-native';
import { useTheme } from '../../constants/Theme';
import { useKilimoStore } from '../../store/useKilimoStore';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming } from 'react-native-reanimated';

const ICON_ACTIVE = '#22d15a';

function TabIcon({
  focused,
  children,
}: {
  focused: boolean;
  children: React.ReactNode;
}) {
  const scale = useSharedValue(1.0);

  useEffect(() => {
    scale.value = focused
      ? withSpring(1.15, { damping: 10, stiffness: 120 })
      : withTiming(1.0, { duration: 150 });
  }, [focused]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      style={[
        {
          width: 48,
          height: 48,
          alignItems: 'center',
          justifyContent: 'center',
        },
        animStyle,
      ]}
    >
      {focused && (
        <View
          style={{
            position: 'absolute',
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: 'rgba(34, 209, 90, 0.15)',
          }}
        />
      )}
      {children}
    </Animated.View>
  );
}

export default function TabLayout() {
  const { colors, isDark } = useTheme();

  const tabBarBg = colors.tabBar;
  const iconInactive = isDark ? 'rgba(255,255,255,0.38)' : 'rgba(0,0,0,0.35)';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: ICON_ACTIVE,
        tabBarInactiveTintColor: iconInactive,
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: Platform.OS === 'ios' ? 28 : 16,
          left: 16,
          right: 16,
          height: 68,
          borderRadius: 34,
          borderTopWidth: 0,
          overflow: 'visible',
          backgroundColor: tabBarBg,
          elevation: 12,
          shadowColor: '#000',
          shadowOpacity: isDark ? 0.35 : 0.12,
          shadowRadius: 20,
          shadowOffset: { width: 0, height: 8 },
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon focused={focused}>
              <Home color={color} size={22} strokeWidth={focused ? 2.5 : 2} />
            </TabIcon>
          ),
        }}
      />
      <Tabs.Screen
        name="fields"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon focused={focused}>
              <Tractor color={color} size={22} strokeWidth={focused ? 2.5 : 2} />
            </TabIcon>
          ),
        }}
      />
      <Tabs.Screen
        name="action"
        options={{
          tabBarLabel: () => null,
          tabBarIcon: () => null,
          tabBarButton: ({ ...props }: any) => (
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                router.push('/features');
              }}
              style={{
                position: 'relative',
                top: -20,
                width: 64,
                height: 64,
                borderRadius: 32,
                backgroundColor: '#22d15a',
                alignItems: 'center',
                justifyContent: 'center',
                shadowColor: '#22d15a',
                shadowOpacity: 0.55,
                shadowRadius: 14,
                shadowOffset: { width: 0, height: 6 },
                elevation: 10,
                borderWidth: 3,
                borderColor: tabBarBg,
              }}
            >
              <Plus color="#fff" size={30} strokeWidth={2.5} />
            </TouchableOpacity>
          ),
        }}
      />
      <Tabs.Screen
        name="ai"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon focused={focused}>
              <Bot color={color} size={22} strokeWidth={focused ? 2.5 : 2} />
            </TabIcon>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon focused={focused}>
              <User color={color} size={22} strokeWidth={focused ? 2.5 : 2} />
            </TabIcon>
          ),
        }}
      />
      <Tabs.Screen name="market" options={{ href: null }} />
      <Tabs.Screen name="video-hub" options={{ href: null }} />
      <Tabs.Screen name="ai-training-hub" options={{ href: null }} />
      <Tabs.Screen name="edit-profile" options={{ href: null }} />
      <Tabs.Screen name="features" options={{ href: null }} />
    </Tabs>
  );
}
