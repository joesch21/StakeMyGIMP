import { defineChain } from "thirdweb";
import { createThirdwebClient } from "thirdweb";
import { getContract } from "thirdweb";
import { stakingABI } from "../../consts/abi/Staking_contract_abi";
import { NFT_CONTRACTS } from "../../consts/abi/NFT_contract"; // ✅ Ensure this is a **flat** ABI array

// ✅ Define the Blockchain (BSC)
export const chain = defineChain(56); // ✅ Binance Smart Chain (BSC)

// ✅ Ensure `clientId` exists
const clientId = process.env.NEXT_PUBLIC_TW_CLIENT_ID;
if (!clientId) {
    console.error("⚠️ Missing NEXT_PUBLIC_TW_CLIENT_ID in .env.local");
    throw new Error("Missing NEXT_PUBLIC_CLIENT_ID. Please add it to .env.local.");
}

// ✅ Create Thirdweb Client
export const client = createThirdwebClient({
    clientId: clientId,
});

// ✅ Export Contract Addresses
export const NFT_CONTRACT_ADDRESS = "0x4bA7161d0FAF245c0c8bA83890c121a3D9Fe3AC9";
export const REWARD_TOKEN_CONTRACT_ADDRESS = "0x092aC429b9c3450c9909433eB0662c3b7c13cF9A";
export const STAKING_CONTRACT_ADDRESS = "0x250965c2D14856CCe89406eF5F2f4f7e17453aB1";



// ✅ Ensure ABI is a **flat array**
if (!Array.isArray(NFT_CONTRACTS) || !NFT_CONTRACTS.length) {
    console.error("⚠️ NFT_CONTRACTS is not a valid ABI array.");
    throw new Error("Invalid NFT_CONTRACTS ABI. Ensure it's a flat array.");
}

// ✅ NFT Contract (ERC721)
export const NFT_CONTRACT = getContract({
    client: client,
    chain: chain,
    address: NFT_CONTRACT_ADDRESS
});

// ✅ Staking Contract
export const STAKING_CONTRACT = getContract({
    client: client,
    chain: chain,
    address: STAKING_CONTRACT_ADDRESS,
    abi: stakingABI, // ✅ Using Staking Contract ABI
});

// ✅ Reward Token Contract (ERC20)
export const REWARD_TOKEN_CONTRACT = getContract({
    client: client,
    chain: chain,
    address: REWARD_TOKEN_CONTRACT_ADDRESS,
});

