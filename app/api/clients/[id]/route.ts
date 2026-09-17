import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getTokenFromHeader, verifyToken } from "@/lib/auth";
import { Prisma } from "@prisma/client";

async function requireAuth(req: Request) {
  const token = getTokenFromHeader(req);
  if (!token) return null;
  const data = verifyToken(token as string);
  return data;
}

function extractId(req: Request, params?: { id?: string }) {
  console.info("[DEBUG] context.params =", params);
  console.info("[DEBUG] request.url =", req.url);

  const idStr = params?.id;
  if (idStr) {
    const id = Number(idStr);
    if (!Number.isInteger(id)) return { error: "id inválido desde params" };
    return { id };
  }

  try {
    const url = new URL(req.url);
    const parts = url.pathname.split("/").filter(Boolean);
    const last = parts[parts.length - 1];
    const id = Number(last);
    if (!last || !Number.isInteger(id)) return { error: "Falta id (no viene en params ni en URL)" };
    return { id };
  } catch (e) {
    return { error: "No se pudo parsear request.url para extraer id" };
  }
}

export async function GET(req: Request, { params }: { params: { id: string } } | any) {
  const auth = await requireAuth(req);
  if (!auth) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const parsed = extractId(req, params);
  if ("error" in parsed) return NextResponse.json({ error: parsed.error }, { status: 400 });
  const id = parsed.id;

  try {
    const client = await prisma.client.findUnique({ where: { id } });
    if (!client) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
    return NextResponse.json(client);
  } catch (err) {
    console.error("GET /api/clients/[id] error:", err);
    return NextResponse.json({ error: "Error servidor" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } } | any) {
  const auth = await requireAuth(req);
  if (!auth) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const parsed = extractId(req, params);
  if ("error" in parsed) return NextResponse.json({ error: parsed.error }, { status: 400 });
  const id = parsed.id;

  const body = await req.json();
  const {
    rut_empresa,
    rubro,
    razon_social,
    telefono,
    direccion,
    nombre_contacto,
    email_contacto,
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
    return NextResponse.json({ error: "Todos los campos son obligatorios." }, { status: 400 });
  }

  if (!/\S+@\S+\.\S+/.test(email_contacto)) {
    return NextResponse.json({ error: "email_contacto inválido" }, { status: 400 });
  }

  try {
    const updated = await prisma.client.update({
      where: { id },
      data: {
        rut_empresa,
        rubro,
        razon_social,
        telefono,
        direccion,
        nombre_contacto,
        email_contacto,
      },
    });
    return NextResponse.json(updated);
  } catch (err: any) {
    console.error("PUT /api/clients/[id] error:", err);

    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2002") {
        return NextResponse.json({ error: "Valor único en conflicto", meta: err.meta }, { status: 409 });
      }
      if (err.code === "P2025") {
        return NextResponse.json({ error: "Cliente no encontrado (P2025)" }, { status: 404 });
      }
    }

    return NextResponse.json({ error: "Error actualizando cliente", details: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } } | any) {
  const auth = await requireAuth(req);
  if (!auth) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const parsed = extractId(req, params);
  if ("error" in parsed) return NextResponse.json({ error: parsed.error }, { status: 400 });
  const id = parsed.id;

  try {
    await prisma.client.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("DELETE /api/clients/[id] error:", err);

    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2025") {
        return NextResponse.json({ error: "Cliente no encontrado (P2025)" }, { status: 404 });
      }
      if (err.code === "P2003") {
        return NextResponse.json({
          error: "No se puede eliminar: existen registros relacionados (FK).",
          meta: err.meta,
        }, { status: 409 });
      }
    }

    return NextResponse.json({ error: "Error eliminando cliente", details: err.message }, { status: 500 });
  }
}