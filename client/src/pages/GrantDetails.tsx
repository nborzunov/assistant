import {
  Box,
  Container,
  Stack,
  Text,
  Image,
  Flex,
  VStack,
  Button,
  Heading,
  SimpleGrid,
  StackDivider,
  useColorModeValue,
  List,
  ListItem,
  Center,
} from "@chakra-ui/react";
import { grants } from "../assets/mockData";
import { Link, useParams } from "react-router-dom";
import { AssistantWidget } from "./Assistant/AssistantWidget";
import React from "react";
import mockImage from "../assets/mockImage.jpg";

export const GrantDetails = () => {
  const { grantId } = useParams();
  const grant = grants.find((grant) => grant.id === Number(grantId));
  if (!grant) return <div>Grant not found</div>;
  return (
    <Center w={"100vw"} h={"100vh"}>
      <AssistantWidget />
      <Container maxW={"7xl"}>
        <SimpleGrid
          columns={{ base: 1, lg: 2 }}
          spacing={{ base: 8, md: 10 }}
          py={{ base: 18, md: 24 }}
        >
          <Flex>
            <Image
              rounded={"md"}
              alt={"product image"}
              src={mockImage}
              fit={"cover"}
              align={"center"}
              w={"100%"}
              h="100%"
            />
          </Flex>
          <Stack spacing={{ base: 6, md: 10 }}>
            <Box as={"header"}>
              <Heading
                lineHeight={1.1}
                fontWeight={600}
                fontSize={{ base: "2xl", sm: "4xl", lg: "5xl" }}
              >
                {grant.title}
              </Heading>
            </Box>

            <Stack
              spacing={{ base: 4, sm: 6 }}
              direction={"column"}
              divider={
                <StackDivider
                  borderColor={useColorModeValue("gray.200", "gray.600")}
                />
              }
            >
              <Stack spacing={{ base: 4, sm: 6 }}>
                <Text
                  color={useColorModeValue("gray.500", "gray.400")}
                  fontSize={"2xl"}
                  fontWeight={"300"}
                >
                  {grant.date}
                </Text>
                <Text fontSize={"lg"}>{grant.location}</Text>
              </Stack>
              <Box>
                <Text
                  fontSize={{ base: "16px", lg: "18px" }}
                  color={"blue.500"}
                  fontWeight={"500"}
                  textTransform={"uppercase"}
                  mb={"4"}
                >
                  ????????????
                </Text>

                <Stack>
                  <Flex>
                    <Box width={"50%"}>
                      <Text fontWeight={"semibold"}>??????????????????????:</Text>
                    </Box>
                    <Box width={"50%"}>
                      <Text>{grant.organizer}</Text>
                    </Box>
                  </Flex>
                  <Flex>
                    <Box width={"50%"}>
                      <Text fontWeight={"semibold"}>??????????????:</Text>
                    </Box>
                    <Box width={"50%"}>
                      <Text>{grant.age}</Text>
                    </Box>
                  </Flex>
                  <Flex>
                    <Box width={"50%"}>
                      <Text fontWeight={"semibold"}>
                        ?????????????????????? ?????? ??????????????????????:
                      </Text>
                    </Box>
                    <Box width={"50%"}>
                      <Text>{grant.foreigners}</Text>
                    </Box>
                  </Flex>
                </Stack>
              </Box>
            </Stack>

            <Button
              rounded={"none"}
              w={"full"}
              mt={8}
              size={"lg"}
              py={"7"}
              colorScheme={"brand"}
              textTransform={"uppercase"}
              _hover={{
                backgroundColor: "brand.600",
                boxShadow: "lg",
                position: "static",
              }}
              as={Link}
              to={`fill`}
              position={"static"}
              borderRadius={"1em"}
            >
              ???????????? ????????????
            </Button>
          </Stack>
        </SimpleGrid>
      </Container>
    </Center>
  );
};
