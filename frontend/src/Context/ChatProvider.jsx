import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ChatContext = createContext();
const ChatProvider = ({ children }) => {
  const [user, setUser] = useState();
  const navigate = useNavigate();
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setUser(userInfo);

    if (!userInfo) {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <ChatContext.Provider value={{ user, setUser }}>
      {children}
    </ChatContext.Provider>
  );
};

//To make the state accessible to other parts of the app
export const chatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;