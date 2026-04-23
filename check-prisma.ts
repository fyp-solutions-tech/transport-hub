import { prisma } from "./src/lib/prisma";

async function main() {
  console.log("Prisma keys:", Object.keys(prisma));
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
