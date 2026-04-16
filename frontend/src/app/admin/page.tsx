"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { adminApi } from "@/lib/admin-api";
import { 
  Users, 
  CreditCard, 
  Activity, 
  AlertTriangle,
  ArrowRight,
  PlusCircle,
  TrendingUp,
  Package,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

export default function AdminOverview() {
  const { getToken, isLoaded } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOverview() {
      try {
        const token = await getToken();
        if (!token) return;
        const response = await adminApi.getOverview(token);
        setData(response);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    if (isLoaded) fetchOverview();
  }, [isLoaded, getToken]);

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const stats = [
    { 
      label: "Total Organizations", 
      value: data?.kpis?.total_orgs || 0, 
      icon: <Users className="w-5 h-5 text-indigo-600" />,
      color: "bg-indigo-50"
    },
    { 
      label: "Paid Subscriptions", 
      value: data?.kpis?.paid_orgs || 0, 
      icon: <CreditCard className="w-5 h-5 text-green-600" />,
      color: "bg-green-50"
    },
    { 
      label: "Monthly AI Spend", 
      value: `$${(data?.kpis?.ai_spend_usd || 0).toFixed(2)}`, 
      icon: <TrendingUp className="w-5 h-5 text-orange-600" />,
      color: "bg-orange-50"
    },
    { 
      label: "Active Orgs (30d)", 
      value: data?.kpis?.active_orgs_30d || 0, 
      icon: <Activity className="w-5 h-5 text-blue-600" />,
      color: "bg-blue-50"
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Platform Overview</h1>
        <p className="text-gray-500">Real-time performance and operational health monitoring.</p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className="border-gray-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-lg ${stat.color}`}>
                  {stat.icon}
                </div>
              </div>
              <p className="text-sm font-medium text-gray-500">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Signups */}
        <Card className="lg:col-span-2 border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-bold">Recent Signups</CardTitle>
            <Link href="/admin/orgs" className="text-sm text-indigo-600 flex items-center gap-1 hover:underline">
              View All <ArrowRight className="w-3 h-3" />
            </Link>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-gray-100">
              {data?.recent_signups?.map((org: any) => (
                <div key={org.id} className="py-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-400">
                      {org.name[0]}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">{org.name}</p>
                      <p className="text-xs text-gray-500">{format(new Date(org.created_at), "MMM d, yyyy")}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant={org.plan === 'free' ? 'outline' : 'secondary'} className="uppercase text-[10px]">
                      {org.plan}
                    </Badge>
                    <Link href="/admin/orgs">
                       <Button variant="ghost" size="sm" className="h-8">Details</Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Operational Alerts */}
        <div className="space-y-6">
          <Card className="border-red-100 bg-red-50/30">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-red-900 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                Critical Alerts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="min-w-1.5 h-1.5 rounded-full bg-red-600 mt-1.5" />
                <div>
                  <p className="text-sm font-bold text-red-900">{data?.alerts?.webhook_failures_24h || 0} Webhook Failures</p>
                  <p className="text-xs text-red-700">In the last 24 hours. Check Stripe logs.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className={data?.alerts?.rate_limit_hits_24h > 10 ? "min-w-1.5 h-1.5 rounded-full bg-red-600 mt-1.5" : "min-w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5"} />
                <div>
                  <p className="text-sm font-bold text-gray-900">{data?.alerts?.rate_limit_hits_24h || 0} Rate Limit Hits</p>
                  <p className="text-xs text-gray-500">Organizations hitting capacity limits.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="text-sm font-bold uppercase text-gray-500 tracking-wider">Quick Links</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-2">
              <Link href="/admin/ai-config">
                <Button variant="outline" className="w-full justify-start text-xs font-medium">
                  <Package className="w-3.5 h-3.5 mr-2 text-indigo-600" />
                  Manage Plan Budgets
                </Button>
              </Link>
              <Link href="/admin/ai-usage">
                <Button variant="outline" className="w-full justify-start text-xs font-medium">
                  <Zap className="w-3.5 h-3.5 mr-2 text-orange-500" />
                  AI Model Performance
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
