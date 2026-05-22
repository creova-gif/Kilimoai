/**
 * Inventory Management — input stock + low-stock alerts
 */
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Package, AlertTriangle, Plus, Minus, Boxes, Sprout } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import PageScaffold, { GlassCard, SectionHeader, EmptyState } from '../components/PageScaffold';
import { useTheme } from '../constants/Theme';
import { useFarmDataStore } from '../store/useFarmDataStore';
import { Gate } from '../lib/access';

const CAT_COLOR: Record<string, string> = {
  seed: '#10b981', fertilizer: '#3b82f6', pesticide: '#f59e0b', feed: '#8b5cf6', tool: '#64748b', other: '#94a3b8',
};

const fmt = (n: number) => new Intl.NumberFormat('en-US').format(n);

export default function InventoryScreen() {
  const { colors } = useTheme();
  const items = useFarmDataStore((s) => s.inventory);
  const adjust = useFarmDataStore((s) => s.adjustItem);
  const addItem = useFarmDataStore((s) => s.addItem);

  const lowStock = items.filter((i) => i.qty <= i.lowStockAt);
  const totalValue = items.reduce((sum, i) => sum + i.qty * (i.costPerUnitTZS ?? 0), 0);

  function handleAdd() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    addItem({ name: 'New item', category: 'other', unit: 'piece', qty: 1, lowStockAt: 0 });
  }

  return (
    <Gate feature="inventory" fallback={<PageScaffold title="Pembejeo" badge="INVENTORY"><AccessDenied /></PageScaffold>}>
      <PageScaffold
        title="Pembejeo"
        subtitle={`${items.length} items · TZS ${fmt(totalValue)} on hand`}
        badge="INVENTORY"
        headerRight={
          <TouchableOpacity onPress={handleAdd} style={[s.addBtn, { backgroundColor: colors.primary }]}>
            <Plus size={20} color="#000" />
          </TouchableOpacity>
        }
      >
        {lowStock.length > 0 && (
          <>
            <SectionHeader title={`${lowStock.length} items low on stock`} />
            <View style={{ paddingHorizontal: 24 }}>
              <GlassCard style={[s.alert, { borderColor: '#ef444460' }]}>
                <AlertTriangle size={20} color="#ef4444" />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={[s.alertTitle, { color: colors.text }]}>Stock chini</Text>
                  <Text style={[s.alertBody, { color: colors.textMute }]} numberOfLines={2}>
                    {lowStock.map((i) => `${i.name} (${i.qty}${i.unit})`).join(', ')}
                  </Text>
                </View>
              </GlassCard>
            </View>
          </>
        )}

        <SectionHeader title="Stock" />
        {items.length === 0 ? (
          <EmptyState
            icon={<Boxes size={36} color={colors.primary} />}
            title="Hakuna pembejeo"
            body="Anza kufuatilia mbegu, mbolea na zana zako."
            cta="Ongeza Bidhaa"
            onCta={handleAdd}
          />
        ) : (
          <View style={{ paddingHorizontal: 24, gap: 10 }}>
            {items.map((i) => {
              const low = i.qty <= i.lowStockAt;
              return (
                <GlassCard key={i.id} style={{ padding: 16 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={[s.catBg, { backgroundColor: (CAT_COLOR[i.category] ?? '#94a3b8') + '20' }]}>
                      <Sprout size={20} color={CAT_COLOR[i.category] ?? '#94a3b8'} />
                    </View>
                    <View style={{ flex: 1, marginLeft: 14 }}>
                      <Text style={[s.itemName, { color: colors.text }]} numberOfLines={1}>{i.name}</Text>
                      <Text style={[s.itemMeta, { color: colors.textMute }]}>
                        {i.category.toUpperCase()} {i.supplier ? `· ${i.supplier}` : ''}
                      </Text>
                    </View>
                    <View style={s.qtyControl}>
                      <TouchableOpacity onPress={() => { Haptics.selectionAsync(); adjust(i.id, -1); }} style={[s.qtyBtn, { borderColor: colors.border }]}>
                        <Minus size={14} color={colors.text} />
                      </TouchableOpacity>
                      <Text style={[s.qtyText, { color: low ? '#ef4444' : colors.text }]}>{i.qty}{i.unit}</Text>
                      <TouchableOpacity onPress={() => { Haptics.selectionAsync(); adjust(i.id, 1); }} style={[s.qtyBtn, { borderColor: colors.border }]}>
                        <Plus size={14} color={colors.text} />
                      </TouchableOpacity>
                    </View>
                  </View>
                  {low && (
                    <View style={[s.lowBar, { backgroundColor: '#ef444415', borderColor: '#ef444440' }]}>
                      <AlertTriangle size={11} color="#ef4444" />
                      <Text style={[s.lowText, { color: '#ef4444' }]}>Below reorder threshold ({i.lowStockAt}{i.unit})</Text>
                    </View>
                  )}
                </GlassCard>
              );
            })}
          </View>
        )}
      </PageScaffold>
    </Gate>
  );
}

function AccessDenied() {
  return (
    <EmptyState
      icon={<AlertTriangle size={36} color="#f59e0b" />}
      title="Haipatikani"
      body="Kipengele cha pembejeo hakipatikani kwa jukumu lako la sasa."
    />
  );
}

const s = StyleSheet.create({
  addBtn: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  alert: { flexDirection: 'row', alignItems: 'center', padding: 16, borderWidth: 1 },
  alertTitle: { fontSize: 13, fontFamily: 'Inter_900Black' },
  alertBody: { fontSize: 11, fontFamily: 'Inter_500Medium', marginTop: 2 },
  catBg: { width: 44, height: 44, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  itemName: { fontSize: 14, fontFamily: 'Inter_800ExtraBold' },
  itemMeta: { fontSize: 10, fontFamily: 'Inter_700Bold', letterSpacing: 1, marginTop: 2 },
  qtyControl: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  qtyBtn: { width: 28, height: 28, borderRadius: 8, borderWidth: 1, justifyContent: 'center', alignItems: 'center' },
  qtyText: { fontSize: 14, fontFamily: 'Inter_900Black', minWidth: 50, textAlign: 'center' },
  lowBar: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 12, padding: 8, borderRadius: 10, borderWidth: 1 },
  lowText: { fontSize: 11, fontFamily: 'Inter_700Bold' },
});
