"use client";

import {
  Box,
  Flex,
  Heading,
  Img,
  Tab,
  TabList,
  TabPanels,
  TabPanel,
  Tabs,
  Text,
} from "@chakra-ui/react";
import { blo } from "blo";
import { shortenAddress } from "thirdweb/utils";
import { ProfileMenu } from "./Menu";
import { useState } from "react";
import { NFT_CONTRACTS, type NftContract } from "@/consts/nft_contracts";
import { useActiveAccount, useReadContract } from "thirdweb/react";
import { getContract, toEther } from "thirdweb";
import { client } from "@/consts/client";
import { getOwnedERC721s } from "@/extensions/getOwnedERC721s";
import UnifiedNFTGallery from "../UnifiedNFTGallery";
import { MARKETPLACE_CONTRACTS } from "@/consts/marketplace_contract";
import { useGetENSAvatar } from "@/hooks/useGetENSAvatar";
import { useGetENSName } from "@/hooks/useGetENSName";
import { getAllValidListings } from "thirdweb/extensions/marketplace";
import EmbeddedWallet from "../EmbeddedWallet";
import { useStakingInfo } from "@/hooks/useStakingInfo"; // ✅ Import the staking hook

type Props = {
  address: string;
};

export function ProfileSection({ address }: Props) {
  const account = useActiveAccount();
  const isYou = address.toLowerCase() === account?.address.toLowerCase();
  const { data: ensName } = useGetENSName({ address });
  const { data: ensAvatar } = useGetENSAvatar({ ensName });
  const [selectedCollection, setSelectedCollection] = useState<NftContract>(
    NFT_CONTRACTS[0]
  );

  const contract = getContract({
    address: selectedCollection.address,
    chain: selectedCollection.chain,
    client,
  });

  // ✅ Fetch Owned NFTs
  const {
    data: ownedNFTs,
    isLoading: isLoadingOwnedNFTs,
    refetch: refetchOwnedNFTs,
  } = useReadContract(getOwnedERC721s, {
    contract,
    owner: address,
    requestPerSec: 50,
    queryOptions: {
      enabled: !!address,
    },
  });

  // ✅ Fetch Staking Info
  const { refetch: refetchStakedInfo } = useStakingInfo();

  // ✅ Get Marketplace Contract
  const chain = contract.chain;
  const marketplaceContractAddress = MARKETPLACE_CONTRACTS.find(
    (o) => o.chain.id === chain.id
  )?.address;

  if (!marketplaceContractAddress) {
    console.error("No marketplace contract found for this chain.");
    return <Text color="red">Marketplace not available on this chain.</Text>;
  }

  const marketplaceContract = getContract({
    address: marketplaceContractAddress,
    chain,
    client,
  });

  // ✅ Fetch Listings
  const { data: allValidListings } = useReadContract(getAllValidListings, {
    contract: marketplaceContract,
    queryOptions: { enabled: !!ownedNFTs?.length },
  });

  // ✅ Format Listings to Match NFT Structure
  const listings = allValidListings
    ? allValidListings.map((item) => ({
        id: BigInt(item.asset.id), // Ensure BigInt
        owner: item.creatorAddress,
        metadata: item.asset.metadata,
        tokenURI: item.asset.metadata.image ?? "",
        isListed: true, // ✅ Pass this to `UnifiedNFTCard`
      }))
    : [];

  return (
    <Box px={{ lg: "50px", base: "20px" }}>
      {/* Profile Header */}
      <Flex direction={{ lg: "row", md: "column", sm: "column" }} gap={5}>
        <Img
          src={ensAvatar ?? blo(address as `0x${string}`)}
          w={{ lg: 150, base: 100 }}
          rounded="8px"
        />
        <Box my="auto">
          <Heading>{ensName ?? "Gold Condor Capital Member"}</Heading>
          <Text color="gray">{shortenAddress(address)}</Text>
        </Box>
      </Flex>

      <Box mt="20px">
        <EmbeddedWallet />
      </Box>

      {/* Profile Menu */}
      <ProfileMenu
        selectedCollection={selectedCollection}
        setSelectedCollection={setSelectedCollection}
      />

      {/* NFT Tabs */}
      <Tabs variant="soft-rounded" isLazy defaultIndex={0} mt="20px">
        <TabList>
          <Tab>Owned ({ownedNFTs?.length ?? 0})</Tab>
          <Tab>Listings ({listings?.length ?? 0})</Tab>
        </TabList>

        <TabPanels>
          {/* Owned NFTs */}
          <TabPanel>
            {isLoadingOwnedNFTs ? (
              <Text>Loading...</Text>
            ) : (
              <UnifiedNFTGallery
                ownedNFTs={ownedNFTs ?? []} // ✅ Only show owned NFTs
                listings={[]} // ✅ No listings in this tab
                refetchOwnedNFTs={refetchOwnedNFTs}
                refetchStakedInfo={refetchStakedInfo}
                chainId={selectedCollection.chain.id.toString()}
                contractAddress={selectedCollection.address}
              />
            )}
          </TabPanel>

          {/* Listings */}
          <TabPanel>
            {listings.length > 0 ? (
              <UnifiedNFTGallery
                ownedNFTs={[]} // ✅ No owned NFTs in the Listings tab
                listings={listings ?? []} // ✅ Only show listed NFTs
                refetchOwnedNFTs={refetchOwnedNFTs}
                refetchStakedInfo={refetchStakedInfo}
                chainId={selectedCollection.chain.id.toString()}
                contractAddress={selectedCollection.address}
              />
            ) : (
              <Text>No listings available.</Text>
            )}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}
