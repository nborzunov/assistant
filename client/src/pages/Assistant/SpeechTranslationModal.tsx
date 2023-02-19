import {
  Box,
  Flex,
  Icon,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import React from "react";
import "./SpeechTranslationModal.css";
import { Icons } from "../../assets/icons";

export const SpeechTranslationModal = ({
  isOpen,
  onClose,
  transcript,
  recording,
  handleStopRecording,
}: any) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay zIndex={1000} />
      <ModalContent margin={"auto"} borderRadius={"32"}>
        <ModalBody>
          <Box my={6} mx={4}>
            <Flex justify={"space-between"} alignItems={"center"}>
              <Box>
                <Text fontSize={"lg"} fontWeight={"semibold"}>
                  {transcript || "Говорите..."}
                </Text>
              </Box>
              <Box position={"relative"} ml={4}>
                <button id="speech" className="btn type2">
                  <Icon as={Icons.Mic} color={"white"} />
                </button>
                <Box className={"pulse-ring"}></Box>
              </Box>
            </Flex>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
