export interface Category {
  id: string;
  name: string;
  type: 'EXPENSE' | 'INCOME';
  iconSlug: string;
  colorHex: string;
  keywords?: string | null;
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

export interface AiUsageStats {
  used: number;
  limit: number;
  remaining: number;
  aiEnabled: boolean;
}

// Admin Types
export interface AdminUser {
  id: string;
  email: string;
  fullName: string | null;
  role: 'CLIENT' | 'ADMIN';
  authProvider: string;
  aiEnabled: boolean;
  aiDailyLimit: number | null; // null = use default, -1 = unlimited
  createdAt: string;
  _count?: {
    transactions: number;
  };
}

export interface AppSettings {
  ai_daily_limit_default?: string;
  [key: string]: string | undefined;
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
  keywords?: string;
}

export interface UpdateCategoryInput {
  name?: string;
  type?: 'EXPENSE' | 'INCOME';
  iconSlug?: string;
  colorHex?: string;
  keywords?: string;
}

// Debts (Catatan Utang & Piutang)
export type DebtType = 'LENDING' | 'BORROWING';
export type DebtStatus = 'PENDING' | 'PAID';

export interface Debt {
  id: string;
  userId: string;
  type: DebtType;
  counterpartyName: string;
  amount: string;
  note: string | null;
  startDate: string;
  dueDate: string | null;
  status: DebtStatus;
  paidAt: string | null;
  createdTransactionId: string | null;
  settlementTransactionId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface DebtSummary {
  totalLendingPending: number;
  countLendingPending: number;
  totalBorrowingPending: number;
  countBorrowingPending: number;
}

export interface CreateDebtInput {
  type: DebtType;
  counterpartyName: string;
  amount: number;
  note?: string;
  startDate?: string;
  dueDate?: string;
  syncToTransaction?: boolean;
}

export interface UpdateDebtInput {
  counterpartyName?: string;
  amount?: number;
  note?: string | null;
  startDate?: string;
  dueDate?: string | null;
}

export interface DebtListParams {
  type?: DebtType;
  status?: DebtStatus;
  limit?: number;
  offset?: number;
}

// Business (Sistem Bisnis - ledger terpisah dari keuangan pribadi)
export type BusinessEntryKind = 'CAPITAL' | 'EXPENSE' | 'REVENUE';
export type BusinessStatus = 'PROFIT' | 'LOSS' | 'BREAK_EVEN';

export interface BusinessMetrics {
  totalModal: number;
  totalOmzet: number;
  totalBiaya: number;
  labaOperasional: number; // Omzet - Biaya (tidak termasuk Modal)
  posisiKas: number; // Modal + Omzet - Biaya
  status: BusinessStatus;
}

export interface Business {
  id: string;
  userId: string;
  name: string;
  iconSlug: string;
  colorHex: string;
  note: string | null;
  createdAt: string;
  updatedAt: string;
  metrics?: BusinessMetrics; // present on list + detail + create responses
}

export interface BusinessEntry {
  id: string;
  businessId: string;
  kind: BusinessEntryKind;
  amount: string; // Decimal serialized as string
  description: string | null;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBusinessInput {
  name: string;
  iconSlug?: string;
  colorHex?: string;
  note?: string;
}

export interface UpdateBusinessInput {
  name?: string;
  iconSlug?: string;
  colorHex?: string;
  note?: string | null;
}

export interface CreateBusinessEntryInput {
  kind: BusinessEntryKind;
  amount: number;
  description?: string;
  date?: string;
}

export interface UpdateBusinessEntryInput {
  kind?: BusinessEntryKind;
  amount?: number;
  description?: string | null;
  date?: string;
}

export interface BusinessEntryListParams {
  kind?: BusinessEntryKind;
  limit?: number;
  offset?: number;
}
