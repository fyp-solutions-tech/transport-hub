"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateSystemSettings(formData: FormData) {
  try {
    const platformName = formData.get("platformName") as string;
    const supportEmail = formData.get("supportEmail") as string;
    const maintenance = formData.get("maintenance") === "on";
    const baseFare = parseFloat(formData.get("baseFare") as string) || 0;
    const perKmRate = parseFloat(formData.get("perKmRate") as string) || 0;
    const platformFee = parseFloat(formData.get("platformFee") as string) || 0;

    await (prisma as any).systemSettings.upsert({
      where: { id: "global" },
      update: {
        platformName,
        supportEmail,
        maintenance,
        baseFare,
        perKmRate,
        platformFee,
      },
      create: {
        id: "global",
        platformName,
        supportEmail,
        maintenance,
        baseFare,
        perKmRate,
        platformFee,
      },
    });

    revalidatePath("/admin/settings");
    return { success: true };
  } catch (error) {
    console.error("Failed to update settings:", error);
    return { success: false, error: "Failed to update settings" };
  }
}

export async function getSystemSettings() {
  try {
    const settings = await (prisma as any).systemSettings.findUnique({
      where: { id: "global" },
    });

    if (!settings) {
      return {
        platformName: "Transport Hub",
        supportEmail: "support@transporthub.com",
        maintenance: false,
        baseFare: 30,
        perKmRate: 10,
        platformFee: 15,
      };
    }

    return settings;
  } catch (error) {
    console.error("Failed to get system settings:", error);
    return {
      platformName: "Transport Hub",
      supportEmail: "support@transporthub.com",
      maintenance: false,
      baseFare: 30,
      perKmRate: 10,
      platformFee: 15,
    };
  }
}
