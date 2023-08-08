import "./App.css";
import { Routes, Route } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import ChatPage from "./Pages/ChatPage";
import SignupPage from "./Pages/SignupPage";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" exact element={<HomePage />} />
        <Route path="/signup" exact element={<SignupPage />} />
        <Route path="/chats" exact element={<ChatPage />} />
      </Routes>
    </>
  );
}

export default App;
