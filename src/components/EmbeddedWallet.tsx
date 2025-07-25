"use client";

import { useState } from "react";
import { Box, Button, Flex, Heading } from "@chakra-ui/react";

export default function ProfileSection() {
  const [walletVisible, setWalletVisible] = useState(false);

  return (
    <Box p={5}>
      <Heading mb={3}>Profile</Heading>

      <Button
        size="sm"
        colorScheme="blue"
        onClick={() => setWalletVisible((v) => !v)}
      >
        {walletVisible ? "Hide" : "Show"} Wallet
      </Button>

      {walletVisible && (
        <Flex mt={4} p={3} borderWidth={1} borderRadius="md">
          Wallet info goes here…
        </Flex>
      )}
    </Box>
  );
}