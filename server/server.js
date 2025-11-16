const dotenv = require("dotenv");
const process = require("process");
const express = require("express");
const path = require("path");
const session = require("express-session");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const helmet = require("helmet");
const http = require("http");
const compression = require("compression");
const { sequelize } = require("./models");
const { defaultLimiter } = require("./middleware/rateLimiters");

// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 3000;

// Allowed origins untuk CORS (production-ready)
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : ["http://localhost:3000", "http://localhost:5173"]; // default dev origins

// Trust proxy jika di belakang proxy/load balancer (Nginx, CloudFlare, etc.)
app.set("trust proxy", 1);

// Security middleware
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:", "http:"],
        // reportUri: process.env.REPORT_URI,
      },
    },
  })
);

// Logging middleware
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// Request parsing
app.use(cookieParser());
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));

// Compression middleware
app.use(compression());

// CORS configuration
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (process.env.NODE_ENV === "production") {
        if (allowedOrigins.includes(origin)) {
          return callback(null, true);
        }
        return callback(new Error("Not allowed by CORS"));
      }

      // Development mode: allow all
      return callback(null, origin);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Global Rate limiting
app.use(defaultLimiter);

// Session configuration
app.use(
  session({
    secret:
      process.env.SESSION_SECRET ||
      "iJDhSEraPbSq3YUGYKcDhylOPmv/wm6K1sP/uhngyoY=",
    name: process.env.SESSION_NAME || `${process.env.APP_NAME}_sessid`,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * (Number(process.env.SESSION_EXPIRE_HOURS) || 1),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
    },
  })
);

app.set("view engine", "ejs");

// Serve static files
app.use(
  process.env.PUBLIC_PATH || "/public",
  express.static(path.join(__dirname, process.env.UPLOAD_PATH))
);

// Health check route
app.get("/", (req, res) => {
  res.json({
    message: `${process.env.APP_NAME} v${
      process.env.APP_VERSION || `beta-${Date.now()}`
    } is running!`,
    version: process.env.APP_VERSION || `beta-${Date.now()}`,
    status: "active",
    timestamp: new Date().toISOString(),
  });
});

// Health check endpoint (untuk load balancer/monitoring)
app.get("/health", async (req, res) => {
  if (req.headers["x-health-token"] !== process.env.HEALTH_TOKEN)
    return res.status(403).json({ status: "forbidden" });

  const checks = {};

  try {
    const dbStatus = await sequelize
      .authenticate()
      .then(() => "connected")
      .catch(() => "disconnected");
    checks.database = dbStatus;

    // Tambah check lain kalau perlu (Redis, API eksternal, dll)
    // checks.redis = redisClient.isOpen ? "connected" : "disconnected";

    const allHealthy = Object.values(checks).every(
      (s) => s === "connected" || s === "active"
    );

    res.status(allHealthy ? 200 : 503).json({
      status: allHealthy ? "ok" : "degraded",
      uptime: process.uptime(),
      timestamp: Date.now(),
      checks,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
});

// Load router dinamis
const arr_router = [
  "auth",
  "user",
  "device",
  // tambahkan router lain di sini
];

const arr = {};
arr_router.forEach((e) => {
  try {
    if (typeof e === "object" && e.list && e.list.length > 0) {
      e.list.forEach((x) => {
        arr[
          `router_${e.list[x]}`
        ] = require(`./router/${e.folder}/${e.list[x]}/index`);
      });
    } else if (typeof e === "string") {
      arr[`router_${e}`] = require(`./router/router_${e}`);
    } else {
      console.warn(
        `Router '${e}' is neither an object nor a string, skipping...`
      );
    }
  } catch (error) {
    console.warn(`Router '${e}' not found: ${error.message}`);
  }
});

// Load model dan sync database
const db = require("./models");

(async () => {
  try {
    // // Gunakan alter: true di development, false di production
    // const syncOptions =
    //   process.env.NODE_ENV === "production"
    //     ? { alter: false }
    //     : { alter: true };

    // Sync database
    const syncOptions = { alter: false };
    await db.sequelize.sync(syncOptions);
    console.log("✅ Database synchronized successfully");
  } catch (error) {
    console.error("❌ Database sync error:", error);
    process.exit(1); // Exit jika database gagal
  }
})();

// Mount all routers
for (let x in arr) {
  app.use("/api", arr[x]);
}

// =============================================
// Error Handlers
// =============================================

// 404 handler (harus setelah semua routes)
app.use((req, res) => {
  res.status(404).json({
    error: true,
    message: "Rute tidak ditemukan atau tidak valid",
    path: req.originalUrl,
    method: req.method,
  });
});

// =============================================
// Graceful Shutdown
// =============================================

const gracefulShutdown = async (signal) => {
  console.log(`\n${signal} received, closing server gracefully...`);

  server.close(async () => {
    console.log("✅ HTTP server closed");

    // Close database connection
    try {
      await db.sequelize.close();
      console.log("✅ Database connection closed");
    } catch (error) {
      console.error("❌ Error closing database:", error);
    }

    process.exit(0);
  });

  // Force close after 10 seconds
  setTimeout(() => {
    console.error("⚠️ Forced shutdown after timeout");
    process.exit(1);
  }, 10000);
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

// Unhandled rejection handler
process.on("unhandledRejection", (reason, promise) => {
  console.error("❌ Unhandled Rejection at:", promise, "reason:", reason);
  // Dalam production, log ke monitoring service (Sentry, Winston, dll)
});

// =============================================
// Start Server
// =============================================

server.listen(port, () => {
  console.log(`
╔══════════════════════════════════════════════╗
║  ✅ ${process.env.APP_NAME || "Server"} | ${
    process.env.APP_VERSION
  } is running!
║  📡 Port: ${port}
║  🔒 Environment: ${process.env.NODE_ENV || "development"}
║  🌐 Full Url: http://localhost:${port}
╚══════════════════════════════════════════════╝
  `);
});

module.exports = { app, server };
