"use server";

import { z } from "zod";
import { auth } from "@/lib/auth";       

const signUpSchema = z
    .object({
        name: z.string().min(2, "Name must be at least 2 characters"),
        email: z.string().email("Please enter a valid email"),
        password: z.string().min(8, "Password must be at least 8 characters"),
    })

const loginSchema = z
    .object({
        email: z.string().email("Please enter a valid email"),
        password: z.string().min(8, "Password must be at least 8 characters"),
    })

export type FormState = {
    errors?: {
        name?: string[];
        email?: string[];
        password?: string[];
    };
    message?: string;
    success?: boolean;
};

export async function loginAction(
    prevState: FormState,
    formData: FormData
): Promise<FormState> {
    const validated = loginSchema.safeParse({
        email: formData.get("email"),
        password: formData.get("password"),
    });

    if (!validated.success) {
        return {
            errors: validated.error.flatten().fieldErrors,
            message: "Validation failed",
        };
    }

    try {
        await auth.api.signInEmail({
            body: {
                email: validated.data.email,
                password: validated.data.password,
            },
        });

        return {
            success: true,
            message: "Account login successfully!",
        };
    } catch (error: any) {
        return {
            message: error.message || "Failed to logged in account. Try again.",
        };
    }
}

export async function registerAction(
    prevState: FormState,
    formData: FormData
): Promise<FormState> {
    const validated = signUpSchema.safeParse({
        name: formData.get("name"),
        email: formData.get("email"),
        password: formData.get("password"),
    });

    if (!validated.success) {
        return {
            errors: validated.error.flatten().fieldErrors,
            message: "Validation failed",
        };
    }

    try {
        await auth.api.signUpEmail({
            body: {
                name: validated.data.name as string,
                email: validated.data.email,
                password: validated.data.password,
                // role defaults to USER (as per your Prisma schema)
            },
        });

        // Success → redirect happens on client (safer with forms)
        return {
            success: true,
            message: "Account created successfully!",
        };
    } catch (error: any) {
        return {
            message: error.message || "Failed to create account. Try again.",
        };
    }
}