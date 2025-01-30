import { Box, SimpleGrid, Text } from "@chakra-ui/react";
import { MarketplaceProvider } from "@/hooks/useMarketplaceContext";
import UnifiedNFTCard from "@/components/UnifiedNFTCard";

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
};

type UnifiedNFTGalleryProps = {
  ownedNFTs: NFT[];
  listings: NFT[];
  refetchOwnedNFTs: () => void;
  refetchStakedInfo?: () => void; // ✅ Now Optional
  chainId: string;
  contractAddress: string;
};


export const UnifiedNFTGallery = ({
  ownedNFTs,
  listings, // ✅ Ensure listings is included here
  refetchOwnedNFTs,
  refetchStakedInfo,
  chainId,
  contractAddress,
}: UnifiedNFTGalleryProps) => {
  // ✅ Merge owned & listed NFTs safely
  const allNFTs: NFT[] = [...(ownedNFTs ?? []), ...(listings ?? [])];

  if (allNFTs.length === 0) {
    return <Text color="gray" textAlign="center" mt="20px">No NFTs found in this collection.</Text>;
  }

  return (
    <MarketplaceProvider chainId={chainId} contractAddress={contractAddress}>
      <SimpleGrid columns={{ base: 2, sm: 3, md: 4, lg: 5 }} spacing="10px" justifyContent="center" mt="20px">
        {allNFTs.map((nft, index) => (
          <UnifiedNFTCard
            key={nft.id.toString() || `nft-${index}`}
            nft={{ 
              ...nft, 
              id: nft.id.toString(),
              tokenURI: nft.tokenURI || "" // ✅ Ensure tokenURI is always a string
            }}
            isStaked={false} // ✅ No need to check staking
            reward={0n} // ✅ Rewards are only for staked NFTs
            refetchOwnedNFTs={refetchOwnedNFTs}
            refetchStakedInfo={refetchStakedInfo ?? (() => {})}
          />
        ))}
      </SimpleGrid>
    </MarketplaceProvider>
  );
};

export default UnifiedNFTGallery;
