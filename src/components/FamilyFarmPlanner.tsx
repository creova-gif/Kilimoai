import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { 
  Users, 
  Plus,
  Calendar,
  CheckCircle2,
  Circle,
  Target,
  Clock,
  Download,
  ListTodo
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { toast } from "sonner@2.0.3";

const translations = {
  en: {
    // Page Header
    title: "Family Farm Planner",
    subtitle: "Coordinate tasks and track contributions across your farm team",
    createPlan: "Create Plan",
    loading: "Loading plan...",
    
    // Actions
    export: "Export",
    addMember: "Add Member",
    addTask: "Add Task",
    cancel: "Cancel",
    save: "Save",
    
    // Stats
    teamMembers: "Team Members",
    activeTasks: "Active Tasks",
    completionRate: "Completion Rate",
    farmGoals: "Farm Goals",
    
    // Descriptions
    pending: "Pending",
    completed: "Completed",
    objectives: "Objectives",
    
    // Tabs
    overview: "Overview",
    members: "Members",
    tasks: "Tasks",
    
    // Empty States
    noPlanDesc: "Set up your farm team to assign tasks and track work distribution",
    
    // Members Section
    trackMembers: "Track each member's role and task completion",
    noMembers: "No team members yet",
    addFirstMember: "Add First Member",
    
    // Forms
    name: "Name",
    role: "Role",
    gender: "Gender",
    householdHead: "Household Head",
    spouse: "Spouse",
    child: "Child",
    other: "Other",
    female: "Female",
    male: "Male",
    tasksAssigned: "Tasks Assigned",
    
    // Tasks Section
    assignTasks: "Assign and monitor farm tasks across team members",
    taskName: "Task Name",
    assignTo: "Assign To",
    dueDate: "Due Date",
    priority: "Priority",
    category: "Category",
    high: "High",
    medium: "Medium",
    low: "Low",
    planting: "Planting",
    weeding: "Weeding",
    fertilizing: "Fertilizing",
    harvesting: "Harvesting",
    general: "General",
    createTask: "Create Task",
    completedBy: "Completed by",
    noTasks: "No tasks yet",
    createFirstTask: "Create First Task",
    
    // Goals
    farmGoalsTitle: "Farm Goals",
    seasonGoals: "Current season objectives",
    recentTasks: "Recent Tasks",
    memberProgress: "Member Progress",
    
    // Toast Messages
    fillAllFields: "Please fill in all fields",
    memberAdded: "Member added",
    memberError: "Failed to add member",
    planCreated: "Plan created",
    planError: "Failed to create plan",
    fillTaskFields: "Please fill in task name and assignee",
    taskCreated: "Task created",
    taskError: "Failed to create task",
    taskMarked: "Task marked as",
    taskUpdateError: "Failed to update task",
  },
  sw: {
    // Page Header
    title: "Mpango wa Familia",
    subtitle: "Ratibu kazi na fuatilia michango katika timu yako ya shamba",
    createPlan: "Unda Mpango",
    loading: "Inapakia mpango...",
    
    // Actions
    export: "Hamisha",
    addMember: "Ongeza Mwanachama",
    addTask: "Ongeza Kazi",
    cancel: "Ghairi",
    save: "Hifadhi",
    
    // Stats
    teamMembers: "Wanachama wa Timu",
    activeTasks: "Kazi Zinazoendelea",
    completionRate: "Kiwango cha Ukamilishaji",
    farmGoals: "Malengo ya Shamba",
    
    // Descriptions
    pending: "Inasubiri",
    completed: "Imekamilika",
    objectives: "Malengo",
    
    // Tabs
    overview: "Muhtasari",
    members: "Wanachama",
    tasks: "Kazi",
    
    // Empty States
    noPlanDesc: "Tengeneza timu yako ya shamba ili kugawa kazi na kufuatilia mgawanyo wa kazi",
    
    // Members Section
    trackMembers: "Fuatilia jukumu na ukamilishaji wa kazi wa kila mwanachama",
    noMembers: "Hakuna wanachama bado",
    addFirstMember: "Ongeza Mwanachama wa Kwanza",
    
    // Forms
    name: "Jina",
    role: "Jukumu",
    gender: "Jinsia",
    householdHead: "Mkuu wa Kaya",
    spouse: "Mwenzi",
    child: "Mtoto",
    other: "Nyingine",
    female: "Mwanamke",
    male: "Mwanamume",
    tasksAssigned: "Kazi Zilizopewa",
    
    // Tasks Section
    assignTasks: "Peana na fuatilia kazi za shamba kwa wanachama wa timu",
    taskName: "Jina la Kazi",
    assignTo: "Peana kwa",
    dueDate: "Tarehe ya Mwisho",
    priority: "Kipaumbele",
    category: "Aina",
    high: "Juu",
    medium: "Wastani",
    low: "Chini",
    planting: "Kupanda",
    weeding: "Kupalilia",
    fertilizing: "Kumea Mbolea",
    harvesting: "Kuvuna",
    general: "Jumla",
    createTask: "Unda Kazi",
    completedBy: "Imekamilishwa na",
    noTasks: "Hakuna kazi bado",
    createFirstTask: "Unda Kazi ya Kwanza",
    
    // Goals
    farmGoalsTitle: "Malengo ya Shamba",
    seasonGoals: "Malengo ya msimu huu",
    recentTasks: "Kazi za Hivi Karibuni",
    memberProgress: "Maendeleo ya Wanachama",
    
    // Toast Messages
    fillAllFields: "Tafadhali jaza sehemu zote",
    memberAdded: "Mwanachama ameongezwa",
    memberError: "Imeshindwa kuongeza mwanachama",
    planCreated: "Mpango umeundwa",
    planError: "Imeshindwa kuunda mpango",
    fillTaskFields: "Tafadhali jaza jina la kazi na mtu wa kupeana kazi",
    taskCreated: "Kazi imeundwa",
    taskError: "Imeshindwa kuunda kazi",
    taskMarked: "Kazi imewekwa alama kama",
    taskUpdateError: "Imeshindwa kusasisha kazi",
  }
};

interface FamilyFarmPlannerProps {
  userId: string;
  apiBase: string;
  authToken: string;
  language?: "en" | "sw";
}

export function FamilyFarmPlanner({ userId, apiBase, authToken, language = "en" }: FamilyFarmPlannerProps) {
  const [plan, setPlan] = useState<any>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  
  // Family member form
  const [showMemberForm, setShowMemberForm] = useState(false);
  const [memberName, setMemberName] = useState("");
  const [memberRole, setMemberRole] = useState("");
  const [memberGender, setMemberGender] = useState("");
  
  // Task form
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [taskName, setTaskName] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("medium");
  const [category, setCategory] = useState("general");

  useEffect(() => {
    loadFamilyPlan();
  }, [userId]);

  const loadFamilyPlan = async () => {
    try {
      const response = await fetch(`${apiBase}/family-plan/${userId}`, {
        headers: { "Authorization": `Bearer ${authToken}` }
      });
      
      // Always try to parse JSON, even on error responses
      const data = await response.json();
      
      if (!response.ok) {
        console.error("Failed to load family plan:", response.status, data.error || data.message || response.statusText);
        setLoading(false);
        return;
      }
      
      if (data.success) {
        setPlan(data.plan);
        setTasks(data.tasks || []);
      } else {
        console.error("Family plan load failed:", data.error || data.message);
      }
    } catch (error) {
      console.error("Error loading family plan:", error);
    } finally {
      setLoading(false);
    }
  };

  const createFamilyPlan = async () => {
    try {
      const response = await fetch(`${apiBase}/family-plan/create`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          familyMembers: [],
          farmGoals: [
            "Increase maize yield by 30%",
            "Diversify income sources",
            "Improve soil health"
          ],
          timeline: "2024-2025 Season",
          resourceAllocation: {},
        }),
      });

      const data = await response.json();
      if (data.success) {
        setPlan(data.familyPlan);
        toast.success(translations[language].planCreated);
      }
    } catch (error) {
      console.error("Error creating family plan:", error);
      toast.error(translations[language].planError);
    }
  };

  const addFamilyMember = async () => {
    if (!memberName || !memberRole || !memberGender) {
      toast.error(translations[language].fillAllFields);
      return;
    }

    const newMember = {
      name: memberName,
      role: memberRole,
      gender: memberGender,
      id: crypto.randomUUID().substring(0, 8),
    };

    const updatedMembers = [...(plan?.familyMembers || []), newMember];

    try {
      const response = await fetch(`${apiBase}/family-plan/create`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          familyMembers: updatedMembers,
          farmGoals: plan?.farmGoals || [],
          timeline: plan?.timeline || "2024-2025 Season",
          resourceAllocation: plan?.resourceAllocation || {},
        }),
      });

      const data = await response.json();
      if (data.success) {
        setPlan(data.familyPlan);
        setMemberName("");
        setMemberRole("");
        setMemberGender("");
        setShowMemberForm(false);
        toast.success(translations[language].memberAdded);
      }
    } catch (error) {
      console.error("Error adding family member:", error);
      toast.error(translations[language].memberError);
    }
  };

  const createTask = async () => {
    if (!taskName || !assignedTo) {
      toast.error(translations[language].fillTaskFields);
      return;
    }

    const member = plan?.familyMembers?.find((m: any) => m.id === assignedTo);

    try {
      const response = await fetch(`${apiBase}/family-plan/task`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          taskName,
          assignedTo: member,
          dueDate,
          priority,
          category,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setTasks([...tasks, data.task]);
        setTaskName("");
        setAssignedTo("");
        setDueDate("");
        setPriority("medium");
        setCategory("general");
        setShowTaskForm(false);
        toast.success(translations[language].taskCreated);
      }
    } catch (error) {
      console.error("Error creating task:", error);
      toast.error(translations[language].taskError);
    }
  };

  const toggleTaskStatus = async (taskId: string, currentStatus: string) => {
    const newStatus = currentStatus === "completed" ? "pending" : "completed";

    try {
      const response = await fetch(`${apiBase}/family-plan/task/${taskId}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setTasks(tasks.map(t => t.id === taskId ? data.task : t));
        toast.success(`${translations[language].taskMarked} ${newStatus}`);
      }
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error(translations[language].taskUpdateError);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700 mx-auto"></div>
          <p className="mt-4 text-gray-600">{translations[language].loading}</p>
        </div>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="space-y-6 p-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{translations[language].title}</h1>
          <p className="text-gray-600">{translations[language].noPlanDesc}</p>
        </div>

        {/* Empty State */}
        <Card className="border border-gray-200 bg-white">
          <CardContent className="pt-12 pb-12 text-center">
            <div className="h-16 w-16 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-green-700" />
            </div>
            <Button onClick={createFamilyPlan} size="lg" className="bg-green-700 hover:bg-green-800 text-white">
              <Plus className="h-5 w-5 mr-2" />
              {translations[language].createPlan}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const pendingTasks = tasks.filter(t => t.status === "pending");
  const completedTasks = tasks.filter(t => t.status === "completed");
  const totalMembers = plan.familyMembers?.length || 0;
  const completionRate = tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0;

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">{translations[language].title}</h1>
          <p className="text-gray-600">{translations[language].subtitle}</p>
        </div>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          {translations[language].export}
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border border-gray-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{translations[language].teamMembers}</p>
                <p className="text-2xl font-bold">{totalMembers}</p>
              </div>
              <Users className="h-10 w-10 text-green-700" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{translations[language].activeTasks}</p>
                <p className="text-2xl font-bold">{pendingTasks.length}</p>
              </div>
              <ListTodo className="h-10 w-10 text-amber-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{translations[language].completionRate}</p>
                <p className="text-2xl font-bold">{completionRate}%</p>
              </div>
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{translations[language].farmGoals}</p>
                <p className="text-2xl font-bold">{plan.farmGoals?.length || 0}</p>
              </div>
              <Target className="h-10 w-10 text-green-700" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">
            <Target className="h-4 w-4 mr-2" />
            {translations[language].overview}
          </TabsTrigger>
          <TabsTrigger value="members">
            <Users className="h-4 w-4 mr-2" />
            {translations[language].members}
          </TabsTrigger>
          <TabsTrigger value="tasks">
            <ListTodo className="h-4 w-4 mr-2" />
            {translations[language].tasks}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Farm Goals */}
          <Card className="border border-gray-200">
            <CardHeader>
              <CardTitle>{translations[language].farmGoalsTitle}</CardTitle>
              <CardDescription>{translations[language].seasonGoals}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {plan.farmGoals?.map((goal: string, index: number) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <CheckCircle2 className="h-5 w-5 text-green-700 flex-shrink-0 mt-0.5" />
                    <p className="text-sm">{goal}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Task Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg">{translations[language].recentTasks}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {tasks.slice(0, 5).map((task) => (
                    <div key={task.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex items-center gap-2">
                        {task.status === "completed" ? (
                          <CheckCircle2 className="h-4 w-4 text-green-700" />
                        ) : (
                          <Circle className="h-4 w-4 text-gray-400" />
                        )}
                        <span className="text-sm">{task.taskName}</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {task.assignedTo?.name}
                      </Badge>
                    </div>
                  ))}
                  {tasks.length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4">{translations[language].noTasks}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg">{translations[language].memberProgress}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {plan.familyMembers?.slice(0, 5).map((member: any) => {
                    const memberTasks = tasks.filter(t => t.assignedTo?.id === member.id);
                    const memberCompleted = memberTasks.filter(t => t.status === "completed").length;
                    return (
                      <div key={member.id}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-medium">{member.name}</span>
                          <span className="text-gray-600">{memberCompleted}/{memberTasks.length}</span>
                        </div>
                        <Progress 
                          value={memberTasks.length > 0 ? (memberCompleted / memberTasks.length) * 100 : 0} 
                          className="h-2"
                        />
                      </div>
                    );
                  })}
                  {!plan.familyMembers || plan.familyMembers.length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4">{translations[language].noMembers}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="members" className="space-y-4">
          <Card className="border border-gray-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{translations[language].teamMembers}</CardTitle>
                  <CardDescription>{translations[language].trackMembers}</CardDescription>
                </div>
                <Button onClick={() => setShowMemberForm(!showMemberForm)} size="sm" className="bg-green-700 hover:bg-green-800">
                  <Plus className="h-4 w-4 mr-2" />
                  {translations[language].addMember}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {showMemberForm && (
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="space-y-2">
                      <Label>{translations[language].name}</Label>
                      <Input
                        placeholder="e.g., Anna Mwangi"
                        value={memberName}
                        onChange={(e) => setMemberName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>{translations[language].role}</Label>
                      <Select value={memberRole} onValueChange={setMemberRole}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="household_head">{translations[language].householdHead}</SelectItem>
                          <SelectItem value="spouse">{translations[language].spouse}</SelectItem>
                          <SelectItem value="child">{translations[language].child}</SelectItem>
                          <SelectItem value="other">{translations[language].other}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>{translations[language].gender}</Label>
                      <Select value={memberGender} onValueChange={setMemberGender}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="female">{translations[language].female}</SelectItem>
                          <SelectItem value="male">{translations[language].male}</SelectItem>
                          <SelectItem value="other">{translations[language].other}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={addFamilyMember} className="bg-green-700 hover:bg-green-800">
                      {translations[language].save}
                    </Button>
                    <Button onClick={() => setShowMemberForm(false)} variant="outline">
                      {translations[language].cancel}
                    </Button>
                  </div>
                </div>
              )}

              {plan.familyMembers && plan.familyMembers.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {plan.familyMembers.map((member: any) => {
                    const memberTasks = tasks.filter(t => t.assignedTo?.id === member.id);
                    const memberCompleted = memberTasks.filter(t => t.status === "completed").length;
                    
                    return (
                      <Card key={member.id} className="border border-gray-200">
                        <CardContent className="pt-6">
                          <div className="flex items-start gap-3 mb-4">
                            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <Users className="h-6 w-6 text-green-700" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold truncate">{member.name}</h4>
                              <p className="text-sm text-gray-600 capitalize">
                                {member.role.replace(/_/g, " ")} • {member.gender}
                              </p>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">{translations[language].tasksAssigned}</span>
                              <span className="font-medium">{memberTasks.length}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">{translations[language].completed}</span>
                              <span className="font-medium text-green-700">{memberCompleted}</span>
                            </div>
                            <Progress 
                              value={memberTasks.length > 0 ? (memberCompleted / memberTasks.length) * 100 : 0} 
                              className="h-2"
                            />
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Users className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 mb-4">{translations[language].noMembers}</p>
                  <Button onClick={() => setShowMemberForm(true)} variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    {translations[language].addFirstMember}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-4">
          <Card className="border border-gray-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{translations[language].tasks}</CardTitle>
                  <CardDescription>{translations[language].assignTasks}</CardDescription>
                </div>
                <Button 
                  onClick={() => setShowTaskForm(!showTaskForm)} 
                  size="sm"
                  className="bg-green-700 hover:bg-green-800"
                  disabled={!plan.familyMembers || plan.familyMembers.length === 0}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {translations[language].addTask}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {showTaskForm && (
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <Label>{translations[language].taskName}</Label>
                      <Input
                        placeholder="e.g., Weeding maize field"
                        value={taskName}
                        onChange={(e) => setTaskName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>{translations[language].assignTo}</Label>
                      <Select value={assignedTo} onValueChange={setAssignedTo}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select member" />
                        </SelectTrigger>
                        <SelectContent>
                          {plan.familyMembers?.map((member: any) => (
                            <SelectItem key={member.id} value={member.id}>
                              {member.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>{translations[language].dueDate}</Label>
                      <Input
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>{translations[language].priority}</Label>
                      <Select value={priority} onValueChange={setPriority}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="high">{translations[language].high}</SelectItem>
                          <SelectItem value="medium">{translations[language].medium}</SelectItem>
                          <SelectItem value="low">{translations[language].low}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>{translations[language].category}</Label>
                      <Select value={category} onValueChange={setCategory}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="planting">{translations[language].planting}</SelectItem>
                          <SelectItem value="weeding">{translations[language].weeding}</SelectItem>
                          <SelectItem value="fertilizing">{translations[language].fertilizing}</SelectItem>
                          <SelectItem value="harvesting">{translations[language].harvesting}</SelectItem>
                          <SelectItem value="general">{translations[language].general}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={createTask} className="bg-green-700 hover:bg-green-800">
                      {translations[language].createTask}
                    </Button>
                    <Button onClick={() => setShowTaskForm(false)} variant="outline">
                      {translations[language].cancel}
                    </Button>
                  </div>
                </div>
              )}

              {/* Pending Tasks */}
              {pendingTasks.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-medium text-sm flex items-center gap-2">
                    <Clock className="h-4 w-4 text-amber-600" />
                    {translations[language].pending} ({pendingTasks.length})
                  </h4>
                  {pendingTasks.map((task) => (
                    <div key={task.id} className="p-4 bg-white rounded-lg border border-gray-200">
                      <div className="flex items-start gap-3">
                        <button
                          onClick={() => toggleTaskStatus(task.id, task.status)}
                          className="flex-shrink-0 mt-1"
                        >
                          <Circle className="h-5 w-5 text-gray-400 hover:text-green-700 transition-colors" />
                        </button>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap mb-2">
                            <p className="font-medium">{task.taskName}</p>
                            <Badge variant={task.priority === "high" ? "destructive" : "outline"} className="text-xs">
                              {task.priority}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span>{task.assignedTo?.name}</span>
                            {task.dueDate && (
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {new Date(task.dueDate).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Completed Tasks */}
              {completedTasks.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-medium text-sm flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-700" />
                    {translations[language].completed} ({completedTasks.length})
                  </h4>
                  {completedTasks.map((task) => (
                    <div key={task.id} className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-start gap-3">
                        <button
                          onClick={() => toggleTaskStatus(task.id, task.status)}
                          className="flex-shrink-0 mt-1"
                        >
                          <CheckCircle2 className="h-5 w-5 text-green-700" />
                        </button>
                        <div className="flex-1">
                          <p className="font-medium line-through text-gray-600 mb-1">{task.taskName}</p>
                          <p className="text-sm text-gray-600">
                            {translations[language].completedBy}: {task.assignedTo?.name}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {tasks.length === 0 && (
                <div className="text-center py-12">
                  <ListTodo className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 mb-4">{translations[language].noTasks}</p>
                  <Button 
                    onClick={() => setShowTaskForm(true)} 
                    variant="outline"
                    disabled={!plan.familyMembers || plan.familyMembers.length === 0}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {translations[language].createFirstTask}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}