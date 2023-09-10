import React from "react";

import { Box, CloseButton } from "@chakra-ui/react";
import { GrFormClose } from "react-icons/gr";

const UserBadgeItem = ({ user, handleFunction }) => {
  return (
    <Box
      px={2}
      py={1}
      borderRadius="lg"
      m={1}
      mb={2}
      fontSize="18px"
      cursor="pointer"
      onClick={handleFunction}
      display="flex"
      background="#a78bfa"
      color="white"
    >
      {user.name}
      <CloseButton fontSize="10px" />
    </Box>
  );
};

export default UserBadgeItem;
