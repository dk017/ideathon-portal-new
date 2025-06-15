import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useEvent } from "@/hooks/useEvents";
import { useIdeas } from "@/hooks/useIdeas";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Lightbulb, Users, ArrowLeft } from "lucide-react";
import LoadingCard from "@/components/common/LoadingCard";
import ErrorMessage from "@/components/common/ErrorMessage";
import { useNavigate } from "react-router-dom";
import IdeaDetailsModal from "@/components/ideas/IdeaDetailsModal";
import { useAuth } from "@/contexts/AuthContext";
import EditIdeaModal from "@/components/ideas/EditIdeaModal";

const EventIdeas = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const {
    data: event,
    isLoading: isLoadingEvent,
    error: eventError,
  } = useEvent(eventId || "");
  const {
    data: ideas,
    isLoading: isLoadingIdeas,
    error: ideasError,
  } = useIdeas();
  const [selectedIdea, setSelectedIdea] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editIdea, setEditIdea] = useState(null);
  const { user } = useAuth();

  if (isLoadingEvent || isLoadingIdeas) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Events
          </Button>
          <h1 className="text-3xl font-bold text-foreground">Loading...</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <LoadingCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (eventError || ideasError) {
    return <ErrorMessage message="Failed to load event or ideas" />;
  }

  if (!event) {
    return <ErrorMessage message="Event not found" />;
  }

  const eventIdeas = ideas?.filter((idea) => idea.eventId === eventId) || [];

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

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Events
        </Button>
        <h1 className="text-3xl font-bold text-foreground">
          {event.name} - Ideas
        </h1>
      </div>

      {eventIdeas.length === 0 ? (
        <div className="text-center py-12">
          <Lightbulb className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900">
            No ideas yet
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Be the first to submit an idea for this event!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {eventIdeas.map((idea) => (
            <Card
              key={idea.id}
              className="idea-card group cursor-pointer"
              onClick={() => {
                setSelectedIdea(idea);
                setShowDetailsModal(true);
              }}
            >
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
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      <IdeaDetailsModal
        idea={selectedIdea}
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        isOwner={selectedIdea && user && selectedIdea.owner.id === user.id}
        user={user}
        onRequestJoin={() => {}}
        hasRequested={false}
        onAcceptRequest={() => {}}
        onRejectRequest={() => {}}
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
        }}
      />
    </div>
  );
};

export default EventIdeas;
