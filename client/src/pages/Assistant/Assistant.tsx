import React, { useEffect, useState } from "react";
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
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import { Icons } from "../../assets/icons";
import { useAssistant } from "./useAssistant";
import { SpeechTranslationModal } from "./SpeechTranslationModal";
import assistant from "../../assets/assistant.png";
import { CompleteFormModal } from "./CompleteFormModal";

export const Assistant = () => {
  const { transcript, recording, handleStopRecording, handleStartRecording } =
    useVoiceRecognition(handleFinishRecording);

  const {
    text,
    setText,
    inputRef,
    sendMessage,
    messages,
    grant,
    completed,
    form,
    container
  } = useAssistant();

  const {
    isOpen: isOpenSpeechTranslation,
    onOpen: onOpenSpeechTranslation,
    onClose: onCloseSpeechTranslation,
  } = useDisclosure();
  const {
    isOpen: isOpenCompleteForm,
    onOpen: onOpenCompleteForm,
    onClose: onCloseCompleteForm,
  } = useDisclosure();

  const startRecording = () => {
    setHintOpened(false);

    onOpenSpeechTranslation();
    handleStartRecording();
  };

  function handleFinishRecording(transcript: string) {
    setText(transcript);
    sendMessage(null, transcript);
    onCloseSpeechTranslation();
    setTimeout(() => {
      setMessage("Задай мне любой вопрос!");
      setHintOpened(true);
    }, 1000);
  }

  const [hintOpened, setHintOpened] = useState(false);
  const [message, setMessage] = useState("");
  useEffect(() => {
    setTimeout(() => {
      setMessage("Привет, я Лёва!");
      setHintOpened(true);
    }, 1500);
    setTimeout(() => {
      setHintOpened(false);
    }, 5000);
    setTimeout(() => {
      setMessage("Задай мне любой вопрос!");
      setHintOpened(true);
    }, 5500);
  }, []);

  return (
    <Center
      bgGradient={"linear(to-b, brand.400, brand.300)"}
      width={"100vw"}
      minH={"100vh"}
    >
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
          left={-72}
          bottom={0}
          w={"240px"}
          h={"240px"}
          p={4}
          borderRadius={"50%"}
        >
          <Tooltip
            whiteSpace="pre-wrap"
            fontSize="lg"
            placement="top-start"
            borderRadius="xl"
            boxShadow="xl"
            width="200px"
            label={message}
            arrowSize={15}
            bg={"white"}
            color={"blue.600"}
            p={4}
            isOpen={hintOpened}
            hasArrow
            zIndex={1}
          >
            <Image w={"240px"} src={assistant}></Image>
          </Tooltip>
        </Box>
        <Flex flexDir={"column"}>
          <Box>
            <Heading
              fontSize={"2xl"}
              fontWeight="semibold"
              color={"white"}
              mb={6}
            >
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
          {!completed ? (
            <Fade in={!completed}>
              <InputGroup variant={"filled"} size="lg">
                <Input
                  placeholder="Введите ответ или задайте вопрос.."
                  colorScheme={"white"}
                  bg={"white"}
                  color={"gray.900"}
                  _focus={{
                    backgroundColor: "whiteAlpha.900",
                  }}
                  borderRadius={"lg"}
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
            </Fade>
          ) : (
            <Fade in={completed}>
              <Button
                width={"100%"}
                color={"white"}
                colorScheme={"brand"}
                borderRadius={"lg"}
                size={"lg"}
                onClick={() => {
                  setHintOpened(false);
                  onOpenCompleteForm();
                }}
              >
                Отправить
              </Button>
            </Fade>
          )}
        </Box>
      </Flex>

      <SpeechTranslationModal
        isOpen={isOpenSpeechTranslation}
        onClose={onCloseSpeechTranslation}
        transcript={transcript}
        recording={recording}
        handleStopRecording={handleStopRecording}
      />

      <CompleteFormModal
        isOpen={isOpenCompleteForm}
        onClose={onCloseCompleteForm}
        fields={grant?.fields}
        form={form}
      />
    </Center>
  );
};
