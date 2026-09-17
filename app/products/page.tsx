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

  // CREATE
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

  // DELETE
  const handleDelete = async (id: number) => {
    await fetch(`/api/products/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchProducts();
  };

  // UPDATE
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

  if (loading) return <div>Cargando...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Productos</h1>

      {/* CREAR */}
      <div className="mb-6 space-y-2">
        <input
          placeholder="SKU"
          value={form.sku}
          onChange={(e) => setForm({ ...form, sku: e.target.value })}
          className="border p-2"
        />
        <input
          placeholder="Nombre"
          value={form.nombre}
          onChange={(e) => setForm({ ...form, nombre: e.target.value })}
          className="border p-2"
        />
        <input
          placeholder="Precio Neto"
          value={form.precio_neto}
          onChange={(e) =>
            setForm({ ...form, precio_neto: e.target.value })
          }
          className="border p-2"
        />
        <input
          placeholder="Stock"
          value={form.stock_actual}
          onChange={(e) =>
            setForm({ ...form, stock_actual: e.target.value })
          }
          className="border p-2"
        />

        <button
          onClick={handleCreate}
          className="bg-blue-600 text-white px-4 py-2"
        >
          Crear
        </button>
      </div>

      {/* TABLA */}
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th>ID</th>
            <th>SKU</th>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>

              <td>
                {editingId === p.id ? (
                  <input
                    value={editForm.sku}
                    onChange={(e) =>
                      setEditForm({ ...editForm, sku: e.target.value })
                    }
                    className="border p-1"
                  />
                ) : (
                  p.sku
                )}
              </td>

              <td>
                {editingId === p.id ? (
                  <input
                    value={editForm.nombre}
                    onChange={(e) =>
                      setEditForm({ ...editForm, nombre: e.target.value })
                    }
                    className="border p-1"
                  />
                ) : (
                  p.nombre
                )}
              </td>

              <td>
                {editingId === p.id ? (
                  <input
                    value={editForm.precio_neto || ''}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        precio_neto: e.target.value,
                      })
                    }
                    className="border p-1"
                  />
                ) : (
                  p.precio_venta
                )}
              </td>

              <td>
                {editingId === p.id ? (
                  <input
                    value={editForm.stock_actual}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        stock_actual: e.target.value,
                      })
                    }
                    className="border p-1"
                  />
                ) : (
                  p.stock_actual
                )}
              </td>

              <td>
                {editingId === p.id ? (
                  <>
                    <button
                      onClick={handleUpdate}
                      className="bg-green-600 text-white px-2 py-1"
                    >
                      Guardar
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="bg-gray-400 text-white px-2 py-1 ml-2"
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
                      className="bg-yellow-500 text-white px-2 py-1"
                    >
                      Editar
                    </button>

                    <button
                      onClick={() => handleDelete(p.id)}
                      className="bg-red-500 text-white px-2 py-1 ml-2"
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
    </div>
  );
}