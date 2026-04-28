// src/app/auth/[page]/page.tsx
import FormLayout from "@/components/layouts/form"

export interface AuthProps {
    page: "signup" | "login"
}

interface PageProps {
    params: Promise<AuthProps>;
    searchParams: Promise<{ driver?: string }>;
}

const Page = async (
    { params, searchParams }: PageProps
) => {
    const { page } = await params
    const { driver } = await searchParams

    return (
        <FormLayout page={page} para={driver === "true"} />
    )
}

export default Page