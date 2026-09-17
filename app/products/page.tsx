'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type Product = {
  id: number;
  sku: string;
  nombre: string;
  precio_venta: number;
  stock_actual: number;
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<any>({});
  const [form, setForm] = useState({
    sku: '',
    nombre: '',
    precio_neto: '',
    stock_actual: '',
  });

  const router = useRouter();

  const token =
    typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const fetchProducts = async () => {
    const res = await fetch('/api/products', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setProducts(data);
    setLoading(false);
  };

  useEffect(() => {
    if (!token) return router.push('/login');
    fetchProducts();
  }, []);

  const handleCreate = async () => {
    await fetch('/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...form,
        descripcion_corta: 'test',
        descripcion_larga: 'test',
        imagen: 'img.jpg',
        stock_minimo: 1,
        stock_bajo: 2,
        stock_alto: 10,
      }),
    });

    setForm({ sku: '', nombre: '', precio_neto: '', stock_actual: '' });
    fetchProducts();
  };

  const handleDelete = async (id: number) => {
    await fetch(`/api/products/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchProducts();
  };

  const handleUpdate = async () => {
    await fetch(`/api/products/${editingId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...editForm,
        descripcion_corta: 'edit',
        descripcion_larga: 'edit',
        imagen: 'img.jpg',
        stock_minimo: 1,
        stock_bajo: 2,
        stock_alto: 10,
      }),
    });

    setEditingId(null);
    fetchProducts();
  };

  if (loading)
    return (
      <div className="min-h-[40vh] flex items-center justify-center p-6">
        <div className="text-sm text-slate-400">Cargando...</div>
      </div>
    );

  return (
    <div className="px-6 py-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Productos
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Crea, edita y elimina productos desde el panel.
            </p>
          </div>
        </header>

        <section className="mb-6 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <input
              placeholder="SKU"
              value={form.sku}
              onChange={(e) => setForm({ ...form, sku: e.target.value })}
              className="block w-full bg-transparent border border-slate-700 rounded-md px-3 py-2 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              placeholder="Nombre"
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              className="block w-full bg-transparent border border-slate-700 rounded-md px-3 py-2 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              placeholder="Precio Neto"
              value={form.precio_neto}
              onChange={(e) => setForm({ ...form, precio_neto: e.target.value })}
              className="block w-full bg-transparent border border-slate-700 rounded-md px-3 py-2 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <div className="flex gap-2">
              <input
                placeholder="Stock"
                value={form.stock_actual}
                onChange={(e) =>
                  setForm({ ...form, stock_actual: e.target.value })
                }
                className="flex-1 bg-transparent border border-slate-700 rounded-md px-3 py-2 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                onClick={handleCreate}
                className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 transition text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Crear
              </button>
            </div>
          </div>
        </section>

        <section className="overflow-x-auto rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-950 to-slate-900 shadow-sm">
          <table className="min-w-full divide-y divide-slate-800">
            <thead className="bg-slate-900">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400">
                  ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400">
                  SKU
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400">
                  Nombre
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400">
                  Precio
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400">
                  Stock
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400">
                  Acciones
                </th>
              </tr>
            </thead>

            <tbody className="bg-slate-950 divide-y divide-slate-800">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-slate-900">
                  <td className="px-4 py-3 text-sm text-slate-300">{p.id}</td>

                  <td className="px-4 py-3 text-sm text-slate-200">
                    {editingId === p.id ? (
                      <input
                        value={editForm.sku}
                        onChange={(e) =>
                          setEditForm({ ...editForm, sku: e.target.value })
                        }
                        className="w-full bg-transparent border border-slate-700 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    ) : (
                      p.sku
                    )}
                  </td>

                  <td className="px-4 py-3 text-sm text-slate-200">
                    {editingId === p.id ? (
                      <input
                        value={editForm.nombre}
                        onChange={(e) =>
                          setEditForm({ ...editForm, nombre: e.target.value })
                        }
                        className="w-full bg-transparent border border-slate-700 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    ) : (
                      p.nombre
                    )}
                  </td>

                  <td className="px-4 py-3 text-sm text-slate-200">
                    {editingId === p.id ? (
                      <input
                        value={editForm.precio_neto || ''}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            precio_neto: e.target.value,
                          })
                        }
                        className="w-28 bg-transparent border border-slate-700 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    ) : (
                      p.precio_venta
                    )}
                  </td>

                  <td className="px-4 py-3 text-sm text-slate-200">
                    {editingId === p.id ? (
                      <input
                        value={editForm.stock_actual}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            stock_actual: e.target.value,
                          })
                        }
                        className="w-20 bg-transparent border border-slate-700 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    ) : (
                      p.stock_actual
                    )}
                  </td>

                  <td className="px-4 py-3 text-sm">
                    {editingId === p.id ? (
                      <>
                        <button
                          onClick={handleUpdate}
                          className="inline-flex items-center px-3 py-1 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium"
                        >
                          Guardar
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="ml-2 inline-flex items-center px-3 py-1 rounded-md bg-slate-700 hover:bg-slate-600 text-white text-sm"
                        >
                          Cancelar
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            setEditingId(p.id);
                            setEditForm(p);
                          }}
                          className="inline-flex items-center px-3 py-1 rounded-md bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium"
                        >
                          Editar
                        </button>

                        <button
                          onClick={() => handleDelete(p.id)}
                          className="ml-2 inline-flex items-center px-3 py-1 rounded-md bg-red-600 hover:bg-red-700 text-white text-sm font-medium"
                        >
                          Eliminar
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="p-4 text-xs text-slate-500">Total: {products.length} productos</div>
        </section>
      </div>
    </div>
  );
}