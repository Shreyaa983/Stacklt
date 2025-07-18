const express = require("express");
const router = express.Router();
const {
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  getUnreadNotificationCount,
} = require("../controllers/notificationController");

// Get notifications for a user
router.get("/user/:userId", getUserNotifications);

// Get unread notification count for a user
router.get("/unread/:userId", getUnreadNotificationCount);

// Mark a specific notification as read
router.put("/read/:notificationId", markNotificationAsRead);

// Mark all notifications as read for a user
router.put("/read-all/:userId", markAllNotificationsAsRead);

module.exports = router; 