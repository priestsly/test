import { useContract, useAddress, useNFTs, ConnectWallet } from "@thirdweb-dev/react";
import React, { useEffect, useState } from "react";
import Container from "../components/Container/Container";
import { NFT_COLLECTION_ADDRESS, nftIds, counts } from "../const/contractAddresses";
import { useRouter } from "next/router";
import styles from "../styles/Buy.module.css";
import NFTGrid from "../components/NFT/NFTGrid";

export default function Open() {
  const { contract } = useContract(NFT_COLLECTION_ADDRESS);
  const address = useAddress();
  const { data: nftsData, isLoading: nftsLoading } = useNFTs(contract, { start: nftIds[0], count: counts[0] });
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
      <div className="backdrop-filter backdrop-blur-lg p-36 flex justify-center items-center">
        <div className="text-center px-6 py-10 bg-white rounded-xl shadow-xl">
          <p className="text-xl font-bold text-gray-900 mb-4">Loading...</p>
          <div className="w-64 h-4 bg-gray-300 rounded-full overflow-hidden">
            <div className={`${styles.loadbar} h-full bg-blue-500 animate-progress`}></div>
          </div>
        </div>
      </div>
    );
  }



  if (!nftsData || nftsData.length === 0) {
    return (
      <div className="backdrop-filter backdrop-blur-lg w-screen h-screen flex justify-center items-center">
        {/* Gerekli içerik */}
      </div>
    );
  }

  return (
    <Container maxWidth="lg">
     
      <div className=" text-center text-xl ">
        <h1 className="mb-8 font-bold text-6xl lg:text-7xl text-ellipsis animate-pulse animate-infinite animate-ease-out animate-reverse bg-gradient-to-r from-gray-300 via-gray-500 to-pink-300 text-transparent bg-clip-text">
          Buy NFTs
        </h1>

        <p className="">Browse which NFTs are available from the collection.</p>
        <div className="lg:ml-16 grid grid-cols-1">
        <NFTGrid
          data={nftsData} 
          isLoading={nftsLoading}
          customClass={sourceComponent === "buy" ? "buy-grid" : "sold-out-grid"}
        />
      </div>
      </div>
    </Container>
  );
}
