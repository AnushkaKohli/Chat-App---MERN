import React from "react";

import { AiOutlineUser } from "react-icons/ai";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  Image,
  Text,
} from "@chakra-ui/react";

const ProfileModal = ({ user, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <div>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <Button variant="ghost" onClick={onOpen}>
          <AiOutlineUser />
          <Text p={1}>View Profile</Text>
        </Button>
      )}

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent h="400px">
          <ModalHeader
            fontSize="3xl"
            fontWeight="bold"
            fontFamily="serif"
            color="#8b5cf6"
            display="flex"
            justifyContent="center"
          >
            {user.name}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="space-between"
          >
            <Image
              borderRadius="full"
              boxSize="150px"
              src={user.displayPicture}
              alt={user.name}
            />

            <Text fontSize={{ base: "28px", md: "30px" }} fontFamily="serif">
              Email: {user.email}
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button
              color="white"
              backgroundColor="#8b5cf6"
              _hover={{ bg: "#a78bfa" }}
              mr={3}
              onClick={onClose}
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default ProfileModal;
