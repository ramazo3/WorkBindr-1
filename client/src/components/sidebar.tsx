import { useQuery } from "@tanstack/react-query";
import type { User, PlatformStats } from "@shared/schema";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  currentUser?: User;
}

export default function Sidebar({ currentUser }: SidebarProps) {
  const { data: stats } = useQuery<PlatformStats>({
    queryKey: ["/api/platform/stats"],
  });

  return (
    <div className="space-y-6">
      {/* Reputation Score Widget */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Reputation Score</h3>
          <div className="relative">
            <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center">
              <span className="text-2xl font-bold text-white">
                {currentUser?.reputationScore?.toFixed(1) || "0.0"}
              </span>
            </div>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
              <div className="flex items-center space-x-1 bg-emerald-100 px-2 py-1 rounded-full">
                <i className="fas fa-arrow-up text-emerald-500 text-xs"></i>
                <span className="text-xs text-emerald-700 font-medium">+2.3</span>
              </div>
            </div>
          </div>
          <p className="text-sm text-slate-600 mt-4">Based on contributions across the platform</p>
          <Button variant="ghost" className="mt-3 text-blue-600 hover:text-purple-700">
            <i className="fas fa-external-link-alt mr-2"></i>View Details
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Platform Stats</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-600">Active Micro-Apps</span>
            <span className="font-semibold text-slate-900">{stats?.activeMicroApps || 0}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-600">Transactions Today</span>
            <span className="font-semibold text-slate-900">{stats?.transactionsToday || 0}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-600">Data Nodes</span>
            <span className="font-semibold text-slate-900">{stats?.dataNodes?.toLocaleString() || 0}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-600">Community Contributors</span>
            <span className="font-semibold text-slate-900">{stats?.contributors?.toLocaleString() || 0}</span>
          </div>
        </div>
      </div>

      {/* Session Status */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Session State</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
            <span className="text-sm text-slate-600">Decentralized Storage</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
            <span className="text-sm text-slate-600">Cross-Device Sync</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
            <span className="text-sm text-slate-600">IPFS Connection</span>
          </div>
        </div>
        <Button 
          variant="outline" 
          className="mt-4 w-full"
        >
          <i className="fas fa-cog mr-2"></i>Manage Session
        </Button>
      </div>
    </div>
  );
}
