// Auto-init Firebase Admin
import './firebase';
import { setGlobalOptions } from 'firebase-functions/v2';

setGlobalOptions({
  concurrency: 1000,
  region: 'asia-southeast1',
  maxInstances: 1,
});

export * from './http/onHttpReceiptSubmit';
export * from './handlers/onBeforeUserCreated';
// export * from './callables/onOnboardingCallable';
