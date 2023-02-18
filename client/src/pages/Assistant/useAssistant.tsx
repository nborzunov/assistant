import React, { useEffect, useReducer, useRef, useState } from "react";
import { Fields, grants } from "../../assets/mockData";
import ky from "ky";
import { Box, Button, Flex, Icon, Text } from "@chakra-ui/react";
import { Icons } from "../../assets/icons";
import { useParams } from "react-router-dom";

export const useAssistant = () => {
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
      setTimeout(() => {}, 150);
      return [...messages, newMessage];
    },
    []
  );

  const [text, setText] = useState("");
  const [questionOrder, setQuestionOrder] = useState(0);

  const onsiteValidate = (value: string): string | null => {
    const field = grant?.fields[questionOrder];
    if (!field) return null;
    if (!field.type) return null;

    switch (field.type) {
      case Fields.NameLong:
        const words = value.split(" ");

        if (words.length !== 3) {
          return "Введите имя, фамилию и отчество через пробел";
        }
        if (
          words.some(
            (word) =>
              word.length <= 2 || word.length > 15 || !word.match(/^[а-яА-Я]+$/)
          )
        ) {
          return "Имя, фамилия и отчество должны состоять из букв и быть длиной от 3 до 15 символов";
        }
        return null;
      case Fields.City:
        if (!value) {
          return "Введите название города";
        }
        if (
          value.length < 2 ||
          value.length > 30 ||
          !value.match(/^[a-zA-Zа-яА-ЯёЁ0-9\s,'-]*$/)
        ) {
          return "Название города должно быть длиной от 2 до 30 символов и состоять из букв, цифр и знаков препинания (, - ') без специальных символов";
        }
        return null;
      case Fields.Country:
        if (!value) {
          return "Введите название страны";
        }
        if (
          value.length < 2 ||
          value.length > 30 ||
          !value.match(/^[a-zA-Zа-яА-ЯёЁ0-9\s,'-]*$/)
        ) {
          return "Название страны должно быть длиной от 2 до 30 символов и состоять из букв, цифр и знаков препинания (, - ') без специальных символов";
        }
        return null;
      case Fields.University:
        if (!value) {
          return "Введите название университета";
        }
        if (
          value.length < 2 ||
          value.length > 100 ||
          !value.match(/^[a-zA-Zа-яА-ЯёЁ0-9\s,'-]*$/)
        ) {
          return "Название университета должно быть длиной от 2 до 100 символов и состоять из букв, цифр и знаков препинания (, - ') без специальных символов";
        }
        return null;
      case Fields.Faculty:
        if (!value) {
          return "Введите название факультета";
        }
        if (
          value.length < 2 ||
          value.length > 100 ||
          !value.match(/^[a-zA-Zа-яА-ЯёЁ0-9\s,'-]*$/)
        ) {
          return "Название факультета должно быть длиной от 2 до 100 символов и состоять из букв, цифр и знаков препинания (, - ') без специальных символов";
        }
        return null;
      case Fields.Year:
        const year = parseInt(value, 10);

        if (isNaN(year) || year < 1900 || year > new Date().getFullYear()) {
          return "Введите год в формате yyyy (например, 1990)";
        }

        return null;
    }
    return null;
  };
  const sendMessage = (e: any, transcript: string = "") => {
    e?.preventDefault();

    transcript = transcript || text;
    ky.post("http://127.0.0.1:8000/translate/", {
      json: transcript,
    })
      .json()
      .then((data: any) => {
        const error = onsiteValidate(transcript);
        const formField = grant?.fields[questionOrder];

        if (!formField) {
          return;
        }
        let result = {
          field: formField.field,
          content: transcript,
          type: "in" as const,
          error,
        };

        updateMessages(result);
        setText("");

        if (!error) {
          updateMessages({
            content: (
              <>
                <Text>{formField.resultMessage}</Text>
                <Text fontWeight={"normal"}>{transcript}</Text>
              </>
            ),
            type: "out",
          });
          updateMessages({
            content: (
              <>
                <Button
                  onClick={() => {
                    setQuestionOrder(questionOrder);
                    inputRef?.current?.focus();
                    setText(transcript);
                  }}
                  variant={"ghost"}
                  color={"white"}
                  _hover={{ color: "whiteAlpha.700" }}
                  pb={"12px"}
                  size={"sm"}
                  fontWeight={"normal"}
                >
                  Изменить
                </Button>
              </>
            ),
            noOutline: true,
            type: "out",
          });
          setQuestionOrder((prev) => prev + 1);
        } else {
          updateMessages({
            content: (
              <>
                <Flex>
                  <Icon
                    as={Icons.Error}
                    color={"red.500"}
                    fontSize={"xl"}
                    mt={1}
                    mr={2}
                  />
                  <Box>
                    <Text fontWeight={"bold"}>Некорректный ввод</Text>
                    <Text>{error}</Text>
                  </Box>
                </Flex>
              </>
            ),
            type: "out",
          });
        }
      });
  };

  const { grantId } = useParams();
  const grant = grants.find((grant) => grant.id === Number(grantId));

  useEffect(() => {
    updateMessages({
      content: (
        <>
          <div>Добрый день! </div>
          <div>Я бот-помощник. Я помогу вам заполнить заявку на грант</div>
        </>
      ),
      type: "out",
    });
  }, []);
  useEffect(() => {
    const field = grant?.fields[questionOrder];

    if (!field) {
      return;
    }
    setTimeout(() => {
      if (field.noQuestions) {
        updateMessages({
          content: `Давайте заполним ${field.name}`,
          type: "out",
        });
        setQuestionOrder((prev) => prev + 1);
      } else {
        updateMessages({
          content: (
            <>
              <div>{`Введите ${field.name}:`}</div>
              <Text fontSize="sm">
                Пример: <Text as={"span"}>{field.example}</Text>
              </Text>
            </>
          ),
          type: "out",
        });
      }
    }, 250);
  }, [questionOrder]);

  const inputRef = useRef<HTMLInputElement>(null);
  return { text, setText, inputRef, sendMessage, messages, grant };
};
