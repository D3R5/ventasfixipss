import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, getTokenFromHeader, verifyToken } from '@/lib/auth';

async function requireAuth(request: Request) {
  const token = getTokenFromHeader(request);
  if (!token) return null;
  try {
    const data = verifyToken(token);
    return data;
  } catch (err) {
    return null;
  }
}

export async function GET(request: Request) {
  try {
    const auth = await requireAuth(request);
    if (!auth) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

    const users = await prisma.user.findMany({
      select: { id: true, rut: true, nombre: true, apellido: true, email: true, createdAt: true }
    });

    return NextResponse.json(users);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Error interno' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const auth = await requireAuth(request);
    if (!auth) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

    const data = await request.json();
    const { rut, nombre, apellido, email, password } = data || {};

    if (!rut || !nombre || !apellido || !email || !password) {
      return NextResponse.json({ error: 'Campos obligatorios' }, { status: 400 });
    }

    if (!email.endsWith('@ventasfix.cl')) {
      return NextResponse.json({ error: 'El email debe ser @ventasfix.cl' }, { status: 400 });
    }

    const exists = await prisma.user.findFirst({ where: { OR: [{ email }, { rut }] } });
    if (exists) return NextResponse.json({ error: 'Usuario ya existe.' }, { status: 409 });

    const passwordHash = await hashPassword(password);

    const user = await prisma.user.create({
      data: { rut, nombre, apellido, email, password: passwordHash }
    });

    const { password: _p, ...safeUser } = user as any;
    return NextResponse.json(safeUser, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Error interno' }, { status: 500 });
  }
}