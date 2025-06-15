import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Lightbulb, Users, Code, User } from "lucide-react";
import { User as UserType, Idea, Requirement } from "@/types";

interface IdeaDetailsModalProps {
  idea: Idea;
  isOpen: boolean;
  onClose: () => void;
  isOwner: boolean;
  user: UserType;
  onRequestJoin: (ideaId: string) => void;
  hasRequested: boolean;
  onAcceptRequest: (request: { ideaId: string; userId: string }) => void;
  onRejectRequest: (request: { ideaId: string; userId: string }) => void;
  onEdit?: () => void;
}

const IdeaDetailsModal = ({
  idea,
  isOpen,
  onClose,
  isOwner,
  user,
  onRequestJoin,
  hasRequested,
  onAcceptRequest,
  onRejectRequest,
  onEdit,
}: IdeaDetailsModalProps) => {
  if (!idea) return null;

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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Lightbulb className="h-6 w-6 text-indigo-600" />
              <DialogTitle className="text-2xl text-foreground">
                {idea.title}
              </DialogTitle>
            </div>
            <div className="flex items-center space-x-2">
              <Badge
                className={`${getStageColor(
                  idea.currentStage
                )} text-white border-0`}
              >
                {getStageText(idea.currentStage)}
              </Badge>
              {idea.isLongRunning && (
                <Badge
                  variant="outline"
                  className="border-purple-200 text-purple-700 bg-purple-50"
                >
                  Long Running
                </Badge>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Info */}
          <div>
            <div className="flex items-center text-sm text-muted-foreground mb-2">
              <span>Reference: {idea.referenceNumber}</span>
              <span className="mx-2">•</span>
              <span>
                Created: {new Date(idea.createdAt).toLocaleDateString()}
              </span>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              {idea.description}
            </p>
          </div>

          <Separator />

          {/* Owner & Participants */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-foreground mb-3 flex items-center">
                <User className="mr-2 h-4 w-4" />
                Owner
              </h3>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                  <span className="text-indigo-600 font-medium text-sm">
                    {idea.owner.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-foreground">
                    {idea.owner.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {idea.owner.email}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-3 flex items-center">
                <Users className="mr-2 h-4 w-4" />
                Participants ({idea.participants.length})
              </h3>
              <div className="space-y-2">
                {idea.participants.map((participant: UserType) => (
                  <div
                    key={participant.id}
                    className="flex items-center space-x-3"
                  >
                    <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                      <span className="text-gray-600 font-medium text-xs">
                        {participant.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="text-sm text-foreground">
                      {participant.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {isOwner && idea.joinRequests && idea.joinRequests.length > 0 && (
            <div>
              <Separator />
              <h3 className="font-semibold text-foreground mb-3 flex items-center">
                Pending Join Requests
              </h3>
              <div className="space-y-2">
                {idea.joinRequests.map((reqUser: UserType) => (
                  <div
                    key={reqUser.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center">
                        <span className="text-indigo-600 font-medium text-xs">
                          {reqUser.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="text-sm text-foreground">
                        {reqUser.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {reqUser.email}
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        className="bg-green-600 text-white"
                        onClick={() =>
                          onAcceptRequest({
                            ideaId: idea.id,
                            userId: reqUser.id,
                          })
                        }
                      >
                        Accept
                      </Button>
                      <Button
                        size="sm"
                        className="bg-red-600 text-white"
                        onClick={() =>
                          onRejectRequest({
                            ideaId: idea.id,
                            userId: reqUser.id,
                          })
                        }
                      >
                        Reject
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Separator />

          {/* Tech Stack */}
          <div>
            <h3 className="font-semibold text-foreground mb-3 flex items-center">
              <Code className="mr-2 h-4 w-4" />
              Technology Stack
            </h3>
            <div className="flex flex-wrap gap-2">
              {idea.techStack.map((tech: string, index: number) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="bg-indigo-50 text-indigo-700"
                >
                  {tech}
                </Badge>
              ))}
            </div>
          </div>

          {/* Requirements */}
          {idea.requirements.length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="font-semibold text-foreground mb-3">
                  Requirements
                </h3>
                <div className="space-y-2">
                  {idea.requirements.map((req: Requirement, index: number) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-foreground">
                          {req.skill}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {req.description}
                        </p>
                      </div>
                      <Badge variant={req.isOpen ? "default" : "secondary"}>
                        {req.isOpen ? "Open" : "Filled"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            {isOwner ? (
              <Button
                className="gradient-button text-white flex-1"
                onClick={onEdit}
              >
                Edit Idea
              </Button>
            ) : hasRequested ? (
              <Button className="gradient-button text-white flex-1" disabled>
                Requested
              </Button>
            ) : (
              <Button
                className="gradient-button text-white flex-1"
                onClick={() => onRequestJoin(idea.id)}
              >
                Request to Join
              </Button>
            )}
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default IdeaDetailsModal;
