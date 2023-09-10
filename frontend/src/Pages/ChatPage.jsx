import React, { useState } from "react";
import { chatState } from "../Context/ChatProvider";
import { Box } from "@chakra-ui/react";

import SideDrawer from "../components/SideDrawer";
import MyChats from "../components/MyChats";
import ChatBox from "../components/ChatBox";

const ChatPage = () => {
  const { user } = chatState();
  const [fetchAgain, setFetchAgain] = useState(false);

  return (
    <div className="w-full">
      {user && <SideDrawer />}
      <Box
        display="flex"
        justifyContent="space-between"
        w="100%"
        h="91.5vh"
        p="10px"
      >
        {user && <MyChats fetchAgain={fetchAgain} />}
        {user && (
          <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </Box>
    </div>
  );
};

export default ChatPage;
