import type { FormState } from '$lib/forms';

import { z } from 'zod';
import { writable } from 'svelte/store';
import { createForm } from 'svelte-forms-lib';
import { formatNumber, isValidPhoneNumber } from 'libphonenumber-js';

import { validateZod } from '$lib/forms';
import { getHttpsCallable } from '$lib/firebase/functions';

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
  cardNumber: z.string({ required_error: 'Please enter your card number' }),
  cardExpMonth: z
    .string({ required_error: 'Please enter your card expiry month' })
    .min(1, 'Are you sure you have entered a valid expiry month?')
    .max(2, 'Are you sure you have entered a valid expiry month?')
    .transform(Number),
  cardExpYear: z
    .string({ required_error: 'Please enter your card expiry year' })
    .min(4, 'Are you sure you have entered a valid expiry year?')
    .max(4, 'Are you sure you have entered a valid expiry year?')
    .transform(Number),
  cardCvc: z
    .string({ required_error: 'Please enter your card cvc' })
    .min(3, 'Are you sure you have entered a valid card cvc?')
    .max(3, 'Are you sure you have entered a valid card cvc?'),
});

export const {
  form,
  errors,
  isValidating,
  isSubmitting,
  handleChange,
  handleSubmit,
} = createForm({
  initialValues: {
    vendorUen: '',
    vendorName: '',
    vendorCategory: '',
    vendorPhoneNumber: '',
    cardNumber: '',
    cardExpMonth: '',
    cardExpYear: '',
    cardCvc: '',
  },
  validate: (data) => validateZod(schema, data),
  onSubmit: (data) => {
    const transformed = schema.parse(data);
    const onboardCallable = getHttpsCallable('onVendorOnboardingCallable');

    return onboardCallable(transformed).catch((err) =>
      state.update((s) => ({ ...s, errorMessage: err }))
    );
  },
});
