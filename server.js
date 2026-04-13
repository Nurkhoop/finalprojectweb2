require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { initSocket } = require("./backend/socket");
const {
  metricsMiddleware,
  metricsHandler,
  trackSocketConnection,
  trackLoginAttempt,
  trackMessageCreated
} = require("./backend/monitoring");

const connectDB = require("./backend/config/db");

// routes
const authRoutes = require("./backend/routes/authRoutes");
const userRoutes = require("./backend/routes/userRoutes");
const chatRoutes = require("./backend/routes/chatRoutes");
const messageRoutes = require("./backend/routes/messageRoutes");
const feedbackRoutes = require("./backend/routes/feedbackRoutes");

const errorMiddleware = require("./backend/middleware/errorMiddleware");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

initSocket(io);

// middlewares
app.use(cors());
app.use(express.json());
app.use(metricsMiddleware);

// test route
app.get("/", (req, res) => {
  res.send("API is running");
});

app.get("/health", (req, res) => {
  const database = mongoose.connection.readyState === 1 ? "up" : "down";
  const statusCode = database === "up" ? 200 : 503;

  res.status(statusCode).json({
    status: statusCode === 200 ? "ok" : "degraded",
    database
  });
});

app.get("/metrics", metricsHandler);

// routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/feedback", feedbackRoutes);

app.use(errorMiddleware);

io.use((socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) return next(new Error("Unauthorized"));

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded;
    next();
  } catch (error) {
    next(new Error("Unauthorized"));
  }
});

io.on("connection", (socket) => {
  trackSocketConnection(1);

  if (socket.user?.id) {
    socket.join(`user:${socket.user.id}`);
  }

  socket.on("disconnect", () => {
    trackSocketConnection(-1);
  });
});

app.locals.trackLoginAttempt = trackLoginAttempt;
app.locals.trackMessageCreated = trackMessageCreated;

// server start
const PORT = process.env.PORT || 5001;

const startServer = async () => {
  try {
    await connectDB();
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    process.exit(1);
  }
};

startServer();
