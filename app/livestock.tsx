/**
 * Livestock Tracking — health records + vaccination schedule
 */
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Beef, Egg, Heart, AlertTriangle, CheckCircle2, Plus, Syringe } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import PageScaffold, { GlassCard, SectionHeader, EmptyState } from '../components/PageScaffold';
import { useTheme } from '../constants/Theme';
import { useFarmDataStore, LivestockSpecies } from '../store/useFarmDataStore';
import { Gate } from '../lib/access';

const SPECIES_ICON: Record<LivestockSpecies, any> = {
  cattle: Beef, goat: Beef, sheep: Beef, poultry: Egg, pig: Beef,
};

const STATUS_COLOR = { healthy: '#10b981', attention: '#f59e0b', sick: '#ef4444' };
const STATUS_LABEL = { healthy: 'Mzima', attention: 'Tahadhari', sick: 'Mgonjwa' };

export default function LivestockScreen() {
  const { colors } = useTheme();
  const animals = useFarmDataStore((s) => s.livestock);
  const addAnimal = useFarmDataStore((s) => s.addAnimal);

  function handleAdd() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const tag = `TZ-${Math.floor(Math.random() * 9000 + 1000)}`;
    addAnimal({
      tag, species: 'cattle', healthStatus: 'healthy',
      nextVaccineDue: new Date(Date.now() + 90 * 86400_000).toISOString(),
    });
  }

  const dueSoon = animals.filter((a) => {
    if (!a.nextVaccineDue) return false;
    const days = (new Date(a.nextVaccineDue).getTime() - Date.now()) / 86400_000;
    return days < 30;
  });

  return (
    <Gate
      feature="livestock"
      fallback={<PageScaffold title="Mifugo" badge="LIVESTOCK"><AccessDenied /></PageScaffold>}
    >
      <PageScaffold
        title="Mifugo"
        subtitle={`${animals.length} animal records`}
        badge="LIVESTOCK"
        headerRight={
          <TouchableOpacity onPress={handleAdd} style={[s.addBtn, { backgroundColor: colors.primary }]}>
            <Plus size={20} color="#000" />
          </TouchableOpacity>
        }
      >
        {dueSoon.length > 0 && (
          <>
            <SectionHeader title={`${dueSoon.length} vaccinations due soon`} />
            <View style={{ paddingHorizontal: 24 }}>
              <GlassCard style={[s.alertCard, { borderColor: '#f59e0b80' }]}>
                <Syringe size={20} color="#f59e0b" />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={[s.alertTitle, { color: colors.text }]}>Chanjo zinakaribia</Text>
                  <Text style={[s.alertBody, { color: colors.textMute }]}>
                    {dueSoon.map((a) => a.tag).join(', ')} due within 30 days
                  </Text>
                </View>
              </GlassCard>
            </View>
          </>
        )}

        <SectionHeader title="Herd" />
        {animals.length === 0 ? (
          <EmptyState
            icon={<Beef size={36} color={colors.primary} />}
            title="No animals registered"
            body="Add your first animal to start tracking health, growth, and vaccinations."
            cta="Register Animal"
            onCta={handleAdd}
          />
        ) : (
          <View style={{ paddingHorizontal: 24, gap: 10 }}>
            {animals.map((a) => {
              const Icon = SPECIES_ICON[a.species];
              return (
                <GlassCard key={a.id} style={{ padding: 16 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={[s.iconBg, { backgroundColor: colors.primary + '15' }]}>
                      <Icon size={22} color={colors.primary} />
                    </View>
                    <View style={{ flex: 1, marginLeft: 14 }}>
                      <View style={s.tagRow}>
                        <Text style={[s.tag, { color: colors.text }]}>{a.tag}</Text>
                        {a.name && <Text style={[s.tagName, { color: colors.textMute }]}>· {a.name}</Text>}
                      </View>
                      <Text style={[s.species, { color: colors.textMute }]}>
                        {a.species.toUpperCase()} {a.weightKg ? `· ${a.weightKg} kg` : ''}
                      </Text>
                    </View>
                    <View style={[s.healthBadge, { backgroundColor: STATUS_COLOR[a.healthStatus] + '25' }]}>
                      {a.healthStatus === 'healthy' ? <CheckCircle2 size={11} color={STATUS_COLOR[a.healthStatus]} /> :
                       a.healthStatus === 'attention' ? <AlertTriangle size={11} color={STATUS_COLOR[a.healthStatus]} /> :
                       <Heart size={11} color={STATUS_COLOR[a.healthStatus]} />}
                      <Text style={[s.healthText, { color: STATUS_COLOR[a.healthStatus] }]}>{STATUS_LABEL[a.healthStatus]}</Text>
                    </View>
                  </View>
                  {a.nextVaccineDue && (
                    <View style={[s.vaxLine, { borderTopColor: colors.border }]}>
                      <Syringe size={11} color={colors.textMute} />
                      <Text style={[s.vaxText, { color: colors.textMute }]}>
                        Next vaccine: {new Date(a.nextVaccineDue).toLocaleDateString('en-GB')}
                      </Text>
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
  const { colors } = useTheme();
  return (
    <EmptyState
      icon={<AlertTriangle size={36} color="#f59e0b" />}
      title="Haipatikani"
      body="Kipengele cha mifugo hakipatikani kwa jukumu lako la sasa. Boresha tier yako kufungua."
    />
  );
}

const s = StyleSheet.create({
  addBtn: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  alertCard: { flexDirection: 'row', alignItems: 'center', padding: 16, borderWidth: 1 },
  alertTitle: { fontSize: 13, fontFamily: 'Inter_900Black' },
  alertBody: { fontSize: 11, fontFamily: 'Inter_500Medium', marginTop: 2 },
  iconBg: { width: 48, height: 48, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  tagRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  tag: { fontSize: 15, fontFamily: 'Inter_900Black', letterSpacing: 0.3 },
  tagName: { fontSize: 13, fontFamily: 'Inter_600SemiBold' },
  species: { fontSize: 10, fontFamily: 'Inter_700Bold', letterSpacing: 1, marginTop: 2 },
  healthBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10 },
  healthText: { fontSize: 10, fontFamily: 'Inter_900Black', letterSpacing: 0.5 },
  vaxLine: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 12, paddingTop: 10, borderTopWidth: 1 },
  vaxText: { fontSize: 11, fontFamily: 'Inter_600SemiBold' },
});
