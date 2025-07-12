import React from "react";
import { BellIcon, UserCircleIcon, ArrowUpIcon, ArrowDownIcon, EyeIcon, ClockIcon, TagIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { Editor } from '@tinymce/tinymce-react';

const mockQuestion = {
  title: "How to implement state management in React with TypeScript?",
  description: "I'm building a medium-sized React application and I'm wondering what the best approach is for state management. Should I use Redux, Zustand, or stick with React's built-in state...",
  tags: ["React", "TypeScript", "State Management"],
  answersCount: 4,
  views: 156,
  author: "DevMaster99",
  time: "2 hours ago",
  answers: [
    {
      id: 1,
      votes: 5,
      author: "StackUser1",
      text: "You can use Redux for large apps, but Zustand is simpler for small/medium ones. Context API is also good for basic needs.",
    },
    {
      id: 2,
      votes: 2,
      author: "StackUser2",
      text: "If you want type safety, TypeScript works well with both Redux Toolkit and Zustand. Try to keep state local if possible.",
    },
  ],
};

function QuestionView() {
  const navigate = useNavigate();
  const navigateToHome = () => navigate('/');
  const editorRef = React.useRef(null);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Header */}
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
      {/* Breadcrumb */}
      <div className="px-8 pt-6 text-blue-600 text-sm">
        <span onClick={navigateToHome} className="cursor-pointer hover:underline">Question</span> &gt; <span className="text-blue-400">{mockQuestion.title.slice(0, 25)}...</span>
      </div>
      {/* Main Content */}
      <div className="px-8 py-4 max-w-4xl mx-auto">
        {/* Question Card */}
        <div className="bg-white text-gray-900 rounded-lg shadow p-6 mb-6 flex flex-row">
          {/* Upvote/Downvote */}
          <div className="flex flex-col items-center mr-6">
            <ArrowUpIcon className="h-6 w-6 text-gray-400 cursor-pointer" />
            <span className="font-semibold text-lg">23</span>
            <ArrowDownIcon className="h-6 w-6 text-gray-400 cursor-pointer" />
          </div>
          {/* Details */}
          <div className="flex-1">
            <div className="flex items-center mb-2">
              <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-sm font-medium mr-2">{mockQuestion.answersCount} answers</span>
              <span className="flex items-center text-gray-400 text-sm mr-2"><EyeIcon className="h-4 w-4 mr-1" />{mockQuestion.views}</span>
            </div>
            <h2 className="text-xl font-semibold mb-1">{mockQuestion.title}</h2>
            <p className="text-gray-600 mb-2">{mockQuestion.description}</p>
            <div className="flex gap-2 mb-2">
              {mockQuestion.tags.map((tag) => (
                <span key={tag} className="flex items-center bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs"><TagIcon className="h-4 w-4 mr-1" />{tag}</span>
              ))}
            </div>
            <div className="flex items-center text-gray-400 text-sm">
              <span>asked by <span className="text-blue-600 font-medium">{mockQuestion.author}</span></span>
              <span className="flex items-center ml-4"><ClockIcon className="h-4 w-4 mr-1" />{mockQuestion.time}</span>
            </div>
          </div>
        </div>
        {/* Answers Section */}
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Answers</h3>
          {mockQuestion.answers.map((ans) => (
            <div key={ans.id} className="flex items-start bg-white text-gray-900 rounded-lg shadow p-4 mb-3">
              <div className="flex flex-col items-center mr-4">
                <button className="text-gray-400 hover:text-blue-600"><span className="text-2xl leading-none">▲</span></button>
                <span className="font-semibold text-lg">{ans.votes}</span>
                <button className="text-gray-400 hover:text-blue-600"><span className="text-2xl leading-none">▼</span></button>
              </div>
              <div>
                <div className="font-semibold mb-1">{ans.author}</div>
                <div className="text-gray-600 text-sm mt-1">{ans.text}</div>
              </div>
            </div>
          ))}
        </div>
        {/* Submit Answer */}
        <div className="mt-8">
          <div className="text-gray-900 mb-2 font-semibold">Submit Your Answer</div>
          <div className=" rounded-lg p-4 mb-2 ">
            <Editor
              apiKey="pjby16vp5701zsbi2zm097i8oybztv0oyyoo3qpizng4nhyr"
              onInit={(evt, editor) => editorRef.current = editor}
              initialValue=""
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
          <button className="bg-blue-600 text-white px-8 py-2 rounded-lg font-semibold hover:bg-blue-700 border border-blue-700 float-right">Submit</button>
        </div>
      </div>
    </div>
  );
}

export default QuestionView;