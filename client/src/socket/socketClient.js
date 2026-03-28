import { io } from "socket.io-client";

let socket = null;

export function initSocket(token) {
  if (!token) return null;
  if (socket) return socket;
  socket = io(process.env.REACT_APP_API_BASE || "http://localhost:4000", {
    transports: ["websocket"],
    auth: { token }
  });

  socket.on("connect_error", (err) => {
    console.warn("Socket connect error:", err.message);
  });

  return socket;
}

export function getSocket() { return socket; }
