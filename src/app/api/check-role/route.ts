import { NextResponse } from "next/server";
import { checkRole } from "@/utils/roles";

export async function GET(request: Request) {
  try {
    const isAdmin = await checkRole("admin");
    console.log("api check res: ",isAdmin);
    // Luôn trả về 200, chỉ khác nhau ở giá trị isAdmin
    return NextResponse.json({ isAdmin: isAdmin });
  } catch (error) {
    return NextResponse.json({ isAdmin: false });
  }
}
