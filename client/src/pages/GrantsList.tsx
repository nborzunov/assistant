import {
  Box,
  Button,
  Center,
  Flex,
  Grid,
  GridItem,
  Heading,
  Img,
  Text,
} from "@chakra-ui/react";
import React from "react";
import { Link } from "react-router-dom";
import { grants } from "../assets/mockData";
import { AssistantWidget } from "./Assistant/AssistantWidget";

export const GrantsList = () => {
  return (
    <Center w={"100vw"}>
      <AssistantWidget />
      <Box p={[0, 5]}>
        <Heading>Гранты</Heading>
        <Grid py={6} templateColumns={"repeat(5, 1fr)"} gap={5}>
          {grants.map((grant) => (
            <GridItem key={grant.id}>
              <Box
                w="xs"
                rounded={"sm"}
                height={"100%"}
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
                    <Flex gap={2} flexWrap={"wrap"} mb={2} h={"60px"}>
                      {grant.additionalInfo.map((info) => (
                        <Box
                          key={info}
                          bg="blue.400"
                          display={"block"}
                          px={2}
                          py={1}
                          color="white"
                          h={"26px"}
                        >
                          <Text
                            fontSize={"xs"}
                            fontWeight="medium"
                            whiteSpace={"nowrap"}
                          >
                            {info}
                          </Text>
                        </Box>
                      ))}
                    </Flex>
                    <Heading
                      color={"black"}
                      fontSize={"xl"}
                      textAlign={"center"}
                      h={"72px"}
                    >
                      {grant.title}
                    </Heading>
                    <Text color={"gray.500"} h={"96px"} mt={2}>
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
      </Box>
    </Center>
  );
};
