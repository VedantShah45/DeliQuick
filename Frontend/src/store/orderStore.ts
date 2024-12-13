import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { Order } from '../types/partner';

export const useOrderStore = create(
  persist<{
    orders: Order[];
    setOrders: (orders: Order[]) => void;
  }>(
    (set) => ({
      orders: [], // Initial state is an empty array
      setOrders: (orders) => set({ orders: orders }), // Function to update the delivery partners
    }),
    {
      name: 'order-storage', // Key for localStorage
      storage: createJSONStorage(() => sessionStorage) // Default is localStorage; you can use sessionStorage here if needed
    }
  )
);
