import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  Users, Shield, Award, Edit, Check, X, Search, Filter,
  TrendingUp, BarChart3, UserCheck, UserX, ChevronDown, ChevronUp,
  Download, Upload, RefreshCw, AlertCircle
} from "lucide-react";
import { toast } from "sonner@2.0.3";
import { getRoleDisplayName, getRoleDescription, getFeatureCount, type UserRole } from "../utils/roleBasedAccess";

interface User {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  role: UserRole;
  tier: string;
  region?: string;
  createdAt?: string;
  lastLogin?: string;
}

interface AdminRoleManagerProps {
  currentUser: {
    id: string;
    role: UserRole;
  };
  language: "en" | "sw";
}

export function AdminRoleManager({ currentUser, language }: AdminRoleManagerProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState<UserRole | "all">("all");
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    byRole: {} as Record<UserRole, number>,
  });

  const text = {
    title: language === "en" ? "Role Management Dashboard" : "Dashibodi ya Usimamizi wa Majukumu",
    description: language === "en" 
      ? "Manage user roles and permissions across the platform" 
      : "Simamia majukumu na ruhusa za watumiaji",
    totalUsers: language === "en" ? "Total Users" : "Jumla ya Watumiaji",
    searchPlaceholder: language === "en" ? "Search by name, phone, or email..." : "Tafuta kwa jina, simu, au barua pepe...",
    filterByRole: language === "en" ? "Filter by Role" : "Chuja kwa Jukumu",
    allRoles: language === "en" ? "All Roles" : "Majukumu Yote",
    userName: language === "en" ? "User Name" : "Jina la Mtumiaji",
    currentRole: language === "en" ? "Current Role" : "Jukumu la Sasa",
    features: language === "en" ? "Features" : "Vipengele",
    tier: language === "en" ? "Tier" : "Kiwango",
    actions: language === "en" ? "Actions" : "Vitendo",
    changeRole: language === "en" ? "Change Role" : "Badilisha Jukumu",
    cancel: language === "en" ? "Cancel" : "Ghairi",
    save: language === "en" ? "Save" : "Hifadhi",
    selectNewRole: language === "en" ? "Select new role" : "Chagua jukumu jipya",
    roleUpdated: language === "en" ? "Role updated successfully" : "Jukumu limebadilishwa",
    errorLoadingUsers: language === "en" ? "Error loading users" : "Hitilafu katika kupakia watumiaji",
    errorUpdatingRole: language === "en" ? "Error updating role" : "Hitilafu katika kubadilisha jukumu",
    noUsersFound: language === "en" ? "No users found" : "Hakuna watumiaji waliopatikana",
    refresh: language === "en" ? "Refresh" : "Onyesha upya",
    exportData: language === "en" ? "Export Data" : "Hamisha Data",
    roleDistribution: language === "en" ? "Role Distribution" : "Mgawanyiko wa Majukumu",
    upgradeHistory: language === "en" ? "Upgrade History" : "Historia ya Uboresha ni",
  };

  // Available roles for assignment
  const availableRoles: UserRole[] = [
    "smallholder_farmer",
    "farmer",
    "farm_manager",
    "commercial_farm_admin",
    "agribusiness_ops",
    "extension_officer",
    "cooperative_leader",
  ];

  // Load users
  useEffect(() => {
    loadUsers();
  }, []);

  // Filter users
  useEffect(() => {
    let filtered = users;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone?.includes(searchTerm) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply role filter
    if (filterRole !== "all") {
      filtered = filtered.filter(user => user.role === filterRole);
    }

    setFilteredUsers(filtered);

    // Update stats
    const byRole: Record<UserRole, number> = {
      smallholder_farmer: 0,
      farmer: 0,
      farm_manager: 0,
      commercial_farm_admin: 0,
      agribusiness_ops: 0,
      extension_officer: 0,
      cooperative_leader: 0,
    };

    users.forEach(user => {
      if (byRole[user.role] !== undefined) {
        byRole[user.role]++;
      }
    });

    setStats({
      totalUsers: users.length,
      byRole,
    });
  }, [users, searchTerm, filterRole]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      // In production, this would call an API endpoint
      // For now, we'll use mock data
      const mockUsers: User[] = [
        {
          id: "1",
          name: "John Doe",
          phone: "+255712345678",
          email: "john@example.com",
          role: "smallholder_farmer",
          tier: "free",
          region: "Arusha",
          createdAt: "2026-01-01",
          lastLogin: "2026-01-24",
        },
        {
          id: "2",
          name: "Sarah Manager",
          phone: "+255787654321",
          email: "sarah@example.com",
          role: "farm_manager",
          tier: "premium",
          region: "Mwanza",
          createdAt: "2026-01-05",
          lastLogin: "2026-01-24",
        },
        {
          id: "3",
          name: "Peter Extension",
          phone: "+255723456789",
          email: "peter@ngo.org",
          role: "extension_officer",
          tier: "free",
          region: "Kilimanjaro",
          createdAt: "2026-01-10",
          lastLogin: "2026-01-23",
        },
      ];

      setUsers(mockUsers);
      toast.success(language === "en" ? `Loaded ${mockUsers.length} users` : `Wameweka watumiaji ${mockUsers.length}`);
    } catch (error) {
      console.error("Error loading users:", error);
      toast.error(text.errorLoadingUsers);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    try {
      setLoading(true);

      // In production, call API endpoint
      // await fetch(`/api/admin/users/${userId}/role`, { method: 'PUT', body: JSON.stringify({ role: newRole }) });

      // Update local state
      setUsers(users.map(user =>
        user.id === userId ? { ...user, role: newRole } : user
      ));

      setEditingUser(null);
      setSelectedRole(null);
      toast.success(text.roleUpdated);
    } catch (error) {
      console.error("Error updating role:", error);
      toast.error(text.errorUpdatingRole);
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadgeColor = (role: UserRole) => {
    const colors: Record<UserRole, string> = {
      smallholder_farmer: "bg-green-100 text-green-700",
      farmer: "bg-emerald-100 text-emerald-700",
      farm_manager: "bg-blue-100 text-blue-700",
      commercial_farm_admin: "bg-purple-100 text-purple-700",
      agribusiness_ops: "bg-orange-100 text-orange-700",
      extension_officer: "bg-cyan-100 text-cyan-700",
      cooperative_leader: "bg-teal-100 text-teal-700",
    };
    return colors[role] || "bg-gray-100 text-gray-700";
  };

  return (
    <div className="space-y-6 pb-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-white/20 rounded-lg">
            <Shield className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{text.title}</h1>
            <p className="text-white/90 text-sm">{text.description}</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600">{text.totalUsers}</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {Object.entries(stats.byRole).slice(0, 3).map(([role, count]) => (
          <Card key={role}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <UserCheck className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-600">{getRoleDisplayName(role as UserRole, language)}</p>
                  <p className="text-2xl font-bold text-gray-900">{count}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder={text.searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Role Filter */}
            <div className="md:w-64">
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value as UserRole | "all")}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">{text.allRoles}</option>
                {availableRoles.map((role) => (
                  <option key={role} value={role}>
                    {getRoleDisplayName(role, language)}
                  </option>
                ))}
              </select>
            </div>

            {/* Refresh Button */}
            <Button
              onClick={loadUsers}
              disabled={loading}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              {text.refresh}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            {text.allRoles}
          </CardTitle>
          <CardDescription>
            {filteredUsers.length} {language === "en" ? "users" : "watumiaji"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredUsers.length === 0 ? (
            <div className="text-center py-12">
              <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">{text.noUsersFound}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <div className="p-2 bg-white rounded-lg">
                        <Users className="h-4 w-4 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-600">{user.phone || user.email}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {editingUser === user.id ? (
                      <div className="flex items-center gap-2">
                        <select
                          value={selectedRole || user.role}
                          onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                          className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                          {availableRoles.map((role) => (
                            <option key={role} value={role}>
                              {getRoleDisplayName(role, language)} ({getFeatureCount(role)})
                            </option>
                          ))}
                        </select>
                        <Button
                          size="sm"
                          onClick={() => handleRoleChange(user.id, selectedRole || user.role)}
                          disabled={loading}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingUser(null);
                            setSelectedRole(null);
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <>
                        <div className="text-right">
                          <Badge className={getRoleBadgeColor(user.role)}>
                            {getRoleDisplayName(user.role, language)}
                          </Badge>
                          <p className="text-xs text-gray-600 mt-1">
                            {getFeatureCount(user.role)} {text.features}
                          </p>
                        </div>
                        <Badge className="bg-purple-100 text-purple-700">
                          {user.tier.toUpperCase()}
                        </Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingUser(user.id);
                            setSelectedRole(user.role);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Role Distribution Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            {text.roleDistribution}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(stats.byRole).map(([role, count]) => {
              const percentage = stats.totalUsers > 0 ? (count / stats.totalUsers) * 100 : 0;
              return (
                <div key={role}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">
                      {getRoleDisplayName(role as UserRole, language)}
                    </span>
                    <span className="text-sm text-gray-600">
                      {count} ({percentage.toFixed(0)}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-indigo-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
