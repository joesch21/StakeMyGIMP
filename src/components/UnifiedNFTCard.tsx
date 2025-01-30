"use client";

import { useEffect, useState } from "react";
import { client } from "@/consts/client";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Flex,
  Heading,
  Link,
  Text,
  Button,
} from "@chakra-ui/react";
import { FaExternalLinkAlt } from "react-icons/fa";
import { MediaRenderer, useActiveAccount } from "thirdweb/react";
import { shortenAddress } from "thirdweb/utils";
import { NftAttributes } from "@/components/token-page/NftAttributes";
import { CreateListing } from "@/components/token-page/CreateListing";
import { useMarketplaceContext } from "@/hooks/useMarketplaceContext";
import { useStakingInfo } from "@/hooks/useStakingInfo"; // ✅ Ensure Correct Hook Import
import { StakeButton } from "@/components/StakeButton"; // ✅ Direct Import (no need for dynamic import)
import { prepareContractCall } from "thirdweb";
import { STAKING_CONTRACT } from "@/consts/nft_contracts";
import { useSendTransaction } from "thirdweb/react";

type NFTMetadata = {
  image?: string;
  name?: string;
  description?: string;
  attributes?: Array<{ trait_type: string; value: any }>;
};

type Props = {
  nft: {
    id: string;
    owner: string | null;
    metadata?: NFTMetadata;
    tokenURI: string;
  };
  isStaked: boolean;
  reward: bigint;
  refetchOwnedNFTs: () => void;
  refetchStakedInfo: () => void;
};

function UnifiedNFTCard({ nft, isStaked, reward, refetchOwnedNFTs, refetchStakedInfo }: Props) {
  const { nftContract } = useMarketplaceContext();
  const account = useActiveAccount();
  const [metadata, setMetadata] = useState<NFTMetadata | null>(nft.metadata ?? null);
  const [isLoadingMetadata, setIsLoadingMetadata] = useState(false);
  const { refetch: refetchStaking } = useStakingInfo();
  const [isClaiming, setIsClaiming] = useState(false);
  const { mutate: sendTransaction } = useSendTransaction();

  // ✅ Fetch Metadata If Not Already Provided
  useEffect(() => {
    if (nft.metadata) return;
    if (!nft.tokenURI || typeof nft.tokenURI !== "string") return;

    const fetchMetadata = async () => {
      try {
        setIsLoadingMetadata(true);
        const response = await fetch(nft.tokenURI);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const json = await response.json();
        setMetadata({
          image: json.image || "/images/default.png",
          name: json.name || "Unnamed NFT",
          description: json.description || "No description available",
          attributes: Array.isArray(json.attributes) ? json.attributes : [],
        });
      } catch (error) {
        console.error("Failed to fetch metadata:", error);
        setMetadata({
          image: "/images/default.png",
          name: "Unnamed NFT",
          description: "No description available",
          attributes: [],
        });
      } finally {
        setIsLoadingMetadata(false);
      }
    };

    fetchMetadata();
  }, [nft.tokenURI]);

  

  if (!account) {
    return <Text color="red">Please connect your wallet to view this NFT.</Text>;
  }

  const ownedByYou = nft?.owner?.toLowerCase() === account?.address.toLowerCase();

  return (
    <Flex direction="column" border="1px solid #ddd" p="10px" borderRadius="10px">
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
          <Text>Token ID: {nft?.id}</Text>
          <Text>Current Owner: {nft?.owner ? shortenAddress(nft.owner) : "N/A"}</Text>

          <Flex direction="row" gap="3" mt="10px">
            <Text>Collection:</Text>
            <Link color="gray" href={`/collection/${nftContract.chain.id}/${nftContract.address}`}>
              <FaExternalLinkAlt size={15} />
            </Link>
          </Flex>
        </Box>

        <Accordion allowMultiple mt="10px">
          {metadata?.description && (
            <AccordionItem>
              <AccordionButton>
                <Box flex="1" textAlign="left">Description</Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel pb={4}>
                <Text>{metadata.description}</Text>
              </AccordionPanel>
            </AccordionItem>
          )}

          {metadata?.attributes && metadata.attributes.length > 0 ? (
            <NftAttributes attributes={Object.fromEntries(metadata.attributes.map(attr => [attr.trait_type, attr.value]))} />
          ) : (
            <Text>No attributes available</Text>
          )}
        </Accordion>
      </Box>

      {ownedByYou && (
        <Box mt="10px">
          <StakeButton tokenId={BigInt(nft.id)} refetch={refetchStakedInfo} />
        </Box>
      )}

      {isStaked && (
        <Box mt="10px">
          
        </Box>
      )}
    </Flex>
  );
}

export default UnifiedNFTCard;
