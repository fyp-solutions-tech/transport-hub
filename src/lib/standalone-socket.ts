import { createServer } from "http";
import { initSocketServer } from "./socket";

const port = process.env.SOCKET_PORT || 3001;
const httpServer = createServer((req, res) => {
  res.writeHead(200);
  res.end("Socket.IO server is running");
});

initSocketServer(httpServer);

httpServer.listen(port, () => {
  console.log(`> Socket.IO server ready on http://localhost:${port}`);
});
