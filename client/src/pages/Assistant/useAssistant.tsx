import React, { useEffect, useMemo, useReducer, useRef, useState } from "react";
import { Fields, grants } from "../../assets/mockData";
import ky from "ky";
import { Box, Button, Flex, Icon, Text } from "@chakra-ui/react";
import { Icons } from "../../assets/icons";
import { useParams } from "react-router-dom";

const InfoMessage = ({ icon, color, heading, text }: any) => {
  return (
    <Flex flexDir={"column"}>
      <Flex>
        {icon && <Icon as={icon} color={color} fontSize={"lg"} mt={1} mr={2} />}

        <Text fontWeight={"bold"} pb={text ? 1 : 0}>
          {heading}
        </Text>
      </Flex>

      {text && (
        <Text pb={1} ml={"26px"}>
          {text}
        </Text>
      )}
    </Flex>
  );
};

const FormQuestion = ({ field }: any) => {
  return (
    <>
      <div>{`Введите ${field.name}:`}</div>
      <Text fontSize="sm" fontWeight="normal">
        Пример: <Text as={"span"}>{field.example}</Text>
      </Text>
    </>
  );
};

const FormResult = ({ resultMessage, text }: any) => {
  return (
    <>
      <Text>{resultMessage}</Text>
      <Text fontWeight={"normal"}>{text}</Text>
    </>
  );
};

const GreatMessage = () => {
  return (
    <>
      <div>Добрый день!</div>
      <div>Я бот-помощник. Я помогу вам заполнить заявку на грант</div>
    </>
  );
};
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

      return [...messages, newMessage];
    },
    []
  );

  const [form, updateForm] = useReducer(
    (form: any, [field, value]: [string, string]) => {
      return { ...form, [field]: value };
    },
    {}
  );

  const [text, setText] = useState("");
  const [questionOrder, setQuestionOrder] = useState(0);

  const [completed, setCompleted] = useState(false);
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
              word.length <= 2 ||
              word.length > 15 ||
              !word.match(/^[А-ЯЁа-яё]+$/)
          )
        ) {
          return "Имя, фамилия и отчество должны состоять из букв и быть длиной от 3 до 15 символов";
        }
        if (words.some((word) => word[0] !== word[0].toUpperCase())) {
          return "Имя, фамилия и отчество должны начинаться с заглавной буквы";
        }
        return null;
      case Fields.City:
        if (!value) {
          return "Введите название города";
        }
        if (
          value.length < 2 ||
          value.length > 30 ||
          !value.match(/^[а-яА-ЯёЁ0-9\s,'-]*$/)
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
          !value.match(/^[а-яА-ЯёЁ0-9\s,'-]*$/)
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

        if (isNaN(year) || year < 1900 || year > 2030) {
          return "Введите год в формате yyyy (например, 1990)";
        }

        return null;
    }
    return null;
  };

  const { grantId } = useParams();
  const grant = useMemo(
    () => grants.find((grant) => grant.id === Number(grantId)),
    [grants, grantId]
  );
  const field = useMemo(
    () => grant?.fields[questionOrder],
    [grant, questionOrder]
  );

  const ask = () => {
    if (!field) {
      return;
    }

    updateMessages({
      content: <FormQuestion field={field} />,
      type: "out",
    });
    setTimeout(() => {
      container.current.scrollTop = container.current.scrollHeight
    })
  };

  const showResult = (resultMessage: string, text: string) => {
    updateMessages({
      content: <FormResult resultMessage={resultMessage} text={text} />,
      type: "out",
    });
    setTimeout(() => {
      container.current.scrollTop = container.current.scrollHeight
    })

    const nextField = grant?.fields[questionOrder + 1];
    if (!nextField) {
      setTimeout(() => {
        updateMessages({
          content:
            'Анкета успешно заполнена! Чтобы отправить ее, нажмите на кнопку "Отправить"',
          type: "out",
        });
        setTimeout(() => {
          container.current.scrollTop = container.current.scrollHeight
        })
        setCompleted(true);
      }, 250);
    }
  };

  const showEditButton = (questionOrder: number, text: string) => {
    updateMessages({
      content: (
        <>
          <Button
            onClick={() => {
              setQuestionOrder(questionOrder);
              inputRef?.current?.focus();
              setText(text);
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
    setTimeout(() => {
      container.current.scrollTop = container.current.scrollHeight
    })
  };

  const sendMessage = (e: any, transcript: string = "") => {
    e?.preventDefault();

    transcript = transcript || text;
    ky.post("http://127.0.0.1:8000/translate/", {
      json: {
        text: transcript,
        isQuestion: false
      },
    })
      .json()
      .then((data: any) => {
        const error = onsiteValidate(transcript);

        if (!field) {
          return;
        }

        updateMessages({
          content: transcript,
          type: "in" as const,
        });
        setTimeout(() => {
          container.current.scrollTop = container.current.scrollHeight
        })
        const updatedResult = transcript;
        setText("");

        if (data.isQuestion) {
          setTimeout(() => {
            if (!data.answerText) {
              updateMessages({
                content: (
                  <InfoMessage
                    icon={Icons.Error}
                    color={"red.500"}
                    heading={data.answerHeading}
                  />
                ),
                type: "out" as const,
                error,
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
                    icon={Icons.Info}
                    color={"blue.500"}
                    heading={data.answerHeading}
                    text={data.answerText[0]}
                  />
                </>
              ),
              type: "out" as const,
              error,
            });
            setTimeout(() => {
              container.current.scrollTop = container.current.scrollHeight
            })
            setTimeout(() => {
              ask();
            }, 150);
            return;
          }, 300);
          return;
        }

        if (!error) {
          setTimeout(() => {
            showResult(field.resultMessage || "", transcript);
            showEditButton(questionOrder, transcript);
            setQuestionOrder((prev) => prev + 1);

            updateForm([field.field, updatedResult]);
          }, 250);
        } else {
          setTimeout(() => {
            updateMessages({
              content: (
                <>
                  <InfoMessage
                    icon={Icons.Error}
                    color={"red.500"}
                    heading={"Некорректный ввод"}
                    text={error}
                  />
                </>
              ),
              type: "out",
            });
            setTimeout(() => {
              container.current.scrollTop = container.current.scrollHeight
            })
          }, 250);
        }
      });
  };

  useEffect(() => {
    updateMessages({
      content: <GreatMessage />,
      type: "out",
    });
  }, []);
  useEffect(() => {
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
        ask();
      }
    }, 250);
  }, [questionOrder]);

  const inputRef = useRef<HTMLInputElement>(null);
  const container = useRef<HTMLDivElement>(null);
  return {
    text,
    setText,
    inputRef,
    container,
    sendMessage,
    messages,
    grant,
    completed,
    form,
  };
};
