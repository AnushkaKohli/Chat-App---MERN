import React, { useState } from "react";
import { chatState } from "../Context/ChatProvider";

import {
  Box,
  Tooltip,
  Button,
  Text,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { FaSearch } from "react-icons/fa";
import { BsChevronDown, BsBellFill } from "react-icons/bs";
import ProfileModal from "./ProfileModal";

const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();

  const { user } = chatState();

  return (
    <div>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
        p="5px 10px 5px 10px"
        borderBottomWidth="3px"
      >
        <Tooltip label="Search users to chat" hasArrow placement="bottom-end">
          <Button variant={{ base: "ghost", md: "outline" }}>
            <FaSearch className="md:mr-3" />
            <Text display={{ base: "none", md: "flex" }}>Search Users</Text>
          </Button>
        </Tooltip>

        <Text
          fontSize="2xl"
          fontFamily="georgia"
          fontWeight="bold"
          color="#8b5cf6"
        >
          Chitti
        </Text>

        <div>
          <Menu>
            <MenuButton p={1} fontSize="2xl" m={1} marginTop={2}>
              <BsBellFill />
            </MenuButton>
            {/* <MenuList>
            <MenuItem>Download</MenuItem>
            <MenuItem>Create a Copy</MenuItem>
            <MenuItem>Mark as Draft</MenuItem>
            <MenuItem>Delete</MenuItem>
            <MenuItem>Attend a Workshop</MenuItem>
          </MenuList> */}
          </Menu>
          <Menu>
            <MenuButton
              py={6}
              fontSize="2xl"
              m={1}
              marginBottom={2}
              as={Button}
              rightIcon={<BsChevronDown />}
            >
              <Avatar
                name={user.name}
                src={user.displayPicture}
                size="sm"
                cursor="pointer"
              />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModal>
              <MenuItem>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>
    </div>
  );
};

export default SideDrawer;
