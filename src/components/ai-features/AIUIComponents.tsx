/**
 * ============================================================================
 * KILIMO AGRI-AI SUITE - AI UI Components
 * ============================================================================
 * Pre-built UI components for AI feature integration
 * Philosophy: "AI must feel helpful, not loud"
 * Brand: Only #2E7D32 (Raspberry Leaf Green) for primary actions
 * ============================================================================
 */

import React, { useState } from "react";
import { Sparkles, AlertCircle, CheckCircle, Loader2, X } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import {
  getAIAdvice,
  AIFeature,
  AIResponse,
  createAILoadingMessage,
  createAIErrorMessage,
  parseConfidenceLevel,
} from "../utils/aiFeatureIntegration";

/**
 * ============================================================================
 * 1. AI SUGGESTION INLINE CHIP
 * ============================================================================
 * Small, unobtrusive AI suggestion that appears inline
 */

interface AISuggestionChipProps {
  feature: AIFeature;
  context: any;
  language?: "EN" | "SW";
  onApply?: (response: AIResponse) => void;
  onDismiss?: () => void;
}

export function AISuggestionChip({
  feature,
  context,
  language = "EN",
  onApply,
  onDismiss,
}: AISuggestionChipProps) {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<AIResponse | null>(null);
  const [expanded, setExpanded] = useState(false);

  const handleGetSuggestion = async () => {
    setLoading(true);
    const result = await getAIAdvice(feature, context, undefined, language);
    setResponse(result);
    setLoading(false);
    if (result.success) {
      setExpanded(true);
    }
  };

  if (loading) {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1 text-sm bg-gray-50 rounded-full border border-gray-200">
        <Loader2 className="h-4 w-4 animate-spin text-[#2E7D32]" />
        <span className="text-gray-600">
          {createAILoadingMessage(feature, language)}
        </span>
      </div>
    );
  }

  if (!response) {
    return (
      <button
        onClick={handleGetSuggestion}
        className="inline-flex items-center gap-2 px-3 py-1 text-sm bg-white rounded-full border border-gray-200 hover:border-[#2E7D32] hover:bg-gray-50 transition-colors"
      >
        <Sparkles className="h-4 w-4 text-[#2E7D32]" />
        <span className="text-gray-700">
          {language === "EN" ? "Get AI Suggestion" : "Pata Mapendekezo ya AI"}
        </span>
      </button>
    );
  }

  if (!response.success) {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1 text-sm bg-red-50 rounded-full border border-red-200">
        <AlertCircle className="h-4 w-4 text-red-600" />
        <span className="text-red-700">
          {createAIErrorMessage(response.error || "", language)}
        </span>
        {onDismiss && (
          <button onClick={onDismiss} className="ml-1">
            <X className="h-3 w-3 text-red-600" />
          </button>
        )}
      </div>
    );
  }

  if (expanded) {
    return (
      <Card className="p-4 border-[#2E7D32]">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[#2E7D32]" />
            <span className="font-medium text-gray-900">
              {language === "EN" ? "AI Suggestion" : "Pendekezo la AI"}
            </span>
          </div>
          <button onClick={() => setExpanded(false)}>
            <X className="h-4 w-4 text-gray-400" />
          </button>
        </div>
        <div className="text-sm text-gray-700 mb-3">
          {response.response.explanation || JSON.stringify(response.response)}
        </div>
        <div className="flex gap-2">
          {onApply && (
            <Button
              onClick={() => onApply(response)}
              size="sm"
              className="bg-[#2E7D32] hover:bg-[#1B5E20]"
            >
              {language === "EN" ? "Apply" : "Tumia"}
            </Button>
          )}
          <Button
            onClick={() => setExpanded(false)}
            size="sm"
            variant="outline"
          >
            {language === "EN" ? "Ignore" : "Puuza"}
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <button
      onClick={() => setExpanded(true)}
      className="inline-flex items-center gap-2 px-3 py-1 text-sm bg-green-50 rounded-full border border-[#2E7D32]"
    >
      <CheckCircle className="h-4 w-4 text-[#2E7D32]" />
      <span className="text-[#2E7D32] font-medium">
        {language === "EN" ? "AI Ready" : "AI Iko Tayari"}
      </span>
    </button>
  );
}

/**
 * ============================================================================
 * 2. AI INSIGHT CARD
 * ============================================================================
 * Full card for displaying AI insights
 */

interface AIInsightCardProps {
  feature: AIFeature;
  context: any;
  language?: "EN" | "SW";
  autoLoad?: boolean;
  onAction?: (action: string, data: any) => void;
}

export function AIInsightCard({
  feature,
  context,
  language = "EN",
  autoLoad = false,
  onAction,
}: AIInsightCardProps) {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<AIResponse | null>(null);

  React.useEffect(() => {
    if (autoLoad) {
      loadInsights();
    }
  }, [autoLoad]);

  const loadInsights = async () => {
    setLoading(true);
    const result = await getAIAdvice(feature, context, undefined, language);
    setResponse(result);
    setLoading(false);
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-3">
          <Loader2 className="h-5 w-5 animate-spin text-[#2E7D32]" />
          <div>
            <p className="font-medium text-gray-900">
              {language === "EN" ? "AI is thinking..." : "AI inafikiria..."}
            </p>
            <p className="text-sm text-gray-600">
              {createAILoadingMessage(feature, language)}
            </p>
          </div>
        </div>
      </Card>
    );
  }

  if (!response && !autoLoad) {
    return (
      <Card className="p-6 border-dashed border-2 border-gray-200">
        <div className="text-center">
          <Sparkles className="h-8 w-8 text-[#2E7D32] mx-auto mb-3" />
          <p className="text-gray-700 mb-4">
            {language === "EN"
              ? "Get AI-powered insights for this feature"
              : "Pata maarifa yanayoendeshwa na AI kwa kipengele hiki"}
          </p>
          <Button
            onClick={loadInsights}
            className="bg-[#2E7D32] hover:bg-[#1B5E20]"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            {language === "EN" ? "Get Insights" : "Pata Maarifa"}
          </Button>
        </div>
      </Card>
    );
  }

  if (response && !response.success) {
    return (
      <Card className="p-6 border-red-200 bg-red-50">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
          <div className="flex-1">
            <p className="font-medium text-red-900 mb-1">
              {language === "EN" ? "AI Unavailable" : "AI Haipatikani"}
            </p>
            <p className="text-sm text-red-700">
              {createAIErrorMessage(response.error || "", language)}
            </p>
          </div>
        </div>
        <Button
          onClick={loadInsights}
          variant="outline"
          size="sm"
          className="mt-4"
        >
          {language === "EN" ? "Try Again" : "Jaribu Tena"}
        </Button>
      </Card>
    );
  }

  if (!response) return null;

  return (
    <Card className="p-6 border-[#2E7D32]">
      <div className="flex items-start gap-3 mb-4">
        <Sparkles className="h-5 w-5 text-[#2E7D32] mt-0.5" />
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-1">
            {language === "EN" ? "AI Insights" : "Maarifa ya AI"}
          </h3>
          <p className="text-sm text-gray-600">
            {language === "EN"
              ? "Based on your data and local farming practices"
              : "Kulingana na data yako na mbinu za kilimo za ndani"}
          </p>
        </div>
      </div>

      {/* Render response based on structure */}
      {response.response.recommendations && (
        <div className="mb-4">
          <h4 className="font-medium text-gray-900 mb-2">
            {language === "EN" ? "Recommendations" : "Mapendekezo"}
          </h4>
          <ul className="space-y-2">
            {response.response.recommendations.map(
              (rec: string, idx: number) => (
                <li key={idx} className="flex gap-2 text-sm text-gray-700">
                  <CheckCircle className="h-4 w-4 text-[#2E7D32] mt-0.5 flex-shrink-0" />
                  <span>{rec}</span>
                </li>
              )
            )}
          </ul>
        </div>
      )}

      {response.response.alerts &&
        response.response.alerts.length > 0 && (
          <div className="mb-4">
            <h4 className="font-medium text-gray-900 mb-2">
              {language === "EN" ? "Alerts" : "Tahadhari"}
            </h4>
            <ul className="space-y-2">
              {response.response.alerts.map((alert: string, idx: number) => (
                <li key={idx} className="flex gap-2 text-sm text-yellow-800">
                  <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <span>{alert}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

      {response.response.confidence_level && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <Badge
            style={{
              backgroundColor: parseConfidenceLevel(
                response.response.confidence_level,
                language
              ).color,
            }}
          >
            {
              parseConfidenceLevel(
                response.response.confidence_level,
                language
              ).label
            }
          </Badge>
          <p className="text-xs text-gray-600 mt-1">
            {
              parseConfidenceLevel(
                response.response.confidence_level,
                language
              ).description
            }
          </p>
        </div>
      )}

      <div className="flex gap-2 mt-4">
        <Button
          onClick={loadInsights}
          variant="outline"
          size="sm"
        >
          {language === "EN" ? "Refresh" : "Onyesha Upya"}
        </Button>
        {onAction && (
          <Button
            onClick={() => onAction("apply", response.response)}
            size="sm"
            className="bg-[#2E7D32] hover:bg-[#1B5E20]"
          >
            {language === "EN" ? "Apply Suggestions" : "Tumia Mapendekezo"}
          </Button>
        )}
      </div>
    </Card>
  );
}

/**
 * ============================================================================
 * 3. AI "WHY?" EXPANDABLE CHIP
 * ============================================================================
 * Small chip that expands to show AI reasoning
 */

interface AIWhyChipProps {
  explanation: string;
  language?: "EN" | "SW";
}

export function AIWhyChip({
  explanation,
  language = "EN",
}: AIWhyChipProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="inline-block">
      <button
        onClick={() => setExpanded(!expanded)}
        className="inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-gray-100 hover:bg-gray-200 rounded-full border border-gray-300 transition-colors"
      >
        <Sparkles className="h-3 w-3 text-[#2E7D32]" />
        <span className="text-gray-700">
          {language === "EN" ? "Why?" : "Kwa nini?"}
        </span>
      </button>
      {expanded && (
        <div className="mt-2 p-3 bg-white border border-gray-200 rounded-lg shadow-sm text-sm text-gray-700">
          {explanation}
        </div>
      )}
    </div>
  );
}

/**
 * ============================================================================
 * 4. AI STATUS BADGE
 * ============================================================================
 * Shows AI confidence or status
 */

interface AIStatusBadgeProps {
  status: "loading" | "ready" | "error" | "success";
  confidence?: "low" | "medium" | "high";
  language?: "EN" | "SW";
}

export function AIStatusBadge({
  status,
  confidence,
  language = "EN",
}: AIStatusBadgeProps) {
  if (status === "loading") {
    return (
      <Badge className="bg-gray-100 text-gray-700">
        <Loader2 className="h-3 w-3 mr-1 animate-spin" />
        {language === "EN" ? "AI Processing" : "AI Inachakata"}
      </Badge>
    );
  }

  if (status === "error") {
    return (
      <Badge className="bg-red-100 text-red-700">
        <AlertCircle className="h-3 w-3 mr-1" />
        {language === "EN" ? "AI Error" : "Hitilafu ya AI"}
      </Badge>
    );
  }

  if (status === "success" && confidence) {
    const conf = parseConfidenceLevel(confidence, language);
    return (
      <Badge
        style={{
          backgroundColor: conf.color + "20",
          color: conf.color,
        }}
      >
        <CheckCircle className="h-3 w-3 mr-1" />
        {conf.label}
      </Badge>
    );
  }

  return (
    <Badge className="bg-green-100 text-[#2E7D32]">
      <Sparkles className="h-3 w-3 mr-1" />
      {language === "EN" ? "AI Ready" : "AI Iko Tayari"}
    </Badge>
  );
}

/**
 * ============================================================================
 * EXPORT ALL COMPONENTS
 * ============================================================================
 */

export default {
  AISuggestionChip,
  AIInsightCard,
  AIWhyChip,
  AIStatusBadge,
};
