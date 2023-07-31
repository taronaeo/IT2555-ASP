import { z } from 'zod';

const schemaReset = z.object({
  email: z.string().email({ message: 'Please enter your email' }),
});

const schemaLogin = z.object({
  email: z.string().email({ message: 'Please enter your email' }),
  password: z.string().min(1, 'Please enter your password'),
});

const schemaRegister = z
  .object({
    email: z.string().email({ message: 'Email address is required' }),
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

const schemaVendorSignUp = z
  .object({
    email: z
      .string({ required_error: 'Business email is required' })
      .email({ message: 'Business email is required' }),
    password: z
      .string({ required_error: 'Password is required' })
      .min(6, 'Password too short, minimum 6 characters')
      .max(30, 'Password too long, maximum 30 characters'),
    passwordConfirm: z
      .string({ required_error: 'Password confirm is required' })
      .min(6, 'Password too short, minimum 6 characters')
      .max(30, 'Password too long, maximum 30 characters'),
    agreeToService: z.boolean({ coerce: true }),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    path: ['passwordConfirm'],
    message: 'Passwords do not match',
  })
  .refine((data) => data.agreeToService, {
    path: ['agreeToService'],
    message: 'Please accept before continuing',
  });

export { schemaReset, schemaLogin, schemaRegister, schemaVendorSignUp };
