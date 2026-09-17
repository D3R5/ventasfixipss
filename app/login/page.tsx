'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const router = useRouter();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr('');

    const res = await fetch('/api/auth?action=login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setErr(data.error || 'Error');
      return;
    }

    localStorage.setItem('token', data.token);
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 p-6">
      <form
        onSubmit={submit}
        aria-label="Login VentasFix"
        className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-lg"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-white text-lg font-semibold">
            VF
          </div>
          <div>
            <h2 className="text-xl font-extrabold leading-tight">Ingresar — VentasFix</h2>
            <p className="text-sm text-slate-400">Accede con tu cuenta del backoffice</p>
          </div>
        </div>

        {err && (
          <div role="alert" className="mb-4 rounded-md bg-rose-900/30 border border-rose-800 p-3 text-rose-100 text-sm">
            {err}
          </div>
        )}

        <label className="block text-sm mb-2">
          Email
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="usuario@ventasfix.cl"
            className="mt-2 w-full bg-transparent border border-slate-700 rounded-md px-3 py-2 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="Email"
          />
        </label>

        <label className="block text-sm mb-4">
          Password
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2 w-full bg-transparent border border-slate-700 rounded-md px-3 py-2 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="Password"
          />
        </label>

        <button
          type="submit"
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 transition text-white rounded-md font-medium"
        >
          Ingresar
        </button>

        <p className="mt-4 text-xs text-slate-500 text-center">
          ¿Problemas para ingresar? Contacta al administrador.
        </p>
      </form>
    </div>
  );
}