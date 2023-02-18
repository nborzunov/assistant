import {
  Box,
  Button,
  CloseButton,
  Fade,
  Flex,
  Heading,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  ScaleFade,
  SlideFade,
  Tooltip,
  useDisclosure,
  Image,
} from "@chakra-ui/react";
import { SpeechTranslationModal } from "./SpeechTranslationModal";
import React, { useRef } from "react";
import { useVoiceRecognition } from "../../hooks/useVoiceRecognition";
import { useAssistant } from "./useAssistant";
import { Icons } from "../../assets/icons";
import { useGrantsListAssistant } from "./useGrantsListAssistant";
import assistant from "../../assets/assistant.png";

const AssistantWidgetContent = ({ onCloseWidget }: any) => {
  const { transcript, recording, handleStopRecording, handleStartRecording } =
    useVoiceRecognition(handleFinishRecording);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { text, setText, sendMessage, messages } = useGrantsListAssistant();
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
    <Flex flexDir={"column"} justify="space-between" w="100%" h={"100%"} pb={3}>
      <SpeechTranslationModal
        isOpen={isOpen}
        onClose={onClose}
        transcript={transcript}
        recording={recording}
        handleStopRecording={handleStopRecording}
      />
      <Flex flexDir={"column"} height={"90%"}>
        <Heading fontSize={"lg"} mb={3} mt={0} color={"white"}>
          Цифровой помощник
        </Heading>
        <CloseButton
          onClick={onCloseWidget}
          position={"absolute"}
          right={2}
          top={2}
          color={"white"}
        />

        <Flex
          flexDir={"column"}
          gap={2}
          height={"90%"}
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
            <>
              {message.noOutline ? (
                <Box lineHeight={"22px"}>{message.content}</Box>
              ) : (
                <Box
                  key={index}
                  bg={"white"}
                  px={3}
                  py={2}
                  borderRadius={
                    message.type === "out"
                      ? "16px 16px 16px 4px"
                      : "16px 16px 4px 16px"
                  }
                  alignSelf={message.type === "out" ? "start" : "end"}
                  width={"fit-content"}
                  maxWidth={"70%"}
                  fontWeight={"semibold"}
                  lineHeight={"22px"}
                >
                  {message.content}
                </Box>
              )}
            </>
          ))}
        </Flex>
      </Flex>
      <Box as={"form"} onSubmit={sendMessage}>
        <InputGroup variant={"filled"} size="lg">
          <Input
            placeholder="Введите вопрос.."
            colorScheme={"white"}
            bg={"white"}
            color={"gray.900"}
            _focus={{
              backgroundColor: "whiteAlpha.900",
            }}
            borderRadius={"2xl"}
            value={text}
            onChange={(e) => setText(e.target.value)}
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
  );
};
export const AssistantWidget = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Box position="fixed" bottom="12" right="12">
      {!isOpen && (
        <Tooltip label={"Открыть цифрового помощника"}>
          <Fade in={!isOpen}>
            <Button
              bg={"transparent"}
              transitionDuration={"0.2s"}
              _hover={{
                bg: "cyan.100",
                opacity: 0.9,
              }}
              w={40}
              h={40}
              borderRadius={"50%"}
              onClick={onOpen}
            >
              <Image src={assistant}></Image>
            </Button>
          </Fade>
        </Tooltip>
      )}
      {isOpen && (
        <SlideFade in={isOpen} offsetY="20px">
          <Box
            height={"560px"}
            w={"320px"}
            bg={"cyan.500"}
            borderRadius={"24"}
            py={3}
            px={4}
            position={"relative"}
            zIndex={1000}
          >
            <AssistantWidgetContent onCloseWidget={onClose} />
          </Box>
        </SlideFade>
        // <ScaleFade initialScale={0.9} in={isOpen}>
        //
        // </ScaleFade>
      )}
    </Box>
  );
};
