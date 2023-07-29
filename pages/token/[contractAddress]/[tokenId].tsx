import {
  MediaRenderer,
  ThirdwebNftMedia,
  useContract,
  useContractEvents,
  useValidDirectListings,
  useValidEnglishAuctions,
  Web3Button,
} from "@thirdweb-dev/react";
import React, { useEffect, useState } from "react";
import Container from "../../../components/Container/Container";
import { GetStaticProps, GetStaticPaths } from "next";
import { NFT, ThirdwebSDK } from "@thirdweb-dev/sdk";
import {
  MARKETPLACE_ADDRESS,
  NETWORK,
  NFT_COLLECTION_ADDRESS,
} from "../../../const/contractAddresses";
import styles from "../../../styles/Token.module.css";
import randomColor from "../../../util/randomColor";
import Skeleton from "../../../components/Skeleton/Skeleton";
import toast, { Toaster } from "react-hot-toast";
import toastStyle from "../../../util/toastConfig";
type Props = {
  nft: NFT;
  contractMetadata: any;
  totalSupply: number; // 
};


export default function TokenPage({ nft, }: Props) {
  const [bidValue, setBidValue] = useState<string>();
  const [buyAmount, setBuyAmount] = useState<number>(1); // Yeni state
  const [totalPrice, setTotalPrice] = useState<string>("0"); // Update the type to string

  // Connect to marketplace smart contract
  const { contract: marketplace, isLoading: loadingContract } = useContract(
    MARKETPLACE_ADDRESS,
    "marketplace-v3"
  );

  // Connect to NFT Collection smart contract
  const { contract: nftCollection } = useContract(NFT_COLLECTION_ADDRESS);

  const { data: directListing, isLoading: loadingDirect } =
    useValidDirectListings(marketplace, {
      tokenContract: NFT_COLLECTION_ADDRESS,
      tokenId: nft.metadata.id,
    });

  // 2. Load if the NFT is for auction
  const { data: auctionListing, isLoading: loadingAuction } =
    useValidEnglishAuctions(marketplace, {
      tokenContract: NFT_COLLECTION_ADDRESS,
      tokenId: nft.metadata.id,
    });

  const quantityInSale = directListing?.[0]?.quantity || 0;

  // Load historical transfer events: TODO - more event types like sale
  const { data: transferEvents, isLoading: loadingTransferEvents } =
    useContractEvents(nftCollection, "Transfer", {
      queryFilter: { filters: { tokenId: nft.metadata.id, }, order: "desc", },
    });


  useEffect(() => {
    if (directListing && directListing[0]) {
      const currencyValuePerToken = directListing[0].currencyValuePerToken;
      const pricePerToken = parseFloat(currencyValuePerToken?.displayValue || "0");
      const totalPrice = (pricePerToken * buyAmount).toFixed(2); // Calculate total price with 2 decimal places
      setTotalPrice(totalPrice);
    }
  }, [directListing, buyAmount]);

  async function createBidOrOffer() {
    let txResult;
    if (!bidValue) {
      toast(`Please enter a bid value`, {
        icon: "❌",
        style: toastStyle,
        position: "bottom-center",
      });
      return;
    }

    if (auctionListing?.[0]) {
      txResult = await marketplace?.englishAuctions.makeBid(
        auctionListing[0].id,
        bidValue
      );
    } else if (directListing?.[0]) {
      txResult = await marketplace?.offers.makeOffer({
        assetContractAddress: NFT_COLLECTION_ADDRESS,
        tokenId: nft.metadata.id,
        totalPrice: bidValue,
      });
    } else {
      throw new Error("No valid listing found for this NFT");
    }

    return txResult;
  }

  async function buyListing() {
    let txResult;

    if (auctionListing?.[0]) {
      txResult = await marketplace?.englishAuctions.buyoutAuction(
        auctionListing[0].id
      );
    } else if (directListing?.[0]) {
      txResult = await marketplace?.directListings.buyFromListing(
        directListing[0].id,
        buyAmount // Satın alma adedini burada kullanın
      );
    } else {
      throw new Error("No valid listing found for this NFT");
    }
    return txResult;
  }

  return (
    <>
      <Toaster position="bottom-center" reverseOrder={false} />
      <Container maxWidth="lg">
        <div className=" flex flex-col items-center md:flex-row justify-center">
          <div className=" md:mr-8 flex justify-center ">
            <ThirdwebNftMedia metadata={nft.metadata} className={`${styles.image2} `} />
          </div>
          <div className={styles.listingContainer}>
            <h1 className={styles.title}>{nft.metadata.name}</h1>
            <div className={styles.descriptionContainer}>
              <h3 className={styles.descriptionTitle}>Description</h3>
              <p className={styles.description}>{nft.metadata.description}</p>
            </div>
            <div className={styles.pricingContainer}>
              {/* Pricing information */}
              <div >

                <div className="text-lg mb-2 md:mb-4 bg-opacity-20 rounded-lg p-4 bg-slate-500"> Price :


                  {loadingContract || loadingDirect || loadingAuction ? (
                    <Skeleton width="120" height="24" />
                  ) : (<>
                    {directListing && directListing[0] ? (
                      <>
                        {directListing[0]?.currencyValuePerToken.displayValue}
                        {" " + directListing[0]?.currencyValuePerToken.symbol}

                      </>
                    ) : auctionListing && auctionListing[0] ? (
                      <>
                        {auctionListing[0]?.buyoutCurrencyValue.displayValue}
                        {" " + auctionListing[0]?.buyoutCurrencyValue.symbol}
                      </>
                    ) : (
                      "Very soon"
                    )}
                  </>
                  )}
                </div>
                <p className="text-lg mb-2 md:mb-4 bg-opacity-20 rounded-lg p-4 bg-slate-500">Quantity in Sale: {quantityInSale}</p>
                <p className="text-lg mb-2 md:mb-4 bg-opacity-20 rounded-lg p-4 bg-slate-500">Total Price: {totalPrice}</p>
              </div>
            </div>

            {loadingContract || loadingDirect || loadingAuction ? (
              <Skeleton width="100%" height="164" />
            ) : (
              <>
                <input
                  className={styles.input}
                  defaultValue={buyAmount.toString()} // 
                  type="number"
                  step={1}
                  min={1}
                  max={directListing?.[0]?.quantity} // 
                  onChange={(e) => {
                    setBuyAmount(Number(e.target.value)); // 
                  }}
                />

                <Web3Button
                  contractAddress={MARKETPLACE_ADDRESS}
                  action={async () => await buyListing()}
                  className={styles.heroCta}
                  onSuccess={() => {
                    toast(`Purchase success!`, {
                      icon: "✅",
                      style: toastStyle,
                      position: "bottom-center",
                    });
                  }}
                  onError={(e) => {
                    toast(`Purchase failed! Reason: ${e.message}`, {
                      icon: "❌",
                      style: toastStyle,
                      position: "bottom-center",
                    });
                  }}
                >
                  Buy
                </Web3Button>

              </>

            )}
          </div>
        </div>
      </Container>
    </>
  );
}

export const getStaticProps: GetStaticProps = async (context) => {
  const tokenId = context.params?.tokenId as string;
  const sdk = new ThirdwebSDK(NETWORK);
  const contract = await sdk.getContract(NFT_COLLECTION_ADDRESS);
  const nft = await contract.erc1155.get(tokenId);
  let contractMetadata;

  try {
    contractMetadata = await contract.metadata.get();
  } catch (e) { }

  return {
    props: {
      nft,
      contractMetadata: contractMetadata || null,
    },
    revalidate: 1, // https://nextjs.org/docs/basic-features/data-fetching/incremental-static-regeneration
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const sdk = new ThirdwebSDK(NETWORK);
  const contract = await sdk.getContract(NFT_COLLECTION_ADDRESS);
  const nfts = await contract.erc1155.getAll();
  const paths = nfts.map((nft) => {
    return {
      params: {
        contractAddress: NFT_COLLECTION_ADDRESS,
        tokenId: nft.metadata.id,
      },
    };
  });

  return {
    paths,
    fallback: "blocking", // can also be true or 'blocking'
  };
};
