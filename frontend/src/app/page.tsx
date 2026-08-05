import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-5xl p-8">
      <h1 className="text-3xl font-bold">Asusalud</h1>
      <p className="mt-2 text-slate-600">
        Plataforma de inventario farmacéutico con foco en consistencia.
      </p>

      <div className="mt-8">
        <Link
          href="/inventory"
          className="rounded bg-slate-900 px-4 py-2 text-white hover:bg-slate-700"
        >
          Ir al módulo de inventario
        </Link>
      </div>
    </main>
  );
}
