"use client";

import React, { useEffect, useState } from "react";
import { useInventoryStore } from "../../features/inventory/store/inventory.store";
import { InventoryHeader } from "../../features/inventory/components/inventory-header";
import { createMedication, createBatch, updateMedication, deleteMedication } from "../../features/inventory/api";

export default function InventoryPage() {
  const { items, meds, fetchMedications } = useInventoryStore();

  useEffect(() => {
    fetchMedications();
  }, [fetchMedications]);

  // Create medication form state
  const [sku, setSku] = useState("");
  const [name, setName] = useState("");
  const [medLoading, setMedLoading] = useState(false);
  const [medMessage, setMedMessage] = useState<string | null>(null);

  // Create batch form state
  const [medicationId, setMedicationId] = useState("");
  const [lot, setLot] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [stockCurrent, setStockCurrent] = useState<number>(0);
  const [stockMin, setStockMin] = useState<number>(0);
  const [batchLoading, setBatchLoading] = useState(false);
  const [batchMessage, setBatchMessage] = useState<string | null>(null);

  async function handleCreateMedication(e: React.FormEvent) {
    e.preventDefault();
    setMedLoading(true);
    setMedMessage(null);
    try {
      await createMedication({ sku, name });
      setSku("");
      setName("");
      setMedMessage("Medicamento creado");
      await fetchMedications();
    } catch (err: any) {
      setMedMessage(err?.message ?? "Error al crear medicamento");
    } finally {
      setMedLoading(false);
    }
  }

  async function handleCreateBatch(e: React.FormEvent) {
    e.preventDefault();
    setBatchLoading(true);
    setBatchMessage(null);
    try {
      if (!medicationId) throw new Error("Seleccione un medicamento");
      await createBatch({
        medicationId,
        lot,
        expirationDate,
        stockCurrent,
        stockMin,
      });
      setLot("");
      setExpirationDate("");
      setStockCurrent(0);
      setStockMin(0);
      setBatchMessage("Lote creado");
      await fetchMedications();
    } catch (err: any) {
      setBatchMessage(err?.message ?? "Error al crear lote");
    } finally {
      setBatchLoading(false);
    }
  }

  // Edit medication state
  const [editingMedId, setEditingMedId] = useState<string | null>(null);
  const [editSku, setEditSku] = useState("");
  const [editName, setEditName] = useState("");
  const [editLoading, setEditLoading] = useState(false);
  const [editMessage, setEditMessage] = useState<string | null>(null);

  function startEditMedication(medId: string) {
    const med = meds.find((m) => m.id === medId);
    if (!med) return;
    setEditingMedId(medId);
    setEditSku(med.sku);
    setEditName(med.name);
    setEditMessage(null);
  }

  function cancelEdit() {
    setEditingMedId(null);
    setEditSku("");
    setEditName("");
    setEditMessage(null);
  }

  async function saveEditMedication(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (!editingMedId) return;
    setEditLoading(true);
    setEditMessage(null);
    try {
      await updateMedication(editingMedId, { sku: editSku, name: editName });
      setEditMessage("Medicamento actualizado");
      await fetchMedications();
      cancelEdit();
    } catch (err: any) {
      setEditMessage(err?.message ?? "Error al actualizar medicamento");
    } finally {
      setEditLoading(false);
    }
  }

  async function handleDeleteMedication(medId: string) {
    if (!confirm("¿Eliminar medicamento? Esto eliminará también sus lotes si la API lo permite.")) return;
    try {
      await deleteMedication(medId);
      await fetchMedications();
    } catch (err: any) {
      // eslint-disable-next-line no-console
      console.error("deleteMedication error:", err);
      alert(err?.message ?? "Error al eliminar medicamento");
    }
  }

  return (
    <main className="mx-auto max-w-6xl p-8">
      <InventoryHeader />

      <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <form className="rounded-lg border bg-white p-4" onSubmit={handleCreateMedication}>
          <h2 className="mb-3 text-lg font-medium">Crear Medicamento</h2>
          <div className="mb-2">
            <label className="block text-sm text-slate-600">SKU</label>
            <input className="mt-1 w-full rounded border px-2 py-1" value={sku} onChange={(e) => setSku(e.target.value)} />
          </div>
          <div className="mb-2">
            <label className="block text-sm text-slate-600">Nombre</label>
            <input className="mt-1 w-full rounded border px-2 py-1" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="flex items-center gap-2">
            <button className="rounded bg-slate-900 px-4 py-2 text-white" type="submit" disabled={medLoading}>
              {medLoading ? "Creando..." : "Crear"}
            </button>
            {medMessage && <span className="text-sm text-slate-600">{medMessage}</span>}
          </div>
        </form>

        <form className="rounded-lg border bg-white p-4" onSubmit={handleCreateBatch}>
          <h2 className="mb-3 text-lg font-medium">Crear Lote</h2>
          <div className="mb-2">
            <label className="block text-sm text-slate-600">Medicamento</label>
            <select className="mt-1 w-full rounded border px-2 py-1" value={medicationId} onChange={(e) => setMedicationId(e.target.value)}>
              <option value="">-- Seleccionar --</option>
              {meds.map((m) => (
                <option key={m.id} value={m.id}>{`${m.name} (${m.sku})`}</option>
              ))}
            </select>
          </div>
          <div className="mb-2">
            <label className="block text-sm text-slate-600">Lote</label>
            <input className="mt-1 w-full rounded border px-2 py-1" value={lot} onChange={(e) => setLot(e.target.value)} />
          </div>
          <div className="mb-2">
            <label className="block text-sm text-slate-600">Vencimiento</label>
            <input type="date" className="mt-1 w-full rounded border px-2 py-1" value={expirationDate} onChange={(e) => setExpirationDate(e.target.value)} />
          </div>
          <div className="mb-2 grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm text-slate-600">Stock actual</label>
              <input type="number" className="mt-1 w-full rounded border px-2 py-1" value={stockCurrent} onChange={(e) => setStockCurrent(Number(e.target.value))} />
            </div>
            <div>
              <label className="block text-sm text-slate-600">Stock mínimo</label>
              <input type="number" className="mt-1 w-full rounded border px-2 py-1" value={stockMin} onChange={(e) => setStockMin(Number(e.target.value))} />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="rounded bg-slate-900 px-4 py-2 text-white" type="submit" disabled={batchLoading}>
              {batchLoading ? "Creando..." : "Crear lote"}
            </button>
            {batchMessage && <span className="text-sm text-slate-600">{batchMessage}</span>}
          </div>
        </form>
      </section>

      <section className="mt-6 overflow-hidden rounded-lg border bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-100 text-slate-700">
            <tr>
              <th className="px-4 py-3">Nombre</th>
              <th className="px-4 py-3">SKU</th>
              <th className="px-4 py-3">Lote</th>
              <th className="px-4 py-3">Vencimiento</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Mínimo</th>
              <th className="px-4 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="px-4 py-3">{item.name}</td>
                <td className="px-4 py-3">{item.sku}</td>
                <td className="px-4 py-3">{item.lot}</td>
                <td className="px-4 py-3">{item.expirationDate}</td>
                <td className="px-4 py-3">{item.stockCurrent}</td>
                <td className="px-4 py-3">{item.stockMin}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button className="rounded bg-amber-600 px-3 py-1 text-white text-sm" onClick={() => startEditMedication(item.medicationId)}>
                      Editar
                    </button>
                    <button className="rounded bg-red-600 px-3 py-1 text-white text-sm" onClick={() => handleDeleteMedication(item.medicationId)}>
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {editingMedId && (
        <section className="mt-6 rounded-lg border bg-white p-4">
          <h2 className="mb-3 text-lg font-medium">Editar Medicamento</h2>
          <form onSubmit={saveEditMedication}>
            <div className="mb-2">
              <label className="block text-sm text-slate-600">SKU</label>
              <input className="mt-1 w-full rounded border px-2 py-1" value={editSku} onChange={(e) => setEditSku(e.target.value)} />
            </div>
            <div className="mb-2">
              <label className="block text-sm text-slate-600">Nombre</label>
              <input className="mt-1 w-full rounded border px-2 py-1" value={editName} onChange={(e) => setEditName(e.target.value)} />
            </div>
            <div className="flex items-center gap-2">
              <button className="rounded bg-slate-900 px-4 py-2 text-white" type="submit" disabled={editLoading}>
                {editLoading ? "Guardando..." : "Guardar"}
              </button>
              <button type="button" className="rounded border px-4 py-2" onClick={cancelEdit}>
                Cancelar
              </button>
              {editMessage && <span className="text-sm text-slate-600">{editMessage}</span>}
            </div>
          </form>
        </section>
      )}
    </main>
  );
}
