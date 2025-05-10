import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

// Import a helper to convert NextRequest -> Node request (needed for getServerSession)
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  // You can now get session using cookies instead of passing req/res
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json("You are not logged in", { status: 200 });
  }
  return NextResponse.json(session.user);
}
