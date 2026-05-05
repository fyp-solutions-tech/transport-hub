import crypto from "node:crypto";
import { prisma } from "../lib/prisma";
import type { PaymentMethod, Role, RideStatus } from "@prisma/client";

export type LatLng = { lat: number; lng: number };

export type SimulatedRideOptions = {
  pickup: LatLng & { address: string };
  dropoff: LatLng & { address: string };
  vehicleType?: string;
  paymentMethod?: PaymentMethod;
  mockDrivers?: {
    count: number;
    radiusKm?: number;
    acceptProbability?: number; // per-driver chance to accept
    responseDelayMs?: { min: number; max: number };
  };
  route?: {
    tickMs?: number;
    driverSpeedKmh?: number;
    passengerSpeedKmh?: number;
  };
  passenger?: {
    id?: string;
    email?: string;
    name?: string;
  };
  seed?: number;
};

export type SimulatedRideResult = {
  rideId: string;
  passengerId: string;
  driverId: string | null;
  status: RideStatus;
};

function mulberry32(seed: number) {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let x = Math.imul(t ^ (t >>> 15), 1 | t);
    x ^= x + Math.imul(x ^ (x >>> 7), 61 | x);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function haversineKm(a: LatLng, b: LatLng) {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const s1 = Math.sin(dLat / 2);
  const s2 = Math.sin(dLng / 2);
  const q =
    s1 * s1 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * (s2 * s2);
  return 2 * R * Math.asin(Math.sqrt(q));
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function lerpLatLng(a: LatLng, b: LatLng, t: number): LatLng {
  return { lat: lerp(a.lat, b.lat, t), lng: lerp(a.lng, b.lng, t) };
}

function randomOffsetAround(
  center: LatLng,
  radiusKm: number,
  rand: () => number
): LatLng {
  // Approx: 1 degree latitude ~= 111km; longitude scales with cos(lat)
  const r = Math.sqrt(rand()) * radiusKm;
  const theta = rand() * 2 * Math.PI;
  const dLatKm = r * Math.cos(theta);
  const dLngKm = r * Math.sin(theta);
  const degPerKmLat = 1 / 111;
  const degPerKmLng = 1 / (111 * Math.cos((center.lat * Math.PI) / 180));
  return {
    lat: center.lat + dLatKm * degPerKmLat,
    lng: center.lng + dLngKm * degPerKmLng,
  };
}

function estimateFarePKR(distanceKm: number, vehicleType?: string) {
  // Keep this aligned with your API estimate defaults (simple + deterministic).
  // If you later make this dynamic (SystemSettings), the simulator can fetch it too.
  const base = vehicleType?.toLowerCase().includes("premium") ? 50 : 30;
  const perKm = vehicleType?.toLowerCase().includes("premium") ? 15 : 10;
  return Math.round((base + perKm * distanceKm) * 100) / 100;
}

async function upsertMockDriver(args: {
  index: number;
  position: LatLng;
  vehicleType?: string;
}) {
  const id = `mock-driver-${args.index}`;
  const email = `mock.driver.${args.index}@sim.local`;
  const name = `Mock Driver ${args.index}`;
  const role: Role = "DRIVER";

  return prisma.user.upsert({
    where: { email },
    create: {
      id,
      email,
      name,
      role,
      isOnline: true,
      vehicleType: args.vehicleType || "standard",
      lastLat: args.position.lat,
      lastLng: args.position.lng,
    },
    update: {
      role,
      isOnline: true,
      vehicleType: args.vehicleType || "standard",
      lastLat: args.position.lat,
      lastLng: args.position.lng,
      name,
    },
    select: { id: true, lastLat: true, lastLng: true, vehicleType: true },
  });
}

async function upsertMockPassenger(args?: {
  id?: string;
  email?: string;
  name?: string;
}) {
  const id = args?.id || `mock-passenger-${crypto.randomUUID()}`;
  const email = args?.email || `mock.passenger.${crypto.randomUUID()}@sim.local`;
  const name = args?.name || "Mock Passenger";
  const role: Role = "USER";

  return prisma.user.upsert({
    where: { email },
    create: { id, email, name, role },
    update: { name, role },
    select: { id: true },
  });
}

async function driveSegment(args: {
  driverId: string;
  start: LatLng;
  end: LatLng;
  speedKmh: number;
  tickMs: number;
}) {
  const distanceKm = haversineKm(args.start, args.end);
  const speed = Math.max(1, args.speedKmh);
  const durationSec = (distanceKm / speed) * 3600;
  const ticks = Math.max(1, Math.ceil((durationSec * 1000) / args.tickMs));

  for (let i = 1; i <= ticks; i++) {
    const t = i / ticks;
    const pos = lerpLatLng(args.start, args.end, t);
    await prisma.user.update({
      where: { id: args.driverId },
      data: { lastLat: pos.lat, lastLng: pos.lng },
    });
    await sleep(args.tickMs);
  }
}

export async function simulateRideBooking(
  options: SimulatedRideOptions
): Promise<SimulatedRideResult> {
  const seed =
    options.seed ??
    (Date.now() ^ (options.pickup.lat * 1e6) ^ (options.pickup.lng * 1e6)) >>> 0;
  const rand = mulberry32(seed);

  const mockDrivers = {
    count: options.mockDrivers?.count ?? 8,
    radiusKm: options.mockDrivers?.radiusKm ?? 3,
    acceptProbability: clamp(options.mockDrivers?.acceptProbability ?? 0.65, 0, 1),
    responseDelayMs: options.mockDrivers?.responseDelayMs ?? { min: 150, max: 1200 },
  };

  const route = {
    tickMs: options.route?.tickMs ?? 750,
    driverSpeedKmh: options.route?.driverSpeedKmh ?? 28,
    passengerSpeedKmh: options.route?.passengerSpeedKmh ?? 34,
  };

  const passenger = await upsertMockPassenger(options.passenger);

  const driverPool = await Promise.all(
    Array.from({ length: mockDrivers.count }, (_, i) =>
      upsertMockDriver({
        index: i + 1,
        position: randomOffsetAround(options.pickup, mockDrivers.radiusKm, rand),
        vehicleType: options.vehicleType,
      })
    )
  );

  const rideDistanceKm = haversineKm(options.pickup, options.dropoff);
  const fare = estimateFarePKR(rideDistanceKm, options.vehicleType);
  const durationMin = Math.max(1, Math.round((rideDistanceKm / 30) * 60));

  const ride = await prisma.ride.create({
    data: {
      passengerId: passenger.id,
      pickupLat: options.pickup.lat,
      pickupLng: options.pickup.lng,
      pickupAddress: options.pickup.address,
      dropoffLat: options.dropoff.lat,
      dropoffLng: options.dropoff.lng,
      dropoffAddress: options.dropoff.address,
      vehicleType: options.vehicleType || "standard",
      paymentMethod: options.paymentMethod || "CASH",
      distanceKm: Math.round(rideDistanceKm * 100) / 100,
      durationMin,
      fare,
      status: "PENDING",
    },
    select: { id: true },
  });

  // Find the closest driver that accepts.
  const candidates = driverPool
    .map((d) => ({
      driverId: d.id,
      lat: d.lastLat ?? options.pickup.lat,
      lng: d.lastLng ?? options.pickup.lng,
      distanceKm: haversineKm(
        { lat: d.lastLat ?? options.pickup.lat, lng: d.lastLng ?? options.pickup.lng },
        options.pickup
      ),
    }))
    .sort((a, b) => a.distanceKm - b.distanceKm);

  let chosen: { driverId: string; lat: number; lng: number } | null = null;
  for (const c of candidates) {
    const delay =
      mockDrivers.responseDelayMs.min +
      Math.floor(rand() * (mockDrivers.responseDelayMs.max - mockDrivers.responseDelayMs.min));
    await sleep(delay);
    if (rand() <= mockDrivers.acceptProbability) {
      chosen = { driverId: c.driverId, lat: c.lat, lng: c.lng };
      break;
    }
  }

  if (!chosen) {
    await prisma.ride.update({
      where: { id: ride.id },
      data: {
        status: "CANCELLED",
        cancelledAt: new Date(),
        cancellationReason: "No mock drivers accepted the ride",
      },
    });
    return { rideId: ride.id, passengerId: passenger.id, driverId: null, status: "CANCELLED" };
  }

  await prisma.ride.update({
    where: { id: ride.id },
    data: {
      driverId: chosen.driverId,
      status: "ACCEPTED",
      acceptedAt: new Date(),
    },
  });

  await prisma.ride.update({
    where: { id: ride.id },
    data: { status: "ARRIVING" },
  });

  await driveSegment({
    driverId: chosen.driverId,
    start: { lat: chosen.lat, lng: chosen.lng },
    end: options.pickup,
    speedKmh: route.driverSpeedKmh,
    tickMs: route.tickMs,
  });

  await prisma.ride.update({
    where: { id: ride.id },
    data: { arrivedAt: new Date() },
  });

  await prisma.ride.update({
    where: { id: ride.id },
    data: { status: "IN_PROGRESS", startedAt: new Date() },
  });

  await driveSegment({
    driverId: chosen.driverId,
    start: options.pickup,
    end: options.dropoff,
    speedKmh: route.passengerSpeedKmh,
    tickMs: route.tickMs,
  });

  await prisma.ride.update({
    where: { id: ride.id },
    data: { status: "COMPLETED", completedAt: new Date() },
  });

  await prisma.user.update({
    where: { id: chosen.driverId },
    data: {
      totalEarnings: { increment: fare },
      totalTrips: { increment: 1 },
    },
  });

  await prisma.paymentTransaction.create({
    data: {
      userId: passenger.id,
      rideId: ride.id,
      amount: fare,
      method: options.paymentMethod || "CASH",
      status: "PAID",
      type: "RIDE_FARE",
    },
  });

  return { rideId: ride.id, passengerId: passenger.id, driverId: chosen.driverId, status: "COMPLETED" };
}

