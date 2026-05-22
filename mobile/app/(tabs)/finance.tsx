import { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Modal, TextInput, Platform, Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Colors } from '@/constants/colors';
import { useAuth } from '@/src/context/AuthContext';
import { tr } from '@/src/utils/translations';
import { Card } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';

interface Transaction {
  id: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  description: string;
  date: string;
}

const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: '1', type: 'income', category: 'Crop Sales', amount: 45200, description: 'Maize sold - Nairobi market', date: '2026-05-07' },
  { id: '2', type: 'expense', category: 'Inputs', amount: 8500, description: 'Fertilizer purchase', date: '2026-05-06' },
  { id: '3', type: 'income', category: 'Livestock', amount: 12000, description: 'Milk sales - weekly', date: '2026-05-05' },
  { id: '4', type: 'expense', category: 'Labour', amount: 4200, description: 'Farmhands - 3 days', date: '2026-05-04' },
  { id: '5', type: 'expense', category: 'Equipment', amount: 2800, description: 'Irrigation pipe repair', date: '2026-05-03' },
  { id: '6', type: 'income', category: 'Crop Sales', amount: 18600, description: 'Beans sold - cooperative', date: '2026-05-02' },
];

const CATEGORIES = {
  income: ['Crop Sales', 'Livestock', 'Grants', 'Other Income'],
  expense: ['Inputs', 'Labour', 'Equipment', 'Transport', 'Other Expense'],
};

const MPESA_SERVICES = [
  { icon: 'arrow-up-circle' as const, label: { en: 'Send Money', sw: 'Tuma Pesa' }, color: '#1565C0', bg: '#E3F2FD' },
  { icon: 'arrow-down-circle' as const, label: { en: 'Receive', sw: 'Pokea' }, color: Colors.success, bg: Colors.successLight },
  { icon: 'card' as const, label: { en: 'Pay Bill', sw: 'Lipa Bili' }, color: '#E65100', bg: '#FBE9E7' },
  { icon: 'phone-portrait' as const, label: { en: 'Buy Airtime', sw: 'Nunua Muda' }, color: '#6A1B9A', bg: '#F3E5F5' },
];

