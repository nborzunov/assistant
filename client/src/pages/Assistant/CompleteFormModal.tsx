import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Text,
  Stack,
  Flex,
  Box,
  Input,
  Icon,
  IconButton,
  Fade,
  useToast,
  Tooltip,
  Link,
  Heading,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { Icons } from "../../assets/icons";
import { useNavigate } from "react-router-dom";

export const CompleteFormModal = ({ isOpen, onClose, fields, form }: any) => {
  const upperCase = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const [completed, setCompleted] = useState(false);

  const navigate = useNavigate();
  const toast = useToast();
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size={!completed ? "3xl" : "2xl"}
      onCloseComplete={() => {
        navigate("/grants");
      }}
    >
      <ModalOverlay />
      <ModalContent
        borderRadius={"1em"}
        margin={"auto"}
        py={4}
        px={8}
        bgColor={"white"}
        transition="background-color 100ms linear"
        h={!completed ? "60%" : "22%"}
      >
        {!completed && (
          <>
            <ModalHeader
              fontWeight={"bold"}
              pb={0}
              fontSize={"2xl"}
              textAlign={"center"}
            >
              Проверьте корректность введённых данных
            </ModalHeader>

            <ModalBody
              as={Flex}
              flexDir={"column"}
              h={"calc(100% - 80px - 6px)"}
            >
              <Box
                h={"560px"}
                overflowY={"auto"}
                w={"calc(100% + 16px)"}
                sx={{
                  "&::-webkit-scrollbar": {
                    borderRadius: "3px",
                    width: "8px",
                    backgroundColor: `transparent`,
                  },
                  "&::-webkit-scrollbar-thumb": {
                    backgroundColor: `#0086FF`,
                    borderRadius: "3px",
                  },
                }}
              >
                {fields.map((field: any, index: any) => (
                  <Box
                    mt={
                      !field.noQuestions && !fields[index - 1]?.noQuestions
                        ? 4
                        : 2
                    }
                    mb={
                      !field.noQuestions && !fields[index - 1]?.noQuestions
                        ? 6
                        : 1
                    }
                    mr={"8px"}
                  >
                    {field.noQuestions ? (
                      <Text fontWeight={"bold"} fontSize={"lg"} m={0}>
                        {upperCase(field.neutralForm || field.name)}
                      </Text>
                    ) : (
                      <Box>
                        <Text fontWeight={"semibold"} fontSize={"md"} mb={2}>
                          {upperCase(field.neutralForm || field.name)}
                        </Text>
                        <Flex alignItems={"center"}>
                          <Input
                            variant="filled"
                            placeholder={upperCase(
                              field.neutralForm || field.name
                            )}
                            value={form[field.field]}
                            px={3}
                          />
                          {/*<IconButton*/}
                          {/*  icon={<Icon as={Icons.Edit} color={"brand.600"} />}*/}
                          {/*  mx={2}*/}
                          {/*  fontSize={"xl"}*/}
                          {/*  aria-label={"edit"}*/}
                          {/*  variant={"ghost"}*/}
                          {/*/>*/}
                        </Flex>
                      </Box>
                    )}
                  </Box>
                ))}
              </Box>
            </ModalBody>

            <ModalFooter>
              <Button
                width={"100%"}
                color={"white"}
                colorScheme={"brand"}
                borderRadius={"lg"}
                size={"lg"}
                onClick={() => {
                  toast({
                    title: "Заявка отправлена",
                    description: "Ваша заявка отправлена на рассмотрение",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                    position: "top-right",
                  });
                  setCompleted(true);
                }}
              >
                Подтвердить
              </Button>
            </ModalFooter>
          </>
        )}

        {completed && (
          <>
            <ModalCloseButton />
            <ModalHeader h={0}></ModalHeader>

            <ModalBody
              textAlign={"center"}
              as={Flex}
              flexDir={"column"}
              alignItems={"center"}
              justifyContent={"center"}
            >
              <Icon
                as={Icons.Check}
                color={"green.500"}
                fontSize={"4xl"}
                bg={"white"}
                borderRadius={"full"}
                borderWidth={"0"}
              />
              <Heading fontWeight={"bold"} pb={0} fontSize={"2xl"} p={4}>
                Ваша заявка принята!
              </Heading>
              <Text
                mb={8}
                textAlign={"center"}
                fontWeight={"semibold"}
                fontSize={"lg"}
                w={"67%"}
                whiteSpace="pre-wrap"
              >
                Статус заявки можно отследить по коду {"\n"}
                <Tooltip label={"Открыть в Telegram"}>
                  <Text as={Link} color={"blue.500"}>
                    #A1CU15J7
                  </Text>
                </Tooltip>
                {"\n"} в нашем телеграм-боте
              </Text>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
