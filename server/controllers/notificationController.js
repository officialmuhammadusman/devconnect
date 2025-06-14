
import Notification from "../models/Notification.js";
import Post from "../models/postmodel.js";
import User from "../models/usermodel.js";
import mongoose from "mongoose";

export const getNotifications = async (req, res) => {
  try {
    const userId = req.user.userId;
    const notifications = await Notification.find({ userId })
      .populate("senderId", "fullName profileImage")
      .sort({ createdAt: -1 })
      .select("-__v");

    return res.status(200).json({
      success: true,
      message: "Notifications fetched successfully",
      data: notifications,
    });
  } catch (error) {
    console.error("Get Notifications Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const markNotificationRead = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid notification ID",
      });
    }
    const userId = req.user.userId;

    const notification = await Notification.findOneAndUpdate(
      { _id: id, userId },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found or unauthorized",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Notification marked as read",
      data: notification,
    });
  } catch (error) {
    console.error("Mark Notification Read Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const markAllNotificationsRead = async (req, res) => {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: No user context",
      });
    }

    const userId = new mongoose.Types.ObjectId(req.user.userId);
    console.log(`Marking all notifications as read for user: ${userId}`);

    const result = await Notification.updateMany(
      { userId, isRead: false },
      { isRead: true }
    );

    console.log(`Updated ${result.modifiedCount} notifications`);

    if (!req.io) {
      console.warn("Socket.IO not available in request context");
    } else {
      req.io.to(userId.toString()).emit("notifications_read");
    }

    return res.status(200).json({
      success: true,
      message: "All notifications marked as read",
    });
  } catch (error) {
    console.error("Mark All Notifications Read Error:", {
      message: error.message,
      stack: error.stack,
    });
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
