import Landing from "./components/Landing";
import Login from "./auth/Login";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  );
}

export default App;