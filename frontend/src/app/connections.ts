export const backend_port = process.env.BACKEND_PORT || 3000;
export const websocket_port = process.env.WEBSOCKET_PORT || 3002;

const backend = process.env.BACKEND_URL || "http://localhost";
const websocket = process.env.WEBSOCKET_URL || "ws://localhost";

export const backend_url = `${backend}:${backend_port}`;
export const websocket_url = `${websocket}:${websocket_port}`;
