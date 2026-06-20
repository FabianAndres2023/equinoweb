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
        <div className="grid gap-5 lg:grid-cols-[380px_1fr]">
          <section className="rounded-3xl border bg-white p-3 shadow-sm">
            <div className="relative h-[300px] w-full overflow-hidden rounded-2xl bg-gray-100">
              <img
                src={imagenes[0]}
                alt={ejemplar.nombre}
                className="h-full w-full object-cover"
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
            </div>

            {imagenes.length > 1 && (
              <div className="mt-3 grid grid-cols-4 gap-2">
                {imagenes.slice(0, 4).map((img: string, index: number) => (
                  <img
                    key={img}
                    src={img}
                    alt={`${ejemplar.nombre} ${index + 1}`}
                    className="h-14 w-full rounded-xl object-cover"
                  />
                ))}
              </div>
            )}
          </section>

          <section className="rounded-3xl border bg-white p-5 shadow-sm">
            <p className="text-[11px] font-bold uppercase tracking-widest text-[#b68a22]">
              Ficha del ejemplar
            </p>

            <div className="mt-2 flex items-start justify-between gap-4 border-b pb-4">
              <div>
                <h2 className="text-3xl font-extrabold leading-tight">
                  {ejemplar.nombre}
                </h2>

                <p className="mt-1 text-sm text-gray-600">
                  📍 {ejemplar.ubicacion || "Sin ubicación registrada"}
                </p>
              </div>

              <div className="min-w-[140px] rounded-2xl bg-[#f8f7f3] px-4 py-3 text-right">
                <p className="text-[10px] font-bold uppercase text-gray-400">
                  Precio
                </p>

                <h3 className="text-2xl font-extrabold text-[#b68a22]">
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

              <div className="rounded-2xl bg-[#f8f7f3] p-3">
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
    </main>
  );
}