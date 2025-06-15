import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEvents } from "@/hooks/useEvents";
import { useIdeas } from "@/hooks/useIdeas";
import { Calendar, Lightbulb, Users } from "lucide-react";

const AdminDashboard = () => {
  const { data: events } = useEvents();
  const { data: ideas } = useIdeas();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{events?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              Active and upcoming events
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Ideas</CardTitle>
            <Lightbulb className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ideas?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              Submitted ideas across all events
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Coming Soon</div>
            <p className="text-xs text-muted-foreground">
              Track user engagement
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const UserDashboard = () => {
  const { data: events } = useEvents();
  const { data: ideas } = useIdeas();

  const myIdeas =
    ideas?.filter((idea) => idea.creatorId === "current-user-id") || [];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Welcome Back!</h1>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
            <CardDescription>Events you can participate in</CardDescription>
          </CardHeader>
          <CardContent>
            {events?.length ? (
              <ul className="space-y-2">
                {events.slice(0, 3).map((event) => (
                  <li
                    key={event.id}
                    className="flex items-center justify-between"
                  >
                    <span>{event.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {new Date(event.startDate).toLocaleDateString()}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">No upcoming events</p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>My Ideas</CardTitle>
            <CardDescription>Your submitted ideas</CardDescription>
          </CardHeader>
          <CardContent>
            {myIdeas.length ? (
              <ul className="space-y-2">
                {myIdeas.slice(0, 3).map((idea) => (
                  <li
                    key={idea.id}
                    className="flex items-center justify-between"
                  >
                    <span>{idea.title}</span>
                    <span className="text-sm text-muted-foreground">
                      {idea.currentStage}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">No ideas submitted yet</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { user } = useAuth();

  return user?.role === "admin" ? <AdminDashboard /> : <UserDashboard />;
};

export default Dashboard;
