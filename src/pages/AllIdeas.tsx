import React, { useState } from "react";
import { useIdeas } from "@/hooks/useIdeas";
import { useAuth } from "@/contexts/AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { dataService } from "@/services/dataService";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Lightbulb,
  Users,
  Search,
  Plus,
  ArrowRight,
  Loader2,
} from "lucide-react";
import LoadingCard from "@/components/common/LoadingCard";
import ErrorMessage from "@/components/common/ErrorMessage";
import IdeaCreationModal from "@/components/ideas/IdeaCreationModal";
import IdeaDetailsModal from "@/components/ideas/IdeaDetailsModal";
import EditIdeaModal from "@/components/ideas/EditIdeaModal";
import { Idea, JoinRequest, User } from "@/types";

const AllIdeas = () => {
  const { data: ideas, isLoading, error } = useIdeas();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStage, setFilterStage] = useState("all");
  const [filterTech, setFilterTech] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editIdea, setEditIdea] = useState<Idea | null>(null);

  const joinIdeaMutation = useMutation({
    mutationFn: async (ideaId: string) => {
      if (!user) throw new Error("User not authenticated");
      return dataService.joinIdea(ideaId, user.id);
    },
    onSuccess: (success, ideaId) => {
      if (success) {
        queryClient.invalidateQueries({ queryKey: ["ideas"] });
        toast({
          title: "Success",
          description: "You have successfully joined the idea!",
        });
      } else {
        toast({
          title: "Unable to join",
          description: "You may already be a participant or the idea is full.",
          variant: "destructive",
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to join idea. Please try again.",
        variant: "destructive",
      });
      console.error("Failed to join idea:", error);
    },
  });

  const requestJoinMutation = useMutation({
    mutationFn: async (ideaId: string) => {
      if (!user) throw new Error("User not authenticated");
      return dataService.requestJoinIdea(ideaId, user.id);
    },
    onSuccess: (result, ideaId) => {
      queryClient.invalidateQueries({ queryKey: ["ideas"] });
      if (result === "requested") {
        toast({
          title: "Request Sent",
          description: "Your join request has been sent.",
        });
      } else if (result === "already-requested") {
        toast({
          title: "Already Requested",
          description: "You have already requested to join this idea.",
        });
      } else if (result === "already-participant") {
        toast({
          title: "Already Joined",
          description: "You are already a participant of this idea.",
        });
      }
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send join request.",
        variant: "destructive",
      });
    },
  });

  const acceptJoinMutation = useMutation({
    mutationFn: async ({
      ideaId,
      userId,
    }: {
      ideaId: string;
      userId: string;
    }) => {
      return dataService.acceptJoinRequest(ideaId, userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ideas"] });
      toast({
        title: "Request Accepted",
        description: "User has been added as a participant.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to accept join request.",
        variant: "destructive",
      });
    },
  });

  const rejectJoinMutation = useMutation({
    mutationFn: async ({
      ideaId,
      userId,
    }: {
      ideaId: string;
      userId: string;
    }) => {
      return dataService.rejectJoinRequest(ideaId, userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ideas"] });
      toast({
        title: "Request Rejected",
        description: "Join request has been rejected.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to reject join request.",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-foreground">All Ideas</h1>
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

  const filteredIdeas = ideas?.filter((idea) => {
    const matchesSearch =
      idea.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      idea.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStage =
      filterStage === "all" || idea.currentStage.toString() === filterStage;
    const matchesTech =
      filterTech === "all" ||
      idea.techStack.some((tech) =>
        tech.toLowerCase().includes(filterTech.toLowerCase())
      );

    return matchesSearch && matchesStage && matchesTech;
  });

  const getStageColor = (stage: number) => {
    const colors = [
      "status-open",
      "status-planning",
      "status-development",
      "status-testing",
      "status-complete",
    ];
    return colors[stage - 1] || colors[0];
  };

  const getStageText = (stage: number) => {
    const stages = [
      "Ideation",
      "Planning",
      "Development",
      "Testing",
      "Presentation",
    ];
    return stages[stage - 1] || "Unknown";
  };

  const handleJoinIdea = (ideaId: string) => {
    joinIdeaMutation.mutate(ideaId);
  };

  const isUserParticipant = (idea: Idea) => {
    return (
      idea.participants.some((p: User) => p.id === user?.id) ||
      idea.owner.id === user?.id
    );
  };

  const handleViewDetails = (idea: Idea) => {
    setSelectedIdea(idea);
    setShowDetailsModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">All Ideas</h1>
        <Button
          onClick={() => setShowCreateModal(true)}
          className="gradient-button text-white hover:shadow-lg"
        >
          <Plus className="mr-2 h-4 w-4" />
          Create New Idea
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 p-4 gradient-card rounded-lg">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search ideas..."
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
        <Select value={filterTech} onValueChange={setFilterTech}>
          <SelectTrigger className="w-40 bg-white/50 border-indigo-200 focus:border-indigo-400">
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
          <Card key={idea.id} className="idea-card group">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-2">
                  <Lightbulb className="h-5 w-5 text-indigo-500" />
                  <span className="text-sm text-muted-foreground">
                    {idea.referenceNumber}
                  </span>
                </div>
                {idea.isLongRunning && (
                  <Badge
                    variant="outline"
                    className="border-purple-200 text-purple-700 bg-purple-50"
                  >
                    Long Running
                  </Badge>
                )}
              </div>
              <CardTitle className="text-lg font-semibold line-clamp-2 group-hover:text-indigo-600 transition-colors text-foreground">
                {idea.title}
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <p className="text-muted-foreground text-sm line-clamp-3">
                {idea.description}
              </p>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge
                    className={`${getStageColor(
                      idea.currentStage
                    )} text-white border-0`}
                  >
                    {getStageText(idea.currentStage)}
                  </Badge>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="mr-1 h-4 w-4" />
                    {idea.participants.length}
                  </div>
                </div>

                <div className="flex flex-wrap gap-1">
                  {idea.techStack.slice(0, 3).map((tech, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="text-xs bg-indigo-50 text-indigo-700"
                    >
                      {tech}
                    </Badge>
                  ))}
                  {idea.techStack.length > 3 && (
                    <Badge
                      variant="secondary"
                      className="text-xs bg-indigo-50 text-indigo-700"
                    >
                      +{idea.techStack.length - 3}
                    </Badge>
                  )}
                </div>

                <div className="text-sm text-muted-foreground">
                  <span>Owner: {idea.owner.name}</span>
                </div>
              </div>

              <div className="pt-2">
                <Button
                  className="w-full"
                  variant="secondary"
                  onClick={() => handleViewDetails(idea)}
                >
                  View Idea
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredIdeas?.length === 0 && (
        <div className="text-center py-12">
          <Lightbulb className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900">
            No ideas found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || filterStage !== "all" || filterTech !== "all"
              ? "Try adjusting your filters or search terms."
              : "Get started by creating your first idea."}
          </p>
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
        isOwner={selectedIdea && user && selectedIdea.owner.id === user.id}
        user={user}
        onRequestJoin={(ideaId) => requestJoinMutation.mutate(ideaId)}
        hasRequested={
          selectedIdea &&
          user &&
          selectedIdea.joinRequests?.some((req: User) => req.id === user.id)
        }
        onAcceptRequest={(request) => acceptJoinMutation.mutate(request)}
        onRejectRequest={(request) => rejectJoinMutation.mutate(request)}
        onEdit={() => {
          setShowDetailsModal(false);
          setEditIdea(selectedIdea);
          setShowEditModal(true);
        }}
      />

      <EditIdeaModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        idea={editIdea}
        onSuccess={() => {
          setShowEditModal(false);
          setEditIdea(null);
          queryClient.invalidateQueries({ queryKey: ["ideas"] });
        }}
      />
    </div>
  );
};

export default AllIdeas;
