/**
 * Input Supply — vetted suppliers + in-app ordering
 */
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Store, Star, ShieldCheck, Truck, Package, MapPin, AlertTriangle } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import PageScaffold, { GlassCard, SectionHeader, EmptyState } from '../components/PageScaffold';
import { useTheme } from '../constants/Theme';
import { useFarmDataStore, InputOrder } from '../store/useFarmDataStore';
import { Gate } from '../lib/access';

const fmt = (n: number) => new Intl.NumberFormat('en-US').format(n);

const ORDER_STATUS = {
  cart: { color: '#94a3b8', label: 'Cart' },
  placed: { color: '#3b82f6', label: 'Imewekwa' },
  dispatched: { color: '#f59e0b', label: 'Inasafirishwa' },
  delivered: { color: '#10b981', label: 'Imefika' },
  cancelled: { color: '#ef4444', label: 'Imefutwa' },
};

export default function InputSupplyScreen() {
  const { colors } = useTheme();
  const suppliers = useFarmDataStore((s) => s.suppliers);
  const orders = useFarmDataStore((s) => s.orders);
  const placeOrder = useFarmDataStore((s) => s.placeOrder);
  const advanceOrder = useFarmDataStore((s) => s.advanceOrder);

  function handleOrderSample(supplierId: string) {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const supplier = suppliers.find((s) => s.id === supplierId);
    placeOrder({
      supplierId,
      itemName: `${supplier?.category ?? 'Item'} bundle`,
      qty: 4, unit: 'bag', totalTZS: 320_000,
      expectedDelivery: new Date(Date.now() + 3 * 86400_000).toISOString(),
    });
  }

  return (
    <Gate feature="input_supply" fallback={<PageScaffold title="Pembejeo" badge="INPUT SUPPLY"><AccessDenied /></PageScaffold>}>
      <PageScaffold title="Pembejeo" subtitle="Vetted suppliers · in-app ordering" badge="INPUT SUPPLY">

        {orders.length > 0 && (
          <>
            <SectionHeader title={`Maagizo yangu · ${orders.length} orders`} />
            <View style={{ paddingHorizontal: 24, gap: 10 }}>
              {orders.map((o) => <OrderCard key={o.id} order={o} onAdvance={advanceOrder} />)}
            </View>
          </>
        )}

        <SectionHeader title="Wauzaji Walothibitishwa" />
        <View style={{ paddingHorizontal: 24, gap: 10 }}>
          {suppliers.map((sup) => (
            <GlassCard key={sup.id} style={{ padding: 18 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={[s.logoBg, { backgroundColor: colors.primary + '15' }]}>
                  <Store size={22} color={colors.primary} />
                </View>
                <View style={{ flex: 1, marginLeft: 14 }}>
                  <View style={s.nameRow}>
                    <Text style={[s.supName, { color: colors.text }]} numberOfLines={1}>{sup.name}</Text>
                    {sup.vetted && (
                      <View style={[s.vetBadge, { backgroundColor: '#10b98125' }]}>
                        <ShieldCheck size={9} color="#10b981" />
                        <Text style={[s.vetText, { color: '#10b981' }]}>VETTED</Text>
                      </View>
                    )}
                  </View>
                  <View style={s.metaRow}>
                    <MapPin size={10} color={colors.textMute} />
                    <Text style={[s.meta, { color: colors.textMute }]}>{sup.region}</Text>
                    <Star size={10} color="#f59e0b" style={{ marginLeft: 8 }} fill="#f59e0b" />
                    <Text style={[s.meta, { color: colors.textMute }]}>{sup.rating.toFixed(1)}</Text>
                    <Text style={[s.meta, { color: colors.textMute, marginLeft: 8 }]}>· {sup.category}</Text>
                  </View>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => handleOrderSample(sup.id)}
                style={[s.orderBtn, { backgroundColor: colors.primary + '20', borderColor: colors.primary }]}
                activeOpacity={0.8}
              >
                <Package size={14} color={colors.primary} />
                <Text style={[s.orderText, { color: colors.primary }]}>Place Sample Order</Text>
              </TouchableOpacity>
            </GlassCard>
          ))}
        </View>
      </PageScaffold>
    </Gate>
  );
}

function OrderCard({ order, onAdvance }: { order: InputOrder; onAdvance: (id: string, status: any) => void }) {
  const { colors } = useTheme();
  const meta = ORDER_STATUS[order.status];
  return (
    <GlassCard style={{ padding: 16 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Truck size={18} color={meta.color} />
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={[s.orderName, { color: colors.text }]}>{order.itemName}</Text>
          <Text style={[s.orderMeta, { color: colors.textMute }]}>
            {order.qty}{order.unit} · TZS {fmt(order.totalTZS)}
          </Text>
        </View>
        <View style={[s.orderStatus, { backgroundColor: meta.color + '25' }]}>
          <Text style={[s.orderStatusText, { color: meta.color }]}>{meta.label}</Text>
        </View>
      </View>
      {order.status === 'dispatched' && (
        <TouchableOpacity
          onPress={() => { Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); onAdvance(order.id, 'delivered'); }}
          style={[s.confirmBtn, { backgroundColor: '#10b98125' }]}
        >
          <Text style={[s.confirmText, { color: '#10b981' }]}>Confirm Delivery</Text>
        </TouchableOpacity>
      )}
    </GlassCard>
  );
}

function AccessDenied() {
  return <EmptyState icon={<AlertTriangle size={36} color="#f59e0b" />} title="Haipatikani" body="Input supply haipatikani kwa jukumu lako." />;
}

const s = StyleSheet.create({
  logoBg: { width: 48, height: 48, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  supName: { fontSize: 15, fontFamily: 'Inter_900Black', flex: 1 },
  vetBadge: { flexDirection: 'row', alignItems: 'center', gap: 3, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  vetText: { fontSize: 8, fontFamily: 'Inter_900Black', letterSpacing: 0.5 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 4 },
  meta: { fontSize: 11, fontFamily: 'Inter_600SemiBold' },
  orderBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 14, paddingVertical: 10, borderRadius: 12, borderWidth: 1 },
  orderText: { fontSize: 12, fontFamily: 'Inter_900Black', letterSpacing: 0.3 },
  orderName: { fontSize: 13, fontFamily: 'Inter_800ExtraBold' },
  orderMeta: { fontSize: 11, fontFamily: 'Inter_500Medium', marginTop: 2 },
  orderStatus: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  orderStatusText: { fontSize: 10, fontFamily: 'Inter_900Black', letterSpacing: 0.5 },
  confirmBtn: { marginTop: 10, paddingVertical: 8, borderRadius: 10, alignItems: 'center' },
  confirmText: { fontSize: 12, fontFamily: 'Inter_900Black' },
});
