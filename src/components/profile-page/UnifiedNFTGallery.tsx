"use client";

import { Box, SimpleGrid, Text } from "@chakra-ui/react";
// Import the UnifiedNFTCard and MarketplaceProvider correctly
import UnifiedNFTCard from "@/app/collection/[chainId]/[contractAddress]/UnifiedNFTCard";
import MarketplaceProvider from "@/hooks/useMarketplaceContext";

type UnifiedNFTGalleryProps = {
    ownedNFTs: any[];
    refetchOwnedNFTs: () => void;
    refetchStakedInfo: () => void;
    chainId: string;  // ✅ Added chainId prop
    contractAddress: string;  // ✅ Added contractAddress prop
};

export const UnifiedNFTGallery = ({
    ownedNFTs,
    refetchOwnedNFTs,
    refetchStakedInfo,
    chainId,
    contractAddress
}: UnifiedNFTGalleryProps) => {
    return (
        // ✅ Fixed the issue by passing required props: chainId and contractAddress
        <MarketplaceProvider chainId={chainId} contractAddress={contractAddress}>
            <SimpleGrid 
                columns={{ base: 2, sm: 3, md: 4, lg: 5 }} 
                spacing="10px" 
                justifyContent="center"
            >
                {ownedNFTs.map((nft, index) => (
                    <UnifiedNFTCard
                        key={index}
                        nft={nft}
                        index={index}
                        refetchOwnedNFTs={refetchOwnedNFTs}
                        refetchStakedInfo={refetchStakedInfo}
                    />
                ))}
            </SimpleGrid>
        </MarketplaceProvider>
    );
};

export default UnifiedNFTGallery;
