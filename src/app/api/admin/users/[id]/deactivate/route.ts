import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// POST /api/admin/users/[id]/deactivate - Deactivate a user
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  await prisma.user.update({
    where: { id },
    data: { deactivated: true },
  });
  return NextResponse.json({ success: true });
}
