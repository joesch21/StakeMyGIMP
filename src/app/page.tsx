"use client";

import { NFT_CONTRACTS } from "@/consts/nft_contracts";
import { Link } from "@chakra-ui/next-js";
import { Box, Flex, Heading, Text, Spinner } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import styles from "../styles/Navbar.module.css"; // Import the CSS module for styling
import Head from "next/head"; // Import Head for metadata management

export default function Home() {
  const [loading, setLoading] = useState(true);

  // Simulate loading effect with engaging animation
  useEffect(() => {
    const loadImages = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(loadImages);
  }, []);

  if (loading) {
    return (
      <Box 
        className="loading-overlay" 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        height="100vh"
      >
        <Spinner 
          size="xl" 
          className="spinner" 
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

  // Map button styles based on title keywords with a flexible type definition
  const buttonStyleMap: Record<string, string> = {
    "99 Billion": "gold",
    "Gimp Collection": "purple",
  };

  return (
    <>
      <Head>
        <title>The Gimp Collection - Discover & Win</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Flex 
        justifyContent="center" 
        alignItems="center" 
        minHeight="100vh" 
        bgGradient="linear(to-r, #000428, #004e92)"
        padding="20px"
      >
        <Box mt="24px" m="auto" textAlign="center">
          <Flex direction="column" gap="4" alignItems="center">

            <Heading 
              mt="80px" 
              mb="60px" 
              color="white" 
              fontSize="5xl" 
              textShadow="2px 2px #ff0080"
              textAlign="center"
            >
              Buy an NFT with BNB or GCC
              <br />
              for a <br />
              Chance to Win <Text as="span" color="yellow.400">30,000 GCC</Text>
            </Heading>

            <Flex
              direction="row"
              wrap="wrap"
              gap="40px"
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
                    w={["100%", "300px", "450px"]}
                    h={["100%", "300px", "450px"]}
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
                        style={{ padding: "16px 30px", fontSize: "1.2rem" }}
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
