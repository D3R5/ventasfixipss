'use client';

import Link from 'next/link';
import React from 'react';

type FooterProps = {
  companyName?: string;
  small?: boolean;
};

export default function Footer({ companyName = 'VentasFix IPSS 2026', small = false }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer
      aria-label="Pie de página"
      className={`w-full border-t border-slate-800 bg-slate-900 text-slate-300 ${small ? 'py-4' : 'py-8'}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          {/* Brand */}
          <div className="flex items-start sm:items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-gradient-to-br from-indigo-500 to-pink-500 text-white font-bold">
              VF
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-100">{companyName}</div>
              <div className="text-xs text-slate-500">{companyName} - Panel administrativo</div>
            </div>
          </div>

          <nav aria-label="Enlaces del pie" className="flex flex-wrap gap-3 justify-center">
            <Link href="/dashboard" className="text-sm hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded px-2 py-1">
              Dashboard
            </Link>
            <Link href="/products" className="text-sm hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded px-2 py-1">
              Productos
            </Link>
            <Link href="/clients" className="text-sm hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded px-2 py-1">
              Clientes
            </Link>
            <Link href="/users" className="text-sm hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded px-2 py-1">
              Usuarios
            </Link>
          </nav>

          <div className="flex items-center gap-4 justify-end">
            <div className="hidden sm:flex items-center text-xs text-slate-500">
              © {year} {companyName}
            </div>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-slate-500 sm:hidden">
          © {year} {companyName}. Todos los derechos reservados. IPSS 2026
        </div>
      </div>
    </footer>
  );
}