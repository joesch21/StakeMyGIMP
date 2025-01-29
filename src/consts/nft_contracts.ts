import type { Chain } from "thirdweb";
import { getContract } from "thirdweb";
import { bsc } from "thirdweb/chains";
import { client } from "../consts/client";
import { stakingABI } from "./abi/Staking_contract_abi"; // ✅ Import Staking ABI

export type NftContract = {
  address: string;
  chain: Chain;
  type: "ERC1155" | "ERC721";
  title?: string;
  description?: string;
  thumbnailUrl?: string;
  slug?: string;
};

// ✅ Define NFT Contract Address Separately (for easy use elsewhere)
export const NFT_CONTRACT_ADDRESS = "0x4bA7161d0FAF245c0c8bA83890c121a3D9Fe3AC9";
export const STAKING_CONTRACT_ADDRESS = "0x250965c2D14856CCe89406eF5F2f4f7e17453aB1";
export const REWARD_TOKEN_CONTRACT_ADDRESS = "0x092aC429b9c3450c9909433eB0662c3b7c13cF9A";

// ✅ NFT Contracts List (No Change Here)
export const NFT_CONTRACTS: NftContract[] = [
  {
    address: NFT_CONTRACT_ADDRESS,
    chain: bsc,
    title: "245 Unique GIMP NFT's - Limited Edition ",
    thumbnailUrl: "/images/background.png",
    type: "ERC721",
  },
];

// ✅ NFT Contract Instance
export const NFT_CONTRACT = getContract({
    client: client,
    chain: bsc,
    address: NFT_CONTRACT_ADDRESS,
});

// ✅ Staking Contract Instance
export const STAKING_CONTRACT = getContract({
    client: client,
    chain: bsc,
    address: STAKING_CONTRACT_ADDRESS,
    abi: stakingABI, // ✅ Ensure ABI is properly included
});

// ✅ Reward Token Contract Instance
export const REWARD_TOKEN_CONTRACT = getContract({
    client: client,
    chain: bsc,
    address: REWARD_TOKEN_CONTRACT_ADDRESS,
});

// ✅ Export all constants & contracts for global access
export { client, bsc as chain };
