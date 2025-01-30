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
  // ✅ Now we only use `ownedNFTs`, since staked ones disappear from this list
  if (ownedNFTs.length === 0) {
    return <Text color="gray" textAlign="center" mt="20px">No NFTs found in this collection.</Text>;
  }

  return (
    <MarketplaceProvider chainId={chainId} contractAddress={contractAddress}>
      <SimpleGrid columns={{ base: 2, sm: 3, md: 4, lg: 5 }} spacing="10px" justifyContent="center" mt="20px">
        {ownedNFTs.map((nft, index) => (
          <UnifiedNFTCard
          key={nft.id.toString() || `nft-${index}`}
          nft={{ 
            ...nft, 
            id: nft.id.toString(),
            tokenURI: nft.tokenURI || "" // ✅ Ensure tokenURI is always a string
          }}
          
        
            isStaked={false} // ✅ We no longer need to check staking status
            reward={0n} // ✅ Rewards are only relevant for staked NFTs
            refetchOwnedNFTs={refetchOwnedNFTs}
            refetchStakedInfo={refetchStakedInfo}
          />
        ))}
      </SimpleGrid>
    </MarketplaceProvider>
  );
};

export default UnifiedNFTGallery;
