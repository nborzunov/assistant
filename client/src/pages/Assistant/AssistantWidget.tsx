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
  useOutsideClick,
  Center,
} from "@chakra-ui/react";
import { SpeechTranslationModal } from "./SpeechTranslationModal";
import React, { useEffect, useRef, useState } from "react";
import { useVoiceRecognition } from "../../hooks/useVoiceRecognition";
import { useAssistant } from "./useAssistant";
import { Icons } from "../../assets/icons";
import { useGrantsListAssistant } from "./useGrantsListAssistant";
import assistant from "../../assets/assistant.png";
import "./SpeechTranslationModal.css";

const AssistantWidgetContent = ({ onCloseWidget }: any) => {
  const { transcript, recording, handleStopRecording, handleStartRecording } =
    useVoiceRecognition(handleFinishRecording);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { text, setText, sendMessage, messages, container } = useGrantsListAssistant();
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
        <Heading fontSize={"md"} mb={3} mt={0} color={"white"}>
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
          w={"calc(100% + 16px)"}
          sx={{
            "&::-webkit-scrollbar": {
              borderRadius: "3px",
              width: "8px",
              backgroundColor: `transparent`,
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: `whiteAlpha.700`,
              borderRadius: "3px",
              border: "none",
            },
          }}
          ref={container}
        >
          {messages.map((message, index) => (
            <Box
              maxWidth={"80%"}
              mr={"8px"}
              width={"fit-content"}
              alignSelf={message.type === "out" ? "start" : "end"}
            >
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
                  fontWeight={"semibold"}
                  lineHeight={"22px"}
                >
                  {message.content}
                </Box>
              )}
            </Box>
          ))}
        </Flex>
      </Flex>
      <Box as={"form"} onSubmit={sendMessage}>
        <InputGroup variant={"filled"} size="md">
          <Input
            placeholder="Введите вопрос.."
            colorScheme={"white"}
            bg={"white"}
            color={"gray.900"}
            _focus={{
              backgroundColor: "whiteAlpha.900",
            }}
            value={text}
            onChange={(e) => setText(e.target.value)}
            borderRadius={"lg"}
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
                  borderRadius={"lg"}
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
                  borderRadius={"lg"}
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
  const ref = useRef(null);
  useOutsideClick({
    handler: () => onClose(),
    ref: ref,
  });

  const [hintOpened, setHintOpened] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      setHintOpened(true);
    }, 5500);
  }, []);
  return (
    <>
      {!isOpen && (
        <Box position="fixed" bottom="12" right="24">
          <Tooltip
            whiteSpace="pre-wrap"
            fontSize="lg"
            placement="top-start"
            borderRadius="xl"
            boxShadow="xl"
            width="260px"
            label={"Привет, я Лёва!\nЗадай мне любой вопрос!"}
            arrowSize={15}
            bg={"brand.300"}
            bgGradient={"linear(to-b, brand.400, brand.300)"}
            p={4}
            isOpen={hintOpened}
            hasArrow
          >
            <Center position={"relative"} w={"220px"} h={"220px"}>
              <Box w={"160px"} h={"160px"} position={"relative"}>
                <Box
                  id="speech"
                  className="btn type2"
                  w={"160px"}
                  h={"160px"}
                  bg={"brand.200"}
                  _hover={{
                    bg: "brand.100",
                    opacity: 0.7,
                    transitionDuration: "all 300ms",
                  }}
                >
                  <Image
                    src={assistant}
                    bg={"transparent"}
                    transitionDuration={"0.2s"}
                    w={40}
                    h={40}
                    borderRadius={"50%"}
                    onClick={onOpen}
                    cursor={"pointer"}
                    boxShadow="xl"
                  ></Image>
                </Box>
                <Box className={"pulse-ring"} w={"160px"} h={"160px"}></Box>
              </Box>
            </Center>
          </Tooltip>
        </Box>
      )}

      {isOpen && (
        <Box
          position="fixed"
          bottom="12"
          right="12"
          height={"560px"}
          w={"320px"}
          bgGradient={"linear(to-b, brand.400, brand.300)"}
          borderRadius={"24"}
          py={3}
          px={4}
          zIndex={1000}
          boxShadow="2xl"
          ref={ref}
        >
          <AssistantWidgetContent onCloseWidget={onClose} />
        </Box>
      )}
    </>
  );
};
