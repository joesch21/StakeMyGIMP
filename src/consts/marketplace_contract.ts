import type { Chain } from "thirdweb";
import { bsc } from "./chains"; // Ensure 'bsc' is being exported from './chains'

type MarketplaceContract = {
  address: string;
  chain: Chain;
};

/**
 * You need a marketplace contract on each of the chain you want to support
 * Only list one marketplace contract address for each chain
 */
export const MARKETPLACE_CONTRACTS: MarketplaceContract[] = [
  {
    address: "0x64e224c19611b302E06aAa7CC2D8aFEABE7cA648",
    chain: bsc,
  },
];