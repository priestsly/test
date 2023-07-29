import {
  ThirdwebNftMedia,
  useMetadata,
  useContract,
} from "@thirdweb-dev/react";
import React from "react";
import styles from "../styles/Home.module.css";

type Props = {
  reward: {
    contractAddress: string;
    quantityPerReward: string | number;
  };
};

export default function ERC20RewardBox({ reward }: Props) {
  const { contract: token } = useContract(reward.contractAddress);
  const { data } = useMetadata(token);

  return (
    <div className=" shadow-lg bg-slate-600 bg-opacity-50 hover:shadow-slate-400 border-t-8 p-4 m-4 border text-center animate-pulse rounded-lg">
      <p className="mb-2 mt-2" >ERC-20 Reward</p>
      <p>
        Reward amount: {reward.quantityPerReward} 
      </p>
    </div>
  );
}
