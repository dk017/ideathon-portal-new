import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserIdeas } from '@/hooks/useIdeas';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { dataService } from '@/services/dataService';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Lightbulb, Users, Search, Plus, Edit, Calendar } from 'lucide-react';
import LoadingCard from '@/components/common/LoadingCard';
import ErrorMessage from '@/components/common/ErrorMessage';
import IdeaCreationModal from '@/components/ideas/IdeaCreationModal';
import IdeaDetailsModal from '@/components/ideas/IdeaDetailsModal';

const MyIdeas = () => {
  const { user } = useAuth();
  const { data: ideas, isLoading, error } = useUserIdeas(user?.id || '');
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStage, setFilterStage] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedIdea, setSelectedIdea] = useState<any>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">My Ideas</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <LoadingCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return <ErrorMessage message="Failed to load your ideas" />;
  }

  const filteredIdeas = ideas?.filter(idea => {
    const matchesSearch = idea.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         idea.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStage = filterStage === 'all' || idea.currentStage.toString() === filterStage;
    
    return matchesSearch && matchesStage;
  });

  const getStageColor = (stage: number) => {
    const colors = [
      'status-open',
      'status-planning', 
      'status-development',
      'status-testing',
      'status-complete'
    ];
    return colors[stage - 1] || colors[0];
  };

  const getStageText = (stage: number) => {
    const stages = ['Ideation', 'Planning', 'Development', 'Testing', 'Presentation'];
    return stages[stage - 1] || 'Unknown';
  };

  const handleManageIdea = (idea: any) => {
    setSelectedIdea(idea);
    setShowDetailsModal(true);
  };

  const handleViewDetails = (idea: any) => {
    setSelectedIdea(idea);
    setShowDetailsModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Ideas</h1>
          <p className="text-gray-600 mt-1">Manage and track your innovation projects</p>
        </div>
        <Button 
          onClick={() => setShowCreateModal(true)}
          className="gradient-button text-white hover:shadow-lg"
        >
          <Plus className="mr-2 h-4 w-4" />
          Create New Idea
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="idea-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Lightbulb className="h-5 w-5 text-indigo-600" />
              <div>
                <p className="text-sm text-gray-600">Total Ideas</p>
                <p className="text-2xl font-bold text-gray-900">{ideas?.length || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="idea-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Collaborators</p>
                <p className="text-2xl font-bold text-gray-900">
                  {ideas?.reduce((total, idea) => total + idea.participants.length, 0) || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="idea-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Edit className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">In Development</p>
                <p className="text-2xl font-bold text-gray-900">
                  {ideas?.filter(idea => idea.currentStage >= 2 && idea.currentStage <= 4).length || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="idea-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600">Long Running</p>
                <p className="text-2xl font-bold text-gray-900">
                  {ideas?.filter(idea => idea.isLongRunning).length || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 p-4 gradient-card rounded-lg">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search your ideas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/50 border-indigo-200 focus:border-indigo-400"
            />
          </div>
        </div>
        <Select value={filterStage} onValueChange={setFilterStage}>
          <SelectTrigger className="w-40 bg-white/50 border-indigo-200 focus:border-indigo-400">
            <SelectValue placeholder="Stage" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Stages</SelectItem>
            <SelectItem value="1">Ideation</SelectItem>
            <SelectItem value="2">Planning</SelectItem>
            <SelectItem value="3">Development</SelectItem>
            <SelectItem value="4">Testing</SelectItem>
            <SelectItem value="5">Presentation</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Ideas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredIdeas?.map((idea) => (
          <Card key={idea.id} className="idea-card group">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-2">
                  <Lightbulb className="h-5 w-5 text-indigo-500" />
                  <span className="text-sm text-gray-500">{idea.referenceNumber}</span>
                </div>
                {idea.isLongRunning && (
                  <Badge variant="outline" className="border-purple-200 text-purple-700 bg-purple-50">
                    Long Running
                  </Badge>
                )}
              </div>
              <CardTitle className="text-lg font-semibold line-clamp-2 group-hover:text-indigo-600 transition-colors">
                {idea.title}
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <p className="text-gray-600 text-sm line-clamp-3">
                {idea.description}
              </p>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge className={`${getStageColor(idea.currentStage)} text-white border-0`}>
                    {getStageText(idea.currentStage)}
                  </Badge>
                  <div className="flex items-center text-sm text-gray-500">
                    <Users className="mr-1 h-4 w-4" />
                    {idea.participants.length} members
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-1">
                  {idea.techStack.slice(0, 3).map((tech, index) => (
                    <Badge key={index} variant="secondary" className="text-xs bg-indigo-50 text-indigo-700">
                      {tech}
                    </Badge>
                  ))}
                  {idea.techStack.length > 3 && (
                    <Badge variant="secondary" className="text-xs bg-indigo-50 text-indigo-700">
                      +{idea.techStack.length - 3}
                    </Badge>
                  )}
                </div>
                
                <div className="text-sm text-gray-500">
                  <span>Created: {new Date(idea.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              
              <div className="pt-2 space-y-2">
                {idea.requirements.some(req => req.isOpen) && (
                  <div className="flex items-center text-sm text-indigo-600 bg-indigo-50 p-2 rounded">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full mr-2 animate-pulse"></div>
                    Looking for {idea.requirements.filter(req => req.isOpen).length} team member(s)
                  </div>
                )}
                
                <div className="flex space-x-2">
                  <Button 
                    className="flex-1 gradient-button text-white" 
                    size="sm"
                    onClick={() => handleManageIdea(idea)}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Manage
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="border-indigo-200 text-indigo-600 hover:bg-indigo-50"
                    onClick={() => handleViewDetails(idea)}
                  >
                    View Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredIdeas?.length === 0 && (
        <div className="text-center py-12">
          <Lightbulb className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900">
            {ideas?.length === 0 ? 'No ideas created yet' : 'No ideas match your filters'}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {ideas?.length === 0 
              ? 'Start your innovation journey by creating your first idea.'
              : 'Try adjusting your search terms or filters.'}
          </p>
          {ideas?.length === 0 && (
            <Button 
              onClick={() => setShowCreateModal(true)}
              className="mt-4 gradient-button text-white"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Idea
            </Button>
          )}
        </div>
      )}

      <IdeaCreationModal 
        isOpen={showCreateModal} 
        onClose={() => setShowCreateModal(false)} 
      />

      <IdeaDetailsModal
        idea={selectedIdea}
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        isOwner={true}
      />
    </div>
  );
};

export default MyIdeas;
