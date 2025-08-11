import Header from "../components/header";
import Sidebar from "../components/sidebar";
import MicroAppCard from "../components/micro-app-card";
import AIAssistantModal from "../components/ai-assistant-modal";
import MarketplaceModal from "../components/marketplace-modal";
import DeveloperModal from "../components/developer-modal";
import ProjectManagementModal from "../components/project-management-modal";
import DonorManagementModal from "../components/donor-management-modal";
import GovernanceModal from "../components/governance-modal";
import RecentTransactions from "../components/recent-transactions";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import type { User, MicroApp } from "@shared/schema";

export default function Dashboard() {
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [isMarketplaceModalOpen, setIsMarketplaceModalOpen] = useState(false);
  const [isDeveloperModalOpen, setIsDeveloperModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isDonorModalOpen, setIsDonorModalOpen] = useState(false);
  const [isGovernanceModalOpen, setIsGovernanceModalOpen] = useState(false);

  const { data: currentUser } = useQuery<User>({
    queryKey: ["/api/user/current"],
  });

  const { data: microApps = [] } = useQuery<MicroApp[]>({
    queryKey: ["/api/micro-apps"],
  });

  return (
    <div className="bg-slate-50 font-sans min-h-screen">
      <Header 
        onOpenAI={() => setIsAIModalOpen(true)}
        onOpenMarketplace={() => setIsMarketplaceModalOpen(true)}
        onOpenDeveloper={() => setIsDeveloperModalOpen(true)}
        onOpenGovernance={() => setIsGovernanceModalOpen(true)}
        currentUser={currentUser}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <Sidebar currentUser={currentUser} />
          </div>
          
          <div className="lg:col-span-3">
            <div className="space-y-8">
              {/* Welcome Section */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-xl p-8 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">Welcome to WorkBindr 2.0</h2>
                    <p className="text-blue-100 mb-4">Your decentralized business productivity platform powered by AI and blockchain technology.</p>
                    <div className="flex space-x-4">
                      <Button 
                        onClick={() => setIsAIModalOpen(true)}
                        className="bg-white text-blue-600 hover:bg-blue-50"
                      >
                        <i className="fas fa-robot mr-2"></i>Launch AI Assistant
                      </Button>
                      <Button 
                        onClick={() => setIsMarketplaceModalOpen(true)}
                        className="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30"
                      >
                        <i className="fas fa-store mr-2"></i>Browse Marketplace
                      </Button>
                    </div>
                  </div>
                  <div className="hidden md:block">
                    <img 
                      src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&h=150" 
                      alt="Futuristic workspace technology" 
                      className="rounded-lg opacity-80" 
                    />
                  </div>
                </div>
              </div>

              {/* Micro-Apps Grid */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-slate-900">Your Micro-Apps</h3>
                  <Button 
                    variant="ghost" 
                    className="text-blue-600 hover:text-purple-700"
                    onClick={() => setIsMarketplaceModalOpen(true)}
                  >
                    <i className="fas fa-plus mr-2"></i>Add Micro-App
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {microApps.map((app) => {
                    const handleAppClick = () => {
                      if (app.name === "Task Flow") {
                        setIsProjectModalOpen(true);
                      } else if (app.name === "AI Assistant") {
                        setIsAIModalOpen(true);
                      } else if (app.name === "Donor Manager") {
                        setIsDonorModalOpen(true);
                      }
                    };
                    
                    return (
                      <MicroAppCard 
                        key={app.id} 
                        microApp={app} 
                        onClick={handleAppClick}
                      />
                    );
                  })}
                </div>
              </div>

              <RecentTransactions />
            </div>
          </div>
        </div>
      </div>

      <AIAssistantModal 
        isOpen={isAIModalOpen} 
        onClose={() => setIsAIModalOpen(false)}
        currentUser={currentUser}
      />
      
      <MarketplaceModal 
        isOpen={isMarketplaceModalOpen} 
        onClose={() => setIsMarketplaceModalOpen(false)} 
      />
      
      <DeveloperModal 
        isOpen={isDeveloperModalOpen} 
        onClose={() => setIsDeveloperModalOpen(false)}
        currentUser={currentUser}
      />
      
      <ProjectManagementModal 
        isOpen={isProjectModalOpen} 
        onClose={() => setIsProjectModalOpen(false)} 
      />
      
      <DonorManagementModal 
        isOpen={isDonorModalOpen} 
        onClose={() => setIsDonorModalOpen(false)} 
      />
      
      <GovernanceModal 
        isOpen={isGovernanceModalOpen} 
        onClose={() => setIsGovernanceModalOpen(false)}
        currentUser={currentUser} 
      />
    </div>
  );
}
