import type { FormState } from '$lib/forms';

import { z } from 'zod';
import { writable } from 'svelte/store';
import { formatNumber, isValidPhoneNumber } from 'libphonenumber-js';

export const state = writable<FormState>({
  isLoading: false,
  errorMessage: '',
});

export const schema = z.object({
  displayName: z
    .string({ required_error: 'Please enter your name' })
    .min(3, 'Are you sure you have entered your name correctly?')
    .max(30, 'Are you sure you have entered your name correctly?'),
  phoneNumber: z
    .string({
      required_error: 'Please enter your phone number',
      invalid_type_error: 'Please enter your phone number',
    })
    .refine((phone) => isValidPhoneNumber(phone, 'SG'), {
      message: 'This phone number format is not recognised',
    })
    .transform((phone) => formatNumber(phone, 'SG', 'INTERNATIONAL')),
});
