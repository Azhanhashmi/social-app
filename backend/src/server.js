require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 5000;

// Connect to MongoDB then start server
connectDB().then(() => {
  const server = app.listen(PORT, () => {
    console.log(`\n🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    console.log(`📡 Health check: http://localhost:${PORT}/health\n`);
  });

  // ── Graceful Shutdown ────────────────────────────────────────────────────────
  const shutdown = (signal) => {
    console.log(`\n⚠️  ${signal} received. Shutting down gracefully...`);
    server.close(() => {
      console.log("✅ HTTP server closed.");
      process.exit(0);
    });

    // Force exit after 10s if server hasn't closed
    setTimeout(() => {
      console.error("❌ Forced shutdown after timeout.");
      process.exit(1);
    }, 10_000);
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));

  // Unhandled rejections
  process.on("unhandledRejection", (err) => {
    console.error("❌ Unhandled Rejection:", err.message);
    shutdown("UnhandledRejection");
  });
});
