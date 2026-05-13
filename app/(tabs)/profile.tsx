import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image, Switch } from 'react-native';
import { User, Bell, Shield, LogOut, ChevronRight, Settings, Sprout } from 'lucide-react-native';
import { useColorScheme } from 'react-native';

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const textColor = isDark ? '#ffffff' : '#000000';
  const subTextColor = isDark ? '#a1a1aa' : '#71717a';
  const cardBg = isDark ? '#18181b' : '#f4f4f5';
  const brandColor = '#22c55e';

  return (
    <ScrollView style={[styles.container, { backgroundColor: isDark ? '#0a0a0a' : '#ffffff' }]}>
      <View style={styles.header}>
        <View style={[styles.avatarContainer, { backgroundColor: brandColor + '20' }]}>
          <User color={brandColor} size={40} />
        </View>
        <Text style={[styles.userName, { color: textColor }]}>Justin Mafie</Text>
        <Text style={[styles.userEmail, { color: subTextColor }]}>justin@kilimo.ai</Text>
        
        <TouchableOpacity style={[styles.editButton, { backgroundColor: brandColor }]}>
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: subTextColor }]}>ACCOUNT</Text>
        
        <MenuItem 
          icon={<Bell color={subTextColor} size={22} />} 
          label="Notifications" 
          isDark={isDark} 
          hasSwitch
        />
        <MenuItem 
          icon={<Shield color={subTextColor} size={22} />} 
          label="Security" 
          isDark={isDark} 
        />
        <MenuItem 
          icon={<Sprout color={subTextColor} size={22} />} 
          label="Farm Management" 
          isDark={isDark} 
        />
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: subTextColor }]}>APP SETTINGS</Text>
        
        <MenuItem 
          icon={<Settings color={subTextColor} size={22} />} 
          label="Appearance" 
          isDark={isDark} 
          value="Dark Mode"
        />
      </View>

      <TouchableOpacity style={styles.logoutButton}>
        <LogOut color="#ef4444" size={22} />
        <Text style={styles.logoutText}>Sign Out</Text>
      </TouchableOpacity>
      
      <View style={styles.footer}>
        <Text style={[styles.versionText, { color: subTextColor }]}>Kilimo AI v2.1.2 (Production)</Text>
      </View>
    </ScrollView>
  );
}

function MenuItem({ icon, label, isDark, hasSwitch = false, value = '' }) {
  const textColor = isDark ? '#ffffff' : '#000000';
  const cardBg = isDark ? '#18181b' : '#f4f4f5';

  return (
    <TouchableOpacity style={[styles.menuItem, { backgroundColor: cardBg }]}>
      <View style={styles.menuItemLeft}>
        {icon}
        <Text style={[styles.menuItemLabel, { color: textColor }]}>{label}</Text>
      </View>
      <View style={styles.menuItemRight}>
        {value ? <Text style={styles.menuItemValue}>{value}</Text> : null}
        {hasSwitch ? <Switch value={true} trackColor={{ true: '#22c55e' }} /> : <ChevronRight color="#a1a1aa" size={20} />}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  userName: {
    fontSize: 24,
    fontFamily: 'Inter_700Bold',
  },
  userEmail: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    marginBottom: 20,
  },
  editButton: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
  },
  editButtonText: {
    color: '#ffffff',
    fontFamily: 'Inter_600SemiBold',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: 'Inter_700Bold',
    letterSpacing: 1,
    marginBottom: 12,
    paddingLeft: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 16,
    marginBottom: 8,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemLabel: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    marginLeft: 12,
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemValue: {
    fontSize: 14,
    color: '#71717a',
    marginRight: 8,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#ef444410',
    marginBottom: 32,
  },
  logoutText: {
    color: '#ef4444',
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
    marginLeft: 12,
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 40,
  },
  versionText: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
  },
});
