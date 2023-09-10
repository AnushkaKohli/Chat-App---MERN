import React from "react";
import {
  isSameSender,
  isLastMessage,
  isSameSenderMargin,
} from "../../config/chatLogic";
import { chatState } from "../../Context/ChatProvider";
import { Avatar, Tooltip } from "@chakra-ui/react";

const ScrollableChat = ({ messages }) => {
  const { user } = chatState();
  return (
    <div>
      {messages &&
        messages.map((currentMessage, index) => (
          <div
            style={{
              display: "flex",
              marginTop: isSameSender(messages, currentMessage, index, user._id)
                ? 3
                : 10,
            }}
            key={currentMessage._id}
          >
            {(isSameSender(messages, currentMessage, index, user._id) ||
              isLastMessage(messages, index, user._id)) && (
              <Tooltip
                label={currentMessage.sender.name}
                placement="bottom-start"
                hasArrow
              >
                <Avatar
                  mt="7px"
                  mr={1}
                  size="sm"
                  cursor="pointer"
                  name={currentMessage.sender.name}
                  src={currentMessage.sender.displayPicture}
                />
              </Tooltip>
            )}
            {currentMessage.sender._id === user._id ? (
              //<div className="flex justify-end">
              <div
                style={{
                  marginLeft: isSameSenderMargin(
                    messages,
                    currentMessage,
                    index,
                    user._id
                  ),
                }}
                className="relative max-w-xl px-4 py-2 text-gray-700 bg-gray-100 rounded shadow"
              >
                <span className="block">{currentMessage.content}</span>
              </div>
            ) : (
              //</div>
              //<div className="flex justify-start">
              <div
                style={{
                  marginLeft: isSameSenderMargin(
                    messages,
                    currentMessage,
                    index,
                    user._id
                  ),
                }}
                className="relative max-w-xl px-4 py-2 text-white bg-[#9a5cf6] rounded shadow"
              >
                <span className="block">{currentMessage.content}</span>
              </div>
              //</div>
            )}
          </div>
        ))}
    </div>
  );
};

export default ScrollableChat;
