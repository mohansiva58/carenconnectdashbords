import { useState } from "react";
import { X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { apiRequest } from "@/lib/api";
import { useAuth } from "@/lib/auth";

const SERVICES = [
  { value: "home_care", label: "Home Care" },
  { value: "security", label: "Security" },
  { value: "education", label: "Education" },
  { value: "healthcare", label: "Healthcare" },
  { value: "marketing", label: "Marketing" },
  { value: "transportation", label: "Transportation" },
  { value: "consulting", label: "Consulting" },
  { value: "technical", label: "Technical Support" },
];

type AddProjectModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

export function AddProjectModal({ isOpen, onClose, onSuccess }: AddProjectModalProps) {
  const { token } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    projectName: "",
    service: "",
    description: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.projectName.trim()) {
      toast.error("Project name is required");
      return;
    }
    
    if (!formData.service) {
      toast.error("Please select a service");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await apiRequest("/api/md/projects", {
        method: "POST",
        token,
        body: {
          projectName: formData.projectName,
          service: formData.service,
          description: formData.description,
        },
      });

      toast.success(`Project "${formData.projectName}" created successfully`);
      setFormData({ projectName: "", service: "", description: "" });
      onClose();
      onSuccess?.();
    } catch (error) {
      console.error("[v0] Project creation error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to create project");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center sm:justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full bg-white sm:max-w-lg sm:rounded-2xl shadow-xl animate-in slide-in-from-bottom-5 sm:slide-in-from-center">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
              <Plus className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Add New Project</h2>
              <p className="text-xs text-slate-500 mt-0.5">Create a project for customers to request</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-slate-100 transition-colors"
            disabled={isSubmitting}
          >
            <X className="h-5 w-5 text-slate-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5 px-6 py-5">
          {/* Project Name */}
          <div className="space-y-2">
            <Label htmlFor="projectName" className="text-sm font-semibold text-slate-900">
              Project Name
            </Label>
            <Input
              id="projectName"
              type="text"
              placeholder="e.g., Solar Installation, Home Security System"
              value={formData.projectName}
              onChange={(e) => setFormData(prev => ({ ...prev, projectName: e.target.value }))}
              disabled={isSubmitting}
              className="border-slate-200"
            />
          </div>

          {/* Service Dropdown */}
          <div className="space-y-2">
            <Label htmlFor="service" className="text-sm font-semibold text-slate-900">
              Service Category
            </Label>
            <Select value={formData.service} onValueChange={(value) => setFormData(prev => ({ ...prev, service: value }))} disabled={isSubmitting}>
              <SelectTrigger className="border-slate-200">
                <SelectValue placeholder="Select a service" />
              </SelectTrigger>
              <SelectContent>
                {SERVICES.map((svc) => (
                  <SelectItem key={svc.value} value={svc.value}>
                    {svc.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-semibold text-slate-900">
              Description (Optional)
            </Label>
            <Textarea
              id="description"
              placeholder="Add details about this project..."
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              disabled={isSubmitting}
              className="border-slate-200 min-h-[100px]"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isSubmitting ? "Creating..." : "Create Project"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
