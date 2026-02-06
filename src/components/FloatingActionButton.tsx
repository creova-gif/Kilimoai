import { useState } from "react";
import { Plus, Brain, ClipboardPlus, MessageSquare, Camera, X } from "lucide-react";
import { Button } from "./ui/button";

interface FABProps {
  onAction: (action: string) => void;
}

export function FloatingActionButton({ onAction }: FABProps) {
  const [isOpen, setIsOpen] = useState(false);

  const actions = [
    { id: "ai-insight", label: "AI Insight", icon: Brain, color: "bg-purple-600 hover:bg-purple-700" },
    { id: "new-task", label: "New Task", icon: ClipboardPlus, color: "bg-blue-600 hover:bg-blue-700" },
    { id: "ask-sankofa", label: "Ask Sankofa", icon: MessageSquare, color: "bg-green-600 hover:bg-green-700" },
    { id: "scan-crop", label: "Scan Crop", icon: Camera, color: "bg-orange-600 hover:bg-orange-700" }
  ];

  const handleAction = (actionId: string) => {
    setIsOpen(false);
    onAction(actionId);
  };

  return (
    <div className="fixed bottom-20 right-6 z-40 md:bottom-6">
      {/* Action Menu */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 space-y-2 mb-2">
          {actions.map((action, index) => {
            const Icon = action.icon;
            return (
              <div
                key={action.id}
                className="flex items-center gap-2 animate-fadeIn"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <span className="bg-gray-900 text-white text-sm px-3 py-1 rounded-full whitespace-nowrap shadow-lg">
                  {action.label}
                </span>
                <Button
                  onClick={() => handleAction(action.id)}
                  className={`h-12 w-12 rounded-full shadow-lg ${action.color}`}
                >
                  <Icon className="h-5 w-5 text-white" />
                </Button>
              </div>
            );
          })}
        </div>
      )}

      {/* Main FAB */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className={`h-14 w-14 rounded-full shadow-xl transition-all ${
          isOpen 
            ? "bg-red-600 hover:bg-red-700 rotate-45" 
            : "bg-green-600 hover:bg-green-700"
        }`}
      >
        {isOpen ? (
          <X className="h-6 w-6 text-white" />
        ) : (
          <Plus className="h-6 w-6 text-white" />
        )}
      </Button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-20 -z-10"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
