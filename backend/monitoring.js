const client = require("prom-client");

const register = new client.Registry();

client.collectDefaultMetrics({ register });

const httpRequestsTotal = new client.Counter({
  name: "app_http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "status_code"],
  registers: [register]
});

const httpRequestDuration = new client.Histogram({
  name: "app_http_request_duration_seconds",
  help: "HTTP request duration in seconds",
  labelNames: ["method", "route", "status_code"],
  buckets: [0.05, 0.1, 0.3, 0.5, 1, 2, 5],
  registers: [register]
});

const loginAttemptsTotal = new client.Counter({
  name: "app_login_attempts_total",
  help: "Total number of login attempts",
  labelNames: ["result"],
  registers: [register]
});

const messagesCreatedTotal = new client.Counter({
  name: "app_messages_created_total",
  help: "Total number of created messages",
  registers: [register]
});

const activeSocketConnections = new client.Gauge({
  name: "app_active_socket_connections",
  help: "Current number of active Socket.IO connections",
  registers: [register]
});

const normalizeRoute = (path) => {
  if (!path) {
    return "unknown";
  }

  return path
    .replace(/\/[0-9a-fA-F]{24}(?=\/|$)/g, "/:id")
    .replace(/\/\d+(?=\/|$)/g, "/:id");
};

const metricsMiddleware = (req, res, next) => {
  const startedAt = process.hrtime.bigint();

  res.on("finish", () => {
    const duration = Number(process.hrtime.bigint() - startedAt) / 1e9;
    const labels = {
      method: req.method,
      route: normalizeRoute(req.path),
      status_code: String(res.statusCode)
    };

    httpRequestsTotal.inc(labels);
    httpRequestDuration.observe(labels, duration);
  });

  next();
};

const metricsHandler = async (req, res) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
};

const trackLoginAttempt = (result) => {
  loginAttemptsTotal.inc({ result });
};

const trackMessageCreated = () => {
  messagesCreatedTotal.inc();
};

const trackSocketConnection = (delta) => {
  activeSocketConnections.inc(delta);
};

module.exports = {
  metricsMiddleware,
  metricsHandler,
  trackLoginAttempt,
  trackMessageCreated,
  trackSocketConnection
};
