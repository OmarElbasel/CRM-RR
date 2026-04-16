"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { adminApi } from "@/lib/admin-api";
import { 
  Zap, 
  AlertTriangle, 
  BarChart, 
  History,
  Loader2,
  ExternalLink,
  ShieldAlert
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import Link from "next/link";

export default function RateLimitsPage() {
  const { getToken, isLoaded } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRateLimits() {
      try {
        const token = await getToken();
        if (!token) return;
        const response = await adminApi.getRateLimits(token);
        setData(response);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    if (isLoaded) fetchRateLimits();
  }, [isLoaded, getToken]);

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
    </div>
  );

  const results = data?.results || [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Zap className="w-6 h-6 text-orange-500" />
          Rate Limit Observability
        </h1>
        <p className="text-sm text-gray-500">Identify organizations hitting generation capacity limits (last 7 days).</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="text-sm font-bold uppercase tracking-tight text-gray-500">Recent Violations</CardTitle>
            </CardHeader>
            <CardContent>
              {results.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-gray-100">
                        <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase text-left">Organization</th>
                        <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase text-center">Hits</th>
                        <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase text-right">Last Event</th>
                        <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {results.map((item: any, i: number) => (
                        <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-4 py-4">
                            <div className="flex flex-col">
                              <span className="text-sm font-bold text-gray-900">{item.name}</span>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-[9px] uppercase">{item.plan}</Badge>
                                <span className="text-[10px] text-gray-400 font-mono">{item.org_id}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-center">
                            <Badge variant={item.hit_count > 10 ? "destructive" : "secondary"} className="h-6 px-3">
                              {item.hit_count}
                            </Badge>
                          </td>
                          <td className="px-4 py-4 text-right">
                            <span className="text-sm text-gray-500">
                              {format(new Date(item.last_hit_at), "MMM d, HH:mm")}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-right">
                            <Link href={`/admin/orgs?search=${item.name}`}>
                              <Button variant="ghost" size="sm" className="h-8">
                                <ExternalLink className="w-3.5 h-3.5" />
                              </Button>
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="py-20 text-center">
                  <p className="text-gray-400 text-sm">No rate limit violations recorded in the last 7 days.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-orange-100 bg-orange-50/30">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-orange-900 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
                Capacity Insight
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-orange-800 leading-relaxed">
                Organizations appearing here have reached 100% of their monthly generation budget or cost cap. 
                Frequent hits from specific orgs may indicate a need for plan upgrade or budget adjustment.
              </p>
              <div className="mt-6 space-y-4">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-orange-700 font-medium">Violations Today</span>
                  <span className="font-bold text-orange-900">{results.reduce((acc: number, r: any) => acc + r.hit_count, 0)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
             <CardHeader>
               <CardTitle className="text-sm font-bold uppercase text-gray-500 tracking-wider">Troubleshooting</CardTitle>
             </CardHeader>
             <CardContent className="space-y-4">
               <div className="flex gap-3">
                 <div className="p-2 rounded-lg bg-indigo-50 shrink-0 h-fit">
                   <ShieldAlert className="w-4 h-4 text-indigo-600" />
                 </div>
                 <div>
                   <p className="text-xs font-bold text-gray-900">Check Orgs</p>
                   <p className="text-[11px] text-gray-500">Review specific org usage breakdown in the Orgs panel.</p>
                 </div>
               </div>
               <div className="flex gap-3">
                 <div className="p-2 rounded-lg bg-orange-50 shrink-0 h-fit">
                   <BarChart className="w-4 h-4 text-orange-600" />
                 </div>
                 <div>
                   <p className="text-xs font-bold text-gray-900">Adjust Config</p>
                   <p className="text-[11px] text-gray-500">Increase global plan budgets in the AI Config panel.</p>
                 </div>
               </div>
             </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
