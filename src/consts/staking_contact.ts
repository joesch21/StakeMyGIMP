import { getContract } from "thirdweb"; // Import getContract from Thirdweb SDK
import { client, chain, STAKING_CONTRACT_ADDRESS } from "../consts/nft_contracts"; // ✅ Ensure correct import path
import { stakingABI } from "../consts/abi/Staking_contract_abi"; // ✅ Import staking contract ABI

// ✅ Define the Staking Contract Instance
export const STAKING_CONTRACT = getContract({
  client: client, // ✅ Required for Thirdweb
  chain: chain,   // ✅ Ensures the correct blockchain (BSC)
  address: STAKING_CONTRACT_ADDRESS, // ✅ The deployed staking contract address
  abi: stakingABI // ✅ Staking contract ABI
});
