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
import dynamic from "next/dynamic";
import { useStakingInfo } from "@/hooks/useStaking";
import { StakeButton } from "@/components/StakeButton";
import { prepareContractCall } from "thirdweb";
import { STAKING_CONTRACT } from "@/consts/nft_contracts";
import { useSendTransaction } from "thirdweb/react";

const CancelListingButton = dynamic(() => import("@/components/token-page/CancelListingButton"), { ssr: false });
const BuyFromListingButton = dynamic(() => import("@/components/token-page/BuyFromListingButton"), { ssr: false });

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
  const { stakeInfo, refetch: refetchStaking } = useStakingInfo();
  const [isClaiming, setIsClaiming] = useState(false);
  const [isUnstaking, setIsUnstaking] = useState(false);
  const { mutate: sendTransaction } = useSendTransaction();

  const handleClaimRewards = async () => {
    if (!account) return;

    setIsClaiming(true);
    try {
      const claimTx = prepareContractCall({
        contract: STAKING_CONTRACT,
        method: "claimRewards",
        params: [[BigInt(nft.id)]], // ✅ Ensure correct format
      });

      const txResult = await sendTransaction(claimTx);
      await txResult.wait(); // ✅ Wait for confirmation before updating UI

      refetchStakedInfo(); // ✅ Refresh staking info
      refetchOwnedNFTs(); // ✅ Refresh NFT ownership info
    } catch (error) {
      console.error("Claiming Rewards Failed:", error);
    } finally {
      setIsClaiming(false);
    }
  };

  const handleUnstake = async () => {
    if (!account) return;

    setIsUnstaking(true);
    try {
      const unstakeTx = prepareContractCall({
        contract: STAKING_CONTRACT,
        method: "withdraw",
        params: [[BigInt(nft.id)]], // ✅ Ensure correct format
      });

      const txResult = await sendTransaction(unstakeTx);
      await txResult.wait(); // ✅ Wait for confirmation before updating UI

      refetchStakedInfo(); // ✅ Refresh staking info
      refetchOwnedNFTs(); // ✅ Ensure the NFT appears in the owned list again
    } catch (error) {
      console.error("Unstaking Failed:", error);
    } finally {
      setIsUnstaking(false);
    }
  };

  useEffect(() => {
    if (nft.metadata) {
      console.log("Using existing metadata:", nft.metadata);
      return;
    }
  
    if (!nft.tokenURI || typeof nft.tokenURI !== "string") {
      console.warn("Invalid tokenURI:", nft.tokenURI);
      return;
    }
  
    const fetchMetadata = async () => {
      try {
        setIsLoadingMetadata(true);
        console.log("Fetching metadata from:", nft.tokenURI);
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
          <Text fontSize="sm">
            Earned Rewards: <strong>{(Number(reward) / 1e18).toFixed(4)} TOKEN</strong>
          </Text>
          <Button colorScheme="yellow" size="sm" mt="2" onClick={handleClaimRewards} isLoading={isClaiming}>
            Claim Rewards
          </Button>
          <Button colorScheme="red" size="sm" mt="2" onClick={handleUnstake} isLoading={isUnstaking}>
            Unstake NFT
          </Button>
        </Box>
      )}
    </Flex>
  );
}

export default UnifiedNFTCard;
