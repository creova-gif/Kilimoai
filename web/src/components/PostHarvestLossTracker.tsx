/**
 * POST-HARVEST LOSS TRACKER
 * 
 * Farmer Question: "How much of my harvest did I lose, and why?"
 * 
 * CORE CAPABILITIES:
 * - Record harvest quantities vs storage quantities
 * - Identify loss reasons (pests, moisture, transport, handling)
 * - Financial impact calculation (TZS)
 * - Proactive loss prevention advice (Sankofa AI integrated)
 * - Insurance claim link for covered losses
 */

import React, { useState } from "react";
import { 
  BarChart3, AlertTriangle, ShieldCheck, Truck, Warehouse, 
  TrendingDown, Plus, Info, Save, ChevronRight, History
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { toast } from "sonner@2.0.3";

interface PostHarvestLossTrackerProps {
  userId: string;
  language: "en" | "sw";
}

interface LossRecord {
  id: string;
  crop: string;
  harvestDate: string;
  totalHarvested: number; // in KG
  totalStored: number; // in KG
  lossReason: "pests" | "moisture" | "transport" | "handling" | "other";
  estimatedValue: number; // in TZS
  status: "recorded" | "claimed" | "prevented";
}

export function PostHarvestLossTracker({
  userId,
  language
}: PostHarvestLossTrackerProps) {
  const [records, setRecords] = useState<LossRecord[]>([
    {
      id: "1",
      crop: language === "en" ? "Maize" : "Mahindi",
      harvestDate: "2024-04-12",
      totalHarvested: 1200,
      totalStored: 1050,
      lossReason: "pests",
      estimatedValue: 120000,
      status: "recorded"
    },
    {
      id: "2",
      crop: language === "en" ? "Beans" : "Maharage",
      harvestDate: "2024-03-20",
      totalHarvested: 500,
      totalStored: 480,
      lossReason: "moisture",
      estimatedValue: 45000,
      status: "claimed"
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);

  const calculateTotalLoss = () => {
    return records.reduce((acc, rec) => acc + (rec.totalHarvested - rec.totalStored), 0);
  };

  const calculateFinancialImpact = () => {
    return records.reduce((acc, rec) => acc + rec.estimatedValue, 0);
  };

  const getReasonLabel = (reason: string) => {
    const labels: Record<string, { en: string; sw: string }> = {
      pests: { en: "Pests/Insects", sw: "Wadudu" },
      moisture: { en: "Moisture/Mold", sw: "Unyevunyevu" },
      transport: { en: "Transport Damage", sw: "Uharibifu wa Usafiri" },
      handling: { en: "Handling Loss", sw: "Uharibifu wakati wa kazi" },
      other: { en: "Other", sw: "Mengineyo" }
    };
    return labels[reason]?.[language] || reason;
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="border-red-100 bg-red-50/30">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600">
                  {language === "en" ? "Total Loss Volume" : "Jumla ya Upotevu"}
                </p>
                <h3 className="text-2xl font-bold text-red-700">
                  {calculateTotalLoss()} KG
                </h3>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <TrendingDown className="h-6 w-6 text-red-600" />
              </div>
            </div>
            <p className="text-xs text-red-500 mt-2">
              {language === "en" ? "Avg. 12% across all crops" : "Wastani wa 12% katika mazao yote"}
            </p>
          </CardContent>
        </Card>

        <Card className="border-gray-200 bg-gray-50/30">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {language === "en" ? "Financial Impact" : "Hasara ya Kifedha"}
                </p>
                <h3 className="text-2xl font-bold text-gray-700">
                  {calculateFinancialImpact().toLocaleString()} TZS
                </h3>
              </div>
              <div className="p-3 bg-gray-100 rounded-full">
                <AlertTriangle className="h-6 w-6 text-gray-600" />
              </div>
            </div>
            <p className="text-xs text-gray-600 mt-2">
              {language === "en" ? "Equivalent to 2 bags of fertilizer" : "Sawa na mifuko 2 ya mbolea"}
            </p>
          </CardContent>
        </Card>

        <Card className="border-[#2E7D32]/20 bg-[#2E7D32]/5/30 md:col-span-2 lg:col-span-1">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#2E7D32]">
                  {language === "en" ? "Insurance Recovery" : "Fidia ya Bima"}
                </p>
                <h3 className="text-2xl font-bold text-[#2E7D32]">
                  {records.filter(r => r.status === "claimed").length} Claims
                </h3>
              </div>
              <div className="p-3 bg-[#2E7D32]/10 rounded-full">
                <ShieldCheck className="h-6 w-6 text-[#2E7D32]" />
              </div>
            </div>
            <p className="text-xs text-[#2E7D32] mt-2">
              {language === "en" ? "Linked to Pula Insurance" : "Imeunganishwa na Bima ya Pula"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* AI Advice Banner */}
      <Card className="border-gray-200 bg-gray-50">
        <CardContent className="p-4 flex gap-4">
          <div className="p-2 bg-gray-700 rounded-lg h-fit">
            <Warehouse className="h-5 w-5 text-white" />
          </div>
          <div className="space-y-1">
            <h4 className="font-bold text-gray-900 flex items-center gap-2">
              {language === "en" ? "Sankofa AI Tip: Storage Optimization" : "Ushauri wa Sankofa: Hifadhi Bora"}
              <Badge variant="secondary" className="bg-gray-200 text-gray-800 text-[10px] uppercase">New</Badge>
            </h4>
            <p className="text-sm text-gray-800">
              {language === "en" 
                ? "Switching to PICS bags for your Maize could reduce pest loss by 95% without chemicals." 
                : "Kutumia mifuko ya PICS kwa Mahindi yako kunaweza kupunguza uharibifu wa wadudu kwa 95% bila kemikali."}
            </p>
            <Button variant="link" className="p-0 h-auto text-gray-700 font-semibold text-xs flex items-center gap-1">
              {language === "en" ? "View recommended suppliers" : "Angalia wasambazaji"} <ChevronRight className="h-3 w-3" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Records List */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="space-y-0.5">
            <CardTitle className="text-lg">
              {language === "en" ? "Harvest Loss History" : "Historia ya Upotevu wa Mavuno"}
            </CardTitle>
            <CardDescription>
              {language === "en" ? "Track and analyze your post-harvest efficiency" : "Fuatilia na uchanganue ufanisi wako baada ya kuvuna"}
            </CardDescription>
          </div>
          <Button size="sm" className="bg-[#2E7D32] hover:bg-[#1B5E20]" onClick={() => setShowAddForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            {language === "en" ? "Log Loss" : "Rekodi Hasara"}
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {records.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                <History className="h-10 w-10 mx-auto mb-2 opacity-20" />
                <p>{language === "en" ? "No loss records yet. Great job!" : "Hakuna rekodi za hasara bado. Kazi nzuri!"}</p>
              </div>
            ) : (
              records.map((record) => (
                <div key={record.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex gap-3 items-center">
                    <div className={`p-2 rounded-full ${record.lossReason === 'pests' ? 'bg-gray-100' : 'bg-gray-100'}`}>
                      {record.lossReason === 'transport' ? <Truck className="h-4 w-4 text-gray-600" /> : <Warehouse className="h-4 w-4 text-gray-600" />}
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-900">{record.crop}</h5>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>{new Date(record.harvestDate).toLocaleDateString()}</span>
                        <span>•</span>
                        <span className="text-red-600 font-medium">{getReasonLabel(record.lossReason)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">-{record.totalHarvested - record.totalStored} KG</p>
                    <Badge variant="outline" className={
                      record.status === 'claimed' ? "text-[#2E7D32] border-[#2E7D32]/20 bg-[#2E7D32]/5" : "text-gray-500"
                    }>
                      {record.status === 'claimed' 
                        ? (language === 'en' ? 'Claimed' : 'Imelipwa') 
                        : (language === 'en' ? 'Recorded' : 'Imehifadhiwa')}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Resource Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Truck className="h-5 w-5 text-[#2E7D32]" />
              {language === "en" ? "Transport Partners" : "Washirika wa Usafirishaji"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-gray-600">
              {language === "en" 
                ? "Vetted cold-chain logistics providers to reduce handling loss." 
                : "Wasafirishaji waliohakikiwa kupunguza uharibifu wa mazao."}
            </p>
            <Button variant="outline" size="sm" className="w-full">
              {language === "en" ? "Book Transport" : "Agiza Usafiri"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-[#2E7D32]" />
              {language === "en" ? "Insurance Status" : "Hali ya Bima"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">{language === "en" ? "Policy Active" : "Bima Inafanya Kazi"}</span>
              <Badge className="bg-[#2E7D32]">YES</Badge>
            </div>
            <p className="text-xs text-gray-500">
              {language === "en" 
                ? "Your Pula Multi-Peril policy covers storage loss due to fire and theft." 
                : "Bima yako ya Pula inalinda upotevu wa hifadhi kutokana na moto na wizi."}
            </p>
            <Button variant="outline" size="sm" className="w-full">
              {language === "en" ? "File New Claim" : "Omba Fidia"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
