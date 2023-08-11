// Auto-init Firebase Admin
import './firebase';
import { setGlobalOptions } from 'firebase-functions/v2';

setGlobalOptions({
  concurrency: 1000,
  region: 'asia-southeast1',
  maxInstances: 1,
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
