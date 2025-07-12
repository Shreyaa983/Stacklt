const Notification = require("../models/Notification");

// Get notifications for a user
const getUserNotifications = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ msg: "User ID is required" });
    }

    const notifications = await Notification.find({ userId })
      .sort({ createdAt: -1 })
      .limit(20); // Limit to 20 most recent notifications

    res.status(200).json({
      msg: "Notifications fetched successfully",
      data: notifications,
    });
  } catch (err) {
    console.error("Error fetching notifications:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// Mark notification as read
const markNotificationAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;

    if (!notificationId) {
      return res.status(400).json({ msg: "Notification ID is required" });
    }

    const notification = await Notification.findByIdAndUpdate(
      notificationId,
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ msg: "Notification not found" });
    }

    res.status(200).json({
      msg: "Notification marked as read",
      data: notification,
    });
  } catch (err) {
    console.error("Error marking notification as read:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// Mark all notifications as read for a user
const markAllNotificationsAsRead = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ msg: "User ID is required" });
    }

    await Notification.updateMany(
      { userId, isRead: false },
      { isRead: true }
    );

    res.status(200).json({
      msg: "All notifications marked as read",
    });
  } catch (err) {
    console.error("Error marking all notifications as read:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// Get unread notification count
const getUnreadNotificationCount = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ msg: "User ID is required" });
    }

    const count = await Notification.countDocuments({ userId, isRead: false });

    res.status(200).json({
      msg: "Unread notification count fetched successfully",
      data: { count },
    });
  } catch (err) {
    console.error("Error fetching unread notification count:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

module.exports = {
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  getUnreadNotificationCount,
};
