import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, verifyPassword, signToken } from '@/lib/auth';

export async function POST(req: Request) {
  const url = new URL(req.url);
  const action = url.searchParams.get('action');

  const body = await req.json();

  if (action === 'register') {
    const { rut, nombre, apellido, email, password } = body || {};
    if (!rut || !nombre || !apellido || !email || !password) {
      return NextResponse.json({ error: 'Campos obligatorios.' }, { status: 400 });
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
    const token = signToken({ id: user.id, email: user.email });
    const safeUser = { ...user, password: undefined };
    return NextResponse.json({ user: safeUser, token });
  }

  if (action === 'login') {
    const { email, password } = body || {};
    if (!email || !password) return NextResponse.json({ error: 'Campos obligatorios' }, { status: 400 });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });

    const valid = await verifyPassword(password, user.password);
    if (!valid) return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });

    const token = signToken({ id: user.id, email: user.email });
    const safeUser = { ...user, password: undefined };
    return NextResponse.json({ user: safeUser, token });
  }

  return NextResponse.json({ error: 'action missing' }, { status: 400 });
}