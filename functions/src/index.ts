// Auto-init Firebase Admin
import './firebase';
import { setGlobalOptions } from 'firebase-functions/v2';

setGlobalOptions({
  maxInstances: 1,
  concurrency: 1000,
  region: 'asia-southeast1',
  secrets: [
    'STRIPE_SECRET',
    'GMAIL_EMAIL',
    'GMAIL_CLIENTSECRET',
    'GMAIL_CLIENTID',
    'GMAIL_REFRESHTOKEN',
  ],
  enforceAppCheck: true,
});

// Auth Blocking Functions
export * from './handlers/onBeforeUserCreated';
// export * from './callables/onOnboardingCallable';

export * from './handlers/onDisputeCreated';
// export * from './handlers/onDisputeCreated';

// export * from './callables/settingsValidationCallable';
// export * from './callables/settingsValidationCallable';

// Background Event Functions
export * from './events/onReceiptCreatedEvent';

// HTTP Functions
export * from './http/onHttpReceiptSubmit';
export * from './callables/onVendorOnboardingCallable';
export * from './callables/onReceiptViewCallable';
export * from './callables/onValidateFileCallable';
export * from './callables/vendorStripeDetailsCallable';
export * from './callables/onManualReceiptSubmitCallable';
export * from './callables/onReceiptDownloadCallable';
