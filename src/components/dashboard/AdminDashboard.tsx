import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar, Lightbulb, Users, TrendingUp, Clock } from "lucide-react";
import { useEvents } from "@/hooks/useEvents";
import { useIdeas } from "@/hooks/useIdeas";
import { mockUsers } from "@/data/mockData";
import ErrorMessage from "@/components/common/ErrorMessage";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useNavigate } from "react-router-dom";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const AdminDashboard = () => {
  const {
    data: events,
    isLoading: eventsLoading,
    error: eventsError,
    refetch: refetchEvents,
  } = useEvents();
  const {
    data: ideas,
    isLoading: ideasLoading,
    error: ideasError,
    refetch: refetchIdeas,
  } = useIdeas();
  const router = useNavigate();

  const activeEvents = events?.filter((h) => h.status === "active") || [];
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
      action: "Event created",
      details: "AI Innovation Challenge 2024",
      time: "1 day ago",
      type: "event",
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
      case "event":
        return <Calendar className="h-4 w-4 text-blue-500" />;
      case "user":
        return <Users className="h-4 w-4 text-green-500" />;
      case "progress":
        return <TrendingUp className="h-4 w-4 text-purple-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  // Mock data for charts
  const ideaTrendsData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Ideas Submitted",
        data: [2, 4, 3, 5, 6, 2, 4],
        backgroundColor: "rgba(99, 102, 241, 0.7)",
        borderColor: "rgba(99, 102, 241, 1)",
        borderWidth: 2,
        fill: true,
        tension: 0.4,
      },
    ],
  };
  const techStackData = {
    labels: ["React", "Python", "Node.js", "TensorFlow", "Vue", "Go"],
    datasets: [
      {
        label: "Usage",
        data: [12, 9, 7, 5, 3, 2],
        backgroundColor: [
          "rgba(99, 102, 241, 0.7)",
          "rgba(16, 185, 129, 0.7)",
          "rgba(251, 191, 36, 0.7)",
          "rgba(239, 68, 68, 0.7)",
          "rgba(59, 130, 246, 0.7)",
          "rgba(139, 92, 246, 0.7)",
        ],
        borderWidth: 1,
      },
    ],
  };
  const timelineEvents = [
    { name: "AI Innovation Challenge", date: "2024-06-15", status: "active" },
    {
      name: "Sustainability Hackathon",
      date: "2024-08-01",
      status: "upcoming",
    },
    { name: "FinTech Revolution", date: "2024-04-01", status: "completed" },
  ];
  const activityFeed = [
    {
      id: 1,
      text: "New idea submitted: Smart City Traffic Optimizer",
      time: "2h ago",
    },
    {
      id: 2,
      text: "Event created: AI Innovation Challenge 2024",
      time: "1d ago",
    },
    { id: 3, text: "User joined: Jane Smith", time: "2d ago" },
    {
      id: 4,
      text: "Idea moved to testing: Healthcare Chatbot Assistant",
      time: "3d ago",
    },
  ];
  const pendingApprovals = [
    {
      id: 1,
      type: "Join Request",
      detail: "John Doe requests to join AI Innovation Challenge",
    },
    { id: 2, type: "Idea", detail: "Review: AI SaaS Challenge" },
  ];
  const topContributors = [
    { id: 1, name: "Jane Smith", ideas: 5 },
    { id: 2, name: "John Doe", ideas: 4 },
    { id: 3, name: "Alice Lee", ideas: 3 },
  ];

  // Show error if both requests failed
  if (eventsError && ideasError) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage events, ideas, and participants
          </p>
        </div>
        <ErrorMessage
          message="Failed to load dashboard data"
          onRetry={() => {
            refetchEvents();
            refetchIdeas();
          }}
        />
      </div>
    );
  }

  // Compute status for each event based on date
  const getEventStatus = (startDate, endDate) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (now < start) return "upcoming";
    if (now > end) return "completed";
    return "active";
  };

  return (
    <div className="space-y-8">
      {/* Top Section: Stats & Actions */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-1">
          {/* Active Events - Clickable */}
          <div
            role="button"
            tabIndex={0}
            aria-label="View all events"
            onClick={() => router("/events")}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") router("/events");
            }}
            className="focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-lg cursor-pointer transition-shadow hover:shadow-lg"
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Events
                </CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {events?.filter((e) => e.status === "active").length || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Currently running
                </p>
              </CardContent>
            </Card>
          </div>
          {/* Total Ideas - Clickable */}
          <div
            role="button"
            tabIndex={0}
            aria-label="View all ideas"
            onClick={() => router("/ideas")}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") router("/ideas");
            }}
            className="focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-lg cursor-pointer transition-shadow hover:shadow-lg"
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Ideas
                </CardTitle>
                <Lightbulb className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{ideas?.length || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Across all events
                </p>
              </CardContent>
            </Card>
          </div>
          {/* Active Users */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Users
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalUsers}</div>
              <p className="text-xs text-muted-foreground">Registered users</p>
            </CardContent>
          </Card>
          {/* Completion Rate */}
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
      </div>

      {/* Main Section: Analytics & Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: 2/3 width */}
        <div className="lg:col-span-2 space-y-6">
          {/* Event Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Event Timeline</CardTitle>
              <CardDescription>
                All events (color-coded by status)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                {events && events.length > 0 ? (
                  events.map((evt, idx) => {
                    const status = getEventStatus(evt.startDate, evt.endDate);
                    return (
                      <div
                        key={evt.id || idx}
                        className="flex items-center gap-4"
                      >
                        <div
                          className={`w-3 h-3 rounded-full ${
                            status === "active"
                              ? "bg-green-500"
                              : status === "upcoming"
                              ? "bg-blue-500"
                              : "bg-gray-400"
                          }`}
                        ></div>
                        <span className="font-medium text-foreground">
                          {evt.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {evt.startDate} - {evt.endDate}
                        </span>
                        <Badge
                          variant={
                            status === "active"
                              ? "default"
                              : status === "upcoming"
                              ? "secondary"
                              : "outline"
                          }
                        >
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </Badge>
                      </div>
                    );
                  })
                ) : (
                  <span className="text-muted-foreground text-sm">
                    No events found
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
          {/* Idea Submission Trends */}
          <Card>
            <CardHeader>
              <CardTitle>Idea Submission Trends</CardTitle>
              <CardDescription>
                Ideas submitted per day (last week)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Line
                data={ideaTrendsData}
                options={{
                  responsive: true,
                  plugins: { legend: { display: false } },
                }}
                height={120}
              />
            </CardContent>
          </Card>
          {/* Popular Tech Stacks */}
          <Card>
            <CardHeader>
              <CardTitle>Popular Tech Stacks</CardTitle>
              <CardDescription>Most used technologies in ideas</CardDescription>
            </CardHeader>
            <CardContent>
              <Bar
                data={techStackData}
                options={{
                  responsive: true,
                  plugins: { legend: { display: false } },
                }}
                height={120}
              />
            </CardContent>
          </Card>
        </div>
        {/* Right: 1/3 width */}
        <div className="space-y-6">
          {/* Live Activity Feed */}
          <Card>
            <CardHeader>
              <CardTitle>Live Activity Feed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {activityFeed.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-2 text-sm text-foreground"
                  >
                    <span className="w-2 h-2 rounded-full bg-indigo-500 inline-block"></span>
                    <span>{item.text}</span>
                    <span className="ml-auto text-xs text-muted-foreground">
                      {item.time}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          {/* Pending Approvals */}
          <Card>
            <CardHeader>
              <CardTitle>Pending Approvals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {pendingApprovals.length === 0 ? (
                  <span className="text-muted-foreground text-sm">
                    No pending approvals
                  </span>
                ) : (
                  pendingApprovals.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-2 text-sm"
                    >
                      <Badge variant="secondary">{item.type}</Badge>
                      <span>{item.detail}</span>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
          {/* Top Contributors */}
          <Card>
            <CardHeader>
              <CardTitle>Top Contributors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {topContributors.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center gap-2 text-sm"
                  >
                    <span className="font-medium text-foreground">
                      {user.name}
                    </span>
                    <Badge variant="outline">{user.ideas} ideas</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
