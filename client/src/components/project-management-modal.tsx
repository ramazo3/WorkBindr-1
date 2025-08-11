import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { Project, Task } from "@shared/schema";

interface ProjectManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface KanbanColumn {
  id: string;
  title: string;
  tasks: Task[];
}

export default function ProjectManagementModal({ isOpen, onClose }: ProjectManagementModalProps) {
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: projects = [] } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
    enabled: isOpen,
  });

  const { data: tasks = [] } = useQuery<Task[]>({
    queryKey: ["/api/projects", selectedProject, "tasks"],
    enabled: isOpen && !!selectedProject,
  });

  const updateTaskMutation = useMutation({
    mutationFn: async ({ taskId, updates }: { taskId: string; updates: Partial<Task> }) => {
      const response = await apiRequest("PATCH", `/api/tasks/${taskId}`, updates);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects", selectedProject, "tasks"] });
    },
  });

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData("taskId", taskId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, newStatus: string) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("taskId");
    const task = tasks.find(t => t.id === taskId);
    
    if (task && task.status !== newStatus) {
      updateTaskMutation.mutate({
        taskId,
        updates: { status: newStatus }
      });
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "bg-red-100 text-red-700";
      case "Medium": return "bg-yellow-100 text-yellow-700";
      case "Low": return "bg-green-100 text-green-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "To Do": return "bg-slate-100";
      case "In Progress": return "bg-blue-100";
      case "Done": return "bg-green-100";
      default: return "bg-gray-100";
    }
  };

  const columns: KanbanColumn[] = [
    { id: "To Do", title: "To Do", tasks: tasks.filter(t => t.status === "To Do") },
    { id: "In Progress", title: "In Progress", tasks: tasks.filter(t => t.status === "In Progress") },
    { id: "Done", title: "Done", tasks: tasks.filter(t => t.status === "Done") },
  ];

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[1200px] h-[80vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-0">
          <div>
            <DialogTitle className="text-xl font-semibold">Project Management</DialogTitle>
            <p className="text-slate-600">Manage your projects and tasks with Kanban boards</p>
          </div>
        </DialogHeader>
        
        <div className="flex-1 p-6 pt-4">
          {!selectedProject ? (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Select a Project</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className="bg-slate-50 rounded-lg p-6 border border-slate-200 hover:border-blue-600 transition-colors cursor-pointer"
                    onClick={() => setSelectedProject(project.id)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-slate-900">{project.name}</h4>
                      <Badge variant="outline" className={getPriorityColor(project.priority)}>
                        {project.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-600 mb-4">{project.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-slate-500">
                        Status: <span className="font-medium">{project.status}</span>
                      </div>
                      <div className="text-sm text-slate-500">
                        Progress: <span className="font-medium">{project.progress}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-full">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-medium">
                    {projects.find(p => p.id === selectedProject)?.name}
                  </h3>
                  <p className="text-sm text-slate-600">
                    {projects.find(p => p.id === selectedProject)?.description}
                  </p>
                </div>
                <Button variant="ghost" onClick={() => setSelectedProject(null)}>
                  <i className="fas fa-arrow-left mr-2"></i>Back to Projects
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
                {columns.map((column) => (
                  <div
                    key={column.id}
                    className={`rounded-lg p-4 h-full ${getStatusColor(column.id)}`}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, column.id)}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-slate-900">{column.title}</h4>
                      <Badge variant="secondary" className="text-xs">
                        {column.tasks.length}
                      </Badge>
                    </div>
                    
                    <div className="space-y-3">
                      {column.tasks.map((task) => (
                        <div
                          key={task.id}
                          className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm cursor-move hover:shadow-md transition-shadow"
                          draggable
                          onDragStart={(e) => handleDragStart(e, task.id)}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <h5 className="font-medium text-slate-900 text-sm">{task.title}</h5>
                            <Badge variant="outline" className={`text-xs ${getPriorityColor(task.priority)}`}>
                              {task.priority}
                            </Badge>
                          </div>
                          
                          {task.description && (
                            <p className="text-xs text-slate-600 mb-3">{task.description}</p>
                          )}
                          
                          <div className="flex items-center justify-between text-xs text-slate-500">
                            <div>{task.assignee}</div>
                            {task.dueDate && (
                              <div>Due: {formatDate(task.dueDate)}</div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}