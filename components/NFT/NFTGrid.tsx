import type { NFT as NFTType } from "@thirdweb-dev/sdk";
import Link from "next/link";
import React from "react";
import { NFT_COLLECTION_ADDRESS } from "../../const/contractAddresses";
import Skeleton from "../Skeleton/Skeleton";
import NFT from "./NFT";
import styles from "../../styles/Buy.module.css";
import router from "next/router";

type Props = {
  isLoading: boolean;
  data: NFTType[] | undefined;
  overrideOnclickBehavior?: (nft: NFTType) => void;
  emptyText?: string;
  customClass?: string;
};

export default function NFTGrid({
  isLoading,
  data,
  overrideOnclickBehavior,
  emptyText = "No NFTs found for this collection.",
  customClass = "",
}: Props) {
  if (!data || data.length === 0) {
    return <p>{emptyText}</p>;
  }

  const getNFTComponent = (nft: NFTType) => {
    if (overrideOnclickBehavior) {
      return (
        <div
          key={nft.metadata.id}
          className={`${styles.nftContainer} animate-fade-down shadow-lg hover:shadow-slate-400 border-t-8 p-8 m-8 border backdrop-brightness-50 rounded-lg cursor-pointer`}
          onClick={() => overrideOnclickBehavior(nft)}
        >
          <NFT nft={nft} showPriceContainer={true} showBalanceText={true} />
        </div>
      );
    }

    // Default behavior based on the source component
    const sourceComponent = router.route.split("/")[1]; // Assumes the source component is in the format "/source"

    if (sourceComponent === "buy") {
      return (
        <Link
          href={`/token/${NFT_COLLECTION_ADDRESS}/${nft.metadata.id}`}
          key={nft.metadata.id}
          className={`${styles.nftContainer}  shadow-lg hover:border  p-8 m-8  backdrop-brightness-50 rounded-lg cursor-pointer`}>
          <NFT nft={nft} showPriceContainer={true} showBalanceText={false} />
        </Link>
      );
    }

    if (sourceComponent === "open") {
      return (
        <Link
          href={`/open/${nft.metadata.id}`}
          key={nft.metadata.id}
          className={`${styles.nftContainer} animate-fade-down shadow-lg hover:shadow-slate-400 border-t-8 p-8 m-8  backdrop-brightness-50 rounded-lg cursor-pointer `}
        >
          <NFT nft={nft} showPriceContainer={false} showBalanceText={true} />
        </Link>
      );
    }

    if (sourceComponent === "address") {
      return (
        <Link
         
          key={nft.metadata.id}
          className={`${styles.nftContainer} animate-fade-down shadow-lg hover:shadow-slate-400 border-t-8 p-8 m-8  backdrop-brightness-50 rounded-lg cursor-pointer`} href={""}        >
          <NFT nft={nft} showPriceContainer={false} showBalanceText={false} />
        </Link>
      );
    }

    return null; // If the source component is not one of the specified options
  };

  return (
    <div className={`${styles.nftGridContainer} mt-8 ${customClass}`}>
      {isLoading ? (
        [...Array(20)].map((_, index) => (
          <div key={index} className={styles.nftContainer}>
            <Skeleton key={index} width={"100%"} height="312px" />
          </div>
        ))
      ) : (
        data.map((nft) => getNFTComponent(nft))
      )}
    </div>
  );
}
