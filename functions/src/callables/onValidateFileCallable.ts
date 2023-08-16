import { onCall, HttpsError } from 'firebase-functions/v2/https';
import * as logger from 'firebase-functions/logger';

export const validateFileCallable = onCall(async ({ auth, data }) => {
  try {
    // Validate if the user is authenticated
    if (!auth) {
      logger.error(
        'onValidateFileCallable:HttpsError',
        'failed-precondition',
        'Function must be called while authenticated'
      );
      throw new HttpsError(
        'failed-precondition',
        'Function must be called while authenticated'
      );
    }

    const { fileName } = data;

    if (!fileName) {
      logger.error('File Name is missing');
      throw new HttpsError('invalid-argument', 'File Name is required.');
    }
    const fileExtension = fileName.split('.').pop().trim();
    logger.log(fileExtension);
    // Check if the file extension is either jpg or pdf
    if (fileExtension !== 'jpg' && fileExtension !== 'pdf') {
      logger.error(
        'Invalid file format. Only',
        '.jpg and .pdf files are allowed.'
      );
      throw new HttpsError(
        'invalid-argument',
        'Only .jpg and .pdf files are allowed.'
      );
    }

    return { valid: true };
  } catch (error) {
    // Log any unhandled errors
    logger.error('An error occurred:', error);
    throw error;
  }
});
