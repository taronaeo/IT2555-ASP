import type { FormState } from '$lib/forms';

import { z } from 'zod';
import { writable } from 'svelte/store';
import { formatNumber, isValidPhoneNumber } from 'libphonenumber-js';

export const state = writable<FormState>({
  isLoading: false,
  errorMessage: '',
});

export const schema = z.object({
  vendorUen: z
    .string({ required_error: 'Please enter your business UEN' })
    .min(9, 'Are you sure that is your business UEN?')
    .max(10, 'Are you sure that is your business UEN?'),
  vendorName: z
    .string({ required_error: 'Please enter your business name ' })
    .min(3, 'Are you sure you have entered your business name correctly?')
    .max(30, 'Are you sure you have entered your business name correctly?'),
  vendorCategory: z.enum(
    ['F&B', 'Transportation', 'Entertainment', 'Shopping', 'Others'],
    { errorMap: () => ({ message: 'Please choose a business category' }) }
  ),
  vendorPhoneNumber: z
    .string({
      required_error: 'Please enter your business phone number',
    })
    .refine((phone) => isValidPhoneNumber(phone, 'SG'), {
      message: 'This phone number format is not recognised',
    })
    .transform((phone) => formatNumber(phone, 'SG', 'INTERNATIONAL')),
});
