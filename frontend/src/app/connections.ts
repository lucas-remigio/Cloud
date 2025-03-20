export const backend_port = process.env.BACKEND_PORT || 3000;
export const websocket_port = process.env.WEBSOCKET_PORT || 3002;

console.log("backend_port", process.env.BACKEND_PORT);
console.log("websocket_port", process.env.WEBSOCKET_PORT);

export const backend_url = `http://localhost:${backend_port}`;
export const websocket_url = `ws://localhost:${websocket_port}`;
