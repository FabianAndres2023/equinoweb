"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

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

export default function AdminPage() {
  const [ejemplares, setEjemplares] = useState<Ejemplar[]>([]);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [imagenes, setImagenes] = useState<string[]>([]);
  const [mensaje, setMensaje] = useState("");

  const [form, setForm] = useState({
    nombre: "",
    ubicacion: "",
    precio: "",
    descripcion: "",
    sexo: "",
    andar: "",
    estado: "Disponible",
  });

  const cargarEjemplares = async () => {
    const { data } = await supabase
      .from("ejemplares")
      .select("*")
      .order("created_at", { ascending: false });

    setEjemplares((data || []) as Ejemplar[]);
  };

  useEffect(() => {
    cargarEjemplares();
  }, []);

  const limpiar = () => {
    setEditandoId(null);
    setImagenes([]);
    setMensaje("");

    setForm({
      nombre: "",
      ubicacion: "",
      precio: "",
      descripcion: "",
      sexo: "",
      andar: "",
      estado: "Disponible",
    });
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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
    cargarEjemplares();
  };

  const editar = (ejemplar: Ejemplar) => {
    setEditandoId(ejemplar.id);
    setImagenes(ejemplar.imagenes || []);
    setMensaje("");

    setForm({
      nombre: ejemplar.nombre || "",
      ubicacion: ejemplar.ubicacion || "",
      precio: ejemplar.precio ? String(ejemplar.precio) : "",
      descripcion: ejemplar.descripcion || "",
      sexo: ejemplar.sexo || "",
      andar: ejemplar.andar || "",
      estado: ejemplar.estado || "Disponible",
    });

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

  const eliminar = async (id: string) => {
    const ok = confirm("¿Seguro que deseas eliminar este ejemplar?");
    if (!ok) return;

    await supabase.from("ejemplares").delete().eq("id", id);
    cargarEjemplares();
  };

  return (
    <main className="min-h-screen bg-[#f8f7f3] p-8 text-black">
      <section className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold">Panel Administrador</h1>

        <p className="text-gray-600">
          Crear, editar, vender o eliminar ejemplares.
        </p>

        <form
          onSubmit={guardarEjemplar}
          className="mt-8 grid gap-4 rounded-3xl bg-white p-6 shadow"
        >
          <h2 className="text-xl font-bold">
            {editandoId ? "Editar ejemplar" : "Crear nuevo ejemplar"}
          </h2>

          <input
            className="rounded-xl border p-3"
            name="nombre"
            placeholder="Nombre"
            value={form.nombre}
            onChange={handleChange}
            required
          />

          <input
            className="rounded-xl border p-3"
            name="ubicacion"
            placeholder="Ubicación"
            value={form.ubicacion}
            onChange={handleChange}
          />

          <input
            className="rounded-xl border p-3"
            name="precio"
            placeholder="Precio"
            type="number"
            value={form.precio}
            onChange={handleChange}
          />

          <select
            className="rounded-xl border p-3"
            name="sexo"
            value={form.sexo}
            onChange={handleChange}
          >
            <option value="">Sexo</option>
            <option value="Potro">Potro</option>
            <option value="Potranca">Potranca</option>
            <option value="Capón">Capón</option>
            <option value="Yegua">Yegua</option>
          </select>

          <select
            className="rounded-xl border p-3"
            name="andar"
            value={form.andar}
            onChange={handleChange}
          >
            <option value="">Andar</option>
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
            <option value="Vendido">Vendido</option>
          </select>

          <textarea
            className="rounded-xl border p-3"
            name="descripcion"
            placeholder="Descripción"
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

          <div className="flex gap-3">
            <button
              className="rounded-xl bg-black px-5 py-3 font-bold text-white"
              type="submit"
            >
              {editandoId ? "Actualizar ejemplar" : "Guardar ejemplar"}
            </button>

            {editandoId && (
              <button
                className="rounded-xl border px-5 py-3"
                type="button"
                onClick={limpiar}
              >
                Cancelar edición
              </button>
            )}
          </div>

          {mensaje && <p className="font-semibold">{mensaje}</p>}
        </form>

        <section className="mt-10 rounded-3xl bg-white p-6 shadow">
          <h2 className="text-xl font-bold">Ejemplares registrados</h2>

          <div className="mt-5 grid gap-4">
            {ejemplares.map((ejemplar) => (
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
                      {ejemplar.ubicacion}
                    </p>
                    <p className="text-sm">
                      Estado: <b>{ejemplar.estado}</b>
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => editar(ejemplar)}
                    className="rounded-xl border px-4 py-2"
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
                    onClick={() => eliminar(ejemplar.id)}
                    className="rounded-xl bg-red-600 px-4 py-2 font-bold text-white"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}