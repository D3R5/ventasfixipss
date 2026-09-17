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

  // estado del menu mobile
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    try {
      const t = localStorage.getItem('token');
      setToken(t);
    } catch (e) {
      setToken(null);
    }
  }, []);

  // cerrar menu mobile cuando cambie de ruta
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // cerrar con ESC
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
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
    <nav className="bg-slate-900 text-white/95 shadow-sm ring-1 ring-black/10 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* left: brand + nav links */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-3">
              <div className="h-9 w-9 flex items-center justify-center rounded-md bg-gradient-to-br from-indigo-500 to-pink-500 text-white font-bold">
                VF
              </div>
              <span className="text-lg font-semibold tracking-tight hover:opacity-90">VentasFix</span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center space-x-1">
              <NavLink href="/dashboard" active={isActive('/dashboard')}>Dashboard</NavLink>
              <NavLink href="/users" active={isActive('/users')}>Usuarios</NavLink>
              <NavLink href="/products" active={isActive('/products')}>Productos</NavLink>
              <NavLink href="/clients" active={isActive('/clients')}>Clientes</NavLink>
            </div>
          </div>

          {/* right: auth actions + mobile button */}
          <div className="flex items-center gap-3">
            {/* Auth actions (same logic) */}
            <div className="hidden sm:flex items-center space-x-3">
              {!isMounted ? (
                <div className="h-8 w-28 rounded-md bg-slate-800/60" aria-hidden />
              ) : !token ? (
                <>
                  <Link
                    href="/login"
                    className="px-3 py-1.5 rounded-md text-sm hover:bg-slate-800/60 transition focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    Ingresar
                  </Link>
                  <Link
                    href="/register"
                    className="px-3 py-1.5 rounded-md text-sm bg-emerald-600 hover:bg-emerald-500 transition focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  >
                    Crear usuario
                  </Link>
                </>
              ) : (
                <>
                  <span className="px-3 py-1.5 text-sm bg-slate-800/40 rounded-md hidden sm:inline-block">Conectado</span>
                  <button
                    onClick={logout}
                    className="px-3 py-1.5 rounded-md bg-rose-600 hover:bg-rose-500 transition text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
                  >
                    Cerrar sesión
                  </button>
                </>
              )}
            </div>

            {/* Mobile hamburger */}
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-200 hover:bg-slate-800/60 focus:outline-none focus:ring-2 focus:ring-indigo-500 md:hidden"
              aria-controls="mobile-menu"
              aria-expanded={mobileOpen}
              aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'}
              onClick={() => setMobileOpen((s) => !s)}
            >
              <span className="sr-only">{mobileOpen ? 'Cerrar menú' : 'Abrir menú'}</span>
              {mobileOpen ? (
                // Close icon
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                // Menu icon
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu panel */}
      <div
        id="mobile-menu"
        className={[
          'md:hidden transition-max-height duration-200 ease-in-out overflow-hidden',
          mobileOpen ? 'max-h-[420px]' : 'max-h-0',
        ].join(' ')}
        aria-hidden={!mobileOpen}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-slate-900/95 border-t border-slate-800">
          {/* Mobile links */}
          <MobileLink href="/dashboard" active={isActive('/dashboard')} onClick={() => setMobileOpen(false)}>Dashboard</MobileLink>
          <MobileLink href="/users" active={isActive('/users')} onClick={() => setMobileOpen(false)}>Usuarios</MobileLink>
          <MobileLink href="/products" active={isActive('/products')} onClick={() => setMobileOpen(false)}>Productos</MobileLink>
          <MobileLink href="/clients" active={isActive('/clients')} onClick={() => setMobileOpen(false)}>Clientes</MobileLink>

          <div className="border-t border-slate-800 mt-2 pt-2">
            {!isMounted ? (
              <div className="h-8 w-full rounded bg-slate-800/60" />
            ) : !token ? (
              <div className="flex flex-col gap-2 px-2">
                <Link
                  href="/login"
                  className="block px-3 py-2 rounded-md text-base font-medium hover:bg-slate-800/60 transition"
                  onClick={() => setMobileOpen(false)}
                >
                  Ingresar
                </Link>
                <Link
                  href="/register"
                  className="block px-3 py-2 rounded-md text-base font-medium bg-emerald-600 hover:bg-emerald-500 transition"
                  onClick={() => setMobileOpen(false)}
                >
                  Crear usuario
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-2 px-2">
                <span className="block px-3 py-2 rounded-md text-base font-medium bg-slate-800/40">Conectado</span>
                <button
                  onClick={() => { setMobileOpen(false); logout(); }}
                  className="w-full text-left px-3 py-2 rounded-md bg-rose-600 hover:bg-rose-500 transition text-base focus:outline-none focus:ring-2 focus:ring-rose-400"
                >
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

/* Presentational desktop link */
function NavLink({ href, children, active }: { href: string; children: React.ReactNode; active?: boolean }) {
  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      className={[
        'px-3 py-2 rounded-md text-sm font-medium transition flex items-center',
        active
          ? 'bg-slate-800/80 text-white shadow-inner ring-1 ring-indigo-500/30'
          : 'text-slate-200 hover:bg-slate-800/60'
      ].join(' ')}
    >
      {children}
      <span className="ml-2 text-xs text-slate-400" aria-hidden>{/* decorative spacer */}</span>
    </Link>
  );
}

/* Mobile link (block, full width) */
function MobileLink({ href, children, active, onClick }: { href: string; children: React.ReactNode; active?: boolean; onClick?: () => void }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
      className={[
        'block px-3 py-2 rounded-md text-base font-medium transition',
        active ? 'bg-slate-800/80 text-white' : 'text-slate-200 hover:bg-slate-800/60'
      ].join(' ')}
    >
      {children}
    </Link>
  );
}