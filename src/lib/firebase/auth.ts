import { dev } from '$app/environment';
import { FirebaseError } from '@firebase/util';

import { auth } from '$lib/firebase';
import {
  AuthErrorCodes,
  signOut as _signOut,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  OAuthProvider,
  GoogleAuthProvider,
} from 'firebase/auth';

const ERROR_UNKNOWN = 'Something went wrong, please try again in a while';
const ERROR_RATE_LIMIT = "You're too fast, slow down and try again in a while";
const ERROR_EMAIL_EXISTS = 'Email already exists, please login instead';
const ERROR_INVALID_ACCOUNT = 'Invalid email or password, please try again';

async function signOut() {
  try {
    await _signOut(auth);
  } catch (error) {
    if (dev) console.error(error);
  }
}

async function signUpEmailPassword(email: string, password: string) {
  try {
    return await createUserWithEmailAndPassword(auth, email, password);
  } catch (error) {
    if (dev) console.error(error);
    if (!(error instanceof FirebaseError)) throw ERROR_UNKNOWN;

    switch (error.code) {
      case 'auth/error-code:-47':
        throw ERROR_RATE_LIMIT;
      case AuthErrorCodes.EMAIL_EXISTS:
        throw ERROR_EMAIL_EXISTS;
      default:
        throw ERROR_UNKNOWN;
    }
  }
}

async function signInEmailPassword(email: string, password: string) {
  try {
    return await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    if (dev) console.error(error);
    if (!(error instanceof FirebaseError)) throw ERROR_UNKNOWN;

    switch (error.code) {
      case 'auth/error-code:-47':
        throw ERROR_RATE_LIMIT;
      case AuthErrorCodes.USER_DELETED:
      case AuthErrorCodes.INVALID_PASSWORD:
        throw ERROR_INVALID_ACCOUNT;
      default:
        throw ERROR_UNKNOWN;
    }
  }
}

async function signInGoogleSSO() {
  const provider = new GoogleAuthProvider();
  provider.addScope('https://www.googleapis.com/auth/userinfo.email');
  provider.addScope('https://www.googleapis.com/auth/userinfo.profile');

  try {
    return await signInWithPopup(auth, provider);
  } catch (error) {
    if (dev) console.error(error);
    if (!(error instanceof FirebaseError)) throw ERROR_UNKNOWN;

    switch (error.code) {
      case 'auth/error-code:-47':
        throw ERROR_RATE_LIMIT;
      case AuthErrorCodes.POPUP_CLOSED_BY_USER:
        break;
      default:
        throw ERROR_UNKNOWN;
    }
  }
}

async function signInMicrosoftSSO() {
  const provider = new OAuthProvider('microsoft.com');
  provider.addScope('email');
  provider.addScope('profile');

  try {
    return await signInWithPopup(auth, provider);
  } catch (error) {
    if (dev) console.error(error);
    if (!(error instanceof FirebaseError)) throw ERROR_UNKNOWN;

    switch (error.code) {
      case 'auth/error-code:-47':
        throw ERROR_RATE_LIMIT;
      case AuthErrorCodes.POPUP_CLOSED_BY_USER:
        break;
      default:
        throw ERROR_UNKNOWN;
    }
  }
}

export { signInGoogleSSO, signInMicrosoftSSO };
export { signOut, signUpEmailPassword, signInEmailPassword };
