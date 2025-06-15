import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import MainLayout from "@/components/MainLayout";
import SignIn from "@/pages/SignIn";
import NotFound from "@/pages/NotFound";
import Dashboard from "@/pages/Dashboard";
import Events from "@/pages/Events";
import EventIdeas from "@/pages/EventIdeas";
import AllIdeas from "@/pages/AllIdeas";
import MyIdeas from "@/pages/MyIdeas";
import SkillMatrix from "@/pages/SkillMatrix";
import Analytics from "@/pages/Analytics";
import Users from "@/pages/Users";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Router>
          <AuthProvider>
            <Routes>
              <Route path="/signin" element={<SignIn />} />
              <Route path="/" element={<MainLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="events" element={<Events />} />
                <Route path="events/:eventId/ideas" element={<EventIdeas />} />
                <Route path="ideas" element={<AllIdeas />} />
                <Route path="my-ideas" element={<MyIdeas />} />
                <Route path="skill-matrix" element={<SkillMatrix />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="users" element={<Users />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </AuthProvider>
        </Router>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
