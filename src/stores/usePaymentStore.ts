import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type PaymentMethodType = 'credit_card' | 'paypal' | 'bank_transfer' | 'crypto';
export type SubscriptionPlan = 'free' | 'basic' | 'pro' | 'enterprise';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

export interface PaymentMethod {
  id: string;
  cardNumber: string;
  cardholderName: string;
  expiryDate: string;
  cvv: string;
  billingAddress: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
  saveForFuture: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Subscription {
  id: string;
  userId: string;
  plan: SubscriptionPlan;
  startDate: string;
  endDate: string;
  autoRenew: boolean;
  status: 'active' | 'cancelled' | 'expired';
  paymentMethodId: string;
}

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  paymentMethodId: string;
  subscriptionId?: string;
  description: string;
  createdAt: string;
  metadata?: Record<string, any>;
}

interface PaymentState {
  paymentMethods: PaymentMethod[];
  subscriptions: Subscription[];
  transactions: Transaction[];
  addPaymentMethod: (paymentMethod: Omit<PaymentMethod, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updatePaymentMethod: (id: string, paymentMethod: Partial<PaymentMethod>) => void;
  deletePaymentMethod: (id: string) => void;
  getPaymentMethod: (id: string) => PaymentMethod | undefined;
  addSubscription: (subscription: Omit<Subscription, 'id'>) => void;
  updateSubscription: (id: string, subscription: Partial<Subscription>) => void;
  cancelSubscription: (id: string) => void;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => void;
  getSubscriptionByUserId: (userId: string) => Subscription | undefined;
  getActiveSubscription: (userId: string) => Subscription | undefined;
  getTransactionHistory: (userId: string) => Transaction[];
}

export const usePaymentStore = create<PaymentState>()(
  persist(
    (set, get) => ({
      paymentMethods: [],
      subscriptions: [],
      transactions: [],

      addPaymentMethod: (paymentMethod) => {
        const newPaymentMethod: PaymentMethod = {
          ...paymentMethod,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        set((state) => ({
          paymentMethods: [...state.paymentMethods, newPaymentMethod],
        }));
      },

      updatePaymentMethod: (id, paymentMethod) => {
        set((state) => ({
          paymentMethods: state.paymentMethods.map((method) =>
            method.id === id
              ? { ...method, ...paymentMethod, updatedAt: new Date().toISOString() }
              : method
          ),
        }));
      },

      deletePaymentMethod: (id) => {
        set((state) => ({
          paymentMethods: state.paymentMethods.filter((method) => method.id !== id),
        }));
      },

      getPaymentMethod: (id) => {
        return get().paymentMethods.find((method) => method.id === id);
      },

      addSubscription: (subscription) => {
        const newSubscription = { ...subscription, id: crypto.randomUUID() };
        set((state) => ({
          subscriptions: [...state.subscriptions, newSubscription],
        }));
      },

      updateSubscription: (id, subscription) => {
        set((state) => ({
          subscriptions: state.subscriptions.map((s) =>
            s.id === id ? { ...s, ...subscription } : s
          ),
        }));
      },

      cancelSubscription: (id) => {
        set((state) => ({
          subscriptions: state.subscriptions.map((s) =>
            s.id === id ? { ...s, status: 'cancelled' } : s
          ),
        }));
      },

      addTransaction: (transaction) => {
        const newTransaction = { ...transaction, id: crypto.randomUUID() };
        set((state) => ({
          transactions: [...state.transactions, newTransaction],
        }));
      },

      updateTransaction: (id, transaction) => {
        set((state) => ({
          transactions: state.transactions.map((t) =>
            t.id === id ? { ...t, ...transaction } : t
          ),
        }));
      },

      getSubscriptionByUserId: (userId) => {
        return get().subscriptions.find((s) => s.userId === userId);
      },

      getActiveSubscription: (userId) => {
        return get().subscriptions.find(
          (s) => s.userId === userId && s.status === 'active'
        );
      },

      getTransactionHistory: (userId) => {
        return get().transactions
          .filter((t) => t.userId === userId)
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      },
    }),
    {
      name: 'payment-storage',
    }
  )
); 