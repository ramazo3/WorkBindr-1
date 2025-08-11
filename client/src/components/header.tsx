import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import WalletConnectButton from "./wallet-connect-button";
import type { User } from "@shared/schema";

interface HeaderProps {
  onOpenAI: () => void;
  onOpenMarketplace: () => void;
  onOpenDeveloper: () => void;
  onOpenGovernance: () => void;
  currentUser?: User;
}

export default function Header({ onOpenAI, onOpenMarketplace, onOpenDeveloper, onOpenGovernance, currentUser }: HeaderProps) {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-700 rounded-lg flex items-center justify-center">
                <i className="fas fa-cube text-white text-sm"></i>
              </div>
              <h1 className="text-xl font-bold text-slate-900">WorkBindr 2.0</h1>
              <span className="px-2 py-1 text-xs bg-cyan-100 text-cyan-700 rounded-full border border-cyan-200">MVP</span>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#dashboard" className="text-blue-600 font-medium">Dashboard</a>
            <button 
              onClick={onOpenMarketplace}
              className="text-slate-600 hover:text-slate-900"
            >
              Marketplace
            </button>
            <button 
              onClick={onOpenDeveloper}
              className="text-slate-600 hover:text-slate-900"
            >
              Developers
            </button>
            <button 
              onClick={onOpenGovernance}
              className="text-slate-600 hover:text-slate-900"
            >
              Governance
            </button>
          </nav>

          <div className="flex items-center space-x-4">
            {/* Wallet Connection */}
            <WalletConnectButton currentUser={currentUser} />
            
            {/* User Profile */}
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-medium text-slate-900">{currentUser?.name || "Loading..."}</p>
                <p className="text-xs text-slate-500">{currentUser?.walletAddress || "0x..."}</p>
              </div>
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100" 
                alt="User Profile" 
                className="w-10 h-10 rounded-full border-2 border-slate-200" 
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
