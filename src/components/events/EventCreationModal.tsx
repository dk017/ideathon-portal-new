import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { dataService } from "@/services/dataService";
import { useToast } from "@/hooks/use-toast";

interface EventCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EVENT_CATEGORIES = [
  { value: "hackathon", label: "Hackathon" },
  { value: "workshop", label: "Workshop" },
  { value: "seminar", label: "Seminar" },
  { value: "other", label: "Other" },
];

const EventCreationModal: React.FC<EventCreationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "hackathon",
    startDate: "",
    endDate: "",
    stages: [{ id: "", name: "", description: "", order: 1 }],
    status: "upcoming",
  });

  const handleStageChange = (index: number, value: string) => {
    setFormData((prev) => {
      const stages = [...prev.stages];
      stages[index] = { ...stages[index], name: value };
      return { ...prev, stages };
    });
  };

  const addStage = () => {
    if (formData.stages.length < 5) {
      setFormData((prev) => ({
        ...prev,
        stages: [
          ...prev.stages,
          {
            id: `stage-${Date.now()}`,
            name: "",
            description: "",
            order: prev.stages.length + 1,
          },
        ],
      }));
    }
  };

  const removeStage = (index: number) => {
    if (formData.stages.length > 3) {
      setFormData((prev) => ({
        ...prev,
        stages: prev.stages.filter((_, i) => i !== index),
      }));
    }
  };

  const createEventMutation = useMutation({
    mutationFn: async (eventData: typeof formData) => {
      return dataService.createEvent({
        ...eventData,
        stages: eventData.stages.map((stage, index) => ({
          ...stage,
          id: stage.id || `stage-${Date.now()}-${index}`,
          description: stage.description || stage.name,
        })),
        status: eventData.status as "upcoming" | "active" | "completed",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      toast({ title: "Success", description: "Event created successfully!" });
      onClose();
      setFormData({
        name: "",
        description: "",
        category: "hackathon",
        startDate: "",
        endDate: "",
        stages: [{ id: "", name: "", description: "", order: 1 }],
        status: "upcoming",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create event.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      formData.stages.length < 3 ||
      formData.stages.some((s) => !s.name.trim())
    ) {
      toast({
        title: "Error",
        description: "Please provide 3-5 valid stages.",
        variant: "destructive",
      });
      return;
    }
    createEventMutation.mutate(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Create New Event</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Event Name *
            </label>
            <Input
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Category *</label>
            <Select
              value={formData.category}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, category: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {EVENT_CATEGORIES.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Start Date *
            </label>
            <Input
              type="date"
              value={formData.startDate}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, startDate: e.target.value }))
              }
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">End Date *</label>
            <Input
              type="date"
              value={formData.endDate}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, endDate: e.target.value }))
              }
              required
            />
          </div>
          <div>
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
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Stages (3-5)
            </label>
            {formData.stages.map((stage, idx) => (
              <div key={idx} className="flex items-center gap-2 mb-2">
                <Input
                  value={stage.name}
                  onChange={(e) => handleStageChange(idx, e.target.value)}
                  required
                  placeholder={`Stage ${idx + 1}`}
                />
                {formData.stages.length > 3 && (
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => removeStage(idx)}
                  >
                    -
                  </Button>
                )}
                {idx === formData.stages.length - 1 &&
                  formData.stages.length < 5 && (
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={addStage}
                    >
                      +
                    </Button>
                  )}
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={createEventMutation.isPending}>
              {createEventMutation.isPending ? "Creating..." : "Create Event"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EventCreationModal;
