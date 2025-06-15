
import React, { useState } from 'react';
import { useIdeas } from '@/hooks/useIdeas';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Lightbulb, Users, Search, Filter, Plus, ArrowRight } from 'lucide-react';
import LoadingCard from '@/components/common/LoadingCard';
import ErrorMessage from '@/components/common/ErrorMessage';
import IdeaCreationModal from '@/components/ideas/IdeaCreationModal';

const AllIdeas = () => {
  const { data: ideas, isLoading, error } = useIdeas();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStage, setFilterStage] = useState('all');
  const [filterTech, setFilterTech] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">All Ideas</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <LoadingCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return <ErrorMessage message="Failed to load ideas" />;
  }

  const filteredIdeas = ideas?.filter(idea => {
    const matchesSearch = idea.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         idea.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStage = filterStage === 'all' || idea.currentStage.toString() === filterStage;
    const matchesTech = filterTech === 'all' || idea.techStack.some(tech => 
      tech.toLowerCase().includes(filterTech.toLowerCase())
    );
    
    return matchesSearch && matchesStage && matchesTech;
  });

  const getStageColor = (stage: number) => {
    const colors = [
      'bg-gray-100 text-gray-800',
      'bg-blue-100 text-blue-800',
      'bg-yellow-100 text-yellow-800',
      'bg-green-100 text-green-800',
      'bg-purple-100 text-purple-800'
    ];
    return colors[stage - 1] || colors[0];
  };

  const handleJoinIdea = (ideaId: string) => {
    console.log('Joining idea:', ideaId);
    // TODO: Implement join functionality
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">All Ideas</h1>
        <Button 
          onClick={() => setShowCreateModal(true)}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          Create New Idea
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 p-4 bg-white rounded-lg border">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search ideas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Select value={filterStage} onValueChange={setFilterStage}>
          <SelectTrigger className="w-40">
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
        <Select value={filterTech} onValueChange={setFilterTech}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Technology" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tech</SelectItem>
            <SelectItem value="React">React</SelectItem>
            <SelectItem value="Python">Python</SelectItem>
            <SelectItem value="Node.js">Node.js</SelectItem>
            <SelectItem value="TensorFlow">TensorFlow</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredIdeas?.map((idea) => (
          <Card key={idea.id} className="hover:shadow-lg transition-all duration-200 group">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-2">
                  <Lightbulb className="h-5 w-5 text-yellow-500" />
                  <span className="text-sm text-gray-500">{idea.referenceNumber}</span>
                </div>
                {idea.isLongRunning && (
                  <Badge variant="outline" className="border-orange-200 text-orange-700">
                    Long Running
                  </Badge>
                )}
              </div>
              <CardTitle className="text-lg font-semibold line-clamp-2 group-hover:text-blue-600 transition-colors">
                {idea.title}
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <p className="text-gray-600 text-sm line-clamp-3">
                {idea.description}
              </p>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge className={getStageColor(idea.currentStage)}>
                    Stage {idea.currentStage}
                  </Badge>
                  <div className="flex items-center text-sm text-gray-500">
                    <Users className="mr-1 h-4 w-4" />
                    {idea.participants.length}
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-1">
                  {idea.techStack.slice(0, 3).map((tech, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tech}
                    </Badge>
                  ))}
                  {idea.techStack.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{idea.techStack.length - 3}
                    </Badge>
                  )}
                </div>
                
                <div className="text-sm text-gray-500">
                  <span>Owner: {idea.owner.name}</span>
                </div>
              </div>
              
              <div className="pt-2 space-y-2">
                {idea.requirements.some(req => req.isOpen) && (
                  <div className="flex items-center text-sm text-amber-600 bg-amber-50 p-2 rounded">
                    <div className="w-2 h-2 bg-amber-500 rounded-full mr-2 animate-pulse"></div>
                    Open requirements available
                  </div>
                )}
                
                <div className="flex space-x-2">
                  <Button 
                    className="flex-1" 
                    variant={idea.owner.id === user?.id ? "outline" : "default"}
                    onClick={() => handleJoinIdea(idea.id)}
                    disabled={idea.owner.id === user?.id}
                  >
                    {idea.owner.id === user?.id ? 'Your Idea' : 'Join Idea'}
                  </Button>
                  <Button size="sm" variant="ghost">
                    <ArrowRight className="h-4 w-4" />
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
          <h3 className="mt-2 text-sm font-semibold text-gray-900">No ideas found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || filterStage !== 'all' || filterTech !== 'all' 
              ? 'Try adjusting your filters or search terms.'
              : 'Get started by creating your first idea.'}
          </p>
        </div>
      )}

      <IdeaCreationModal 
        isOpen={showCreateModal} 
        onClose={() => setShowCreateModal(false)} 
      />
    </div>
  );
};

export default AllIdeas;
