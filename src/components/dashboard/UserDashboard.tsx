
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Calendar, 
  Lightbulb, 
  Users, 
  Clock,
  Trophy,
  Target
} from 'lucide-react';
import { mockHackathons, mockIdeas } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';

const UserDashboard = () => {
  const { user } = useAuth();
  const activeHackathons = mockHackathons.filter(h => h.status === 'active');
  const userIdeas = mockIdeas.filter(i => i.owner.id === user?.id);
  const participatingIdeas = mockIdeas.filter(i => 
    i.participants.some(p => p.id === user?.id) && i.owner.id !== user?.id
  );

  const upcomingDeadlines = [
    { event: 'AI Innovation Challenge - Planning Phase', date: '2024-07-01', type: 'deadline' },
    { event: 'Submit final presentation', date: '2024-07-30', type: 'submission' },
  ];

  const achievements = [
    { title: 'First Idea Submitted', description: 'Successfully submitted your first hackathon idea', earned: true },
    { title: 'Team Player', description: 'Joined 3 different teams', earned: true },
    { title: 'Innovation Leader', description: 'Led a team to completion', earned: false },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
        <p className="text-gray-600 mt-2">Track your hackathon progress and discover new opportunities</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Ideas</CardTitle>
            <Lightbulb className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userIdeas.length}</div>
            <p className="text-xs text-muted-foreground">
              {userIdeas.filter(i => !i.isLongRunning).length} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Participating</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{participatingIdeas.length}</div>
            <p className="text-xs text-muted-foreground">
              collaborating on ideas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeHackathons.length}</div>
            <p className="text-xs text-muted-foreground">
              hackathons available
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Active Hackathons */}
      <Card>
        <CardHeader>
          <CardTitle>Active Hackathons</CardTitle>
          <CardDescription>Join exciting hackathon events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeHackathons.map((hackathon) => {
              const daysLeft = Math.ceil((new Date(hackathon.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
              const progress = (hackathon.currentParticipants / (hackathon.maxParticipants || 100)) * 100;
              
              return (
                <div key={hackathon.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-semibold text-lg">{hackathon.name}</h3>
                      <p className="text-sm text-gray-600">{hackathon.description}</p>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <Badge variant={daysLeft > 7 ? "secondary" : "destructive"}>
                        <Clock className="w-3 h-3 mr-1" />
                        {daysLeft} days left
                      </Badge>
                      <span className="text-gray-500">
                        {hackathon.currentParticipants} participants
                      </span>
                    </div>
                    
                    <Progress value={progress} className="h-2" />
                    
                    <div className="flex space-x-2">
                      <Button size="sm" className="flex-1">Join Event</Button>
                      <Button variant="outline" size="sm">Learn More</Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Deadlines */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Deadlines</CardTitle>
            <CardDescription>Don't miss important dates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingDeadlines.map((deadline, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                  <Target className="h-5 w-5 text-orange-500" />
                  <div className="flex-1">
                    <p className="font-medium">{deadline.event}</p>
                    <p className="text-sm text-gray-600">Due: {new Date(deadline.date).toLocaleDateString()}</p>
                  </div>
                  <Badge variant={deadline.type === 'deadline' ? 'destructive' : 'secondary'}>
                    {deadline.type}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card>
          <CardHeader>
            <CardTitle>Achievements</CardTitle>
            <CardDescription>Your hackathon milestones</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {achievements.map((achievement, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                  <Trophy className={`h-5 w-5 ${achievement.earned ? 'text-yellow-500' : 'text-gray-400'}`} />
                  <div className="flex-1">
                    <p className={`font-medium ${achievement.earned ? 'text-gray-900' : 'text-gray-500'}`}>
                      {achievement.title}
                    </p>
                    <p className="text-sm text-gray-600">{achievement.description}</p>
                  </div>
                  {achievement.earned ? (
                    <Badge className="bg-green-100 text-green-700">Earned</Badge>
                  ) : (
                    <Badge variant="outline">Locked</Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserDashboard;
