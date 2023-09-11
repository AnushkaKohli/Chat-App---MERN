import React, { useEffect, useState } from "react";
import axios from "axios";
import { chatState } from "../Context/ChatProvider";
import { getSender, getSenderFull, getSenderImage } from "../config/chatLogic";
import ProfileModal from "./ProfileModal";
import UpdateGroupChatModal from "./updateGroupChatModal";
import ScrollableChat from "./Chat/ScrollableChat";
import { IoArrowBack } from "react-icons/io5";
import { IconButton, Spinner, useToast } from "@chakra-ui/react";

import io from "socket.io-client";
const ENDPOINT = "http://localhost:5000";
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const { user, selectedChat, setSelectedChat } = chatState();
  //console.log(selectedChat);
  const toast = useToast();

  // --------------------------STATES -----------------------------
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState();
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  // --------------------------USE EFFECTS AND FUNCTIONS-----------------------------

  const getMessages = async () => {
    if (!selectedChat) return;
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      setLoading(true);
      const { data } = await axios.get(
        `http://localhost:5000/api/message/${selectedChat._id}`,
        config
      );

      console.log(messages);
      setMessages(data);
      setLoading(false);

      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toast({
        title: "Error. Cannot Get Messages",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  useEffect(() => {
    // monitors the socket and takes the information of message received

    socket.on("message received", (newMessageReceived) => {
      // if chat is not selected or doesn't match current chat
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageReceived.chat._id
      ) {
        // give notification to the user
      } else {
        setMessages([...messages, newMessageReceived]);
      }
    });
  });

  const sendMessage = async (e) => {
    if (e.key === "Enter" && newMessage) {
      socket.emit("stop typing", selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };

        setNewMessage("");
        const { data } = await axios.post(
          "http://localhost:5000/api/message",
          { content: newMessage, chatId: selectedChat },
          config
        );
        console.log(data);

        socket.emit("new message", data);

        // New message is appended to the messages array
        setMessages([...messages, data]);
      } catch (error) {
        toast({
          title: "An error occurred!",
          description: error.response.data.message,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    /* This is emitting a "setup" event to the server using the socket connection. It sends the `user` object as data along with the event. This event is typically used to set up the initial connection between the client and the server, and it allows the server to associate the socket connection with a specific user. */
    socket.emit("setup", user);
    /* This is setting up a listener for the "connection" event emitted by the server. When the server emits the "connection" event, the callback function `() => setSocketConnected(true)` is executed, which sets the state variable `socketConnected` to `true`. This is used to track the status of the socket connection and determine if the socket is connected or not. */
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  }, []);

  useEffect(() => {
    getMessages();

    // to keep the back up of the selected chat inside selectedChatCompare. Accordingly, we decide if we are supposed to emit the message or we are supposed to give the notification to the user
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    // Typing indicator logic
    if (!socketConnected) return;
    if (!typing) {
      setTyping(true);
      socket.emit("start typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDifference = timeNow - lastTypingTime;
      if (timeDifference >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  return (
    <div>
      {selectedChat ? (
        <div className="w-full">
          {/* Upper Info */}
          <div className="flex w-full relative items-center sm: justify-between px-3 md:py-3 border-b border-gray-300 font-serif">
            <IconButton
              display={{ base: "flex", md: "none" }}
              m="10px"
              icon={<IoArrowBack />}
              onClick={() => setSelectedChat("")}
            />

            {messages &&
              (!selectedChat.isGroupChat ? (
                <>
                  <div className="flex flex-row items-center">
                    <img
                      className="object-cover w-10 h-10 rounded-full"
                      src={getSenderImage(user, selectedChat.users)}
                      alt="username"
                    />
                    <span className="block ml-2 font-bold text-gray-600">
                      {getSender(user, selectedChat.users)}
                    </span>
                    <span className="absolute w-3 h-3 bg-green-600 rounded-full left-10 top-3"></span>
                  </div>

                  <ProfileModal
                    user={getSenderFull(user, selectedChat.users)}
                  />
                </>
              ) : (
                <>
                  {selectedChat.chatName.toUpperCase()}
                  <UpdateGroupChatModal
                    fetchAgain={fetchAgain}
                    setFetchAgain={setFetchAgain}
                    getMessages={getMessages}
                  />
                </>
              ))}
          </div>

          {/* Middle Chat */}
          <div className="relative w-full p-6 overflow-y-auto h-[40rem]">
            {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <ScrollableChat messages={messages} />
            )}
            {isTyping ? <div>Loading...</div> : <></>}
          </div>

          {/* Send Chat Container */}
          <div
            className="flex items-center justify-between w-full p-3 border-t border-gray-300"
            onKeyDown={sendMessage}
          >
            <button>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </button>
            <button>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                />
              </svg>
            </button>

            <input
              type="text"
              placeholder="Enter a message..."
              className="block w-full py-2 pl-4 mx-3 bg-gray-100 rounded-full outline-none focus:text-gray-700"
              name="message"
              required
              onChange={typingHandler}
            />
            <button>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                />
              </svg>
            </button>
            <button type="submit">
              <svg
                className="w-5 h-5 text-gray-500 origin-center transform rotate-90"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-screen w-full  text-3xl p-7 text-center">
          Click on a user to start chatting
        </div>
      )}
    </div>
  );
};

export default SingleChat;
