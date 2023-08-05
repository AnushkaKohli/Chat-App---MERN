const chats = [
  {
    isGroupChat: false,
    users: [
      {
        name: "John Doe",
        email: "john@example.com",
      },
      {
        name: "Smith",
        email: "smith@example.com",
      },
    ],
    _id: "617a077e18c25468bc7c4dd4",
    chatName: "John Doe",
  },
  {
    isGroupChat: false,
    users: [
      {
        name: "Johnson",
        email: "johnson@example.com",
      },
      {
        name: "Williams",
        email: "williams@example.com",
      },
    ],
    _id: "617a077e18c25468b27c4dd4",
    chatName: "Johnson",
  },
  {
    isGroupChat: false,
    users: [
      {
        name: "Anthony",
        email: "anthony@example.com",
      },
      {
        name: "Williams",
        email: "williams@example.com",
      },
    ],
    _id: "617a077e18c2d468bc7c4dd4",
    chatName: "Anthony",
  },
  {
    isGroupChat: true,
    users: [
      {
        name: "John Doe",
        email: "john@example.com",
      },
      {
        name: "Smith",
        email: "smith@example.com",
      },
      {
        name: "Williams",
        email: "williams@example.com",
      },
    ],
    _id: "617a518c4081150716472c78",
    chatName: "Friends",
    groupAdmin: {
      name: "John Doe",
      email: "john@example.com",
    },
  },
  {
    isGroupChat: false,
    users: [
      {
        name: "Brown",
        email: "brown@example.com",
      },
      {
        name: "Jones",
        email: "jones@example.com",
      },
    ],
    _id: "617a0b77e18c25468bc7cfdd4",
    chatName: "Brown",
  },
  {
    isGroupChat: true,
    users: [
      {
        name: "Joey",
        email: "joey@example.com",
      },
      {
        name: "Chandler",
        email: "chandler@example.com",
      },
      {
        name: "Ross",
        email: "ross@example.com",
      },
    ],
    _id: "617a518c4081150016472c78",
    chatName: "Centarl Perk",
    groupAdmin: {
      name: "Joey",
      email: "joey@example.com",
    },
  },
];

module.exports = chats;
