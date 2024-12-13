import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { Assignment} from '../types/partner';

export const useAssignmentStore = create(
  persist<{
    assignments: Assignment[];
    setAssignments: (assignments: Assignment[]) => void;
  }>(
    (set) => ({
      assignments: [], // Initial state is an empty array
      setAssignments: (assignments) => set({ assignments: assignments }), // Function to update the delivery partners
    }),
    {
      name: 'assignment-storage', // Key for localStorage
      storage: createJSONStorage(() => sessionStorage) // Default is localStorage; you can use sessionStorage here if needed
    }
  )
);
