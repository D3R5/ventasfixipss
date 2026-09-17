'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type User = {
  id: number;
  rut: string;
  nombre: string;
  apellido?: string;
  email: string;
  createdAt?: string;
};

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
    setForm({
      rut: user.rut || '',
      nombre: user.nombre || '',
      apellido: user.apellido || '',
      email: user.email || '',
      password: '',
    });
    setShowEdit(true);
    setShowCreate(false);
  }

  async function handleCreate(e?: React.FormEvent) {
    if (e) e.preventDefault();
    setError(null);

    try {
      const res = await fetchWithToken('/api/users', {
        method: 'POST',
        body: JSON.stringify(form),
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
        body: JSON.stringify(form),
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

  if (loading)
    return (
      <div className="min-h-[40vh] flex items-center justify-center p-6">
        <div className="text-sm text-slate-400">Cargando usuarios...</div>
      </div>
    );

  if (error)
    return (
      <div className="max-w-5xl mx-auto p-6">
        <div className="rounded-md bg-rose-900/30 border border-rose-800 p-4 text-rose-100">
          <strong className="block">Error:</strong>
          <p className="mt-1 text-sm">{error}</p>
          <div className="mt-3">
            <button onClick={load} className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded">
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );

  return (
    <div className="px-6 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Usuarios</h1>
            <p className="mt-1 text-sm text-slate-400">Gestiona las cuentas del backoffice.</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={openCreate}
              className="inline-flex items-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm"
              aria-haspopup="dialog"
            >
              Crear usuario
            </button>

            <button
              onClick={load}
              className="inline-flex items-center gap-2 px-3 py-2 border border-slate-700 bg-transparent rounded-md text-sm text-slate-200 hover:bg-slate-800"
            >
              Refrescar
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950 shadow-sm">
          <table className="min-w-full divide-y divide-slate-800">
            <thead className="bg-slate-900">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400">ID</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400">RUT</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400">Nombre</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400">Email</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400">Acciones</th>
              </tr>
            </thead>

            <tbody className="bg-slate-950 divide-y divide-slate-800">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-900">
                  <td className="px-4 py-3 text-sm text-slate-300">{u.id}</td>
                  <td className="px-4 py-3 text-sm text-slate-200">{u.rut}</td>
                  <td className="px-4 py-3 text-sm text-slate-200">
                    {u.nombre} {u.apellido || ''}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-200">{u.email}</td>
                  <td className="px-4 py-3 text-sm">
                    <button
                      onClick={() => openEdit(u)}
                      className="inline-flex items-center px-3 py-1 rounded-md bg-amber-500 hover:bg-amber-600 text-white text-sm mr-2"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(u.id)}
                      className="inline-flex items-center px-3 py-1 rounded-md border border-rose-600 text-rose-500 hover:bg-rose-900/20 text-sm"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}

              {users.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-sm text-slate-400">
                    No hay usuarios
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Create Modal */}
        {showCreate && (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4"
          >
            <form onSubmit={handleCreate} className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-lg p-6 shadow-lg">
              <h2 className="text-lg font-semibold mb-3">Crear usuario</h2>

              <label className="block mb-2 text-sm">
                RUT
                <input
                  className="mt-1 w-full bg-transparent border border-slate-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={form.rut}
                  onChange={(e) => setForm({ ...form, rut: e.target.value })}
                />
              </label>

              <label className="block mb-2 text-sm">
                Nombre
                <input
                  className="mt-1 w-full bg-transparent border border-slate-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={form.nombre}
                  onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                />
              </label>

              <label className="block mb-2 text-sm">
                Apellido
                <input
                  className="mt-1 w-full bg-transparent border border-slate-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={form.apellido}
                  onChange={(e) => setForm({ ...form, apellido: e.target.value })}
                />
              </label>

              <label className="block mb-2 text-sm">
                Email (debe terminar en @ventasfix.cl)
                <input
                  type="email"
                  className="mt-1 w-full bg-transparent border border-slate-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </label>

              <label className="block mb-4 text-sm">
                Password
                <input
                  type="password"
                  className="mt-1 w-full bg-transparent border border-slate-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
              </label>

              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setShowCreate(false)} className="px-3 py-2 border rounded-md text-sm">
                  Cancelar
                </button>
                <button type="submit" className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm">
                  Crear
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Edit Modal */}
        {showEdit && editing && (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4"
          >
            <form onSubmit={handleUpdate} className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-lg p-6 shadow-lg">
              <h2 className="text-lg font-semibold mb-3">Editar usuario #{editing.id}</h2>

              <label className="block mb-2 text-sm">
                RUT
                <input
                  className="mt-1 w-full bg-transparent border border-slate-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={form.rut}
                  onChange={(e) => setForm({ ...form, rut: e.target.value })}
                />
              </label>

              <label className="block mb-2 text-sm">
                Nombre
                <input
                  className="mt-1 w-full bg-transparent border border-slate-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={form.nombre}
                  onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                />
              </label>

              <label className="block mb-2 text-sm">
                Apellido
                <input
                  className="mt-1 w-full bg-transparent border border-slate-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={form.apellido}
                  onChange={(e) => setForm({ ...form, apellido: e.target.value })}
                />
              </label>

              <label className="block mb-2 text-sm">
                Email
                <input
                  type="email"
                  className="mt-1 w-full bg-transparent border border-slate-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </label>

              <label className="block mb-4 text-sm text-slate-400">
                Dejar password vacío si no quieres cambiarla
                <input
                  type="password"
                  className="mt-1 w-full bg-transparent border border-slate-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
              </label>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowEdit(false);
                    setEditing(null);
                  }}
                  className="px-3 py-2 border rounded-md text-sm"
                >
                  Cancelar
                </button>
                <button type="submit" className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm">
                  Guardar
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}