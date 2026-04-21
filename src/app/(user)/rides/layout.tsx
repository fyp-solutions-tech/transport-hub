import MapProvider from "@/components/ui/google/map-provider";

export default function RidesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MapProvider>{children}</MapProvider>;
}
