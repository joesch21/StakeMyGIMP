"use client";

import { useState } from "react";
import { useSendTransaction, useActiveAccount } from "thirdweb/react";
import { prepareContractCall, waitForReceipt } from "thirdweb";
import { STAKING_CONTRACT } from "@/consts/nft_contracts";
import { Button, useToast, Flex } from "@chakra-ui/react";

export const StakeButton = ({ tokenId, refetch }: { 
  tokenId: bigint;
  refetch: () => void;
}) => {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const activeAccount = useActiveAccount();
  const { mutateAsync: sendTransaction } = useSendTransaction();

  // ✅ Handle Staking
  const handleStake = async () => {
    if (!activeAccount) {
      toast({ title: "Please connect your wallet", status: "warning" });
      return;
    }
  
    setIsLoading(true);
    try {
      // ✅ Prepare Staking Transaction
      const stakeTx = await prepareContractCall({
        contract: STAKING_CONTRACT,
        method: "stake",
        params: [[BigInt(tokenId)]],
      }) as any; // 👈 Fix Type Issue Here

      console.log("🚀 Prepared Stake Transaction:", stakeTx);

      // ✅ Send Transaction
      const txResult = await sendTransaction(stakeTx as any) as any;
      console.log("✅ Transaction Sent, Hash:", txResult.transactionHash);

      // ✅ Wait for Confirmation Using Explicit Cast
      const receipt = await waitForReceipt(txResult as any);
      console.log("🎉 Transaction Confirmed:", receipt);

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
      <Button 
        colorScheme="green" 
        onClick={handleStake} 
        isLoading={isLoading} 
        size="sm"
      >
        Stake
      </Button>
    </Flex>
  );
};
