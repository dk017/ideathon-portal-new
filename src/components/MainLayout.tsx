import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import { cn } from "@/lib/utils";
import EventCreationModal from "@/components/events/EventCreationModal";

const MainLayout = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showCreateEventModal, setShowCreateEventModal] = useState(false);

  const handleMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const getActiveView = () => {
    const path = location.pathname;
    if (path.startsWith("/events/")) return "events";
    if (path.startsWith("/ideas/")) return "all-ideas";
    if (path.startsWith("/my-ideas")) return "my-ideas";
    if (path.startsWith("/skill-matrix")) return "skill-matrix";
    if (path.startsWith("/analytics")) return "analytics";
    if (path.startsWith("/users")) return "users";
    return "dashboard";
  };

  const handleViewChange = (view: string) => {
    switch (view) {
      case "dashboard":
        navigate("/");
        break;
      case "events":
        navigate("/events");
        break;
      case "all-ideas":
        navigate("/ideas");
        break;
      case "my-ideas":
        navigate("/my-ideas");
        break;
      case "skill-matrix":
        navigate("/skill-matrix");
        break;
      case "analytics":
        navigate("/analytics");
        break;
      case "users":
        navigate("/users");
        break;
      default:
        navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar
        onMenuToggle={handleMenuToggle}
        isMobileMenuOpen={isMobileMenuOpen}
      />
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <div
          className={cn(
            "fixed md:relative z-30 h-full bg-card/90 backdrop-blur-lg shadow-xl md:shadow-none border-r border-border",
            isMobileMenuOpen ? "block" : "hidden md:block"
          )}
        >
          <Sidebar
            activeView={getActiveView()}
            onViewChange={handleViewChange}
            isOpen={isMobileMenuOpen || true}
            onCreateEvent={() => setShowCreateEventModal(true)}
          />
        </div>

        {/* Mobile overlay */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-20 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Main content */}
        <div className="flex-1 overflow-auto">
          <div className="container max-w-7xl mx-auto p-6">
            <div className="bg-card rounded-lg shadow-sm p-6 min-h-[calc(100vh-8rem)]">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
      <EventCreationModal
        isOpen={showCreateEventModal}
        onClose={() => setShowCreateEventModal(false)}
      />
    </div>
  );
};

export default MainLayout;
