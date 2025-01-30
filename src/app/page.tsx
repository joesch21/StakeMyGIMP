"use client";

import { NFT_CONTRACTS } from "@/consts/nft_contracts";
import { Link } from "@chakra-ui/next-js";
import { Box, Flex, Heading, Text, Spinner, Button } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import styles from "../styles/Navbar.module.css";
import Head from "next/head";

export default function Home() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadImages = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(loadImages);
  }, []);

  if (loading) {
    return (
      <Box 
        className={styles.loadingOverlay}
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        height="100vh"
      >
        <Spinner 
          size="xl" 
          className={styles.spinner} 
          thickness="6px" 
          speed="0.65s" 
          color="blue.500" 
        />
        <Text mt={4} fontSize="xl" color="white">
          Loading your NFT adventure...
        </Text>
      </Box>
    );
  }

  const buttonStyleMap: Record<string, string> = {
    "99 Billion": "gold",
    "Gimp Collection": "purple",
  };

  return (
    <>
      <Head>
        <title>The Gimp Collection - Digital ART Reinvented</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Flex 
        justifyContent="center" 
        alignItems="center" 
        minHeight="100vh" 
        bgGradient="linear(to-r, #000428, #004e92)"
        padding="20px"
      >
        <Box mt="24px" m="auto" textAlign="center" maxWidth="600px">
          <Flex direction="column" gap="4" alignItems="center">

            <Heading 
              mt="40px" 
              mb="40px" 
              color="white" 
              fontSize="3xl" 
              textShadow="2px 2px #ff0080"
              textAlign="center"
            >
              Ock's Amazing Gimp Gallery
            </Heading>
            <Text fontSize="lg" color="yellow.400" textAlign="center">
              245 Unique Handcrafted Art Pieces
            </Text>
            <Text fontSize="lg" color="white" textAlign="center">
              From the Largest Generative Art Collection ever created! Earn staking rewards for your NFT!
            </Text>

            <Button 
              as="a" 
              href="https://www.gcc-bsc.online/main.html" 
              target="_blank" 
              rel="noopener noreferrer"
              colorScheme="teal"
              size="md"
              mb="20px"
            >
              Visit Gold Condor Capital - GCC!
            </Button>

            <Flex
              direction="row"
              wrap="wrap"
              gap="20px"
              justifyContent="center"
              alignItems="center"
            >
              {NFT_CONTRACTS.map((item, index) => {
                const buttonStyle =
                  item.title && buttonStyleMap[item.title]
                    ? buttonStyleMap[item.title]
                    : index % 2 === 0
                    ? "green"
                    : "red";

                return (
                  <Link
                    _hover={{ textDecoration: "none" }}
                    w={"300px"}
                    h={"300px"}
                    key={item.address}
                    href={`/collection/${item.chain.id.toString()}/${item.address}`}
                  >
                    <div 
                      className={styles.frameContainer} 
                      style={{ 
                        border: "4px solid #FFD700", 
                        borderRadius: "15px", 
                        padding: "10px" 
                      }}
                    >
                      {item.thumbnailUrl ? (
                        <img
                          src={item.thumbnailUrl}
                          alt={`Thumbnail for ${item.title ?? "NFT Collection"}`}
                          className={styles.nftThumbnail}
                          style={{ borderRadius: "10px", boxShadow: "0 0 20px rgba(255, 215, 0, 0.8)" }}
                          onError={() =>
                            console.error(`Error loading image for: ${item.title}`)
                          }
                        />
                      ) : (
                        <div className={styles.placeholderImage}>
                          <Text>No Image Available</Text>
                        </div>
                      )}
                      <Text fontSize="large" mt="10px" className={styles.nftTitle}>
                        {item.title || "Untitled Collection"}
                      </Text>
                    </div>

                    <div className={styles.buttonFrame}>
                      <button
                        className={`${styles.jazzedButton} ${styles[buttonStyle]}`}
                        style={{ padding: "12px 24px", fontSize: "1rem" }}
                      >
                        {`Explore ${item.title ?? "NFT Collection"}`}
                      </button>
                    </div>
                  </Link>
                );
              })}
            </Flex>
          </Flex>
        </Box>
      </Flex>
    </>
  );
}
