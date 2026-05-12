// ==========================================
// TASK GENERATION ENGINE
// Auto-generates tasks from Crop Intelligence System templates
// ==========================================

export interface Task {
  id: string;
  cropPlanId: string;
  cropName: string;
  fieldName?: string;
  title: string;
  description: string;
  dueDate: Date;
  status: 'pending' | 'in-progress' | 'completed' | 'skipped';
  category: 'planting' | 'fertilizing' | 'irrigation' | 'pest-control' | 'monitoring' | 'harvest' | 'other';
  priority: 'low' | 'normal' | 'high' | 'critical';
  estimatedDuration?: number; // in hours
  assignedTo?: string;
  inputs?: { name: string; quantity: string }[];
  createdAt: string;
  completedAt?: string;
}

export interface GrowthStage {
  name: string;
  days: number;
}

export interface TemplateInput {
  name: string;
  quantity: string;
  timing: string; // e.g., "At planting", "35 days after planting", "Weekly"
}

export interface CropPlanEntry {
  id: string;
  cropId: string;
  cropName: string;
  templateId: string;
  templateName: string;
  acres: number;
  plantingDate: string;
  harvestDate?: string;
  status: string;
  expectedYield: number;
}

export interface GrowingTemplate {
  id: string;
  cropId: string;
  name: string;
  growthStages: GrowthStage[];
  inputs: TemplateInput[];
  expectedYield: number;
}

// ==========================================
// HELPER FUNCTIONS
// ==========================================

/**
 * Add days to a date
 */