export default function FinanceScreen() {
  const insets = useSafeAreaInsets();
  const { language } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [activeView, setActiveView] = useState<'overview' | 'records' | 'mpesa'>('overview');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTx, setNewTx] = useState({
    type: 'income' as 'income' | 'expense',
    category: 'Crop Sales',
    amount: '',
    description: '',
  });

  const topInset = Platform.OS === 'web' ? 67 : insets.top;

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const profit = totalIncome - totalExpense;

  const addTransaction = () => {
    const amount = parseFloat(newTx.amount);
    if (!newTx.description.trim() || isNaN(amount) || amount <= 0) {
      Alert.alert('Error', 'Please fill in all fields with valid values');
      return;
    }
    const tx: Transaction = {
      id: Date.now().toString(),
      type: newTx.type,
      category: newTx.category,
      amount,
      description: newTx.description,
      date: new Date().toISOString().split('T')[0],
    };
    setTransactions(prev => [tx, ...prev]);
    setNewTx({ type: 'income', category: 'Crop Sales', amount: '', description: '' });
    setShowAddModal(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const VIEWS = [
    { id: 'overview' as const, label: language === 'sw' ? 'Muhtasari' : 'Overview' },
    { id: 'records' as const, label: language === 'sw' ? 'Rekodi' : 'Records' },
    { id: 'mpesa' as const, label: 'M-Pesa' },
  ];

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: topInset + 12 }]}>
        <Text style={styles.headerTitle}>{tr('finance', language)}</Text>

        <View style={styles.balanceRow}>
          <View style={styles.balanceItem}>
            <Ionicons name="arrow-up" size={14} color="rgba(255,255,255,0.8)" />
            <Text style={styles.balanceLabel}>{tr('income', language)}</Text>
            <Text style={styles.balanceValue}>KSh {totalIncome.toLocaleString()}</Text>
          </View>
          <View style={styles.balanceDivider} />
          <View style={styles.balanceItem}>
            <Ionicons name="arrow-down" size={14} color="rgba(255,255,255,0.8)" />
            <Text style={styles.balanceLabel}>{tr('expenses', language)}</Text>
            <Text style={styles.balanceValue}>KSh {totalExpense.toLocaleString()}</Text>
          </View>
          <View style={styles.balanceDivider} />
          <View style={styles.balanceItem}>
            <Ionicons name="trending-up" size={14} color="rgba(255,255,255,0.8)" />
            <Text style={styles.balanceLabel}>{tr('profit', language)}</Text>
            <Text style={[styles.balanceValue, { color: profit >= 0 ? '#A5D6A7' : '#EF9A9A' }]}>
              KSh {profit.toLocaleString()}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.viewTabs}>
        {VIEWS.map(v => (
          <TouchableOpacity
            key={v.id}
            style={[styles.viewTab, activeView === v.id && styles.viewTabActive]}
            onPress={() => setActiveView(v.id)}
          >
            <Text style={[styles.viewTabText, activeView === v.id && styles.viewTabTextActive]}>{v.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingBottom: Platform.OS === 'web' ? 34 + 84 : 90 }]}
      >
        {activeView === 'overview' && (
          <>
            <View style={styles.statsGrid}>
              <StatBox icon="leaf" label={language === 'sw' ? 'Mauzo ya Mazao' : 'Crop Sales'} value="KSh 63,800" color={Colors.primary} />
              <StatBox icon="paw" label={language === 'sw' ? 'Mifugo' : 'Livestock'} value="KSh 12,000" color="#1565C0" />
              <StatBox icon="flask" label={language === 'sw' ? 'Pembejeo' : 'Inputs'} value="KSh 8,500" color={Colors.error} />
              <StatBox icon="people" label={language === 'sw' ? 'Wafanyakazi' : 'Labour'} value="KSh 4,200" color={Colors.warning} />
            </View>

            <Text style={styles.sectionTitle}>{language === 'sw' ? 'Shughuli za Hivi Karibuni' : 'Recent Transactions'}</Text>
            {transactions.slice(0, 4).map(tx => (
              <TxRow key={tx.id} tx={tx} />
            ))}

            <TouchableOpacity style={styles.viewAllBtn} onPress={() => setActiveView('records')}>
              <Text style={styles.viewAllText}>{language === 'sw' ? 'Tazama zote' : 'View all transactions'}</Text>
              <Ionicons name="chevron-forward" size={16} color={Colors.primary} />
            </TouchableOpacity>
          </>
        )}

        {activeView === 'records' && (
          <>
            <TouchableOpacity style={styles.addBtn} onPress={() => setShowAddModal(true)} activeOpacity={0.85}>
              <Ionicons name="add-circle" size={20} color={Colors.primary} />
              <Text style={styles.addBtnText}>{tr('addRecord', language)}</Text>
            </TouchableOpacity>
            {transactions.map(tx => (
              <TxRow key={tx.id} tx={tx} />
            ))}
          </>
        )}

        {activeView === 'mpesa' && (
          <>
            <Card style={styles.mpesaBalance}>
              <Text style={styles.mpesaBalanceLabel}>M-Pesa {language === 'sw' ? 'Salio' : 'Balance'}</Text>
              <Text style={styles.mpesaBalanceValue}>KSh 23,450.00</Text>
              <Text style={styles.mpesaPhone}>+254 7XX XXX XXX</Text>
            </Card>

            <Text style={styles.sectionTitle}>{language === 'sw' ? 'Huduma' : 'Services'}</Text>
            <View style={styles.mpesaGrid}>
              {MPESA_SERVICES.map((s, i) => (
                <TouchableOpacity key={i} style={styles.mpesaCard} activeOpacity={0.8}
                  onPress={() => Alert.alert('M-Pesa', language === 'sw' ? 'Unganisha na akaunti yako ya M-Pesa kwenye mipangilio.' : 'Connect your M-Pesa account in settings to use this feature.')}>
                  <View style={[styles.mpesaIcon, { backgroundColor: s.bg }]}>
                    <Ionicons name={s.icon} size={28} color={s.color} />
                  </View>
                  <Text style={styles.mpesaLabel}>{s.label[language]}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.sectionTitle}>{language === 'sw' ? 'Historia ya Miamala' : 'Transaction History'}</Text>
            {[
              { icon: 'arrow-up', label: language === 'sw' ? 'Tuma - John Kamau' : 'Sent - John Kamau', amount: '-KSh 5,000', date: 'Today 09:23', color: Colors.error },
              { icon: 'arrow-down', label: language === 'sw' ? 'Pokea - Mary Wanjiku' : 'Received - Mary Wanjiku', amount: '+KSh 12,000', date: 'Yesterday 14:10', color: Colors.success },
              { icon: 'card', label: language === 'sw' ? 'Lipa Bili - KPLC' : 'Bill - KPLC Token', amount: '-KSh 2,500', date: 'May 05 11:30', color: Colors.error },
            ].map((item, i) => (
              <Card key={i} style={styles.mpesaTx}>
                <View style={styles.mpesaTxRow}>
                  <View style={[styles.mpesaTxIcon, { backgroundColor: item.color + '20' }]}>
                    <Ionicons name={item.icon as any} size={18} color={item.color} />
                  </View>
                  <View style={styles.mpesaTxInfo}>
                    <Text style={styles.mpesaTxLabel}>{item.label}</Text>
                    <Text style={styles.mpesaTxDate}>{item.date}</Text>
                  </View>
                  <Text style={[styles.mpesaTxAmount, { color: item.color }]}>{item.amount}</Text>
                </View>
              </Card>
            ))}
          </>
        )}
      </ScrollView>

      <Modal visible={showAddModal} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setShowAddModal(false)}>
        <View style={styles.modal}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{tr('addRecord', language)}</Text>
            <TouchableOpacity onPress={() => setShowAddModal(false)}>
              <Ionicons name="close" size={24} color={Colors.text} />
            </TouchableOpacity>
          </View>

          <View style={styles.txTypeTabs}>
            {(['income', 'expense'] as const).map(t => (
              <TouchableOpacity
                key={t}
                style={[styles.txTypeTab, newTx.type === t && { backgroundColor: t === 'income' ? Colors.successLight : Colors.errorLight, borderColor: t === 'income' ? Colors.success : Colors.error }]}
                onPress={() => setNewTx(prev => ({ ...prev, type: t, category: CATEGORIES[t][0] }))}
              >
                <Ionicons name={t === 'income' ? 'arrow-up' : 'arrow-down'} size={16} color={t === 'income' ? Colors.success : Colors.error} />
                <Text style={[styles.txTypeText, { color: t === 'income' ? Colors.success : Colors.error }]}>
                  {t === 'income' ? tr('income', language) : tr('expenses', language)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.modalLabel}>{language === 'sw' ? 'Kiasi (KSh)' : 'Amount (KSh)'}</Text>
          <TextInput
            style={styles.modalInput}
            value={newTx.amount}
            onChangeText={t => setNewTx(prev => ({ ...prev, amount: t }))}
            placeholder="0.00"
            placeholderTextColor={Colors.textMuted}
            keyboardType="numeric"
          />

          <Text style={styles.modalLabel}>{language === 'sw' ? 'Maelezo' : 'Description'}</Text>
          <TextInput
            style={styles.modalInput}
            value={newTx.description}
            onChangeText={t => setNewTx(prev => ({ ...prev, description: t }))}
            placeholder={language === 'sw' ? 'Eleza muamala...' : 'Describe transaction...'}
            placeholderTextColor={Colors.textMuted}
          />

          <Button title={language === 'sw' ? 'Hifadhi' : 'Save Record'} onPress={addTransaction} fullWidth style={{ marginTop: 24 }} />
        </View>
      </Modal>
    </View>
  );
}

function TxRow({ tx }: { tx: Transaction }) {
  return (
    <Card style={styles.txCard}>
      <View style={styles.txRow}>
        <View style={[styles.txIcon, { backgroundColor: tx.type === 'income' ? Colors.successLight : Colors.errorLight }]}>
          <Ionicons name={tx.type === 'income' ? 'arrow-up' : 'arrow-down'} size={16} color={tx.type === 'income' ? Colors.success : Colors.error} />
        </View>
        <View style={styles.txBody}>
          <Text style={styles.txDesc} numberOfLines={1}>{tx.description}</Text>
          <Text style={styles.txMeta}>{tx.category} · {tx.date}</Text>
        </View>
        <Text style={[styles.txAmount, { color: tx.type === 'income' ? Colors.success : Colors.error }]}>
          {tx.type === 'income' ? '+' : '-'}KSh {tx.amount.toLocaleString()}
        </Text>
      </View>
    </Card>
  );
}

function StatBox({ icon, label, value, color }: { icon: string; label: string; value: string; color: string }) {
  return (
    <Card style={styles.statBox}>
      <Ionicons name={icon as any} size={20} color={color} />
      <Text style={styles.statBoxValue}>{value}</Text>
      <Text style={styles.statBoxLabel} numberOfLines={2}>{label}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.surface },
  header: { backgroundColor: Colors.primary, paddingHorizontal: 20, paddingBottom: 20 },
  headerTitle: { fontSize: 22, fontWeight: '700' as const, color: '#fff', marginBottom: 16 },
  balanceRow: { flexDirection: 'row', alignItems: 'center' },
  balanceItem: { flex: 1, alignItems: 'center', gap: 4 },
  balanceDivider: { width: 1, height: 40, backgroundColor: 'rgba(255,255,255,0.2)' },
  balanceLabel: { fontSize: 11, color: 'rgba(255,255,255,0.75)' },
  balanceValue: { fontSize: 14, fontWeight: '700' as const, color: '#fff' },
  viewTabs: {
    flexDirection: 'row', backgroundColor: Colors.background,
    paddingHorizontal: 16, paddingVertical: 8, gap: 8,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  viewTab: {
    flex: 1, alignItems: 'center', paddingVertical: 8, borderRadius: Colors.radiusSm,
  },
  viewTabActive: { backgroundColor: Colors.primaryMuted },
  viewTabText: { fontSize: 13, color: Colors.textMuted, fontWeight: '500' as const },
  viewTabTextActive: { color: Colors.primary, fontWeight: '600' as const },
  content: { padding: 16, gap: 12 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  statBox: {
    flex: 1, minWidth: '45%', padding: 14, gap: 6, alignItems: 'flex-start',
  },
  statBoxValue: { fontSize: 16, fontWeight: '700' as const, color: Colors.text },
  statBoxLabel: { fontSize: 12, color: Colors.textMuted, lineHeight: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '700' as const, color: Colors.text },
  txCard: { padding: 14 },
  txRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  txIcon: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  txBody: { flex: 1 },
  txDesc: { fontSize: 14, fontWeight: '500' as const, color: Colors.text },
  txMeta: { fontSize: 12, color: Colors.textMuted, marginTop: 2 },
  txAmount: { fontSize: 15, fontWeight: '700' as const },
  viewAllBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 4, paddingVertical: 12,
  },
  viewAllText: { fontSize: 14, color: Colors.primary, fontWeight: '600' as const },
  addBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: Colors.primaryMuted, borderRadius: Colors.radius,
    paddingVertical: 12, borderWidth: 1.5, borderColor: Colors.primary, borderStyle: 'dashed',
  },
  addBtnText: { fontSize: 14, fontWeight: '600' as const, color: Colors.primary },
  mpesaBalance: {
    backgroundColor: Colors.primary, padding: 20, alignItems: 'center', gap: 8,
  },
  mpesaBalanceLabel: { fontSize: 14, color: 'rgba(255,255,255,0.8)' },
  mpesaBalanceValue: { fontSize: 32, fontWeight: '800' as const, color: '#fff' },
  mpesaPhone: { fontSize: 13, color: 'rgba(255,255,255,0.7)' },
  mpesaGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  mpesaCard: {
    flex: 1, minWidth: '45%', backgroundColor: Colors.card, borderRadius: Colors.radius,
    padding: 16, alignItems: 'center', gap: 10,
    borderWidth: 1, borderColor: Colors.border,
  },
  mpesaIcon: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
  mpesaLabel: { fontSize: 13, fontWeight: '500' as const, color: Colors.text, textAlign: 'center' },
  mpesaTx: { padding: 14 },
  mpesaTxRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  mpesaTxIcon: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  mpesaTxInfo: { flex: 1 },
  mpesaTxLabel: { fontSize: 14, fontWeight: '500' as const, color: Colors.text },
  mpesaTxDate: { fontSize: 12, color: Colors.textMuted },
  mpesaTxAmount: { fontSize: 14, fontWeight: '700' as const },
  modal: { flex: 1, padding: 24, backgroundColor: Colors.background },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  modalTitle: { fontSize: 20, fontWeight: '700' as const, color: Colors.text },
  txTypeTabs: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  txTypeTab: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    paddingVertical: 12, borderRadius: Colors.radius, borderWidth: 1.5, borderColor: Colors.border,
  },
  txTypeText: { fontSize: 14, fontWeight: '600' as const },
  modalLabel: { fontSize: 14, fontWeight: '500' as const, color: Colors.text, marginBottom: 8 },
  modalInput: {
    borderWidth: 1.5, borderColor: Colors.border, borderRadius: Colors.radius,
    padding: 14, fontSize: 15, color: Colors.text, marginBottom: 16, backgroundColor: Colors.gray50,
  },
});
