import React, { useState } from "react";
import { Task, TaskStatus } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, MoreVertical, Calendar, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { dataService } from "@/services/dataService";

interface KanbanBoardProps {
  tasks: Task[];
  ideaId: string;
  onTaskUpdate?: (taskId: string, newStatus: TaskStatus) => void;
}

const COLUMN_CONFIG: Record<TaskStatus, { title: string; color: string }> = {
  todo: { title: "To Do", color: "bg-gray-100" },
  in_progress: { title: "In Progress", color: "bg-blue-100" },
  review: { title: "Review", color: "bg-yellow-100" },
  done: { title: "Done", color: "bg-green-100" },
};

const KanbanBoard: React.FC<KanbanBoardProps> = ({
  tasks,
  ideaId,
  onTaskUpdate,
}) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);

  const updateTaskStatusMutation = useMutation({
    mutationFn: async ({
      taskId,
      newStatus,
    }: {
      taskId: string;
      newStatus: TaskStatus;
    }) => {
      return dataService.updateTaskStatus(taskId, newStatus);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["idea", ideaId] });
      toast({
        title: "Success",
        description: "Task status updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update task status",
        variant: "destructive",
      });
      console.error("Failed to update task status:", error);
    },
  });

  const handleDragStart = (task: Task) => {
    setDraggedTask(task);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (status: TaskStatus) => {
    if (draggedTask && draggedTask.status !== status) {
      updateTaskStatusMutation.mutate({
        taskId: draggedTask.id,
        newStatus: status,
      });
      onTaskUpdate?.(draggedTask.id, status);
    }
    setDraggedTask(null);
  };

  const getTasksByStatus = (status: TaskStatus) => {
    return tasks.filter((task) => task.status === status);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-full">
      {Object.entries(COLUMN_CONFIG).map(([status, config]) => (
        <div
          key={status}
          className={`rounded-lg p-4 ${config.color} min-h-[200px]`}
          onDragOver={handleDragOver}
          onDrop={() => handleDrop(status as TaskStatus)}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-700">{config.title}</h3>
            <span className="text-sm text-gray-500">
              {getTasksByStatus(status as TaskStatus).length}
            </span>
          </div>

          <div className="space-y-3">
            {getTasksByStatus(status as TaskStatus).map((task) => (
              <Card
                key={task.id}
                className="cursor-move hover:shadow-md transition-shadow"
                draggable
                onDragStart={() => handleDragStart(task)}
              >
                <CardHeader className="p-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-sm font-medium line-clamp-1">
                      {task.title}
                    </CardTitle>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Edit Task</DropdownMenuItem>
                        <DropdownMenuItem>Delete Task</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="p-3 pt-0">
                  <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                    {task.description}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    {task.assignee && (
                      <div className="flex items-center">
                        <User className="h-3 w-3 mr-1" />
                        {task.assignee.name}
                      </div>
                    )}
                    {task.dueDate && (
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(task.dueDate).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default KanbanBoard;
