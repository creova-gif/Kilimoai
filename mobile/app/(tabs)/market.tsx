import { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  Platform, RefreshControl, TextInput, ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors } from '@/constants/colors';
import { useAuth } from '@/src/context/AuthContext';
import { tr } from '@/src/utils/translations';
import { Card } from '@/src/components/ui/Card';

interface PriceItem {
  id: string;
  crop: string;
  price: number;
  unit: string;
  region: string;
  trend: 'up' | 'down' | 'stable';
  change: number;
  lastUpdated: string;
}

const MOCK_PRICES: PriceItem[] = [
  { id: '1', crop: 'Mahindi / Maize', price: 45, unit: 'kg', region: 'Nairobi', trend: 'up', change: 5.2, lastUpdated: '2h ago' },
  { id: '2', crop: 'Maharagwe / Beans', price: 120, unit: 'kg', region: 'Mombasa', trend: 'up', change: 3.1, lastUpdated: '1h ago' },
  { id: '3', crop: 'Viazi / Potatoes', price: 35, unit: 'kg', region: 'Nakuru', trend: 'down', change: -2.4, lastUpdated: '3h ago' },
  { id: '4', crop: 'Nyanya / Tomatoes', price: 80, unit: 'kg', region: 'Nairobi', trend: 'up', change: 8.7, lastUpdated: '30m ago' },
  { id: '5', crop: 'Sukari / Sugar', price: 150, unit: 'kg', region: 'Kisumu', trend: 'stable', change: 0.2, lastUpdated: '4h ago' },
  { id: '6', crop: 'Ngano / Wheat', price: 65, unit: 'kg', region: 'Eldoret', trend: 'up', change: 4.5, lastUpdated: '2h ago' },
  { id: '7', crop: 'Mpunga / Rice', price: 95, unit: 'kg', region: 'Mwea', trend: 'down', change: -1.8, lastUpdated: '5h ago' },
  { id: '8', crop: 'Soya / Soybeans', price: 110, unit: 'kg', region: 'Trans Nzoia', trend: 'up', change: 6.3, lastUpdated: '1h ago' },
  { id: '9', crop: 'Ng\'ombe / Cattle', price: 45000, unit: 'head', region: 'Laikipia', trend: 'up', change: 2.1, lastUpdated: '6h ago' },
  { id: '10', crop: 'Mbuzi / Goats', price: 8500, unit: 'head', region: 'Kajiado', trend: 'stable', change: 0.5, lastUpdated: '3h ago' },
];

const REGIONS = ['All Regions', 'Nairobi', 'Mombasa', 'Nakuru', 'Kisumu', 'Eldoret', 'Trans Nzoia'];

