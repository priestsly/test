import { ThirdwebNftMedia, useContract, useNFT } from "@thirdweb-dev/react";
import { BigNumber } from "ethers";
import React from "react";

type Props = {
  reward: {
    tokenId: string | number | bigint | BigNumber;
    contractAddress: string;
    quantityPerReward: string | number | bigint | BigNumber;
  };
};

export default function ERC115RewardBox({ reward }: Props) {
  const { contract: edition } = useContract(reward.contractAddress);
  const { data } = useNFT(edition, reward.tokenId);

  return (
    <div className=" shadow-lg bg-slate-600 bg-opacity-50 hover:shadow-slate-400 border-t-8 p-4 m-4 border text-center rounded-lg">
      {data && (
        <>
          <ThirdwebNftMedia
            metadata={data?.metadata}
            className="{styles.nftMedia}"
          />
          <h3>{data?.metadata.name}</h3>
        </>
      )}
    </div>
  );
}
