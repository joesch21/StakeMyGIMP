import { useReadContract, useActiveAccount } from "thirdweb/react";
import { STAKING_CONTRACT } from "@/consts/nft_contracts";

export function useStakingInfo() {
  const account = useActiveAccount();
  
  const { data, refetch } = useReadContract({
    contract: STAKING_CONTRACT,
    method: "getStakeInfo",
    params: [account?.address],
  });

  return { data, refetch };
}
