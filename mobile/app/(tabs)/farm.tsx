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

type FarmTab = 'tasks' | 'crops' | 'livestock';

interface Task { id: string; title: string; priority: 'high' | 'medium' | 'low'; completed: boolean; dueDate: string }
interface Crop { id: string; name: string; plantedDate: string; harvestDate: string; stage: string; health: number }
interface Animal { id: string; type: string; count: number; health: string; lastVaccinated: string }

const INITIAL_TASKS: Task[] = [
  { id: '1', title: 'Water maize crops', priority: 'high', completed: false, dueDate: 'Today' },
  { id: '2', title: 'Apply fertilizer to beans', priority: 'medium', completed: false, dueDate: 'Tomorrow' },
  { id: '3', title: 'Check irrigation system', priority: 'low', completed: true, dueDate: 'Yesterday' },
];
const INITIAL_CROPS: Crop[] = [
  { id: '1', name: 'Maize (Field A)', plantedDate: '2026-03-15', harvestDate: '2026-07-15', stage: 'Vegetative', health: 85 },
  { id: '2', name: 'Beans (Field B)', plantedDate: '2026-04-01', harvestDate: '2026-06-30', stage: 'Flowering', health: 92 },
  { id: '3', name: 'Tomatoes (Greenhouse)', plantedDate: '2026-04-20', harvestDate: '2026-07-01', stage: 'Fruiting', health: 78 },
];
const INITIAL_ANIMALS: Animal[] = [
  { id: '1', type: 'Cattle (Dairy)', count: 8, health: 'Good', lastVaccinated: '2026-02-10' },
  { id: '2', type: 'Chickens (Layers)', count: 150, health: 'Excellent', lastVaccinated: '2026-03-01' },
  { id: '3', type: 'Goats', count: 12, health: 'Good', lastVaccinated: '2026-01-20' },
];

