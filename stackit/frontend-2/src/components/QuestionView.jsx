import React, { useState, useEffect, useRef } from "react";
import { BellIcon, UserCircleIcon, ArrowUpIcon, ArrowDownIcon, EyeIcon, ClockIcon, TagIcon } from "@heroicons/react/24/outline";
import { useNavigate, useParams } from "react-router-dom";
import { Editor } from '@tinymce/tinymce-react';

function QuestionView() {
  const navigate = useNavigate();
  const { questionId } = useParams();
  const navigateToHome = () => navigate('/');
  const editorRef = useRef(null);
  
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [answerContent, setAnswerContent] = useState("");
  const [submittingAnswer, setSubmittingAnswer] = useState(false);

  // Fetch question and answers when component mounts
  useEffect(() => {
    const fetchQuestionAndAnswers = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5000/api/questions/${questionId}`);
        
        if (response.ok) {
          const data = await response.json();
          setQuestion(data.data.question);
          setAnswers(data.data.answers);
        } else {
          setError("Question not found");
        }
      } catch (error) {
        console.error("Error fetching question:", error);
        setError("Failed to load question");
      } finally {
        setLoading(false);
      }
    };

    if (questionId) {
      fetchQuestionAndAnswers();
    }
  }, [questionId]);

  // Handle question upvote
  const handleQuestionUpvote = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/questions/upvote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          questionId: questionId
        }),
      });

      if (response.ok) {
        // Refresh the question data to get updated upvote count
        const questionResponse = await fetch(`http://localhost:5000/api/questions/${questionId}`);
        if (questionResponse.ok) {
          const data = await questionResponse.json();
          setQuestion(data.data.question);
        }
      } else {
        const errorData = await response.json();
        alert("Failed to upvote question: " + (errorData.msg || "Unknown error"));
      }
    } catch (error) {
      console.error("Error upvoting question:", error);
      alert("Network error. Please try again.");
    }
  };

  // Handle answer upvote
  const handleAnswerUpvote = async (answerId) => {
    try {
      const response = await fetch("http://localhost:5000/api/answers/upvote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          answerId: answerId
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Update the specific answer in the answers list
        setAnswers(answers.map(answer => 
          answer._id === answerId 
            ? { ...answer, upvotes: data.data.upvotes }
            : answer
        ));
      } else {
        const errorData = await response.json();
        alert("Failed to upvote answer: " + (errorData.msg || "Unknown error"));
      }
    } catch (error) {
      console.error("Error upvoting answer:", error);
      alert("Network error. Please try again.");
    }
  };

  // Handle answer submission
  const handleSubmitAnswer = async () => {
    const content = editorRef.current?.getContent();
    if (!content || content.trim() === "") {
      alert("Please enter an answer");
      return;
    }

    const userId = localStorage.getItem('userId');
    const username = localStorage.getItem('username');
    
    if (!userId || !username) {
      alert("Please login to submit an answer");
      return;
    }

    try {
      setSubmittingAnswer(true);
      const response = await fetch("http://localhost:5000/api/answers/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: "Answer to: " + question.title,
          description: content,
          userId: userId,
          username: username,
          questionId: questionId
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Add the new answer to the list
        setAnswers([data.data, ...answers]);
        // Clear the editor
        editorRef.current?.setContent("");
        setAnswerContent("");
        alert("Answer submitted successfully!");
      } else {
        const errorData = await response.json();
        alert("Failed to submit answer: " + (errorData.msg || "Unknown error"));
      }
    } catch (error) {
      console.error("Error submitting answer:", error);
      alert("Network error. Please try again.");
    } finally {
      setSubmittingAnswer(false);
    }
  };



  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading question...</div>
      </div>
    );
  }

  if (error || !question) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-red-600">{error || "Question not found"}</div>
      </div>
    );
  }

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
        <span onClick={navigateToHome} className="cursor-pointer hover:underline">Home</span> &gt; 
        <span className="text-blue-400 ml-1">{question.title.length > 25 ? question.title.slice(0, 25) + '...' : question.title}</span>
      </div>
      
      {/* Main Content */}
      <div className="px-8 py-4 max-w-4xl mx-auto">
        {/* Question Card */}
        <div className="bg-white text-gray-900 rounded-lg shadow p-6 mb-6 flex flex-row">
          {/* Upvote/Downvote */}
          <div className="flex flex-col items-center mr-6">
            <ArrowUpIcon 
              className="h-6 w-6 text-gray-400 cursor-pointer hover:text-blue-600" 
              onClick={handleQuestionUpvote}
            />
            <span className="font-semibold text-lg">{question.upvotes || 0}</span>
            <ArrowDownIcon className="h-6 w-6 text-gray-400 cursor-pointer hover:text-red-600" />
          </div>
          
          {/* Question Details */}
          <div className="flex-1">
            <div className="flex items-center mb-2">
              <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-sm font-medium mr-2">
                {answers.length} {answers.length === 1 ? 'answer' : 'answers'}
              </span>
              <span className="flex items-center text-gray-400 text-sm mr-2">
                <EyeIcon className="h-4 w-4 mr-1" />0 views
              </span>
            </div>
            
            <h2 className="text-2xl font-semibold mb-3">{question.title}</h2>
            
            <div className="text-gray-700 mb-4" 
                 dangerouslySetInnerHTML={{ __html: question.description }} />
            
            <div className="flex gap-2 mb-4">
              {question.tags && question.tags.map((tag, index) => (
                <span key={index} className="flex items-center bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
                  <TagIcon className="h-4 w-4 mr-1" />
                  {tag}
                </span>
              ))}
            </div>
            
            <div className="flex items-center text-gray-400 text-sm">
              <span>asked by <span className="text-blue-600 font-medium">{question.author?.username || 'Anonymous'}</span></span>
              <span className="flex items-center ml-4">
                <ClockIcon className="h-4 w-4 mr-1" />
                {question.createdAt ? new Date(question.createdAt).toLocaleDateString() : 'Recently'}
              </span>
            </div>
          </div>
        </div>

        {/* Answers Section */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            {answers.length === 0 ? 'No answers yet' : `${answers.length} ${answers.length === 1 ? 'Answer' : 'Answers'}`}
          </h3>
          
          {answers.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <p className="text-gray-500 mb-2">No answers yet. Be the first to answer this question!</p>
            </div>
          ) : (
            answers.map((answer) => (
              <div key={answer._id} className="bg-white text-gray-900 rounded-lg shadow p-6 mb-4 flex flex-row">
                <div className="flex flex-col items-center mr-6">
                  <ArrowUpIcon 
                    className="h-6 w-6 text-gray-400 cursor-pointer hover:text-blue-600" 
                    onClick={() => handleAnswerUpvote(answer._id)}
                  />
                  <span className="font-semibold text-lg">{answer.upvotes || 0}</span>
                  <ArrowDownIcon className="h-6 w-6 text-gray-400 cursor-pointer hover:text-red-600" />
                </div>
                
                <div className="flex-1">
                  <div className="text-gray-700 mb-3" 
                       dangerouslySetInnerHTML={{ __html: answer.description }} />
                  
                  <div className="flex items-center text-gray-400 text-sm">
                    <span>answered by <span className="text-blue-600 font-medium">{answer.author?.username || 'Anonymous'}</span></span>
                    <span className="flex items-center ml-4">
                      <ClockIcon className="h-4 w-4 mr-1" />
                      {answer.createdAt ? new Date(answer.createdAt).toLocaleDateString() : 'Recently'}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Submit Answer Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Your Answer</h3>
          
          <div className="mb-4">
            <Editor
              apiKey="pjby16vp5701zsbi2zm097i8oybztv0oyyoo3qpizng4nhyr"
              onInit={(evt, editor) => editorRef.current = editor}
              value={answerContent}
              onEditorChange={(content) => setAnswerContent(content)}
              init={{
                height: 300,
                menubar: false,
                branding: false,
                statusbar: false,
                plugins: [
                  'lists', 'advlist', 'autolink', 'emoticons', 'link', 'image', 'code'
                ],
                toolbar:
                  'bold italic strikethrough | bullist numlist | alignleft aligncenter alignright | emoticons link image code',
                content_style: 'body { font-family:Inter,sans-serif; font-size:14px }',
                images_upload_handler: function (blobInfo, success, failure) {
                  success("data:" + blobInfo.blob().type + ";base64," + blobInfo.base64());
                },
                placeholder: 'Write your answer here...',
              }}
            />
          </div>
          
          <div className="flex justify-end">
            <button 
              onClick={handleSubmitAnswer}
              disabled={submittingAnswer}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 border border-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submittingAnswer ? 'Submitting...' : 'Submit Answer'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuestionView;