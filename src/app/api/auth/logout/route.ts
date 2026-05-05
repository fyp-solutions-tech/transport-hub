import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const result = await auth.api.signOut({
      asResponse: true,
      headers: req.headers
    });

    return result;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
