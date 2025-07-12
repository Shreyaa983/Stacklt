import React, { useState, useEffect, useRef } from 'react';
import notificationService from '../services/notificationService';

const MentionInput = ({ 
  value, 
  onChange, 
  placeholder = "Type your message...", 
  className = "",
  onMentionsChange = () => {},
  users = [] // Array of available users for autocomplete
}) => {
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [autocompleteUsers, setAutocompleteUsers] = useState([]);
  const [cursorPosition, setCursorPosition] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const textareaRef = useRef(null);
  const autocompleteRef = useRef(null);

  // Extract current @mention being typed
  const getCurrentMention = (text, position) => {
    const beforeCursor = text.substring(0, position);
    const mentionMatch = beforeCursor.match(/@(\w*)$/);
    return mentionMatch ? mentionMatch[1] : null;
  };

  // Filter users based on current mention
  const filterUsers = (mention) => {
    if (!mention) return [];
    return users.filter(user => 
      user.username.toLowerCase().includes(mention.toLowerCase())
    );
  };

  // Insert mention at cursor position
  const insertMention = (username) => {
    const beforeCursor = value.substring(0, cursorPosition);
    const afterCursor = value.substring(cursorPosition);
    
    // Find the start of the current @mention
    const mentionStart = beforeCursor.lastIndexOf('@');
    const newValue = beforeCursor.substring(0, mentionStart) + `@${username} ` + afterCursor;
    
    onChange(newValue);
    setShowAutocomplete(false);
    setSelectedIndex(0);
    
    // Focus back to textarea
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 0);
  };

  // Handle textarea changes
  const handleChange = (e) => {
    const newValue = e.target.value;
    const newPosition = e.target.selectionStart;
    
    onChange(newValue);
    setCursorPosition(newPosition);
    
    // Check for @mentions
    const currentMention = getCurrentMention(newValue, newPosition);
    
    if (currentMention !== null) {
      const filteredUsers = filterUsers(currentMention);
      setAutocompleteUsers(filteredUsers);
      setShowAutocomplete(filteredUsers.length > 0);
      setSelectedIndex(0);
    } else {
      setShowAutocomplete(false);
    }
    
    // Notify parent about mentions
    const mentions = notificationService.getUniqueMentions(newValue);
    onMentionsChange(mentions);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!showAutocomplete) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < autocompleteUsers.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : autocompleteUsers.length - 1
        );
        break;
      case 'Enter':
        if (showAutocomplete && autocompleteUsers.length > 0) {
          e.preventDefault();
          insertMention(autocompleteUsers[selectedIndex].username);
        }
        break;
      case 'Escape':
        setShowAutocomplete(false);
        break;
      case 'Tab':
        if (showAutocomplete && autocompleteUsers.length > 0) {
          e.preventDefault();
          insertMention(autocompleteUsers[selectedIndex].username);
        }
        break;
    }
  };

  // Handle click outside to close autocomplete
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (autocompleteRef.current && !autocompleteRef.current.contains(event.target)) {
        setShowAutocomplete(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Highlight mentions in text
  const highlightMentions = (text) => {
    if (!text) return text;
    
    return text.replace(/@(\w+)/g, (match, username) => {
      const user = users.find(u => u.username === username);
      return user 
        ? `<span class="mention-highlight bg-blue-100 text-blue-800 px-1 rounded">${match}</span>`
        : match;
    });
  };

  return (
    <div className={`relative ${className}`}>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        rows={4}
      />
      
      {/* Autocomplete dropdown */}
      {showAutocomplete && autocompleteUsers.length > 0 && (
        <div 
          ref={autocompleteRef}
          className="absolute z-50 w-64 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto"
          style={{ top: '100%', left: 0 }}
        >
          {autocompleteUsers.map((user, index) => (
            <div
              key={user.id || user.username}
              className={`px-3 py-2 cursor-pointer hover:bg-gray-100 ${
                index === selectedIndex ? 'bg-blue-100' : ''
              }`}
              onClick={() => insertMention(user.username)}
            >
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-600">
                    {user.username.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <div className="font-medium text-gray-900">@{user.username}</div>
                  {user.email && (
                    <div className="text-sm text-gray-500">{user.email}</div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Mention preview (optional) */}
      {value && (
        <div className="mt-2 text-sm text-gray-600">
          <div className="font-medium mb-1">Preview:</div>
          <div 
            className="p-2 bg-gray-50 rounded border"
            dangerouslySetInnerHTML={{ __html: highlightMentions(value) }}
          />
        </div>
      )}
    </div>
  );
};

export default MentionInput; 