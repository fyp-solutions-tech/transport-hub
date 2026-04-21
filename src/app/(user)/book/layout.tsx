import MapProvider from "@/components/ui/google/map-provider";

export default function BookLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MapProvider>{children}</MapProvider>;
}
