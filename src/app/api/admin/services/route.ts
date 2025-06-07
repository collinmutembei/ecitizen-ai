import { NextRequest, NextResponse } from "next/server";
import { SERVICES } from "@/lib/mcp-server";
import { prisma } from "@/lib/db";

// GET /api/admin/services - List all services and their prices
export async function GET() {
  // In-memory config for now; could be loaded from DB if needed
  return NextResponse.json({ services: Object.values(SERVICES) });
}

// PATCH /api/admin/services/[serviceName] - Update service price
export async function PATCH(req: NextRequest, { params }: { params: { serviceName: string } }) {
  const { serviceName } = params;
  const { creditsRequired } = await req.json();
  if (!SERVICES[serviceName]) {
    return NextResponse.json({ error: "Service not found" }, { status: 404 });
  }
  // This would update a persistent config in a real app
  SERVICES[serviceName].creditsRequired = creditsRequired;
  return NextResponse.json({ success: true });
}
