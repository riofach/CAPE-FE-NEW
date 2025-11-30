export interface Category {
  id: string;
  name: string;
  type: 'EXPENSE' | 'INCOME';
  iconSlug: string;
  colorHex: string;
  isGlobal: boolean;
}

export interface Transaction {
  id: string;
  userId: string;
  categoryId: string | null;
  amount: string;
  description: string | null;
  date: string;
  isAiGenerated: boolean;
  aiConfidence: number | null;
  createdAt: string;
  category: Category | null;
}

export interface TransactionStats {
  month: string;
  totalExpense: number;
  totalIncome: number;
  byCategory: Array<{
    category: Pick<Category, 'id' | 'name' | 'iconSlug' | 'colorHex'> | null;
    total: number;
    count: number;
  }>;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface AiParseResult {
  transaction: Transaction;
  parsed: {
    original: string;
    detected: {
      description: string;
      amount: number;
      categoryName: string;
      confidence: number;
      date?: string;
    };
  };
}

export interface AnalyticsData {
  month: string;
  totalExpense: number;
  prevMonthExpense: number;
  percentChange: number;
  transactionCount: number;
  topCategories: Array<{
    category: Pick<Category, 'id' | 'name' | 'colorHex' | 'iconSlug'> | null;
    total: number;
    percentage: number;
  }>;
}

export interface InsightResponse {
  insight: string;
  month?: string;
}

export interface TransactionListParams {
  month?: string;
  categoryId?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: 'date' | 'amount';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

export interface UserProfile {
  id: string;
  email: string;
  fullName: string | null;
  role: 'CLIENT' | 'ADMIN';
  authProvider: string;
  createdAt: string;
}

// Admin Types
export interface AdminUser {
  id: string;
  email: string;
  fullName: string | null;
  role: 'CLIENT' | 'ADMIN';
  authProvider: string;
  createdAt: string;
  _count?: {
    transactions: number;
  };
}

export interface AdminUserListParams {
  search?: string;
  role?: 'CLIENT' | 'ADMIN';
  page?: number;
  limit?: number;
}

export interface CreateAdminInput {
  email: string;
  password: string;
  fullName: string;
}

export interface CreateCategoryInput {
  name: string;
  type: 'EXPENSE' | 'INCOME';
  iconSlug?: string;
  colorHex?: string;
}

export interface UpdateCategoryInput {
  name?: string;
  type?: 'EXPENSE' | 'INCOME';
  iconSlug?: string;
  colorHex?: string;
}
