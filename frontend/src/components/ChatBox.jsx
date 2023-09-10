import React from "react";
import { chatState } from "../Context/ChatProvider";
import SingleChat from "./SingleChat";

const ChatBox = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat } = chatState();

  return (
    <div className="container mx-3">
      <div className="min-w-full border rounded">
        <div
          className={`base:${
            selectedChat ? "flex" : "none"
          } md:flex flex-col lg:col-span-2 lg:block items-center sm:w-full md:w-{68%}`}
        >
          <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
