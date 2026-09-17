// app/api/products/[id]/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getTokenFromHeader, verifyToken } from '@/lib/auth';

async function requireAuth(req: Request) {
  const token = getTokenFromHeader(req);
  if (!token) return null;
  const data = verifyToken(token as string);
  return data;
}

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const auth = await requireAuth(req);
  if (!auth) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const product = await prisma.product.findUnique({
    where: { id: Number(id) },
  });

  if (!product) {
    return NextResponse.json({ error: 'No encontrado' }, { status: 404 });
  }

  return NextResponse.json(product);
}

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const auth = await requireAuth(req);
  if (!auth) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

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
    stock_alto,
  } = body || {};

  // validación
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
    return NextResponse.json(
      { error: 'Todos los campos son obligatorios.' },
      { status: 400 }
    );
  }

  const precioN = Number(precio_neto);

  if (Number.isNaN(precioN) || precioN < 0) {
    return NextResponse.json(
      { error: 'precio_neto inválido' },
      { status: 400 }
    );
  }

  const precio_venta = parseFloat((precioN * 1.19).toFixed(2));

  try {
    const updated = await prisma.product.update({
      where: { id: Number(id) },
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
        stock_alto: Number(stock_alto),
      },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: 'Error actualizando producto' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const auth = await requireAuth(req);
  if (!auth) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  try {
    await prisma.product.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Error eliminando producto' }, { status: 500 });
  }
}