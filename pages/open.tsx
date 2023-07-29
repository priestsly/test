import { useContract, useOwnedNFTs, ConnectWallet, useAddress, useNFTBalance } from "@thirdweb-dev/react";
import React, { useEffect, useState } from "react";
import Container from "../components/Container/Container";
import NFTGrid from "../components/NFT/NFTGrid";
import { NFT_COLLECTION_ADDRESS } from "../const/contractAddresses";
import { useRouter } from "next/router";
import styles from "../styles/Buy.module.css";
import Balance from "../components/balance";
export default function Open() {
  const { contract } = useContract(NFT_COLLECTION_ADDRESS);
  const address = useAddress();
  const { data: nfts, isLoading: nftsLoading } = useOwnedNFTs(contract, address);
  const router = useRouter();
  const [showLoading, setShowLoading] = useState(true);
  const sourceComponent = router.query.source || '';


  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (showLoading) {
    return (
      <div className="backdrop-filter backdrop-blur-lg  m-24 flex justify-center items-center">
        <div className="text-center  px-6 py-10 bg-white rounded-xl shadow-xl">
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

  if (!nfts || nfts.length === 0) {
    return (
      <div className="backdrop-filter backdrop-blur-lg w-screen h-screen flex justify-center items-center">
        <div className="w-full max-w-2xl px-6 py-10 bg-white rounded-xl shadow-xl">
          <p className="text-center text-xl font-bold text-gray-900 mb-8">
            You don&apos;t own any NFTs. Please purchase an NFT first.
          </p>
          <div className="flex justify-center">
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
              onClick={() => router.push("/buy")}
            >
              Purchase NFT
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Container maxWidth="lg">
      <div className="mt-24 text-center text-xl ">
        <h1 className="mb-8 font-bold sm:text-lg lg:text-7xl text-ellipsis animate-pulse animate-infinite animate-ease-out animate-reverse bg-gradient-to-r from-pink-300 via-pink-500 to-pink-300 text-transparent bg-clip-text">
          Inventory
        </h1>
        <p >Browse which NFTs are available from the collection.</p>
        <p className=""></p>
        <Balance/>

        <NFTGrid
        data={nfts}
        isLoading={nftsLoading}
        customClass={sourceComponent === "open" ? "open-grid" : "sold-out-grid"}

        />
      </div>
    </Container>
  );
}