export default function MarketScreen() {
  const insets = useSafeAreaInsets();
  const { language } = useAuth();
  const [prices, setPrices] = useState<PriceItem[]>(MOCK_PRICES);
  const [filtered, setFiltered] = useState<PriceItem[]>(MOCK_PRICES);
  const [search, setSearch] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('All Regions');
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);

  const topInset = Platform.OS === 'web' ? 67 : insets.top;

  const filterData = useCallback((q: string, region: string) => {
    let result = prices;
    if (q) result = result.filter(p => p.crop.toLowerCase().includes(q.toLowerCase()));
    if (region !== 'All Regions') result = result.filter(p => p.region === region);
    setFiltered(result);
  }, [prices]);

  useEffect(() => { filterData(search, selectedRegion); }, [search, selectedRegion, filterData]);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const trendColor = (trend: string) => trend === 'up' ? Colors.success : trend === 'down' ? Colors.error : Colors.textMuted;
  const trendIcon = (trend: string): any => trend === 'up' ? 'trending-up' : trend === 'down' ? 'trending-down' : 'remove';

  const renderItem = ({ item }: { item: PriceItem }) => (
    <TouchableOpacity activeOpacity={0.85}>
      <Card style={styles.priceCard}>
        <View style={styles.priceRow}>
          <View style={styles.priceLeft}>
            <Text style={styles.cropName}>{item.crop}</Text>
            <View style={styles.metaRow}>
              <Ionicons name="location-outline" size={12} color={Colors.textMuted} />
              <Text style={styles.metaText}>{item.region}</Text>
              <Text style={styles.metaDot}>·</Text>
              <Text style={styles.metaText}>{item.lastUpdated}</Text>
            </View>
          </View>
          <View style={styles.priceRight}>
            <Text style={styles.priceValue}>
              KSh {item.price.toLocaleString()}
            </Text>
            <Text style={styles.priceUnit}>/{item.unit}</Text>
            <View style={styles.trendRow}>
              <Ionicons name={trendIcon(item.trend)} size={13} color={trendColor(item.trend)} />
              <Text style={[styles.changeText, { color: trendColor(item.trend) }]}>
                {item.change > 0 ? '+' : ''}{item.change}%
              </Text>
            </View>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: topInset + 12 }]}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.headerTitle}>{tr('marketPrices', language)}</Text>
            <Text style={styles.headerSub}>{language === 'sw' ? 'Bei wakati halisi' : 'Real-time prices'}</Text>
          </View>
          <TouchableOpacity style={styles.marketplaceBtn} onPress={() => router.push('/marketplace')} activeOpacity={0.85}>
            <Ionicons name="storefront-outline" size={16} color="#fff" />
            <Text style={styles.marketplaceBtnText}>{language === 'sw' ? 'Soko' : 'Marketplace'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.searchBar}>
        <Ionicons name="search" size={18} color={Colors.textMuted} style={{ marginRight: 8 }} />
        <TextInput
          style={styles.searchInput}
          placeholder={tr('search', language)}
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
        data={REGIONS}
        keyExtractor={r => r}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.regionList}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.regionChip, selectedRegion === item && styles.regionChipActive]}
            onPress={() => setSelectedRegion(item)}
          >
            <Text style={[styles.regionText, selectedRegion === item && styles.regionTextActive]}>{item}</Text>
          </TouchableOpacity>
        )}
      />

      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        contentContainerStyle={[styles.list, { paddingBottom: Platform.OS === 'web' ? 34 + 84 : 90 }]}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="search-outline" size={48} color={Colors.gray300} />
            <Text style={styles.emptyText}>{tr('noData', language)}</Text>
          </View>
        }
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.surface },
  header: {
    backgroundColor: Colors.primary, paddingHorizontal: 20, paddingBottom: 16,
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerTitle: { fontSize: 22, fontWeight: '700' as const, color: '#fff' },
  headerSub: { fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  marketplaceBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 12, paddingVertical: 8, borderRadius: Colors.radiusFull,
  },
  marketplaceBtnText: { fontSize: 13, fontWeight: '600' as const, color: '#fff' },
  searchBar: {
    flexDirection: 'row', alignItems: 'center',
    margin: 16, backgroundColor: Colors.background,
    borderRadius: Colors.radius, paddingHorizontal: 14, paddingVertical: 10,
    borderWidth: 1.5, borderColor: Colors.border,
  },
  searchInput: { flex: 1, fontSize: 15, color: Colors.text },
  regionList: { paddingHorizontal: 16, paddingBottom: 10, gap: 8 },
  regionChip: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: Colors.radiusFull,
    backgroundColor: Colors.gray100, borderWidth: 1, borderColor: Colors.border,
  },
  regionChipActive: { backgroundColor: Colors.primaryMuted, borderColor: Colors.primary },
  regionText: { fontSize: 13, color: Colors.textSecondary, fontWeight: '500' as const },
  regionTextActive: { color: Colors.primary, fontWeight: '600' as const },
  list: { paddingHorizontal: 16, gap: 10 },
  priceCard: { padding: 14 },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  priceLeft: { flex: 1 },
  cropName: { fontSize: 15, fontWeight: '600' as const, color: Colors.text, marginBottom: 4 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: 12, color: Colors.textMuted },
  metaDot: { fontSize: 12, color: Colors.textMuted },
  priceRight: { alignItems: 'flex-end' },
  priceValue: { fontSize: 18, fontWeight: '700' as const, color: Colors.text },
  priceUnit: { fontSize: 12, color: Colors.textMuted },
  trendRow: { flexDirection: 'row', alignItems: 'center', gap: 2, marginTop: 2 },
  changeText: { fontSize: 13, fontWeight: '600' as const },
  empty: { alignItems: 'center', padding: 48, gap: 12 },
  emptyText: { fontSize: 15, color: Colors.textMuted },
});
