import Link from "next/link";
import { supabase } from "../../../lib/supabase";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

function formatPrice(value: number | null) {
  if (!value) return "Consultar";

  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(value);
}

export default async function EjemplarPage({ params }: Props) {
  const { id } = await params;

  const { data: ejemplar } = await supabase
    .from("ejemplares")
    .select("*")
    .eq("id", id)
    .single();

  if (!ejemplar) {
    return (
      <main className="min-h-screen bg-[#f8f7f3] p-10 text-black">
        <h1 className="text-2xl font-bold">Ejemplar no encontrado</h1>
      </main>
    );
  }

  const imagenes =
    ejemplar.imagenes && ejemplar.imagenes.length > 0
      ? ejemplar.imagenes
      : ["/logo.png"];

  const whatsappUrl = `https://wa.me/573247595574?text=${encodeURIComponent(
    `Hola, estoy interesado en el ejemplar ${ejemplar.nombre}`
  )}`;

  return (
    <main className="min-h-screen bg-[#f8f7f3] text-[#171717]">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <Link href="/" className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="Portal Equino"
              className="h-10 w-10 rounded-full object-cover"
            />
            <div>
              <h1 className="font-bold leading-tight">Portal Equino</h1>
              <p className="text-xs text-gray-500">El Portal de los Mejores</p>
            </div>
          </Link>

          <Link
            href="/"
            className="rounded-full border bg-white px-5 py-2 text-sm font-semibold shadow-sm"
          >
            ← Volver
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-4">
        <div className="mb-4">
          <p className="text-xs font-bold uppercase tracking-widest text-[#b68a22]">
            Ficha del ejemplar
          </p>

          <h2 className="mt-1 text-3xl font-extrabold md:text-4xl">
            {ejemplar.nombre}
          </h2>

          <p className="mt-1 text-sm text-gray-600">
            📍 {ejemplar.ubicacion || "Sin ubicación registrada"}
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <section className="rounded-3xl border bg-white p-3 shadow-sm">
            <div className="overflow-hidden rounded-2xl bg-gray-100">
              <img
                src={imagenes[0]}
                alt={ejemplar.nombre}
                className="h-[260px] w-full object-cover"
              />
            </div>

            {imagenes.length > 1 && (
              <div className="mt-3 grid grid-cols-4 gap-2">
                {imagenes.map((img: string, index: number) => (
                  <img
                    key={img}
                    src={img}
                    alt={`${ejemplar.nombre} ${index + 1}`}
                    className="h-16 w-full rounded-xl object-cover"
                  />
                ))}
              </div>
            )}
          </section>

          <aside className="space-y-4">
            <div className="rounded-3xl border bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span
                  className={`rounded-full px-4 py-2 text-sm font-bold ${
                    ejemplar.estado === "Vendido"
                      ? "bg-red-100 text-red-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  ● {ejemplar.estado || "Disponible"}
                </span>

                {ejemplar.andar && (
                  <span className="rounded-full bg-[#fff3c4] px-4 py-2 text-sm font-bold text-[#8a6a12]">
                    {ejemplar.andar}
                  </span>
                )}
              </div>

              <div className="mt-5">
                <p className="text-xs font-bold uppercase text-gray-400">
                  Pedido
                </p>

                <h3 className="mt-1 text-3xl font-extrabold text-[#b68a22]">
                  {formatPrice(ejemplar.precio)}
                </h3>
              </div>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 rounded-2xl bg-green-500 px-5 py-3 text-center text-base font-bold text-white shadow-sm transition hover:bg-green-600"
                >
                  Contactar por WhatsApp
                </a>

                <Link
                  href="/"
                  className="rounded-2xl border bg-white px-5 py-3 text-center text-base font-bold"
                >
                  Ver más
                </Link>
              </div>
            </div>

            <div className="rounded-3xl border bg-white p-5 shadow-sm">
              <h3 className="text-lg font-bold">Información</h3>

              <div className="mt-4 grid gap-2 text-sm">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-500">Sexo</span>
                  <strong>{ejemplar.sexo || "No registrado"}</strong>
                </div>

                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-500">Andar</span>
                  <strong>{ejemplar.andar || "No registrado"}</strong>
                </div>

                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-500">Estado</span>
                  <strong>{ejemplar.estado || "Disponible"}</strong>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">Ubicación</span>
                  <strong className="text-right">
                    {ejemplar.ubicacion || "No registrada"}
                  </strong>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border bg-white p-5 shadow-sm">
              <h3 className="text-lg font-bold">Descripción</h3>

              <p className="mt-3 text-sm leading-relaxed text-gray-700">
                {ejemplar.descripcion || "Sin descripción registrada."}
              </p>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}