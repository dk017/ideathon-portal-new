import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Calendar,
  Lightbulb,
  Users,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { useHackathons } from "@/hooks/useHackathons";
import { useIdeas } from "@/hooks/useIdeas";
import { mockUsers } from "@/data/mockData";
import LoadingCard from "@/components/common/LoadingCard";
import ErrorMessage from "@/components/common/ErrorMessage";

const AdminDashboard = () => {
  const {
    data: hackathons,
    isLoading: hackathonsLoading,
    error: hackathonsError,
    refetch: refetchHackathons,
  } = useHackathons();
  const {
    data: ideas,
    isLoading: ideasLoading,
    error: ideasError,
    refetch: refetchIdeas,
  } = useIdeas();

  const activeHackathons =
    hackathons?.filter((h) => h.status === "active") || [];
  const totalIdeas = ideas?.length || 0;
  const totalUsers = mockUsers.filter((u) => u.role === "user").length;
  const completionRate = 75; // Mock completion rate

  const recentActivity = [
    {
      id: 1,
      action: "New idea submitted",
      details: "Smart City Traffic Optimizer",
      time: "2 hours ago",
      type: "idea",
    },
    {
      id: 2,
      action: "Hackathon created",
      details: "AI Innovation Challenge 2024",
      time: "1 day ago",
      type: "hackathon",
    },
    {
      id: 3,
      action: "User joined",
      details: "Jane Smith registered",
      time: "2 days ago",
      type: "user",
    },
    {
      id: 4,
      action: "Idea moved to testing",
      details: "Healthcare Chatbot Assistant",
      time: "3 days ago",
      type: "progress",
    },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "idea":
        return <Lightbulb className="h-4 w-4 text-yellow-500" />;
      case "hackathon":
        return <Calendar className="h-4 w-4 text-blue-500" />;
      case "user":
        return <Users className="h-4 w-4 text-green-500" />;
      case "progress":
        return <TrendingUp className="h-4 w-4 text-purple-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  // Show error if both requests failed
  if (hackathonsError && ideasError) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage hackathons, ideas, and participants
          </p>
        </div>
        <ErrorMessage
          message="Failed to load dashboard data"
          onRetry={() => {
            refetchHackathons();
            refetchIdeas();
          }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Manage hackathons, ideas, and participants
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Hackathons
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {hackathonsLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-8 w-12" />
                <Skeleton className="h-4 w-20" />
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {activeHackathons.length}
                </div>
                <p className="text-xs text-muted-foreground">
                  {hackathons?.filter((h) => h.status === "upcoming").length ||
                    0}{" "}
                  upcoming
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Ideas</CardTitle>
            <Lightbulb className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {ideasLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-8 w-12" />
                <Skeleton className="h-4 w-20" />
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold">{totalIdeas}</div>
                <p className="text-xs text-muted-foreground">
                  {ideas?.filter((i) => !i.isLongRunning).length || 0} active
                  projects
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Participants</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Completion Rate
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completionRate}%</div>
            <Progress value={completionRate} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Active Hackathons */}
      <Card>
        <CardHeader>
          <CardTitle>Active Hackathons</CardTitle>
          <CardDescription>Currently running hackathon events</CardDescription>
        </CardHeader>
        <CardContent>
          {hackathonsLoading ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="p-4 border border-gray-200 rounded-lg">
                  <div className="space-y-3">
                    <Skeleton className="h-6 w-1/3" />
                    <Skeleton className="h-4 w-2/3" />
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-4 w-24" />
                      <div className="flex space-x-2">
                        <Skeleton className="h-8 w-16" />
                        <Skeleton className="h-8 w-20" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : hackathonsError ? (
            <ErrorMessage
              message="Failed to load hackathons"
              onRetry={refetchHackathons}
            />
          ) : activeHackathons.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No active hackathons at the moment.
            </p>
          ) : (
            <div className="space-y-4">
              {activeHackathons.map((hackathon) => (
                <div
                  key={hackathon.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                >
                  <div className="space-y-1">
                    <h3 className="font-semibold text-foreground">
                      {hackathon.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {hackathon.description}
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span>
                        Ends: {new Date(hackathon.endDate).toLocaleDateString()}
                      </span>
                      <Badge variant="secondary">
                        {hackathon.currentParticipants}/
                        {hackathon.maxParticipants} participants
                      </Badge>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      Manage
                    </Button>
                    <Button size="sm">View Details</Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Latest platform activities and updates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
              >
                {getActivityIcon(activity.type)}
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.action}</p>
                  <p className="text-sm text-muted-foreground">
                    {activity.details}
                  </p>
                </div>
                <span className="text-xs text-gray-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
