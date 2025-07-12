import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BellIcon,UserCircleIcon } from "@heroicons/react/24/outline";

export default function Login() {
  // State for login
  const [loginName, setLoginName] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginRole, setLoginRole] = useState("");
  const [loginMessage, setLoginMessage] = useState("");

  const navigate = useNavigate();
  const navigateToHome = () => navigate('/');

  // Classes
  const containerClass = "w-[500px] h-[600px] bg-white/90 rounded-3xl shadow-2xl border border-blue-100 overflow-hidden flex relative transition-all duration-700";
  const panelClass = "flex flex-col items-center justify-center h-full px-8 text-center w-full";

  // Handle login submit
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginMessage("");
    
    // Simple frontend validation
    if (!loginName || !loginEmail || !loginPassword || !loginRole) {
      setLoginMessage("Please fill in all fields");
      return;
    }
    
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: loginName,
          email: loginEmail,
          password: loginPassword,
          userType: loginRole
        })
      });

      if (response.ok) {
        const data = await response.json();
        setLoginMessage("Login successful!");
        
        // Store user data in localStorage
        if (data.user) {
          localStorage.setItem('userId', data.user.id);
          localStorage.setItem('username', data.user.username);
          localStorage.setItem('userEmail', data.user.email);
          localStorage.setItem('userRole', data.user.role);
        }
        
        if (data.token) {
          localStorage.setItem('token', data.token);
        }
        
        setTimeout(() => {
          navigate("/");
        }, 1000);
      } else {
        const errorData = await response.json();
        setLoginMessage(errorData.msg || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      setLoginMessage("Network error. Please try again.");
    }
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-bl from-pink-100 to-blue-100 font-[Montserrat]">
      <div className={containerClass}>
        {/* Login Form */}
        <div className={panelClass}>
          <form className="w-full max-w-xs" onSubmit={handleLogin}>
            <h1 className="text-3xl font-bold text-blue-800 mb-6">Login</h1>
            <input 
              name="name" 
              type="text" 
              placeholder="Name" 
              value={loginName} 
              onChange={e => setLoginName(e.target.value)} 
              className="bg-gray-100 outline-none text-base py-3 px-4 rounded-lg w-full my-3 border border-blue-100 focus:ring-2 focus:ring-blue-300" 
            />
            <input 
              name="email" 
              type="email" 
              placeholder="Email" 
              value={loginEmail} 
              onChange={e => setLoginEmail(e.target.value)} 
              className="bg-gray-100 outline-none text-base py-3 px-4 rounded-lg w-full my-3 border border-blue-100 focus:ring-2 focus:ring-blue-300" 
            />
            <input 
              type="password" 
              placeholder="Password" 
              value={loginPassword} 
              onChange={e => setLoginPassword(e.target.value)} 
              className="bg-gray-100 outline-none text-base py-3 px-4 rounded-lg w-full my-3 border border-blue-100 focus:ring-2 focus:ring-blue-300" 
            />
            <select 
              value={loginRole} 
              onChange={e => setLoginRole(e.target.value)} 
              className="bg-gray-100 outline-none text-base py-3 px-4 rounded-lg w-full my-3 border border-blue-100 focus:ring-2 focus:ring-blue-300"
            >
              <option value="">Select your Role</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            <button 
              type="submit"
              className="bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold py-3 px-12 rounded-lg uppercase tracking-wider shadow-md transition-all duration-200 mt-6 w-full cursor-pointer"
            >
              Login
            </button>
            {loginMessage && <div className="mt-4 text-sm text-red-500">{loginMessage}</div>}
          </form>
        </div>
      </div>
      {/* Responsive styles */}
      <style>{`
        @media (max-width: 600px) {
          .w-[950px], .h-[500px] { width: 100vw !important; height: 100vh !important; border-radius: 0 !important; }
          .max-w-xs { max-width: 90vw !important; }
        }
      `}</style>
    </div>
    </div>
  );
}