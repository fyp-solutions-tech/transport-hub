
import BookRide from "@/components/ui/google/js-google";
import MapProvider from "@/components/ui/google/map-provider";

export default function GoogleSignInButton() {

  return (
    <MapProvider>
      <BookRide />
    </MapProvider>
  );
}