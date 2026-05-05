import { Server as HttpServer } from "http";
import { Server as SocketIOServer } from "socket.io";

let io: SocketIOServer;

export const initSocketServer = (server: HttpServer) => {
  io = new SocketIOServer(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    // Join room based on user role/id
    socket.on("join", ({ userId, role }) => {
      if (role === "DRIVER") {
        socket.join(`driver:${userId}`);
        socket.join("drivers:online");
      } else if (role === "USER" || role === "PASSENGER") {
        socket.join(`passenger:${userId}`);
      }
    });

    socket.on("ride:request", (data) => {
      // Forward to all online drivers
      io.to("drivers:online").emit("ride:incoming", data);
    });

    socket.on("driver:online", (data) => {
      socket.join("drivers:online");
      socket.join(`driver:${data.driverId}`);
    });

    socket.on("ride:accept", (data) => {
      // Notify the passenger
      io.to(`passenger:${data.passengerId}`).emit("ride:accepted", data);
      io.to(`ride:${data.rideId}`).emit("ride:accepted", data);
    });

    socket.on("location:update", (data) => {
      // Broadcast location update to the specific ride room
      io.to(`ride:${data.rideId}`).emit("location:updated", data);
    });

    socket.on("join:ride", (rideId) => {
      socket.join(`ride:${rideId}`);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });

  return io;
};

export const getIO = () => {
  return io || null;
};
