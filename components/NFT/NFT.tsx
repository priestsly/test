import {
  ThirdwebNftMedia,
  useActiveListings,
  useAddress,
  useContract,
  useNFTBalance,
  useValidDirectListings,
} from "@thirdweb-dev/react";
import { NFT } from "@thirdweb-dev/sdk";
import React from "react";
import { MARKETPLACE_ADDRESS, NFT_COLLECTION_ADDRESS, } from "../../const/contractAddresses";
import Skeleton from "../Skeleton/Skeleton";
import styles from "./NFT.module.css";

type Props = {
  nft: NFT;
  showPriceContainer?: boolean;
  showBalanceText?: boolean;
};

export default function NFTComponent({
  nft,
  showPriceContainer = true,
  showBalanceText = true,
}: Props) 
{
  const { contract: marketplace, isLoading: loadingContract } = useContract(MARKETPLACE_ADDRESS, "marketplace-v3");

  // Load valid direct listings for the NFT
  const { data: directListings, isLoading: loadingDirect } =
    useValidDirectListings(marketplace, { tokenContract: NFT_COLLECTION_ADDRESS, tokenId: nft.metadata.id, });

  const tokenId = nft.metadata.id;
  const address = useAddress();
  const { contract: nftContract } = useContract(NFT_COLLECTION_ADDRESS);
  const {
    data: ownerBalance,
    isLoading: balanceLoading,
    error: balanceError,
  } = useNFTBalance(nftContract, address, tokenId);

  let balanceText = "";

  if (!balanceLoading && ownerBalance) {
    balanceText = ownerBalance.toString();
  }

  return (
    <>
      <p className="text-xl text-center font-bold">{nft.metadata.name}</p>
      <ThirdwebNftMedia metadata={nft.metadata} className="hover:animate-wiggle hover:animate-infinite" />

      {showPriceContainer && (
        <div className={styles.priceContainer}>
          {loadingContract || loadingDirect ? (
            <Skeleton width="100%" height="100%" />
          ) : directListings && directListings.length > 0 ? (
            <div className={`${styles.nftPriceContainer} `}>
              <div>
                <p className="text-sm text-center text-gray-400 text-ellipsis">
                  Price: {`${directListings[0]?.currencyValuePerToken.displayValue} ${directListings[0]?.currencyValuePerToken.symbol}`}
                </p>
                {showBalanceText && <p>You Have: {balanceText}</p>}
                <p className="text-sm text-white">
                  Quantity in Sale: {directListings[0]?.quantity}
                </p>
              </div>
            </div>
          ) : (
            <div className={styles.nftPriceContainer}>
              <div>
                <p className={styles.nftPriceLabel}>Price</p>
                <p className={styles.nftPriceValue}>Very soon</p>
              </div>
            </div>
          )}
        </div>
      )}

      {!showPriceContainer && showBalanceText && (
        <p className="bg-fuchsia-950 bg-opacity-50 rounded-lg w-full h-16 text-lg flex justify-center items-center">
          You Have: {balanceText}
        </p>
      )}
    </>
  );
}
