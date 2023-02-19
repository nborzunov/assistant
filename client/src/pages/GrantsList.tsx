import {
  Box,
  Button,
  Center,
  Flex,
  Grid,
  GridItem,
  Heading,
  IconButton,
  Img,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import React from "react";
import { Link } from "react-router-dom";
import { grants } from "../assets/mockData";
import { AssistantWidget } from "./Assistant/AssistantWidget";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@chakra-ui/icons";

export const GrantsList = () => {
  return (
    <Center w={"100vw"}>
      <AssistantWidget />
      <Box p={[0, 5]}>
        <Heading>Гранты</Heading>
        <Grid py={6} templateColumns={"repeat(5, 1fr)"} gap={5}>
          {grants.slice(0, 10).map((grant) => (
            <GridItem key={grant.id}>
              <Box
                w="xs"
                rounded={"sm"}
                overflow={"hidden"}
                bg="white"
                boxShadow={"xl"}
                display={"flex"}
                flexDir={"column"}
                justifyContent={"space-between"}
                borderRadius={"2xl"}
              >
                <Box>
                  <Box h={"200px"} borderBottom={"1px"} borderColor="black">
                    <Img
                      src={grant.image}
                      roundedTop={"sm"}
                      objectFit="cover"
                      h="full"
                      w="full"
                      alt={"Blog Image"}
                    />
                  </Box>
                  <Box p={4}>
                    <Flex gap={2} mb={2}>
                      {grant.additionalInfo.map((info) => (
                        <Box
                          key={info}
                          bg="blue.400"
                          display={"block"}
                          px={2}
                          py={1}
                          color="white"
                          h={"26px"}
                          fontSize={"xs"}
                          fontWeight="medium"
                          textOverflow={"ellipsis"}
                          overflow={"hidden"}
                          whiteSpace={"nowrap"}
                        >
                          {info}
                        </Box>
                      ))}
                    </Flex>
                    <Heading color={"black"} fontSize={"xl"} noOfLines={2}>
                      {grant.title}
                    </Heading>
                    <Text color={"gray.500"} pt={2} noOfLines={3} h={"104px"}>
                      {grant.description}
                    </Text>
                  </Box>
                </Box>

                <Button
                  colorScheme={"blue"}
                  mb={4}
                  mx={4}
                  as={Link}
                  to={`/grants/${grant.id}`}
                >
                  Подробнее
                </Button>
              </Box>
            </GridItem>
          ))}
        </Grid>
        <Flex width={"100%"} justifyContent={"center"}>
          <Flex
            justifyContent="space-between"
            m={4}
            alignItems="center"
            width={"700px"}
          >
            <Flex>
              <IconButton
                bg={"gray.50"}
                color={"gray.900"}
                aria-label="Первая Страница"
                icon={<ArrowLeftIcon h={3} w={3} />}
                mr={4}
              />

              <IconButton
                bg={"gray.50"}
                color={"gray.900"}
                aria-label="Предыдущая Страница"
                icon={<ChevronLeftIcon h={6} w={6} />}
              />
            </Flex>

            <Flex alignItems="center">
              <Text flexShrink="0" mr={8}>
                Страница{" "}
                <Text fontWeight="bold" as="span">
                  {1}
                </Text>{" "}
                из{" "}
                <Text fontWeight="bold" as="span">
                  {2}
                </Text>
              </Text>

              <Select w={36} value={1}>
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <option key={pageSize} value={pageSize}>
                    Показать {pageSize}
                  </option>
                ))}
              </Select>
            </Flex>

            <Flex>
              <IconButton
                bg={"gray.50"}
                color={"gray.900"}
                aria-label="Следующая Страница"
                icon={<ChevronRightIcon h={6} w={6} />}
              />

              <IconButton
                bg={"gray.50"}
                color={"gray.900"}
                aria-label="Последняя Страница"
                icon={<ArrowRightIcon h={3} w={3} />}
                ml={4}
              />
            </Flex>
          </Flex>
        </Flex>
      </Box>
    </Center>
  );
};
