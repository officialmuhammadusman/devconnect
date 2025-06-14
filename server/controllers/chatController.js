import Chat from "../models/Chat.js";
import Message from "../models/Message.js";
import User from "../models/usermodel.js";

export const getChats = async (req, res) => {
  try {
    const userId = req.user.userId;

    const chats = await Chat.find({ participants: userId })
      .populate("participants", "fullName profileImage")
      .populate("lastMessage")
      .sort({ updatedAt: -1 })
      .select("-__v");

    return res.status(200).json({
      success: true,
      message: "Chats fetched successfully",
      data: chats,
    });
  } catch (error) {
    console.error("Get Chats Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getChatMessages = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const chat = await Chat.findOne({ _id: id, participants: userId });
    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found or unauthorized",
      });
    }

    const messages = await Message.find({ chatId: id })
      .populate("senderId", "fullName profileImage")
      .sort({ createdAt: 1 })
      .select("-__v");

    return res.status(200).json({
      success: true,
      message: "Messages fetched successfully",
      data: messages,
    });
  } catch (error) {
    console.error("Get Chat Messages Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const initiateChat = async (req, res) => {
  try {
    console.log("Initiate Chat Controller Called");
    console.log("req.params:", req.params);
    const { targetUserId } = req.params; // Fixed parameter access
    const userId = req.user.userId;

    console.log("targetUserId:", targetUserId);
    console.log("userId:", userId);

    if (targetUserId === userId) {
      return res.status(400).json({
        success: false,
        message: "Cannot initiate chat with yourself",
      });
    }

    const targetUser = await User.findById(targetUserId);
    console.log("targetUser:", targetUser);

    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: "Target user not found",
      });
    }

    let chat = await Chat.findOne({
      participants: { $all: [userId, targetUserId] },
    });
    console.log("Existing chat:", chat);

    if (!chat) {
      chat = new Chat({
        participants: [userId, targetUserId],
      });
      await chat.save();
      console.log("New chat created:", chat);
    }

    return res.status(200).json({
      success: true,
      message: "Chat initiated successfully",
      data: chat,
    });
  } catch (error) {
    console.error("Initiate Chat Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const sendChatMessage = async (req, res) => {
  try {
    const { id: chatId } = req.params;
    const { content } = req.body;
    const senderId = req.user.userId;

    const chat = await Chat.findOne({ _id: chatId, participants: senderId });
    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found or unauthorized",
      });
    }

    const message = new Message({
      chatId,
      senderId,
      content,
    });
    await message.save();

    await Chat.findByIdAndUpdate(chatId, { lastMessage: message._id });

    // Emit via Socket.IO
    req.io.to(chatId).emit("message", message);

    return res.status(200).json({
      success: true,
      message: "Message sent successfully",
      data: message,
    });
  } catch (error) {
    console.error("Send Chat Message Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};