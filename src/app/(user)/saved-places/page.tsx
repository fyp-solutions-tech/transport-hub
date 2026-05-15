import { requireRole } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import SavedPlacesClient from "./SavedPlacesClient";

export const metadata = { title: "Saved Places | TransportHub" };

export default async function SavedPlacesPage() {
  const { session } = await requireRole("USER");

  const places = await prisma.savedPlace.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  const home = places.find((p: any) => p.type === "HOME");
  const work = places.find((p: any) => p.type === "WORK");
  const others = places.filter((p: any) => p.type === "OTHER");

  return <SavedPlacesClient home={home} work={work} others={others} />;
}
