//For two people chatting, only one will be the logged in user, other will be the sender

//if the id of 1st element of users array is same as logged in user, then 2nd element is the sender else 1st element is the sender. We return the name of the sender.
export const getSender = (loggedUser, users) => {
  return users[0]?._id === loggedUser?._id ? users[1].name : users[0].name;
};

export const getSenderImage = (loggedUser, users) => {
  return users[0]?._id === loggedUser._id
    ? users[1].displayPicture
    : users[0].displayPicture;
};

export const getSenderFull = (loggedUser, users) => {
  return users[0]?._id === loggedUser._id ? users[1] : users[0];
};

export const isSameSender = (
  messages,
  currentMessage,
  currentMessageIndex,
  userId
) => {
  // i length of message is less than the length of all messages and if the next message is not sent by the same user or if the next message is undfined and if the current message is not sent by the logged in user, then return true
  return (
    currentMessageIndex < messages.length - 1 &&
    (messages[currentMessageIndex + 1].sender._id !==
      currentMessage.sender._id ||
      messages[currentMessageIndex + 1] === undefined) &&
    messages[currentMessageIndex]?.sender._id !== userId
  );
};

export const isLastMessage = (messages, currentMessageIndex, userId) => {
  return (
    currentMessageIndex === messages.length - 1 &&
    messages[messages.length - 1]?.sender._id !== userId &&
    messages[messages.length - 1]?.sender._id
  );
};

export const isSameSenderMargin = (messages, currentMessage, index, userId) => {
  if (
    index < messages.length - 1 &&
    // if sender of next message is same as sender of current message
    messages[index + 1].sender._id === currentMessage.sender._id &&
    // if sender of current message is not the logged-in user
    messages[index + 1].sender._id !== userId
  )
    return 36;
  // if the message is last message from the non logged in user
  else if (
    (index < messages.length - 1 &&
      // if sender of next message is not same as sender of current message
      messages[index + 1].sender._id !== currentMessage.sender._id &&
      // if sender of current message is not the logged-in user
      messages[index].sender._id !== userId) ||
    (index === messages.length - 1 && messages[index].sender._id !== userId)
  )
    return 0;
  // if sender of current message is the logged-in user
  else return "auto";
};

export const isSameUser = (messages, currentMessage, index) => {
  // if the message is not the first message and if the sender of the previous message is same as the sender of the current message, then return true
  return (
    index > 0 && messages[index - 1].sender._id === currentMessage.sender._id
  );
};
