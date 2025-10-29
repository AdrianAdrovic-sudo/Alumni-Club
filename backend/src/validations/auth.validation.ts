import { z } from 'zod';

export const registerSchema = z.object({
  body: z
    .object({
      name: z.string().trim().min(2, 'Ime mora imati najmanje 2 slova.'),
      email: z
        .string()
        .trim()
        .toLowerCase()
        .email('Email nije validan.'),
      password: z
        .string()
        .min(8, 'Lozinka mora imati najmanje 8 karaktera.'),
    })
    .strict(),
});

export const loginSchema = z.object({
  body: z
    .object({
      email: z
        .string()
        .trim()
        .toLowerCase()
        .email('Email nije validan.'),
      password: z
        .string()
        .min(8, 'Lozinka mora imati najmanje 8 karaktera.'),
    })
    .strict(),
});
