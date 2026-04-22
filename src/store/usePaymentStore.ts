import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface PaymentMethod {
  id: string;
  type: 'card' | 'jazzcash' | 'easypaisa' | 'cash' | 'loan';
  name: string;
  lastFour?: string;
  isDefault: boolean;
}

export interface Transaction {
  id: string;
  amount: number;
  date: string;
  rideId: string;
  type: string;
  status: 'completed' | 'pending' | 'failed';
}

interface PaymentState {
  paymentMethods: PaymentMethod[];
  transactions: Transaction[];
  activeLoan: number;
  
  addPaymentMethod: (method: Omit<PaymentMethod, 'id'>) => void;
  setDefaultMethod: (id: string) => void;
  addTransaction: (tx: Omit<Transaction, 'id' | 'date'>) => void;
  updateLoan: (amount: number) => void;
}

export const usePaymentStore = create<PaymentState>()(
  persist(
    (set) => ({
      paymentMethods: [
        { id: '1', type: 'cash', name: 'Cash on Delivery', isDefault: true },
        { id: '2', type: 'loan', name: 'Company Loan', isDefault: false },
      ],
      transactions: [],
      activeLoan: 0,

      addPaymentMethod: (method) => set((state) => ({
        paymentMethods: [...state.paymentMethods, { ...method, id: Math.random().toString(36).substr(2, 9) }]
      })),

      setDefaultMethod: (id) => set((state) => ({
        paymentMethods: state.paymentMethods.map(m => ({
          ...m,
          isDefault: m.id === id
        }))
      })),

      addTransaction: (tx) => set((state) => ({
        transactions: [
          { ...tx, id: `TX-${Math.random().toString(36).substr(2, 6).toUpperCase()}`, date: new Date().toISOString() },
          ...state.transactions
        ]
      })),

      updateLoan: (amount) => set((state) => ({
        activeLoan: state.activeLoan + amount
      })),
    }),
    {
      name: 'transport-hub-payment',
    }
  )
);
