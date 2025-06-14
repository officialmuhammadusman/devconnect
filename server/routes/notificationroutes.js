
import express from 'express';
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from '../controllers/notificationController.js';
import verifyToken from '../middlewares/verifytoken.js';

const router = express.Router();

// Get all notifications for the authenticated user
router.get('/', verifyToken, getNotifications);

// Mark a single notification as read (expects :id param)
router.patch('/mark-read/:id', verifyToken, markNotificationRead);

// Mark all notifications as read (no :id param)
router.patch('/mark-all-read', verifyToken, markAllNotificationsRead);

export default router;
