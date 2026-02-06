import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import {
  TrendingUp,
  Users,
  Sprout,
  DollarSign,
  BarChart3,
  Award,
  ArrowUp,
  Shield,
  Zap,
  Crown
} from "lucide-react";

interface RoleInfo {
  id: string;
  displayName: string;
  tier: string;
  limits: {
    maxAIQueries: number;
    maxExpertConsultations: number;
    maxFarmSize: number | null;
    maxTeamMembers: number | null;
    aiModelTier: string;
  };
  dashboardConfig: {
    sections: string[];
    analytics: string[];
    widgets: string[];
  };
}

interface UsageStats {
  aiQueriesUsed: number;
  consultationsUsed: number;
  farmSizeUsed: number;
  teamMembersUsed: number;
}

interface RoleBasedDashboardProps {
  role: RoleInfo;
  usage: UsageStats;
  onUpgrade?: () => void;
}

export function RoleBasedDashboard({ role, usage, onUpgrade }: RoleBasedDashboardProps) {
  const getTierColor = (tier: string) => {
    switch (tier) {
      case "free":
        return "bg-gray-100 text-gray-800";
      case "basic":
        return "bg-blue-100 text-blue-800";
      case "premium":
        return "bg-purple-100 text-purple-800";
      case "enterprise":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case "free":
        return <Shield className="h-4 w-4" />;
      case "basic":
        return <Zap className="h-4 w-4" />;
      case "premium":
        return <Crown className="h-4 w-4" />;
      case "enterprise":
        return <Award className="h-4 w-4" />;
      default:
        return <Shield className="h-4 w-4" />;
    }
  };

  const getUsagePercentage = (used: number, limit: number | null) => {
    if (limit === null) return 0; // Unlimited
    return (used / limit) * 100;
  };

  const isNearLimit = (used: number, limit: number | null) => {
    if (limit === null) return false;
    return used / limit >= 0.8; // 80% or more
  };

  return (
    <div className="space-y-4">
      {/* Role Header */}
      <Card className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                {getTierIcon(role.tier)}
                {role.displayName}
              </CardTitle>
              <CardDescription className="text-white/90">
                Your current subscription tier
              </CardDescription>
            </div>
            <Badge className={getTierColor(role.tier)}>
              {role.tier.toUpperCase()}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Usage Stats */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* AI Queries */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center justify-between">
              <span>AI Queries Today</span>
              {isNearLimit(usage.aiQueriesUsed, role.limits.maxAIQueries) && (
                <Badge variant="destructive" className="text-xs">
                  Near Limit
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold">{usage.aiQueriesUsed}</span>
                <span className="text-sm text-gray-600">
                  / {role.limits.maxAIQueries}
                </span>
              </div>
              <Progress 
                value={getUsagePercentage(usage.aiQueriesUsed, role.limits.maxAIQueries)} 
                className="h-2"
              />
              <p className="text-xs text-gray-500">
                AI Model: {role.limits.aiModelTier.toUpperCase()}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Expert Consultations */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center justify-between">
              <span>Expert Consultations (Monthly)</span>
              {isNearLimit(usage.consultationsUsed, role.limits.maxExpertConsultations) && (
                <Badge variant="destructive" className="text-xs">
                  Near Limit
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold">{usage.consultationsUsed}</span>
                <span className="text-sm text-gray-600">
                  / {role.limits.maxExpertConsultations}
                </span>
              </div>
              <Progress 
                value={getUsagePercentage(usage.consultationsUsed, role.limits.maxExpertConsultations)} 
                className="h-2"
              />
            </div>
          </CardContent>
        </Card>

        {/* Farm Size */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center justify-between">
              <span>Farm Size</span>
              {isNearLimit(usage.farmSizeUsed, role.limits.maxFarmSize) && (
                <Badge variant="destructive" className="text-xs">
                  Near Limit
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold">{usage.farmSizeUsed}</span>
                <span className="text-sm text-gray-600">
                  / {role.limits.maxFarmSize || "∞"} acres
                </span>
              </div>
              {role.limits.maxFarmSize && (
                <Progress 
                  value={getUsagePercentage(usage.farmSizeUsed, role.limits.maxFarmSize)} 
                  className="h-2"
                />
              )}
            </div>
          </CardContent>
        </Card>

        {/* Team Members */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center justify-between">
              <span>Team Members</span>
              {isNearLimit(usage.teamMembersUsed, role.limits.maxTeamMembers) && (
                <Badge variant="destructive" className="text-xs">
                  Near Limit
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold">{usage.teamMembersUsed}</span>
                <span className="text-sm text-gray-600">
                  / {role.limits.maxTeamMembers || "∞"}
                </span>
              </div>
              {role.limits.maxTeamMembers && (
                <Progress 
                  value={getUsagePercentage(usage.teamMembersUsed, role.limits.maxTeamMembers)} 
                  className="h-2"
                />
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Features Access */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Your Features</CardTitle>
          <CardDescription>
            Dashboard sections and analytics available in your plan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Dashboard Sections */}
            <div>
              <p className="text-sm font-medium mb-2">Dashboard Sections ({role.dashboardConfig.sections.length})</p>
              <div className="flex flex-wrap gap-1">
                {role.dashboardConfig.sections.slice(0, 8).map((section) => (
                  <Badge key={section} variant="secondary" className="text-xs">
                    {section.replace(/_/g, ' ')}
                  </Badge>
                ))}
                {role.dashboardConfig.sections.length > 8 && (
                  <Badge variant="outline" className="text-xs">
                    +{role.dashboardConfig.sections.length - 8} more
                  </Badge>
                )}
              </div>
            </div>

            {/* Analytics */}
            <div>
              <p className="text-sm font-medium mb-2">Analytics ({role.dashboardConfig.analytics.length})</p>
              <div className="flex flex-wrap gap-1">
                {role.dashboardConfig.analytics.slice(0, 6).map((analytic) => (
                  <Badge key={analytic} variant="secondary" className="text-xs">
                    {analytic.replace(/_/g, ' ')}
                  </Badge>
                ))}
                {role.dashboardConfig.analytics.length > 6 && (
                  <Badge variant="outline" className="text-xs">
                    +{role.dashboardConfig.analytics.length - 6} more
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upgrade CTA - Only show for non-enterprise tiers */}
      {role.tier !== "enterprise" && role.tier !== "premium" && onUpgrade && (
        <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">Need more capacity?</h3>
                <p className="text-sm text-gray-600">
                  Upgrade to access advanced AI models, unlimited queries, and premium features
                </p>
                <ul className="text-sm space-y-1 text-gray-600">
                  <li className="flex items-center gap-2">
                    <ArrowUp className="h-3 w-3 text-purple-600" />
                    <span>Advanced AI (GPT-4) for better recommendations</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <ArrowUp className="h-3 w-3 text-purple-600" />
                    <span>Unlimited AI queries and farm size</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <ArrowUp className="h-3 w-3 text-purple-600" />
                    <span>Access to all dashboard sections and analytics</span>
                  </li>
                </ul>
              </div>
              <Button
                onClick={onUpgrade}
                className="bg-gradient-to-r from-purple-600 to-blue-600 ml-4"
              >
                <Crown className="h-4 w-4 mr-2" />
                Upgrade Now
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Role-Specific Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Sprout className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600">Active Crops</p>
                <p className="text-xl font-bold">3</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BarChart3 className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600">Analytics Run</p>
                <p className="text-xl font-bold">12</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600">Yield Trend</p>
                <p className="text-xl font-bold text-green-600">+23%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <DollarSign className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600">Revenue</p>
                <p className="text-xl font-bold">5.2M</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
