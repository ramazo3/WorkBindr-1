import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import type { Transaction } from "@shared/schema";

export default function RecentTransactions() {
  const { data: transactions = [] } = useQuery<Transaction[]>({
    queryKey: ["/api/transactions/recent"],
  });

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
    return `${Math.floor(diffInMinutes / 1440)} days ago`;
  };

  const getTransactionIcon = (description: string) => {
    if (description.includes("reward") || description.includes("WBR")) {
      return { icon: "arrow-up", color: "from-blue-500 to-blue-600" };
    }
    return { icon: "arrow-down", color: "from-emerald-500 to-emerald-600" };
  };

  const getAmountColor = (amount: string) => {
    return amount.includes("+") ? "text-emerald-700" : "text-slate-900";
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-slate-900">Recent Transactions</h3>
        <Button variant="ghost" className="text-blue-600 hover:text-purple-700">
          View All
        </Button>
      </div>
      
      <div className="space-y-4">
        {transactions.map((transaction) => {
          const { icon, color } = getTransactionIcon(transaction.description);
          return (
            <div key={transaction.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className={`w-10 h-10 bg-gradient-to-br ${color} rounded-lg flex items-center justify-center`}>
                  <i className={`fas fa-${icon} text-white`}></i>
                </div>
                <div>
                  <p className="font-medium text-slate-900">{transaction.description}</p>
                  <p className="text-sm text-slate-500">
                    {transaction.createdAt ? formatTimeAgo(new Date(transaction.createdAt)) : "Unknown time"}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-semibold ${getAmountColor(transaction.amount)}`}>
                  {transaction.amount}
                </p>
                <p className="text-sm text-slate-500">{transaction.status}</p>
              </div>
            </div>
          );
        })}
        
        {transactions.length === 0 && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-receipt text-slate-400 text-xl"></i>
            </div>
            <p className="text-slate-600">No recent transactions</p>
            <p className="text-sm text-slate-500">Your transaction history will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
}
