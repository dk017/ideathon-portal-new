import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Home,
  Calendar,
  Lightbulb,
  Plus,
  BarChart3,
  Search,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
  isOpen: boolean;
  onCreateEvent?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  onViewChange,
  isOpen,
  onCreateEvent,
}) => {
  const { user } = useAuth();

  const adminMenuItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "events", label: "Events", icon: Calendar },
    { id: "all-ideas", label: "All Ideas", icon: Lightbulb },
    { id: "skill-matrix", label: "Skill Matrix", icon: Search },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
  ];

  const userMenuItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "events", label: "Events", icon: Calendar },
    { id: "my-ideas", label: "My Ideas", icon: Lightbulb },
    { id: "all-ideas", label: "Browse Ideas", icon: Sparkles },
  ];

  const menuItems = user?.role === "admin" ? adminMenuItems : userMenuItems;

  return (
    <div
      className={cn(
        "bg-card border-r border-border h-full transition-all duration-300 ease-in-out",
        isOpen ? "w-64" : "w-0 md:w-16"
      )}
    >
      <div className={cn("p-4 space-y-2", !isOpen && "md:px-2")}>
        {user?.role === "admin" && (
          <Button
            onClick={onCreateEvent}
            className={cn(
              "w-full justify-start bg-primary hover:bg-primary/90 text-primary-foreground",
              !isOpen && "md:w-12 md:h-12 md:p-0"
            )}
          >
            <Plus size={20} />
            {isOpen && <span className="ml-2">Create Event</span>}
          </Button>
        )}

        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView.toLowerCase() === item.id.toLowerCase();

            return (
              <Button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start transition-colors",
                  isActive && "bg-primary/10 text-primary border-primary/20",
                  !isOpen && "md:w-12 md:h-12 md:p-0"
                )}
              >
                <Icon size={20} />
                {isOpen && <span className="ml-2">{item.label}</span>}
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
