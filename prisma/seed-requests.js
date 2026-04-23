const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding mock ride requests...');

  // 1. Create/Find some mock passengers
  const passengers = [
    { id: 'pass_1', name: 'John Wick', email: 'john@assassin.com' },
    { id: 'pass_2', name: 'Sarah Connor', email: 'sarah@resistance.com' },
    { id: 'pass_3', name: 'Tony Stark', email: 'tony@avengers.com' },
    { id: 'pass_4', name: 'Ellen Ripley', email: 'ripley@nostromo.com' },
  ];

  for (const p of passengers) {
    await prisma.user.upsert({
      where: { email: p.email },
      update: {},
      create: {
        id: p.id,
        name: p.name,
        email: p.email,
        role: 'USER',
      },
    });
  }

  // 2. Create pending rides
  const rides = [
    {
      passengerId: 'pass_1',
      pickupAddress: 'Continental Hotel, New York',
      dropoffAddress: 'Brooklyn Bridge',
      pickupLat: 40.7051,
      pickupLng: -74.0093,
      dropoffLat: 40.7061,
      dropoffLng: -73.9969,
      fare: 250,
      vehicleType: 'economy',
    },
    {
       passengerId: 'pass_2',
       pickupAddress: 'Cyberdyne Systems',
       dropoffAddress: 'Mexico Border',
       pickupLat: 34.0522,
       pickupLng: -118.2437,
       dropoffLat: 32.5149,
       dropoffLng: -117.0382,
       fare: 500,
       vehicleType: 'comfort',
    },
    {
       passengerId: 'pass_3',
       pickupAddress: 'Stark Tower',
       dropoffAddress: 'Malibu Beach',
       pickupLat: 40.7589,
       pickupLng: -73.9851,
       dropoffLat: 34.0259,
       dropoffLng: -118.7798,
       fare: 1200,
       vehicleType: 'comfort',
    },
    {
        passengerId: 'pass_4',
        pickupAddress: 'Gateway Station',
        dropoffAddress: 'LV-426',
        pickupLat: 0,
        pickupLng: 0,
        dropoffLat: 1,
        dropoffLng: 1,
        fare: 75,
        vehicleType: 'moto',
    }
  ];

  for (const r of rides) {
    await prisma.ride.create({
      data: {
        ...r,
        status: 'PENDING',
      },
    });
  }

  console.log('Seeding complete! 4 mock rides created.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
