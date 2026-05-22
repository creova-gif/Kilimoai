import { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  Platform, TextInput, Alert, Modal,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Colors } from '@/constants/colors';
import { useAuth } from '@/src/context/AuthContext';
import { Card } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';

interface Listing {
  id: string;
  title: string;
  category: 'produce' | 'inputs' | 'equipment' | 'services';
  price: number;
  unit: string;
  quantity: number;
  seller: string;
  region: string;
  verified: boolean;
  phone: string;
  daysAgo: number;
}

const LISTINGS: Listing[] = [
  { id: '1', title: 'Fresh Maize — Grade A', category: 'produce', price: 42, unit: 'kg', quantity: 5000, seller: 'John Kamau', region: 'Trans Nzoia', verified: true, phone: '+254711001001', daysAgo: 1 },
  { id: '2', title: 'NPK 17:17:17 Fertilizer', category: 'inputs', price: 3200, unit: '50kg bag', quantity: 200, seller: 'AgroMart Kenya', region: 'Eldoret', verified: true, phone: '+254722002002', daysAgo: 0 },
  { id: '3', title: 'Dairy Cattle — Friesian Cross', category: 'produce', price: 85000, unit: 'head', quantity: 5, seller: 'Mary Wanjiku', region: 'Nakuru', verified: false, phone: '+254733003003', daysAgo: 3 },
  { id: '4', title: 'Tractor Hire — Ploughing', category: 'services', price: 3500, unit: 'acre', quantity: 999, seller: 'AgriServices Ltd', region: 'Nairobi', verified: true, phone: '+254744004004', daysAgo: 2 },
  { id: '5', title: 'Drip Irrigation Kit (1 acre)', category: 'equipment', price: 18500, unit: 'kit', quantity: 12, seller: 'IrriPro Kenya', region: 'Mombasa', verified: true, phone: '+254755005005', daysAgo: 5 },
  { id: '6', title: 'Fresh Tomatoes — Kilimanjaro', category: 'produce', price: 75, unit: 'kg', quantity: 800, seller: 'Peter Omondi', region: 'Kirinyaga', verified: false, phone: '+254766006006', daysAgo: 1 },
  { id: '7', title: 'Hybrid Maize Seeds (OPV-DK)', category: 'inputs', price: 1200, unit: '2kg pack', quantity: 500, seller: 'SeedCo Kenya', region: 'Thika', verified: true, phone: '+254777007007', daysAgo: 0 },
  { id: '8', title: 'Poultry Litter (Organic Manure)', category: 'inputs', price: 800, unit: 'tonne', quantity: 50, seller: 'Green Farms', region: 'Kiambu', verified: false, phone: '+254788008008', daysAgo: 7 },
];

const CATEGORIES = [
  { id: 'all', label: { en: 'All', sw: 'Zote' }, icon: 'grid-outline' as const },
  { id: 'produce', label: { en: 'Produce', sw: 'Mazao' }, icon: 'leaf-outline' as const },
  { id: 'inputs', label: { en: 'Inputs', sw: 'Pembejeo' }, icon: 'flask-outline' as const },
  { id: 'equipment', label: { en: 'Equipment', sw: 'Vifaa' }, icon: 'construct-outline' as const },
  { id: 'services', label: { en: 'Services', sw: 'Huduma' }, icon: 'people-outline' as const },
];

