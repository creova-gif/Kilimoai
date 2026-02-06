import { useState, useEffect } from "react";
import { 
  X, 
  Bell, 
  CheckCircle, 
  AlertTriangle, 
  Info, 
  TrendingUp,
  Cloud,
  Leaf,
  Calendar,
  Clock,
  Trash2
} from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "success" | "warning" | "info" | "alert";
  timestamp: string;
  read: boolean;
  category: "weather" | "market" | "task" | "system" | "health";
}

interface NotificationPanelProps {
  userId: string;
  onClose: () => void;
}

export function NotificationPanel({ userId, onClose }: NotificationPanelProps) {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "Weather Alert",
      message: "Heavy rainfall expected in the next 48 hours. Consider delaying fertilizer application.",
      type: "warning",
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      read: false,
      category: "weather"
    },
    {
      id: "2",
      title: "Market Price Update",
      message: "Maize prices increased by 5.2% in Morogoro market. Great time to sell!",
      type: "success",
      timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
      read: false,
      category: "market"
    },
    {
      id: "3",
      title: "Task Reminder",
      message: "Don't forget to apply fertilizer to maize field - Due today",
      type: "info",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
      read: true,
      category: "task"
    },
    {
      id: "4",
      title: "Crop Health Alert",
      message: "AI detected potential pest activity in section A. Scout immediately.",
      type: "alert",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
      read: false,
      category: "health"
    },
    {
      id: "5",
      title: "Welcome to KILIMO!",
      message: "Get started by asking our AI assistant questions about your crops.",
      type: "success",
      timestamp: "Just now",
      read: false
    }
  ]);

  const [filter, setFilter] = useState<"all" | "unread">("all");

  const getIcon = (category: string) => {
    switch (category) {
      case "weather": return Cloud;
      case "market": return TrendingUp;
      case "task": return Calendar;
      case "health": return Leaf;
      default: return Bell;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "success": return "text-green-600 bg-green-100";
      case "warning": return "text-yellow-600 bg-yellow-100";
      case "alert": return "text-red-600 bg-red-100";
      default: return "text-blue-600 bg-blue-100";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "success": return CheckCircle;
      case "warning": return AlertTriangle;
      case "alert": return AlertTriangle;
      default: return Info;
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const getTimeAgo = (timestamp: string) => {
    const now = Date.now();
    const time = new Date(timestamp).getTime();
    const diff = now - time;

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const filteredNotifications = filter === "unread" 
    ? notifications.filter(n => !n.read)
    : notifications;

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-100 rounded-xl">
              <Bell className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h2 className="font-bold text-lg text-gray-900">Notifications</h2>
              <p className="text-xs text-gray-600">{unreadCount} unread</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`
              px-4 py-2 rounded-xl text-sm font-medium transition-all
              ${filter === "all" 
                ? "bg-blue-600 text-white" 
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }
            `}
          >
            All ({notifications.length})
          </button>
          <button
            onClick={() => setFilter("unread")}
            className={`
              px-4 py-2 rounded-xl text-sm font-medium transition-all
              ${filter === "unread" 
                ? "bg-blue-600 text-white" 
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }
            `}
          >
            Unread ({unreadCount})
          </button>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="ml-auto px-3 py-2 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
            >
              Mark all read
            </button>
          )}
        </div>
      </div>

      {/* Notifications List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-flex p-4 bg-gray-100 rounded-2xl mb-3">
              <Bell className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">No notifications</h3>
            <p className="text-sm text-gray-600">
              {filter === "unread" ? "All caught up!" : "You have no notifications yet"}
            </p>
          </div>
        ) : (
          filteredNotifications.map((notification) => {
            const CategoryIcon = getIcon(notification.category);
            const TypeIcon = getTypeIcon(notification.type);
            const typeColor = getTypeColor(notification.type);

            return (
              <div
                key={notification.id}
                className={`
                  relative p-4 rounded-2xl border-2 transition-all cursor-pointer group
                  ${notification.read 
                    ? "bg-white border-gray-200" 
                    : "bg-blue-50 border-blue-200 shadow-sm"
                  }
                `}
                onClick={() => markAsRead(notification.id)}
              >
                {!notification.read && (
                  <div className="absolute top-4 right-4 w-2 h-2 bg-blue-600 rounded-full"></div>
                )}

                <div className="flex gap-3">
                  <div className={`flex-shrink-0 p-2 ${typeColor} rounded-xl`}>
                    <CategoryIcon className="h-5 w-5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-semibold text-sm text-gray-900">
                        {notification.title}
                      </h3>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(notification.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded-lg transition-all"
                      >
                        <Trash2 className="h-3 w-3 text-gray-500" />
                      </button>
                    </div>

                    <p className="text-sm text-gray-600 mb-2">
                      {notification.message}
                    </p>

                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Clock className="h-3 w-3" />
                      <span>{getTimeAgo(notification.timestamp)}</span>
                      <span>•</span>
                      <Badge variant="secondary" className="text-xs">
                        {notification.category}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}