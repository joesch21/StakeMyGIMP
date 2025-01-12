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
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { FaExternalLinkAlt } from "react-icons/fa";
import { balanceOf, getNFT as getERC1155 } from "thirdweb/extensions/erc1155";
import { getNFT as getERC721 } from "thirdweb/extensions/erc721";
import {
  MediaRenderer,
  useActiveAccount,
  useReadContract
} from "thirdweb/react";
import { shortenAddress } from "thirdweb/utils";
import { NftAttributes } from "@/components/token-page/NftAttributes";
import { CreateListing } from "@/components/token-page/CreateListing";
import { useMarketplaceContext } from "@/hooks/useMarketplaceContext";
import dynamic from "next/dynamic";
import { NftDetails } from "@/components/token-page/NftDetails";
import RelatedListings from "@/components/token-page/RelatedListings";

// Dynamic imports for components
const CancelListingButton = dynamic(
  () => import("@/components/token-page/CancelListingButton"), 
  { ssr: false }
);
const BuyFromListingButton = dynamic(
  () => import("@/components/token-page/BuyFromListingButton"), 
  { ssr: false }
);

type Props = {
  tokenId: bigint;
};

export function Token({ tokenId }: Props) {
  const {
    type,
    nftContract,
    listingsInSelectedCollection = [],
    contractMetadata,
  } = useMarketplaceContext();
  
  const account = useActiveAccount();

  // Fetch the NFT data safely
  const { data: nft } = useReadContract(
    type === "ERC1155" ? getERC1155 : getERC721,
    {
      tokenId: tokenId,
      contract: nftContract,
      includeOwner: true,
    }
  );

  const ownedByYou = nft?.owner?.toLowerCase() === account?.address.toLowerCase();

  return (
    <Flex direction="column">
      <Box mt="24px" mx="auto">
        <Flex
          direction={{ base: "column", lg: "row" }}
          justifyContent={{ lg: "center", base: "space-between" }}
          gap="10px"
        >
          {/* NFT Image and Attributes Section */}
          <Flex direction="column" w={{ base: "100%", lg: "45vw" }} gap="5">
            {nft?.metadata?.image && (
              <MediaRenderer
                client={client}
                src={nft.metadata.image}
                style={{ width: "100%", borderRadius: "10px" }}
              />
            )}
            <Accordion allowMultiple defaultIndex={[0, 1, 2]}>
              {nft?.metadata?.description && (
                <AccordionItem>
                  <AccordionButton>
                    <Box flex="1" textAlign="left">Description</Box>
                    <AccordionIcon />
                  </AccordionButton>
                  <AccordionPanel pb={4}>
                    <Text>{nft.metadata.description}</Text>
                  </AccordionPanel>
                </AccordionItem>
              )}

              {nft?.metadata?.attributes && (
                <NftAttributes attributes={nft.metadata.attributes} />
              )}

              {nft && <NftDetails nft={nft} />}
            </Accordion>
          </Flex>

          {/* NFT Details and Listing Section */}
          <Box w={{ base: "100%", lg: "45vw" }}>
            <Text>Collection</Text>
            <Flex direction="row" gap="3">
              <Heading>{contractMetadata?.name || "N/A"}</Heading>
              <Link
                color="gray"
                href={`/collection/${nftContract.chain.id}/${nftContract.address}`}
              >
                <FaExternalLinkAlt size={20} />
              </Link>
            </Flex>
            <Text>Token ID: {nft?.id?.toString() || "N/A"}</Text>
            <Heading>{nft?.metadata?.name || "Unnamed NFT"}</Heading>
            <Text>Current Owner: {nft?.owner ? shortenAddress(nft.owner) : "N/A"}</Text>

            {/* ✅ Render CreateListing only for the owner */}
            {nft && nft.id && ownedByYou && account ? (
              <CreateListing tokenId={nft.id} account={account} />
            ) : (
              <Text color="red">You are not the owner or data is missing.</Text>
            )}

            {/* Display Listings Section */}
            <Accordion mt="30px" defaultIndex={[0, 1]} allowMultiple>
              <AccordionItem>
                <AccordionButton>
                  <Box flex="1" textAlign="left">
                    Listings ({listingsInSelectedCollection.length})
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={4}>
                  {listingsInSelectedCollection.length > 0 ? (
                    <TableContainer>
                      <Table>
                        <Thead>
                          <Tr>
                            <Th>Price</Th>
                            <Th>Listed By</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {listingsInSelectedCollection.map((listing) => (
                            <Tr key={listing.id.toString()}>
                              <Td>{listing.currencyValuePerToken.displayValue}</Td>
                              <Td>{shortenAddress(listing.creatorAddress)}</Td>
                            </Tr>
                          ))}
                        </Tbody>
                      </Table>
                    </TableContainer>
                  ) : (
                    <Text>No listings available.</Text>
                  )}
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          </Box>
        </Flex>
      </Box>
    </Flex>
  );
}

// ✅ Updated UnifiedNFTCard for Mobile Optimization
export default function UnifiedNFTCard({ nft, index, refetchOwnedNFTs, refetchStakedInfo }: any) {
    const account = useActiveAccount();
    const ownedByYou = nft?.owner?.toLowerCase() === account?.address.toLowerCase();

    return (
        <Flex 
            p="10px" 
            border="1px solid white" 
            borderRadius="10px"
            direction="column"
            w={{ base: "100%", md: "48%" }} // Single column for mobile, two for larger screens
        >
            <MediaRenderer
                client={client}
                src={nft?.metadata?.image}
                style={{ width: "100%", borderRadius: "10px" }}
            />
            <Text mt="5px">Token ID: {nft?.id?.toString() || "N/A"}</Text>
            <Text>{nft?.metadata?.name || "Unnamed NFT"}</Text>
            <Flex mt="10px" direction="column" gap="10px">
                {nft?.owner ? (
                    <Text>Owned by: {shortenAddress(nft.owner)}</Text>
                ) : (
                    <Text>Owner not available</Text>
                )}
                {/* Only show listing button for the owner */}
                {nft && nft.id && ownedByYou && account ? (
                    <CreateListing tokenId={nft.id} account={account} />
                ) : (
                    <Text color="red">You are not the owner or missing data.</Text>
                )}
            </Flex>
        </Flex>
    );
}
