function numArg(name: string, fallback: number) {
  const raw = process.argv.find((a) => a.startsWith(`--${name}=`));
  if (!raw) return fallback;
  const v = Number(raw.split("=")[1]);
  return Number.isFinite(v) ? v : fallback;
}

function strArg(name: string, fallback: string) {
  const raw = process.argv.find((a) => a.startsWith(`--${name}=`));
  return raw ? raw.split("=").slice(1).join("=") : fallback;
}

const pickupLat = numArg("pickupLat", 31.5204);
const pickupLng = numArg("pickupLng", 74.3587);
const dropoffLat = numArg("dropoffLat", 31.4704);
const dropoffLng = numArg("dropoffLng", 74.2728);

const drivers = numArg("drivers", 10);
const acceptProbability = numArg("acceptProbability", 0.7);
const tickMs = numArg("tickMs", 650);
const seed = numArg("seed", Date.now() >>> 0);
const vehicleType = strArg("vehicleType", "standard");

const pickupAddress = strArg("pickupAddress", "Sim Pickup");
const dropoffAddress = strArg("dropoffAddress", "Sim Dropoff");

if (!process.env.DATABASE_URL) {
  console.error("Missing DATABASE_URL. Set it in your environment (.env.local) before running this simulation.");
  process.exit(1);
}

console.log("> Simulating ride booking...");
console.log(
  JSON.stringify(
    {
      pickup: { lat: pickupLat, lng: pickupLng, address: pickupAddress },
      dropoff: { lat: dropoffLat, lng: dropoffLng, address: dropoffAddress },
      drivers,
      acceptProbability,
      tickMs,
      seed,
      vehicleType,
    },
    null,
    2
  )
);

const { simulateRideBooking } = await import("../src/sim/ride-simulator");

const result = await simulateRideBooking({
  pickup: { lat: pickupLat, lng: pickupLng, address: pickupAddress },
  dropoff: { lat: dropoffLat, lng: dropoffLng, address: dropoffAddress },
  vehicleType,
  paymentMethod: "CASH",
  seed,
  mockDrivers: { count: drivers, acceptProbability },
  route: { tickMs },
});

console.log("> Done");
console.log(JSON.stringify(result, null, 2));

export {};
