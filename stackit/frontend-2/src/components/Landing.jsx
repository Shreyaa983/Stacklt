import Header from "../navbar/Header";
import {
    ArrowUpIcon,
    ArrowDownIcon,
    EyeIcon,
    ClockIcon,
    TagIcon,
    FunnelIcon,
    AdjustmentsVerticalIcon,
    ChevronDownIcon
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Landing() {
    const [questions, setQuestions] = useState([]);
    const [filterType, setFilterType] = useState('all');
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const navigateToQuestion = () => navigate('/question');

    // Fetch questions based on filter type
    const fetchQuestions = async (filter = 'all') => {
        try {
            setLoading(true);
            let url = "http://localhost:5000/api/questions/fetch";
            
            if (filter === 'newest') {
                url = "http://localhost:5000/api/questions/newest";
            }
            
            const response = await fetch(url);
            if (response.ok) {
                const data = await response.json();
                setQuestions(data.data || []); // Extract data from the response
            } else {
                console.error("Failed to fetch questions");
            }
        } catch (error) {
            console.error("Error fetching questions:", error);
        } finally {
            setLoading(false);
        }
    };

    // Get questions from the server when the page loads
    useEffect(() => {
        fetchQuestions(filterType);
    }, [filterType]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.filter-dropdown')) {
                setShowFilterDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
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
                        <p className="text-gray-500 mb-4">{questions.length} questions found</p>
                        <div className="flex border-b border-gray-200 mb-4 gap-1">
                            <button className="px-4 py-2 border-b-2 border-blue-600 text-blue-600 font-semibold">All Questions</button>
                        </div>
                        <div className="flex gap-2 mb-4">
                            {/* Single Filter Dropdown */}
                            <div className="relative filter-dropdown">
                                <button 
                                    className="border px-3 py-1 rounded cursor-pointer hover:bg-gray-300 flex items-center gap-1"
                                    onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                                >
                                    <FunnelIcon className="h-5 w-5" />
                                    Filter: {filterType === 'all' ? 'All Questions' : 'Newest'}
                                    <ChevronDownIcon className="h-4 w-4" />
                                </button>
                                {showFilterDropdown && (
                                    <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded shadow-lg z-10 min-w-40">
                                        <div 
                                            className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                                            onClick={() => {
                                                setFilterType('all');
                                                setShowFilterDropdown(false);
                                            }}
                                        >
                                            All Questions
                                        </div>
                                        <div 
                                            className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                                            onClick={() => {
                                                setFilterType('newest');
                                                setShowFilterDropdown(false);
                                            }}
                                        >
                                            Newest
                                        </div>
                                    </div>
                                )}
                            </div>

                            <button className="border px-3 py-1 rounded cursor-pointer hover:bg-gray-300 flex items-center gap-1">
                                <AdjustmentsVerticalIcon className="h-5 w-5" />
                                Sort by: Newest
                            </button>
                        </div>
                    </div>
                    {/* Here we show the questions */}
                    <div className="space-y-6">
                        {loading ? (
                            <div className="bg-white rounded-lg shadow p-6 text-center">
                                <p className="text-gray-500">Loading questions...</p>
                            </div>
                        ) : questions.length === 0 ? (
                            <div className="bg-white rounded-lg shadow p-6 text-center">
                                <p className="text-gray-500">No questions found. Be the first to ask a question!</p>
                            </div>
                        ) : (
                            questions.map((question) => (
                                <div key={question._id} className="bg-white rounded-lg shadow p-6 flex flex-row">
                                    {/* Upvote and downvote buttons */}
                                    <div className="flex flex-col items-center mr-6">
                                        <ArrowUpIcon className="h-6 w-6 text-gray-400 cursor-pointer" />
                                        <span className="font-semibold text-lg">{question.upvotes || 0}</span>
                                        <ArrowDownIcon className="h-6 w-6 text-gray-400 cursor-pointer" />
                                    </div>
                                    {/* Question details */}
                                    <div className="flex-1">
                                        <div className="flex items-center mb-2">
                                            <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-sm font-medium mr-2">{question.answerCount || 0} {question.answerCount === 1 ? 'answer' : 'answers'}</span>
                                            <span className="flex items-center text-gray-400 text-sm mr-2"><EyeIcon className="h-4 w-4 mr-1" />0</span>
                                        </div>
                                        <h2 className="text-xl font-semibold mb-1 hover:text-blue-500 cursor-pointer" onClick={() => navigate('/question/' + question._id)}>
                                            {question.title}
                                        </h2>
                                        <p className="text-gray-600 mb-2">
                                            {question.description && question.description.length > 200 
                                                ? question.description.substring(0, 200) + '...' 
                                                : question.description}
                                        </p>
                                        <div className="flex gap-2 mb-2">
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
                            ))
                        )}
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



export default Landing;