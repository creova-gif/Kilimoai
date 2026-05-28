/**
 * Wallet Admin — Transactions ledger with filters
 */
import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { ArrowDownRight, ArrowUpRight, Receipt, ShieldCheck } from 'lucide-react-native';
import PageScaffold, { GlassCard, EmptyState } from '../../components/PageScaffold';
import { useTheme } from '../../constants/Theme';
import { Gate } from '../../lib/access';
import { useWalletAdminStore, Transaction, TxnType } from '../../store/useWalletAdminStore';

const FILTERS: { key: 'all' | TxnType; label: string }[] = [
  { key: 'all',      label: 'Yote' },
  { key: 'deposit',  label: 'Mapokezi' },
  { key: 'payout',   label: 'Malipo' },
  { key: 'fee',      label: 'Ada' },
  { key: 'transfer', label: 'Uhamishaji' },
];

const fmt = (n: number) => `TSh ${new Intl.NumberFormat('en-US').format(n)}`;

export default function TransactionsScreen() {
  const { colors } = useTheme();
  const transactions = useWalletAdminStore((s) => s.transactions);
  const [filter, setFilter] = useState<'all' | TxnType>('all');

  const filtered = useMemo(
    () => (filter === 'all' ? transactions : transactions.filter((t) => t.type === filter)),
    [transactions, filter],
  );

  const renderItem = ({ item }: { item: Transaction }) => {
    const isOut = item.type === 'payout' || item.type === 'fee';
    const color = isOut
      ? '#ef4444'
      : item.status === 'failed' || item.status === 'reversed'
      ? '#94a3b8'
      : '#22d15a';
    return (
      <GlassCard style={s.card}>
        <View style={[s.icon, { backgroundColor: `${color}22` }]}>
          {isOut ? <ArrowUpRight size={16} color={color} /> : <ArrowDownRight size={16} color={color} />}
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[s.name, { color: colors.text }]} numberOfLines={1}>{item.memberName}</Text>
          <Text style={[s.sub, { color: colors.textMute }]} numberOfLines={1}>
            {item.reference}{item.note ? ` · ${item.note}` : ''}
          </Text>
          <Text style={[s.meta, { color: colors.textMute }]} numberOfLines={1}>
            {new Date(item.createdAt).toLocaleString()} · <Text style={{ color }}>{item.status}</Text>
          </Text>
        </View>
        <Text style={[s.amount, { color }]}>
          {isOut ? '-' : '+'}{fmt(item.amountTZS)}
        </Text>
      </GlassCard>
    );
  };

  return (
    <Gate
      feature="wallet_admin"
      fallback={<PageScaffold title="Daftari la Miamala" badge="ENTERPRISE"><GlassCard style={{ margin: 24, padding: 24, alignItems: 'center', gap: 12 }}><ShieldCheck size={32} color="#64748b" /><Text style={{ fontFamily: 'Inter_700Bold', fontSize: 16, color: '#64748b', textAlign: 'center' }}>Hairuhusiwi{'\n'}Daftari hili ni kwa Viongozi wa Ushirika na Wasimamizi pekee.</Text></GlassCard></PageScaffold>}
    >
      <PageScaffold title="Daftari la Miamala" subtitle="Ledger" badge="ENTERPRISE">
        <View style={s.filterRow}>
          {FILTERS.map((f) => {
            const active = filter === f.key;
            return (
              <TouchableOpacity
                key={f.key}
                onPress={() => setFilter(f.key)}
                style={[
                  s.pill,
                  {
                    backgroundColor: active ? colors.primary : colors.card,
                    borderColor: active ? colors.primary : colors.border,
                  },
                ]}
              >
                <Text style={[s.pillText, { color: active ? '#000' : colors.text }]}>{f.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {filtered.length === 0 ? (
          <View style={{ padding: 24 }}>
            <EmptyState
              icon={<Receipt size={32} color={colors.textMute} />}
              title="Hakuna miamala"
              body="Hakuna miamala kwa kichujio ulichochagua."
            />
          </View>
        ) : (
          <FlatList showsVerticalScrollIndicator={false} data={filtered}
            keyExtractor={(i) => i.id}
            renderItem={renderItem}
            contentContainerStyle={{ padding: 16, gap: 10, paddingBottom: 80 }}
          />
        )}
      </PageScaffold>
    </Gate>
  );
}

const s = StyleSheet.create({
  filterRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingHorizontal: 16, paddingTop: 12 },
  pill:      { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999, borderWidth: StyleSheet.hairlineWidth },
  pillText:  { fontFamily: 'Inter_700Bold', fontSize: 11 },
  card:      { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
  icon:      { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  name:      { fontFamily: 'Inter_700Bold', fontSize: 13 },
  sub:       { fontFamily: 'Inter_500Medium', fontSize: 11, marginTop: 2 },
  meta:      { fontFamily: 'Inter_500Medium', fontSize: 10, marginTop: 2 },
  amount:    { fontFamily: 'InstrumentSerif_400Regular', fontSize: 18, letterSpacing: -0.3 },
});
