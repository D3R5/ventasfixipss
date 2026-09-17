import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getTokenFromHeader, verifyToken } from '@/lib/auth';


async function requireAuth(req: Request) {
  const token = getTokenFromHeader(req);
  if (!token) return null;
  const data = verifyToken(token as string);
  return data;
}

// GET: lista todos los productos 
export async function GET(req: Request) {
  const auth = await requireAuth(req);
  if (!auth) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const products = await prisma.product.findMany();
  return NextResponse.json(products);
}

// POST: crea producto 
export async function POST(req: Request) {
  const auth = await requireAuth(req);
  if (!auth) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const body = await req.json();
  const {
    sku,
    nombre,
    descripcion_corta,
    descripcion_larga,
    imagen,
    precio_neto,
    stock_actual,
    stock_minimo,
    stock_bajo,
    stock_alto
  } = body || {};

  if (
    !sku ||
    !nombre ||
    !descripcion_corta ||
    !descripcion_larga ||
    !imagen ||
    precio_neto === undefined ||
    stock_actual === undefined ||
    stock_minimo === undefined ||
    stock_bajo === undefined ||
    stock_alto === undefined
  ) {
    return NextResponse.json({ error: 'Todos los campos son obligatorios.' }, { status: 400 });
  }

  const existing = await prisma.product.findUnique({ where: { sku } });
  if (existing) return NextResponse.json({ error: 'SKU ya existe' }, { status: 409 });

  const precioN = Number(precio_neto);
  if (Number.isNaN(precioN) || precioN < 0) {
    return NextResponse.json({ error: 'precio_neto inválido' }, { status: 400 });
  }

  const precio_venta = parseFloat((precioN * 1.19).toFixed(2));

  const product = await prisma.product.create({
    data: {
      sku,
      nombre,
      descripcion_corta,
      descripcion_larga,
      imagen,
      precio_neto: precioN,
      precio_venta,
      stock_actual: Number(stock_actual),
      stock_minimo: Number(stock_minimo),
      stock_bajo: Number(stock_bajo),
      stock_alto: Number(stock_alto)
    }
  });

  return NextResponse.json(product, { status: 201 });
}