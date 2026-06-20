import Link from "next/link";
import { supabase } from "../../lib/supabase";

export default async function VendidosPage() {
  const { data } = await supabase
    .from("ejemplares")
    .select("*")
    .eq("estado", "Vendido")
    .order("created_at", { ascending: false });

  const ejemplares = data || [];

  return (
    <main className="min-h-screen bg-[#f8f7f3] text-black">
      <div className="mx-auto max-w-6xl px-6 py-10">

        <div className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-extrabold">
              Ejemplares Vendidos
            </h1>

            <p className="mt-2 text-gray-500">
              Historial de ejemplares vendidos.
            </p>
          </div>

          <Link
            href="/"
            className="rounded-xl border bg-white px-5 py-3 font-bold"
          >
            ← Volver
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {ejemplares.map((ejemplar: any) => (
            <div
              key={ejemplar.id}
              className="overflow-hidden rounded-3xl border bg-white shadow-sm"
            >
              <img
                src={ejemplar.imagenes?.[0] || "/logo.png"}
                className="h-64 w-full object-cover"
                alt={ejemplar.nombre}
              />

              <div className="p-5">
                <h2 className="text-xl font-bold">
                  {ejemplar.nombre}
                </h2>

                <p className="mt-2 text-sm text-gray-500">
                  📍 {ejemplar.ubicacion}
                </p>

                <div className="mt-4 inline-block rounded-full bg-red-100 px-4 py-2 text-sm font-bold text-red-700">
                  Vendido
                </div>
              </div>
            </div>
          ))}
        </div>

        {ejemplares.length === 0 && (
          <div className="rounded-3xl border bg-white p-10 text-center">
            No hay ejemplares vendidos.
          </div>
        )}
      </div>
    </main>
  );
}