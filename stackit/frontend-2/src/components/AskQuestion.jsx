import React, { useState, useRef, useEffect } from "react";
import { Editor } from '@tinymce/tinymce-react';
import { useNavigate } from "react-router-dom";
import { UserCircleIcon, BellIcon } from "@heroicons/react/24/outline";
import notificationService from "../services/notificationService";
import NotificationBell from "./NotificationBell";
// import TagInput from "@pathofdev/react-tag-input";
// import "@pathofdev/react-tag-input/build/index.css";

function AskQuestion() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState([]);
  const [mentions, setMentions] = useState([]);
  const [notificationPermission, setNotificationPermission] = useState(false);
  const [userSuggestions, setUserSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestionQuery, setSuggestionQuery] = useState("");
  const [caretPos, setCaretPos] = useState(0);
  const editorRef = useRef(null);
  const titleInputRef = useRef(null);
  const navigate = useNavigate();
  const navigateToHome = () => navigate('/');

  // Mock users for mention autocomplete (replace with actual API call)
  const mockUsers = [
    { id: 1, username: 'john_doe', email: 'john@example.com' },
    { id: 2, username: 'jane_smith', email: 'jane@example.com' },
    { id: 3, username: 'bob_wilson', email: 'bob@example.com' },
    { id: 4, username: 'alice_brown', email: 'alice@example.com' },
  ];

  useEffect(() => {
    // Check notification permission on component mount
    const checkPermission = async () => {
      const permission = await notificationService.requestPermission();
      setNotificationPermission(permission);
    };
    checkPermission();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userId = localStorage.getItem('userId');
    
    if (!userId) {
      alert("Please login to ask a question");
      return;
    }

    if (!title.trim() || !description.trim()) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      // First, get the current user data
      const userResponse = await fetch(`http://localhost:5000/api/auth/user/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!userResponse.ok) {
        alert("Failed to get user data. Please login again.");
        return;
      }

      const userData = await userResponse.json();
      const currentUser = userData.user;

      // Now submit the question with the current user data
      const response = await fetch("http://localhost:5000/api/questions/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title,
          description: description,
          tags: tags,
          mentions: mentions,
          userId: currentUser.id,
          username: currentUser.username
        }),
      });

      const data = await response.json();
      console.log("Response from server:", data);
      
      if (response.ok) {
        alert("Question submitted successfully!");
        setTitle("");
        setDescription("");
        setTags([]);
        setMentions([]);
        navigate('/'); // Navigate back to home page
      } else {
        alert("Failed to submit question: " + (data.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Error submitting question:", error);
      alert("Network error. Please try again.");
    }
  };

  // Fetch user suggestions from backend
  const fetchUserSuggestions = async (query) => {
    if (!query) {
      setUserSuggestions([]);
      return;
    }
    try {
      const res = await fetch(`http://localhost:5000/api/auth/search-users?query=${encodeURIComponent(query)}`);
      if (res.ok) {
        const data = await res.json();
        setUserSuggestions(data.users || []);
      } else {
        setUserSuggestions([]);
      }
    } catch (err) {
      setUserSuggestions([]);
    }
  };

  // Handle title input change and mention detection
  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    setCaretPos(e.target.selectionStart);

    // Extract mentions from the title
    const newMentions = notificationService.getUniqueMentions(newTitle);
    setMentions(newMentions);

    // Detect if user is typing a mention
    const cursor = e.target.selectionStart;
    const textUpToCursor = newTitle.slice(0, cursor);
    const mentionMatch = textUpToCursor.match(/@([a-zA-Z0-9_]*)$/);
    if (mentionMatch) {
      setSuggestionQuery(mentionMatch[1]);
      fetchUserSuggestions(mentionMatch[1]);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
      setUserSuggestions([]);
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (username) => {
    if (!titleInputRef.current) return;
    const input = titleInputRef.current;
    const value = title;
    const cursor = caretPos;
    // Find the last @... before the cursor
    const textUpToCursor = value.slice(0, cursor);
    const mentionMatch = textUpToCursor.match(/@([a-zA-Z0-9_]*)$/);
    if (mentionMatch) {
      const start = textUpToCursor.lastIndexOf('@');
      const before = value.slice(0, start);
      const after = value.slice(cursor);
      const newValue = before + '@' + username + ' ' + after;
      setTitle(newValue);
      setShowSuggestions(false);
      setUserSuggestions([]);
      setSuggestionQuery("");
      // Move caret after inserted mention
      setTimeout(() => {
        input.focus();
        input.setSelectionRange(before.length + username.length + 2, before.length + username.length + 2);
      }, 0);
      // Update mentions
      const newMentions = notificationService.getUniqueMentions(newValue);
      setMentions(newMentions);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between px-8 py-4 border-b border-gray-200 bg-white">
        <div className="text-3xl font-bold text-blue-700">StackIt</div>
        <div className="flex items-center gap-10">
          <span className="text-xl text-gray-700 cursor-pointer hover:text-gray-800" onClick={navigateToHome}>Home</span>
          <div className="flex items-center gap-6">
            <NotificationBell />
            <UserCircleIcon className="h-6 w-6 text-gray-600 hover:text-blue-500 cursor-pointer" />
          </div>
        </div>
      </div>
    
    <div className="min-h-screen bg-gray-50 flex justify-center py-10">
      <div className="w-full max-w-2xl bg-white p-8 shadow rounded-lg">
        <h1 className="text-3xl font-bold mb-6 text-blue-700">Ask a Question</h1>
        
        {/* @Mention Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center mb-2">
            <span className="text-blue-600 font-medium">📢 Mention Users:</span>
          </div>
          <p className="text-sm text-blue-800 mb-2">
            Use @username to mention other users in your question. They'll receive notifications!
          </p>
          <div className="flex flex-wrap gap-2">
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">@john_doe</span>
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">@jane_smith</span>
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">@bob_wilson</span>
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">@alice_brown</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title Input */}
          <div style={{ position: 'relative' }}>
            <label className="block font-medium mb-1 text-gray-700">Title</label>
            <input
              type="text"
              value={title}
              ref={titleInputRef}
              onChange={handleTitleChange}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
              onFocus={handleTitleChange}
              className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your question title (use @username to mention users)"
              required
            />
            {/* Mention Suggestions Dropdown */}
            {showSuggestions && userSuggestions.length > 0 && (
              <ul className="absolute z-10 bg-white border border-gray-300 rounded shadow mt-1 w-full max-h-40 overflow-y-auto">
                {userSuggestions.map((user, idx) => (
                  <li
                    key={user.username}
                    className="px-4 py-2 cursor-pointer hover:bg-blue-100 text-sm"
                    onMouseDown={() => handleSuggestionClick(user.username)}
                  >
                    @{user.username} <span className="text-gray-400">({user.email})</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Description (Rich Text Editor) */}
          <div>
            <label className="block font-medium mb-1 text-gray-700">Description</label>
            <Editor
              apiKey="pjby16vp5701zsbi2zm097i8oybztv0oyyoo3qpizng4nhyr"
              onInit={(evt, editor) => editorRef.current = editor}
              value={description}
              onEditorChange={(content) => {
                setDescription(content);
              }}
              init={{
                height: 200,
                menubar: false,
                branding: false,
                statusbar: false,
                plugins: [
                  'lists', 'advlist', 'autolink', 'emoticons', 'link', 'image'
                ],
                toolbar:
                  'bold italic strikethrough | bullist numlist | alignleft aligncenter alignright | emoticons link image',
                content_style: 'body { font-family:Inter,sans-serif; font-size:14px }',
                images_upload_handler: function (blobInfo, success, failure) {
                  success("data:" + blobInfo.blob().type + ";base64," + blobInfo.base64());
                },
                placeholder: 'Describe your question in detail...',
              }}
            />
            <p className="text-sm text-gray-500 mt-1">
              💡 Tip: Add @mentions in the title field to notify users (e.g., @john_doe, @jane_smith)
            </p>
          </div>

          {/* Tags */}
          <div>
            <label className="block font-medium mb-1 text-gray-700">Tags</label>
            {/* <TagInput
              tags={tags}
              onChange={(newTags) => setTags(newTags)}
              placeholder="e.g. react, css, api"
            /> */}
            <input
              type="text"
              value={tags.join(", ")}
              onChange={e => setTags(e.target.value.split(",").map(tag => tag.trim()).filter(Boolean))}
              className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="e.g. react, css, api"
            />
          </div>

          {/* Notification Status */}
          {!notificationPermission && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="flex items-center">
                <BellIcon className="h-5 w-5 text-yellow-600 mr-2" />
                <span className="text-sm text-yellow-800">
                  Enable notifications to get notified when someone mentions you or answers your questions.
                </span>
                <button
                  type="button"
                  onClick={async () => {
                    const permission = await notificationService.requestPermission();
                    setNotificationPermission(permission);
                  }}
                  className="ml-auto bg-yellow-600 text-white px-3 py-1 rounded text-sm hover:bg-yellow-700"
                >
                  Enable
                </button>
              </div>
            </div>
          )}

          {/* Mentions Preview */}
          {mentions.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-center mb-2">
                <span className="text-sm font-medium text-blue-800">Mentioned users:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {mentions.map((username, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm"
                  >
                    @{username}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-8 py-2 rounded-lg font-semibold hover:bg-blue-700 border border-blue-700 transition float-right"
            >
              Submit Question
            </button>
          </div>
        </form>
      </div>
    </div>
    </div>
  );
}

export default AskQuestion;