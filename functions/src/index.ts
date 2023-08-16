// Auto-init Firebase Admin
import './firebase';
import { setGlobalOptions } from 'firebase-functions/v2';

setGlobalOptions({
  maxInstances: 1,
  concurrency: 1000,
  region: 'asia-southeast1',
  secrets: ['STRIPE_SECRET'],
  enforceAppCheck: true,
});

// Auth Blocking Functions
export * from './handlers/onBeforeUserCreated';

// Background Event Functions
export * from './events/onReceiptCreatedEvent';

// HTTP Functions
export * from './http/onHttpReceiptSubmit';
export * from './callables/onVendorOnboardingCallable';
export * from './callables/onReceiptViewCallable';
export * from './callables/onReceiptDownloadCallable';
export * from './callables/onManualReceiptSubmitCallable';
export * from './callables/vendorStripeDetailsCallable';
