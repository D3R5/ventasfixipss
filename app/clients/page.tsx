"use client";

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
    setClients((prev) =>
      prev.map((c) => (c.id === editingId ? updated : c))
    );
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

if (loading) return <div>Cargando clientes...</div>;
if (error) return <div className="text-red-600">Error: {error}</div>;

return ( <div className="max-w-3xl mx-auto p-4"> <h1 className="text-2xl font-bold mb-4">Clientes</h1>


  {/* FORM */}
  <form onSubmit={handleSubmit} className="space-y-2 mb-6">
    <input
      placeholder="RUT empresa"
      value={form.rut_empresa}
      onChange={(e) =>
        setForm({ ...form, rut_empresa: e.target.value })
      }
      className="border p-2 w-full"
    />

    <input
      placeholder="Razón social"
      value={form.razon_social}
      onChange={(e) =>
        setForm({ ...form, razon_social: e.target.value })
      }
      className="border p-2 w-full"
    />

    <input
      placeholder="Rubro"
      value={form.rubro}
      onChange={(e) => setForm({ ...form, rubro: e.target.value })}
      className="border p-2 w-full"
    />

    <input
      placeholder="Teléfono"
      value={form.telefono}
      onChange={(e) =>
        setForm({ ...form, telefono: e.target.value })
      }
      className="border p-2 w-full"
    />

    <input
      placeholder="Dirección"
      value={form.direccion}
      onChange={(e) =>
        setForm({ ...form, direccion: e.target.value })
      }
      className="border p-2 w-full"
    />

    <input
      placeholder="Nombre contacto"
      value={form.nombre_contacto}
      onChange={(e) =>
        setForm({ ...form, nombre_contacto: e.target.value })
      }
      className="border p-2 w-full"
    />

    <input
      placeholder="Email contacto"
      value={form.email_contacto}
      onChange={(e) =>
        setForm({ ...form, email_contacto: e.target.value })
      }
      className="border p-2 w-full"
    />

    <button className="bg-blue-600 text-white px-4 py-2 rounded">
      {editingId ? "Actualizar" : "Crear"}
    </button>
  </form>

  {/* LISTADO */}
  <ul className="space-y-2">
    {clients.map((c) => (
      <li key={c.id} className="p-3 border rounded">
        <div className="font-semibold">
          {c.razon_social} ({c.rut_empresa})
        </div>

        <div className="text-sm">
          {c.nombre_contacto} — {c.email_contacto}
        </div>

        <div className="flex gap-2 mt-2">
          <button
            onClick={() => handleEdit(c)}
            className="bg-yellow-500 text-white px-2 py-1 rounded"
          >
            Editar
          </button>

          <button
            onClick={() => handleDelete(c.id)}
            className="bg-red-600 text-white px-2 py-1 rounded"
          >
            Eliminar
          </button>
        </div>
      </li>
    ))}
  </ul>
</div>


);
}
