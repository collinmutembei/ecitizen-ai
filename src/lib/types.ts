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

export interface User {
  id: string;
  email: string;
  name?: string;
  credits: number;
  isSubscribed: boolean;
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