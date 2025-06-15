
import React from 'react';
import { useHackathons } from '@/hooks/useHackathons';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Users, Clock, Trophy } from 'lucide-react';
import LoadingCard from '@/components/common/LoadingCard';
import ErrorMessage from '@/components/common/ErrorMessage';

const Hackathons = () => {
  const { data: hackathons, isLoading, error } = useHackathons();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Hackathons</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <LoadingCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return <ErrorMessage message="Failed to load hackathons" />;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDaysUntil = (date: string) => {
    const now = new Date();
    const targetDate = new Date(date);
    const diffTime = targetDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Hackathons</h1>
        <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
          <Trophy className="mr-2 h-4 w-4" />
          View Leaderboard
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hackathons?.map((hackathon) => {
          const daysUntilStart = getDaysUntil(hackathon.startDate);
          const daysUntilEnd = getDaysUntil(hackathon.endDate);
          
          return (
            <Card key={hackathon.id} className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg font-semibold line-clamp-2">
                    {hackathon.name}
                  </CardTitle>
                  <Badge className={getStatusColor(hackathon.status)}>
                    {hackathon.status}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-gray-600 text-sm line-clamp-2">
                  {hackathon.description}
                </p>
                
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="mr-2 h-4 w-4" />
                    {new Date(hackathon.startDate).toLocaleDateString()} - {new Date(hackathon.endDate).toLocaleDateString()}
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-500">
                    <Users className="mr-2 h-4 w-4" />
                    {hackathon.currentParticipants}/{hackathon.maxParticipants || 'Unlimited'} participants
                  </div>
                  
                  {hackathon.status === 'upcoming' && daysUntilStart > 0 && (
                    <div className="flex items-center text-sm text-blue-600">
                      <Clock className="mr-2 h-4 w-4" />
                      Starts in {daysUntilStart} days
                    </div>
                  )}
                  
                  {hackathon.status === 'active' && daysUntilEnd > 0 && (
                    <div className="flex items-center text-sm text-green-600">
                      <Clock className="mr-2 h-4 w-4" />
                      {daysUntilEnd} days remaining
                    </div>
                  )}
                </div>
                
                <div className="pt-2">
                  <Button className="w-full" variant={hackathon.status === 'active' ? 'default' : 'outline'}>
                    {hackathon.status === 'active' ? 'Join Now' : hackathon.status === 'upcoming' ? 'Register Interest' : 'View Results'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Hackathons;
