import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, getTokenFromHeader, verifyToken } from '@/lib/auth';

async function requireAuth(request: Request) {
  const token = getTokenFromHeader(request);
  if (!token) return null;
  try {
    return verifyToken(token);
  } catch (err) {
    return null;
  }
}

async function resolveParams(context?: { params?: any }) {
  if (!context) return undefined;
  const params = context.params;
  if (!params) return undefined;
  // si es una Promise, await; si no, retornar tal cual
  if (typeof params.then === 'function') {
    try {
      return await params;
    } catch {
      return undefined;
    }
  }
  return params;
}

export async function GET(request: Request, context: { params?: any }) {
  try {
    const auth = await requireAuth(request);
    if (!auth) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

    const params = await resolveParams(context);
    const idStr = params?.id;
    const id = Number(idStr);
    if (!id || Number.isNaN(id)) return NextResponse.json({ error: 'ID inválido' }, { status: 400 });

    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true, rut: true, nombre: true, apellido: true, email: true, createdAt: true }
    });

    if (!user) return NextResponse.json({ error: 'No encontrado' }, { status: 404 });
    return NextResponse.json(user);
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Error interno' }, { status: 500 });
  }
}

export async function PUT(request: Request, context: { params?: any }) {
  try {
    const auth = await requireAuth(request);
    if (!auth) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

    const params = await resolveParams(context);
    const idStr = params?.id;
    const id = Number(idStr);
    if (!id || Number.isNaN(id)) return NextResponse.json({ error: 'ID inválido' }, { status: 400 });

    const body = await request.json();
    const { rut, nombre, apellido, email, password } = body || {};

    if (!rut || !nombre || !apellido || !email) {
      return NextResponse.json({ error: 'Campos obligatorios (password opcional)' }, { status: 400 });
    }

    if (!email.endsWith('@ventasfix.cl')) {
      return NextResponse.json({ error: 'El email debe ser @ventasfix.cl' }, { status: 400 });
    }

    const conflict = await prisma.user.findFirst({
      where: {
        AND: [
          { id: { not: id } },
          { OR: [{ email }, { rut }] }
        ]
      }
    });

    if (conflict) {
      return NextResponse.json({ error: 'Email o RUT ya usado por otro usuario' }, { status: 409 });
    }

    const dataToUpdate: any = { rut, nombre, apellido, email };
    if (password && password.length > 0) {
      dataToUpdate.password = await hashPassword(password);
    }

    const user = await prisma.user.update({
      where: { id },
      data: dataToUpdate
    });

    const { password: _p, ...safeUser } = user as any;
    return NextResponse.json(safeUser);
  } catch (err: any) {
    if (err?.code === 'P2025') return NextResponse.json({ error: 'Usuario no existe' }, { status: 404 });
    return NextResponse.json({ error: err?.message || 'Error interno' }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: { params?: any }) {
  try {
    const auth = await requireAuth(request);
    if (!auth) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

    const params = await resolveParams(context);
    const idStr = params?.id;
    const id = Number(idStr);
    if (!id || Number.isNaN(id)) return NextResponse.json({ error: 'ID inválido' }, { status: 400 });

    await prisma.user.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    if (err?.code === 'P2025') return NextResponse.json({ error: 'Usuario no existe' }, { status: 404 });
    return NextResponse.json({ error: err?.message || 'Error interno' }, { status: 500 });
  }
}