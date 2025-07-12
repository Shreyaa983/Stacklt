import Header from "../navbar/Header";
import {
    ArrowUpIcon,
    ArrowDownIcon,
    EyeIcon,
    ClockIcon,
    TagIcon,
    FunnelIcon,
    AdjustmentsVerticalIcon
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Landing() {
    const [questions, setQuestions] = useState([]);
    const navigate = useNavigate();
    const navigateToQuestion = () => navigate('/question');

    // Get questions from the server when the page loads
    useEffect(() => {
        fetch("/api/questions")
            .then(res => res.json())
            .then(data => setQuestions(data));
    }, []);

    return (
        <>
            <Header />
            <div className="flex flex-row justify-center bg-gray-50 min-h-screen py-8">
                {/* Main area with questions */}
                <div className="w-3/5 mr-8">
                    {/* Page title and menu */}
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold mb-1">All Questions</h1>
                        <p className="text-gray-500 mb-4">5 questions found</p>
                        <div className="flex border-b border-gray-200 mb-4 gap-1">
                            <button className="px-4 py-2 border-b-2 border-blue-600 text-blue-600 font-semibold">All Questions</button>
                            <button className="px-4 py-2 hover:border-b-2 hover:border-gray-500 text-gray-500 cursor-pointer">Unanswered</button>
                            <button className="px-4 py-2 hover:border-b-2 hover:border-gray-500 text-gray-500 cursor-pointer">My Questions</button>
                        </div>
                        <div className="flex gap-2 mb-4">
                            <button className="border px-3 py-1 rounded cursor-pointer hover:bg-gray-300 flex items-center gap-1">
                                <FunnelIcon className="h-5 w-5" />
                                Filter
                            </button>
                            <button className="border px-3 py-1 rounded cursor-pointer hover:bg-gray-300 flex items-center gap-1">
                                <AdjustmentsVerticalIcon className="h-5 w-5" />
                                Sort by: Newest
                            </button>
                        </div>
                    </div>
                    {/* Here we show the questions */}
                    <div className="space-y-6">
                        <DemoCard navigateToQuestion={navigateToQuestion} />
                        {questions.map((q) => (
                            <div key={q.id} className="bg-white rounded-lg shadow p-6 flex flex-row">
                                {/* Upvote and downvote buttons */}
                                <div className="flex flex-col items-center mr-6">
                                    <ArrowUpIcon className="h-6 w-6 text-gray-400 cursor-pointer" />
                                    <span className="font-semibold text-lg">23</span>
                                    <ArrowDownIcon className="h-6 w-6 text-gray-400 cursor-pointer" />
                                </div>
                                {/* Question details */}
                                <div className="flex-1">
                                    <div className="flex items-center mb-2">
                                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-sm font-medium mr-2">4 answers</span>
                                        <span className="flex items-center text-gray-400 text-sm mr-2"><EyeIcon className="h-4 w-4 mr-1" />156</span>
                                    </div>
                                    <h2 className="text-xl font-semibold mb-1 hover:text-blue-500 cursor-pointer" onClick={() => navigate('/question/1')}>{q.title}</h2>
                                    <p className="text-gray-600 mb-2">{q.description}</p>
                                    <div className="flex gap-2 mb-2">
                                        <span className="flex items-center bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs"><TagIcon className="h-4 w-4 mr-1" />React</span>
                                        <span className="flex items-center bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs"><TagIcon className="h-4 w-4 mr-1" />TypeScript</span>
                                        <span className="flex items-center bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs"><TagIcon className="h-4 w-4 mr-1" />State Management</span>
                                    </div>
                                    <div className="flex items-center text-gray-400 text-sm">
                                        <span>asked by <span className="text-blue-600 font-medium">DevMaster99</span></span>
                                        <span className="flex items-center ml-4"><ClockIcon className="h-4 w-4 mr-1" />2 hours ago</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                {/* Sidebar on the right */}
                <div className="w-1/4">
                    {/* Community stats box */}
                    <div className="bg-blue-50 rounded-lg p-4 mb-6">
                        <h3 className="font-semibold mb-2">Community Stats</h3>
                        <div className="flex justify-between mb-1">
                            <span>Questions</span>
                            <span className="text-blue-700 font-semibold">2,847</span>
                        </div>
                        <div className="flex justify-between mb-1">
                            <span>Answers</span>
                            <span className="text-green-700 font-semibold">4,231</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Users</span>
                            <span className="text-purple-700 font-semibold">1,456</span>
                        </div>
                    </div>
                    {/* Hot questions list */}
                    <div className="bg-white rounded-lg shadow p-4 mb-6">
                        <h3 className="font-semibold mb-2">Hot Questions</h3>
                        <ul className="list-disc list-inside text-blue-700 text-sm space-y-1">
                            <li>How to implement authentication in React?</li>
                            <li>Best practices for API design</li>
                            <li>Understanding TypeScript generics</li>
                        </ul>
                    </div>
                    {/* Popular tags section */}
                    <div className="bg-white rounded-lg shadow p-4">
                        <h3 className="font-semibold mb-2">Popular Tags</h3>
                        <div className="flex flex-wrap gap-2">
                            <span className="flex items-center bg-gray-200 px-2 py-1 rounded text-xs"><TagIcon className="h-4 w-4 mr-1" />React</span>
                            <span className="flex items-center bg-gray-200 px-2 py-1 rounded text-xs"><TagIcon className="h-4 w-4 mr-1" />JavaScript</span>
                            <span className="flex items-center bg-gray-200 px-2 py-1 rounded text-xs"><TagIcon className="h-4 w-4 mr-1" />TypeScript</span>
                            <span className="flex items-center bg-gray-200 px-2 py-1 rounded text-xs"><TagIcon className="h-4 w-4 mr-1" />Node.js</span>
                            <span className="flex items-center bg-gray-200 px-2 py-1 rounded text-xs"><TagIcon className="h-4 w-4 mr-1" />Python</span>
                            <span className="flex items-center bg-gray-200 px-2 py-1 rounded text-xs"><TagIcon className="h-4 w-4 mr-1" />CSS</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

// This is a sample card to show what a question looks like
function DemoCard({ navigateToQuestion }) {
    return (
        <div className="bg-white rounded-lg shadow p-6 flex flex-row">
            {/* Upvote and downvote buttons */}
            <div className="flex flex-col items-center mr-6">
                <ArrowUpIcon className="h-6 w-6 text-gray-400 cursor-pointer" />
                <span className="font-semibold text-lg">23</span>
                <ArrowDownIcon className="h-6 w-6 text-gray-400 cursor-pointer" />
            </div>
            {/* Question details */}
            <div className="flex-1">
                <div className="flex items-center mb-2">
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-sm font-medium mr-2">4 answers</span>
                    <span className="flex items-center text-gray-400 text-sm mr-2"><EyeIcon className="h-4 w-4 mr-1" />156</span>
                </div>
                <h2 onClick={navigateToQuestion} className="text-xl font-semibold mb-1 hover:text-blue-500 cursor-pointer">How to implement state management in React with TypeScript?</h2>
                <p className="text-gray-600 mb-2">I'm building a medium-sized React application and I'm wondering what the best approach is for state management. Should I use Redux, Zustand, or stick with React's built-in state...</p>
                <div className="flex gap-2 mb-2">
                    <span className="flex items-center hover:bg-blue-200 bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs"><TagIcon className="h-4 w-4 mr-1" />React</span>
                    <span className="flex items-center hover:bg-blue-200 bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs"><TagIcon className="h-4 w-4 mr-1" />TypeScript</span>
                    <span className="flex items-center hover:bg-blue-200 bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs"><TagIcon className="h-4 w-4 mr-1" />State Management</span>
                </div>
                <div className="flex items-center text-gray-400 text-sm">
                    <span>asked by <span className="text-blue-600 font-medium">DevMaster99</span></span>
                    <span className="flex items-center ml-4"><ClockIcon className="h-4 w-4 mr-1" />2 hours ago</span>
                </div>
            </div>
        </div>
    );
}

export default Landing;