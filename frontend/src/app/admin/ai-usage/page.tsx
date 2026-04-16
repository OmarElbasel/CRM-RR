"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@clerk/nextjs";
import { adminApi } from "@/lib/admin-api";
import { UsageChart } from "@/components/admin/UsageChart";
import { 
  BarChart3, 
  DollarSign, 
  Cpu, 
  Zap, 
  Calendar as CalendarIcon,
  Loader2,
  Table as TableIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { format, startOfMonth } from "date-fns";

export default function AIUsagePage() {
  const { getToken, isLoaded } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    from: format(startOfMonth(new Date()), "yyyy-MM-dd"),
    to: format(new Date(), "yyyy-MM-dd"),
  });

  const fetchUsage = useCallback(async () => {
    try {
      setLoading(true);
      const token = await getToken();
      if (!token) return;

      const response = await adminApi.getAIUsage(token, dateRange);
      setData(response);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [getToken, dateRange]);

  useEffect(() => {
    if (isLoaded) {
      fetchUsage();
    }
  }, [isLoaded, fetchUsage]);

  if (loading && !data) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        <p className="text-sm text-gray-500">Calculating platform usage...</p>
      </div>
    );
  }

  const kpis = [
    { 
      label: "Total Cost", 
      value: `$${parseFloat(data?.summary?.total_cost_usd || 0).toFixed(2)}`, 
      sub: "Platform total",
      icon: <DollarSign className="w-4 h-4 text-green-600" />,
      bg: "bg-green-50"
    },
    { 
      label: "Generations", 
      value: data?.summary?.total_generations?.toLocaleString() || "0", 
      sub: "Total calls",
      icon: <Zap className="w-4 h-4 text-orange-600" />,
      bg: "bg-orange-50"
    },
    { 
      label: "Total Tokens", 
      value: `${((data?.summary?.total_tokens_in + data?.summary?.total_tokens_out) / 1000000).toFixed(2)}M`, 
      sub: "In + Out",
      icon: <Cpu className="w-4 h-4 text-indigo-600" />,
      bg: "bg-indigo-50"
    },
    { 
      label: "Avg. Cache Hit", 
      value: `${(data?.by_model?.reduce((acc: number, m: any) => acc + m.cache_hit_pct, 0) / (data?.by_model?.length || 1)).toFixed(1)}%`, 
      sub: "By model avg",
      icon: <TableIcon className="w-4 h-4 text-blue-600" />,
      bg: "bg-blue-50"
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-indigo-600" />
            AI Usage Monitoring
          </h1>
          <p className="text-sm text-gray-500">Aggregated token consumption and costs.</p>
        </div>
        <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-gray-200">
           <span className="px-3 py-1.5 text-xs font-medium text-gray-500 flex items-center gap-2 border-r border-gray-100">
             <CalendarIcon className="w-3.5 h-3.5" />
             {format(new Date(dateRange.from), "MMM d")} - {format(new Date(dateRange.to), "MMM d")}
           </span>
           <Button variant="ghost" size="sm" className="text-xs">Adjust Range</Button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-4">
              <div className={`p-2 rounded-xl ${kpi.bg}`}>
                {kpi.icon}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">{kpi.label}</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-bold text-gray-900">{kpi.value}</span>
                  <span className="text-[10px] uppercase font-semibold text-gray-400">{kpi.sub}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <UsageChart 
          title="Daily Platform Spend (USD)" 
          data={data?.daily || []} 
          type="line" 
          dataKey="cost_usd" 
        />
        <UsageChart 
          title="Model Distribution (Cost)" 
          data={data?.by_model || []} 
          type="bar" 
          dataKey="cost_usd" 
        />
      </div>

      {/* Breakdown Table */}
      <section className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-tight">Model Breakdown</h2>
          <Button variant="outline" size="sm" className="h-8 text-xs">Export CSV</Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Model</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase text-right">Calls</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase text-right">Tokens In</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase text-right">Tokens Out</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase text-right">Cache Hit %</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase text-right">Cost (USD)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data?.by_model?.map((item: any, i: number) => (
                <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-mono text-xs font-semibold text-indigo-600 uppercase">{item.model}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 text-right">{item.call_count.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 text-right">{(item.tokens_in / 1000).toFixed(0)}k</td>
                  <td className="px-6 py-4 text-sm text-gray-600 text-right">{(item.tokens_out / 1000).toFixed(0)}k</td>
                  <td className="px-6 py-4 text-right">
                    <span className={`text-xs font-bold ${item.cache_hit_pct > 30 ? 'text-green-600' : 'text-gray-400'}`}>
                      {item.cache_hit_pct.toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-900 text-right">
                    ${parseFloat(item.cost_usd).toFixed(3)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
