import React, { useEffect } from 'react';
import { Tabs, router } from 'expo-router';
import { Platform, StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Home, User, Bot, Tractor, Plus } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../constants/Theme';
import { useKilimoStore } from '../../store/useKilimoStore';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming, interpolateColor } from 'react-native-reanimated';

const ICON_ACTIVE = '#10b981';

function TabIcon({
  focused,
  label,
  children,
}: {
  focused: boolean;
  label: string;
  children: React.ReactNode;
}) {
  const { colors, isDark } = useTheme();
  const scale = useSharedValue(focused ? 1 : 0);
  const iconScale = useSharedValue(focused ? 1.1 : 1);

  useEffect(() => {
    scale.value = withSpring(focused ? 1 : 0, { damping: 15, stiffness: 150 });
    iconScale.value = withSpring(focused ? 1.15 : 1, { damping: 12, stiffness: 200 });
  }, [focused]);

  const pillStyle = useAnimatedStyle(() => ({
    transform: [{ scaleX: scale.value }],
    opacity: scale.value,
  }));

  const iconAnimStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: iconScale.value },
      { translateY: focused ? -4 : 0 }
    ] as any,
  }));

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', width: 60 }}>
      <Animated.View style={iconAnimStyle}>
        {children}
      </Animated.View>
      <Animated.View
        style={[
          {
            position: 'absolute',
            bottom: -14,
            width: 4,
            height: 4,
            borderRadius: 2,
            backgroundColor: ICON_ACTIVE,
          },
          pillStyle,
        ]}
      />
    </View>
  );
}

export default function TabLayout() {
  const { colors, isDark } = useTheme();

  const tabBarBg = isDark ? '#111827' : '#ffffff';
  const iconInactive = isDark ? '#6B7280' : '#9CA3AF';
  const borderColor = isDark ? '#1F2937' : '#F3F4F6';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: ICON_ACTIVE,
        tabBarInactiveTintColor: iconInactive,
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: Platform.OS === 'ios' ? 24 : 16,
          left: 20,
          right: 20,
          height: 64,
          borderRadius: 20,
          borderTopWidth: 1,
          borderColor: borderColor,
          backgroundColor: tabBarBg,
          elevation: 10,
          shadowColor: '#000',
          shadowOpacity: isDark ? 0.4 : 0.08,
          shadowRadius: 16,
          shadowOffset: { width: 0, height: 8 },
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon focused={focused} label="Mwanzo">
              <Home color={color} size={24} strokeWidth={focused ? 2.5 : 2} />
            </TabIcon>
          ),
        }}
      />
      <Tabs.Screen
        name="fields"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon focused={focused} label="Mashamba">
              <Tractor color={color} size={24} strokeWidth={focused ? 2.5 : 2} />
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
              activeOpacity={0.9}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                router.push('/features');
              }}
              style={{
                position: 'relative',
                top: -24,
                width: 60,
                height: 60,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <LinearGradient
                colors={['#34d399', '#059669']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 28,
                  alignItems: 'center',
                  justifyContent: 'center',
                  shadowColor: '#10b981',
                  shadowOpacity: 0.4,
                  shadowRadius: 12,
                  shadowOffset: { width: 0, height: 6 },
                  elevation: 8,
                  borderWidth: 4,
                  borderColor: tabBarBg,
                }}
              >
                <Plus color="#ffffff" size={28} strokeWidth={3} />
              </LinearGradient>
            </TouchableOpacity>
          ),
        }}
      />
      <Tabs.Screen
        name="ai"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon focused={focused} label="Sankofa AI">
              <Bot color={color} size={24} strokeWidth={focused ? 2.5 : 2} />
            </TabIcon>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon focused={focused} label="Profaili">
              <User color={color} size={24} strokeWidth={focused ? 2.5 : 2} />
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
