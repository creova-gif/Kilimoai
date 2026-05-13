import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Cloud, Sun, CloudRain, Wind, Droplets } from 'lucide-react-native';
import { useColorScheme } from 'react-native';

export default function ForecastScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const textColor = isDark ? '#ffffff' : '#000000';
  const subTextColor = isDark ? '#a1a1aa' : '#71717a';
  const cardBg = isDark ? '#18181b' : '#f4f4f5';

  return (
    <ScrollView style={[styles.container, { backgroundColor: isDark ? '#0a0a0a' : '#ffffff' }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: textColor }]}>Kilimo Weather</Text>
        <Text style={[styles.subtitle, { color: subTextColor }]}>Nairobi, Kenya</Text>
      </View>

      <View style={[styles.mainCard, { backgroundColor: cardBg }]}>
        <Sun color="#f59e0b" size={64} />
        <Text style={[styles.temp, { color: textColor }]}>24°C</Text>
        <Text style={[styles.condition, { color: subTextColor }]}>Sunny with clear skies</Text>
        
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Droplets color="#3b82f6" size={20} />
            <Text style={[styles.statValue, { color: textColor }]}>45%</Text>
            <Text style={[styles.statLabel, { color: subTextColor }]}>Humidity</Text>
          </View>
          <View style={styles.stat}>
            <Wind color="#10b981" size={20} />
            <Text style={[styles.statValue, { color: textColor }]}>12 km/h</Text>
            <Text style={[styles.statLabel, { color: subTextColor }]}>Wind</Text>
          </View>
          <View style={styles.stat}>
            <CloudRain color="#8b5cf6" size={20} />
            <Text style={[styles.statValue, { color: textColor }]}>5%</Text>
            <Text style={[styles.statLabel, { color: subTextColor }]}>Rain</Text>
          </View>
        </View>
      </View>

      <Text style={[styles.sectionTitle, { color: textColor }]}>7-Day Forecast</Text>
      
      {[1, 2, 3, 4, 5, 6, 7].map((day) => (
        <View key={day} style={[styles.dayRow, { backgroundColor: cardBg }]}>
          <Text style={[styles.dayName, { color: textColor }]}>
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][day - 1]}
          </Text>
          <Cloud size={24} color={subTextColor} />
          <View style={styles.dayTempContainer}>
            <Text style={[styles.dayTempHigh, { color: textColor }]}>22°</Text>
            <Text style={[styles.dayTempLow, { color: subTextColor }]}>14°</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter_700Bold',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
  },
  mainCard: {
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    marginBottom: 32,
  },
  temp: {
    fontSize: 64,
    fontFamily: 'Inter_700Bold',
    marginVertical: 8,
  },
  condition: {
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    marginBottom: 24,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 8,
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter_700Bold',
    marginBottom: 16,
  },
  dayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  dayName: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    width: 60,
  },
  dayTempContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dayTempHigh: {
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
    marginRight: 8,
  },
  dayTempLow: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
  },
});
