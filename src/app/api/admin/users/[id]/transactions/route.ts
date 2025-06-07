import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET /api/admin/users/[id]/transactions - List all transactions for a user
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const transactions = await prisma.serviceUsage.findMany({
    where: { userId: id },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ transactions });
}
