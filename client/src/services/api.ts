import axios, { AxiosError } from 'axios';
import type {
  ApiResponse,
  AuthResponse,
  Lead,
  CreateLeadPayload,
  UpdateLeadPayload,
  LeadFilters,
} from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'https://smart-leads-dashboard-7u9i.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('sl_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiResponse>) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('sl_token');
      localStorage.removeItem('sl_user');
      if (!window.location.pathname.startsWith('/login') &&
          !window.location.pathname.startsWith('/register')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError && error.response?.data) {
    const data = error.response.data;
    if (data.errors) {
      const firstField = Object.keys(data.errors)[0];
      return data.errors[firstField][0];
    }
    return data.message || 'Something went wrong';
  }
  return 'Network error. Please try again.';
};


export const authApi = {
  register: (data: { name: string; email: string; password: string; role?: string }) =>
    api.post<ApiResponse<AuthResponse>>('/auth/register', data),

  login: (data: { email: string; password: string }) =>
    api.post<ApiResponse<AuthResponse>>('/auth/login', data),

  getMe: () => api.get<ApiResponse<{ id: string; name: string; email: string; role: string }>>('/auth/me'),
};


export const leadsApi = {
  getAll: (filters: LeadFilters) => {
    const params = new URLSearchParams();
    params.set('page', String(filters.page));
    params.set('limit', '10');
    if (filters.status) params.set('status', filters.status);
    if (filters.source) params.set('source', filters.source);
    if (filters.search) params.set('search', filters.search);
    params.set('sortBy', filters.sortBy);

    return api.get<ApiResponse<Lead[]>>(`/leads?${params.toString()}`);
  },

  getById: (id: string) =>
    api.get<ApiResponse<Lead>>(`/leads/${id}`),

  create: (data: CreateLeadPayload) =>
    api.post<ApiResponse<Lead>>('/leads', data),

  update: (id: string, data: UpdateLeadPayload) =>
    api.put<ApiResponse<Lead>>(`/leads/${id}`, data),

  delete: (id: string) =>
    api.delete<ApiResponse>(`/leads/${id}`),

  exportCsv: (filters: Omit<LeadFilters, 'page'>) => {
    const params = new URLSearchParams();
    if (filters.status) params.set('status', filters.status);
    if (filters.source) params.set('source', filters.source);
    if (filters.search) params.set('search', filters.search);

    return api.get(`/leads/export/csv?${params.toString()}`, {
      responseType: 'blob',
    });
  },
};

export default api;
