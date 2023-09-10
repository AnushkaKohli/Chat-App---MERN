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
