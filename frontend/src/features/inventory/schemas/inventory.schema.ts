export type InventoryItemSchema = {
  id: string;
  name: string;
  sku: string;
  lot: string;
  expirationDate: string;
  stockCurrent: number;
  stockMin: number;
};
