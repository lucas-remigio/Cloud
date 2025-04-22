export const backend_port = process.env.BACKEND_PORT || 3000;
export const websocket_port = process.env.WEBSOCKET_PORT || 3002;

const backend = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost";
const websocket = process.env.NEXT_PUBLIC_WEBSOCKET_URL || "ws://localhost";

console.log("Backend Process URL:", process.env.NEXT_PUBLIC_BACKEND_URL);
console.log("WebSocket Process URL:", process.env.NEXT_PUBLIC_WEBSOCKET_URL);
console.log("Backend URL:", backend);
console.log("WebSocket URL:", websocket);

export const backend_url = `${backend}:${backend_port}`;
export const websocket_url = `${websocket}:${websocket_port}`;
