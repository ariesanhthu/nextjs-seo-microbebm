import { NextResponse } from "next/server";
import { checkRole } from "@/utils/roles";

export async function GET(request: Request) {
  const isAdmin = await checkRole("admin");

  if (!isAdmin) {
    return NextResponse.json({ isAdmin: false });
  }

  return NextResponse.json({ isAdmin: true });
}
