"use client";

import { useState } from "react";
import { Box, Button, Flex, Heading } from "@chakra-ui/react";

export default function ProfileSection() {
  const [walletVisible, setWalletVisible] = useState(false);

  return (
    <Box p={5}>
      <Heading mb={3}>Profile</Heading>
      <Button onClick={() => setWalletVisible(!walletVisible)} colorScheme="blue">
        {walletVisible ? "Hide Staking Wallet" : "Open Staking Wallet"}
      </Button>

      {/* ✅ Only one iframe */}
      {walletVisible && (
        <Box mt={5} border="1px solid gray" borderRadius="10px" overflow="hidden">
          <iframe
            src="https://gcc-staking.vercel.app/"
            scrolling="yes" 
            style={{
              width: "100%",
              height: "400px",
              border: "none",
              display: "block",
            }}
          />
        </Box>
      )}
    </Box>
  );
}
