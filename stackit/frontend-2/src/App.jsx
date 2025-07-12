import Landing from "./components/Landing";
import Login from "./auth/Login";
import { Routes, Route } from "react-router-dom";
import QuestionView from "./components/QuestionView";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/question/" element={<QuestionView />} />
      </Routes>
    </>
  );
}

export default App;
