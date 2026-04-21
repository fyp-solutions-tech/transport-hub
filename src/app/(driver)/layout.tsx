import { requireRole } from "@/lib/session";
import DriverShell from "@/components/ui/shell/driver-shell";
import { StoreInitializer } from "@/components/auth/store-initializer";

export default async function DriverLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { session, role } = await requireRole("DRIVER");
  
  const user = {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
    emailVerified: session.user.emailVerified,
    image: session.user.image,
    role: role,
  };

  return (
    <>
      <StoreInitializer user={user} />
      <DriverShell user={user}>{children}</DriverShell>
    </>
  );
}
