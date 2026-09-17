// components/NavBar.tsx
'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

export default function NavBar() {
  const pathname = usePathname();
  const router = useRouter();

  // determinista en server: isMounted = false
  const [isMounted, setIsMounted] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
    try {
      const t = localStorage.getItem('token');
      setToken(t);
    } catch (e) {
      setToken(null);
    }
  }, []);

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      setToken(null);
      router.push('/login');
    }
  };

  const isActive = (p: string) => pathname === p;

  return (
    <nav className="bg-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-lg font-semibold">
              VentasFix
            </Link>

            <div className="hidden md:flex items-center space-x-2">
              <Link href="/dashboard" className={`px-3 py-2 rounded ${isActive('/dashboard') ? 'bg-slate-700' : 'hover:bg-slate-700'}`}>
                Dashboard
              </Link>
              <Link href="/users" className={`px-3 py-2 rounded ${isActive('/users') ? 'bg-slate-700' : 'hover:bg-slate-700'}`}>
                Usuarios
              </Link>
              <Link href="/products" className={`px-3 py-2 rounded ${isActive('/products') ? 'bg-slate-700' : 'hover:bg-slate-700'}`}>
                Productos
              </Link>
              <Link href="/clients" className={`px-3 py-2 rounded ${isActive('/clients') ? 'bg-slate-700' : 'hover:bg-slate-700'}`}>
                Clientes
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* 
               IMPORTANTE:
               isMounted === false -> server render / first client render -> mostramos la misma UI para evitar mismatch.
               Sólo después del mount (isMounted === true) mostramos el estado real (conectado / ingresar).
            */}
            {!isMounted ? (
              // placeholder neutral (igual en server y en cliente antes del mount)
              <div className="px-3 py-2" aria-hidden />
            ) : !token ? (
              <>
                <Link href="/login" className="px-3 py-2 rounded hover:bg-slate-700">
                  Ingresar
                </Link>
                <Link href="/register" className="px-3 py-2 rounded bg-green-600 hover:bg-green-500">
                  Crear usuario
                </Link>
              </>
            ) : (
              <>
                <span className="hidden sm:inline px-3 py-2 text-sm">Conectado</span>
                <button onClick={logout} className="px-3 py-2 rounded bg-red-600 hover:bg-red-500">
                  Cerrar sesión
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}