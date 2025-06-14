
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import connectDB from "./config/db.js";
import userRouter from "./routes/userroutes.js";
import postRouter from "./routes/postroutes.js";
import notificationRouter from "./routes/notificationroutes.js";
import chatRouter from "./routes/chatroutes.js";
import jwt from "jsonwebtoken";
import Notification from "./models/Notification.js";
import Chat from "./models/Chat.js";
import Message from "./models/Message.js";
import User from "./models/usermodel.js";

dotenv.config();
connectDB();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  },
});

const connectedUsers = new Map();

app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());

io.use(async (socket, next) => {
  console.log("Socket connection attempt from:", socket.handshake.headers.origin);
  const token = socket.handshake.auth.token;
  console.log("Socket auth token:", token);
  if (!token) {
    console.log("No token provided");
    return next(new Error("Authentication error: No token"));
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("fullName");
    if (!user) {
      console.log("User not found");
      return next(new Error("Authentication error: User not found"));
    }
    socket.user = { userId: decoded.userId, fullName: user.fullName };
    console.log("Socket auth successful, user ID:", decoded.userId);
    next();
  } catch (error) {
    console.error("Socket auth error:", error.message);
    next(new Error("Authentication error: Invalid token"));
  }
});

io.on("connection", (socket) => {
  console.log("Socket connected, user:", socket.user);
  if (!socket.user || !socket.user.userId) {
    console.log("No valid user data, disconnecting socket");
    socket.disconnect(true);
    return;
  }

  const userId = socket.user.userId;
  if (connectedUsers.has(userId)) {
    console.log(`User ${userId} already connected, disconnecting older socket`);
    connectedUsers.get(userId).disconnect(true);
  }
  connectedUsers.set(userId, socket);

  console.log(`User connected: ${userId}`);
  socket.join(userId);

  socket.on("send_notification", async ({ userId, senderId, type, postId, projectId, message }) => {
    try {
      const notification = new Notification({
        userId,
        senderId,
        type,
        postId,
        projectId,
        message,
      });
      await notification.save();
      io.to(userId).emit("notification", notification);
    } catch (error) {
      console.error("Send Notification Error:", error.message);
    }
  });

  socket.on("send_message", async ({ chatId, content }) => {
    try {
      const senderId = socket.user.userId;
      const chat = await Chat.findById(chatId);
      if (!chat || !chat.participants.includes(senderId)) {
        return socket.emit("error", { message: "Invalid chat or unauthorized" });
      }

      const message = new Message({
        chatId,
        senderId,
        content,
      });
      await message.save();

      await Chat.findByIdAndUpdate(chatId, { lastMessage: message._id });

      chat.participants.forEach((participant) => {
        io.to(participant.toString()).emit("message", message);
      });

      const recipientId = chat.participants.find((p) => p.toString() !== senderId);
      if (recipientId) {
        const notification = new Notification({
          userId: recipientId,
          senderId,
          type: "message",
          message: `New message from ${socket.user.fullName}`,
        });
        await notification.save();
        io.to(recipientId.toString()).emit("notification", notification);
      }
    } catch (error) {
      console.error("Send Message Error:", error.message);
      socket.emit("error", { message: "Failed to send message" });
    }
  });

  socket.on("typing", ({ chatId, isTyping }) => {
    const senderId = socket.user.userId;
    io.to(chatId).emit("typing", { userId: senderId, isTyping });
  });

  socket.on("read_message", async ({ chatId }) => {
    try {
      const userId = socket.user.userId;
      await Message.updateMany(
        { chatId, senderId: { $ne: userId }, isRead: false },
        { isRead: true }
      );
      io.to(chatId).emit("read_message", { userId });
    } catch (error) {
      console.error("Read Message Error:", error.message);
    }
  });

  socket.on("notifications_read", async () => {
    try {
      const userId = socket.user.userId;
      await Notification.updateMany(
        { userId, isRead: false },
        { isRead: true }
      );
      io.to(userId).emit("notifications_read");
    } catch (error) {
      console.error("Notifications Read Error:", error.message);
    }
  });

  socket.on("disconnect", () => {
    if (socket.user && socket.user.userId) {
      console.log(`User disconnected: ${socket.user.userId}`);
      connectedUsers.delete(socket.user.userId);
    } else {
      console.log("User disconnected with no valid user data");
    }
  });
});

app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use("/api/user", userRouter);
app.use("/api/post", postRouter);
app.use("/api/notifications", notificationRouter);
app.use("/api/chats", chatRouter);

app.use((err, req, res, next) => {
  console.error("Server Error:", {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

app.get("/", (req, res) => {
  res.send("🚀 DevConnect API is running...");
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🔥 Server running at http://localhost:${PORT}`);
});
