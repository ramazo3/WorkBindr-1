import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import type { Donor } from "@shared/schema";

interface DonorManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DonorManagementModal({ isOpen, onClose }: DonorManagementModalProps) {
  const { data: donors = [] } = useQuery<Donor[]>({
    queryKey: ["/api/donors"],
    enabled: isOpen,
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-green-100 text-green-700";
      case "Inactive": return "bg-gray-100 text-gray-700";
      case "Pending": return "bg-yellow-100 text-yellow-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const formatDate = (date: Date | string | null) => {
    if (!date) return "Never";
    return new Date(date).toLocaleDateString();
  };

  const totalDonations = donors.reduce((sum, donor) => {
    const amount = parseFloat(donor.totalDonated.replace(/[$,]/g, ''));
    return sum + (isNaN(amount) ? 0 : amount);
  }, 0);

  const totalDonorCount = donors.length;
  const activeDonors = donors.filter(donor => donor.status === "Active").length;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[1000px] max-h-[80vh]">
        <DialogHeader>
          <div>
            <DialogTitle className="text-xl font-semibold">Donor Management</DialogTitle>
            <p className="text-slate-600">Manage your donor relationships and track contributions</p>
          </div>
        </DialogHeader>
        
        <div className="max-h-[60vh] overflow-y-auto">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-blue-600">
                ${totalDonations.toLocaleString()}
              </div>
              <div className="text-sm text-blue-600">Total Donations</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-600">{activeDonors}</div>
              <div className="text-sm text-green-600">Active Donors</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-purple-600">{totalDonorCount}</div>
              <div className="text-sm text-purple-600">Total Donors</div>
            </div>
          </div>

          {/* Donors Table */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Donor List</h3>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <i className="fas fa-plus mr-2"></i>Add Donor
              </Button>
            </div>

            <div className="bg-white rounded-lg border border-slate-200">
              <div className="grid grid-cols-7 gap-4 p-4 bg-slate-50 rounded-t-lg text-sm font-medium text-slate-700">
                <div>Name</div>
                <div>Email</div>
                <div>Total Donated</div>
                <div>Last Donation</div>
                <div>Donation Count</div>
                <div>Status</div>
                <div>Actions</div>
              </div>
              
              {donors.map((donor) => (
                <div key={donor.id} className="grid grid-cols-7 gap-4 p-4 border-t border-slate-200 hover:bg-slate-50 transition-colors">
                  <div>
                    <div className="font-medium text-slate-900">{donor.name}</div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-600">{donor.email}</div>
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">{donor.totalDonated}</div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-600">{formatDate(donor.lastDonation)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-600">{donor.donationCount}</div>
                  </div>
                  <div>
                    <Badge variant="outline" className={getStatusColor(donor.status)}>
                      {donor.status}
                    </Badge>
                  </div>
                  <div>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                        <i className="fas fa-eye text-xs"></i>
                      </Button>
                      <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-700">
                        <i className="fas fa-edit text-xs"></i>
                      </Button>
                      <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700">
                        <i className="fas fa-envelope text-xs"></i>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-4">Recent Donation Activity</h3>
            <div className="space-y-3">
              {donors.slice(0, 3).map((donor) => (
                <div key={donor.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
                      <i className="fas fa-donate text-white text-sm"></i>
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{donor.name}</p>
                      <p className="text-sm text-slate-600">Last donation: {formatDate(donor.lastDonation)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-slate-900">{donor.totalDonated}</p>
                    <p className="text-sm text-slate-500">{donor.donationCount} donations</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}