'use client';

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Client = {
  id: number;
  rut_empresa: string;
  rubro: string;
  razon_social: string;
  telefono: string;
  direccion: string;
  nombre_contacto: string;
  email_contacto: string;
};

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    rut_empresa: "",
    rubro: "",
    razon_social: "",
    telefono: "",
    direccion: "",
    nombre_contacto: "",
    email_contacto: "",
  });

  const [editingId, setEditingId] = useState<number | null>(null);

  const router = useRouter();

  const getToken = () => localStorage.getItem("token");

  // 🔹 GET CLIENTS
  const fetchClients = async () => {
    try {
      const token = getToken();
      if (!token) {
        router.push("/login");
        return;
      }

      const res = await fetch("/api/clients", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        localStorage.removeItem("token");
        router.push("/login");
        return;
      }

      if (!res.ok) throw new Error("Error cargando clientes");
      const data = await res.json();
      setClients(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 🔹 CREATE
  const createClient = async (client: any) => {
    const res = await fetch("/api/clients", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(client),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Error creando cliente");
    }
    return res.json();
  };

  // updateClient
  const updateClient = async (id: number, client: any) => {
    const url = `/api/clients/${encodeURIComponent(id)}`;
    console.log("[DEBUG] UPDATE url:", url, "payload:", client);
    const res = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(client),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Error actualizando");
    }
    return res.json();
  };

  // deleteClient
  const deleteClient = async (id: number) => {
    const url = `/api/clients/${encodeURIComponent(id)}`;
    console.log("[DEBUG] DELETE url:", url);
    const res = await fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Error eliminando");
    }
    return res.json();
  };

  // 🔹 SUBMIT FORM
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingId !== null) {
        const updated = await updateClient(editingId, form);
        setClients((prev) => prev.map((c) => (c.id === editingId ? updated : c)));
        setEditingId(null);
      } else {
        const newClient = await createClient(form);
        setClients((prev) => [...prev, newClient]);
      }

      // limpiar form
      setForm({
        rut_empresa: "",
        rubro: "",
        razon_social: "",
        telefono: "",
        direccion: "",
        nombre_contacto: "",
        email_contacto: "",
      });
    } catch (err: any) {
      alert(err.message);
    }
  };

  // 🔹 EDIT
  const handleEdit = (client: Client) => {
    setForm({
      rut_empresa: client.rut_empresa,
      rubro: client.rubro,
      razon_social: client.razon_social,
      telefono: client.telefono,
      direccion: client.direccion,
      nombre_contacto: client.nombre_contacto,
      email_contacto: client.email_contacto,
    });
    setEditingId(client.id);
  };

  // 🔹 DELETE
  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar cliente?")) return;

    try {
      await deleteClient(id);
      setClients((prev) => prev.filter((c) => c.id !== id));
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (loading)
    return (
      <div className="min-h-[40vh] flex items-center justify-center p-6">
        <div className="text-sm text-slate-400">Cargando clientes...</div>
      </div>
    );

  if (error)
    return (
      <div className="max-w-3xl mx-auto p-4">
        <div className="rounded-md bg-rose-900/20 border border-rose-800 p-4 text-rose-100">
          <strong className="block">Error:</strong>
          <p className="mt-1 text-sm">{error}</p>
          <div className="mt-3">
            <button
              onClick={() => {
                setError(null);
                setLoading(true);
                fetchClients();
              }}
              className="px-3 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-md text-sm"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Clientes</h1>
        <div className="text-sm text-slate-400">Gestiona tus clientes y contactos</div>
      </div>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 mb-6 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            placeholder="RUT empresa"
            value={form.rut_empresa}
            onChange={(e) => setForm({ ...form, rut_empresa: e.target.value })}
            className="w-full bg-transparent border border-slate-700 rounded-md px-3 py-2 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <input
            placeholder="Razón social"
            value={form.razon_social}
            onChange={(e) => setForm({ ...form, razon_social: e.target.value })}
            className="w-full bg-transparent border border-slate-700 rounded-md px-3 py-2 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <input
            placeholder="Rubro"
            value={form.rubro}
            onChange={(e) => setForm({ ...form, rubro: e.target.value })}
            className="w-full bg-transparent border border-slate-700 rounded-md px-3 py-2 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <input
            placeholder="Teléfono"
            value={form.telefono}
            onChange={(e) => setForm({ ...form, telefono: e.target.value })}
            className="w-full bg-transparent border border-slate-700 rounded-md px-3 py-2 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <input
            placeholder="Dirección"
            value={form.direccion}
            onChange={(e) => setForm({ ...form, direccion: e.target.value })}
            className="sm:col-span-2 w-full bg-transparent border border-slate-700 rounded-md px-3 py-2 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <input
            placeholder="Nombre contacto"
            value={form.nombre_contacto}
            onChange={(e) => setForm({ ...form, nombre_contacto: e.target.value })}
            className="w-full bg-transparent border border-slate-700 rounded-md px-3 py-2 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <input
            placeholder="Email contacto"
            value={form.email_contacto}
            onChange={(e) => setForm({ ...form, email_contacto: e.target.value })}
            className="w-full bg-transparent border border-slate-700 rounded-md px-3 py-2 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="mt-4 flex items-center gap-3">
          <button type="submit" className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm">
            {editingId ? "Actualizar" : "Crear"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setForm({
                  rut_empresa: "",
                  rubro: "",
                  razon_social: "",
                  telefono: "",
                  direccion: "",
                  nombre_contacto: "",
                  email_contacto: "",
                });
              }}
              className="px-4 py-2 border border-slate-700 rounded-md text-sm text-slate-200 hover:bg-slate-800"
            >
              Cancelar edición
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              setLoading(true);
              fetchClients();
            }}
            className="ml-auto px-3 py-2 border border-slate-700 rounded-md text-sm text-slate-200 hover:bg-slate-800"
          >
            Refrescar
          </button>
        </div>
      </form>

      {/* LISTADO */}
      <ul className="grid gap-3">
        {clients.map((c) => (
          <li key={c.id} className="p-4 border rounded-lg bg-slate-900 border-slate-800 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <div className="font-semibold text-slate-100">
                  {c.razon_social} <span className="text-sm text-slate-500">({c.rut_empresa})</span>
                </div>
                <div className="text-sm text-slate-400 mt-1">{c.nombre_contacto} — {c.email_contacto}</div>
                <div className="text-xs text-slate-500 mt-1">{c.rubro} • {c.telefono} • {c.direccion}</div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(c)}
                  className="inline-flex items-center px-3 py-1 rounded-md bg-amber-500 hover:bg-amber-600 text-white text-sm"
                >
                  Editar
                </button>

                <button
                  onClick={() => handleDelete(c.id)}
                  className="inline-flex items-center px-3 py-1 rounded-md bg-rose-600 hover:bg-rose-700 text-white text-sm"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}