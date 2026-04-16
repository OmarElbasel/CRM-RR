"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { adminApi } from "@/lib/admin-api";
import { 
  Settings2, 
  Save, 
  Cpu, 
  Database, 
  AlertCircle,
  Loader2,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function AIConfigPage() {
  const { getToken, isLoaded } = useAuth();
  const [config, setConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    async function fetchConfig() {
      try {
        const token = await getToken();
        if (!token) return;
        const response = await adminApi.getConfig(token);
        setConfig(response);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    if (isLoaded) fetchConfig();
  }, [isLoaded, getToken]);

  const handleUpdateBudgets = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const token = await getToken();
      if (!token) return;
      await adminApi.updateTokenBudgets(token, config.token_budgets);
      setSuccessMsg("Token budgets updated successfully.");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      alert("Failed to update budgets");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateRates = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const token = await getToken();
      if (!token) return;
      await adminApi.updateCostRates(token, config.cost_rates);
      setSuccessMsg("Cost rates updated successfully.");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      alert("Failed to update rates");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
    </div>
  );

  if (!config) return (
    <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
      <AlertCircle className="w-8 h-8 text-red-500" />
      <p className="text-gray-600 font-medium">Failed to load AI configuration.</p>
      <p className="text-sm text-gray-400">Check that the backend is running and the admin API is reachable.</p>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Settings2 className="w-6 h-6 text-indigo-600" />
            Global AI Configuration
          </h1>
          <p className="text-sm text-gray-500">Fine-tune system-wide budgets and provider costs.</p>
        </div>
        {successMsg && (
          <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-lg text-sm font-medium animate-in fade-in slide-in-from-top-2">
            <CheckCircle2 className="w-4 h-4" />
            {successMsg}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Token Budgets */}
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-4 h-4 text-indigo-600" />
              Monthly Token Budgets (Input + Output)
            </CardTitle>
            <CardDescription>
              Define the default monthly generation limit for each plan level.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdateBudgets} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {Object.keys(config.token_budgets).map((plan) => (
                  <div key={plan} className="space-y-2">
                    <Label className="capitalize font-semibold text-gray-700">{plan}</Label>
                    <Input 
                      type="number" 
                      value={config.token_budgets[plan]} 
                      onChange={(e) => setConfig({
                        ...config,
                        token_budgets: { ...config.token_budgets, [plan]: parseInt(e.target.value) }
                      })}
                    />
                  </div>
                ))}
              </div>
              <div className="flex justify-end pt-4">
                <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700" disabled={saving}>
                  {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                  Save All Budgets
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Cost Rates */}
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-orange-600" />
              LLM Provider Cost Rates (per 1k tokens)
            </CardTitle>
            <CardDescription>
              Base USD cost used to calculate organization spend and platform margins.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdateRates} className="space-y-8">
              {Object.keys(config.cost_rates).map((provider) => (
                <div key={provider} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900">{provider}</h3>
                    <Badge variant="outline" className="text-[10px]">VERIFIED RATES</Badge>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-xs text-gray-500">Input (per 1k)</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">$</span>
                        <Input 
                          className="pl-6 font-mono text-sm"
                          value={config.cost_rates[provider].input_per_1k}
                          onChange={(e) => {
                            const newRates = { ...config.cost_rates };
                            newRates[provider].input_per_1k = e.target.value;
                            setConfig({ ...config, cost_rates: newRates });
                          }}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs text-gray-500">Output (per 1k)</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">$</span>
                        <Input 
                          className="pl-6 font-mono text-sm"
                          value={config.cost_rates[provider].output_per_1k}
                          onChange={(e) => {
                            const newRates = { ...config.cost_rates };
                            newRates[provider].output_per_1k = e.target.value;
                            setConfig({ ...config, cost_rates: newRates });
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  {provider !== Object.keys(config.cost_rates).slice(-1)[0] && <Separator className="mt-6" />}
                </div>
              ))}
              <div className="flex justify-end pt-4">
                <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700" disabled={saving}>
                  {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                  Save All Rates
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 flex gap-4">
          <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <div className="text-sm text-blue-900">
            <p className="font-bold mb-1">Automatic Margin Calculation</p>
            <p>Updating cost rates will immediately reflect in the platform's net margin calculations but will NOT retroactively change recorded costs for past generations.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
