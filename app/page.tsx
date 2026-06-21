"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";

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

const filtros = [
  "Todos los andares",
  "Paso Fino",
  "Trocha",
  "Trocha y Galope",
  "Trote y Galope",
];

function formatPrice(value: number | null) {
  if (!value) return "Consultar";

  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function Home() {
  const [ejemplares, setEjemplares] = useState<Ejemplar[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [filtroActivo, setFiltroActivo] = useState("Todos los andares");

  useEffect(() => {
    const cargarEjemplares = async () => {
      const { data } = await supabase
        .from("ejemplares")
        .select("*")
        .order("created_at", { ascending: false });

      setEjemplares((data || []) as Ejemplar[]);
    };

    cargarEjemplares();
  }, []);

  const bajarAEjemplares = () => {
    document.getElementById("ejemplares")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const ejemplaresDisponibles = useMemo(() => {
    return ejemplares.filter((ejemplar) => ejemplar.estado !== "Vendido");
  }, [ejemplares]);

  const vendidos = useMemo(() => {
    return ejemplares.filter((ejemplar) => ejemplar.estado === "Vendido");
  }, [ejemplares]);

  const ejemplaresOrdenados = useMemo(() => {
    return [...ejemplares].sort((a, b) => {
      if (a.estado === "Vendido" && b.estado !== "Vendido") return 1;
      if (a.estado !== "Vendido" && b.estado === "Vendido") return -1;
      return 0;
    });
  }, [ejemplares]);

  const ejemplaresFiltrados = useMemo(() => {
    const texto = busqueda.toLowerCase().trim();

    return ejemplaresOrdenados.filter((ejemplar) => {
      const coincideBusqueda =
        !texto ||
        ejemplar.nombre?.toLowerCase().includes(texto) ||
        ejemplar.ubicacion?.toLowerCase().includes(texto) ||
        ejemplar.andar?.toLowerCase().includes(texto) ||
        ejemplar.sexo?.toLowerCase().includes(texto) ||
        ejemplar.edad?.toLowerCase().includes(texto) ||
        ejemplar.estado?.toLowerCase().includes(texto);

      const coincideFiltro =
        filtroActivo === "Todos los andares" ||
        ejemplar.andar === filtroActivo;

      return coincideBusqueda && coincideFiltro;
    });
  }, [busqueda, filtroActivo, ejemplaresOrdenados]);

  return (
    <main className="min-h-screen scroll-smooth bg-[#f8f7f3] text-[#171717]">
      <header className="sticky top-0 z-40 border-b bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/contactanos" className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="Portal Equino"
              className="h-12 w-12 rounded-full object-cover"
            />

            <div>
              <h1 className="font-bold leading-tight">Portal Equino</h1>
              <p className="text-xs text-gray-500">El Portal de los Mejores</p>
            </div>
          </Link>

          <nav className="flex gap-3 text-xs font-semibold text-gray-600 md:gap-6 md:text-sm">
            <button
              type="button"
              onClick={bajarAEjemplares}
              className="hover:text-black"
            >
              Ejemplares
            </button>

            <Link className="hover:text-black" href="/vendidos">
              Vendidos
            </Link>

            <Link className="hover:text-black" href="/contactanos">
              Contáctanos
            </Link>
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-8">
        <div className="rounded-[2rem] bg-white p-5 shadow-sm">
          <input
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por nombre, ubicación, edad, andar, sexo o estado..."
            className="w-full rounded-2xl border bg-white px-5 py-4 shadow-sm outline-none transition focus:border-[#b68a22] focus:ring-4 focus:ring-[#b68a22]/10"
          />

          <div className="mt-4 flex flex-wrap gap-3">
            {filtros.map((item) => (
              <button
                key={item}
                onClick={() => setFiltroActivo(item)}
                className={`rounded-full border px-5 py-2 text-sm shadow-sm transition ${
                  filtroActivo === item
                    ? "bg-black text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-[#b68a22]">
              Vitrina · Caballo Criollo
            </p>

            <h2 className="mt-3 text-3xl font-extrabold leading-tight md:text-6xl">
              Los mejores ejemplares, <br />
              <span className="text-[#b68a22]">para siempre.</span>
            </h2>

            <p className="mt-4 max-w-2xl text-gray-600">
              Busca, filtra y contacta al propietario en un toque.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-3xl bg-white p-5 shadow-sm">
              <p className="text-xs font-bold uppercase text-gray-400">
                Disponibles
              </p>
              <h3 className="mt-2 text-3xl font-extrabold text-green-600">
                {ejemplaresDisponibles.length}
              </h3>
            </div>

            <Link
              href="/vendidos"
              className="rounded-3xl bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <p className="text-xs font-bold uppercase text-gray-400">
                Vendidos
              </p>
              <h3 className="mt-2 text-3xl font-extrabold text-red-600">
                {vendidos.length}
              </h3>
            </Link>
          </div>
        </div>

        <div id="ejemplares" className="scroll-mt-28">
          <div className="mt-5 flex gap-5 text-sm">
            <span>
              <b>{ejemplaresFiltrados.length}</b> resultados
            </span>
            <span className="text-green-600">● Actualizado hoy</span>
          </div>

          <section className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {ejemplaresFiltrados.map((ejemplar) => {
              const imagen =
                ejemplar.imagenes && ejemplar.imagenes.length > 0
                  ? ejemplar.imagenes[0]
                  : "/logo.png";

              const esVendido = ejemplar.estado === "Vendido";

              const whatsappUrl = `https://wa.me/573247595574?text=${encodeURIComponent(
                `Hola, estoy interesado en el ejemplar ${ejemplar.nombre}`
              )}`;

              return (
                <article
                  key={ejemplar.id}
                  className={`overflow-hidden rounded-3xl border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg ${
                    esVendido ? "opacity-90" : ""
                  }`}
                >
                  <Link href={`/ejemplar/${ejemplar.id}`} className="block">
                    <div className="relative h-64 bg-gray-100">
                      <img
                        src={imagen}
                        alt={ejemplar.nombre}
                        className={`h-full w-full object-cover ${
                          esVendido ? "grayscale" : ""
                        }`}
                      />

                      <span
                        className={`absolute left-4 top-4 rounded-lg px-3 py-1 text-xs font-bold ${
                          esVendido
                            ? "bg-red-100 text-red-700"
                            : "bg-white text-gray-700"
                        }`}
                      >
                        <span
                          className={
                            esVendido ? "text-red-500" : "text-green-500"
                          }
                        >
                          ●
                        </span>{" "}
                        {esVendido
                          ? "VENDIDO"
                          : ejemplar.estado || "Disponible"}
                      </span>

                      {ejemplar.andar && (
                        <span className="absolute right-4 top-4 rounded-lg bg-[#fff3c4] px-3 py-1 text-xs font-semibold text-[#8a6a12]">
                          {ejemplar.andar}
                        </span>
                      )}

                      <span className="absolute bottom-4 left-4 rounded-xl bg-black/80 px-4 py-2 text-xs font-bold text-white">
                        Ver detalle
                      </span>
                    </div>

                    <div className="p-5 pb-0">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="text-lg font-bold">
                          {ejemplar.nombre}
                        </h3>
                        <span className="text-sm text-gray-500">
                          {ejemplar.sexo}
                        </span>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-2">
                        {ejemplar.edad && (
                          <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
                            Edad: {ejemplar.edad}
                          </span>
                        )}

                        {ejemplar.andar && (
                          <span className="rounded-full bg-[#fff3c4] px-3 py-1 text-xs font-bold text-[#8a6a12]">
                            {ejemplar.andar}
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
                    </div>
                  </Link>

                  <div className="p-5">
                    <div className="border-t pt-4">
                      <p className="text-xs font-bold uppercase text-gray-400">
                        Precio
                      </p>

                      <div className="mt-1 flex items-center justify-between gap-3">
                        <strong>
                          {esVendido
                            ? "Vendido"
                            : formatPrice(ejemplar.precio)}
                        </strong>

                        {!esVendido && (
                          <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-xl bg-green-500 px-4 py-2 text-sm font-bold text-white transition hover:bg-green-600"
                          >
                            WhatsApp
                          </a>
                        )}

                        {esVendido && (
                          <span className="rounded-xl bg-red-100 px-4 py-2 text-sm font-bold text-red-700">
                            No disponible
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </section>
        </div>

        {ejemplaresFiltrados.length === 0 && (
          <div className="mt-10 rounded-3xl border border-dashed bg-white p-10 text-center text-gray-500">
            No se encontraron ejemplares.
          </div>
        )}
      </section>

      <footer className="mt-20 border-t bg-white">
        <div className="mx-auto max-w-6xl px-6 py-10 text-center">
          <img
            src="/logo.png"
            alt="Portal Equino"
            className="mx-auto h-16 w-16 rounded-full object-cover"
          />

          <h3 className="mt-3 text-lg font-bold">Portal Equino</h3>

          <p className="mt-2 text-sm text-gray-500">
            El Portal de los Mejores Ejemplares Criollos Colombianos.
          </p>

          <div className="mt-4 flex justify-center gap-6 text-sm font-semibold text-gray-600">
            <button
              type="button"
              onClick={bajarAEjemplares}
              className="hover:text-black"
            >
              Ejemplares
            </button>

            <Link href="/vendidos">Vendidos</Link>
            <Link href="/contactanos">Contáctanos</Link>
          </div>

          <p className="mt-6 text-xs text-gray-400">
            © 2026 Portal Equino. Todos los derechos reservados.
          </p>
        </div>
      </footer>

      <a
        href="https://wa.me/573247595574"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-20 right-5 z-30 rounded-full bg-green-500 px-4 py-3 text-sm font-bold text-white shadow-xl transition hover:bg-green-600 md:bottom-6 md:right-6 md:z-50 md:px-5 md:py-4"
      >
        WhatsApp
      </a>
    </main>
  );
}