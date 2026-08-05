import { create } from "zustand";
import { fetchMedications, ApiMedication } from "../api";

type InventoryItem = {
  id: string; // batch id
  medicationId: string;
  name: string;
  sku: string;
  lot: string;
  expirationDate: string;
  stockCurrent: number;
  stockMin: number;
};

type InventoryState = {
  items: InventoryItem[];
  meds: ApiMedication[];
  setItems: (items: InventoryItem[]) => void;
  setMeds: (meds: ApiMedication[]) => void;
  fetchMedications: () => Promise<void>;
};

export const useInventoryStore = create<InventoryState>((set) => ({
  items: [],
  meds: [],
  setItems: (items) => set({ items }),
  setMeds: (meds) => set({ meds }),
  fetchMedications: async () => {
    try {
      const meds = await fetchMedications();
      const items = meds.flatMap((m) =>
        m.batches.map((b) => ({
          id: b.id,
          medicationId: m.id,
          name: m.name,
          sku: m.sku,
          lot: b.lot,
          expirationDate: new Date(b.expirationDate).toISOString().split("T")[0],
          stockCurrent: b.stockCurrent,
          stockMin: b.stockMin,
        })),
      );
      set({ items, meds });
    } catch (error) {
      // keep existing items if fetch fails; log for debugging
      // In a production app, show a user-friendly error toast
      // eslint-disable-next-line no-console
      console.error("fetchMedications error:", error);
    }
  },
}));
