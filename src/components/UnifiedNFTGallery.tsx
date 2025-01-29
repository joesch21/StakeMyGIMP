import { Box, SimpleGrid, Text } from "@chakra-ui/react";
import { MarketplaceProvider } from "@/hooks/useMarketplaceContext";
import UnifiedNFTCard from "@/components/UnifiedNFTCard";
import { useStakingInfo } from "@/hooks/useStakingInfo";
import { useEffect, useState } from "react";

type NFT = {
  id: bigint;
  owner: string | null;
  metadata?: {
    image?: string;
    name?: string;
    description?: string;
    tokenURI?: string;
  };
  tokenURI?: string;
  isStaked?: boolean;
};

type UnifiedNFTGalleryProps = {
  ownedNFTs: NFT[];
  refetchOwnedNFTs: () => void;
  refetchStakedInfo: () => void;
  chainId: string;
  contractAddress: string;
};

export const UnifiedNFTGallery = ({
  ownedNFTs,
  refetchOwnedNFTs,
  refetchStakedInfo,
  chainId,
  contractAddress,
}: UnifiedNFTGalleryProps) => {
  const { data: stakingData } = useStakingInfo();

  const stakedTokenIds: readonly bigint[] = stakingData?.[0] || [];
  const rewardAmounts = stakingData?.[1] || {};

  const [stakedNFTs, setStakedNFTs] = useState<NFT[]>([]);

  useEffect(() => {
    const fetchStakedMetadata = async () => {
      const fetchedNFTs = await Promise.all(
        stakedTokenIds.map(async (id) => {
          try {
            // Fetch metadata from contract or external API
            const tokenURI = `/api/metadata/${id}`; // 🔹 Replace with actual API or contract call
            const response = await fetch(tokenURI);
            if (!response.ok) throw new Error("Metadata fetch failed");

            const metadata = await response.json();
            return {
              id,
              owner: null,
              isStaked: true,
              metadata,
              tokenURI,
            };
          } catch (error) {
            console.error("Failed to fetch metadata for staked NFT:", id, error);
            return {
              id,
              owner: null,
              isStaked: true,
              metadata: { name: "Unnamed NFT", image: "/images/default.png" },
              tokenURI: "",
            };
          }
        })
      );

      setStakedNFTs(fetchedNFTs);
    };

    if (stakedTokenIds.length > 0) fetchStakedMetadata();
  }, [stakedTokenIds]);

  const allNFTs = [...ownedNFTs, ...stakedNFTs];

  if (allNFTs.length === 0) {
    return <Text color="gray" textAlign="center" mt="20px">No NFTs found in this collection.</Text>;
  }

  return (
    <MarketplaceProvider chainId={chainId} contractAddress={contractAddress}>
      <SimpleGrid columns={{ base: 2, sm: 3, md: 4, lg: 5 }} spacing="10px" justifyContent="center" mt="20px">
        {allNFTs.map((nft, index) => {
          const isStaked = !!nft.isStaked;
          const rewardWei = isStaked ? rewardAmounts[nft.id]?.toString() ?? "0" : "0";
          const rewardTokens = (Number(rewardWei) / 1e18).toFixed(4);

          return (
            <UnifiedNFTCard
              key={nft.id.toString() || `nft-${index}`}
              nft={nft}
              isStaked={isStaked}
              reward={rewardTokens}
              refetchOwnedNFTs={refetchOwnedNFTs}
              refetchStakedInfo={refetchStakedInfo}
            />
          );
        })}
      </SimpleGrid>
    </MarketplaceProvider>
  );
};

export default UnifiedNFTGallery;
