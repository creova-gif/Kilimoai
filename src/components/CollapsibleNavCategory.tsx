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
        className={`
          relative w-full flex items-center gap-3 px-4 py-3 rounded-xl
          transition-all duration-300 ease-out group overflow-hidden
          ${isExpanded 
            ? 'bg-gradient-to-r from-[#2E7D32]/10 via-green-50 to-transparent shadow-sm border-l-4 border-[#2E7D32]' 
            : 'hover:bg-gradient-to-r hover:from-gray-50 hover:via-gray-50/50 hover:to-transparent hover:border-l-4 hover:border-gray-300'
          }
        `}
      >
        {/* Animated background shimmer on hover */}
        <div className={`
          absolute inset-0 -translate-x-full group-hover:translate-x-full
          transition-transform duration-700 ease-out
          bg-gradient-to-r from-transparent via-white/40 to-transparent
          ${isExpanded ? 'opacity-0' : 'opacity-100'}
        `} />
        
        {/* Label with enhanced typography */}
        <h3 className={`
          relative text-[10px] font-bold uppercase tracking-[0.1em] flex-1 text-left
          transition-all duration-300 ease-out
          ${isExpanded 
            ? 'text-[#2E7D32] translate-x-1' 
            : 'text-gray-500 group-hover:text-gray-700 group-hover:translate-x-0.5'
          }
        `}>
          {category.label}
        </h3>
        
        {/* Enhanced chevron with rotation and scale */}
        <div className={`
          relative flex items-center justify-center w-6 h-6 rounded-md
          transition-all duration-300 ease-out
          ${isExpanded 
            ? 'bg-[#2E7D32] shadow-md shadow-[#2E7D32]/20 rotate-180 scale-110' 
            : 'bg-gray-100 group-hover:bg-gray-200 group-hover:scale-105'
          }
        `}>
          <svg
            className={`h-3 w-3 transition-colors duration-300 ${isExpanded ? 'text-white' : 'text-gray-500'}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        
        {/* Active state indicator pulse */}
        {isExpanded && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#2E7D32] rounded-r-full animate-pulse" />
        )}
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