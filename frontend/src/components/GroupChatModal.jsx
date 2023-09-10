import React, { useState } from "react";
import axios from "axios";

import {
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useToast,
  Input,
  FormControl,
  Spinner,
  Box,
} from "@chakra-ui/react";

import { chatState } from "../Context/ChatProvider";
import UserListItem from "./User/UserListItem";
import UserBadgeItem from "./User/UserBadgeItem";

const GroupChatModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState();
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const toast = useToast();

  const { user, chats, setChats } = chatState();

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
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
      //console.log(data);
      setLoading(false);
      setSearchResult(data);
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
  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers) {
      toast({
        title: "Empty Fields",
        description: "Please fill all the fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = axios.post(
        "http://localhost:5000/api/chat/group",
        {
          // This is the data that will be sent to the backend. It will be available in the `req.body` object.
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((user) => user._id)),
        },
        config
      );

      setChats([data, ...chats]);
      onClose();
      toast({
        title: "Group Chat Created",
        description: "Group chat created successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    } catch (error) {
      toast({
        title: "Failed to create the chat!",
        description: error.message.data,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };
  const handleGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      toast({
        title: "User already added",
        description: "Please select another user",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    setSelectedUsers([...selectedUsers, userToAdd]);
  };
  const handleDelete = (userToDelete) => {
    setSelectedUsers(
      /* This is filtering the `selectedUsers` array to remove the user with the same `_id` as `userToDelete._id`. It creates
      a new array that only includes the users that do not have the same `_id` as the user to be deleted. */
      selectedUsers.filter((user) => user._id !== userToDelete._id)
    );
  };

  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="35px"
            fontFamily="serif"
            color="#8b5cf6"
            display="flex"
            justifyContent="center"
          >
            Create Group Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" flexDirection="column" alignItems="center">
            <FormControl>
              <Input
                type="text"
                placeholder="Chat Name"
                focusBorderColor="#8b5cf6"
                mb={3}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <Input
                type="text"
                placeholder="Add Users Eg: John"
                focusBorderColor="#8b5cf6"
                mb={3}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>

            {/* List of selected users */}
            <Box w="100%" display="flex" flexWrap="wrap">
              {selectedUsers?.map((user) => (
                <UserBadgeItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleDelete(user)}
                />
              ))}
            </Box>

            {/* Render searched users */}
            {loading ? (
              <div>
                <Spinner />
              </div>
            ) : (
              searchResult?.slice(0, 4).map((user) => (
                <div className="w-full mt-1">
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => {
                      handleGroup(user);
                    }}
                    className="w-full"
                  />
                </div>
              ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button
              color="white"
              backgroundColor="#8b5cf6"
              _hover={{ bg: "#a78bfa" }}
              mr={3}
              onClick={handleSubmit}
            >
              Create Chat
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModal;
