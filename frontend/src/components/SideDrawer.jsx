import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { chatState } from "../Context/ChatProvider";

//Importing Chakra and Icon Components
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
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  useDisclosure,
  InputGroup,
  Input,
  InputRightElement,
  useToast,
} from "@chakra-ui/react";
import { FaSearch } from "react-icons/fa";
import { BsChevronDown, BsBellFill } from "react-icons/bs";

//Importing Components
import ChatLoading from "./ChatLoading";
import ProfileModal from "./ProfileModal";
import UserListItem from "./User/UserListItem";

//Main Function
const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState();
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const { user } = chatState();
  const navigate = useNavigate();
  const toast = useToast();

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/login");
  };

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Empty Field",
        description: "Please enter something to search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(
        `http://localhost:5000/api/user?search=${search}`,
        config
      );
      setLoading(false);
      setSearchResult(data);

      console.log(searchResult);
      // console.log(
      //   searchResult?.map((user) => {
      //     console.log(user.name);
      //     console.log(user.email);
      //   })
      // );
    } catch (error) {
      toast({
        title: "Error!",
        description:
          "Failed to load the search results. Please try again later",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  const accessChat = async (userId) => {};

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
          <Button variant={{ base: "ghost", md: "outline" }} onClick={onOpen}>
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
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>

      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
          <DrawerBody>
            <Box display="flex" justifyContent="space-between" py={2}>
              <InputGroup size="md">
                <Input
                  focusBorderColor="#8b5cf6"
                  pr="4.5rem"
                  type="text"
                  placeholder="Search by name or email"
                  value={search}
                  s
                  onChange={(e) => setSearch(e.target.value)}
                />
                <InputRightElement width="4.5rem">
                  <Button
                    h="1.75rem"
                    size="sm"
                    variant="ghost"
                    onClick={handleSearch}
                  >
                    <FaSearch />
                  </Button>
                </InputRightElement>
              </InputGroup>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => {
                    accessChat(user._id);
                  }}
                />
              ))
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default SideDrawer;
