import type { AuthProvider, UserCredential } from 'firebase/auth';

import { dev } from '$app/environment';
import { FirebaseError } from '@firebase/util';

import { AuthTenant, AuthErrorMessage } from '$lib/constants';

import { auth } from '$lib/firebase';
import {
  AuthErrorCodes,
  signOut as _signOut,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  OAuthProvider,
  GoogleAuthProvider,
} from 'firebase/auth';

type TenantId = AuthTenant | null;

const providerGoogle = new GoogleAuthProvider();
providerGoogle.addScope('https://www.googleapis.com/auth/userinfo.email');
providerGoogle.addScope('https://www.googleapis.com/auth/userinfo.profile');

const providerMicrosoft = new OAuthProvider('microsoft.com');
providerMicrosoft.addScope('email');
providerMicrosoft.addScope('profile');

function signOut() {
  return _signOut(auth);
}

function continueProvider(provider: AuthProvider) {
  return signInWithPopup(auth, provider);
}

function signUpEmailPassword(email: string, password: string) {
  return createUserWithEmailAndPassword(auth, email, password);
}

function signInEmailPassword(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password);
}

function emailPasswordReset(email: string) {
  return sendPasswordResetEmail(auth, email);
}

function confirmPasswordReset() {
  throw new Error('NOT_IMPLEMENTED');
}

async function continueAuth(
  cb: () => Promise<UserCredential | void>,
  tenantId: TenantId = null
) {
  try {
    auth.tenantId = tenantId;
    await cb();
  } catch (error: unknown) {
    if (dev) console.error(error);
    if (!(error instanceof FirebaseError)) throw AuthErrorMessage.UNKNOWN;

    switch (error.code) {
      case 'auth/error-code:-47':
        throw AuthErrorMessage.RATE_LIMIT;
      case AuthErrorCodes.EMAIL_EXISTS:
        throw AuthErrorMessage.EMAIL_EXISTS;
      case AuthErrorCodes.USER_DELETED:
      case AuthErrorCodes.INVALID_PASSWORD:
        throw AuthErrorMessage.INVALID_ACCOUNT;
      case AuthErrorCodes.POPUP_CLOSED_BY_USER:
        break;
      default:
        throw AuthErrorMessage.UNKNOWN;
    }
  }
}

export { continueAuth };
export { providerGoogle, providerMicrosoft };
export { signOut, continueProvider, signUpEmailPassword, signInEmailPassword };
export { emailPasswordReset, confirmPasswordReset };