export default function FarmScreen() {
  const insets = useSafeAreaInsets();
  const { language } = useAuth();
  const [activeTab, setActiveTab] = useState<FarmTab>('tasks');
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [crops, setCrops] = useState<Crop[]>(INITIAL_CROPS);
  const [animals, setAnimals] = useState<Animal[]>(INITIAL_ANIMALS);
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', priority: 'medium' as Task['priority'] });

  const topInset = Platform.OS === 'web' ? 67 : insets.top;

  const toggleTask = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const addTask = () => {
    if (!newTask.title.trim()) { Alert.alert('Error', 'Please enter a task title'); return; }
    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      priority: newTask.priority,
      completed: false,
      dueDate: 'Today',
    };
    setTasks(prev => [task, ...prev]);
    setNewTask({ title: '', priority: 'medium' });
    setShowAddTask(false);
  };

  const priorityColor = (p: string) => p === 'high' ? Colors.error : p === 'medium' ? Colors.warning : Colors.gray400;
  const healthColor = (h: number) => h >= 85 ? Colors.success : h >= 70 ? Colors.warning : Colors.error;

  const TABS: { id: FarmTab; icon: any; label: string }[] = [
    { id: 'tasks', icon: 'checkbox-outline', label: tr('tasks', language) },
    { id: 'crops', icon: 'leaf-outline', label: tr('crops', language) },
    { id: 'livestock', icon: 'paw-outline', label: tr('livestock', language) },
  ];

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: topInset + 12 }]}>
        <Text style={styles.headerTitle}>{tr('farmManagement', language)}</Text>
      </View>

      <View style={styles.tabs}>
        {TABS.map(t => (
          <TouchableOpacity
            key={t.id}
            style={[styles.tab, activeTab === t.id && styles.tabActive]}
            onPress={() => setActiveTab(t.id)}
          >
            <Ionicons name={t.icon} size={18} color={activeTab === t.id ? Colors.primary : Colors.textMuted} />
            <Text style={[styles.tabText, activeTab === t.id && styles.tabTextActive]}>{t.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: Platform.OS === 'web' ? 34 + 84 : 90 }]}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === 'tasks' && (
          <>
            <TouchableOpacity style={styles.addBtn} onPress={() => setShowAddTask(true)} activeOpacity={0.85}>
              <Ionicons name="add-circle" size={20} color={Colors.primary} />
              <Text style={styles.addBtnText}>{tr('addTask', language)}</Text>
            </TouchableOpacity>
            {tasks.map(task => (
              <Card key={task.id} style={styles.taskCard}>
                <View style={styles.taskRow}>
                  <TouchableOpacity onPress={() => toggleTask(task.id)} style={styles.checkbox}>
                    <Ionicons
                      name={task.completed ? 'checkmark-circle' : 'ellipse-outline'}
                      size={24}
                      color={task.completed ? Colors.success : Colors.gray300}
                    />
                  </TouchableOpacity>
                  <View style={styles.taskBody}>
                    <Text style={[styles.taskTitle, task.completed && styles.taskDone]}>{task.title}</Text>
                    <View style={styles.taskMeta}>
                      <View style={[styles.priorityBadge, { backgroundColor: priorityColor(task.priority) + '20' }]}>
                        <Text style={[styles.priorityText, { color: priorityColor(task.priority) }]}>{task.priority}</Text>
                      </View>
                      <Text style={styles.dueDate}>{task.dueDate}</Text>
                    </View>
                  </View>
                </View>
              </Card>
            ))}
          </>
        )}

        {activeTab === 'crops' && (
          <>
            {crops.map(crop => (
              <Card key={crop.id} style={styles.cropCard}>
                <View style={styles.cropHeader}>
                  <Text style={styles.cropName}>{crop.name}</Text>
                  <View style={[styles.stageBadge, { backgroundColor: Colors.primaryMuted }]}>
                    <Text style={styles.stageText}>{crop.stage}</Text>
                  </View>
                </View>
                <View style={styles.healthRow}>
                  <Text style={styles.healthLabel}>{language === 'sw' ? 'Afya' : 'Health'}</Text>
                  <View style={styles.healthBar}>
                    <View style={[styles.healthFill, { width: `${crop.health}%` as any, backgroundColor: healthColor(crop.health) }]} />
                  </View>
                  <Text style={[styles.healthValue, { color: healthColor(crop.health) }]}>{crop.health}%</Text>
                </View>
                <View style={styles.dateRow}>
                  <View style={styles.dateItem}>
                    <Ionicons name="calendar-outline" size={14} color={Colors.textMuted} />
                    <Text style={styles.dateText}>{language === 'sw' ? 'Kupandwa' : 'Planted'}: {crop.plantedDate}</Text>
                  </View>
                  <View style={styles.dateItem}>
                    <Ionicons name="cut-outline" size={14} color={Colors.textMuted} />
                    <Text style={styles.dateText}>{language === 'sw' ? 'Mavuno' : 'Harvest'}: {crop.harvestDate}</Text>
                  </View>
                </View>
              </Card>
            ))}
          </>
        )}

        {activeTab === 'livestock' && (
          <>
            {animals.map(animal => (
              <Card key={animal.id} style={styles.animalCard}>
                <View style={styles.animalHeader}>
                  <View style={styles.animalIcon}>
                    <Ionicons name="paw" size={24} color={Colors.primary} />
                  </View>
                  <View style={styles.animalInfo}>
                    <Text style={styles.animalType}>{animal.type}</Text>
                    <Text style={styles.animalCount}>
                      {animal.count} {language === 'sw' ? 'wanyama' : 'animals'}
                    </Text>
                  </View>
                  <View style={[styles.healthBadge, {
                    backgroundColor: animal.health === 'Excellent' ? Colors.successLight : Colors.primaryMuted
                  }]}>
                    <Text style={[styles.healthBadgeText, { color: Colors.primary }]}>{animal.health}</Text>
                  </View>
                </View>
                <View style={styles.vaccRow}>
                  <Ionicons name="medical-outline" size={14} color={Colors.textMuted} />
                  <Text style={styles.vaccText}>
                    {language === 'sw' ? 'Chanjo ya mwisho' : 'Last vaccinated'}: {animal.lastVaccinated}
                  </Text>
                </View>
              </Card>
            ))}
          </>
        )}
      </ScrollView>

      <Modal visible={showAddTask} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setShowAddTask(false)}>
        <View style={styles.modal}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{tr('addTask', language)}</Text>
            <TouchableOpacity onPress={() => setShowAddTask(false)}>
              <Ionicons name="close" size={24} color={Colors.text} />
            </TouchableOpacity>
          </View>
          <TextInput
            style={styles.modalInput}
            placeholder={tr('taskTitle', language)}
            placeholderTextColor={Colors.textMuted}
            value={newTask.title}
            onChangeText={t => setNewTask(prev => ({ ...prev, title: t }))}
          />
          <Text style={styles.modalLabel}>{tr('priority', language)}</Text>
          <View style={styles.priorityRow}>
            {(['high', 'medium', 'low'] as Task['priority'][]).map(p => (
              <TouchableOpacity
                key={p}
                style={[styles.priorityBtn, newTask.priority === p && { backgroundColor: priorityColor(p) + '20', borderColor: priorityColor(p) }]}
                onPress={() => setNewTask(prev => ({ ...prev, priority: p }))}
              >
                <Text style={[styles.priorityBtnText, newTask.priority === p && { color: priorityColor(p) }]}>
                  {p === 'high' ? tr('high', language) : p === 'medium' ? tr('medium', language) : tr('low', language)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <Button title={tr('addTask', language)} onPress={addTask} fullWidth style={{ marginTop: 24 }} />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.surface },
  header: { backgroundColor: Colors.primary, paddingHorizontal: 20, paddingBottom: 16 },
  headerTitle: { fontSize: 22, fontWeight: '700' as const, color: '#fff' },
  tabs: {
    flexDirection: 'row', backgroundColor: Colors.background,
    paddingHorizontal: 16, paddingVertical: 8, gap: 8,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  tab: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 8, borderRadius: Colors.radiusSm, gap: 6,
  },
  tabActive: { backgroundColor: Colors.primaryMuted },
  tabText: { fontSize: 13, color: Colors.textMuted, fontWeight: '500' as const },
  tabTextActive: { color: Colors.primary, fontWeight: '600' as const },
  content: { padding: 16, gap: 12 },
  addBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: Colors.primaryMuted, borderRadius: Colors.radius,
    paddingVertical: 12, borderWidth: 1.5, borderColor: Colors.primary, borderStyle: 'dashed',
  },
  addBtnText: { fontSize: 14, fontWeight: '600' as const, color: Colors.primary },
  taskCard: { padding: 14 },
  taskRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  checkbox: { width: 32, alignItems: 'center' },
  taskBody: { flex: 1 },
  taskTitle: { fontSize: 15, fontWeight: '500' as const, color: Colors.text, marginBottom: 6 },
  taskDone: { textDecorationLine: 'line-through', color: Colors.textMuted },
  taskMeta: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  priorityBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: Colors.radiusFull },
  priorityText: { fontSize: 11, fontWeight: '600' as const, textTransform: 'capitalize' },
  dueDate: { fontSize: 12, color: Colors.textMuted },
  cropCard: { padding: 14 },
  cropHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  cropName: { fontSize: 15, fontWeight: '600' as const, color: Colors.text },
  stageBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: Colors.radiusFull },
  stageText: { fontSize: 12, fontWeight: '500' as const, color: Colors.primary },
  healthRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  healthLabel: { fontSize: 13, color: Colors.textSecondary, width: 50 },
  healthBar: { flex: 1, height: 6, backgroundColor: Colors.gray200, borderRadius: 3, overflow: 'hidden' },
  healthFill: { height: '100%', borderRadius: 3 },
  healthValue: { fontSize: 13, fontWeight: '600' as const, width: 36, textAlign: 'right' },
  dateRow: { gap: 6 },
  dateItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dateText: { fontSize: 12, color: Colors.textMuted },
  animalCard: { padding: 14 },
  animalHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10 },
  animalIcon: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: Colors.primaryMuted, alignItems: 'center', justifyContent: 'center',
  },
  animalInfo: { flex: 1 },
  animalType: { fontSize: 15, fontWeight: '600' as const, color: Colors.text },
  animalCount: { fontSize: 13, color: Colors.textSecondary },
  healthBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: Colors.radiusFull },
  healthBadgeText: { fontSize: 12, fontWeight: '600' as const },
  vaccRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  vaccText: { fontSize: 13, color: Colors.textMuted },
  modal: { flex: 1, padding: 24, backgroundColor: Colors.background },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  modalTitle: { fontSize: 20, fontWeight: '700' as const, color: Colors.text },
  modalInput: {
    borderWidth: 1.5, borderColor: Colors.border, borderRadius: Colors.radius,
    padding: 14, fontSize: 15, color: Colors.text, marginBottom: 20,
    backgroundColor: Colors.gray50,
  },
  modalLabel: { fontSize: 14, fontWeight: '500' as const, color: Colors.text, marginBottom: 10 },
  priorityRow: { flexDirection: 'row', gap: 10 },
  priorityBtn: {
    flex: 1, paddingVertical: 10, borderRadius: Colors.radiusSm,
    borderWidth: 1.5, borderColor: Colors.border, alignItems: 'center',
  },
  priorityBtnText: { fontSize: 14, fontWeight: '500' as const, color: Colors.textMuted, textTransform: 'capitalize' },
});
