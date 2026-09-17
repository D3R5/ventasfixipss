import './globals.css';
import React from 'react';
import NavBar from '../components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'VentasFix Backoffice',
  description: 'Backoffice para VentasFix'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-gray-50">
        <NavBar />
        <main className="max-w-7xl mx-auto px-4 py-6">{children}</main>
        <Footer />
      </body>
    </html>
  );
}