"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

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

const ubicacionesRapidas = [
  "Tuluá, Valle del Cauca",
  "Cali, Valle del Cauca",
  "Buga, Valle del Cauca",
  "Palmira, Valle del Cauca",
  "Cartago, Valle del Cauca",
  "Otra",
];

export default function AdminPage() {
  const router = useRouter();

  const [cargandoSesion, setCargandoSesion] = useState(true);
  const [adminEmail, setAdminEmail] = useState("");
  const [tab, setTab] = useState<"crear" | "gestionar">("gestionar");
  const [busqueda, setBusqueda] = useState("");

  const [ejemplares, setEjemplares] = useState<Ejemplar[]>([]);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [imagenes, setImagenes] = useState<string[]>([]);
  const [mensaje, setMensaje] = useState("");
  const [ubicacionTipo, setUbicacionTipo] = useState("");

  const [eliminandoId, setEliminandoId] = useState<string | null>(null);
  const [eliminandoNombre, setEliminandoNombre] = useState("");

  const [form, setForm] = useState({
    nombre: "",
    ubicacion: "",
    precio: "",
    edad: "",
    descripcion: "",
    sexo: "",
    andar: "",
    estado: "Disponible",
  });

  const ejemplaresFiltrados = useMemo(() => {
    const texto = busqueda.toLowerCase().trim();

    if (!texto) return ejemplares;

    return ejemplares.filter((ejemplar) => {
      return (
        ejemplar.nombre?.toLowerCase().includes(texto) ||
        ejemplar.ubicacion?.toLowerCase().includes(texto) ||
        ejemplar.andar?.toLowerCase().includes(texto) ||
        ejemplar.estado?.toLowerCase().includes(texto) ||
        ejemplar.edad?.toLowerCase().includes(texto)
      );
    });
  }, [busqueda, ejemplares]);

  useEffect(() => {
    const verificarSesion = async () => {
      const { data } = await supabase.auth.getSession();

      if (!data.session) {
        router.push("/admin/login");
        return;
      }

      setAdminEmail(data.session.user.email || "");
      setCargandoSesion(false);
      cargarEjemplares();
    };

    verificarSesion();
  }, [router]);

  const cerrarSesion = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  const cargarEjemplares = async () => {
    const { data } = await supabase
      .from("ejemplares")
      .select("*")
      .order("created_at", { ascending: false });

    setEjemplares((data || []) as Ejemplar[]);
  };

  const limpiar = () => {
    setEditandoId(null);
    setImagenes([]);
    setMensaje("");
    setUbicacionTipo("");

    setForm({
      nombre: "",
      ubicacion: "",
      precio: "",
      edad: "",
      descripcion: "",
      sexo: "",
      andar: "",
      estado: "Disponible",
    });
  };

  const nuevoEjemplar = () => {
    limpiar();
    setTab("crear");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const cambiarUbicacion = (value: string) => {
    setUbicacionTipo(value);

    if (value === "Otra") {
      setForm((prev) => ({ ...prev, ubicacion: "" }));
    } else {
      setForm((prev) => ({ ...prev, ubicacion: value }));
    }
  };

  const subirImagenes = async (files: FileList | null) => {
    if (!files) return;

    setMensaje("Subiendo imágenes...");

    const urls: string[] = [];

    for (const file of Array.from(files)) {
      const data = new FormData();

      data.append("file", file);
      data.append(
        "upload_preset",
        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
      );

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: data,
        }
      );

      const json = await res.json();

      if (json.secure_url) {
        urls.push(json.secure_url);
      }
    }

    setImagenes((prev) => [...prev, ...urls]);
    setMensaje("Imágenes subidas correctamente");
  };

  const guardarEjemplar = async (e: React.FormEvent) => {
    e.preventDefault();

    setMensaje("Guardando...");

    const payload = {
      ...form,
      precio: form.precio ? Number(form.precio) : null,
      edad: form.edad || null,
      imagenes,
    };

    const result = editandoId
      ? await supabase.from("ejemplares").update(payload).eq("id", editandoId)
      : await supabase.from("ejemplares").insert([payload]);

    if (result.error) {
      setMensaje("Error: " + result.error.message);
      return;
    }

    setMensaje(
      editandoId
        ? "Ejemplar actualizado correctamente"
        : "Ejemplar creado correctamente"
    );

    limpiar();
    await cargarEjemplares();
    setTab("gestionar");
  };

  const editar = (ejemplar: Ejemplar) => {
    setEditandoId(ejemplar.id);
    setImagenes(ejemplar.imagenes || []);
    setMensaje("");

    const ubicacionGuardada = ejemplar.ubicacion || "";
    const esUbicacionRapida = ubicacionesRapidas.includes(ubicacionGuardada);

    setUbicacionTipo(
      esUbicacionRapida ? ubicacionGuardada : ubicacionGuardada ? "Otra" : ""
    );

    setForm({
      nombre: ejemplar.nombre || "",
      ubicacion: ubicacionGuardada,
      precio: ejemplar.precio ? String(ejemplar.precio) : "",
      edad: ejemplar.edad || "",
      descripcion: ejemplar.descripcion || "",
      sexo: ejemplar.sexo || "",
      andar: ejemplar.andar || "",
      estado: ejemplar.estado || "Disponible",
    });

    setTab("crear");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cambiarEstado = async (ejemplar: Ejemplar) => {
    const nuevoEstado =
      ejemplar.estado === "Vendido" ? "Disponible" : "Vendido";

    await supabase
      .from("ejemplares")
      .update({ estado: nuevoEstado })
      .eq("id", ejemplar.id);

    cargarEjemplares();
  };

  const abrirModalEliminar = (ejemplar: Ejemplar) => {
    setEliminandoId(ejemplar.id);
    setEliminandoNombre(ejemplar.nombre);
  };

  const cerrarModalEliminar = () => {
    setEliminandoId(null);
    setEliminandoNombre("");
  };

  const confirmarEliminar = async () => {
    if (!eliminandoId) return;

    setMensaje("Eliminando...");

    await supabase.from("ejemplares").delete().eq("id", eliminandoId);

    cerrarModalEliminar();
    await cargarEjemplares();
    setMensaje("Ejemplar eliminado correctamente");
  };

  const estadoClase = (estado: string | null) => {
    if (estado === "Vendido") return "bg-red-100 text-red-700";
    if (estado === "Reservado") return "bg-yellow-100 text-yellow-700";
    return "bg-green-100 text-green-700";
  };

  if (cargandoSesion) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f8f7f3] text-black">
        <p className="font-semibold">Verificando acceso...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8f7f3] p-8 text-black">
      <section className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Panel Administrador</h1>

            <p className="text-gray-600">
              Crear, editar, vender o eliminar ejemplares.
            </p>

            {adminEmail && (
              <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#fff3c4] px-4 py-2 text-sm font-semibold text-[#8a6a12]">
                👤 {adminEmail}
              </div>
            )}
          </div>

          <button
            onClick={cerrarSesion}
            className="rounded-xl border bg-white px-5 py-3 font-bold shadow-sm"
          >
            Cerrar sesión
          </button>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Total ejemplares</p>
            <h2 className="mt-2 text-3xl font-extrabold">
              {ejemplares.length}
            </h2>
          </div>

          <div className="rounded-3xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Disponibles</p>
            <h2 className="mt-2 text-3xl font-extrabold text-green-600">
              {ejemplares.filter((e) => e.estado !== "Vendido").length}
            </h2>
          </div>

          <div className="rounded-3xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Vendidos</p>
            <h2 className="mt-2 text-3xl font-extrabold text-red-600">
              {ejemplares.filter((e) => e.estado === "Vendido").length}
            </h2>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 rounded-3xl bg-white p-3 shadow-sm md:flex-row">
          <button
            type="button"
            onClick={nuevoEjemplar}
            className={`flex-1 rounded-2xl px-5 py-3 font-bold transition ${
              tab === "crear"
                ? "bg-black text-white"
                : "bg-[#f8f7f3] text-gray-700 hover:bg-gray-100"
            }`}
          >
            ➕ {editandoId ? "Editar ejemplar" : "Crear ejemplar"}
          </button>

          <button
            type="button"
            onClick={() => {
              setTab("gestionar");
              setMensaje("");
            }}
            className={`flex-1 rounded-2xl px-5 py-3 font-bold transition ${
              tab === "gestionar"
                ? "bg-black text-white"
                : "bg-[#f8f7f3] text-gray-700 hover:bg-gray-100"
            }`}
          >
            📋 Gestionar ejemplares
          </button>
        </div>

        {tab === "crear" && (
          <form
            onSubmit={guardarEjemplar}
            className="mt-8 grid gap-4 rounded-3xl bg-white p-6 shadow"
          >
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-xl font-bold">
                  {editandoId ? "Editar ejemplar" : "Crear nuevo ejemplar"}
                </h2>
                <p className="text-sm text-gray-500">
                  Completa la información del ejemplar y guarda los cambios.
                </p>
              </div>

              {editandoId && (
                <button
                  className="rounded-xl border px-5 py-3 font-bold"
                  type="button"
                  onClick={limpiar}
                >
                  Cancelar edición
                </button>
              )}
            </div>

            <input
              className="rounded-xl border p-3"
              name="nombre"
              placeholder="Nombre del ejemplar"
              value={form.nombre}
              onChange={handleChange}
              required
            />

            <select
              className="rounded-xl border p-3"
              value={ubicacionTipo}
              onChange={(e) => cambiarUbicacion(e.target.value)}
            >
              <option value="">Seleccionar ubicación</option>
              {ubicacionesRapidas.map((ubicacion) => (
                <option key={ubicacion} value={ubicacion}>
                  {ubicacion}
                </option>
              ))}
            </select>

            {ubicacionTipo === "Otra" && (
              <input
                className="rounded-xl border p-3"
                name="ubicacion"
                placeholder="Escriba la ciudad y departamento"
                value={form.ubicacion}
                onChange={handleChange}
              />
            )}

            <div>
              <input
                className="w-full rounded-xl border p-3"
                name="precio"
                placeholder="Precio. Ej: 25000000"
                type="number"
                value={form.precio}
                onChange={handleChange}
              />

              {form.precio && (
                <p className="mt-1 text-sm font-semibold text-green-600">
                  Vista previa:{" "}
                  {Number(form.precio).toLocaleString("es-CO", {
                    style: "currency",
                    currency: "COP",
                    maximumFractionDigits: 0,
                  })}
                </p>
              )}
            </div>

            <input
              className="rounded-xl border p-3"
              name="edad"
              placeholder="Edad. Ej: 3 años, 18 meses, 5 años"
              value={form.edad}
              onChange={handleChange}
            />

            <select
              className="rounded-xl border p-3"
              name="sexo"
              value={form.sexo}
              onChange={handleChange}
            >
              <option value="">Seleccionar sexo</option>
              <option value="Macho">Macho</option>
              <option value="Hembra">Hembra</option>
            </select>

            <select
              className="rounded-xl border p-3"
              name="andar"
              value={form.andar}
              onChange={handleChange}
            >
              <option value="">Seleccionar andar</option>
              <option value="Paso Fino">Paso Fino</option>
              <option value="Trocha">Trocha</option>
              <option value="Trocha y Galope">Trocha y Galope</option>
              <option value="Trote y Galope">Trote y Galope</option>
            </select>

            <select
              className="rounded-xl border p-3"
              name="estado"
              value={form.estado}
              onChange={handleChange}
            >
              <option value="Disponible">Disponible</option>
              <option value="Reservado">Reservado</option>
              <option value="Vendido">Vendido</option>
            </select>

            <textarea
              className="rounded-xl border p-3"
              name="descripcion"
              placeholder="Descripción breve del ejemplar"
              value={form.descripcion}
              onChange={handleChange}
            />

            <label className="flex cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-gray-300 bg-gray-50 p-10 text-center transition hover:border-[#b68a22] hover:bg-[#fffdf7]">
              <div className="mb-4 text-5xl">📸</div>

              <h3 className="text-lg font-bold text-gray-800">
                Subir imágenes del ejemplar
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                Haz clic aquí para seleccionar una o varias fotografías
              </p>

              <p className="mt-1 text-xs text-gray-400">JPG, PNG, WEBP</p>

              <input
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={(e) => subirImagenes(e.target.files)}
              />
            </label>

            {imagenes.length > 0 && (
              <>
                <h3 className="mt-2 text-lg font-bold">Imágenes cargadas</h3>

                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  {imagenes.map((url, index) => (
                    <div
                      key={url}
                      className="group relative overflow-hidden rounded-2xl border bg-white shadow-sm"
                    >
                      <img
                        src={url}
                        alt={`Imagen ${index + 1}`}
                        className="h-40 w-full object-cover transition group-hover:scale-105"
                      />

                      <div className="absolute left-2 top-2 rounded-full bg-black/70 px-3 py-1 text-xs font-bold text-white">
                        Foto {index + 1}
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          setImagenes(imagenes.filter((_, i) => i !== index))
                        }
                        className="absolute right-2 top-2 rounded-full bg-red-600 px-2 py-1 text-xs font-bold text-white"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}

            <button
              className="rounded-xl bg-black px-5 py-3 font-bold text-white"
              type="submit"
            >
              {editandoId ? "Actualizar ejemplar" : "Guardar ejemplar"}
            </button>

            {mensaje && <p className="font-semibold">{mensaje}</p>}
          </form>
        )}

        {tab === "gestionar" && (
          <section className="mt-8 rounded-3xl bg-white p-6 shadow">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-xl font-bold">Gestionar ejemplares</h2>
                <p className="text-sm text-gray-500">
                  Busca, edita, cambia estado o elimina ejemplares.
                </p>
              </div>

              <button
                onClick={nuevoEjemplar}
                className="rounded-xl bg-black px-5 py-3 font-bold text-white"
              >
                ➕ Nuevo ejemplar
              </button>
            </div>

            <input
              type="text"
              placeholder="Buscar por nombre, ubicación, edad, andar o estado..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="mt-5 w-full rounded-xl border p-3"
            />

            <div className="mt-5 grid gap-4">
              {ejemplaresFiltrados.map((ejemplar) => (
                <div
                  key={ejemplar.id}
                  className="flex flex-col gap-4 rounded-2xl border p-4 md:flex-row md:items-center md:justify-between"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={ejemplar.imagenes?.[0] || "/logo.png"}
                      className="h-20 w-28 rounded-xl object-cover"
                      alt={ejemplar.nombre}
                    />

                    <div>
                      <h3 className="font-bold">{ejemplar.nombre}</h3>
                      <p className="text-sm text-gray-500">
                        {ejemplar.ubicacion || "Sin ubicación"}
                      </p>

                      <div className="mt-2 flex flex-wrap gap-2">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${estadoClase(
                            ejemplar.estado
                          )}`}
                        >
                          {ejemplar.estado || "Disponible"}
                        </span>

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
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => editar(ejemplar)}
                      className="rounded-xl border px-4 py-2 font-semibold"
                    >
                      Editar
                    </button>

                    <button
                      onClick={() => cambiarEstado(ejemplar)}
                      className="rounded-xl bg-yellow-500 px-4 py-2 font-bold text-white"
                    >
                      {ejemplar.estado === "Vendido"
                        ? "Marcar disponible"
                        : "Marcar vendido"}
                    </button>

                    <button
                      onClick={() => abrirModalEliminar(ejemplar)}
                      className="rounded-xl bg-red-600 px-4 py-2 font-bold text-white"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}

              {ejemplaresFiltrados.length === 0 && (
                <div className="rounded-2xl border border-dashed p-8 text-center text-gray-500">
                  No se encontraron ejemplares.
                </div>
              )}
            </div>
          </section>
        )}
      </section>

      {eliminandoId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-6">
          <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-2xl">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-3xl">
              🗑️
            </div>

            <h2 className="mt-5 text-2xl font-extrabold text-black">
              ¿Eliminar ejemplar?
            </h2>

            <p className="mt-3 text-gray-600">
              Vas a eliminar <b>{eliminandoNombre}</b>. Esta acción no se puede
              deshacer.
            </p>

            <div className="mt-8 flex gap-3">
              <button
                onClick={cerrarModalEliminar}
                className="flex-1 rounded-2xl border bg-white px-5 py-3 font-bold"
              >
                Cancelar
              </button>

              <button
                onClick={confirmarEliminar}
                className="flex-1 rounded-2xl bg-red-600 px-5 py-3 font-bold text-white"
              >
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}