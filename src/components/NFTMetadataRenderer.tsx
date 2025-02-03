"use client";

import { useEffect, useState } from "react";
import { client } from "@/consts/client";
import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import { MediaRenderer } from "thirdweb/react";
import { NftAttributes } from "@/components/token-page/NftAttributes";

type NFTMetadata = {
  image?: string;
  name?: string;
  description?: string;
  attributes?: Array<{ trait_type: string; value: any }>;
};

type Props = {
  tokenURI: string;
  metadata?: NFTMetadata;
};

export const NFTMetadataRenderer = ({ tokenURI, metadata: initialMetadata }: Props) => {
  const [metadata, setMetadata] = useState<NFTMetadata | null>(initialMetadata ?? null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (initialMetadata) return;

    const fetchMetadata = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(tokenURI);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const json = await response.json();
        setMetadata({
          image: json.image || "/images/default.png",
          name: json.name || "Unnamed NFT",
          description: json.description || "No description available",
          attributes: Array.isArray(json.attributes) ? json.attributes : [],
        });
      } catch (error) {
        console.error("❌ Failed to fetch metadata:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMetadata();
  }, [tokenURI, initialMetadata]);

  return (
    <Box>
      <Flex direction="column" alignItems="center">
        {metadata?.image ? (
          <MediaRenderer client={client} src={metadata.image} style={{ width: "100%", borderRadius: "10px" }} />
        ) : (
          <Text>No image available</Text>
        )}
      </Flex>

      <Box mt="10px">
        <Heading size="md">{metadata?.name || "Unnamed NFT"}</Heading>
        <Text>Description: {metadata?.description || "No description available"}</Text>

        {metadata?.attributes && metadata.attributes.length > 0 && (
          <NftAttributes attributes={Object.fromEntries(metadata.attributes.map(attr => [attr.trait_type, attr.value]))} />
        )}
      </Box>
    </Box>
  );
};
