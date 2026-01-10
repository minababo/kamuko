require("dotenv").config();

const { createApp } = require("./app");
const { connectDB } = require("./config/db");

async function start() {
  try {
    await connectDB();
    console.log("Connected to MongoDB");

    const app = createApp();
    const port = process.env.PORT || 5000;

    app.listen(port, () => {
      console.log(`API running on http://localhost:${port}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err.message);
    process.exit(1);
  }
}

start();