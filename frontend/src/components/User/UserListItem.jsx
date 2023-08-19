import React from "react";
import { Avatar, Box, Text } from "@chakra-ui/react";

const UserListItem = ({ user, handleFunction }) => {
  return (
    <div>
      <Box
        onClick={handleFunction}
        cursor="pointer"
        bg="pink"
        _hover={{
          bg: "green",
          color: "white",
        }}
        w="100%"
        display="flex"
        alignItems="center"
        color="black"
        px={3}
        py={2}
        mb={2}
        borderRadius="lg"
      >
        <Avatar
          mr={2}
          size="sm"
          cursor="pointer"
          name={user.name}
          src={user.displayPicture}
        />
        <Box>
          <Text>{user.name}</Text>
          <Text fontSize="xs" color="gray">
            <b>Email: </b>
            {user.email}
          </Text>
        </Box>
      </Box>
    </div>
  );
};

export default UserListItem;
