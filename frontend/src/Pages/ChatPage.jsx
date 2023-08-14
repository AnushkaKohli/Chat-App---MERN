import React from "react";
import { chatState } from "../Context/ChatProvider";

const ChatPage = () => {
  const { user } = chatState();

  return <div className="w-full"></div>;
};

export default ChatPage;
