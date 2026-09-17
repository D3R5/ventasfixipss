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
      fetch('/api/clients', { headers }).then(r => r.json()),
    ])
      .then(([users, products, clients]) => {
        setCounts({
          users: users.length || 0,
          products: products.length || 0,
          clients: clients.length || 0,
        });
      })
      .catch(err => console.error(err));
  }, [token]);

  if (!token) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center p-6">
        <div className="max-w-lg w-full text-center rounded-xl bg-white/5 border border-white/6 p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-2">Acceso requerido</h2>
          <p className="text-sm text-slate-300">Debes iniciar sesión para ver el dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 py-8">
      <div className="max-w-5xl mx-auto">
        <header className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Dashboard</h1>
            <p className="mt-1 text-sm text-slate-400">
              Resumen rápido de usuarios, productos y clientes.
            </p>
          </div>
          <div className="hidden sm:flex items-center space-x-3">
            <div className="text-xs text-slate-300 bg-slate-800/50 px-3 py-1 rounded-full">Actualizado</div>
          </div>
        </header>

        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Card: Usuarios */}
          <div
            role="region"
            aria-label="Usuarios"
            className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950 p-5 shadow-md"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Usuarios</p>
                <div className="mt-2 flex items-baseline gap-3">
                  <span className="text-3xl sm:text-4xl font-extrabold">{counts.users}</span>
                  <span className="text-xs text-slate-400">registros</span>
                </div>
              </div>
              <div className="text-3xl" aria-hidden>
                👥
              </div>
            </div>
            <div className="absolute right-0 top-0 h-24 w-1.5 bg-indigo-500/60" />
          </div>

          {/* Card: Productos */}
          <div
            role="region"
            aria-label="Productos"
            className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950 p-5 shadow-md"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Productos</p>
                <div className="mt-2 flex items-baseline gap-3">
                  <span className="text-3xl sm:text-4xl font-extrabold">{counts.products}</span>
                  <span className="text-xs text-slate-400">items</span>
                </div>
              </div>
              <div className="text-3xl" aria-hidden>
                📦
              </div>
            </div>
            <div className="absolute right-0 top-0 h-24 w-1.5 bg-emerald-500/50" />
          </div>

          {/* Card: Clientes */}
          <div
            role="region"
            aria-label="Clientes"
            className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950 p-5 shadow-md"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Clientes</p>
                <div className="mt-2 flex items-baseline gap-3">
                  <span className="text-3xl sm:text-4xl font-extrabold">{counts.clients}</span>
                  <span className="text-xs text-slate-400">empresas</span>
                </div>
              </div>
              <div className="text-3xl" aria-hidden>
                🏢
              </div>
            </div>
            <div className="absolute right-0 top-0 h-24 w-1.5 bg-amber-400/50" />
          </div>
        </section>
      </div>
    </div>
  );
}