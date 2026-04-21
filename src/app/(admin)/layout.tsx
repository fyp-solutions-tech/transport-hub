import { requireRole } from "@/lib/session";
import AdminShell from "@/components/ui/shell/admin-shell";
import { StoreInitializer } from "@/components/auth/store-initializer";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { session, role } = await requireRole("ADMIN");
  
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
      <AdminShell user={user}>{children}</AdminShell>
    </>
  );
}
