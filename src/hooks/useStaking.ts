"use client";

import { useReadContract } from "thirdweb/react";
import { getContract } from "thirdweb";
import { STAKING_CONTRACT_ADDRESS, client, chain } from "@/consts/nft_contracts";
import { stakingABI } from "@/consts/abi/Staking_contract_abi";
import { useActiveAccount } from "thirdweb/react";

export function useStakingInfo() {
  const activeAccount = useActiveAccount();

  // ✅ Correctly set up the staking contract
  const stakingContract = getContract({
    client,
    chain,
    address: STAKING_CONTRACT_ADDRESS,
    abi: stakingABI,
  });

// ✅ Fetch staking info
const { data: stakeInfo, isLoading, refetch } = useReadContract({
  contract: stakingContract,
  method: "getStakeInfo",
  // @ts-expect-error ❌ Suppress only if an error exists
  params: activeAccount?.address 
    ? ([activeAccount.address] as [string]) 
    : (() => Promise.resolve([""]) as unknown as () => Promise<[string]>),
  queryOptions: {
    enabled: !!activeAccount?.address, // ✅ Only run if account is connected
  },
});




  return {
    stakeInfo,
    isLoading,
    refetch,
  };
}
