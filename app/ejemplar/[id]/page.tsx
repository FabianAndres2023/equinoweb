"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "../../../lib/supabase";

type Ejemplar = {
  id: string;
  nombre: string;
  ubicacion: string | null;
  precio: number | null;
  edad: string | null;
  descripcion: string | null;
  sexo: string | null;
  andar: string | null;
  estado: string | null;
  imagenes: string[] | null;
};

function formatPrice(value: number | null) {
  if (!value) return "Consultar";

  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function EjemplarPage() {
  const params = useParams();
  const id = params.id as string;

  const [ejemplar, setEjemplar] = useState<Ejemplar | null>(null);
  const [cargando, setCargando] = useState(true);
  const [imagenActual, setImagenActual] = useState(0);

  useEffect(() => {
    const cargarEjemplar = async () => {
      const { data } = await supabase
        .from("ejemplares")
        .select("*")
        .eq("id", id)
        .single();

      setEjemplar(data as Ejemplar);
      setCargando(false);
    };

    if (id) cargarEjemplar();
  }, [id]);

  const imagenes = useMemo(() => {
    if (!ejemplar?.imagenes || ejemplar.imagenes.length === 0) {
      return ["/logo.png"];
    }

    return ejemplar.imagenes;
  }, [ejemplar]);

  if (cargando) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f8f7f3] text-black">
        <div className="animate-pulse rounded-3xl bg-white px-8 py-6 font-bold shadow">
          Cargando ejemplar...
        </div>
      </main>
    );
  }

  if (!ejemplar) {
    return (
      <main className="min-h-screen bg-[#f8f7f3] p-10 text-black">
        <h1 className="text-2xl font-bold">Ejemplar no encontrado</h1>
      </main>
    );
  }

  const whatsappUrl = `https://wa.me/573247595574?text=${encodeURIComponent(
    `Hola, estoy interesado en el ejemplar ${ejemplar.nombre}`
  )}`;

  const siguienteImagen = () => {
    setImagenActual((actual) =>
      actual === imagenes.length - 1 ? 0 : actual + 1
    );
  };

  const anteriorImagen = () => {
    setImagenActual((actual) =>
      actual === 0 ? imagenes.length - 1 : actual - 1
    );
  };

  return (
    <main className="min-h-screen bg-[#f8f7f3] pb-24 text-[#171717] md:pb-0">
      <header className="sticky top-0 z-40 border-b bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
          <Link href="/" className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="Portal Equino"
              className="h-10 w-10 rounded-full object-cover"
            />

            <div>
              <h1 className="text-sm font-bold leading-tight">Portal Equino</h1>
              <p className="text-[11px] text-gray-500">
                El Portal de los Mejores
              </p>
            </div>
          </Link>

          <Link
            href="/"
            className="rounded-full border bg-white px-4 py-2 text-xs font-semibold shadow-sm"
          >
            ← Volver
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-6 py-5">
        <div className="animate-[fadeIn_0.4s_ease-in-out] grid gap-5 lg:grid-cols-[420px_1fr]">
          <section className="rounded-3xl border bg-white p-3 shadow-sm">
            <div className="relative h-[330px] w-full overflow-hidden rounded-2xl bg-gray-100">
              <img
                src={imagenes[imagenActual]}
                alt={ejemplar.nombre}
                className="h-full w-full object-cover transition duration-500"
              />

              <span
                className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-bold ${
                  ejemplar.estado === "Vendido"
                    ? "bg-red-100 text-red-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                ● {ejemplar.estado || "Disponible"}
              </span>

              {ejemplar.andar && (
                <span className="absolute right-3 top-3 rounded-full bg-[#fff3c4] px-3 py-1 text-xs font-bold text-[#8a6a12]">
                  {ejemplar.andar}
                </span>
              )}

              {imagenes.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={anteriorImagen}
                    className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-xl font-bold shadow"
                  >
                    ‹
                  </button>

                  <button
                    type="button"
                    onClick={siguienteImagen}
                    className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-xl font-bold shadow"
                  >
                    ›
                  </button>

                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/70 px-3 py-1 text-xs font-bold text-white">
                    {imagenActual + 1} / {imagenes.length}
                  </div>
                </>
              )}
            </div>

            {imagenes.length > 1 && (
              <div className="mt-3 grid grid-cols-4 gap-2">
                {imagenes.slice(0, 8).map((img: string, index: number) => (
                  <button
                    type="button"
                    key={img}
                    onClick={() => setImagenActual(index)}
                    className={`overflow-hidden rounded-xl border-2 ${
                      imagenActual === index
                        ? "border-[#b68a22]"
                        : "border-transparent"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${ejemplar.nombre} ${index + 1}`}
                      className="h-16 w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </section>

          <section className="rounded-3xl border bg-white p-5 shadow-sm">
            <p className="text-[11px] font-bold uppercase tracking-widest text-[#b68a22]">
              Ficha del ejemplar
            </p>

            <div className="mt-2 flex flex-col gap-4 border-b pb-4 md:flex-row md:items-start md:justify-between">
              <div className="min-w-0 flex-1">
                <h2 className="break-words text-3xl font-extrabold leading-tight">
                  {ejemplar.nombre}
                </h2>

                <p className="mt-1 text-sm text-gray-600">
                  📍 {ejemplar.ubicacion || "Sin ubicación registrada"}
                </p>
              </div>

              <div className="w-full rounded-2xl bg-[#f8f7f3] px-5 py-4 md:w-auto md:min-w-[240px] md:max-w-[300px] md:flex-shrink-0">
                <p className="text-left text-[10px] font-bold uppercase text-gray-400 md:text-right">
                  Precio
                </p>

                <h3 className="mt-1 break-words text-left text-xl font-extrabold leading-tight text-[#b68a22] sm:text-2xl md:text-right">
                  {formatPrice(ejemplar.precio)}
                </h3>
              </div>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <div className="rounded-2xl bg-[#f8f7f3] p-3">
                <p className="text-[10px] font-bold uppercase text-gray-400">
                  Sexo
                </p>
                <p className="mt-1 text-sm font-bold">
                  {ejemplar.sexo || "No registrado"}
                </p>
              </div>

              <div className="rounded-2xl bg-[#f8f7f3] p-3">
                <p className="text-[10px] font-bold uppercase text-gray-400">
                  Edad
                </p>
                <p className="mt-1 text-sm font-bold">
                  {ejemplar.edad || "No registrada"}
                </p>
              </div>

              <div className="rounded-2xl bg-[#f8f7f3] p-3">
                <p className="text-[10px] font-bold uppercase text-gray-400">
                  Andar
                </p>
                <p className="mt-1 text-sm font-bold">
                  {ejemplar.andar || "No registrado"}
                </p>
              </div>

              <div className="rounded-2xl bg-[#f8f7f3] p-3">
                <p className="text-[10px] font-bold uppercase text-gray-400">
                  Estado
                </p>
                <p className="mt-1 text-sm font-bold">
                  {ejemplar.estado || "Disponible"}
                </p>
              </div>

              <div className="rounded-2xl bg-[#f8f7f3] p-3 md:col-span-2">
                <p className="text-[10px] font-bold uppercase text-gray-400">
                  Ubicación
                </p>
                <p className="mt-1 text-sm font-bold">
                  {ejemplar.ubicacion || "No registrada"}
                </p>
              </div>
            </div>

            <div className="mt-4 rounded-2xl bg-[#f8f7f3] p-3">
              <p className="text-[10px] font-bold uppercase text-gray-400">
                Descripción
              </p>

              <p className="mt-2 text-sm leading-relaxed text-gray-700">
                {ejemplar.descripcion || "Sin descripción registrada."}
              </p>
            </div>

            <div className="mt-4 flex gap-3">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 rounded-2xl bg-green-500 px-5 py-3 text-center text-sm font-bold text-white shadow-sm transition hover:bg-green-600"
              >
                Contactar por WhatsApp
              </a>

              <Link
                href="/"
                className="rounded-2xl border bg-white px-5 py-3 text-center text-sm font-bold"
              >
                Ver más
              </Link>
            </div>
          </section>
        </div>
      </section>

      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-4 right-4 z-30 flex items-center gap-2 rounded-full bg-green-500 px-4 py-3 text-sm font-bold text-white shadow-xl transition hover:bg-green-600 md:bottom-6 md:right-6 md:z-50 md:px-5 md:py-4"
      >
        <span className="text-lg">🟢</span>
        WhatsApp
      </a>
    </main>
  );
}