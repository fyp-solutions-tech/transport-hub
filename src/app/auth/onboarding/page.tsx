import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";           
import { headers } from "next/headers";

interface SearchParams {
  intendedRole?: "USER" | "DRIVER";
}

export default async function OnboardingPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { intendedRole } = await searchParams;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/auth/login");
  }

  const currentRole = session.user.role as "USER" | "DRIVER";

  // Only update if they chose DRIVER and currently have default USER
  if (intendedRole === "DRIVER" && currentRole === "USER") {
    await auth.api.updateUser({
      body: {
        role: "DRIVER",
      } as any,
      headers: await headers(),
    });
  }

  // Always redirect to dashboard after role is set
  redirect("/dashboard");
}