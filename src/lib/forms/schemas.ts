import { z } from 'zod';

const schemaLogin = z.object({
  email: z.string().email({ message: 'Please enter your email' }),
  password: z.string().min(1, 'Please enter your password'),
});

const schemaRegister = z
  .object({
    email: z.string().email({ message: 'Please enter your email' }),
    password: z
      .string()
      .min(6, 'Password too short, minimum 6 characters')
      .max(30, 'Password too long, maximum 30 characters'),
    confirmPassword: z
      .string()
      .min(6, 'Password too short, minimum 6 characters')
      .max(30, 'Password too long, maximum 30 characters'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['password_confirm'],
    message: 'Passwords do not match',
  });

export { schemaLogin, schemaRegister };
