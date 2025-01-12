import { NATIVE_TOKEN_ICON_MAP, Token } from "@/consts/supported_tokens";
import { useMarketplaceContext } from "@/hooks/useMarketplaceContext";
import { CheckIcon, ChevronDownIcon } from "@chakra-ui/icons";
import {
  Button,
  Flex,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  Image,
  useToast,
  Box,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { NATIVE_TOKEN_ADDRESS, sendAndConfirmTransaction } from "thirdweb";
import {
  isApprovedForAll as isApprovedForAll1155,
  setApprovalForAll as setApprovalForAll1155,
} from "thirdweb/extensions/erc1155";
import {
  isApprovedForAll as isApprovedForAll721,
  setApprovalForAll as setApprovalForAll721,
} from "thirdweb/extensions/erc721";
import { createListing } from "thirdweb/extensions/marketplace";
import {
  useActiveWalletChain,
  useSwitchActiveWalletChain,
} from "thirdweb/react";
import type { Account } from "thirdweb/wallets";

type Props = {
  tokenId: bigint;
  account: Account;
};

export function CreateListing(props: Props) {
  const priceRef = useRef<HTMLInputElement>(null);
  const qtyRef = useRef<HTMLInputElement>(null);
  const { tokenId, account } = props;
  const switchChain = useSwitchActiveWalletChain();
  const activeChain = useActiveWalletChain();
  const [currency, setCurrency] = useState<Token>();
  const toast = useToast();

  const {
    nftContract,
    marketplaceContract,
    refetchAllListings,
    type,
    supportedTokens,
  } = useMarketplaceContext();
  const chain = marketplaceContract.chain;

  const nativeToken: Token = {
    tokenAddress: NATIVE_TOKEN_ADDRESS,
    symbol: chain.nativeCurrency?.symbol || "NATIVE TOKEN",
    icon: NATIVE_TOKEN_ICON_MAP[chain.id] || "",
  };

  const options: Token[] = [nativeToken].concat(supportedTokens);

  return (
    <Flex 
      direction="column"
      w={{ base: "100%", sm: "90vw", lg: "430px" }}
      gap="10px"
      p="10px"
      boxShadow="md"
      borderRadius="lg"
    >
      {/* Ensure Single Column Layout on Mobile */}
      <Flex 
        direction={{ base: "column", md: "row" }} 
        gap="10px"
        flexWrap="wrap"
      >
        <Box w={{ base: "100%", md: "48%" }}>
          <Text>Price</Text>
          <Input type="number" ref={priceRef} placeholder="Enter a price" />
        </Box>
        {type === "ERC1155" && (
          <Box w={{ base: "100%", md: "48%" }}>
            <Text>Quantity</Text>
            <Input type="number" ref={qtyRef} defaultValue={1} placeholder="Quantity to sell" />
          </Box>
        )}
      </Flex>

      <Menu>
        <MenuButton w="50%" as={Button} rightIcon={<ChevronDownIcon />}>
          {currency ? (
            <Flex alignItems="center">
              <Image boxSize="2rem" borderRadius="full" src={currency.icon} mr="12px" />
              <Text>{currency.symbol}</Text>
            </Flex>
          ) : (
            "Select Currency"
          )}
        </MenuButton>
        <MenuList>
          {options.map((token) => (
            <MenuItem
              key={token.tokenAddress}
              onClick={() => setCurrency(token)}
              display="flex"
              alignItems="center"
            >
              <Image boxSize="2rem" borderRadius="full" src={token.icon} mr="14px" />
              <Text>{token.symbol}</Text>
              {token.tokenAddress.toLowerCase() === currency?.tokenAddress.toLowerCase() && (
                <CheckIcon ml="auto" />
              )}
            </MenuItem>
          ))}
        </MenuList>
      </Menu>

      <Button
        colorScheme="blue"
        w="50%"
        isDisabled={!currency}
        onClick={async () => {
          const value = priceRef.current?.value;
          if (!value) {
            toast({
              title: "Please enter a price for this listing",
              status: "error",
              isClosable: true,
              duration: 5000,
            });
            return;
          }
          if (!currency) {
            toast({
              title: "Please select a currency for the listing",
              status: "error",
              isClosable: true,
              duration: 5000,
            });
            return;
          }
          if (activeChain?.id !== nftContract.chain.id) {
            await switchChain(nftContract.chain);
          }
          const _qty = BigInt(qtyRef.current?.value ?? 1);
          if (type === "ERC1155" && (!_qty || _qty <= 0n)) {
            toast({
              title: "Error",
              description: "Invalid quantity",
              status: "error",
              isClosable: true,
              duration: 5000,
            });
            return;
          }

          const checkApprove = type === "ERC1155" ? isApprovedForAll1155 : isApprovedForAll721;
          const isApproved = await checkApprove({
            contract: nftContract,
            owner: account.address,
            operator: marketplaceContract.address,
          });

          if (!isApproved) {
            const setApproval = type === "ERC1155" ? setApprovalForAll1155 : setApprovalForAll721;
            const approveTx = setApproval({
              contract: nftContract,
              operator: marketplaceContract.address,
              approved: true,
            });
            await sendAndConfirmTransaction({ transaction: approveTx, account });
          }

          const transaction = createListing({
            contract: marketplaceContract,
            assetContractAddress: nftContract.address,
            tokenId,
            quantity: type === "ERC721" ? 1n : _qty,
            currencyContractAddress: currency?.tokenAddress,
            pricePerToken: value,
          });

          await sendAndConfirmTransaction({ transaction, account });
          refetchAllListings();
        }}
      >
        List NFT
      </Button>
    </Flex>
  );
}