export default function MarketplaceScreen() {
  const insets = useSafeAreaInsets();
  const { language } = useAuth();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [selected, setSelected] = useState<Listing | null>(null);

  const topInset = Platform.OS === 'web' ? 20 : insets.top;

  const filtered = LISTINGS.filter(l => {
    const matchCat = activeCategory === 'all' || l.category === activeCategory;
    const matchSearch = !search || l.title.toLowerCase().includes(search.toLowerCase()) || l.seller.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const categoryColor = (cat: string) => {
    switch (cat) {
      case 'produce': return Colors.success;
      case 'inputs': return Colors.info;
      case 'equipment': return Colors.warning;
      case 'services': return '#6A1B9A';
      default: return Colors.textMuted;
    }
  };

  const contact = (listing: Listing) => {
    Alert.alert(
      language === 'sw' ? 'Wasiliana na Muuzaji' : 'Contact Seller',
      `${listing.seller}\n${listing.phone}`,
      [
        { text: language === 'sw' ? 'Funga' : 'Close', style: 'cancel' },
        {
          text: language === 'sw' ? 'Piga Simu' : 'Call',
          onPress: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
        },
      ]
    );
  };

  const renderItem = ({ item }: { item: Listing }) => (
    <TouchableOpacity activeOpacity={0.88} onPress={() => setSelected(item)}>
      <Card style={styles.card}>
        <View style={styles.cardTop}>
          <View style={[styles.catBadge, { backgroundColor: categoryColor(item.category) + '18' }]}>
            <Ionicons
              name={CATEGORIES.find(c => c.id === item.category)?.icon || 'grid-outline'}
              size={13}
              color={categoryColor(item.category)}
            />
            <Text style={[styles.catText, { color: categoryColor(item.category) }]}>
              {CATEGORIES.find(c => c.id === item.category)?.label[language] || item.category}
            </Text>
          </View>
          {item.verified && (
            <View style={styles.verifiedBadge}>
              <Ionicons name="shield-checkmark" size={12} color={Colors.success} />
              <Text style={styles.verifiedText}>{language === 'sw' ? 'Imethibitishwa' : 'Verified'}</Text>
            </View>
          )}
        </View>

        <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>

        <View style={styles.cardMeta}>
          <Ionicons name="location-outline" size={13} color={Colors.textMuted} />
          <Text style={styles.metaText}>{item.seller} · {item.region}</Text>
          <Text style={styles.metaDot}>·</Text>
          <Text style={styles.metaText}>{item.daysAgo === 0 ? (language === 'sw' ? 'Leo' : 'Today') : `${item.daysAgo}d ago`}</Text>
        </View>

        <View style={styles.cardBottom}>
          <View>
            <Text style={styles.price}>KSh {item.price.toLocaleString()}</Text>
            <Text style={styles.unit}>/{item.unit} · {item.quantity.toLocaleString()} {language === 'sw' ? 'zinapatikana' : 'available'}</Text>
          </View>
          <TouchableOpacity style={styles.contactBtn} onPress={() => contact(item)}>
            <Ionicons name="call" size={14} color="#fff" />
            <Text style={styles.contactBtnText}>{language === 'sw' ? 'Wasiliana' : 'Contact'}</Text>
          </TouchableOpacity>
        </View>
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: topInset + 12 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>{language === 'sw' ? 'Soko la Bidhaa' : 'Marketplace'}</Text>
          <Text style={styles.headerSub}>{filtered.length} {language === 'sw' ? 'matangazo' : 'listings'}</Text>
        </View>
        <TouchableOpacity
          style={styles.postBtn}
          onPress={() => Alert.alert(language === 'sw' ? 'Tangazo Jipya' : 'New Listing', language === 'sw' ? 'Kipengele hiki kitapatikana hivi karibuni.' : 'This feature is coming soon.')}
        >
          <Ionicons name="add" size={20} color="#fff" />
          <Text style={styles.postBtnText}>{language === 'sw' ? 'Tangaza' : 'Post'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchBar}>
        <Ionicons name="search" size={18} color={Colors.textMuted} />
        <TextInput
          style={styles.searchInput}
          placeholder={language === 'sw' ? 'Tafuta bidhaa au muuzaji...' : 'Search products or sellers...'}
          placeholderTextColor={Colors.textMuted}
          value={search}
          onChangeText={setSearch}
        />
        {search ? (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Ionicons name="close-circle" size={18} color={Colors.textMuted} />
          </TouchableOpacity>
        ) : null}
      </View>

      <FlatList
        horizontal
        data={CATEGORIES}
        keyExtractor={c => c.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.catList}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.catChip, activeCategory === item.id && styles.catChipActive]}
            onPress={() => setActiveCategory(item.id)}
          >
            <Ionicons name={item.icon} size={14} color={activeCategory === item.id ? Colors.primary : Colors.textMuted} />
            <Text style={[styles.catChipText, activeCategory === item.id && styles.catChipTextActive]}>
              {item.label[language]}
            </Text>
          </TouchableOpacity>
        )}
      />

      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        contentContainerStyle={[styles.list, { paddingBottom: Platform.OS === 'web' ? 48 : 32 }]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="storefront-outline" size={52} color={Colors.gray300} />
            <Text style={styles.emptyText}>{language === 'sw' ? 'Hakuna matangazo' : 'No listings found'}</Text>
          </View>
        }
        renderItem={renderItem}
      />

      <Modal visible={!!selected} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setSelected(null)}>
        {selected && (
          <View style={styles.modal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle} numberOfLines={2}>{selected.title}</Text>
              <TouchableOpacity onPress={() => setSelected(null)}>
                <Ionicons name="close" size={24} color={Colors.text} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalMeta}>
              <View style={[styles.catBadge, { backgroundColor: categoryColor(selected.category) + '18' }]}>
                <Text style={[styles.catText, { color: categoryColor(selected.category) }]}>
                  {CATEGORIES.find(c => c.id === selected.category)?.label[language]}
                </Text>
              </View>
              {selected.verified && (
                <View style={styles.verifiedBadge}>
                  <Ionicons name="shield-checkmark" size={13} color={Colors.success} />
                  <Text style={styles.verifiedText}>{language === 'sw' ? 'Muuzaji Aliyethibitishwa' : 'Verified Seller'}</Text>
                </View>
              )}
            </View>

            <View style={styles.modalPriceRow}>
              <Text style={styles.modalPrice}>KSh {selected.price.toLocaleString()}</Text>
              <Text style={styles.modalUnit}>/{selected.unit}</Text>
            </View>

            {[
              { icon: 'person-outline' as const, label: language === 'sw' ? 'Muuzaji' : 'Seller', value: selected.seller },
              { icon: 'location-outline' as const, label: language === 'sw' ? 'Eneo' : 'Location', value: selected.region },
              { icon: 'cube-outline' as const, label: language === 'sw' ? 'Idadi Inayopatikana' : 'Quantity Available', value: `${selected.quantity.toLocaleString()} ${selected.unit}` },
              { icon: 'call-outline' as const, label: language === 'sw' ? 'Simu' : 'Phone', value: selected.phone },
            ].map((row, i) => (
              <View key={i} style={styles.modalRow}>
                <View style={styles.modalRowIcon}>
                  <Ionicons name={row.icon} size={18} color={Colors.primary} />
                </View>
                <View>
                  <Text style={styles.modalRowLabel}>{row.label}</Text>
                  <Text style={styles.modalRowValue}>{row.value}</Text>
                </View>
              </View>
            ))}

            <View style={styles.modalActions}>
              <Button
                title={language === 'sw' ? 'Piga Simu' : 'Call Seller'}
                onPress={() => contact(selected)}
                style={{ flex: 1 }}
                icon="call"
              />
              <Button
                title="WhatsApp"
                onPress={() => Alert.alert('WhatsApp', language === 'sw' ? 'Unaunganishwa na WhatsApp...' : 'Connecting to WhatsApp...')}
                variant="outline"
                style={{ flex: 1 }}
                icon="logo-whatsapp"
              />
            </View>
          </View>
        )}
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.surface },
  header: {
    backgroundColor: Colors.primary, paddingHorizontal: 16, paddingBottom: 14,
    flexDirection: 'row', alignItems: 'center', gap: 10,
  },
  backBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: { fontSize: 18, fontWeight: '700' as const, color: '#fff' },
  headerSub: { fontSize: 12, color: 'rgba(255,255,255,0.8)' },
  postBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 12, paddingVertical: 8, borderRadius: Colors.radiusFull,
  },
  postBtnText: { fontSize: 13, fontWeight: '600' as const, color: '#fff' },
  searchBar: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    margin: 14, backgroundColor: Colors.background,
    borderRadius: Colors.radius, paddingHorizontal: 14, paddingVertical: 10,
    borderWidth: 1.5, borderColor: Colors.border,
  },
  searchInput: { flex: 1, fontSize: 14, color: Colors.text },
  catList: { paddingHorizontal: 14, paddingBottom: 10, gap: 8 },
  catChip: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: Colors.radiusFull,
    backgroundColor: Colors.gray100, borderWidth: 1, borderColor: Colors.border,
  },
  catChipActive: { backgroundColor: Colors.primaryMuted, borderColor: Colors.primary },
  catChipText: { fontSize: 13, color: Colors.textMuted, fontWeight: '500' as const },
  catChipTextActive: { color: Colors.primary, fontWeight: '600' as const },
  list: { paddingHorizontal: 14, gap: 10 },
  card: { padding: 14, gap: 8 },
  cardTop: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  catBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: Colors.radiusFull },
  catText: { fontSize: 11, fontWeight: '600' as const },
  verifiedBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, marginLeft: 'auto' as any },
  verifiedText: { fontSize: 11, color: Colors.success, fontWeight: '500' as const },
  cardTitle: { fontSize: 15, fontWeight: '600' as const, color: Colors.text, lineHeight: 22 },
  cardMeta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: 12, color: Colors.textMuted },
  metaDot: { fontSize: 12, color: Colors.textMuted },
  cardBottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 },
  price: { fontSize: 20, fontWeight: '800' as const, color: Colors.text },
  unit: { fontSize: 12, color: Colors.textMuted },
  contactBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: Colors.primary, paddingHorizontal: 16, paddingVertical: 10, borderRadius: Colors.radiusFull,
  },
  contactBtnText: { fontSize: 13, fontWeight: '600' as const, color: '#fff' },
  empty: { alignItems: 'center', padding: 60, gap: 12 },
  emptyText: { fontSize: 15, color: Colors.textMuted },
  modal: { flex: 1, padding: 24, backgroundColor: Colors.background, gap: 16 },
  modalHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  modalTitle: { flex: 1, fontSize: 20, fontWeight: '700' as const, color: Colors.text },
  modalMeta: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  modalPriceRow: { flexDirection: 'row', alignItems: 'baseline', gap: 4 },
  modalPrice: { fontSize: 32, fontWeight: '800' as const, color: Colors.text },
  modalUnit: { fontSize: 16, color: Colors.textMuted },
  modalRow: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 6 },
  modalRowIcon: {
    width: 40, height: 40, borderRadius: Colors.radiusSm,
    backgroundColor: Colors.primaryMuted, alignItems: 'center', justifyContent: 'center',
  },
  modalRowLabel: { fontSize: 12, color: Colors.textMuted },
  modalRowValue: { fontSize: 15, fontWeight: '500' as const, color: Colors.text, marginTop: 2 },
  modalActions: { flexDirection: 'row', gap: 12, marginTop: 8 },
});
