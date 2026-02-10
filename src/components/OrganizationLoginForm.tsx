import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Building2, Mail, Lock, Users } from "lucide-react";

interface OrganizationLoginFormProps {
  onLogin: (email: string, password: string, orgType: string) => Promise<void>;
  onSwitchToFarmer: () => void;
  loading: boolean;
}

const ORG_TYPES = [
  { value: "ngo", label: "NGO / Development Agency" },
  { value: "government", label: "Government Ministry" },
  { value: "financial", label: "Financial Institution" },
  { value: "agribusiness", label: "Agribusiness" },
  { value: "cooperative", label: "Cooperative / Farmer Group" },
  { value: "education", label: "Educational Institution" },
  { value: "tech", label: "Tech Company / Private Sector" },
];

export function OrganizationLoginForm({ 
  onLogin, 
  onSwitchToFarmer, 
  loading 
}: OrganizationLoginFormProps) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    orgType: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.orgType) {
      return;
    }
    await onLogin(formData.email, formData.password, formData.orgType);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-600 via-green-700 to-green-800 p-4">
      <Card className="w-full max-w-md shadow-2xl border-0">
        <CardHeader className="space-y-4 text-center pb-8">
          <div className="flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-green-600 to-green-700 text-white shadow-xl">
              <Building2 className="h-10 w-10" />
            </div>
          </div>
          <div>
            <CardTitle className="text-3xl">Organization Portal</CardTitle>
            <CardDescription className="mt-2 text-base">
              Access CREOVA's impact data & analytics platform
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="orgType">Organization Type</Label>
              <div className="relative">
                <Users className="absolute left-3 top-3 h-4 w-4 text-gray-400 z-10 pointer-events-none" />
                <Select
                  value={formData.orgType}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, orgType: value }))}
                >
                  <SelectTrigger className="pl-10 h-12">
                    <SelectValue placeholder="Select organization type" />
                  </SelectTrigger>
                  <SelectContent>
                    {ORG_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Organization Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="organization@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="pl-10 h-12"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  className="pl-10 h-12"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 h-12 shadow-lg"
              disabled={loading || !formData.orgType}
            >
              {loading ? "Logging in..." : "Access Dashboard"}
            </Button>

            <div className="text-center pt-4 border-t">
              <p className="text-sm text-gray-600">
                Are you a farmer?{" "}
                <button
                  type="button"
                  onClick={onSwitchToFarmer}
                  className="text-green-600 hover:text-green-700 font-medium"
                >
                  Login here
                </button>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}