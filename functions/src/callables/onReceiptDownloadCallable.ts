import * as logger from 'firebase-functions/logger';

import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { firestore } from '../firebase';
import { getStorage } from 'firebase-admin/storage';
import * as dayjs from 'dayjs';
import * as Handlebars from 'handlebars';
import puppeteer from 'puppeteer';

import type { Receipt } from '../models';

export const onReceiptDownloadCallable = onCall(async ({ auth, data }) => {
  if (!auth) {
    logger.error(
      'onReceiptViewCallable:HttpsError',
      'failed-precondition',
      'Function must be called while authenticated.'
    );

    throw new HttpsError(
      'failed-precondition',
      'Function must be called while authenticated'
    );
  }

  const userUid = auth.uid;
  const receiptId = data;
  const receiptRef = firestore.doc(`receipts/${receiptId}`);
  const receiptSnap = await receiptRef.get();
  if (!receiptSnap.exists) {
    logger.error('Data requested does not exist');
    throw new HttpsError('not-found', 'Data requested does not exist');
  }
  const receiptData = receiptSnap.data() as Receipt;
  const receiptUserUid = receiptData.userUid;
  if (!receiptUserUid || userUid !== receiptUserUid) {
    logger.error('Data access denied');
    throw new HttpsError('permission-denied', 'No Access to Requested Data');
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const createdAtMilis = receiptData.createdAt.toMillis();
  const date = dayjs(createdAtMilis).format('YYYY/MM/DD');
  const time = dayjs(createdAtMilis).format('hh:mm');

  const receipt = {
    receiptId: receiptData.receiptId,
    userUid: receiptData.userUid,
    vendor: receiptData.vendor,
    items: receiptData.items,
    subtotal: receiptData.subtotal,
    total: receiptData.total,
    gst: receiptData.gst,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    date: date,
    time: time,
    paymentMethod: receiptData.paymentMethod,
    change: receiptData.change,
  };
  const src = `
  <style>
          .receipt-border{
              width: 100%;
              padding-top: 80px
          }
          body{
              font-family: monospace;
              width:360px;
              margin: 0 auto;
              display:flex;
              justify-content: center;
              align-items: center;
          }
          .receipt-header{
              text-align: center;
          }
          hr#hr-top{
              border-style: dashed;
              margin-bottom: 40px;
              margin-left:44px;
              margin-right:44px;
          }
          hr#hr-bottom{
              border-style: dashed;
              margin-top: 40px;
              margin-bottom:40px;
              margin-left:44px;
              margin-right:44px;
          }

          .receipt-grid{
              margin-top: 60px;
              display: grid;
              grid-template-columns: repeat(6, minmax(0, 1fr));
          }
          
          .item-grid{
              display:grid;
              grid-template-columns: repeat(6, minmax(0, 1fr));
              grid-column: span 6 / span 6;
              margin-bottom: 16px;
          }
          .item-name{
              grid-column: span 4 / span 4;
          }
          .item-price{
              grid-column: span 2 / span 2;
              text-align: right;
          }
          .footer-hr{
              border-style: dashed;
              margin-top: 44px;
              margin-bottom: 16px;
              margin-left:44px;
              margin-right:44px;
          }
          .footer-grid{
              display:grid;
              grid-template-columns: repeat(6, minmax(0, 1fr));
          }
          .footer-info{
              grid-column: span 2 / span 2;
              margin-bottom: 4px;
          }
          .footer-value{
              grid-column: span 4 / span 4;
              text-align: right;
              margin-bottom: 4px;
          }
          .footer-hr-bottom{
              border-style: dashed;
              margin-top: 16px;
              margin-left:44px;
              margin-right:44px;
              margin-bottom: 12px;
          }
          .date-flex{
              display:flex;
              justify-content: center
          }
          .date{
              margin-right:20px;
          }
          .time{
              margin-left:20px;
          }

      </style>
      
      <body>
          <div class="receipt-border">
              <div class="receipt-header">
                  <hr id="hr-top"/>
                  {{#vendor}}
                  <div class="receipt-header-info">
                      <div id="vendorName">{{vendorName}}</div>
                      <div id="vendorLocation">{{vendorLocation}}</div>
                      <div id="postalCode">Singapore {{postalCode}}</div>
                  </div>
                  {{/vendor}}
                  <hr id="hr-bottom"/>
              </div>


              <div class="receipt-grid">
                  {{#each items}}
                  <div class="item-grid">
                      <div class="item-name">{{itemName}}</div>
                      <div class="item-price">{{price}}</div>
                  </div>
                  {{/each}}
              </div>

              <hr class="footer-hr">

              <div class="footer-grid">
                  <div class="footer-info">Subtotal</div>
                  <div class="footer-value">{{subtotal}}</div>

                  <div class="footer-info">GST</div>
                  <div class="footer-value">{{gst}}</div>

                  <div class="footer-info">Total</div>
                  <div class="footer-value">{{total}}</div>

                  <div class="footer-info">{{paymentMethod}}</div>
                  <div class="footer-value">{{total}}</div>

                  <div class="footer-info">Change</div>
                  <div class="footer-value">{{change}}</div>

                  <div class="footer-info">Receipt ID</div>
                  <div class="footer-value">{{receiptId}}</div>

              </div>
              <hr class="footer-hr-bottom"/>
              <div class="date-flex">
                  <div class="date">{{date}}</div>
                  <div class="time">{{time}}</div>
              </div>
          </div>
      </body>`;
  const template = Handlebars.compile(src);
  const receiptHTML = template(receipt);

  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.setContent(receiptHTML, { waitUntil: 'networkidle0' });
    const pdf = await page.pdf({ format: 'A5' });

    await browser.close();

    const outputBucketName = 'it2555-asp.appspot.com';
    const outputBucket = getStorage().bucket(outputBucketName);
    const receiptPdfFile = outputBucket.file(`ReceiptPDFs/${receiptId}.pdf`);
    await receiptPdfFile.save(pdf);
  } catch (err) {
    logger.error('Unknown Error Occurred');
    throw new HttpsError('internal', 'An internal error has occurred');
  }
});
