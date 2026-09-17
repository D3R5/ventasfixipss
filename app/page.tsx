// app/page.tsx
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="space-y-6">
      <section className="p-6 bg-white border rounded">
        <h1 className="text-3xl font-bold">Bienvenido a VentasFix — Backoffice</h1>
        <p className="mt-2 text-sm text-slate-600">
          Plataforma para administrar usuarios, productos y clientes. Usa la barra superior para navegar.
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/dashboard" className="p-4 bg-white border rounded hover:shadow">
          <h3 className="font-semibold">Dashboard</h3>
          <p className="text-sm text-slate-500">Ver totales de usuarios, productos y clientes.</p>
        </Link>

        <Link href="/products" className="p-4 bg-white border rounded hover:shadow">
          <h3 className="font-semibold">Productos</h3>
          <p className="text-sm text-slate-500">Listar, crear, editar y eliminar productos.</p>
        </Link>

        <Link href="/clients" className="p-4 bg-white border rounded hover:shadow">
          <h3 className="font-semibold">Clientes</h3>
          <p className="text-sm text-slate-500">Administrar clientes empresa.</p>
        </Link>

        <Link href="/users" className="p-4 bg-white border rounded hover:shadow">
          <h3 className="font-semibold">Usuarios</h3>
          <p className="text-sm text-slate-500">Administrar trabajadores (backoffice).</p>
        </Link>

        <Link href="/login" className="p-4 bg-white border rounded hover:shadow">
          <h3 className="font-semibold">Iniciar sesión</h3>
          <p className="text-sm text-slate-500">Accede al sistema con tu cuenta @ventasfix.cl</p>
        </Link>

        <Link href="/register" className="p-4 bg-white border rounded hover:shadow">
          <h3 className="font-semibold">Crear usuario</h3>
          <p className="text-sm text-slate-500">Registra una nueva cuenta de administrador.</p>
        </Link>
      </section>
    </div>
  );
}