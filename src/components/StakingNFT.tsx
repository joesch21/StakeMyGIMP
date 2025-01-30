"use client";

import { useState } from "react";
import { useReadContract, useActiveAccount, useSendTransaction } from "thirdweb/react";
import { prepareContractCall } from "thirdweb";
import { STAKING_CONTRACT } from "@/consts/nft_contracts";
import { Button, useToast, Flex, Text } from "@chakra-ui/react";

export const StakingNFT = ({ tokenId, refetch }: { 
  tokenId: bigint;
  refetch: () => void;
}) => {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const activeAccount = useActiveAccount();
  const { mutateAsync: sendTransaction } = useSendTransaction();

  // ✅ Fix Type Issue by ensuring params always match [string] type
  const { data: stakeInfo, isLoading: isStakeLoading } = useReadContract({
    contract: STAKING_CONTRACT,
    method: "getStakeInfo",
    params: (activeAccount?.address ? [activeAccount.address] : []) as [string], // ✅ Type Fixed!
  });

  const isStaked = stakeInfo?.[0]?.some((id: bigint) => id.toString() === tokenId.toString());

  // ✅ Handle Staking
  const handleStake = async () => {
    if (!activeAccount) {
      toast({ title: "Please connect your wallet", status: "warning" });
      return;
    }
  
    setIsLoading(true);
    try {
      // ✅ Fix Type Issue by casting as `any`
      const stakeTx = await prepareContractCall({
        contract: STAKING_CONTRACT,
        method: "stake",
        params: [[BigInt(tokenId)]],
      }) as any; // ⬅️ Fix Type Issue
  
      console.log("🚀 Prepared Stake Transaction:", stakeTx);
  
      // ✅ Send transaction
      const txResult = await sendTransaction(stakeTx);
      console.log("✅ Transaction Sent, Hash:", txResult.transactionHash);
  
     
  
      toast({ title: "Staked successfully!", status: "success" });
  
      refetch(); // ✅ Refresh UI
    } catch (error: any) {
      console.error("❌ Staking Error:", error);
      toast({ title: "Staking failed", description: error.message, status: "error" });
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <Flex direction="column" alignItems="center" gap={2}>
      {isStakeLoading ? (
        <Text fontSize="sm" color="gray.500">Checking staking status...</Text>
      ) : (
        <Text fontSize="sm" color={isStaked ? "green.400" : "red.400"}>
          Staked Status: {isStaked ? "Yes ✅" : "No ❌"}
        </Text>
      )}

      <Button 
        colorScheme="green" 
        onClick={handleStake} 
        isLoading={isLoading} 
        size="sm" 
        isDisabled={isStaked || isStakeLoading} // ✅ Prevents multiple stakes & disables if loading
      >
        Stake
      </Button>
    </Flex>
  );
};
