import { onCall, HttpsError } from 'firebase-functions/v2/https';

export const settingsValidationCall = onCall(async ({ auth, data }) => {
  // Validate if the user is authenticated
  if (!auth) {
    console.error(
      'settingsValidationCall:HttpsError',
      'failed-precondition',
      'Function must be called while authenticated'
    );
  }

  // Validate the display name
  if (!data.displayName || data.displayName.trim().length < 1) {
    throw new HttpsError('invalid-argument', 'Display name cannot be empty.');
  }

  // Validate the email
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email || !emailPattern.test(data.email)) {
    throw new HttpsError(
      'invalid-argument',
      'Please enter a valid email address.'
    );
  }

  // Validate the phone number
  const phonePattern = /^[89]\d{7}$/;
  if (!data.phoneNumber || !phonePattern.test(data.phoneNumber)) {
    throw new HttpsError(
      'invalid-argument',
      'Please enter a valid Singapore phone number starting with 8 or 9.'
    );
  }
});
