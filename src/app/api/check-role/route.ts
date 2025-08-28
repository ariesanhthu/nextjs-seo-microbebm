import { NextResponse } from "next/server";
import { checkRole } from "@/utils/roles";

export async function GET(request: Request) {
  try {
    const isAdmin = await checkRole("admin");
    if (!isAdmin) {
      return NextResponse.json({ isAdmin: false }, { status: 403 });
    }
    return NextResponse.json({ isAdmin: true });
  } catch (error) {
    return NextResponse.json({ error: "Role check failed" }, { status: 500 });
  }
}
