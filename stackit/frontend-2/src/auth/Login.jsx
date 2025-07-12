import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [showSignUp, setShowSignUp] = useState(false);

  // State for login
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginMessage, setLoginMessage] = useState("");

  // State for signup
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupDropdown, setSignupDropdown] = useState("");
  const [signupMessage, setSignupMessage] = useState("");

  const navigate = useNavigate();

  // Classes
  const containerClass = "w-[500px] h-[600px] bg-white/90 rounded-3xl shadow-2xl border border-blue-100 overflow-hidden flex relative transition-all duration-700";
  const panelClass = "flex flex-col items-center justify-center h-full px-8 text-center w-full";
  // const btnOutline = "border border-white text-white text-sm font-semibold py-2 px-12 rounded-lg uppercase tracking-wider hover:bg-white hover:text-blue-700 transition-all duration-200 mt-6";

  // Overlay animation logic
  // const overlayClass = `absolute top-0 left-0 w-1/2 h-full transition-all duration-700 z-20
  //   ${showSignUp ? 'translate-x-full' : 'translate-x-0'}
  //   bg-gradient-to-r from-blue-600 to-purple-500 text-white flex items-center justify-center`;

  // Handle login submit
  // const handleLogin = (e) => {
  //   e.preventDefault();
  //   setLoginMessage("");
    
  //   // Simple frontend validation
  //   if (!loginEmail || !loginPassword) {
  //     setLoginMessage("Please fill in all fields");
  //     return;
  //   }
    
  //   // Simulate successful login
  //   setLoginMessage("Login successful!");
  //   setTimeout(() => {
  //     navigate("/");
  //   }, 1000);
  // };

  // Handle signup submit
  const handleSignup = (e) => {
    e.preventDefault();
    setSignupMessage("");
    
    // Simple frontend validation
    if (!signupName || !signupEmail || !signupPassword || !signupDropdown) {
      setSignupMessage("Please fill in all fields");
      return;
    }
    
    // Simulate successful registration
    setSignupMessage("Registration successful! You can now sign in.");
    setShowSignUp(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-bl from-pink-100 to-blue-100 font-[Montserrat]">
      <div className={containerClass}>
        {/* Sign Up Form */}
        <div className={panelClass}>
          <form className="w-full max-w-xs" onSubmit={handleSignup}>
            <h1 className="text-3xl font-bold text-blue-800 mb-6">Login</h1>
            <input 
              name="name" 
              type="text" 
              placeholder="Name" 
              value={signupName} 
              onChange={e => setSignupName(e.target.value)} 
              className="bg-gray-100 outline-none text-base py-3 px-4 rounded-lg w-full my-3 border border-blue-100 focus:ring-2 focus:ring-blue-300" 
            />
            <input 
              name="email" 
              type="email" 
              placeholder="Email" 
              value={signupEmail} 
              onChange={e => setSignupEmail(e.target.value)} 
              className="bg-gray-100 outline-none text-base py-3 px-4 rounded-lg w-full my-3 border border-blue-100 focus:ring-2 focus:ring-blue-300" 
            />
            <input 
              type="password" 
              placeholder="Password" 
              value={signupPassword} 
              onChange={e => setSignupPassword(e.target.value)} 
              className="bg-gray-100 outline-none text-base py-3 px-4 rounded-lg w-full my-3 border border-blue-100 focus:ring-2 focus:ring-blue-300" 
            />
            <select 
              value={signupDropdown} 
              onChange={e => setSignupDropdown(e.target.value)} 
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
            {signupMessage && <div className="mt-4 text-sm text-red-500">{signupMessage}</div>}
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
  );
}