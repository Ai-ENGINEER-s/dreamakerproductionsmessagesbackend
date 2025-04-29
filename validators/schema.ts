import { z } from 'zod';

export const contactSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  message: z.string().min(1),
});

export const newsletterSchema = z.object({
  email: z.string().email(),
});
