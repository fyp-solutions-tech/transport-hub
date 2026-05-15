import MapProvider from "@/components/ui/google/map-provider";

export default function SavedPlacesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MapProvider>{children}</MapProvider>;
}
