import { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Platform, Alert, Modal, TextInput,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors } from '@/constants/colors';
import { useAuth } from '@/src/context/AuthContext';
import { tr } from '@/src/utils/translations';
import { Card } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';

interface MenuSection {
  title: string;
  items: MenuItem[];
}
interface MenuItem {
  icon: any;
  label: string;
  value?: string;
  badge?: string;
  onPress?: () => void;
  danger?: boolean;
}

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { user, language, setLanguage, signOut, updateUser } = useAuth();
  const [showEditModal, setShowEditModal] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');
  const [editRegion, setEditRegion] = useState(user?.region || '');
  const [saving, setSaving] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const topInset = Platform.OS === 'web' ? 67 : insets.top;

  const handleLogout = () => {
    Alert.alert(
      language === 'en' ? 'Logout' : 'Toka',
      language === 'en' ? 'Are you sure you want to logout?' : 'Una uhakika unataka kutoka?',
      [
        { text: tr('cancel', language), style: 'cancel' },
        {
          text: tr('logout', language), style: 'destructive',
          onPress: async () => {
            setLoggingOut(true);
            await signOut();
            router.replace('/(auth)/welcome');
          },
        },
      ]
    );
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    await updateUser({ name: editName, region: editRegion });
    setSaving(false);
    setShowEditModal(false);
  };

  const tierColors: Record<string, string> = {
    free: Colors.gray500, basic: Colors.info, premium: Colors.warning, enterprise: Colors.primary,
  };

  const SECTIONS: MenuSection[] = [
    {
      title: language === 'sw' ? 'Shamba' : 'My Farm',
      items: [
        { icon: 'location-outline', label: tr('region', language), value: user?.region || (language === 'sw' ? 'Haijawekwa' : 'Not set') },
        { icon: 'resize-outline', label: tr('farmSize', language), value: user?.farmSize || '< 5 acres' },
      ],
    },
    {
      title: language === 'sw' ? 'Mipangilio' : 'Settings',
      items: [
        {
          icon: 'language-outline', label: tr('language', language),
          value: language === 'sw' ? 'Kiswahili' : 'English',
          onPress: () => setLanguage(language === 'sw' ? 'en' : 'sw'),
        },
        { icon: 'notifications-outline', label: tr('notifications', language), onPress: () => router.push('/notifications') },
        { icon: 'lock-closed-outline', label: tr('privacy', language) },
      ],
    },
    {
      title: language === 'sw' ? 'Msaada' : 'Help',
      items: [
        { icon: 'help-circle-outline', label: tr('faq', language) },
        { icon: 'headset-outline', label: tr('support', language) },
        { icon: 'information-circle-outline', label: tr('version', language), value: '1.0.0' },
      ],
    },
    {
      title: '',
      items: [
        { icon: 'log-out-outline', label: tr('logout', language), onPress: handleLogout, danger: true },
      ],
    },
  ];

  const roleLabel: Record<string, string> = {
    smallholder_farmer: language === 'sw' ? 'Mkulima Mdogo' : 'Smallholder Farmer',
    farmer: language === 'sw' ? 'Mkulima' : 'Farmer',
    extension_officer: language === 'sw' ? 'Afisa Ugani' : 'Extension Officer',
    agribusiness: language === 'sw' ? 'Biashara ya Kilimo' : 'Agribusiness',
    cooperative_leader: language === 'sw' ? 'Kiongozi wa Ushirika' : 'Cooperative Leader',
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: topInset + 12 }]}>
        <View style={styles.avatarRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{(user?.name || 'F')[0].toUpperCase()}</Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user?.name || 'Farmer'}</Text>
            <Text style={styles.userRole}>{roleLabel[user?.role || 'smallholder_farmer'] || user?.role}</Text>
            <View style={[styles.tierBadge, { backgroundColor: tierColors[user?.tier || 'free'] + '30' }]}>
              <Text style={[styles.tierText, { color: tierColors[user?.tier || 'free'] }]}>
                {(user?.tier || 'FREE').toUpperCase()}
              </Text>
            </View>
          </View>
          <TouchableOpacity onPress={() => setShowEditModal(true)} style={styles.editBtn}>
            <Ionicons name="pencil" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
        {(user?.email || user?.phone) && (
          <View style={styles.contactRow}>
            <Ionicons name={user?.email ? 'mail-outline' : 'phone-portrait-outline'} size={14} color="rgba(255,255,255,0.8)" />
            <Text style={styles.contactText}>{user?.email || user?.phone}</Text>
          </View>
        )}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingBottom: Platform.OS === 'web' ? 34 + 84 : 90 }]}
      >
        {SECTIONS.map((section, si) => (
          <View key={si} style={styles.section}>
            {section.title ? <Text style={styles.sectionTitle}>{section.title}</Text> : null}
            <Card padded={false} style={{ overflow: 'hidden' }}>
              {section.items.map((item, ii) => (
                <TouchableOpacity
                  key={ii}
                  style={[styles.menuItem, ii < section.items.length - 1 && styles.menuDivider]}
                  onPress={item.onPress}
                  activeOpacity={item.onPress ? 0.7 : 1}
                >
                  <View style={[styles.menuIcon, { backgroundColor: item.danger ? Colors.errorLight : Colors.primaryMuted }]}>
                    <Ionicons name={item.icon} size={18} color={item.danger ? Colors.error : Colors.primary} />
                  </View>
                  <Text style={[styles.menuLabel, item.danger && styles.menuLabelDanger]}>{item.label}</Text>
                  {item.value && <Text style={styles.menuValue}>{item.value}</Text>}
                  {item.badge && (
                    <View style={styles.menuBadge}>
                      <Text style={styles.menuBadgeText}>{item.badge}</Text>
                    </View>
                  )}
                  {item.onPress && !item.danger && (
                    <Ionicons name="chevron-forward" size={16} color={Colors.gray400} />
                  )}
                </TouchableOpacity>
              ))}
            </Card>
          </View>
        ))}
      </ScrollView>

      <Modal visible={showEditModal} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setShowEditModal(false)}>
        <View style={styles.modal}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{tr('editProfile', language)}</Text>
            <TouchableOpacity onPress={() => setShowEditModal(false)}>
              <Ionicons name="close" size={24} color={Colors.text} />
            </TouchableOpacity>
          </View>
          <Text style={styles.modalLabel}>{tr('fullName', language)}</Text>
          <TextInput
            style={styles.modalInput}
            value={editName}
            onChangeText={setEditName}
            placeholder={tr('namePlaceholder', language)}
            placeholderTextColor={Colors.textMuted}
          />
          <Text style={styles.modalLabel}>{tr('region', language)}</Text>
          <TextInput
            style={styles.modalInput}
            value={editRegion}
            onChangeText={setEditRegion}
            placeholder={language === 'sw' ? 'Mfano: Nairobi' : 'e.g. Nairobi'}
            placeholderTextColor={Colors.textMuted}
          />
          <Button title={tr('save', language)} onPress={handleSaveProfile} loading={saving} fullWidth style={{ marginTop: 24 }} />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.surface },
  header: { backgroundColor: Colors.primary, paddingHorizontal: 20, paddingBottom: 20 },
  avatarRow: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 10 },
  avatar: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.25)', alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: 'rgba(255,255,255,0.5)',
  },
  avatarText: { fontSize: 26, fontWeight: '700' as const, color: '#fff' },
  userInfo: { flex: 1, gap: 4 },
  userName: { fontSize: 18, fontWeight: '700' as const, color: '#fff' },
  userRole: { fontSize: 13, color: 'rgba(255,255,255,0.8)' },
  tierBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: Colors.radiusFull, alignSelf: 'flex-start' },
  tierText: { fontSize: 11, fontWeight: '700' as const },
  editBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center',
  },
  contactRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  contactText: { fontSize: 13, color: 'rgba(255,255,255,0.8)' },
  content: { padding: 16, gap: 20 },
  section: { gap: 8 },
  sectionTitle: { fontSize: 13, fontWeight: '600' as const, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.5 },
  menuItem: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 16, gap: 12,
  },
  menuDivider: { borderBottomWidth: 1, borderBottomColor: Colors.divider },
  menuIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  menuLabel: { flex: 1, fontSize: 15, color: Colors.text },
  menuLabelDanger: { color: Colors.error },
  menuValue: { fontSize: 14, color: Colors.textMuted },
  menuBadge: {
    backgroundColor: Colors.error, paddingHorizontal: 8, paddingVertical: 3, borderRadius: Colors.radiusFull,
  },
  menuBadgeText: { fontSize: 11, fontWeight: '700' as const, color: '#fff' },
  modal: { flex: 1, padding: 24, backgroundColor: Colors.background },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  modalTitle: { fontSize: 20, fontWeight: '700' as const, color: Colors.text },
  modalLabel: { fontSize: 14, fontWeight: '500' as const, color: Colors.text, marginBottom: 8 },
  modalInput: {
    borderWidth: 1.5, borderColor: Colors.border, borderRadius: Colors.radius,
    padding: 14, fontSize: 15, color: Colors.text, marginBottom: 16, backgroundColor: Colors.gray50,
  },
});
