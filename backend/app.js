const express = require("express");
const cors = require("cors"); // Import cors
const client = require("prom-client");
const authRoutes = require("./src/routes/authRoutes");
const adminRoutes = require("./src/routes/adminRoutes");
const facultyRoutes = require("./src/routes/facultyRoutes");
const studentRoutes = require("./src/routes/studentRoutes");

const app = express();
client.collectDefaultMetrics();

const httpRequestsTotal = new client.Counter({
  name: "college_app_http_requests_total",
  help: "Total number of HTTP requests received by the app",
  labelNames: ["method", "route", "status_code"],
});

const httpRequestDurationSeconds = new client.Histogram({
  name: "college_app_http_request_duration_seconds",
  help: "HTTP request duration in seconds",
  labelNames: ["method", "route", "status_code"],
  buckets: [0.01, 0.05, 0.1, 0.25, 0.5, 1, 2, 5],
});

// Enable CORS for all routes
app.use(cors());

// Parse JSON bodies
app.use(express.json());

app.use((req, res, next) => {
  const start = process.hrtime.bigint();

  res.on("finish", () => {
    const durationSeconds = Number(process.hrtime.bigint() - start) / 1e9;
    const route = req.route?.path || req.path || "unknown";

    httpRequestsTotal.inc({
      method: req.method,
      route,
      status_code: String(res.statusCode),
    });

    httpRequestDurationSeconds.observe(
      {
        method: req.method,
        route,
        status_code: String(res.statusCode),
      },
      durationSeconds
    );
  });

  next();
});

app.get("/metrics", async (_req, res) => {
  res.set("Content-Type", client.register.contentType);
  res.end(await client.register.metrics());
});

// Use routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/faculty", facultyRoutes);
app.use("/api/student", studentRoutes);

module.exports = app;
