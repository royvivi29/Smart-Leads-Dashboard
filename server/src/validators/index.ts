import { z } from 'zod';
import { LeadStatus, LeadSource, UserRole } from '../types';


export const registerSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must not exceed 50 characters')
    .trim(),
  email: z.string().email('Please provide a valid email').toLowerCase().trim(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.nativeEnum(UserRole).optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Please provide a valid email').toLowerCase().trim(),
  password: z.string().min(1, 'Password is required'),
});


export const createLeadSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters')
    .trim(),
  email: z.string().email('Please provide a valid email').toLowerCase().trim(),
  status: z.nativeEnum(LeadStatus).optional(),
  source: z.nativeEnum(LeadSource, {
    errorMap: () => ({ message: 'Source must be Website, Instagram, or Referral' }),
  }),
});

export const updateLeadSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters')
    .trim()
    .optional(),
  email: z.string().email('Please provide a valid email').toLowerCase().trim().optional(),
  status: z.nativeEnum(LeadStatus).optional(),
  source: z.nativeEnum(LeadSource).optional(),
});


export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CreateLeadInput = z.infer<typeof createLeadSchema>;
export type UpdateLeadInput = z.infer<typeof updateLeadSchema>;
