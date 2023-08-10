import { dev } from '$app/environment';
import { functions } from '$lib/firebase';
import { httpsCallable } from 'firebase/functions';

const callables = {
  onOnboardingCallable: '',
  onReceiptViewCallable: '',
  onVendorOnboardingCallable: '',
};

const endpoints = {
  onHttpReceiptSubmit: '',
};

export const getHttpsCallable = (
  endpoint: keyof typeof callables,
  preventReplayAttack = true
) =>
  httpsCallable(functions, endpoint, {
    timeout: 60000,
    limitedUseAppCheckTokens: preventReplayAttack,
  });

export const getHttpsEndpoint = (
  endpoint: keyof typeof endpoints,
  region = 'asia-southeast1'
) => {
  if (typeof endpoint === 'undefined' || !endpoint)
    throw new Error('Missing `endpoint` parameter');

  if (dev) return `http://127.0.0.1:5001/it2555-asp/${region}/${endpoint}`;
  return `https://${region}-it2555-asp.cloudfunctions.net/${endpoint.toLowerCase()}`;
};
