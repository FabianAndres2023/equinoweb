import Link from "next/link";

export default function ContactanosPage() {
  return (
    <main className="min-h-screen bg-[#f8f7f3] text-black">
      <div className="mx-auto max-w-4xl px-6 py-16">

        <div className="text-center">

          <img
            src="/logo.png"
            alt="Portal Equino"
            className="mx-auto h-36 w-36 rounded-full shadow-lg"
          />

          <h1 className="mt-6 text-5xl font-extrabold">
            Portal Equino
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-lg text-gray-600">
            Portal Equino es una vitrina digital especializada en la
            publicación y promoción de ejemplares equinos de alta calidad,
            conectando compradores y vendedores de manera rápida,
            profesional y confiable.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">

            <a
              href="https://www.instagram.com/portalequino/"
              target="_blank"
              className="rounded-xl bg-pink-600 px-6 py-3 font-bold text-white"
            >
              Instagram
            </a>

            <a
              href="https://web.facebook.com/AlexPortalEquino"
              target="_blank"
              className="rounded-xl bg-blue-600 px-6 py-3 font-bold text-white"
            >
              Facebook
            </a>

            <a
              href="https://wa.me/573247595574"
              target="_blank"
              className="rounded-xl bg-green-500 px-6 py-3 font-bold text-white"
            >
              WhatsApp
            </a>
          </div>

          <Link
            href="/"
            className="mt-10 inline-block rounded-xl border bg-white px-6 py-3 font-bold"
          >
            ← Volver al inicio
          </Link>

        </div>
      </div>
    </main>
  );
}