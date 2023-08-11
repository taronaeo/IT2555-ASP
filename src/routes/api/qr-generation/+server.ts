import { imageSync } from 'qr-image';
import type { RequestHandler } from './$types';

export const GET = (({ url }) => {
  const receiptId = url.searchParams.get('receiptId');
  const qrImage = imageSync(`https://it2555-asp.web.app/receipt/${receiptId}`);
  const qrImageBase64 = qrImage.toString('base64');

  return new Response(qrImageBase64);
}) satisfies RequestHandler;
