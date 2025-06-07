import type { User as DBUser } from '@prisma/client';
import type { User as PrismaUser } from '@prisma/client';

// Use Prisma's User type directly for type safety
export type User = PrismaUser;

export interface MCPRequest {
  method: string;
  params?: any;
}

export interface MCPResponse {
  result?: any;
  error?: {
    code: number;
    message: string;
  };
}

export interface ServiceConfig {
  name: string;
  description: string;
  creditsRequired: number;
  requiresSubscription: boolean;
  category: 'ntsa' | 'dci' | 'business' | 'general';
}

export interface PaymentRequest {
  amount: number;
  phoneNumber: string;
  credits: number;
}

export interface MPesaCallbackData {
  Body: {
    stkCallback: {
      MerchantRequestID: string;
      CheckoutRequestID: string;
      ResultCode: number;
      ResultDesc: string;
      CallbackMetadata?: {
        Item: Array<{
          Name: string;
          Value: string | number;
        }>;
      };
    };
  };
}