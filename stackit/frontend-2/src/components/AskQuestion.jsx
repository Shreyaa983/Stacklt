import React, { useState, useRef } from "react";
import { Editor } from '@tinymce/tinymce-react';
import { useNavigate } from "react-router-dom";
import { BellIcon, UserCircleIcon } from "@heroicons/react/24/outline";
// import TagInput from "@pathofdev/react-tag-input";
// import "@pathofdev/react-tag-input/build/index.css";

function AskQuestion() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState([]);
  const editorRef = useRef(null);
  const navigate = useNavigate();
    const navigateToHome = () => navigate('/');

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Title:", title);
    console.log("Description:", description);
    console.log("Tags:", tags);

    alert("Submitted (Rich Editor)");

    setTitle("");
    setDescription("");
    setTags([]);
  };

  return (
    <div>
      <div className="flex items-center justify-between px-8 py-4 border-b border-gray-200 bg-white">
        <div className="text-3xl font-bold text-blue-700">StackIt</div>
        <div className="flex items-center gap-10">
          <span className="text-xl text-gray-700 cursor-pointer hover:text-gray-800" onClick={navigateToHome}>Home</span>
          <div className="flex items-center gap-6">
            <BellIcon className="h-6 w-6 text-gray-600 hover:text-blue-500 cursor-pointer" />
            <UserCircleIcon className="h-6 w-6 text-gray-600 hover:text-blue-500 cursor-pointer" />
          </div>
        </div>
      </div>
    
    <div className="min-h-screen bg-gray-50 flex justify-center py-10">
      <div className="w-full max-w-2xl bg-white p-8 shadow rounded-lg">
        <h1 className="text-3xl font-bold mb-6 text-blue-700">Ask a Question</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title Input */}
          <div>
            <label className="block font-medium mb-1 text-gray-700">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your question title"
              required
            />
          </div>

          {/* Description (Rich Text Editor) */}
          <div>
            <label className="block font-medium mb-1 text-gray-700">Description</label>
            <Editor
              apiKey="pjby16vp5701zsbi2zm097i8oybztv0oyyoo3qpizng4nhyr"
              onInit={(evt, editor) => editorRef.current = editor}
              value={description}
              onEditorChange={setDescription}
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
              }}
            />
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