"use client";

import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { authClient } from "@/lib/auth-client";
import { useRideStore } from "@/store/useRideStore";
import { toast } from "sonner";
import { useDriverStore } from "@/store/useDriverStore";

export const useSocket = () => {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { setStatus, setRide } = useRideStore();
  const { setIncomingRides } = useDriverStore();
  const { data: session } = authClient.useSession();

  useEffect(() => {
    if (!session?.user) return;

    const userRole =
      (session.user as { role?: string }).role ?? "USER";

    const socket = io("http://localhost:3001", {
      path: "/socket.io",
      transports: ["websocket", "polling"],
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      setIsConnected(true);
      socket.emit("join", {
        userId: session.user.id,
        role: userRole,
      });
    });

    socket.on("ride:accepted", (ride) => {
      toast.success("Driver accepted your ride!");
      setRide(ride);
      setStatus("ACCEPTED");
    });

    socket.on("ride:status_update", (data) => {
      setStatus(data.status);
      if (data.status === "COMPLETED") toast.success("Ride completed!");
    });

    socket.on("ride:incoming", (ride) => {
      if (userRole === "DRIVER") {
        toast.info("New ride request nearby!", {
          description: `From: ${ride.pickupAddress}`,
        });
        setIncomingRides([ride, ...useDriverStore.getState().incomingRides]);
      }
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    return () => {
      socket.disconnect();
    };
  }, [session?.user, setRide, setStatus, setIncomingRides]);

  return {
    socket: socketRef.current,
    isConnected,
  };
};
