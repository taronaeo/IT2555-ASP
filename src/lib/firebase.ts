import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: 'AIzaSyBtzLeeCKjGOgeYUi4ah2_TCeHchseN1Zw',
  authDomain: 'it2555-asp.firebaseapp.com',
  projectId: 'it2555-asp',
  storageBucket: 'it2555-asp.appspot.com',
  messagingSenderId: '78163673650',
  appId: '1:78163673650:web:d9cc63cc52dbbd5a53322b',
  measurementId: 'G-PKLKMX0FSH',
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const firestore = getFirestore(app);
