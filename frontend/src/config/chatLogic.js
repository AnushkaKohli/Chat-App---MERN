//For two people chatting, only one will be the logged in user, other will be the sender
export const getSender = (loggedUser, users) => {
  return users[0]?._id === loggedUser?._id ? users[1].name : users[0].name;
};
