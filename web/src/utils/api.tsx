/**
 * API Utility Functions for CREOVA Backend
 */

import { projectId, publicAnonKey } from './supabase/info';

const BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-ce1844e7`;

// Headers for API requests
const getHeaders = (token?: string) => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token || publicAnonKey}`,
});

// Generic API call function
async function apiCall<T>(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  body?: any,
  token?: string
): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;
  
  const options: RequestInit = {
    method,
    headers: getHeaders(token),
  };
  
  if (body && method !== 'GET') {
    options.body = JSON.stringify(body);
  }
  
  const response = await fetch(url, options);
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: response.statusText }));
    throw new Error(error.error || `API Error: ${response.status}`);
  }
  
  return response.json();
}

// ==================== WALLET APIs ====================

export interface WalletData {
  userId: string;
  balance: number;
  pendingPayments: number;
  escrowAmount: number;
  totalEarned: number;
  totalSpent: number;
  createdAt: string;
}

export interface Transaction {
  id: string;
  userId: string;
  type: 'incoming' | 'outgoing';
  description: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  date: string;
  provider: string;
  reference: string;
}

export async function getWallet(userId: string): Promise<{ wallet: WalletData; transactions: Transaction[] }> {
  return apiCall(`/wallet/${userId}`);
}

// ==================== PAYMENT REQUEST APIs ====================

export interface PaymentRequestData {
  userId: string;
  recipientName: string;
  recipientPhone?: string;
  amount: number;
  purpose: string;
  description?: string;
}

export async function createPaymentRequest(data: PaymentRequestData): Promise<{
  requestId: string;
  paymentLink: string;
  message: string;
}> {
  return apiCall('/payment-request', 'POST', data);
}

// ==================== INVOICE APIs ====================

export interface InvoiceData {
  userId: string;
  sellerName: string;
  sellerPhone?: string;
  customerName: string;
  customerPhone?: string;
  items: {
    description: string;
    quantity: number;
    unit: string;
    unitPrice: number;
    total: number;
  }[];
  subtotal: number;
  vat: number;
  total: number;
  notes?: string;
}

export async function generateInvoice(data: InvoiceData): Promise<{
  invoiceNumber: string;
  invoiceHTML: string;
  message: string;
}> {
  return apiCall('/invoice/generate', 'POST', data);
}

export async function getUserInvoices(userId: string): Promise<{ invoices: any[] }> {
  return apiCall(`/invoices/${userId}`);
}

// ==================== AGRICULTURAL INPUTS APIs ====================

export interface InputPurchaseData {
  userId: string;
  items: {
    id: string;
    name: string;
    category: string;
    price: number;
    unit: string;
    quantity: number;
    supplier: string;
  }[];
  totalAmount: number;
  deliveryFee?: number;
  paymentMethod?: string;
}

export async function purchaseInputs(data: InputPurchaseData): Promise<{
  orderNumber: string;
  newBalance: number;
  message: string;
}> {
  return apiCall('/inputs/purchase', 'POST', data);
}

// ==================== LOAN APIs ====================

export interface LoanRepaymentData {
  userId: string;
  loanId: string;
  amount: number;
  lenderName: string;
}

export async function makeLoanRepayment(data: LoanRepaymentData): Promise<{
  newBalance: number;
  remainingLoanBalance: number;
  loanStatus: string;
  message: string;
}> {
  return apiCall('/loan/repayment', 'POST', data);
}

export async function getUserLoans(userId: string): Promise<{ loans: any[] }> {
  return apiCall(`/loans/${userId}`);
}

// ==================== SELCOM PAYMENT APIs ====================

export interface SelcomCheckoutData {
  userId: string;
  amount: number;
  description: string;
  buyerName: string;
  buyerPhone: string;
  buyerEmail?: string;
}

export async function createSelcomCheckout(data: SelcomCheckoutData): Promise<{
  orderId: string;
  selcomData: any;
  message: string;
}> {
  return apiCall('/selcom/checkout', 'POST', data);
}

export async function getSelcomOrderStatus(orderId: string): Promise<{ order: any }> {
  return apiCall(`/selcom/order/${orderId}`);
}

// ==================== WALLET WITHDRAWAL APIs ====================

export interface WithdrawalData {
  userId: string;
  amount: number;
  phoneNumber: string;
  provider: string;
}

export async function withdrawFromWallet(data: WithdrawalData): Promise<{
  withdrawalId: string;
  netAmount: number;
  fee: number;
  newBalance: number;
  message: string;
}> {
  return apiCall('/wallet/withdraw', 'POST', data);
}
