import React, { useState, useEffect } from 'react';
import { BellIcon } from '@heroicons/react/24/outline';
import { BellIcon as BellSolidIcon } from '@heroicons/react/24/solid';
import notificationService from '../services/notificationService';

const NotificationBell = ({ className = "" }) => {
  const [notificationCount, setNotificationCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [permissionStatus, setPermissionStatus] = useState('default');

  useEffect(() => {
    // Check notification permission
    const checkPermission = async () => {
      const status = notificationService.getPermissionStatus();
      setPermissionStatus(status);
    };
    checkPermission();

    // Mock notifications for demo (replace with actual API calls)
    const mockNotifications = [
      {
        id: 1,
        type: 'mention',
        title: 'You were mentioned by @john_doe',
        message: 'You were mentioned in: "How to implement authentication?"',
        timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
        read: false
      },
      {
        id: 2,
        type: 'answer',
        title: 'New answer from @jane_smith',
        message: 'Someone answered your question: "React state management"',
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        read: false
      },
      {
        id: 3,
        type: 'upvote',
        title: 'Upvote from @bob_wilson',
        message: 'Your question received an upvote: "CSS Grid layout"',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        read: true
      }
    ];

    setNotifications(mockNotifications);
    setNotificationCount(mockNotifications.filter(n => !n.read).length);

    // Listen for new mention notifications
    const handleNewMention = (event) => {
      if (event.detail && event.detail.type === 'mention') {
        const newNotification = {
          id: Date.now(),
          type: 'mention',
          title: event.detail.title,
          message: event.detail.message,
          timestamp: new Date(),
          read: false
        };
        
        console.log('New notification received:', newNotification);
        
        setNotifications(prev => [newNotification, ...prev]);
        setNotificationCount(prev => prev + 1);
        
        // Add a brief visual pulse effect
        const bell = document.querySelector('.notification-bell');
        if (bell) {
          bell.classList.add('animate-pulse');
          setTimeout(() => {
            bell.classList.remove('animate-pulse');
          }, 1000);
        }
      }
    };

    // Add event listener for new mentions
    window.addEventListener('new-mention-notification', handleNewMention);

    return () => {
      window.removeEventListener('new-mention-notification', handleNewMention);
    };
  }, []);

  const handleBellClick = () => {
    setShowDropdown(!showDropdown);
  };

  const handleNotificationClick = (notification) => {
    // Mark as read
    const updatedNotifications = notifications.map(n => 
      n.id === notification.id ? { ...n, read: true } : n
    );
    setNotifications(updatedNotifications);
    setNotificationCount(updatedNotifications.filter(n => !n.read).length);
    
    // Navigate to related content (implement based on your routing)
    console.log('Navigate to:', notification);
    
    setShowDropdown(false);
  };

  const markAllAsRead = () => {
    const updatedNotifications = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updatedNotifications);
    setNotificationCount(0);
  };

  const requestPermission = async () => {
    const permission = await notificationService.requestPermission();
    setPermissionStatus(permission ? 'granted' : 'denied');
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'mention':
        return '👤';
      case 'answer':
        return '💬';
      case 'upvote':
        return '👍';
      case 'downvote':
        return '👎';
      default:
        return '🔔';
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Notification Bell */}
      <div className="relative">
        <button
          onClick={handleBellClick}
          className="relative p-2 text-gray-600 hover:text-blue-500 transition-colors notification-bell"
        >
          {notificationCount > 0 ? (
            <BellSolidIcon className="h-6 w-6" />
          ) : (
            <BellIcon className="h-6 w-6" />
          )}
          
          {/* Notification Badge */}
          {notificationCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {notificationCount > 99 ? '99+' : notificationCount}
            </span>
          )}
        </button>
      </div>

      {/* Notification Dropdown */}
      {showDropdown && (
        <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
              {notificationCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Mark all as read
                </button>
              )}
            </div>
          </div>

          {/* Permission Request */}
          {permissionStatus !== 'granted' && (
            <div className="p-3 bg-yellow-50 border-b border-yellow-200">
              <div className="flex items-center justify-between">
                <span className="text-sm text-yellow-800">
                  Enable desktop notifications
                </span>
                <button
                  onClick={requestPermission}
                  className="text-sm bg-yellow-600 text-white px-2 py-1 rounded hover:bg-yellow-700"
                >
                  Enable
                </button>
              </div>
            </div>
          )}

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No notifications
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                    !notification.read ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <span className="text-lg">{getNotificationIcon(notification.type)}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className={`text-sm font-medium ${
                          !notification.read ? 'text-gray-900' : 'text-gray-600'
                        }`}>
                          {notification.title}
                        </p>
                        <span className="text-xs text-gray-400">
                          {formatTimestamp(notification.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1 truncate">
                        {notification.message}
                      </p>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* View All Link */}
          <div className="p-3 border-t border-gray-200">
            <button className="w-full text-center text-sm text-blue-600 hover:text-blue-800">
              View all notifications
            </button>
          </div>
        </div>
      )}

      {/* Click outside to close */}
      {showDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowDropdown(false)}
        />
      )}
    </div>
  );
};

export default NotificationBell; 