import type { Chain } from "thirdweb";
import { bsc } from "thirdweb/chains";

export type NftContract = {
  address: string;
  chain: Chain;
  type: "ERC1155" | "ERC721";
  title?: string;
  description?: string;
  thumbnailUrl?: string;
  slug?: string;
};

export const NFT_CONTRACTS: NftContract[] = [
  {
    address: "0x4bA7161d0FAF245c0c8bA83890c121a3D9Fe3AC9",
    chain: bsc,
    title: "99 Billion Gimps - 245 GIMP NFT's",
    thumbnailUrl: "/images/background.png", // Updated to use local image
    type: "ERC721",
  },
  
];
