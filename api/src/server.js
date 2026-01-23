require("dotenv").config();

const http = require("http");
const { Server } = require("socket.io");

const { createApp } = require("./app");
const { connectDB } = require("./config/db");
const { initSockets } = require("./sockets");

async function start() {
  try {
    await connectDB();
    console.log("Connected to MongoDB");

    const app = createApp();
    const port = process.env.PORT || 5000;

    const server = http.createServer(app);

    const io = new Server(server, {
      cors: {
        origin: process.env.CLIENT_ORIGIN || "*",
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
      },
    });

    initSockets(io);

    app.set("io", io);

    server.listen(port, () => {
      console.log(`API running on http://localhost:${port}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err.message);
    process.exit(1);
  }
}

start();