import { imageSync } from "qr-image";


export const GET= async () => {
  const headers = {"Content-Type":"image/png"}
  const qr_png = imageSync('https://google.com');
  return new Response(qr_png, {headers})    
}