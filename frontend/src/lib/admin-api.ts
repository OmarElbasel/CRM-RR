const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface AdminFetchOptions extends RequestInit {
  token?: string;
}

async function adminFetch(endpoint: string, options: AdminFetchOptions = {}) {
  const { token, ...fetchOptions } = options;

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
