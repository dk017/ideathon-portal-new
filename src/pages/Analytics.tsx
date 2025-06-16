import React from "react";
import { useQuery } from "@tanstack/react-query";
import { dataService } from "@/services/dataService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import {
  TrendingUp,
  Users,
  Lightbulb,
  Calendar,
  Award,
  Activity,
} from "lucide-react";
import LoadingCard from "@/components/common/LoadingCard";
import ErrorMessage from "@/components/common/ErrorMessage";

const Analytics = () => {
  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ["users"],
    queryFn: dataService.getUsers,
  });

  const { data: ideas, isLoading: ideasLoading } = useQuery({
    queryKey: ["ideas"],
    queryFn: dataService.getIdeas,
  });

  const { data: events, isLoading: eventsLoading } = useQuery({
    queryKey: ["events"],
    queryFn: dataService.getEvents,
  });

  const isLoading = usersLoading || ideasLoading || eventsLoading;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-foreground">
          Analytics Dashboard
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <LoadingCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (!users || !ideas || !events) {
    return <ErrorMessage message="Failed to load analytics data" />;
  }

  // Calculate analytics data
  const totalParticipants = events.reduce(
    (sum, h) => sum + h.currentParticipants,
    0
  );
  const activeHackathons = events.filter((h) => h.status === "active").length;
  const completedIdeas = ideas.filter((i) => i.currentStage >= 5).length;
  const avgParticipantsPerIdea =
    ideas.reduce((sum, idea) => sum + idea.participants.length, 0) /
    ideas.length;

  // Ideas by stage data
  const stageData = [
    {
      stage: "Ideation",
      count: ideas.filter((i) => i.currentStage === 1).length,
    },
    {
      stage: "Planning",
      count: ideas.filter((i) => i.currentStage === 2).length,
    },
    {
      stage: "Development",
      count: ideas.filter((i) => i.currentStage === 3).length,
    },
    {
      stage: "Testing",
      count: ideas.filter((i) => i.currentStage === 4).length,
    },
    {
      stage: "Presentation",
      count: ideas.filter((i) => i.currentStage === 5).length,
    },
  ];

  // Tech stack popularity
  const techStackData = ideas
    .flatMap((idea) => idea.techStack)
    .reduce((acc, tech) => {
      acc[tech] = (acc[tech] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

  const topTechStack = Object.entries(techStackData)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 6)
    .map(([name, value]) => ({ name, value }));

  // Hackathon status distribution
  const statusData = [
    {
      name: "Active",
      value: events.filter((h) => h.status === "active").length,
      color: "#10B981",
    },
    {
      name: "Upcoming",
      value: events.filter((h) => h.status === "upcoming").length,
      color: "#3B82F6",
    },
    {
      name: "Completed",
      value: events.filter((h) => h.status === "completed").length,
      color: "#6B7280",
    },
  ];

  // Mock time series data for trends
  const trendData = [
    { month: "Jan", ideas: 5, participants: 25 },
    { month: "Feb", ideas: 8, participants: 35 },
    { month: "Mar", ideas: 12, participants: 50 },
    { month: "Apr", ideas: 15, participants: 65 },
    { month: "May", ideas: 18, participants: 80 },
    { month: "Jun", ideas: 22, participants: 95 },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold mb-6 text-white">
        Analytics Dashboard
      </h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Participants
                </p>
                <p className="text-2xl font-bold text-white">
                  {totalParticipants}
                </p>
                <p className="text-xs text-green-600">+12% from last month</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Lightbulb className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Ideas</p>
                <p className="text-2xl font-bold text-white">{ideas.length}</p>
                <p className="text-xs text-green-600">+8% from last month</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Active Hackathons
                </p>
                <p className="text-2xl font-bold text-white">
                  {activeHackathons}
                </p>
                <p className="text-xs text-blue-600">2 ending this week</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Award className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Completed Ideas
                </p>
                <p className="text-2xl font-bold text-white">
                  {completedIdeas}
                </p>
                <p className="text-xs text-gray-600">
                  {Math.round((completedIdeas / ideas.length) * 100)}%
                  completion rate
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ideas by Stage */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="mr-2 h-5 w-5" />
              Ideas by Stage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stageData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="stage" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Hackathon Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5" />
              Hackathon Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Popular Technologies */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="mr-2 h-5 w-5" />
              Popular Technologies
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topTechStack} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={80} />
                <Tooltip />
                <Bar dataKey="value" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Growth Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="mr-2 h-5 w-5" />
              Growth Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="ideas"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  name="Ideas"
                />
                <Line
                  type="monotone"
                  dataKey="participants"
                  stroke="#10B981"
                  strokeWidth={2}
                  name="Participants"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Summary Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Platform Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">
                {Math.round(avgParticipantsPerIdea * 10) / 10}
              </p>
              <p className="text-sm text-gray-600">
                Average participants per idea
              </p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">
                {users.length}
              </p>
              <p className="text-sm text-gray-600">Registered users</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-600">
                {Math.round(
                  (ideas.filter((i) => i.isLongRunning).length / ideas.length) *
                    100
                )}
                %
              </p>
              <p className="text-sm text-gray-600">Long-running projects</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;
