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
import {
  Calendar,
  Lightbulb,
  Users,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Award,
  Target,
} from "lucide-react";
import { useEvents } from "@/hooks/useEvents";
import { useIdeas } from "@/hooks/useIdeas";
import { useAuth } from "@/contexts/AuthContext";
import LoadingCard from "@/components/common/LoadingCard";
import ErrorMessage from "@/components/common/ErrorMessage";

const UserDashboard = () => {
  const { user } = useAuth();
  const {
    data: events,
    isLoading: eventsLoading,
    error: eventsError,
  } = useEvents();
  const {
    data: ideas,
    isLoading: ideasLoading,
    error: ideasError,
  } = useIdeas();

  const userIdeas = ideas?.filter((idea) => idea.owner.id === user?.id) || [];
  const participatingIdeas =
    ideas?.filter(
      (idea) =>
        idea.participants.some((p) => p.id === user?.id) &&
        idea.owner.id !== user?.id
    ) || [];
  const activeEvents = events?.filter((h) => h.status === "active") || [];

  if (eventsLoading || ideasLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-muted-foreground mt-2">
            Track your event progress and discover new opportunities
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <LoadingCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-gray-600 mt-2">
          Track your event progress and discover new opportunities
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200 hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700">
              My Ideas
            </CardTitle>
            <Lightbulb className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-800">
              {userIdeas.length}
            </div>
            <p className="text-xs text-blue-600">
              {userIdeas.filter((i) => !i.isLongRunning).length} active
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-violet-100 border-purple-200 hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-700">
              Participating
            </CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-800">
              {participatingIdeas.length}
            </div>
            <p className="text-xs text-purple-600">event ideas</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-50 to-green-100 border-emerald-200 hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-emerald-700">
              Active Events
            </CardTitle>
            <Calendar className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-800">
              {activeEvents.length}
            </div>
            <p className="text-xs text-emerald-600">event events</p>
          </CardContent>
        </Card>
      </div>

      {/* Active Hackathons */}
      <Card className="idea-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-indigo-600" />
            <span>Active Events</span>
          </CardTitle>
          <CardDescription>Your ongoing event events</CardDescription>
        </CardHeader>
        <CardContent>
          {eventsError ? (
            <ErrorMessage message="Failed to load events" />
          ) : activeEvents.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No active events at the moment.
            </p>
          ) : (
            <div className="space-y-4">
              {activeEvents.map((event) => (
                <div
                  key={event.id}
                  className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg border border-indigo-200"
                >
                  <div className="space-y-2">
                    <h3 className="font-semibold text-indigo-900">
                      {event.name}
                    </h3>
                    <p className="text-sm text-indigo-700">
                      {event.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-indigo-600">
                        <div className="flex items-center">
                          <Clock className="mr-1 h-4 w-4" />
                          <Badge className="bg-indigo-100 text-indigo-800 border-indigo-200">
                            {Math.max(
                              0,
                              Math.ceil(
                                (new Date(event.endDate).getTime() -
                                  new Date().getTime()) /
                                  (1000 * 60 * 60 * 24)
                              )
                            )}{" "}
                            days left
                          </Badge>
                        </div>
                        <span>{event.currentParticipants} participants</span>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-indigo-300 text-indigo-700 hover:bg-indigo-50"
                        >
                          Join Event
                        </Button>
                        <Button
                          size="sm"
                          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700"
                        >
                          Learn More
                        </Button>
                      </div>
                    </div>
                    <Progress
                      value={
                        (event.currentParticipants / event.maxParticipants) *
                        100
                      }
                      className="h-2"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Deadlines */}
        <Card className="idea-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-orange-500" />
              <span>Upcoming Deadlines</span>
            </CardTitle>
            <CardDescription>Don't miss important dates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border border-orange-200">
                <div>
                  <p className="font-medium text-orange-900">
                    AI Innovation Challenge - Planning Phase
                  </p>
                  <p className="text-sm text-orange-700">
                    Submit your project plan
                  </p>
                </div>
                <Badge className="bg-orange-100 text-orange-800 border-orange-200">
                  deadline
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card className="idea-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Award className="h-5 w-5 text-emerald-500" />
              <span>Achievements</span>
            </CardTitle>
            <CardDescription>Your event milestones</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg border border-emerald-200">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-emerald-100 rounded-full">
                    <Target className="h-4 w-4 text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-medium text-emerald-900">
                      First Idea Submitted
                    </p>
                    <p className="text-sm text-emerald-700">
                      Successfully submitted your first event idea
                    </p>
                  </div>
                </div>
                <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">
                  Earned
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserDashboard;
