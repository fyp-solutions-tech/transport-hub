import { requireRole } from "@/lib/session";
import UserShell from "@/components/ui/shell/user-shell";
import { StoreInitializer } from "@/components/auth/store-initializer";
import { Fragment } from "react/jsx-runtime";

export default async function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { session, role } = await requireRole("USER");

  const user = {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
    emailVerified: session.user.emailVerified,
    image: session.user.image,
    role: role,
  };


  return (
    <Fragment>
      <StoreInitializer user={user} />
      <UserShell user={user}>{children}</UserShell>
    </Fragment>
  );
}
