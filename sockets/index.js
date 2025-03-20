import { WebSocketServer, WebSocket } from "ws";

const port = process.env.PORT || 3002;
const wss = new WebSocketServer({ port: port });

wss.on("listening", () => {
  console.log(`WebSocket server started on port ${port}`);
});

wss.on("connection", function connection(ws) {
  ws.on("message", function message(data) {
    // Convert data to string if it's a Buffer
    const messageString = data.toString();
    console.log("received: %s", messageString);

    // Broadcast the received message (as a string) to all other connected clients
    wss.clients.forEach(function each(client) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(messageString);
      }
    });
  });
});
