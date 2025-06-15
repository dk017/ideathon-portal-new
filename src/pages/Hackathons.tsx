import React, { useState } from "react";
import { useHackathons, useHackathon } from "@/hooks/useHackathons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { dataService } from "@/services/dataService";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Users, Clock, Trophy, Loader2, X } from "lucide-react";
import LoadingCard from "@/components/common/LoadingCard";
import ErrorMessage from "@/components/common/ErrorMessage";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import KanbanBoard from "@/components/ideas/KanbanBoard";
import {
  Dialog as IdeaDialog,
  DialogContent as IdeaDialogContent,
  DialogHeader as IdeaDialogHeader,
  DialogTitle as IdeaDialogTitle,
} from "@/components/ui/dialog";
import { Idea } from "@/types";

const Hackathons = () => {
  const [selectedHackathonId, setSelectedHackathonId] = useState<string | null>(
    null
  );
  const { data: hackathons, isLoading, error } = useHackathons();
  const { data: selectedHackathon, isLoading: isLoadingSelected } =
    useHackathon(selectedHackathonId || "");
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);

  const joinHackathonMutation = useMutation({
    mutationFn: async (hackathonId: string) => {
      if (!user) throw new Error("User not authenticated");
      return dataService.joinHackathon(hackathonId, user.id);
    },
    onSuccess: (success) => {
      if (success) {
        queryClient.invalidateQueries({ queryKey: ["hackathons"] });
        toast({
          title: "Success",
          description: "You have successfully joined the hackathon!",
        });
      } else {
        toast({
          title: "Unable to join",
          description:
            "The hackathon may be full or you may already be registered.",
          variant: "destructive",
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to join hackathon. Please try again.",
        variant: "destructive",
      });
      console.error("Failed to join hackathon:", error);
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-foreground ">Hackathons</h1>
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
      case "active":
        return "bg-green-100 text-green-800";
      case "upcoming":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getDaysUntil = (date: string) => {
    const now = new Date();
    const targetDate = new Date(date);
    const diffTime = targetDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleJoinHackathon = (hackathonId: string) => {
    joinHackathonMutation.mutate(hackathonId);
  };

  const handleCardClick = (hackathonId: string) => {
    setSelectedHackathonId(hackathonId);
  };

  // Helper: generate mock ideas and tasks
  const getDemoIdeas = (hackathonId: string) => [
    {
      id: `idea-1-${hackathonId}`,
      referenceNumber: "AI-001",
      title: "Smart AI Chatbot",
      description:
        "A chatbot that uses AI to answer questions and automate tasks.",
      techStack: ["React", "Node.js", "OpenAI"],
      owner: user || {
        id: "u1",
        name: "Demo User",
        email: "demo@example.com",
        role: "user",
        skills: [],
      },
      hackathonId,
      currentStage: 1,
      isLongRunning: false,
      participants: [],
      requirements: [],
      tasks: [
        {
          id: "t1",
          title: "Design UI",
          description: "Create wireframes",
          status: "todo",
          createdAt: "",
          updatedAt: "",
        },
        {
          id: "t2",
          title: "Setup Backend",
          description: "Node.js API",
          status: "in_progress",
          createdAt: "",
          updatedAt: "",
        },
        {
          id: "t3",
          title: "Integrate AI",
          description: "Connect to OpenAI",
          status: "review",
          createdAt: "",
          updatedAt: "",
        },
        {
          id: "t4",
          title: "Deploy",
          description: "Deploy to Vercel",
          status: "done",
          createdAt: "",
          updatedAt: "",
        },
      ],
      createdAt: new Date().toISOString(),
      joinRequests: [],
    },
    {
      id: `idea-2-${hackathonId}`,
      referenceNumber: "AI-002",
      title: "AI Image Generator",
      description: "Generate images from text prompts using AI.",
      techStack: ["Python", "FastAPI", "Stable Diffusion"],
      owner: user || {
        id: "u2",
        name: "Demo User2",
        email: "demo2@example.com",
        role: "user",
        skills: [],
      },
      hackathonId,
      currentStage: 2,
      isLongRunning: true,
      participants: [],
      requirements: [],
      tasks: [
        {
          id: "t1",
          title: "Collect Dataset",
          description: "Find image datasets",
          status: "todo",
          createdAt: "",
          updatedAt: "",
        },
        {
          id: "t2",
          title: "Train Model",
          description: "Train Stable Diffusion",
          status: "in_progress",
          createdAt: "",
          updatedAt: "",
        },
        {
          id: "t3",
          title: "Build API",
          description: "FastAPI endpoint",
          status: "done",
          createdAt: "",
          updatedAt: "",
        },
      ],
      createdAt: new Date().toISOString(),
      joinRequests: [],
    },
  ];

  // Inject demo ideas if none exist
  const hackathonsWithIdeas = hackathons?.map((h) => ({
    ...h,
    ideas: h.ideas && h.ideas.length > 0 ? h.ideas : getDemoIdeas(h.id),
  }));

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
        {hackathonsWithIdeas?.map((hackathon) => {
          const daysUntilStart = getDaysUntil(hackathon.startDate);
          const daysUntilEnd = getDaysUntil(hackathon.endDate);

          return (
            <Card
              key={hackathon.id}
              className="hover:shadow-lg transition-shadow duration-200 cursor-pointer"
              onClick={() => handleCardClick(hackathon.id)}
            >
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
                    {new Date(hackathon.startDate).toLocaleDateString()} -{" "}
                    {new Date(hackathon.endDate).toLocaleDateString()}
                  </div>

                  <div className="flex items-center text-sm text-gray-500">
                    <Users className="mr-2 h-4 w-4" />
                    {hackathon.currentParticipants}/
                    {hackathon.maxParticipants || "Unlimited"} participants
                  </div>

                  {hackathon.status === "upcoming" && daysUntilStart > 0 && (
                    <div className="flex items-center text-sm text-blue-600">
                      <Clock className="mr-2 h-4 w-4" />
                      Starts in {daysUntilStart} days
                    </div>
                  )}

                  {hackathon.status === "active" && daysUntilEnd > 0 && (
                    <div className="flex items-center text-sm text-green-600">
                      <Clock className="mr-2 h-4 w-4" />
                      {daysUntilEnd} days remaining
                    </div>
                  )}
                </div>

                <div className="pt-2">
                  <Button
                    className="w-full"
                    variant={
                      hackathon.status === "active" ? "default" : "outline"
                    }
                    onClick={(e) => {
                      e.stopPropagation();
                      handleJoinHackathon(hackathon.id);
                    }}
                    disabled={
                      hackathon.status === "completed" ||
                      joinHackathonMutation.isPending
                    }
                  >
                    {joinHackathonMutation.isPending && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {hackathon.status === "active"
                      ? "Join Now"
                      : hackathon.status === "upcoming"
                      ? "Register Interest"
                      : "View Results"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Dialog
        open={!!selectedHackathonId}
        onOpenChange={() => setSelectedHackathonId(null)}
      >
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {selectedHackathon?.name}
            </DialogTitle>
            <DialogDescription>
              {selectedHackathon?.description}
            </DialogDescription>
          </DialogHeader>

          {isLoadingSelected ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center text-gray-600">
                  <Calendar className="mr-2 h-4 w-4" />
                  {selectedHackathon && (
                    <>
                      {new Date(
                        selectedHackathon.startDate
                      ).toLocaleDateString()}{" "}
                      -{" "}
                      {new Date(selectedHackathon.endDate).toLocaleDateString()}
                    </>
                  )}
                </div>
                <div className="flex items-center text-gray-600">
                  <Users className="mr-2 h-4 w-4" />
                  {selectedHackathon?.currentParticipants}/
                  {selectedHackathon?.maxParticipants || "Unlimited"}{" "}
                  participants
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Ideas</h3>
                {selectedHackathon?.ideas &&
                selectedHackathon.ideas.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedHackathon.ideas.map((idea) => (
                      <Card
                        key={idea.id}
                        className="hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => setSelectedIdea(idea)}
                      >
                        <CardHeader>
                          <CardTitle className="text-base">
                            {idea.title}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {idea.description}
                          </p>
                          <div className="mt-2 flex items-center text-sm text-gray-500">
                            <Users className="mr-2 h-4 w-4" />
                            {idea.participants.length} members
                          </div>
                          {idea.tasks && idea.tasks.length > 0 && (
                            <div className="mt-4">
                              <KanbanBoard
                                tasks={idea.tasks}
                                ideaId={idea.id}
                              />
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    No ideas submitted yet
                  </p>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Idea Details Modal */}
      <IdeaDialog
        open={!!selectedIdea}
        onOpenChange={() => setSelectedIdea(null)}
      >
        <IdeaDialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <IdeaDialogHeader>
            <IdeaDialogTitle className="text-xl font-bold">
              {selectedIdea?.title}
            </IdeaDialogTitle>
          </IdeaDialogHeader>
          {selectedIdea && (
            <>
              <p className="text-gray-700 mb-2">{selectedIdea.description}</p>
              <div className="mb-4 flex items-center text-sm text-gray-500">
                <Users className="mr-2 h-4 w-4" />
                {selectedIdea.participants.length} members
              </div>
              <div className="mb-4">
                <span className="font-semibold">Kanban Board</span>
                {selectedIdea.tasks && selectedIdea.tasks.length > 0 ? (
                  <KanbanBoard
                    tasks={selectedIdea.tasks}
                    ideaId={selectedIdea.id}
                  />
                ) : (
                  <div className="text-gray-400 text-center py-8 border rounded-lg mt-2">
                    No tasks yet. Add tasks to start tracking progress!
                  </div>
                )}
              </div>
            </>
          )}
        </IdeaDialogContent>
      </IdeaDialog>
    </div>
  );
};

export default Hackathons;
