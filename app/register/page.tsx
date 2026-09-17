// app/register/page.tsx
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
        body: JSON.stringify({ rut, nombre, apellido, email: email.trim().toLowerCase(), password })
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
    <div className="min-h-screen flex items-center justify-center p-4">
      <form onSubmit={onSubmit} className="w-full max-w-lg p-6 border rounded bg-grey-100">
        <h2 className="text-2xl font-bold mb-4">Crear usuario - VentasFix</h2>
        {err && <div className="mb-3 text-sm text-red-600">{err}</div>}

        <label className="block mb-2 ">RUT empresa / usuario</label>
        <input value={rut} onChange={(e) => setRut(e.target.value)} className="w-full mb-3 p-2 border rounded" />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 ">Nombre</label>
            <input value={nombre} onChange={(e) => setNombre(e.target.value)} className="w-full mb-3 p-2 border rounded" />
          </div>
          <div>
            <label className="block mb-2">Apellido</label>
            <input value={apellido} onChange={(e) => setApellido(e.target.value)} className="w-full mb-3 p-2 border rounded" />
          </div>
        </div>

        <label className="block mb-2">Email (@ventasfix.cl)</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full mb-3 p-2 border rounded" />

        <label className="block mb-2">Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full mb-4 p-2 border rounded" />

        <button type="submit" className="w-full py-2 bg-green-600 text-white rounded" disabled={loading}>
          {loading ? 'Creando...' : 'Crear cuenta'}
        </button>
      </form>
    </div>
  );
}