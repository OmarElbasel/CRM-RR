import { getClerkToken } from "./clerk-utils"; // Need to check if this exists or implementation

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function adminFetch(endpoint: string, options: RequestInit = {}) {
  // We need the Clerk token for admin auth
  // In a real app we might use a custom hook, 
  // but for simplicity in this helper we'll expect the token to be passed 
  // or we'll assume this is used in a Client Component where we can't easily get it without hooks.
  // Actually, let's make these functions accept the token as the first argument.

  const { token, ...fetchOptions } = options as any;

  const response = await fetch(`${API_URL}/api/admin${endpoint}`, {
    ...fetchOptions,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...fetchOptions.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Admin API error: ${response.status}`);
  }

  return response.json();
}

export const adminApi = {
  getOverview: (token: string) => adminFetch("/overview/", { token }),
  
  getOrgs: (token: string, params: Record<string, any> = {}) => {
    const query = new URLSearchParams(params).toString();
    return adminFetch(`/orgs/?${query}`, { token });
  },
  
  getOrgDetail: (token: string, id: number) => adminFetch(`/orgs/${id}/`, { token }),
  
  updateOrgPlan: (token: string, id: number, plan: string) => 
    adminFetch(`/orgs/${id}/plan/`, { 
      token, 
      method: "PATCH", 
      body: JSON.stringify({ plan }) 
    }),
    
  resetOrgUsage: (token: string, id: number) => 
    adminFetch(`/orgs/${id}/reset-usage/`, { token, method: "POST" }),
    
  toggleOrgStatus: (token: string, id: number, isActive: boolean) => 
    adminFetch(`/orgs/${id}/suspend/`, { 
      token, 
      method: "PATCH", 
      body: JSON.stringify({ is_active: isActive }) 
    }),
    
  rotateOrgKeys: (token: string, id: number) => 
    adminFetch(`/orgs/${id}/rotate-keys/`, { token, method: "POST" }),
    
  extendOrgLimit: (token: string, id: number) => 
    adminFetch(`/orgs/${id}/extend-limit/`, { token, method: "POST" }),
    
  getAIUsage: (token: string, params: Record<string, any> = {}) => {
    const query = new URLSearchParams(params).toString();
    return adminFetch(`/ai-usage/?${query}`, { token });
  },
  
  getConfig: (token: string) => adminFetch("/config/", { token }),
  
  updateTokenBudgets: (token: string, budgets: Record<string, number>) => 
    adminFetch("/config/token-budgets/", { 
      token, 
      method: "PATCH", 
      body: JSON.stringify(budgets) 
    }),
    
  updateCostRates: (token: string, rates: Record<string, any>) => 
    adminFetch("/config/cost-rates/", { 
      token, 
      method: "PATCH", 
      body: JSON.stringify(rates) 
    }),
    
  getRateLimits: (token: string) => adminFetch("/rate-limits/", { token }),

  getPlatformCredentials: (token: string) =>
    adminFetch("/platform-credentials/", { token }),

  savePlatformCredential: (token: string, provider: string, data: Record<string, string>) =>
    adminFetch(`/platform-credentials/${provider}/`, {
      token,
      method: "PUT",
      body: JSON.stringify(data),
    }),

  clearPlatformCredential: (token: string, provider: string) =>
    adminFetch(`/platform-credentials/${provider}/`, {
      token,
      method: "DELETE",
    }),
};
