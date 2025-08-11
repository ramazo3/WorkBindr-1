import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import type { User } from "@shared/schema";

interface WalletConnectButtonProps {
  currentUser?: User;
  onConnect?: (walletAddress: string) => void;
}

export default function WalletConnectButton({ currentUser, onConnect }: WalletConnectButtonProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();

  const simulateWalletConnection = async () => {
    setIsConnecting(true);
    
    // Simulate wallet connection delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate a simulated wallet address
    const simulatedAddress = "0x" + Math.random().toString(16).substring(2, 42).padStart(40, '0');
    
    toast({
      title: "Wallet Connected",
      description: `Successfully connected to ${simulatedAddress.substring(0, 10)}...`,
    });
    
    onConnect?.(simulatedAddress);
    setIsConnecting(false);
  };

  const isConnected = currentUser?.walletAddress && currentUser.walletAddress !== "Not Connected";

  if (isConnected) {
    return (
      <div className="flex items-center space-x-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        <span className="text-sm text-green-700 font-medium">
          {currentUser?.walletAddress?.substring(0, 6)}...{currentUser?.walletAddress?.substring(-4)}
        </span>
      </div>
    );
  }

  return (
    <Button 
      onClick={simulateWalletConnection}
      disabled={isConnecting}
      className="bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800"
    >
      {isConnecting ? (
        <>
          <i className="fas fa-spinner fa-spin mr-2"></i>
          Connecting...
        </>
      ) : (
        <>
          <i className="fas fa-wallet mr-2"></i>
          Connect Wallet
        </>
      )}
    </Button>
  );
}