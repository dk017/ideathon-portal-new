import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Loader2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { dataService } from "@/services/dataService";
import { useToast } from "@/hooks/use-toast";
import { Idea } from "@/types";

interface EditIdeaModalProps {
  isOpen: boolean;
  onClose: () => void;
  idea: Idea | null;
  onSuccess: () => void;
}

const EditIdeaModal: React.FC<EditIdeaModalProps> = ({
  isOpen,
  onClose,
  idea,
  onSuccess,
}) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    techStack: [] as string[],
    requirements: [] as { skill: string; description: string }[],
  });
  const [newTech, setNewTech] = useState("");
  const [newRequirement, setNewRequirement] = useState({
    skill: "",
    description: "",
  });

  useEffect(() => {
    if (idea) {
      setFormData({
        title: idea.title,
        description: idea.description,
        techStack: idea.techStack,
        requirements: idea.requirements.map((r) => ({
          skill: r.skill,
          description: r.description,
        })),
      });
    }
  }, [idea]);

  const editIdeaMutation = useMutation({
    mutationFn: async (updated: typeof formData) => {
      if (!idea) throw new Error("No idea selected");
      return dataService.updateIdea({
        ...idea,
        title: updated.title,
        description: updated.description,
        techStack: updated.techStack,
        requirements: updated.requirements.map((req, idx) => ({
          ...idea.requirements[idx],
          skill: req.skill,
          description: req.description,
        })),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ideas"] });
      toast({ title: "Success", description: "Idea updated successfully!" });
      onClose();
      onSuccess();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update idea.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    editIdeaMutation.mutate(formData);
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

  if (!idea) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Idea</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium mb-1">Title *</label>
            <Input
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              required
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium mb-1">
              Description *
            </label>
            <Textarea
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              required
              rows={4}
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium mb-1">
              Technology Stack
            </label>
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
            <label className="block text-sm font-medium mb-1">
              Team Requirements
            </label>
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
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={editIdeaMutation.isPending}>
              {editIdeaMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditIdeaModal;
