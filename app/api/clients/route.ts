// app/api/clients/route.ts

import { NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';

import { getTokenFromHeader, verifyToken } from '@/lib/auth';

async function requireAuth(req: Request) {

  const token = getTokenFromHeader(req);

  if (!token) return null;

  const data = verifyToken(token as string);

  return data;

}

// GET: listar todos los clientes (protegido)

export async function GET(req: Request) {

  const auth = await requireAuth(req);

  if (!auth) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const clients = await prisma.client.findMany();

  return NextResponse.json(clients);

}

// POST: crear cliente (protegido)

// campos obligatorios: rut_empresa, rubro, razon_social, telefono, direccion, nombre_contacto, email_contacto

export async function POST(req: Request) {

  const auth = await requireAuth(req);

  if (!auth) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const body = await req.json();

  const {

    rut_empresa,

    rubro,

    razon_social,

    telefono,

    direccion,

    nombre_contacto,

    email_contacto

  } = body || {};

  if (

    !rut_empresa ||

    !rubro ||

    !razon_social ||

    !telefono ||

    !direccion ||

    !nombre_contacto ||

    !email_contacto

  ) {

    return NextResponse.json({ error: 'Todos los campos son obligatorios.' }, { status: 400 });

  }

  // validar email_contacto básico

  if (!/\S+@\S+\.\S+/.test(email_contacto)) {

    return NextResponse.json({ error: 'email_contacto inválido' }, { status: 400 });

  }

  const exists = await prisma.client.findUnique({ where: { rut_empresa } });

  if (exists) return NextResponse.json({ error: 'Cliente con ese RUT ya existe' }, { status: 409 });

  const client = await prisma.client.create({

    data: {

      rut_empresa,

      rubro,

      razon_social,

      telefono,

      direccion,

      nombre_contacto,

      email_contacto

    }

  });

  return NextResponse.json(client, { status: 201 });
  }