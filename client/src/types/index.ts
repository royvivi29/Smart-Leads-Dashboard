export const LeadStatus = {
  New: 'New',
  Contacted: 'Contacted',
  Qualified: 'Qualified',
  Lost: 'Lost',
} as const;
export type LeadStatus = typeof LeadStatus[keyof typeof LeadStatus];

export const LeadSource = {
  Website: 'Website',
  Instagram: 'Instagram',
  Referral: 'Referral',
} as const;
export type LeadSource = typeof LeadSource[keyof typeof LeadSource];

export const UserRole = {
  Admin: 'admin',
  Sales: 'sales',
} as const;
export type UserRole = typeof UserRole[keyof typeof UserRole];

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface Lead {
  _id: string;
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  pagination?: PaginationMeta;
  errors?: Record<string, string[]>;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LeadFilters {
  page: number;
  status: LeadStatus | '';
  source: LeadSource | '';
  search: string;
  sortBy: 'latest' | 'oldest';
}

export interface CreateLeadPayload {
  name: string;
  email: string;
  source: LeadSource;
  status?: LeadStatus;
}

export interface UpdateLeadPayload {
  name?: string;
  email?: string;
  source?: LeadSource;
  status?: LeadStatus;
}
