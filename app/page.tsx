import Link from "next/link";
import { supabase } from "../lib/supabase";

type Ejemplar = {
  id: string;
  nombre: string;
  ubicacion: string | null;
  precio: number | null;
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

export default async function Home() {
  const { data } = await supabase
    .from("ejemplares")
    .select("*")
    .order("created_at", { ascending: false });

  const ejemplares = (data || []) as Ejemplar[];

  return (
    <main className="min-h-screen bg-[#f8f7f3] text-[#171717]">
      <header className="border-b bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="Portal Equino"
              className="h-12 w-12 rounded-full object-cover"
            />

            <div>
              <h1 className="font-bold">Portal Equino</h1>
              <p className="text-xs text-gray-500">El Portal de los Mejores</p>
            </div>
          </div>

          <nav className="hidden gap-8 text-sm text-gray-600 md:flex">
            <span>Ejemplares</span>
            <span>Criaderos</span>
            <span>Eventos</span>
            <span>Vendidos</span>
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-8">
        <input
          placeholder="Buscar por nombre, padre, madre o criadero..."
          className="w-full rounded-2xl border bg-white px-5 py-4 shadow-sm outline-none"
        />

        <div className="mt-4 flex flex-wrap gap-3">
          {[
            "Todos los andares",
            "Paso Fino",
            "Trocha",
            "Trocha y Galope",
            "Trote y Galope",
            "Precio · Ubicación",
          ].map((item, index) => (
            <button
              key={item}
              className={`rounded-full border px-5 py-2 text-sm shadow-sm ${
                index === 0 ? "bg-black text-white" : "bg-white text-gray-700"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="mt-10">
          <p className="text-sm font-bold uppercase tracking-widest text-[#b68a22]">
            Vitrina · Caballo Criollo
          </p>

          <h2 className="mt-3 text-4xl font-extrabold leading-tight md:text-5xl">
            Los mejores ejemplares, <br />
            <span className="text-[#b68a22]">indexados para siempre.</span>
          </h2>

          <p className="mt-4 text-gray-600">
            Busca, filtra y contacta al propietario en un toque. Sin perderse en
            el feed.
          </p>

          <div className="mt-5 flex gap-5 text-sm">
            <span>
              <b>{ejemplares.length}</b> ejemplares
            </span>
            <span className="text-green-600">● Actualizado hoy</span>
          </div>
        </div>

        <section className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {ejemplares.map((ejemplar) => {
            const imagen =
              ejemplar.imagenes && ejemplar.imagenes.length > 0
                ? ejemplar.imagenes[0]
                : "/logo.png";

            const whatsappUrl = `https://wa.me/573247595574?text=${encodeURIComponent(
              `Hola, estoy interesado en el ejemplar ${ejemplar.nombre}`
            )}`;

            return (
              <article
                key={ejemplar.id}
                className="overflow-hidden rounded-3xl border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <Link href={`/ejemplar/${ejemplar.id}`} className="block">
                  <div className="relative h-64 bg-gray-100">
                    <img
                      src={imagen}
                      alt={ejemplar.nombre}
                      className="h-full w-full object-cover"
                    />

                    <span className="absolute left-4 top-4 rounded-lg bg-white px-3 py-1 text-xs font-semibold">
                      <span
                        className={
                          ejemplar.estado === "Vendido"
                            ? "text-red-500"
                            : "text-green-500"
                        }
                      >
                        ●
                      </span>{" "}
                      {ejemplar.estado || "Disponible"}
                    </span>

                    {ejemplar.andar && (
                      <span className="absolute right-4 top-4 rounded-lg bg-[#fff3c4] px-3 py-1 text-xs font-semibold text-[#8a6a12]">
                        {ejemplar.andar}
                      </span>
                    )}
                  </div>

                  <div className="p-5 pb-0">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-lg font-bold">{ejemplar.nombre}</h3>
                      <span className="text-sm text-gray-500">
                        {ejemplar.sexo}
                      </span>
                    </div>

                    <p className="mt-2 text-sm text-gray-500">
                      📍 {ejemplar.ubicacion || "Sin ubicación"}
                    </p>
                  </div>
                </Link>

                <div className="p-5">
                  <div className="border-t pt-4">
                    <p className="text-xs font-bold uppercase text-gray-400">
                      Pedido
                    </p>

                    <div className="mt-1 flex items-center justify-between">
                      <strong>{formatPrice(ejemplar.precio)}</strong>

                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-xl bg-green-500 px-4 py-2 text-sm font-bold text-white"
                      >
                        WhatsApp
                      </a>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      </section>
    </main>
  );
}