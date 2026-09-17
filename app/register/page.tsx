'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [rut, setRut] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const validateEmail = (e: string) => e.trim().toLowerCase().endsWith('@ventasfix.cl');

  const onSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setErr('');

    if (!rut || !nombre || !apellido || !email || !password) {
      setErr('Todos los campos son obligatorios.');
      return;
    }
    if (!validateEmail(email)) {
      setErr('El email debe terminar en @ventasfix.cl');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth?action=register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rut,
          nombre,
          apellido,
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErr(data.error || 'Error al registrar.');
        setLoading(false);
        return;
      }

      // Guardar token y redirigir al dashboard
      if (data.token) localStorage.setItem('token', data.token);
      router.push('/dashboard');
    } catch (error) {
      console.error(error);
      setErr('Error de red. Intenta de nuevo.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 p-6">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-lg"
        aria-label="Formulario de registro VentasFix"
      >
        <div className="flex items-center gap-4 mb-6">
          <div className="h-12 w-12 flex items-center justify-center rounded-full bg-green-600 text-white font-bold">
            VF
          </div>
          <div>
            <h1 className="text-xl font-extrabold">Crear usuario — VentasFix</h1>
            <p className="text-sm text-slate-400">Registra una cuenta administrativa</p>
          </div>
        </div>

        {err && (
          <div role="alert" className="mb-4 rounded-md bg-rose-900/30 border border-rose-800 p-3 text-rose-100 text-sm">
            {err}
          </div>
        )}

        <label className="block mb-3 text-sm">
          RUT empresa / usuario
          <input
            value={rut}
            onChange={(e) => setRut(e.target.value)}
            className="mt-2 w-full bg-transparent border border-slate-700 rounded-md px-3 py-2 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="12.345.678-9"
            aria-label="RUT"
          />
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
          <label className="block text-sm">
            Nombre
            <input
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="mt-2 w-full bg-transparent border border-slate-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label="Nombre"
            />
          </label>

          <label className="block text-sm">
            Apellido
            <input
              value={apellido}
              onChange={(e) => setApellido(e.target.value)}
              className="mt-2 w-full bg-transparent border border-slate-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label="Apellido"
            />
          </label>
        </div>

        <label className="block mb-3 text-sm">
          Email (@ventasfix.cl)
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2 w-full bg-transparent border border-slate-700 rounded-md px-3 py-2 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="usuario@ventasfix.cl"
            aria-label="Email"
            type="email"
          />
        </label>

        <label className="block mb-4 text-sm">
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2 w-full bg-transparent border border-slate-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="Password"
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white rounded-md font-medium transition"
        >
          {loading ? (
            <>
              <svg
                className="h-4 w-4 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden
              >
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.15" strokeWidth="4" />
                <path d="M22 12a10 10 0 00-10-10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
              </svg>
              <span>Creando...</span>
            </>
          ) : (
            'Crear cuenta'
          )}
        </button>

        <p className="mt-4 text-xs text-slate-500 text-center">
          Al registrarte recibirás acceso al panel de VentasFix.
        </p>
      </form>
    </div>
  );
}