import { io } from "socket.io-client";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
let connectionAttempt = null;

export const socket = io(API_BASE_URL, {
  auth: {
    token: localStorage.getItem("token"),
  },
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

export const connectSocket = () => {
  if (socket.connected) return Promise.resolve();
  
  if (!connectionAttempt) {
    connectionAttempt = new Promise((resolve) => {
      console.log("🔌 Connecting socket...");
      socket.connect();
      
      const onConnect = () => {
        socket.off('connect', onConnect);
        resolve();
      };
      
      socket.on('connect', onConnect);
    });
  }
  
  return connectionAttempt;
};

export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }
  connectionAttempt = null;
};