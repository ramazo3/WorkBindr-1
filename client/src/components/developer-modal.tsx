import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface DeveloperModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DeveloperModal({ isOpen, onClose }: DeveloperModalProps) {
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
