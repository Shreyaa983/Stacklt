// Notification service for handling desktop notifications and @mentions
class NotificationService {
  constructor() {
    this.isElectron = window.electronAPI !== undefined;
    this.notificationPermission = false;
    this.init();
  }

  async init() {
    if (this.isElectron) {
      this.notificationPermission = await window.electronAPI.checkNotificationPermission();
    } else {
      // For web browser notifications
      if ('Notification' in window) {
        if (Notification.permission === 'granted') {
          this.notificationPermission = true;
        } else if (Notification.permission !== 'denied') {
          const permission = await Notification.requestPermission();
          this.notificationPermission = permission === 'granted';
        }
      }
    }
  }

  // Show desktop notification
  async showNotification(title, body, options = {}) {
    console.log('showNotification called:', { title, body, permission: this.notificationPermission });
    
    if (!this.notificationPermission) {
      console.log('No notification permission, requesting...');
      const permission = await this.requestPermission();
      if (!permission) {
        console.log('Permission denied');
        return false;
      }
    }

    const defaultOptions = {
      title,
      body,
      icon: '/vite.svg',
      badge: '/vite.svg',
      tag: 'stackit-notification',
      requireInteraction: false,
      silent: false,
      ...options
    };

    try {
      if (this.isElectron) {
        console.log('Using Electron notification API');
        return await window.electronAPI.showNotification(defaultOptions);
      } else {
        console.log('Using browser notification API');
        const notification = new Notification(title, defaultOptions);
        
        notification.onclick = () => {
          window.focus();
          notification.close();
        };
        
        return true;
      }
    } catch (error) {
      console.error('Failed to show notification:', error);
      return false;
    }
  }

  // Extract @mentions from text
  extractMentions(text) {
    const mentionRegex = /@(\w+)/g;
    const mentions = [];
    let match;

    while ((match = mentionRegex.exec(text)) !== null) {
      mentions.push({
        username: match[1],
        index: match.index,
        fullMatch: match[0]
      });
    }

    return mentions;
  }

  // Check if text contains @mentions
  hasMentions(text) {
    return /@\w+/.test(text);
  }

  // Get unique usernames from mentions
  getUniqueMentions(text) {
    const mentions = this.extractMentions(text);
    return [...new Set(mentions.map(m => m.username))];
  }

  // Show mention notification
  async showMentionNotification(mentionedBy, questionTitle, questionId) {
    const title = `You were mentioned by @${mentionedBy}`;
    const body = `You were mentioned in: "${questionTitle}"`;
    
    console.log('Showing mention notification:', { mentionedBy, questionTitle, questionId });
    
    // Dispatch event for notification bell
    window.dispatchEvent(new CustomEvent('new-mention-notification', {
      detail: {
        type: 'mention',
        title,
        message: body,
        mentionedBy,
        questionTitle,
        questionId
      }
    }));
    
    return this.showNotification(title, body, {
      data: { questionId },
      requireInteraction: true
    });
  }

  // Show answer notification
  async showAnswerNotification(answeredBy, questionTitle, questionId) {
    const title = `New answer from @${answeredBy}`;
    const body = `Someone answered your question: "${questionTitle}"`;
    
    return this.showNotification(title, body, {
      data: { questionId },
      requireInteraction: true
    });
  }

  // Show upvote notification
  async showUpvoteNotification(votedBy, questionTitle, questionId) {
    const title = `Upvote from @${votedBy}`;
    const body = `Your question received an upvote: "${questionTitle}"`;
    
    return this.showNotification(title, body, {
      data: { questionId }
    });
  }

  // Request notification permission
  async requestPermission() {
    if (this.isElectron) {
      this.notificationPermission = await window.electronAPI.checkNotificationPermission();
    } else {
      if ('Notification' in window && Notification.permission === 'default') {
        const permission = await Notification.requestPermission();
        this.notificationPermission = permission === 'granted';
      }
    }
    return this.notificationPermission;
  }

  // Check if notifications are supported
  isSupported() {
    return this.isElectron || ('Notification' in window);
  }

  // Get current permission status
  getPermissionStatus() {
    if (this.isElectron) {
      return this.notificationPermission ? 'granted' : 'denied';
    }
    return Notification.permission;
  }
}

// Create singleton instance
const notificationService = new NotificationService();

export default notificationService; 