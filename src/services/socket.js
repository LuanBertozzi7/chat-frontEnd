import { io } from "socket.io-client";
import { API_URL } from "./api";

export function createSocket(token) {
  return io(API_URL, {
    transports: ["websocket"],
    auth: { token },
  });
}
