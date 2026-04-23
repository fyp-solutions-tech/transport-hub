-- CreateTable
CREATE TABLE "system_settings" (
    "id" TEXT NOT NULL DEFAULT 'global',
    "platformName" TEXT NOT NULL DEFAULT 'Transport Hub',
    "supportEmail" TEXT NOT NULL DEFAULT 'support@transporthub.com',
    "maintenance" BOOLEAN NOT NULL DEFAULT false,
    "baseFare" DOUBLE PRECISION NOT NULL DEFAULT 30,
    "perKmRate" DOUBLE PRECISION NOT NULL DEFAULT 10,
    "platformFee" DOUBLE PRECISION NOT NULL DEFAULT 15,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "system_settings_pkey" PRIMARY KEY ("id")
);
