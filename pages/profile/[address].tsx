import { useContract, useOwnedNFTs, ConnectWallet, useAddress, ThirdwebNftMedia } from "@thirdweb-dev/react";
import React, { useEffect, useState } from "react";
import Container from "../../components/Container/Container";
import { useRouter } from "next/router";
import styles from "../../styles/Buy.module.css";
import Balance from "../../components/balance";

export default function Open() {
  const { contract } = useContract("0xC07476cAdd6A58720fC5EFda711077757a5aadd9");
  const address = useAddress();
  const { data: nftsData, isLoading: nftsLoading } = useOwnedNFTs(contract, address);
  const router = useRouter();
  const [showLoading, setShowLoading] = useState(true);
  const sourceComponent = router.query.source || "";

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (showLoading) {
    return (
      <div className="backdrop-filter backdrop-blur-lg w-screen h-screen flex justify-center items-center">
        <div className="text-center px-6 py-10 bg-white rounded-xl shadow-xl">
          <p className="text-xl font-bold text-gray-900 mb-4">Loading...</p>
          <div className="w-64 h-4 bg-gray-300 rounded-full overflow-hidden">
            <div className={`${styles.loadbar} h-full bg-blue-500 animate-progress`}></div>
          </div>
        </div>
      </div>
    );
  }

  if (!address) {
    return (
      <div className="backdrop-filter backdrop-blur-lg w-screen h-screen flex justify-center items-center">
        <div className="w-full max-w-2xl px-6 py-10 bg-white rounded-xl shadow-xl">
          <p className="text-center text-xl font-bold text-gray-900 mb-8">
            Please connect your wallet to see your NFTs.
          </p>
          <div className="flex justify-center">
            <ConnectWallet />
          </div>
        </div>
      </div>
    );
  }

  return (
    <Container maxWidth="lg">
      <div className="mt-32 text-center text-xl">
        <h1 className="mb-8 font-bold text-6xl lg:text-7xl text-ellipsis animate-pulse animate-infinite animate-ease-out animate-reverse bg-gradient-to-r from-gray-300 via-gray-500 to-pink-300 text-transparent bg-clip-text">
          Rewards Zone
        </h1>
        <Balance />

        {nftsData && nftsData.length > 0 ? (
          <div className="grid grid-cols-1  md:grid-cols-3 gap-4 mt-8 bg-opacity-50 bg-slate-900 border rounded-2xl  ">
            {nftsData.map((nft) => (
              <div key={nft.metadata.id} className="animate-fade-down shadow-lg  hover:shadow-slate-400 p-2 m-8 backdrop-brightness-50 rounded-lg cursor-pointer">
                <p>{nft.metadata.name}</p>
                <ThirdwebNftMedia metadata={nft.metadata} />
                <p>{nft.metadata.description}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="backdrop-filter backdrop-blur-lg p-24 bg-opacity-50 bg-slate-900 border m-8 rounded-2xl  flex flex-col justify-center items-center">
            <p className="text-center text-xl font-bold text-gray-900 mb-8">No NFTs available.</p>
          </div>
        )}
      </div>
    </Container>
  );
}
