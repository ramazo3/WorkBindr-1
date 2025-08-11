import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";

interface MarketplaceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface MarketplaceApp {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  rating: number;
  reviewCount: number;
  pricePerCall: string;
  category: string;
}

export default function MarketplaceModal({ isOpen, onClose }: MarketplaceModalProps) {
  const { data: marketplaceApps = [] } = useQuery<MarketplaceApp[]>({
    queryKey: ["/api/marketplace"],
    enabled: isOpen,
  });

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <i 
        key={i} 
        className={`fas fa-star text-xs ${i < Math.floor(rating) ? "text-amber-500" : "text-slate-300"}`}
      />
    ));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px] max-h-[80vh]">
        <DialogHeader>
          <div>
            <DialogTitle className="text-xl font-semibold">Micro-App Marketplace</DialogTitle>
            <p className="text-slate-600">Discover and integrate new micro-apps into your workflow</p>
          </div>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[60vh] overflow-y-auto p-1">
          {marketplaceApps.map((app) => (
            <div 
              key={app.id}
              className="bg-slate-50 rounded-lg p-6 border border-slate-200 hover:border-blue-600 transition-colors"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${app.color} rounded-lg flex items-center justify-center`}>
                  <i className={`fas fa-${app.icon} text-white`}></i>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-1">
                    {renderStars(app.rating)}
                    <span className="text-sm font-medium ml-1">{app.rating}</span>
                  </div>
                  <div className="text-xs text-slate-500">{app.reviewCount} reviews</div>
                </div>
              </div>
              
              <h4 className="font-semibold text-slate-900 mb-2">{app.name}</h4>
              <p className="text-sm text-slate-600 mb-4">{app.description}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-xs">{app.category}</Badge>
                  <span className="text-sm font-medium text-blue-600">{app.pricePerCall}</span>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Install
                </Button>
              </div>
            </div>
          ))}
          
          {/* Additional sample apps */}
          <div className="bg-slate-50 rounded-lg p-6 border border-slate-200 hover:border-blue-600 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                <i className="fas fa-calendar-alt text-white"></i>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-1">
                  {renderStars(4.6)}
                  <span className="text-sm font-medium ml-1">4.6</span>
                </div>
                <div className="text-xs text-slate-500">203 reviews</div>
              </div>
            </div>
            
            <h4 className="font-semibold text-slate-900 mb-2">Smart Calendar</h4>
            <p className="text-sm text-slate-600 mb-4">AI-powered scheduling with automatic conflict resolution and meeting optimization.</p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="text-xs">Productivity</Badge>
                <span className="text-sm font-medium text-blue-600">0.0005 ETH/event</span>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700">
                Install
              </Button>
            </div>
          </div>

          <div className="bg-slate-50 rounded-lg p-6 border border-slate-200 hover:border-blue-600 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg flex items-center justify-center">
                <i className="fas fa-shield-alt text-white"></i>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-1">
                  {renderStars(4.9)}
                  <span className="text-sm font-medium ml-1">4.9</span>
                </div>
                <div className="text-xs text-slate-500">156 reviews</div>
              </div>
            </div>
            
            <h4 className="font-semibold text-slate-900 mb-2">Security Monitor</h4>
            <p className="text-sm text-slate-600 mb-4">Real-time security monitoring with blockchain-based threat detection and alerts.</p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="text-xs">Security</Badge>
                <span className="text-sm font-medium text-blue-600">0.003 ETH/scan</span>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700">
                Install
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
