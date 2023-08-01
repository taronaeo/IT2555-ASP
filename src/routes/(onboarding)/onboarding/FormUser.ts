import type { FormState } from '$lib/forms';

import { z } from 'zod';
import { writable } from 'svelte/store';
import { createForm } from 'svelte-forms-lib';
import { formatNumber, isValidPhoneNumber } from 'libphonenumber-js';

import { validateZod } from '$lib/forms';

const schema = z.object({
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

export const state = writable<FormState>({
  isLoading: false,
  errorMessage: '',
});

export const {
  form,
  errors,
  updateField,
  isValidating,
  isSubmitting,
  handleChange,
  handleSubmit,
} = createForm({
  initialValues: {
    displayName: '',
    phoneNumber: '',
  },
  validate: (data) => validateZod(schema, data),
  onSubmit: (data) => {
    const result = schema.parse(data);
    console.log(result);
  },
});
