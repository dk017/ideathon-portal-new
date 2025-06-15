import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useHackathons } from "@/hooks/useHackathons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { dataService } from "@/services/dataService";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { X, Plus, Loader2 } from "lucide-react";

interface IdeaCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type RequirementForm = { skill: string; description: string };
type IdeaFormData = {
  title: string;
  description: string;
  hackathonId: string;
  techStack: string[];
  isLongRunning: boolean;
  requirements: RequirementForm[];
};

const IdeaCreationModal: React.FC<IdeaCreationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { user } = useAuth();
  const { data: hackathons } = useHackathons();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<IdeaFormData>({
    title: "",
    description: "",
    hackathonId: "",
    techStack: [],
    isLongRunning: false,
    requirements: [],
  });

  const [newTech, setNewTech] = useState("");
  const [newRequirement, setNewRequirement] = useState({
    skill: "",
    description: "",
  });

  const createIdeaMutation = useMutation({
    mutationFn: async (ideaData: IdeaFormData) => {
      if (!user) throw new Error("User not authenticated");

      return dataService.createIdea({
        ...ideaData,
        owner: user,
        participants: [],
        currentStage: 1,
        requirements: ideaData.requirements.map((req, index) => ({
          id: `req-${Date.now()}-${index}`,
          skill: req.skill,
          description: req.description,
          isOpen: true,
          responses: [],
        })),
        tasks: [],
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ideas"] });
      queryClient.invalidateQueries({ queryKey: ["hackathons"] });
      toast({
        title: "Success",
        description: "Your idea has been created successfully!",
      });
      onClose();
      resetForm();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create idea. Please try again.",
        variant: "destructive",
      });
      console.error("Failed to create idea:", error);
    },
  });

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      hackathonId: "",
      techStack: [],
      isLongRunning: false,
      requirements: [],
    });
    setNewTech("");
    setNewRequirement({ skill: "", description: "" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createIdeaMutation.mutate(formData);
  };

  const addTechStack = () => {
    if (newTech.trim() && !formData.techStack.includes(newTech.trim())) {
      setFormData((prev) => ({
        ...prev,
        techStack: [...prev.techStack, newTech.trim()],
      }));
      setNewTech("");
    }
  };

  const removeTechStack = (tech: string) => {
    setFormData((prev) => ({
      ...prev,
      techStack: prev.techStack.filter((t) => t !== tech),
    }));
  };

  const addRequirement = () => {
    if (newRequirement.skill.trim() && newRequirement.description.trim()) {
      setFormData((prev) => ({
        ...prev,
        requirements: [...prev.requirements, { ...newRequirement }],
      }));
      setNewRequirement({ skill: "", description: "" });
    }
  };

  const removeRequirement = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index),
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Idea</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Idea Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="Enter your idea title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hackathon">Hackathon Event *</Label>
              <Select
                value={formData.hackathonId}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, hackathonId: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select hackathon" />
                </SelectTrigger>
                <SelectContent>
                  {hackathons?.map((hackathon) => (
                    <SelectItem key={hackathon.id} value={hackathon.id}>
                      {hackathon.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Describe your idea in detail..."
              rows={4}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Technology Stack</Label>
            <div className="flex space-x-2">
              <Input
                value={newTech}
                onChange={(e) => setNewTech(e.target.value)}
                placeholder="Add technology (e.g., React, Python)"
                onKeyPress={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addTechStack())
                }
              />
              <Button type="button" onClick={addTechStack} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {formData.techStack.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.techStack.map((tech, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="flex items-center space-x-1"
                  >
                    <span>{tech}</span>
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => removeTechStack(tech)}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <Label>Team Requirements (Optional)</Label>
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <Input
                  value={newRequirement.skill}
                  onChange={(e) =>
                    setNewRequirement((prev) => ({
                      ...prev,
                      skill: e.target.value,
                    }))
                  }
                  placeholder="Required skill (e.g., Frontend Developer)"
                />
                <Input
                  value={newRequirement.description}
                  onChange={(e) =>
                    setNewRequirement((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Skill description"
                />
              </div>
              <Button
                type="button"
                onClick={addRequirement}
                size="sm"
                variant="outline"
              >
                Add Requirement
              </Button>
            </div>

            {formData.requirements.length > 0 && (
              <div className="space-y-2">
                {formData.requirements.map((req, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded"
                  >
                    <div>
                      <span className="font-medium">{req.skill}</span>
                      <p className="text-sm text-gray-600">{req.description}</p>
                    </div>
                    <Button
                      type="button"
                      onClick={() => removeRequirement(index)}
                      size="sm"
                      variant="ghost"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="longRunning"
              checked={formData.isLongRunning}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({ ...prev, isLongRunning: checked }))
              }
            />
            <Label htmlFor="longRunning">
              Long-running project (extends beyond hackathon)
            </Label>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                !formData.title ||
                !formData.description ||
                !formData.hackathonId ||
                createIdeaMutation.isPending
              }
            >
              {createIdeaMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Create Idea
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default IdeaCreationModal;
