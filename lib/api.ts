import { supabase } from './supabase';
import type { 
  Category, 
  Transaction, 
  TransactionStats, 
  ApiResponse, 
  PaginatedResponse,
  AiParseResult,
  AnalyticsData,
  InsightResponse,
  TransactionListParams,
  UserProfile,
  AdminUser,
  AdminUserListParams,
  CreateAdminInput,
  CreateCategoryInput,
  UpdateCategoryInput
} from '../types/api';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

async function getAuthHeaders(): Promise<HeadersInit> {
  const { data: { session } } = await supabase.auth.getSession();
  return {
    'Content-Type': 'application/json',
    ...(session?.access_token && { Authorization: `Bearer ${session.access_token}` })
  };
}

async function fetchApi<T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const headers = await getAuthHeaders();
  
  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: { ...headers, ...options.headers }
  });
  
  const data = await res.json();
  
  if (!res.ok) {
    throw new Error(data.error?.message || 'API request failed');
  }
  
  return data;
}

export const api = {
  categories: {
    list: () => fetchApi<Category[]>('/api/categories')
  },
  
  transactions: {
    list: (params?: TransactionListParams) => {
      const searchParams = new URLSearchParams();
      if (params?.month) searchParams.set('month', params.month);
      if (params?.categoryId) searchParams.set('categoryId', params.categoryId);
      if (params?.search) searchParams.set('search', params.search);
      if (params?.startDate) searchParams.set('startDate', params.startDate);
      if (params?.endDate) searchParams.set('endDate', params.endDate);
      if (params?.sortBy) searchParams.set('sortBy', params.sortBy);
      if (params?.sortOrder) searchParams.set('sortOrder', params.sortOrder);
      if (params?.limit) searchParams.set('limit', params.limit.toString());
      if (params?.offset) searchParams.set('offset', params.offset.toString());
      
      const query = searchParams.toString();
      return fetchApi<Transaction[]>(`/api/transactions${query ? `?${query}` : ''}`) as Promise<PaginatedResponse<Transaction>>;
    },
    
    create: (data: {
      categoryId?: string;
      amount: number;
      description?: string;
      date?: string;
    }) => fetchApi<Transaction>('/api/transactions', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    
    update: (id: string, data: {
      categoryId?: string;
      amount?: number;
      description?: string;
      date?: string;
    }) => fetchApi<Transaction>(`/api/transactions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
    
    delete: (id: string) => fetchApi<{ message: string }>(`/api/transactions/${id}`, {
      method: 'DELETE'
    }),
    
    stats: (month?: string) => {
      const query = month ? `?month=${month}` : '';
      return fetchApi<TransactionStats>(`/api/transactions/stats${query}`);
    },
    
    parseWithAi: (input: string) => fetchApi<AiParseResult>('/api/transactions/ai', {
      method: 'POST',
      body: JSON.stringify({ input })
    })
  },
  
  analytics: {
    get: (month?: string) => {
      const query = month ? `?month=${month}` : '';
      return fetchApi<AnalyticsData>(`/api/transactions/analytics${query}`);
    },
    
    getInsight: (month?: string) => fetchApi<InsightResponse>('/api/transactions/insight', {
      method: 'POST',
      body: JSON.stringify({ month })
    })
  },
  
  users: {
    getProfile: () => fetchApi<UserProfile>('/api/users/profile'),
    
    updateProfile: (data: { fullName?: string }) => 
      fetchApi<UserProfile>('/api/users/profile', {
        method: 'PUT',
        body: JSON.stringify(data)
      })
  },

  admin: {
    users: {
      list: (params?: AdminUserListParams) => {
        const searchParams = new URLSearchParams();
        if (params?.search) searchParams.set('search', params.search);
        if (params?.role) searchParams.set('role', params.role);
        if (params?.page) searchParams.set('page', params.page.toString());
        if (params?.limit) searchParams.set('limit', params.limit.toString());
        
        const query = searchParams.toString();
        return fetchApi<AdminUser[]>(`/api/admin/users${query ? `?${query}` : ''}`) as Promise<PaginatedResponse<AdminUser>>;
      },
      
      create: (data: CreateAdminInput) => 
        fetchApi<AdminUser>('/api/admin/users', {
          method: 'POST',
          body: JSON.stringify(data)
        }),
      
      delete: (id: string) => 
        fetchApi<{ message: string }>(`/api/admin/users/${id}`, {
          method: 'DELETE'
        })
    },
    
    categories: {
      create: (data: CreateCategoryInput) =>
        fetchApi<Category>('/api/admin/categories', {
          method: 'POST',
          body: JSON.stringify(data)
        }),
      
      update: (id: string, data: UpdateCategoryInput) =>
        fetchApi<Category>(`/api/admin/categories/${id}`, {
          method: 'PUT',
          body: JSON.stringify(data)
        }),
      
      delete: (id: string) =>
        fetchApi<{ message: string; orphanedTransactions: number }>(`/api/admin/categories/${id}`, {
          method: 'DELETE'
        })
    }
  }
};
