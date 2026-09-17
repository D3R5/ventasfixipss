import Link from "next/link";

const cards = [
  {
    title: "Dashboard",
    desc: "Visualiza métricas y resumen general del sistema.",
    href: "/dashboard",
    icon: "📊",
  },
  {
    title: "Productos",
    desc: "Gestiona el catálogo completo de productos.",
    href: "/products",
    icon: "📦",
  },
  {
    title: "Clientes",
    desc: "Administra clientes y empresas.",
    href: "/clients",
    icon: "👥",
  },
  {
    title: "Usuarios",
    desc: "Control de acceso del backoffice.",
    href: "/users",
    icon: "🔐",
  },
  {
    title: "Login",
    desc: "Accede con tu cuenta corporativa.",
    href: "/login",
    icon: "➡️",
  },
  {
    title: "Registro",
    desc: "Crea nuevos administradores.",
    href: "/register",
    icon: "🆕",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white px-6 py-10">
      <section className="max-w-5xl mx-auto mb-10">
        <div className="p-8 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 shadow-xl">
          <h1 className="text-4xl font-bold tracking-tight">
            VentasFix Backoffice 🚀
          </h1>
          <p className="mt-3 text-white/90 max-w-xl">
            Administra usuarios, productos y clientes desde un solo lugar.
            Plataforma interna moderna y eficiente.
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.title}
            href={card.href}
            className="group relative p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/20"
          >
            <div className="text-3xl mb-3">{card.icon}</div>

            <h3 className="text-lg font-semibold group-hover:text-indigo-400 transition">
              {card.title}
            </h3>

            <p className="text-sm text-slate-400 mt-1">
              {card.desc}
            </p>

            <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition bg-gradient-to-r from-indigo-500/10 to-pink-500/10" />
          </Link>
        ))}
      </section>
    </div>
  );
}