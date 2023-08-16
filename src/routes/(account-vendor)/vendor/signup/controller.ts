import type { AuthProvider } from 'firebase/auth';
import { validateZod, type FormState } from '$lib/forms';

import { writable } from 'svelte/store';
import { createForm } from 'svelte-forms-lib';

import { AuthTenant } from '$lib/constants';
import { schemaVendorSignUp } from '$lib/forms';
import {
  continueAuth,
  continueProvider,
  signUpEmailPassword,
} from '$lib/firebase/auth';

export const state = writable<FormState>({
  isLoading: false,
  errorMessage: '',
});

export const onSSO = (provider: AuthProvider) => async () => {
  await continueAuth(
    () => continueProvider(provider),
    state,
    AuthTenant.VENDOR
  );
};

export const onSubmit = async (email: string, password: string) => {
  await continueAuth(
    () => signUpEmailPassword(email, password),
    state,
    AuthTenant.VENDOR
  );
};

export const {
  form,
  errors,
  isValidating,
  isSubmitting,
  handleChange,
  handleSubmit,
} = createForm({
  initialValues: {
    email: '',
    password: '',
    passwordConfirm: '',
    agreeToService: false,
  },
  validate: (data) => validateZod(schemaVendorSignUp, data),
  onSubmit: async ({ email, password }) => onSubmit(email, password),
});
