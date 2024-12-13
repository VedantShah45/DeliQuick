import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { DeliveryPartner } from '../types/partner';

export const usePartnerStore = create(
  persist<{
    deliveryPartners: DeliveryPartner[];
    setDeliveryPartners: (partners: DeliveryPartner[]) => void;
  }>(
    (set) => ({
      deliveryPartners: [], // Initial state is an empty array
      setDeliveryPartners: (partners) => set({ deliveryPartners: partners }), // Function to update the delivery partners
    }),
    {
      name: 'partner-storage', // Key for localStorage
      storage: createJSONStorage(() => sessionStorage) // Default is localStorage; you can use sessionStorage here if needed
    }
  )
);
