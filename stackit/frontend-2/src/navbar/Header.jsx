import {
  MagnifyingGlassIcon,
  UserCircleIcon,
  BellIcon,
} from "@heroicons/react/24/outline";
import { PlusIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();
  const navigateToLogin = () => navigate('/login');
  const navigateToAskQuestion = () => navigate('/AskQuestion');
  return (
    <div className="flex items-center justify-between border-1 border-gray-400 p-5">
      {/* Logo and Navigation */}
      <div className="flex items-center gap-7">
        <h1 className="text-blue-700 text-3xl font-bold">StackIt</h1>
        <h1 className="text-xl text-gray-700 hover:text-blue-500 cursor-pointer">
          Questions
        </h1>
        <h1 className="text-xl text-gray-700 hover:text-blue-500 cursor-pointer">
          Tags
        </h1>
        <h1 className="text-xl text-gray-700 hover:text-blue-500 cursor-pointer">
          Users
        </h1>
      </div>
      
      {/*Search */}
      <div className="flex items-center border border-gray-300 rounded-lg px-4 py-2 bg-gray-100 shadow-sm focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 w-175">
        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 mr-2" />
        <input
          type="text"
          placeholder="Search"
          className="outline-none border-none bg-transparent text-gray-700 placeholder-gray-400 w-full"
        />
      </div>

      {/* Ask Question Button and Icons */}
      <div className="flex items-center gap-10">
        <button onClick={navigateToAskQuestion} className="bg-blue-600 cursor-pointer text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
          <PlusIcon className="h-5 w-5" />
          Ask Question
        </button>
        
        <div className="flex items-center gap-6">
          <BellIcon className="h-6 w-6 text-gray-600 hover:text-blue-500 cursor-pointer" />
          <UserCircleIcon onClick={navigateToLogin} className="h-6 w-6 text-gray-600 hover:text-blue-500 cursor-pointer" />
        </div>
      </div>
    </div>
  );
}

export default Header;
