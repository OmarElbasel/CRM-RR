"use client";

import { useState } from "react";
import { format } from "date-fns";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription 
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  CreditCard, 
  Key, 
  RefreshCw, 
  Ban, 
  User, 
  History,
  TrendingUp,
  Zap
} from "lucide-react";
import { adminApi } from "@/lib/admin-api";
import { useAuth } from "@clerk/nextjs";

interface OrgDetailProps {
  org: any;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

export function OrgDetailDrawer({ org, isOpen, onClose, onUpdate }: OrgDetailProps) {
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(false);

  if (!org) return null;

  const handleAction = async (actionFn: (token: string) => Promise<any>) => {
    try {
      setLoading(true);
      const token = await getToken();
      if (!token) return;
      await actionFn(token);
      onUpdate();
    } catch (err) {
      console.error(err);
      alert("Failed to perform action");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-xl overflow-y-auto">
        <SheetHeader>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant={org.plan === 'free' ? 'outline' : 'default'} className="uppercase text-[10px]">
              {org.plan}
            </Badge>
            <Badge variant={org.is_active ? 'secondary' : 'destructive'} className="text-[10px]">
              {org.is_active ? "Active" : "Suspended"}
            </Badge>
          </div>
          <SheetTitle className="text-2xl font-bold">{org.name}</SheetTitle>
          <SheetDescription className="font-mono text-xs">
            {org.clerk_org_id}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-8 space-y-8">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Used This Month</p>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold text-gray-900">{org.generations_used_this_month}</span>
                <span className="text-xs text-gray-400">/ {org.monthly_generation_limit}</span>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Cost (USD)</p>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold text-gray-900">${parseFloat(org.monthly_cost_usd || "0").toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* User Details */}
          <section>
            <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <User className="w-4 h-4 text-gray-400" />
              Ownership & Billing
            </h3>
            <div className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-100">
              <div className="p-3 flex justify-between items-center">
                <span className="text-sm text-gray-500">Contact Email</span>
                <span className="text-sm font-medium">{org.owner_email || "N/A"}</span>
              </div>
              <div className="p-3 flex justify-between items-center">
                <span className="text-sm text-gray-500">Stripe Customer</span>
                <span className="text-sm font-mono text-xs text-indigo-600">{org.stripe_customer_id || "None"}</span>
              </div>
              <div className="p-3 flex justify-between items-center">
                <span className="text-sm text-gray-500">Subscription</span>
                <span className="text-sm font-mono text-xs">{org.stripe_subscription_id || "None"}</span>
              </div>
            </div>
          </section>

          {/* Control Panel */}
          <section>
            <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Zap className="w-4 h-4 text-orange-500" />
              Administrative Controls
            </h3>
            <div className="grid grid-cols-1 gap-2">
              <Button 
                variant="outline" 
                className="justify-start text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
                onClick={() => handleAction((t) => adminApi.extendOrgLimit(t, org.id))}
                disabled={loading}
              >
                <TrendingUp className="mr-2 h-4 w-4" />
                Add +50 Gen Bonus
              </Button>
              <Button 
                variant="outline" 
                className="justify-start text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                onClick={() => handleAction((t) => adminApi.resetOrgUsage(t, org.id))}
                disabled={loading}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Reset Usage Counter
              </Button>
              <Button 
                variant="outline" 
                className="justify-start"
                onClick={() => handleAction((t) => adminApi.rotateOrgKeys(t, org.id))}
                disabled={loading}
              >
                <Key className="mr-2 h-4 w-4" />
                Rotate API Keys
              </Button>
              <Button 
                variant="outline" 
                className={org.is_active ? "justify-start text-red-600 hover:text-red-700 hover:bg-red-50" : "justify-start text-green-600 hover:text-green-700 hover:bg-green-50"}
                onClick={() => handleAction((t) => adminApi.toggleOrgStatus(t, org.id, !org.is_active))}
                disabled={loading}
              >
                <Ban className="mr-2 h-4 w-4" />
                {org.is_active ? "Suspend Organization" : "Activate Organization"}
              </Button>
            </div>
          </section>

          {/* Recent Generations */}
          <section className="pb-8">
            <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <History className="w-4 h-4 text-gray-400" />
              Recent Generations (Last 10)
            </h3>
            {org.recent_generations?.length > 0 ? (
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="px-3 py-2 font-medium text-gray-500">Time</th>
                      <th className="px-3 py-2 font-medium text-gray-500">Model</th>
                      <th className="px-3 py-2 font-medium text-gray-500 text-right">Cost</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {org.recent_generations.map((gen: any, i: number) => (
                      <tr key={i}>
                        <td className="px-3 py-2 text-gray-500">{format(new Date(gen.created_at), "HH:mm:ss")}</td>
                        <td className="px-3 py-2 uppercase font-medium">{gen.model.replace('claude-3-', '')}</td>
                        <td className="px-3 py-2 text-right font-mono">${parseFloat(gen.cost_usd).toFixed(4)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-xl p-8 text-center">
                <p className="text-xs text-gray-400">No generation history found for this month.</p>
              </div>
            )}
          </section>
        </div>
      </SheetContent>
    </Sheet>
  );
}
