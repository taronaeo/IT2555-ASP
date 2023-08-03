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

// Background Event Functions
export * from './events/onReceiptCreatedEvent';

// HTTP Functions
export * from './callables/onVendorOnboardingCallable';
// export * from './callables/onOnboardingCallable';
