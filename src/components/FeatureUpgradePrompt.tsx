import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Lock, TrendingUp, Zap, Star, ChevronRight, X, Check,
  Sparkles, Crown, Rocket, Award, ArrowRight
} from "lucide-react";
import { toast } from "sonner@2.0.3";
import {
  getRoleDisplayName,
  getRoleDescription,
  getFeatureCount,
  hasFeatureAccess,
  type UserRole,
  type FeatureId,
  ROLE_FEATURES,
} from "../utils/roleBasedAccess";

interface FeatureUpgradePromptProps {
  currentRole: UserRole;
  featureId: FeatureId;
  featureName: string;
  language: "en" | "sw";
  onClose?: () => void;
  onUpgrade?: (targetRole: UserRole) => void;
}

export function FeatureUpgradePrompt({
  currentRole,
  featureId,
  featureName,
  language,
  onClose,
  onUpgrade,
}: FeatureUpgradePromptProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  const text = {
    featureLocked: language === "en" ? "Feature Locked" : "Kipengele Kimefungwa",
    upgradeToUnlock: language === "en" ? "Upgrade to Unlock" : "Boresha ili Kufungua",
    currentPlan: language === "en" ? "Current Plan" : "Mpango wa Sasa",
    features: language === "en" ? "features" : "vipengele",
    unlockWith: language === "en" ? "Unlock with" : "Fungua kwa",
    additionalFeatures: language === "en" ? "additional features" : "vipengele zaidi",
    compareUpgrades: language === "en" ? "Compare Upgrade Options" : "Linganisha Chaguzi za Uboresha ni",
    selectPlan: language === "en" ? "Select Plan" : "Chagua Mpango",
    upgradeNow: language === "en" ? "Upgrade Now" : "Boresha Sasa",
    close: language === "en" ? "Close" : "Funga",
    whatYouGet: language === "en" ? "What you'll get" : "Utapata nini",
    included: language === "en" ? "Included" : "Imejumuishwa",
    notAvailable: language === "en" ? "Not Available" : "Haipatikani",
    recommended: language === "en" ? "Recommended" : "Inapendekezwa",
    popular: language === "en" ? "Popular" : "Maarufu",
    enterprise: language === "en" ? "Enterprise" : "Biashara",
  };

  // Find roles that have access to this feature
  const rolesWithAccess: UserRole[] = [];
  (Object.keys(ROLE_FEATURES) as UserRole[]).forEach((role) => {
    if (ROLE_FEATURES[role].includes(featureId)) {
      rolesWithAccess.push(role);
    }
  });

  // Get upgrade path (roles above current role that have this feature)
  const upgradeOptions = rolesWithAccess.filter((role) => {
    const roleOrder: UserRole[] = [
      "smallholder_farmer",
      "farmer",
      "farm_manager",
      "commercial_farm_admin",
    ];
    const currentIndex = roleOrder.indexOf(currentRole);
    const targetIndex = roleOrder.indexOf(role);
    return targetIndex > currentIndex;
  });

  // Get features comparison
  const getFeatureComparison = (role: UserRole) => {
    const currentFeatures = getFeatureCount(currentRole);
    const targetFeatures = getFeatureCount(role);
    const additionalFeatures = targetFeatures - currentFeatures;
    return { current: currentFeatures, target: targetFeatures, additional: additionalFeatures };
  };

  const handleUpgrade = (targetRole: UserRole) => {
    if (onUpgrade) {
      onUpgrade(targetRole);
    } else {
      toast.info(
        language === "en"
          ? `Contact support to upgrade to ${getRoleDisplayName(targetRole, language)}`
          : `Wasiliana na msaada kuboresha hadi ${getRoleDisplayName(targetRole, language)}`
      );
    }
  };

  const getRoleIcon = (role: UserRole) => {
    const icons: Record<UserRole, any> = {
      smallholder_farmer: Star,
      farmer: Sparkles,
      farm_manager: Crown,
      commercial_farm_admin: Rocket,
      agribusiness_ops: Zap,
      extension_officer: Award,
      cooperative_leader: TrendingUp,
    };
    return icons[role] || Star;
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
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-t-xl">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl flex items-center gap-2 mb-2">
                <Lock className="h-6 w-6" />
                {text.featureLocked}
              </CardTitle>
              <CardDescription className="text-white/90 text-base">
                {featureName} • {text.upgradeToUnlock}
              </CardDescription>
            </div>
            {onClose && (
              <button onClick={onClose} className="text-white/80 hover:text-white">
                <X className="h-6 w-6" />
              </button>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {/* Current Plan */}
          <div className="mb-6">
            <p className="text-sm text-gray-600 mb-2">{text.currentPlan}</p>
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                {(() => {
                  const Icon = getRoleIcon(currentRole);
                  return <Icon className="h-5 w-5 text-gray-600" />;
                })()}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">{getRoleDisplayName(currentRole, language)}</p>
                <p className="text-sm text-gray-600">
                  {getFeatureCount(currentRole)} {text.features}
                </p>
              </div>
              <Badge className={getRoleBadgeColor(currentRole)}>
                {text.included}
              </Badge>
            </div>
          </div>

          {/* Upgrade Options */}
          {upgradeOptions.length > 0 ? (
            <div>
              <h3 className="font-bold text-lg mb-4">{text.compareUpgrades}</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {upgradeOptions.map((role) => {
                  const comparison = getFeatureComparison(role);
                  const Icon = getRoleIcon(role);
                  const isSelected = selectedRole === role;
                  const isFarmManager = role === "farm_manager";
                  const isCommercial = role === "commercial_farm_admin";

                  return (
                    <div
                      key={role}
                      className={`
                        relative p-6 rounded-xl border-2 transition-all cursor-pointer
                        ${isSelected
                          ? "border-purple-500 bg-purple-50 shadow-lg"
                          : "border-gray-200 hover:border-purple-300 hover:shadow-md"
                        }
                      `}
                      onClick={() => setSelectedRole(role)}
                    >
                      {/* Badge */}
                      {isFarmManager && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                          <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1">
                            {text.recommended}
                          </Badge>
                        </div>
                      )}
                      {isCommercial && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                          <Badge className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-3 py-1">
                            {text.enterprise}
                          </Badge>
                        </div>
                      )}

                      <div className="flex items-center gap-3 mb-4">
                        <div className={`
                          p-3 rounded-xl
                          ${isSelected ? "bg-purple-100" : "bg-gray-100"}
                        `}>
                          <Icon className={`
                            h-6 w-6
                            ${isSelected ? "text-purple-600" : "text-gray-600"}
                          `} />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900">
                            {getRoleDisplayName(role, language)}
                          </h4>
                          <p className="text-xs text-gray-600">
                            {getRoleDescription(role, language)}
                          </p>
                        </div>
                      </div>

                      {/* Features Count */}
                      <div className="mb-4">
                        <div className="flex items-baseline gap-2 mb-1">
                          <span className="text-3xl font-bold text-gray-900">
                            {comparison.target}
                          </span>
                          <span className="text-sm text-gray-600">{text.features}</span>
                        </div>
                        <div className="flex items-center gap-1 text-green-600">
                          <TrendingUp className="h-4 w-4" />
                          <span className="text-sm font-medium">
                            +{comparison.additional} {text.additionalFeatures}
                          </span>
                        </div>
                      </div>

                      {/* Key Features */}
                      <div className="space-y-2 mb-4">
                        {role === "farmer" && (
                          <>
                            <div className="flex items-center gap-2 text-sm text-gray-700">
                              <Check className="h-4 w-4 text-green-600" />
                              <span>Farm Graph Dashboard</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-700">
                              <Check className="h-4 w-4 text-green-600" />
                              <span>Farm Finance Management</span>
                            </div>
                          </>
                        )}
                        {role === "farm_manager" && (
                          <>
                            <div className="flex items-center gap-2 text-sm text-gray-700">
                              <Check className="h-4 w-4 text-green-600" />
                              <span>Task Management (Team)</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-700">
                              <Check className="h-4 w-4 text-green-600" />
                              <span>Farm Mapping & Allocation</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-700">
                              <Check className="h-4 w-4 text-green-600" />
                              <span>Digital Farm Twin</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-700">
                              <Check className="h-4 w-4 text-green-600" />
                              <span>Analytics Dashboard</span>
                            </div>
                          </>
                        )}
                        {role === "commercial_farm_admin" && (
                          <>
                            <div className="flex items-center gap-2 text-sm text-gray-700">
                              <Check className="h-4 w-4 text-green-600" />
                              <span>Agribusiness Dashboard</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-700">
                              <Check className="h-4 w-4 text-green-600" />
                              <span>Orders & E-commerce</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-700">
                              <Check className="h-4 w-4 text-green-600" />
                              <span>Institutional Dashboard</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-700">
                              <Check className="h-4 w-4 text-green-600" />
                              <span>System Diagnostics</span>
                            </div>
                          </>
                        )}
                      </div>

                      {/* Select Button */}
                      <Button
                        className={`
                          w-full
                          ${isSelected
                            ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }
                        `}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUpgrade(role);
                        }}
                      >
                        {isSelected ? (
                          <>
                            <Check className="h-4 w-4 mr-2" />
                            {text.upgradeNow}
                          </>
                        ) : (
                          <>
                            {text.selectPlan}
                            <ChevronRight className="h-4 w-4 ml-2" />
                          </>
                        )}
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <Lock className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 mb-2">
                {language === "en"
                  ? `This feature (${featureName}) is not available for role-based upgrade.`
                  : `Kipengele hiki (${featureName}) hakipatikani kwa uboresha ni wa jukumu.`}
              </p>
              <p className="text-sm text-gray-500">
                {language === "en"
                  ? "Contact support for custom access."
                  : "Wasiliana na msaada kwa ufikiaji maalum."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