function addDays(date: Date | string, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * Parse timing string to calculate task date
 * Examples:
 * - "At planting" → planting date
 * - "35 days after planting" → planting date + 35 days
 * - "Weekly" → planting date (first occurrence)
 * - "Before harvest" → harvest date - 7 days
 */
function parseTimingToDate(
  timing: string,
  plantingDate: Date,
  harvestDate?: Date
): Date {
  const timingLower = timing.toLowerCase();

  // At planting
  if (timingLower.includes('at planting') || timingLower.includes('during planting')) {
    return plantingDate;
  }

  // X days after planting
  const daysMatch = timingLower.match(/(\d+)\s*days?\s*after\s*planting/);
  if (daysMatch) {
    return addDays(plantingDate, parseInt(daysMatch[1]));
  }

  // X weeks after planting
  const weeksMatch = timingLower.match(/(\d+)\s*weeks?\s*after\s*planting/);
  if (weeksMatch) {
    return addDays(plantingDate, parseInt(weeksMatch[1]) * 7);
  }

  // Weekly/Biweekly (return first occurrence)
  if (timingLower.includes('weekly')) {
    return addDays(plantingDate, 7);
  }
  if (timingLower.includes('biweekly') || timingLower.includes('bi-weekly')) {
    return addDays(plantingDate, 14);
  }

  // Before harvest
  if (timingLower.includes('before harvest') && harvestDate) {
    return addDays(harvestDate, -7);
  }

  // At harvest
  if (timingLower.includes('at harvest') && harvestDate) {
    return harvestDate;
  }

  // Default: at planting
  return plantingDate;
}

/**
 * Determine task priority based on stage name and timing
 */
function determinePriority(
  stageName: string,
  timing: string,
  category: Task['category']
): Task['priority'] {
  const stageNameLower = stageName.toLowerCase();
  const timingLower = timing.toLowerCase();

  // Critical priorities
  if (category === 'planting' || category === 'harvest') {
    return 'critical';
  }

  if (stageNameLower.includes('germination') || stageNameLower.includes('flowering')) {
    return 'high';
  }

  // High priority for early interventions
  if (timingLower.includes('at planting') || timingLower.includes('before')) {
    return 'high';
  }

  // Default: normal
  return 'normal';
}

/**
 * Categorize task based on input name and timing
 */
function categorizeTask(inputName: string, timing: string): Task['category'] {
  const inputLower = inputName.toLowerCase();
  const timingLower = timing.toLowerCase();

  if (inputLower.includes('fertilizer') || inputLower.includes('manure') || inputLower.includes('compost')) {
    return 'fertilizing';
  }

  if (inputLower.includes('irrigation') || inputLower.includes('water')) {
    return 'irrigation';
  }

  if (inputLower.includes('pesticide') || inputLower.includes('herbicide') || inputLower.includes('fungicide')) {
    return 'pest-control';
  }

  if (inputLower.includes('seed') && timingLower.includes('planting')) {
    return 'planting';
  }

  return 'other';
}

// ==========================================
// MAIN TASK GENERATION FUNCTION
// ==========================================

/**
 * Generate tasks from a crop plan entry and its template
 */
export function generateTasksFromTemplate(
  planEntry: CropPlanEntry,
  template: GrowingTemplate,
  fieldName?: string
): Task[] {
  const tasks: Task[] = [];
  const plantingDate = new Date(planEntry.plantingDate);
  const harvestDate = planEntry.harvestDate ? new Date(planEntry.harvestDate) : undefined;

  // ========================================
  // 1. PLANTING TASK (Initial)
  // ========================================
  tasks.push({
    id: `task-${planEntry.id}-planting`,
    cropPlanId: planEntry.id,
    cropName: planEntry.cropName,
    fieldName,
    title: `Plant ${planEntry.cropName}${fieldName ? ` - ${fieldName}` : ''}`,
    description: `Plant ${planEntry.acres} acres of ${planEntry.cropName} using ${template.name} method`,
    dueDate: plantingDate,
    status: 'pending',
    category: 'planting',
    priority: 'critical',
    estimatedDuration: Math.ceil(planEntry.acres * 2), // 2 hours per acre estimate
    createdAt: new Date().toISOString()
  });

  // ========================================
  // 2. GROWTH STAGE MONITORING TASKS
  // ========================================
  let currentDate = new Date(plantingDate);
  
  template.growthStages.forEach((stage, index) => {
    // Add days for this stage
    currentDate = addDays(currentDate, stage.days);

    tasks.push({
      id: `task-${planEntry.id}-stage-${index}`,
      cropPlanId: planEntry.id,
      cropName: planEntry.cropName,
      fieldName,
      title: `Monitor ${stage.name} - ${planEntry.cropName}`,
      description: `Monitor and assess ${stage.name.toLowerCase()} stage for ${planEntry.cropName}. Check plant health, growth progress, and identify any issues.`,
      dueDate: new Date(currentDate),
      status: 'pending',
      category: 'monitoring',
      priority: determinePriority(stage.name, '', 'monitoring'),
      estimatedDuration: 1,
      createdAt: new Date().toISOString()
    });
  });

  // ========================================
  // 3. INPUT APPLICATION TASKS
  // ========================================
  template.inputs.forEach((input, index) => {
    const taskDate = parseTimingToDate(input.timing, plantingDate, harvestDate);
    const category = categorizeTask(input.name, input.timing);

    tasks.push({
      id: `task-${planEntry.id}-input-${index}`,
      cropPlanId: planEntry.id,
      cropName: planEntry.cropName,
      fieldName,
      title: `Apply ${input.name} - ${planEntry.cropName}`,
      description: `Apply ${input.quantity} of ${input.name} to ${planEntry.acres} acres. Timing: ${input.timing}`,
      dueDate: taskDate,
      status: 'pending',
      category,
      priority: determinePriority('', input.timing, category),
      estimatedDuration: Math.ceil(planEntry.acres * 0.5), // 0.5 hours per acre
      inputs: [{ name: input.name, quantity: input.quantity }],
      createdAt: new Date().toISOString()
    });
  });

  // ========================================
  // 4. PRE-HARVEST INSPECTION
  // ========================================
  if (harvestDate) {
    tasks.push({
      id: `task-${planEntry.id}-pre-harvest`,
      cropPlanId: planEntry.id,
      cropName: planEntry.cropName,
      fieldName,
      title: `Pre-Harvest Inspection - ${planEntry.cropName}`,
      description: `Assess crop maturity and readiness for harvest. Estimated yield: ${(planEntry.expectedYield * planEntry.acres).toFixed(1)} tons`,
      dueDate: addDays(harvestDate, -3),
      status: 'pending',
      category: 'monitoring',
      priority: 'high',
      estimatedDuration: 1,
      createdAt: new Date().toISOString()
    });

    // ========================================
    // 5. HARVEST TASK
    // ========================================
    tasks.push({
      id: `task-${planEntry.id}-harvest`,
      cropPlanId: planEntry.id,
      cropName: planEntry.cropName,
      fieldName,
      title: `Harvest ${planEntry.cropName}${fieldName ? ` - ${fieldName}` : ''}`,
      description: `Harvest ${planEntry.acres} acres of ${planEntry.cropName}. Expected yield: ${(planEntry.expectedYield * planEntry.acres).toFixed(1)} tons`,
      dueDate: harvestDate,
      status: 'pending',
      category: 'harvest',
      priority: 'critical',
      estimatedDuration: Math.ceil(planEntry.acres * 4), // 4 hours per acre estimate
      createdAt: new Date().toISOString()
    });
  }

  // Sort tasks by due date
  return tasks.sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
}

// ==========================================
// BATCH TASK GENERATION
// ==========================================

/**
 * Generate tasks for multiple crop plans
 */
export function generateTasksForSeasonPlan(
  cropPlans: CropPlanEntry[],
  templates: Map<string, GrowingTemplate>,
  fields?: Map<string, string> // Map<planId, fieldName>
): Task[] {
  const allTasks: Task[] = [];

  cropPlans.forEach(plan => {
    const template = templates.get(plan.templateId);
    if (!template) {
      console.warn(`Template not found for plan ${plan.id}`);
      return;
    }

    const fieldName = fields?.get(plan.id);
    const tasks = generateTasksFromTemplate(plan, template, fieldName);
    allTasks.push(...tasks);
  });

  return allTasks;
}

// ==========================================
// TASK FILTERING & GROUPING UTILITIES
// ==========================================

/**
 * Filter tasks by date range
 */
export function filterTasksByDateRange(
  tasks: Task[],
  startDate: Date,
  endDate: Date
): Task[] {
  return tasks.filter(task => {
    const taskDate = new Date(task.dueDate);
    return taskDate >= startDate && taskDate <= endDate;
  });
}

/**
 * Group tasks by month
 */
export function groupTasksByMonth(tasks: Task[]): Map<string, Task[]> {
  const grouped = new Map<string, Task[]>();

  tasks.forEach(task => {
    const month = new Date(task.dueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
    if (!grouped.has(month)) {
      grouped.set(month, []);
    }
    grouped.get(month)!.push(task);
  });

  return grouped;
}

/**
 * Group tasks by crop
 */
export function groupTasksByCrop(tasks: Task[]): Map<string, Task[]> {
  const grouped = new Map<string, Task[]>();

  tasks.forEach(task => {
    if (!grouped.has(task.cropName)) {
      grouped.set(task.cropName, []);
    }
    grouped.get(task.cropName)!.push(task);
  });

  return grouped;
}

/**
 * Get upcoming tasks (next 7 days)
 */
export function getUpcomingTasks(tasks: Task[], days: number = 7): Task[] {
  const now = new Date();
  const futureDate = addDays(now, days);

  return tasks.filter(task => {
    const taskDate = new Date(task.dueDate);
    return taskDate >= now && taskDate <= futureDate && task.status === 'pending';
  }).sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
}

/**
 * Get overdue tasks
 */
export function getOverdueTasks(tasks: Task[]): Task[] {
  const now = new Date();

  return tasks.filter(task => {
    const taskDate = new Date(task.dueDate);
    return taskDate < now && task.status === 'pending';
  }).sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
}

/**
 * Calculate task completion statistics
 */
export function calculateTaskStats(tasks: Task[]): {
  total: number;
  completed: number;
  pending: number;
  overdue: number;
  completionRate: number;
} {
  const total = tasks.length;
  const completed = tasks.filter(t => t.status === 'completed').length;
  const pending = tasks.filter(t => t.status === 'pending').length;
  const overdue = getOverdueTasks(tasks).length;
  const completionRate = total > 0 ? (completed / total) * 100 : 0;

  return {
    total,
    completed,
    pending,
    overdue,
    completionRate
  };
}
