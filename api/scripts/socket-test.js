const { io } = require("socket.io-client");

const SERVER_URL = process.env.SOCKET_URL || "http://localhost:5000";
const USER_ID = process.env.USER_ID;

if (!USER_ID) {
  console.error("Missing USER_ID. Example:");
  console.error('USER_ID="YOUR_USER_ID" node scripts/socket-test.js');
  process.exit(1);
}

console.log(`Connecting to ${SERVER_URL} ...`);

const socket = io(SERVER_URL, {
  transports: ["websocket"],
});

socket.on("connect", () => {
  console.log("Connected. Socket ID:", socket.id);

  socket.emit("join", { userId: USER_ID });
  console.log(`Joined room user:${USER_ID}`);
});

socket.on("order.status.updated", (payload) => {
  console.log("Received order.status.updated:", payload);
});

socket.on("disconnect", (reason) => {
  console.log("Disconnected:", reason);
});

socket.on("connect_error", (err) => {
  console.log("Connection error:", err.message);
});