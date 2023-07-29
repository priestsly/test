/** Replace the values below with the addresses of your smart contracts. */

// 1. Set up the network your smart contracts are deployed to.
// First, import the chain from the package, then set the NETWORK variable to the chain.
import { Mumbai } from "@thirdweb-dev/chains";
export const NETWORK = Mumbai;

// 2. The address of the marketplace V3 smart contract.
// Deploy your own: https://thirdweb.com/thirdweb.eth/MarketplaceV3
export const MARKETPLACE_ADDRESS = "0x89D14fb35e76bD62ec7CEa1179289dE45266A8f2";

// 3. The address of your NFT collection smart contract.
export const NFT_COLLECTION_ADDRESS =
  "0xaeC1c0a4b1a88fc8c309ce56EE40b508164fDc07";

// (Optional) Set up the URL of where users can view transactions on
// For example, below, we use Mumbai.polygonscan to view transactions on the Mumbai testnet.
export const ETHERSCAN_URL = "https://mumbai.polygonscan.com";

export const nftStatus: { [key: string]: string } = {
  0: 'OPEN',
  1: 'OPEN',
  2: 'CLOSE',
  3: 'CLOSE',
  4: 'CLOSE',
  5: 'CLOSE',
  6: 'CLOSE',
  7: 'CLOSE',
  8: 'CLOSE',

  // Define the status for other NFT IDs here
};

//Start
export const nftIds: number[] = [0];

//Counts
export const counts: number[] = [6];
