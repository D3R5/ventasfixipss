// app/(protected)/users/page.tsx  (o donde tengas la ruta)
// 'use client' ya incluido
'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type User = { id: number; rut: string; nombre: string; apellido?: string; email: string; createdAt?: string };

function fetchWithToken(input: RequestInfo, init?: RequestInit) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const headers: HeadersInit = { 'Content-Type': 'application/json', ...(init?.headers || {}) };
  if (token) (headers as any).Authorization = `Bearer ${token}`;
  return fetch(input, { ...init, headers });
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [form, setForm] = useState({ rut: '', nombre: '', apellido: '', email: '', password: '' });
  const router = useRouter();

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      router.push('/login');
      return;
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchWithToken('/api/users');
      if (res.status === 401) {
        localStorage.removeItem('token');
        router.push('/login');
        return;
      }
      if (!res.ok) {
        const b = await res.json().catch(() => ({}));
        throw new Error(b?.error || 'Error al cargar usuarios');
      }
      const data = await res.json();
      setUsers(data || []);
    } catch (err: any) {
      setError(err.message || 'Error de red');
    } finally {
      setLoading(false);
    }
  }

  function openCreate() {
    setForm({ rut: '', nombre: '', apellido: '', email: '', password: '' });
    setShowCreate(true);
    setShowEdit(false);
  }

  function openEdit(user: User) {
    setEditing(user);
    setForm({ rut: user.rut || '', nombre: user.nombre || '', apellido: user.apellido || '', email: user.email || '', password: '' });
    setShowEdit(true);
    setShowCreate(false);
  }

  async function handleCreate(e?: React.FormEvent) {
    if (e) e.preventDefault();
    setError(null);
    try {
      const res = await fetchWithToken('/api/users', {
        method: 'POST',
        body: JSON.stringify(form)
      });
      if (res.status === 401) {
        localStorage.removeItem('token');
        router.push('/login');
        return;
      }
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body?.error || 'Error creando usuario');
      setShowCreate(false);
      await load();
    } catch (err: any) {
      setError(err.message || 'Error al crear');
    }
  }

  async function handleUpdate(e?: React.FormEvent) {
    if (!editing) return;
    if (e) e.preventDefault();
    setError(null);
    try {
      const res = await fetchWithToken(`/api/users/${editing.id}`, {
        method: 'PUT',
        body: JSON.stringify(form)
      });
      if (res.status === 401) {
        localStorage.removeItem('token');
        router.push('/login');
        return;
      }
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body?.error || 'Error actualizando usuario');
      setShowEdit(false);
      setEditing(null);
      await load();
    } catch (err: any) {
      setError(err.message || 'Error al actualizar');
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Eliminar usuario?')) return;
    setError(null);
    try {
      const res = await fetchWithToken(`/api/users/${id}`, { method: 'DELETE' });
      if (res.status === 401) {
        localStorage.removeItem('token');
        router.push('/login');
        return;
      }
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body?.error || 'Error eliminando usuario');
      await load();
    } catch (err: any) {
      setError(err.message || 'Error al eliminar');
    }
  }

  if (loading) return <div>Cargando usuarios...</div>;
  if (error) return <div className="text-red-600">Error: {error}</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Usuarios</h1>
        <div>
          <button onClick={openCreate} className="px-3 py-1 bg-blue-600 text-white rounded">Crear usuario</button>
          <button onClick={load} className="ml-2 px-3 py-1 border rounded">Refrescar</button>
        </div>
      </div>

      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-slate-100">
            <th className="p-2 border">ID</th>
            <th className="p-2 border">RUT</th>
            <th className="p-2 border">Nombre</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td className="p-2 border">{u.id}</td>
              <td className="p-2 border">{u.rut}</td>
              <td className="p-2 border">{u.nombre} {u.apellido}</td>
              <td className="p-2 border">{u.email}</td>
              <td className="p-2 border">
                <button onClick={() => openEdit(u)} className="mr-2 px-2 py-1 border rounded">Editar</button>
                <button onClick={() => handleDelete(u.id)} className="px-2 py-1 border rounded text-red-600">Eliminar</button>
              </td>
            </tr>
          ))}
          {users.length === 0 && (
            <tr><td colSpan={5} className="p-4 text-center">No hay usuarios</td></tr>
          )}
        </tbody>
      </table>

      {/* Create Modal */}
      {showCreate && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40">
          <form onSubmit={handleCreate} className="bg-grey-100 p-6 rounded shadow w-[420px]">
            <h2 className="text-lg font-bold mb-3">Crear usuario</h2>
            <label className="block mb-2">
              RUT
              <input className="w-full border p-2" value={form.rut} onChange={e => setForm({...form, rut: e.target.value})} />
            </label>
            <label className="block mb-2">
              Nombre
              <input className="w-full border p-2" value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} />
            </label>
            <label className="block mb-2">
              Apellido
              <input className="w-full border p-2" value={form.apellido} onChange={e => setForm({...form, apellido: e.target.value})} />
            </label>
            <label className="block mb-2">
              Email (debe terminar en @ventasfix.cl)
              <input type="email" className="w-full border p-2" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
            </label>
            <label className="block mb-4">
              Password
              <input type="password" className="w-full border p-2" value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
            </label>

            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setShowCreate(false)} className="px-3 py-1 border rounded">Cancelar</button>
              <button type="submit" className="px-3 py-1 bg-green-600 text-white rounded">Crear</button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Modal */}
      {showEdit && editing && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40">
          <form onSubmit={handleUpdate} className="bg-grey-100 p-6 rounded shadow w-[420px]">
            <h2 className="text-lg font-bold mb-3">Editar usuario #{editing.id}</h2>
            <label className="block mb-2">
              RUT
              <input className="w-full border p-2" value={form.rut} onChange={e => setForm({...form, rut: e.target.value})} />
            </label>
            <label className="block mb-2">
              Nombre
              <input className="w-full border p-2" value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} />
            </label>
            <label className="block mb-2">
              Apellido
              <input className="w-full border p-2" value={form.apellido} onChange={e => setForm({...form, apellido: e.target.value})} />
            </label>
            <label className="block mb-2">
              Email
              <input type="email" className="w-full border p-2" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
            </label>
            <label className="block mb-4 text-sm text-slate-600">
              Dejar password vacío si no quieres cambiarla
              <input type="password" className="w-full border p-2 mt-1" value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
            </label>

            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => { setShowEdit(false); setEditing(null); }} className="px-3 py-1 border rounded">Cancelar</button>
              <button type="submit" className="px-3 py-1 bg-blue-600 text-white rounded">Guardar</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}