import { requireRole } from "@/lib/session";
import DashboardContent from "./DashboardContent";

export default async function DriverDashboardPage() {
  const { session } = await requireRole("DRIVER");
  const firstName = session.user.name.split(" ")[0];

  return <DashboardContent initialName={firstName} />;
}
