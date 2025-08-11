import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { User, DeveloperSettings } from "@shared/schema";

interface DeveloperModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser?: User;
}

export default function DeveloperModal({ isOpen, onClose, currentUser }: DeveloperModalProps) {
  const [selectedLLM, setSelectedLLM] = useState<string>("gpt-4o");
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: settings } = useQuery<DeveloperSettings>({
    queryKey: ["/api/developer/settings", currentUser?.id],
    enabled: isOpen && !!currentUser,
  });

  const updateSettingsMutation = useMutation({
    mutationFn: async (newSettings: Partial<DeveloperSettings>) => {
      if (!currentUser) throw new Error("User not found");
      const response = await apiRequest("PUT", `/api/developer/settings/${currentUser.id}`, newSettings);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/developer/settings", currentUser?.id] });
      toast({
        title: "Settings Updated",
        description: "Your developer preferences have been saved.",
      });
    },
  });

  const llmOptions = [
    { value: "gpt-4o", label: "ChatGPT 4o", description: "OpenAI's most capable model with multimodal capabilities" },
    { value: "claude-3-5-sonnet", label: "Claude 3.5 Sonnet", description: "Anthropic's advanced reasoning and coding model" },
    { value: "gemini-pro", label: "Gemini Pro", description: "Google's multimodal AI with strong reasoning capabilities" },
    { value: "deepseek-coder", label: "DeepSeek Coder", description: "Specialized coding model with excellent programming skills" },
  ];

  const handleLLMChange = (newLLM: string) => {
    setSelectedLLM(newLLM);
    updateSettingsMutation.mutate({ preferredLLM: newLLM });
  };
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px] max-h-[80vh]">
        <DialogHeader>
          <div>
            <DialogTitle className="text-xl font-semibold">Developer Portal</DialogTitle>
            <p className="text-slate-600">Build and monetize micro-apps on the WorkBindr platform</p>
          </div>
        </DialogHeader>
        
        <div className="max-w-4xl mx-auto max-h-[60vh] overflow-y-auto p-1">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* LLM Selection Section */}
            <div className="lg:col-span-2 mb-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">AI Model Configuration</h3>
              <div className="bg-slate-50 rounded-lg p-6">
                <div className="mb-4">
                  <Label htmlFor="llm-select" className="text-sm font-medium">
                    Preferred Large Language Model
                  </Label>
                  <p className="text-xs text-slate-600 mb-3">
                    Select your preferred AI model for micro-app development and API integration
                  </p>
                  <Select
                    value={settings?.preferredLLM || selectedLLM}
                    onValueChange={handleLLMChange}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select an AI model" />
                    </SelectTrigger>
                    <SelectContent>
                      {llmOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex flex-col">
                            <div className="font-medium">{option.label}</div>
                            <div className="text-xs text-slate-500">{option.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg p-4 border">
                    <div className="text-sm font-medium text-slate-900 mb-2">Current Selection</div>
                    <div className="text-lg font-semibold text-blue-600">
                      {llmOptions.find(opt => opt.value === (settings?.preferredLLM || selectedLLM))?.label}
                    </div>
                    <div className="text-xs text-slate-600 mt-1">
                      {llmOptions.find(opt => opt.value === (settings?.preferredLLM || selectedLLM))?.description}
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border">
                    <div className="text-sm font-medium text-slate-900 mb-2">Integration Status</div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-green-600">Active & Ready</span>
                    </div>
                    <div className="text-xs text-slate-600 mt-1">
                      API endpoints configured and operational
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Getting Started</h3>
              <div className="space-y-4">
                <div className="bg-slate-50 rounded-lg p-4">
                  <h4 className="font-medium text-slate-900 mb-2">1. API Schema Library</h4>
                  <p className="text-sm text-slate-600 mb-3">Access our comprehensive library of standardized API schemas for seamless integration.</p>
                  <Button variant="ghost" className="text-blue-600 font-medium text-sm p-0">
                    View Documentation →
                  </Button>
                </div>
                
                <div className="bg-slate-50 rounded-lg p-4">
                  <h4 className="font-medium text-slate-900 mb-2">2. Development SDK</h4>
                  <p className="text-sm text-slate-600 mb-3">Download our SDK to start building your micro-app with built-in blockchain integration.</p>
                  <Button variant="ghost" className="text-blue-600 font-medium text-sm p-0">
                    Download SDK →
                  </Button>
                </div>
                
                <div className="bg-slate-50 rounded-lg p-4">
                  <h4 className="font-medium text-slate-900 mb-2">3. Monetization Setup</h4>
                  <p className="text-sm text-slate-600 mb-3">Configure your pricing model and payment processing for micro-transactions.</p>
                  <Button variant="ghost" className="text-blue-600 font-medium text-sm p-0">
                    Setup Payments →
                  </Button>
                </div>

                <div className="bg-slate-50 rounded-lg p-4">
                  <h4 className="font-medium text-slate-900 mb-2">4. Deployment & Testing</h4>
                  <p className="text-sm text-slate-600 mb-3">Deploy your micro-app to our testnet for validation before going live.</p>
                  <Button variant="ghost" className="text-blue-600 font-medium text-sm p-0">
                    Deploy to Testnet →
                  </Button>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Sample API Schema</h3>
              <div className="bg-slate-900 rounded-lg p-4 text-sm mb-6">
                <pre className="text-green-400 overflow-x-auto">
{`{
  "customer.add": {
    "method": "POST",
    "endpoint": "/api/v1/customer",
    "parameters": {
      "name": "string",
      "email": "string", 
      "company": "string"
    },
    "pricing": "0.0001 ETH per call",
    "returns": {
      "customerId": "string",
      "status": "success|error"
    }
  }
}`}
                </pre>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Revenue Potential</h3>
                <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-lg p-6 text-white">
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-2">$2,847</div>
                    <div className="text-blue-100">Average monthly revenue per micro-app</div>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <h4 className="font-medium text-slate-900">Popular API Categories</h4>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">Customer Management</Badge>
                  <Badge variant="outline">Financial Services</Badge>
                  <Badge variant="outline">Task Management</Badge>
                  <Badge variant="outline">Analytics</Badge>
                  <Badge variant="outline">Communication</Badge>
                  <Badge variant="outline">AI/ML Services</Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
