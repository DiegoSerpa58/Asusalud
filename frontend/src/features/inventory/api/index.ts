export type InventoryApiHealth = {
  ok: boolean;
};

export type ApiMedication = {
  id: string;
  sku: string;
  name: string;
  batches: Array<{
    id: string;
    lot: string;
    expirationDate: string;
    stockCurrent: number;
    stockMin: number;
  }>;
};

const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "";

export async function fetchMedications(): Promise<ApiMedication[]> {
  const res = await fetch(`${baseUrl}/medications`);
  if (!res.ok) {
    throw new Error(`Failed to fetch medications: ${res.status}`);
  }
  return (await res.json()) as ApiMedication[];
}

export async function createMedication(payload: { sku: string; name: string; }): Promise<ApiMedication> {
  const res = await fetch(`${baseUrl}/medications`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Failed to create medication: ${res.status} ${text}`);
  }
  return (await res.json()) as ApiMedication;
}

export async function updateMedication(id: string, payload: { sku?: string; name?: string; }): Promise<ApiMedication> {
  const res = await fetch(`${baseUrl}/medications/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Failed to update medication: ${res.status} ${text}`);
  }
  return (await res.json()) as ApiMedication;
}

export async function deleteMedication(id: string): Promise<any> {
  const res = await fetch(`${baseUrl}/medications/${id}`, { method: "DELETE" });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Failed to delete medication: ${res.status} ${text}`);
  }
  return await res.json();
}

export async function createBatch(payload: {
  medicationId: string;
  lot: string;
  expirationDate: string;
  stockCurrent: number;
  stockMin: number;
}): Promise<any> {
  const res = await fetch(`${baseUrl}/medications/batches`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Failed to create batch: ${res.status} ${text}`);
  }
  return await res.json();
}
