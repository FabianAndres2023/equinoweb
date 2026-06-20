"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);

  async function iniciarSesion(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setMensaje("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setMensaje("Correo o contraseña incorrectos");
      return;
    }

    router.push("/admin");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#f8f7f3] to-[#ece8dd] p-6">
      <div className="w-full max-w-md rounded-[32px] bg-white p-10 shadow-xl">

        {/* Logo */}
        <div className="text-center">
          <img
            src="/logo.png"
            alt="Portal Equino"
            className="mx-auto h-28 w-28 rounded-full object-cover shadow-lg"
          />

          <h1 className="mt-5 text-5xl font-extrabold tracking-tight text-black">
            Portal Equino
          </h1>

          <p className="mt-3 text-lg text-gray-500">
            Acceso al panel administrativo
          </p>
        </div>

        {/* Formulario */}
        <form
          onSubmit={iniciarSesion}
          className="mt-10 space-y-5"
        >
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="
              w-full
              rounded-2xl
              border-2
              border-gray-300
              bg-white
              px-5
              py-4
              text-lg
              text-gray-900
              placeholder:text-gray-500
              outline-none
              transition
              focus:border-[#b68a22]
              focus:ring-4
              focus:ring-[#b68a22]/20
            "
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="
              w-full
              rounded-2xl
              border-2
              border-gray-300
              bg-white
              px-5
              py-4
              text-lg
              text-gray-900
              placeholder:text-gray-500
              outline-none
              transition
              focus:border-[#b68a22]
              focus:ring-4
              focus:ring-[#b68a22]/20
            "
          />

          <button
            type="submit"
            disabled={loading}
            className="
              w-full
              rounded-2xl
              bg-[#b68a22]
              py-4
              text-lg
              font-bold
              text-white
              shadow-md
              transition
              hover:bg-[#9d761a]
              disabled:opacity-60
            "
          >
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>

        {/* Error */}
        {mensaje && (
          <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-center text-sm font-medium text-red-600">
            {mensaje}
          </div>
        )}

        {/* Footer */}
        <div className="mt-10 border-t pt-5 text-center">
          <p className="text-sm text-gray-400">
            Portal Equino © 2026
          </p>
        </div>
      </div>
    </main>
  );
}