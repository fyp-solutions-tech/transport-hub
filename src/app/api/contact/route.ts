// app/api/contact/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const contactSchema = z.object({
  firstName: z.string().trim().min(1).max(100),
  lastName: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(254),
  message: z.string().trim().min(10).max(2000),
});

export async function POST(req: NextRequest) {
  try {
    const parsedBody = contactSchema.safeParse(await req.json());
    if (!parsedBody.success) {
      return NextResponse.json(
        { error: "Invalid contact form payload." },
        { status: 400 }
      );
    }
    const { firstName, lastName, email, message } = parsedBody.data;

    const contact = await (prisma as any).contact.create({
      data: { firstName, lastName, email, message },
    });

    return NextResponse.json(
      { success: true, id: contact.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}