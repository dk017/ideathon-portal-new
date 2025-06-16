import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import AdminDashboard from "@/components/dashboard/AdminDashboard";
import UserDashboard from "@/components/dashboard/UserDashboard";

const Dashboard = () => {
  const { user } = useAuth();
  return user?.role === "admin" ? <AdminDashboard /> : <UserDashboard />;
};

export default Dashboard;
