import express from "express";
import verifyToken from "../middlewares/verifytoken.js";
import {
  getChats,
  getChatMessages,
  initiateChat,
  sendChatMessage,
} from "../controllers/chatController.js";

const chatRouter = express.Router();

chatRouter.use((req, res, next) => {
  console.log(`Chat route hit: ${req.method} ${req.path}`);
  next();
});

chatRouter.get("/", verifyToken, getChats);
chatRouter.get("/:id/messages", verifyToken, getChatMessages);
chatRouter.post("/initiate/:targetUserId", verifyToken, initiateChat);
chatRouter.post("/:id/messages", verifyToken, sendChatMessage);

export default chatRouter;