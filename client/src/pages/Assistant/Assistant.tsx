import React from "react";
import { useVoiceRecognition } from "../../hooks/useVoiceRecognition";
import {
  Box,
  Button,
  Center,
  Fade,
  Flex,
  Heading,
  Icon,
  IconButton,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  useDisclosure,
} from "@chakra-ui/react";
import { Icons } from "../../assets/icons";
import { useAssistant } from "./useAssistant";
import { SpeechTranslationModal } from "./SpeechTranslationModal";
import assistant from "../../assets/assistant.png";

export const Assistant = () => {
  const { transcript, recording, handleStopRecording, handleStartRecording } =
    useVoiceRecognition(handleFinishRecording);

  const { text, setText, inputRef, sendMessage, messages, grant } =
    useAssistant();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const startRecording = () => {
    onOpen();
    handleStartRecording();
  };

  function handleFinishRecording(transcript: string) {
    setText(transcript);
    sendMessage(null, transcript);
    onClose();
  }

  return (
    <Center bg={"cyan.500"} width={"100vw"} minH={"100vh"}>
      <Flex
        flexDir={"column"}
        justify="space-between"
        w="3xl"
        h={"100vh"}
        py={8}
        position={"relative"}
      >
        <Box
          position={"absolute"}
          right={-40}
          bottom={5}
          w={48}
          h={48}
          p={4}
          borderRadius={"50%"}
        >
          <Image src={assistant}></Image>
        </Box>
        <Flex flexDir={"column"}>
          <Box>
            <Heading fontSize={"2xl"} color={"whiteAlpha.900"} mb={6}>
              {grant?.title}
            </Heading>
          </Box>
          <Flex
            px={2}
            flexDir={"column"}
            gap={2}
            maxHeight={"85vh"}
            height="100%"
            minHeight={"85vh"}
            overflowY={"auto"}
            scrollSnapType={"y mandatory"}
            sx={{
              "&::-webkit-scrollbar": {
                width: "12px",
                borderRadius: "8px",
                backgroundColor: `rgba(0, 0, 0, 0.05)`,
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: `rgba(0, 0, 0, 0.15)`,
              },
            }}
          >
            {messages.map((message, index) => (
              <Box
                key={index}
                width={"fit-content"}
                maxWidth={"70%"}
                scrollSnapAlign={"start"}
                alignSelf={message.type === "out" ? "start" : "end"}
              >
                <Fade in={message.content}>
                  {message.noOutline ? (
                    message.content
                  ) : (
                    <Box
                      bg={"white"}
                      px={3}
                      py={2}
                      borderRadius={
                        message.type === "out"
                          ? "16px 16px 16px 4px"
                          : "16px 16px 4px 16px"
                      }
                      fontWeight={"semibold"}
                    >
                      {message.content}
                    </Box>
                  )}
                </Fade>
              </Box>
            ))}
          </Flex>
        </Flex>
        <Box
          as={"form"}
          onSubmit={sendMessage}
          px={2}
          width={"calc(100% - 12px)"}
        >
          <InputGroup variant={"filled"} size="lg">
            <Input
              placeholder="Введите ответ или задайте вопрос.."
              colorScheme={"white"}
              bg={"white"}
              color={"gray.900"}
              _focus={{
                backgroundColor: "whiteAlpha.900",
              }}
              borderRadius={"2xl"}
              value={text}
              onChange={(e) => setText(e.target.value)}
              ref={inputRef}
            />
            {!text ? (
              <InputRightElement
                children={
                  <IconButton
                    variant="ghost"
                    icon={<Icon as={Icons.Mic} color="cyan.500" />}
                    aria-label={"send"}
                    onClick={startRecording}
                    fontSize={"2xl"}
                  />
                }
              />
            ) : (
              <InputRightElement
                children={
                  <IconButton
                    variant="ghost"
                    icon={<Icon as={Icons.Send} color="cyan.500" />}
                    aria-label={"send"}
                    onClick={sendMessage}
                    fontSize={"xl"}
                  />
                }
              />
            )}
          </InputGroup>
        </Box>
      </Flex>

      <SpeechTranslationModal
        isOpen={isOpen}
        onClose={onClose}
        transcript={transcript}
        recording={recording}
        handleStopRecording={handleStopRecording}
      />
    </Center>
  );
};
