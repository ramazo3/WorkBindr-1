import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { GovernanceProposal, User } from "@shared/schema";

interface GovernanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser?: User;
}

export default function GovernanceModal({ isOpen, onClose, currentUser }: GovernanceModalProps) {
  const [votedProposals, setVotedProposals] = useState<Set<string>>(new Set());
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: proposals = [] } = useQuery<GovernanceProposal[]>({
    queryKey: ["/api/governance/proposals"],
    enabled: isOpen,
  });

  const voteMutation = useMutation({
    mutationFn: async ({ proposalId, vote }: { proposalId: string; vote: 'for' | 'against' }) => {
      const response = await apiRequest("POST", `/api/governance/proposals/${proposalId}/vote`, {
        vote,
        userId: currentUser?.id
      });
      return response.json();
    },
    onSuccess: (_, variables) => {
      setVotedProposals(prev => new Set([...prev, variables.proposalId]));
      queryClient.invalidateQueries({ queryKey: ["/api/governance/proposals"] });
      toast({
        title: "Vote Recorded",
        description: "Your vote has been successfully recorded on-chain.",
      });
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-blue-100 text-blue-700";
      case "Passed": return "bg-green-100 text-green-700";
      case "Rejected": return "bg-red-100 text-red-700";
      case "Expired": return "bg-gray-100 text-gray-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString();
  };

  const getVotePercentage = (proposal: GovernanceProposal) => {
    const total = (proposal.totalVotes ?? 0);
    if (total === 0) return { forPercentage: 0, againstPercentage: 0 };
    
    const forPercentage = Math.round(((proposal.votesFor ?? 0) / total) * 100);
    const againstPercentage = Math.round(((proposal.votesAgainst ?? 0) / total) * 100);
    
    return { forPercentage, againstPercentage };
  };

  const handleVote = (proposalId: string, vote: 'for' | 'against') => {
    if (!currentUser) {
      toast({
        title: "Authentication Required",
        description: "Please connect your wallet to vote on proposals.",
        variant: "destructive",
      });
      return;
    }

    if (votedProposals.has(proposalId)) {
      toast({
        title: "Already Voted",
        description: "You have already voted on this proposal.",
        variant: "destructive",
      });
      return;
    }

    voteMutation.mutate({ proposalId, vote });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[1000px] max-h-[80vh]">
        <DialogHeader>
          <div>
            <DialogTitle className="text-xl font-semibold">DAO Governance</DialogTitle>
            <p className="text-slate-600">Participate in WorkBindr's decentralized governance</p>
          </div>
        </DialogHeader>
        
        <div className="max-h-[60vh] overflow-y-auto space-y-6">
          {/* Voting Power Section */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-2">Your Voting Power</h3>
                <div className="flex items-center space-x-4">
                  <div className="text-3xl font-bold">
                    {Math.round(currentUser?.reputationScore || 0)}
                  </div>
                  <div>
                    <div className="text-blue-100">Reputation Score</div>
                    <div className="text-sm text-blue-200">
                      Your vote weight is based on your reputation
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-blue-100 mb-1">Wallet Connected</div>
                <div className="text-xs font-mono text-blue-200">
                  {currentUser?.walletAddress || "Not Connected"}
                </div>
              </div>
            </div>
          </div>

          {/* Proposals List */}
          <div>
            <h3 className="text-lg font-medium mb-4">Active Proposals</h3>
            <div className="space-y-4">
              {proposals.map((proposal) => {
                const { forPercentage, againstPercentage } = getVotePercentage(proposal);
                const hasVoted = votedProposals.has(proposal.id);
                const isActive = proposal.status === "Active";

                return (
                  <div key={proposal.id} className="bg-white rounded-lg border border-slate-200 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="font-semibold text-slate-900">{proposal.title}</h4>
                          <Badge variant="outline" className={getStatusColor(proposal.status)}>
                            {proposal.status}
                          </Badge>
                        </div>
                        <p className="text-slate-600 mb-3">{proposal.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-slate-500">
                          <div>Proposed by: <span className="font-medium">{proposal.proposer}</span></div>
                          <div>Ends: <span className="font-medium">{formatDate(proposal.endDate)}</span></div>
                        </div>
                      </div>
                    </div>

                    {/* Voting Results */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-slate-700">Voting Results</span>
                        <span className="text-sm text-slate-500">{proposal.totalVotes || 0} votes</span>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span className="text-sm">For ({proposal.votesFor || 0})</span>
                          </div>
                          <span className="text-sm font-medium">{forPercentage}%</span>
                        </div>
                        <Progress value={forPercentage} className="h-2" />
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                            <span className="text-sm">Against ({proposal.votesAgainst || 0})</span>
                          </div>
                          <span className="text-sm font-medium">{againstPercentage}%</span>
                        </div>
                        <Progress value={againstPercentage} className="h-2" />
                      </div>
                    </div>

                    {/* Voting Buttons */}
                    {isActive && (
                      <div className="flex space-x-3">
                        <Button 
                          className="bg-green-600 hover:bg-green-700"
                          disabled={hasVoted || voteMutation.isPending}
                          onClick={() => handleVote(proposal.id, 'for')}
                        >
                          <i className="fas fa-thumbs-up mr-2"></i>
                          Vote For
                        </Button>
                        <Button 
                          variant="outline" 
                          className="border-red-200 text-red-600 hover:bg-red-50"
                          disabled={hasVoted || voteMutation.isPending}
                          onClick={() => handleVote(proposal.id, 'against')}
                        >
                          <i className="fas fa-thumbs-down mr-2"></i>
                          Vote Against
                        </Button>
                        {hasVoted && (
                          <Badge variant="outline" className="bg-blue-100 text-blue-700">
                            <i className="fas fa-check mr-1"></i>Voted
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Stats Footer */}
          <div className="bg-slate-50 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-slate-900">
                  {proposals.filter(p => p.status === "Active").length}
                </div>
                <div className="text-sm text-slate-600">Active Proposals</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900">
                  {proposals.reduce((sum, p) => sum + (p.totalVotes || 0), 0)}
                </div>
                <div className="text-sm text-slate-600">Total Votes Cast</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900">
                  {proposals.filter(p => p.status === "Passed").length}
                </div>
                <div className="text-sm text-slate-600">Passed Proposals</div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}