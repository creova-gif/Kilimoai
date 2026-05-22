/**
 * Contract Detail — full lifecycle controls + milestone tracking
 */
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { CheckCircle2, Circle, ArrowRight, X, PenLine, Banknote } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import PageScaffold, { GlassCard, SectionHeader } from '../../components/PageScaffold';
import { useTheme } from '../../constants/Theme';
import {
  useContractsStore, STATUS_LABEL, STATUS_COLOR, nextStatuses, ContractStatus,
} from '../../store/useContractsStore';
import { useKilimoStore } from '../../store/useKilimoStore';
import { Gate } from '../../lib/access';

const LIFECYCLE: ContractStatus[] = ['draft', 'sent', 'under_review', 'signed', 'active', 'milestone_due', 'completed'];
const fmt = (n: number) => new Intl.NumberFormat('en-US').format(n);

export default function ContractDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();
  const router = useRouter();
  const contract = useContractsStore((s) => s.contracts.find((c) => c.id === id));
  const advance = useContractsStore((s) => s.advance);
  const signAsFarmer = useContractsStore((s) => s.signAsFarmer);
  const signAsBuyer = useContractsStore((s) => s.signAsBuyer);
  const markMilestonePaid = useContractsStore((s) => s.markMilestonePaid);
  const addNotification = useKilimoStore((s) => s.addNotification);

  if (!contract) {
    return (
      <PageScaffold title="Mkataba" badge="NOT FOUND">
        <View style={{ padding: 24 }}>
          <Text style={{ color: colors.textMute }}>This contract no longer exists.</Text>
        </View>
      </PageScaffold>
    );
  }

  const total = contract.quantityKg * contract.pricePerKgTZS;
  const paid = contract.milestones.filter((m) => m.paid).reduce((s, m) => s + m.amountTZS, 0);
  const transitions = nextStatuses(contract.status);

  function handleAdvance(to: ContractStatus) {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const r = advance(contract!.id, to);
    if (!r.ok) {
      Alert.alert('Cannot advance', r.reason ?? 'Invalid transition');
    } else {
      addNotification({
        title: `Mkataba ${STATUS_LABEL[to]}`,
        body: `"${contract!.title}" → ${STATUS_LABEL[to]}`,
        type: 'info',
      });
    }
  }

  function handleSign() {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    signAsFarmer(contract!.id);
    // For demo flow: simulate buyer co-signing
    setTimeout(() => signAsBuyer(contract!.id), 800);
  }

  return (
    <Gate feature="contract_farming" fallback={<PageScaffold title="Mkataba" badge="CONTRACT"><View style={{ padding: 24 }}><Text style={{ color: colors.textMute }}>Hairuhusiwi.</Text></View></PageScaffold>}>
    <PageScaffold title={contract.title} subtitle={`${contract.buyer} · ${contract.region}`} badge="CONTRACT">
      {/* Status hero */}
      <View style={{ paddingHorizontal: 24 }}>
        <GlassCard style={{ padding: 20 }}>
          <View style={[s.statusPill, { backgroundColor: STATUS_COLOR[contract.status] + '25' }]}>
            <View style={[s.statusDot, { backgroundColor: STATUS_COLOR[contract.status] }]} />
            <Text style={[s.statusText, { color: STATUS_COLOR[contract.status] }]}>{STATUS_LABEL[contract.status].toUpperCase()}</Text>
          </View>
          <Text style={[s.heroValue, { color: colors.text }]}>TZS {fmt(total)}</Text>
          <Text style={[s.heroSub, { color: colors.textMute }]}>
            {fmt(contract.quantityKg)} kg @ TZS {fmt(contract.pricePerKgTZS)}/kg
          </Text>
        </GlassCard>
      </View>

      {/* Lifecycle tracker */}
      <SectionHeader title="Lifecycle" />
      <View style={{ paddingHorizontal: 24 }}>
        <GlassCard style={{ padding: 18 }}>
          {LIFECYCLE.map((step, i) => {
            const currentIdx = LIFECYCLE.indexOf(contract.status);
            const done = currentIdx > i;
            const current = step === contract.status;
            return (
              <View key={step} style={s.lifecycleRow}>
                <View style={[s.lifecycleDot, {
                  backgroundColor: done ? '#10b981' : current ? STATUS_COLOR[step] : colors.border,
                  borderColor: current ? STATUS_COLOR[step] : 'transparent',
                  borderWidth: current ? 3 : 0,
                }]}>
                  {done ? <CheckCircle2 size={14} color="#fff" /> : null}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[s.lifecycleLabel, {
                    color: current ? colors.text : done ? colors.text : colors.textMute,
                    fontFamily: current ? 'Inter_900Black' : 'Inter_600SemiBold',
                  }]}>
                    {STATUS_LABEL[step]}
                  </Text>
                </View>
                {i < LIFECYCLE.length - 1 && <View style={[s.lifecycleConnector, { backgroundColor: done ? '#10b981' : colors.border }]} />}
              </View>
            );
          })}
        </GlassCard>
      </View>

      {/* Actions */}
      {transitions.length > 0 && (
        <>
          <SectionHeader title="Hatua Inayofuata" />
          <View style={{ paddingHorizontal: 24, gap: 10 }}>
            {transitions.map((t) => {
              const isSign = t === 'signed' && !contract.signedByFarmerAt;
              const isDestructive = t === 'cancelled' || t === 'disputed';
              const destructiveColor = '#ef4444';
              return (
                <TouchableOpacity
                  key={t}
                  onPress={() => isSign ? handleSign() : handleAdvance(t)}
                  activeOpacity={0.85}
                  style={[s.actionBtn, {
                    backgroundColor: isDestructive ? destructiveColor + '20' : colors.primary,
                    borderColor: isDestructive ? destructiveColor + '60' : colors.primary,
                  }]}
                >
                  {isSign ? <PenLine size={18} color="#000" /> : isDestructive ? <X size={18} color={destructiveColor} /> : <ArrowRight size={18} color="#000" />}
                  <Text style={[s.actionText, { color: isDestructive ? destructiveColor : '#000' }]}>
                    {isSign ? 'Sign Digitally' : `Advance to ${STATUS_LABEL[t]}`}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </>
      )}

      {/* Signatures */}
      <SectionHeader title="Signatures" />
      <View style={{ paddingHorizontal: 24 }}>
        <GlassCard style={{ padding: 18 }}>
          <SignatureRow label="Farmer" when={contract.signedByFarmerAt} />
          <View style={[s.divider, { backgroundColor: colors.border }]} />
          <SignatureRow label="Buyer" when={contract.signedByBuyerAt} />
        </GlassCard>
      </View>

      {/* Milestones */}
      {contract.milestones.length > 0 && (
        <>
          <SectionHeader title={`Milestones · TZS ${fmt(paid)} / ${fmt(total)} paid`} />
          <View style={{ paddingHorizontal: 24, gap: 10 }}>
            {contract.milestones.map((m) => (
              <GlassCard key={m.id} style={{ padding: 16 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  {m.paid
                    ? <CheckCircle2 size={20} color="#10b981" />
                    : <Circle size={20} color={colors.textMute} />}
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={[s.milestoneLabel, { color: colors.text }]}>{m.label}</Text>
                    <Text style={[s.milestoneDue, { color: colors.textMute }]}>
                      Due {new Date(m.dueDate).toLocaleDateString('en-GB')} · TZS {fmt(m.amountTZS)}
                    </Text>
                  </View>
                  {!m.paid && (
                    <TouchableOpacity
                      onPress={() => {
                        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                        markMilestonePaid(contract!.id, m.id);
                      }}
                      style={[s.payBtn, { backgroundColor: colors.primary + '20', borderColor: colors.primary }]}
                    >
                      <Banknote size={12} color={colors.primary} />
                      <Text style={[s.payText, { color: colors.primary }]}>Mark Paid</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </GlassCard>
            ))}
          </View>
        </>
      )}
    </PageScaffold>
    </Gate>
  );
}

function SignatureRow({ label, when }: { label: string; when?: string }) {
  const { colors } = useTheme();
  return (
    <View style={s.sigRow}>
      <Text style={[s.sigLabel, { color: colors.textMute }]}>{label}</Text>
      {when ? (
        <View style={s.sigDone}>
          <CheckCircle2 size={14} color="#10b981" />
          <Text style={[s.sigDoneText, { color: '#10b981' }]}>
            Signed {new Date(when).toLocaleDateString('en-GB')}
          </Text>
        </View>
      ) : (
        <Text style={[s.sigPending, { color: colors.textMute }]}>Pending</Text>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  statusPill: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10, alignSelf: 'flex-start', marginBottom: 14 },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  statusText: { fontSize: 11, fontFamily: 'Inter_900Black', letterSpacing: 1.2 },
  heroValue: { fontSize: 32, fontFamily: 'Inter_900Black', letterSpacing: -1 },
  heroSub: { fontSize: 13, fontFamily: 'Inter_500Medium', marginTop: 4 },
  lifecycleRow: { flexDirection: 'row', alignItems: 'center', position: 'relative', minHeight: 36 },
  lifecycleDot: { width: 22, height: 22, borderRadius: 11, justifyContent: 'center', alignItems: 'center', marginRight: 14, zIndex: 2 },
  lifecycleLabel: { fontSize: 13 },
  lifecycleConnector: { position: 'absolute', left: 10, top: 28, width: 2, height: 16, zIndex: 1 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14, borderRadius: 14, borderWidth: 1 },
  actionText: { fontSize: 13, fontFamily: 'Inter_900Black', letterSpacing: 0.3 },
  sigRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 },
  sigLabel: { fontSize: 12, fontFamily: 'Inter_700Bold', letterSpacing: 0.5 },
  sigDone: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  sigDoneText: { fontSize: 12, fontFamily: 'Inter_800ExtraBold' },
  sigPending: { fontSize: 12, fontFamily: 'Inter_600SemiBold' },
  divider: { height: 1, marginVertical: 4 },
  milestoneLabel: { fontSize: 13, fontFamily: 'Inter_800ExtraBold' },
  milestoneDue: { fontSize: 11, fontFamily: 'Inter_500Medium', marginTop: 2 },
  payBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10, borderWidth: 1 },
  payText: { fontSize: 11, fontFamily: 'Inter_800ExtraBold' },
});
