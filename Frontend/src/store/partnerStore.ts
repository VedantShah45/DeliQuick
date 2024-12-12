import { create } from 'zustand';
import { DeliveryPartner } from '../types/partner';

export const usePartnerStore = create<{
  deliveryPartners: DeliveryPartner[];
  setDeliveryPartners: (partners: DeliveryPartner[]) => void;
}>((set) => ({
  deliveryPartners: [], // Initial state is an empty array
  setDeliveryPartners: (partners) => set({ deliveryPartners: partners }), // Function to update the delivery partners
}));

