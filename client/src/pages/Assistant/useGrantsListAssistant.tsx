import React, { useEffect, useMemo, useReducer, useRef, useState } from "react";

import ky from "ky";
import { Box, Button, Flex, Icon, Text } from "@chakra-ui/react";
import { Icons } from "../../assets/icons";

const InfoMessage = ({ icon, color, heading, text }: any) => {
  return (
    <Flex flexDir={"column"}>
      <Flex>
        {icon && <Icon as={icon} color={color} fontSize={"lg"} mt={1} mr={2} />}

        <Text fontWeight={"bold"} fontSize="sm" pb={text ? 1 : 0}>
          {heading}
        </Text>
      </Flex>

      {text && <Text pb={1}>{text}</Text>}
    </Flex>
  );
};

const GreatMessage = () => {
  return (
    <Box fontSize="sm">
      <div>Добрый день!</div>
      <div>Я бот-помощник. Чем я могу вам помочь?</div>
    </Box>
  );
};
export const useGrantsListAssistant = () => {
  const [messages, updateMessages] = useReducer(
    (
      messages: {
        content: any;
        type: "in" | "out";
        error?: string | null;
        noOutline?: boolean;
      }[],
      newMessage: {
        content: any;
        type: "in" | "out";
        error?: string | null;
        noOutline?: boolean;
      }
    ) => {
      return [...messages, newMessage];
    },
    []
  );

  const [text, setText] = useState("");
  const container = useRef(null);

  const sendMessage = (e: any, transcript: string = "") => {
    e?.preventDefault();

    transcript = transcript || text;
    ky.post("http://127.0.0.1:8000/translate/", {
      json: {
          text: transcript,
          isQuestion: true
      }
    })
      .json()
      .then((data: any) => {
        updateMessages({
          content: transcript,
          type: "in" as const,
        });
        setText("");

        setTimeout(() => {
          if (!data.isQuestion || !data.answerText) {
            updateMessages({
              content: (
                <InfoMessage
                  heading={
                    data.answerHeading ||
                    "Попробуйте сформулировать вопрос иначе"
                  }
                />
              ),
              type: "out" as const,
            });
              updateMessages({
                  content: (
                      <>
                          <Button
                              onClick={() => {
                              //     TODO
                              }}
                              variant={"ghost"}
                              color={"white"}
                              _hover={{ color: "whiteAlpha.700" }}
                              pb={"12px"}
                              size={"sm"}
                              fontWeight={"normal"}
                          >
                              Задать вопрос в поддержку
                          </Button>
                      </>
                  ),
                  noOutline: true,
                  type: "out" as const,
              });
              setTimeout(() => {
                  container.current.scrollTop = container.current.scrollHeight
              })
            return;
          }
          updateMessages({
            content: (
              <>
                <InfoMessage
                  heading={data.answerHeading}
                  text={data.answerText[0]}
                />
              </>
            ),
            type: "out" as const,
          });
            setTimeout(() => {
                container.current.scrollTop = container.current.scrollHeight
            })
        }, 300);
        return;
      });
  };

  useEffect(() => {
    updateMessages({
      content: <GreatMessage />,
      type: "out",
    });
  }, []);

  const inputRef = useRef<HTMLInputElement>(null);
  return {
    text,
    setText,
    inputRef,
    sendMessage,
    messages,
      container
  };
};
