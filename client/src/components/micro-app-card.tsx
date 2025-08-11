import type { MicroApp } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface MicroAppCardProps {
  microApp: MicroApp;
  onClick?: () => void;
}

export default function MicroAppCard({ microApp, onClick }: MicroAppCardProps) {
  const getIconColorClass = (color: string) => {
    return color.replace('from-workbindr-', 'from-').replace('to-workbindr-', 'to-');
  };

  const getStatusColor = (isActive: boolean | null) => {
    return isActive ? "text-emerald-700" : "text-slate-500";
  };

  return (
    <div 
      className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 bg-gradient-to-br ${getIconColorClass(microApp.color)} rounded-lg flex items-center justify-center`}>
            <i className={`fas fa-${microApp.icon} text-white`}></i>
          </div>
          <div>
            <h4 className="font-semibold text-slate-900">{microApp.name}</h4>
            <p className="text-sm text-slate-500">{microApp.version}</p>
          </div>
        </div>
        <div className="text-right">
          <div className={`text-sm font-medium ${getStatusColor(microApp.isActive)}`}>
            {microApp.isActive ? "Active" : "Inactive"}
          </div>
          <div className="text-xs text-slate-500">
            {microApp.transactionCount} transactions
          </div>
        </div>
      </div>
      
      <p className="text-sm text-slate-600 mb-4">{microApp.description}</p>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="text-xs">
            {microApp.apiSchema}
          </Badge>
        </div>
        <Button 
          variant="ghost" 
          size="sm"
          className="text-blue-600 hover:text-purple-700"
        >
          <i className="fas fa-external-link-alt"></i>
        </Button>
      </div>
    </div>
  );
}
