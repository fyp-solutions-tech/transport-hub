import { Resend } from "resend";

const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY);

interface SendEmailOptions {
    to: string;
    subject: string;
    text?: string;
    html?: string;
}

export const sendEmail = async ({ to, subject, text, html }: SendEmailOptions) => {
    const { data, error } = await resend.emails.send({
        from: process.env.NEXT_PUBLIC_EMAIL_FROM || "onboarding@resend.dev",
        to,
        subject,
        text: text || "",
        html,
    });

    if (error) {
        console.error("Failed to send email:", error);
        throw new Error("Email delivery failed");
    }

    return data;
};