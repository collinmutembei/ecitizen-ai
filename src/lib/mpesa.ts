import axios from 'axios';
import { prisma } from './db';

interface MPesaTokenResponse {
  access_token: string;
  expires_in: string;
}

interface STKPushResponse {
  MerchantRequestID: string;
  CheckoutRequestID: string;
  ResponseCode: string;
  ResponseDescription: string;
  CustomerMessage: string;
}

export class MPesaService {
  private baseUrl = 'https://sandbox.safaricom.co.ke'; // Use production URL for live
  private consumerKey = process.env.MPESA_CONSUMER_KEY!;
  private consumerSecret = process.env.MPESA_CONSUMER_SECRET!;
  private passkey = process.env.MPESA_PASSKEY!;
  private shortcode = process.env.MPESA_SHORTCODE!;

  private async getAccessToken(): Promise<string> {
    const auth = Buffer.from(`${this.consumerKey}:${this.consumerSecret}`).toString('base64');
    
    try {
      const response = await axios.get<MPesaTokenResponse>(
        `${this.baseUrl}/oauth/v1/generate?grant_type=client_credentials`,
        {
          headers: {
            Authorization: `Basic ${auth}`,
          },
        }
      );
      
      return response.data.access_token;
    } catch (error) {
      console.error('Error getting M-Pesa access token:', error);
      throw new Error('Failed to get M-Pesa access token');
    }
  }

  async initiateSTKPush(phoneNumber: string, amount: number, userId: string, credits: number): Promise<string> {
    const accessToken = await this.getAccessToken();
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
    const password = Buffer.from(`${this.shortcode}${this.passkey}${timestamp}`).toString('base64');

    const stkPushData = {
      BusinessShortCode: this.shortcode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: amount,
      PartyA: phoneNumber,
      PartyB: this.shortcode,
      PhoneNumber: phoneNumber,
      CallBackURL: `${process.env.NEXTAUTH_URL}/api/payments/callback`,
      AccountReference: `Credits-${userId}`,
      TransactionDesc: `Purchase ${credits} credits`,
    };

    try {
      const response = await axios.post<STKPushResponse>(
        `${this.baseUrl}/mpesa/stkpush/v1/processrequest`,
        stkPushData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      // Store payment record
      await prisma.payment.create({
        data: {
          userId,
          amount,
          credits,
          mpesaCheckoutId: response.data.CheckoutRequestID,
          phoneNumber,
          status: 'PENDING',
        },
      });

      return response.data.CheckoutRequestID;
    } catch (error) {
      console.error('Error initiating STK push:', error);
      throw new Error('Failed to initiate payment');
    }
  }

  async handleCallback(callbackData: any): Promise<void> {
    const { Body } = callbackData;
    const { stkCallback } = Body;
    
    const payment = await prisma.payment.findUnique({
      where: { mpesaCheckoutId: stkCallback.CheckoutRequestID },
      include: { user: true },
    });

    if (!payment) {
      console.error('Payment not found for checkout request:', stkCallback.CheckoutRequestID);
      return;
    }

    if (stkCallback.ResultCode === 0) {
      // Payment successful
      const receiptNumber = stkCallback.CallbackMetadata?.Item.find(
        (item: any) => item.Name === 'MpesaReceiptNumber'
      )?.Value;

      await prisma.$transaction([
        prisma.payment.update({
          where: { id: payment.id },
          data: {
            status: 'COMPLETED',
            mpesaReceiptId: receiptNumber,
          },
        }),
        prisma.user.update({
          where: { id: payment.userId },
          data: {
            credits: payment.user.credits + payment.credits,
            isSubscribed: true,
          },
        }),
      ]);
    } else {
      // Payment failed
      await prisma.payment.update({
        where: { id: payment.id },
        data: { status: 'FAILED' },
      });
    }
  }
}

export const mpesaService = new MPesaService();
