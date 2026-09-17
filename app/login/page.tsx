// app/login/page.tsx
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
    const res = await fetch('/api/auth?action=login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
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
    <div className="min-h-screen flex items-center justify-center p-4">
      <form className="w-full max-w-md p-6 border rounded" onSubmit={submit}>
        <h2 className="text-xl font-bold mb-4">Ingresar - VentasFix</h2>
        {err && <div className="mb-2 text-red-600">{err}</div>}
        <label className="block mb-2">Email</label>
        <input value={email} onChange={e => setEmail(e.target.value)} className="w-full mb-3 p-2 border rounded" />
        <label className="block mb-2">Password</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full mb-3 p-2 border rounded" />
        <button className="w-full py-2 bg-blue-600 text-white rounded">Ingresar</button>
      </form>
    </div>
  );
}