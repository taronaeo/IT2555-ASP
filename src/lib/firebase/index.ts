import { dev } from '$app/environment';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getStorage, connectStorageEmulator } from 'firebase/storage';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';

import { getApp, getApps, initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: 'AIzaSyBtzLeeCKjGOgeYUi4ah2_TCeHchseN1Zw',
  authDomain: 'it2555-asp.firebaseapp.com',
  projectId: 'it2555-asp',
  storageBucket: 'it2555-asp.appspot.com',
  messagingSenderId: '78163673650',
  appId: '1:78163673650:web:d9cc63cc52dbbd5a53322b',
  measurementId: 'G-PKLKMX0FSH',
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const storage = getStorage(app);
export const firestore = getFirestore(app);
export const functions = getFunctions(app, 'asia-southeast1');

if (dev) {
  console.warn(`
    !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    ! DEVELOPMENT MODE DETECTED.          !
    ! IF YOU'RE BUILDING FOR PRODUCTION,  !
    ! THIS SHOULD BE A WARNING!           !
    !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  `);

  connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
  connectStorageEmulator(storage, '127.0.0.1', 9199);
  connectFirestoreEmulator(firestore, '127.0.0.1', 8080);
  connectFunctionsEmulator(functions, '127.0.0.1', 5001);
}
