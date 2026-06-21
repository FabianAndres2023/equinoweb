"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

type Ejemplar = {
  id: string;
  nombre: string;
  ubicacion: string | null;
  edad: string | null;
  sexo: string | null;
  andar: string | null;
  estado: string | null;
  imagenes: string[] | null;
};

export default function VendidosPage() {
  const [ejemplares, setEjemplares] = useState<Ejemplar[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarVendidos = async () => {
      const { data, error } = await supabase
        .from("ejemplares")
        .select("*")
        .eq("estado", "Vendido")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error cargando vendidos:", error.message);
      }

      setEjemplares((data || []) as Ejemplar[]);
      setCargando(false);
    };

    cargarVendidos();
  }, []);

  return (
    <main className="min-h-screen bg-[#f8f7f3] text-black">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-extrabold">Ejemplares Vendidos</h1>

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

        {cargando && (
          <div className="rounded-3xl border bg-white p-10 text-center font-bold">
            Cargando vendidos...
          </div>
        )}

        {!cargando && ejemplares.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {ejemplares.map((ejemplar) => (
              <Link
                href={`/ejemplar/${ejemplar.id}`}
                key={ejemplar.id}
                className="overflow-hidden rounded-3xl border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative h-64 bg-gray-100">
                  <img
                    src={ejemplar.imagenes?.[0] || "/logo.png"}
                    className="h-full w-full object-cover grayscale"
                    alt={ejemplar.nombre}
                  />

                  <span className="absolute left-4 top-4 rounded-lg bg-red-100 px-3 py-1 text-xs font-bold text-red-700">
                    ● VENDIDO
                  </span>

                  {ejemplar.andar && (
                    <span className="absolute right-4 top-4 rounded-lg bg-[#fff3c4] px-3 py-1 text-xs font-bold text-[#8a6a12]">
                      {ejemplar.andar}
                    </span>
                  )}
                </div>

                <div className="p-5">
                  <h2 className="text-xl font-bold">{ejemplar.nombre}</h2>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {ejemplar.edad && (
                      <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
                        Edad: {ejemplar.edad}
                      </span>
                    )}

                    {ejemplar.sexo && (
                      <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-700">
                        {ejemplar.sexo}
                      </span>
                    )}
                  </div>

                  <p className="mt-3 text-sm text-gray-500">
                    📍 {ejemplar.ubicacion || "Sin ubicación"}
                  </p>

                  <div className="mt-4 inline-block rounded-full bg-red-100 px-4 py-2 text-sm font-bold text-red-700">
                    Vendido
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {!cargando && ejemplares.length === 0 && (
          <div className="rounded-3xl border bg-white p-10 text-center">
            No hay ejemplares vendidos.
          </div>
        )}
      </div>
    </main>
  );
}