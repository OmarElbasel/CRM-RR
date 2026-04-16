"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@clerk/nextjs";
import { adminApi } from "@/lib/admin-api";
import { OrgTable, Organization } from "@/components/admin/OrgTable";
import { OrgDetailDrawer } from "@/components/admin/OrgDetailDrawer";
import { PageHeader } from "@/components/ui/PageHeader";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Search, Filter, Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function OrgsPage() {
  const { getToken, isLoaded } = useAuth();
  const [data, setData] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [planFilter, setPlanFilter] = useState("all");
  const [selectedOrg, setSelectedOrg] = useState<any>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const fetchOrgs = useCallback(async () => {
    try {
      setLoading(true);
      const token = await getToken();
      if (!token) return;

      const params: any = {};
      if (search) params.search = search;
      if (planFilter !== "all") params.plan = planFilter;

      const response = await adminApi.getOrgs(token, params);
      setData(response.results);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [getToken, search, planFilter]);

  useEffect(() => {
    if (isLoaded) {
      fetchOrgs();
    }
  }, [isLoaded, fetchOrgs]);

  const handleViewDetail = async (org: Organization) => {
    try {
      const token = await getToken();
      if (!token) return;
      
      // Fetch full detail for the drawer
      const detail = await adminApi.getOrgDetail(token, org.id);
      setSelectedOrg(detail);
      setDrawerOpen(true);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch org details");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Organizations</h1>
          <p className="text-sm text-gray-500">Manage customer subscriptions and limits.</p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700">
          <Plus className="w-4 h-4 mr-2" />
          Create Organization
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-xl border border-gray-200">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input 
            placeholder="Search by name or Clerk ID..." 
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <Select value={planFilter} onValueChange={setPlanFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Plans" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Plans</SelectItem>
              <SelectItem value="free">Free</SelectItem>
              <SelectItem value="starter">Starter</SelectItem>
              <SelectItem value="pro">Pro</SelectItem>
              <SelectItem value="enterprise">Enterprise</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
          <p className="text-sm text-gray-500">Loading organizations...</p>
        </div>
      ) : (
        <OrgTable 
          data={data} 
          onViewDetail={handleViewDetail} 
          onRefresh={fetchOrgs} 
        />
      )}

      <OrgDetailDrawer 
        org={selectedOrg} 
        isOpen={drawerOpen} 
        onClose={() => setDrawerOpen(false)} 
        onUpdate={() => {
          fetchOrgs();
          // Also refresh detail if drawer is still open
          if (selectedOrg) handleViewDetail(selectedOrg);
        }}
      />
    </div>
  );
}
