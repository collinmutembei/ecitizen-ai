import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET /api/admin/users - List all users
export async function GET(req: NextRequest) {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      credits: true,
      isSubscribed: true,
      role: true,
      deactivated: true,
    },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ users });
}
