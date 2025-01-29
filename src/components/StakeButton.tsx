"use client";

import { useSendTransaction, useActiveAccount } from "thirdweb/react";
import { prepareContractCall } from "thirdweb";
import { STAKING_CONTRACT } from "@/consts/nft_contracts";
import { useState } from "react";
import { 
  Button, useToast, Flex, Text, Box, AccordionItem, AccordionButton, 
  AccordionPanel, AccordionIcon 
} from "@chakra-ui/react";
import { useStakingInfo } from "@/hooks/useStakingInfo";

export function StakeButton({
  tokenId,
  refetchOwnedNFTs,
  refetchStakedInfo
}: {
  tokenId: bigint;
  refetchOwnedNFTs: () => void;
  refetchStakedInfo: () => void;
}) {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const activeAccount = useActiveAccount();
  const { data: stakeInfo, refetch: refetchStaking } = useStakingInfo();

  // ✅ Check if NFT is staked
  const isStaked = stakeInfo?.[0]?.includes(BigInt(tokenId));

  // ✅ Get the earned rewards for this NFT
  const rewardWei = isStaked ? stakeInfo?.[1]?.[tokenId]?.toString() ?? "0" : "0";
  const rewardTokens = (Number(rewardWei) / 1e18).toFixed(4); // Convert from Wei to Tokens

  const { mutate: sendTransaction } = useSendTransaction();

  const handleStake = async () => {
    if (!activeAccount) {
      toast({ title: "Please connect your wallet", status: "warning" });
      return;
    }

    setIsLoading(true);
    try {
      const stakeTx = await prepareContractCall({
        contract: STAKING_CONTRACT,
        method: "stake",
        params: [[BigInt(tokenId)]], // ✅ Ensure correct format
      });

      if (!stakeTx) {
        throw new Error("Failed to prepare stake transaction");
      }

      const txResult = await sendTransaction(stakeTx);
      if (!txResult) {
        throw new Error("Transaction signing rejected");
      }

      await txResult.wait(); // ✅ Wait for confirmation before updating UI

      toast({ title: "Staked successfully!", status: "success" });

      await refetchOwnedNFTs(); // ✅ Refresh Owned NFTs
      await refetchStakedInfo(); // ✅ Refresh Staked NFTs
    } catch (error: any) {
      console.error("Staking Error:", error);
      toast({
        title: "Staking Action",
        description: error.message.includes("user rejected")
          ? "Transaction rejected in MetaMask"
          : error.message || "Staking failed",
        status: error.message.includes("user rejected") ? "info" : "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnstake = async () => {
    if (!activeAccount) {
      toast({ title: "Please connect your wallet", status: "warning" });
      return;
    }

    setIsLoading(true);
    try {
      const unstakeTx = await prepareContractCall({
        contract: STAKING_CONTRACT,
        method: "withdraw",
        params: [[BigInt(tokenId)]], // ✅ Ensure array format
      });

      if (!unstakeTx) {
        throw new Error("Failed to prepare unstake transaction");
      }

      const txResult = await sendTransaction(unstakeTx);
      if (!txResult) {
        throw new Error("Transaction signing rejected");
      }

      await txResult.wait(); // ✅ Wait for confirmation before updating UI

      toast({ title: "Unstaked successfully!", status: "success" });

      await refetchOwnedNFTs(); // ✅ Refresh Owned NFTs
      await refetchStakedInfo(); // ✅ Refresh Staked NFTs
    } catch (error: any) {
      console.error("Unstaking Error:", error);
      toast({
        title: "Unstaking Action",
        description: error.message.includes("user rejected")
          ? "Transaction rejected in MetaMask"
          : error.message || "Unstaking failed",
        status: error.message.includes("user rejected") ? "info" : "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClaimRewards = async () => {
    if (!activeAccount) {
      toast({ title: "Please connect your wallet", status: "warning" });
      return;
    }

    if (Number(rewardWei) <= 0) {
      toast({ title: "No rewards available to claim.", status: "info" });
      return;
    }

    setIsLoading(true);
    try {
      const claimTx = await prepareContractCall({
        contract: STAKING_CONTRACT,
        method: "claimRewards",
        params: [[BigInt(tokenId)]], // ✅ Ensure array format
      });

      if (!claimTx) {
        throw new Error("Failed to prepare claim transaction");
      }

      const txResult = await sendTransaction(claimTx);
      if (!txResult) {
        throw new Error("Transaction signing rejected");
      }

      await txResult.wait(); // ✅ Wait for confirmation before updating UI

      toast({ title: "Rewards Claimed Successfully!", status: "success" });

      await refetchStakedInfo(); // ✅ Refresh rewards
    } catch (error: any) {
      console.error("Claiming Rewards Error:", error);
      toast({
        title: "Claiming Rewards Action",
        description: error.message.includes("user rejected")
          ? "Transaction rejected in MetaMask"
          : error.message || "Claiming rewards failed",
        status: error.message.includes("user rejected") ? "info" : "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box>
      <Flex gap={2} align="center">
        <Button colorScheme="green" onClick={handleStake} isLoading={isLoading} size="sm" isDisabled={isStaked === true}>
          Stake
        </Button>
        <Button colorScheme="red" onClick={handleUnstake} isLoading={isLoading} size="sm" isDisabled={isStaked === false}>
          Unstake
        </Button>
        <Text fontSize="sm" color={isStaked ? "green.300" : "red.300"}>
          {isStaked ? "Staked ✅" : "Not Staked ❌"}
        </Text>
      </Flex>

      {/* ✅ Staking Rewards Section */}
      {isStaked && (
        <AccordionItem mt="10px">
          <AccordionButton>
            <Box flex="1" textAlign="left">
              Staking Rewards
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel pb={4}>
            <Text fontSize="sm">
              Earned Rewards: <b>{rewardTokens}</b>
            </Text>
            <Button
              mt="2"
              colorScheme="yellow"
              size="sm"
              onClick={handleClaimRewards}
              isDisabled={Number(rewardWei) <= 0}
              isLoading={isLoading}
            >
              Claim Rewards
            </Button>
          </AccordionPanel>
        </AccordionItem>
      )}
    </Box>
  );
}
