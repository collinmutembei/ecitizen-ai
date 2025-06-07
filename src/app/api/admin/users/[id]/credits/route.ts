import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// PATCH /api/admin/users/[id]/credits - Update user credits
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const { credits } = await req.json();
  await prisma.user.update({
    where: { id },
    data: { credits },
  });
  return NextResponse.json({ success: true });
}
