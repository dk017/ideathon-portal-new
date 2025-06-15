import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Home,
  Calendar,
  Lightbulb,
  Users,
  Settings,
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
}

const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  onViewChange,
  isOpen,
}) => {
  const { user } = useAuth();

  const adminMenuItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "hackathons", label: "Hackathons", icon: Calendar },
    { id: "all-ideas", label: "All Ideas", icon: Lightbulb },
    { id: "skill-matrix", label: "Skill Matrix", icon: Search },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "users", label: "Users", icon: Users },
  ];

  const userMenuItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "hackathons", label: "Hackathons", icon: Calendar },
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
            onClick={() => onViewChange("create-hackathon")}
            className={cn(
              "w-full justify-start bg-primary hover:bg-primary/90 text-primary-foreground",
              !isOpen && "md:w-12 md:h-12 md:p-0"
            )}
          >
            <Plus size={20} />
            {isOpen && <span className="ml-2">Create Hackathon</span>}
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

        {isOpen && (
          <div className="pt-4 border-t border-border">
            <div className="flex items-center space-x-3 p-2 rounded-lg bg-muted">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-sm text-primary">{user?.avatar}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {user?.name}
                </p>
                <Badge
                  variant={user?.role === "admin" ? "default" : "secondary"}
                  className="text-xs"
                >
                  {user?.role}
                </Badge>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
