import Landing from "./components/Landing";
import Login from "./auth/Login";
import { Routes, Route } from "react-router-dom";
import QuestionView from "./components/QuestionView";
import AskQuestion from "./components/AskQuestion";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/question/:questionId" element={<QuestionView />} />
        <Route path="/AskQuestion" element={<AskQuestion />} />
      </Routes>
    </>
  );
}

export default App;
