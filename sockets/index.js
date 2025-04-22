import { WebSocketServer, WebSocket } from "ws";

const port = process.env.PORT || 3002;
const wss = new WebSocketServer({ port: port });

// Store clients by room
const rooms = new Map();

wss.on("listening", () => {
  console.log(`WebSocket server started on port ${port}`);
});

// Parse the URL to extract room information
function getRoomFromUrl(url) {
  if (!url) return null;

  try {
    const parsedUrl = new URL(url, "http://localhost");
    const pathSegments = parsedUrl.pathname.split("/").filter(Boolean);

    // Extract room name from URL path (assuming format: /messages/{roomName})
    if (pathSegments.length >= 2 && pathSegments[0] === "messages") {
      return decodeURIComponent(pathSegments[1]);
    }
  } catch (error) {
    console.error("Error parsing URL:", error);
  }

  return null;
}

wss.on("connection", function connection(ws, req) {
  // Extract room name from URL
  const room = getRoomFromUrl(req.url);

  if (!room) {
    console.log("Client attempted to connect without specifying a room");
    ws.close(1008, "Room name is required");
    return;
  }

  console.log(`Client connected to room: ${room}`);

  // Add client to the specified room
  if (!rooms.has(room)) {
    rooms.set(room, new Set());
  }

  const roomClients = rooms.get(room);
  roomClients.add(ws);

  // Send welcome message to client
  ws.send(
    JSON.stringify({
      type: "system",
      content: `Welcome to the "${room}" room!`,
      timestamp: new Date().toISOString(),
    })
  );

  ws.on("message", function message(data) {
    // Convert data to string if it's a Buffer
    const messageString = data.toString();
    console.log(`Received in room "${room}": ${messageString}`);

    try {
      // Parse message to add room information if needed
      const messageData = JSON.parse(messageString);

      // Broadcast the message to all clients in the same room
      if (rooms.has(room)) {
        rooms.get(room).forEach(function each(client) {
          if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(messageString);
          }
        });
      }
    } catch (error) {
      console.error("Error handling message:", error);
    }
  });

  // Handle client disconnection
  ws.on("close", function () {
    console.log(`Client disconnected from room: ${room}`);

    // Remove client from room
    if (rooms.has(room)) {
      rooms.get(room).delete(ws);

      // Clean up empty rooms
      if (rooms.get(room).size === 0) {
        rooms.delete(room);
        console.log(`Room "${room}" is now empty and has been removed`);
      }
    }
  });
});

// Periodically clean up dead connections
setInterval(() => {
  wss.clients.forEach((ws) => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.ping();
    }
  });
}, 30000);
