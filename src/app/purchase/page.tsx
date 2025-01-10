"use client";

import { Box, Text, Link, Button } from "@chakra-ui/react";
import React from "react"; // Ensure React is imported

// Define the `PurchaseGCC` component with React.FC type correctly
const PurchaseGCC: React.FC = () => {
  // Function to add GCC Token to MetaMask
  const addGCCToMetaMask = async () => {
    try {
      // Use type assertion to access ethereum on the window object
      const ethereum = (window as any).ethereum;

      if (ethereum) {
        await ethereum.request({
          method: "wallet_watchAsset",
          params: {
            type: "ERC20",
            options: {
              address: "0x092ac429b9c3450c9909433eb0662c3b7c13cf9a", // GCC Token address
              symbol: "GCC", // Token symbol
              decimals: 18, // Token decimals
              image: "https://storage.top100token.com/images/fe7c179d-bfa8-4d49-a460-ca87ca248167.webp", // Token image URL
            },
          },
        });
        alert("GCC Token has been added to MetaMask!");
      } else {
        alert("MetaMask is not installed. Please install MetaMask and try again.");
      }
    } catch (error: any) {
        console.error(`Failed to add GCC token to MetaMask: ${error?.message || String(error)}`);
      }
      
  };

  return (
    <Box
      padding="20px"
      bgGradient="linear(to-r, #7928CA, #FF0080)"
      minHeight="100vh"
      display="flex"
      flexDirection="column"
      alignItems="center"
      color="#ffffff"
    >
      {/* Banner Heading */}
      <Box
        borderRadius="12px"
        padding="20px"
        boxShadow="lg"
        bg="whiteAlpha.200"
        mb="20px"
        textAlign="center"
      >
        <Text fontSize="3xl" fontWeight="bold">
          GCC Man! You need that Shit - If you want You to Buy an NFT!
        </Text>
      </Box>

      {/* Explanation Text */}
      <Box
        borderRadius="12px"
        padding="15px"
        boxShadow="md"
        bg="whiteAlpha.300"
        textAlign="center"
        maxWidth="90vw"
        mb="20px"
      >
        <Text fontSize="lg" mb="10px">
          To buy GCC tokens, follow the simple steps below:
        </Text>
        <Text fontSize="md">1. Open your wallet app (e.g., MetaMask, Trust Wallet).</Text>
        <Text fontSize="md">2. Make sure your wallet is connected to the Binance Smart Chain.</Text>
        <Text fontSize="md">3. Use the link below to go to PancakeSwap.</Text>
        <Text fontSize="md" mb="10px">
          4. Swap your BNB tokens for GCC tokens.
        </Text>
      </Box>

      {/* Purchase Button */}
      <Box
        borderRadius="12px"
        padding="10px"
        boxShadow="lg"
        bg="whiteAlpha.400"
        textAlign="center"
      >
        <Link
          href="https://pancakeswap.finance/swap?outputCurrency=0x092ac429b9c3450c9909433eb0662c3b7c13cf9a"
          isExternal
        >
          <Button
            size="lg"
            colorScheme="teal"
            fontWeight="bold"
            bg="yellow.400"
            color="black"
            _hover={{ bg: "yellow.500" }}
          >
            Buy GCC Tokens Now!
          </Button>
        </Link>
      </Box>

      {/* Add GCC to MetaMask Button */}
      <Box
        borderRadius="12px"
        padding="10px"
        boxShadow="lg"
        bg="whiteAlpha.400"
        textAlign="center"
        mb="30px"
      >
        <Button
          size="lg"
          colorScheme="teal"
          fontWeight="bold"
          bg="yellow.300"
          color="black"
          _hover={{ bg: "yellow.400" }}
          onClick={addGCCToMetaMask}
        >
          Add GCC Token to MetaMask
        </Button>
      </Box>

      {/* Mobile Optimization Explanation */}
      <Box
        borderRadius="12px"
        padding="15px"
        boxShadow="md"
        bg="whiteAlpha.200"
        textAlign="center"
        maxWidth="90vw"
        mt="30px"
      >
        <Text fontSize="md">
          * For mobile: This button will automatically install the GCC token into MetaMask.
        </Text>
      </Box>
    </Box>
  );
};

// Use `export default` for Next.js compatibility
export default PurchaseGCC;
