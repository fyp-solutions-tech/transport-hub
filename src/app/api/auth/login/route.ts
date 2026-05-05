import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    const result = await auth.api.signInEmail({
      body: {
        email,
        password
      },
      asResponse: true,
      headers: req.headers
    });

    return result;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
