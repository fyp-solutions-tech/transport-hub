import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

const prismaClient = globalForPrisma.prisma || new PrismaClient({ adapter });

export const prisma = prismaClient.$extends({
  result: {
    user: {
      totalEarnings: {
        needs: { totalEarnings: true },
        compute(user) {
          return Number(user.totalEarnings);
        },
      },
    },
    ride: {
      fare: {
        needs: { fare: true },
        compute(ride) {
          return ride.fare ? Number(ride.fare) : null;
        },
      },
      tip: {
        needs: { tip: true },
        compute(ride) {
          return ride.tip ? Number(ride.tip) : null;
        },
      },
      loanAmount: {
        needs: { loanAmount: true },
        compute(ride) {
          return ride.loanAmount ? Number(ride.loanAmount) : 0;
        },
      },
    },
    wallet: {
      balance: {
        needs: { balance: true },
        compute(wallet) {
          return Number(wallet.balance);
        },
      },
    },
    paymentTransaction: {
      amount: {
        needs: { amount: true },
        compute(tx) {
          return Number(tx.amount);
        },
      },
      loanAmount: {
        needs: { loanAmount: true },
        compute(tx) {
          return tx.loanAmount ? Number(tx.loanAmount) : 0;
        },
      },
    },
  },
});

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prismaClient;

