// app/dashboard/page.tsx
'use client';
import React, { useEffect, useState } from 'react';

export default function DashboardPage() {
  const [counts, setCounts] = useState({ users: 0, products: 0, clients: 0 });
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  useEffect(() => {
    if (!token) return;
    const headers = { Authorization: `Bearer ${token}` };

    Promise.all([
      fetch('/api/users', { headers }).then(r => r.json()),
      fetch('/api/products', { headers }).then(r => r.json()),
      fetch('/api/clients', { headers }).then(r => r.json())
    ])
      .then(([users, products, clients]) => {
        setCounts({ users: users.length || 0, products: products.length || 0, clients: clients.length || 0 });
      })
      .catch(err => console.error(err));
  }, [token]);

  if (!token) {
    return <div className="p-6">Debes iniciar sesión para ver el dashboard.</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 border rounded">Usuarios: <strong>{counts.users}</strong></div>
        <div className="p-4 border rounded">Productos: <strong>{counts.products}</strong></div>
        <div className="p-4 border rounded">Clientes: <strong>{counts.clients}</strong></div>
      </div>
    </div>
  );
}