import { useState, useEffect } from "react";

interface NavItem {
  id: string;
  label: string;
  icon: any;
  category: string;
}

interface CollapsibleNavCategoryProps {
  category: {
    id: string;
    label: string;
    icon: any;
  };
  items: NavItem[];
  activeTab: string;
  onItemClick: (id: string) => void;
  onMenuClose: () => void;
  isPrimaryAnchor?: boolean;
}

export function CollapsibleNavCategory({
  category,
  items,
  activeTab,
  onItemClick,
  onMenuClose,
  isPrimaryAnchor = false
}: CollapsibleNavCategoryProps) {
  const CategoryIcon = category.icon;
  const hasActiveItem = items.some(item => item.id === activeTab);
  const [isExpanded, setIsExpanded] = useState(hasActiveItem);
  
  // Auto-expand if category contains active item
  useEffect(() => {
    if (hasActiveItem) setIsExpanded(true);
  }, [hasActiveItem]);

  // Primary Anchor (Dashboard) - Always visible, no collapsing
  if (isPrimaryAnchor) {
    return (
      <div className="mb-6">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => {
                onItemClick(item.id);
                onMenuClose();
              }}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left
                ${isActive 
                  ? 'bg-[#2E7D32]/8 text-[#2E7D32]' 
                  : 'text-gray-700 hover:bg-gray-50'
                }
              `}
            >
              <Icon 
                className={`h-5 w-5 flex-shrink-0 ${
                  isActive ? 'text-[#2E7D32]' : 'text-gray-600 opacity-60'
                }`} 
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span className={`text-base font-semibold ${
                isActive ? 'text-[#2E7D32]' : 'text-gray-900'
              }`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="mb-4">
      {/* Collapsible Category Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-50 rounded-lg transition-colors group"
      >
        <h3 className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider flex-1 text-left">
          {category.label}
        </h3>
        <svg
          className={`h-3.5 w-3.5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Collapsible Navigation Items */}
      {isExpanded && (
        <nav className="space-y-0.5 mt-1" aria-label={`${category.label} navigation`}>
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => {
                  onItemClick(item.id);
                  onMenuClose();
                }}
                className={`
                  w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-left
                  ${isActive 
                    ? 'bg-[#2E7D32]/8 text-[#2E7D32]' 
                    : 'text-gray-700 hover:bg-gray-50'
                  }
                `}
              >
                {/* Icon - 20px, 60% opacity when inactive */}
                <Icon 
                  className={`h-5 w-5 flex-shrink-0 ${
                    isActive ? 'text-[#2E7D32]' : 'text-gray-600 opacity-60'
                  }`}
                  strokeWidth={2}
                />

                {/* Label */}
                <span className={`text-sm font-medium flex-1 ${
                  isActive ? 'text-[#2E7D32]' : 'text-gray-900'
                }`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>
      )}
    </div>
  );
}