import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { nextCookies } from "better-auth/next-js";
import { sendEmail } from "../../email/template";
// If your Prisma file is located elsewhere, you can change the path


export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    emailAndPassword: {
        enabled: true,
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            accessType: "offline",
            prompt: "select_account consent",
        },
    },
    user: {
        additionalFields: {
            role: {
                type: "string",
                required: false,
                defaultValue: "USER",
                input: true
            },
            isOnline: {
                type: "boolean",
                required: false,
                defaultValue: false,
                input: true
            },
            vehicleType: {
                type: "string",
                required: false,
                input: true
            },
            vehicleMake: {
                type: "string",
                required: false,
                input: true
            },
            vehicleModel: {
                type: "string",
                required: false,
                input: true
            },
            vehicleYear: {
                type: "string",
                required: false,
                input: true
            },
            vehicleColor: {
                type: "string",
                required: false,
                input: true
            },
            vehiclePlate: {
                type: "string",
                required: false,
                input: true
            },
            rating: {
                type: "number",
                required: false,
                input: false
            },
            totalEarnings: {
                type: "number",
                required: false,
                defaultValue: 0,
                input: false
            },
            totalTrips: {
                type: "number",
                required: false,
                defaultValue: 0,
                input: false
            },
            lastLat: {
                type: "number",
                required: false,
                input: false
            },
            lastLng: {
                type: "number",
                required: false,
                input: false
            }
        }
    },
    emailVerification: {
        sendOnSignUp: true,
        sendVerificationEmail: async ({ user, url, token }, request) => {
            void sendEmail({
                to: user.email,
                subject: "Verify your email address",
                text: `Click the link to verify your email: ${url}`,
                html: `<p>Click the link below to verify your email address:</p>
                       <a href="${url}">Verify Email</a>`,
            });
        },
    },
    plugins: [nextCookies()]
});

export type Auth = typeof auth