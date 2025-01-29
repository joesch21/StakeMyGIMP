"use client";

import { useSendTransaction, useActiveAccount, useReadContract } from "thirdweb/react";
import { prepareContractCall } from "thirdweb"; 
import { STAKING_CONTRACT } from "@/consts/nft_contracts";
import { useState, useEffect } from "react";
import { Button, useToast, Flex, Text } from "@chakra-ui/react";

export const StakingNFT = ({ tokenId, refetch }: { 
  tokenId: bigint;
  refetch: () => void;
}) => {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isStaked, setIsStaked] = useState(false); // ✅ Tracks Staking Status
  const activeAccount = useActiveAccount();
  const { mutate: sendTransaction } = useSendTransaction();

  console.log(`Checking staking status for Token ID: ${tokenId}`);

  // ✅ Fetch Staking Status from Contract
  useEffect(() => {
    const fetchStakingStatus = async () => {
      try {
        if (!activeAccount) return;
        
        const stakeInfo = await STAKING_CONTRACT.call("getStakeInfo", [activeAccount.address]);
        const stakedTokens = stakeInfo?.[0] || []; // Extract staked token list

        setIsStaked(stakedTokens.includes(tokenId)); // ✅ Update state
        console.log(`Staking Status: ${isStaked ? "Staked" : "Not Staked"}`);
      } catch (error) {
        console.error("Error fetching staking status:", error);
      }
    };

    fetchStakingStatus();
  }, [tokenId, activeAccount]);

  // ✅ Handle Staking
  const handleStake = async () => {
    if (!activeAccount) {
      toast({ title: "Please connect your wallet", status: "warning" });
      return;
    }

    setIsLoading(true);
    try {
      const stakeTx = prepareContractCall({
        contract: STAKING_CONTRACT,
        method: "stake",
        params: [[tokenId]], // ✅ Needs to be in an array
      });

      const txResult = await sendTransaction(stakeTx);
      console.log("Stake TX sent:", txResult);

      // ✅ Wait for confirmation
      await txResult.wait();
      console.log("Stake TX confirmed:", txResult);

      toast({ title: "Staked successfully!", status: "success" });
      setIsStaked(true); // ✅ Update UI
      refetch(); // ✅ Refresh UI
    } catch (error: any) {
      console.error("Staking Error:", error);
      toast({ title: "Staking failed", description: error.message, status: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Handle Unstaking
  const handleUnstake = async () => {
    if (!activeAccount) {
      toast({ title: "Please connect your wallet", status: "warning" });
      return;
    }

    setIsLoading(true);
    try {
      const unstakeTx = prepareContractCall({
        contract: STAKING_CONTRACT,
        method: "withdraw",
        params: [[tokenId]], // ✅ Needs to be in an array
      });

      const txResult = await sendTransaction(unstakeTx);
      console.log("Unstake TX sent:", txResult);

      // ✅ Wait for confirmation
      await txResult.wait();
      console.log("Unstake TX confirmed:", txResult);

      toast({ title: "Unstaked successfully!", status: "success" });
      setIsStaked(false); // ✅ Update UI
      refetch(); // ✅ Refresh UI
    } catch (error: any) {
      console.error("Unstaking Error:", error);
      toast({ title: "Unstaking failed", description: error.message, status: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Flex direction="column" alignItems="center" gap={2}>
      {/* ✅ Status Label */}
      <Text fontSize="sm" color={isStaked ? "green.400" : "red.400"}>
        Staked Status: {isStaked ? "Yes ✅" : "No ❌"}
      </Text>

      <Flex gap={2}>
        <Button
          colorScheme="green"
          onClick={handleStake}
          isLoading={isLoading}
          size="sm"
          isDisabled={isStaked} // ✅ Disable if already staked
        >
          Stake
        </Button>
        <Button
          colorScheme="red"
          onClick={handleUnstake}
          isLoading={isLoading}
          size="sm"
          isDisabled={!isStaked} // ✅ Enable only if staked
        >
          Unstake
        </Button>
      </Flex>
    </Flex>
  );
};
