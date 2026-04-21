import FormLayout from "@/components/layouts/form"

export interface AuthProps {
    page: "signup" | "login"
}

interface PageProps {
    params: Promise<AuthProps>;
}

const Page = async (
    { params }: PageProps
) => {
    const { page } = await params

    return (
        <FormLayout page={page} />
    )
}

export default Page