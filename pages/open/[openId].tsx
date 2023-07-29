import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  ConnectWallet,
  NFT,
  ThirdwebNftMedia,
  useAddress,
  useContract,
  useNFT,
  useNFTBalance,
  useOwnedNFTs,
} from '@thirdweb-dev/react';
import { PackRewards } from '@thirdweb-dev/sdk/dist/declarations/src/evm/schema';
import Loader from '../../components/Loader';
import ERC1155RewardBox from '../../components/ERC1155RewardBox';
import ERC20RewardBox from '../../components/ERC20RewardBox';
import { NFT_COLLECTION_ADDRESS, nftStatus } from '../../const/contractAddresses';
import styles from "../../styles/Token.module.css";
import Container from '../../components/Container/Container';
import { Toaster } from 'react-hot-toast';
import Transfer from '../transfer';


type Props = {
  nft: NFT;
  contractMetadata: any;
  totalSupply: number; // 
};

const OpenNFTPage = () => {
  const router = useRouter();
  const { openId } = router.query;
  const address = useAddress();
  const { contract: pack } = useContract(NFT_COLLECTION_ADDRESS, 'pack');
  const { data: nfts } = useOwnedNFTs(pack, address);
  const [openedPackRewards, setOpenedPackRewards] = useState<PackRewards>();
  const [isLoading, setIsLoading] = useState(true);
  const [isOpening, setIsOpening] = useState(false);
  const tokenId = typeof openId === 'string' ? openId : openId?.[0] ?? '';
  const { contract } = useContract(NFT_COLLECTION_ADDRESS);
  const { data: nft, isLoading: loadering } = useNFT(contract, tokenId);
  const { data: ownerBalance, isLoading: balanceLoading, error: balanceError, } = useNFTBalance(contract, address, tokenId);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [rewardCount, setRewardCount] = useState(1);


  let balanceText = '';

  if (!balanceLoading && ownerBalance) {
    balanceText = ownerBalance.toString();
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);


  const handleOpen = async (rewardCount: number) => {
    setIsOpening(true);
    setIsLoading(true); // Move it here

    try {
      if (nfts && nfts.length > 0) {

        const nftId = Number(openId); // Convert the openId to a number
        const openedRewards = await pack?.open(nftId, rewardCount);
        if (openedRewards) {
          setOpenedPackRewards(openedRewards);
        }
      }
    } catch (error) {
      alert('The transaction was cancelled or failed.');
    }
    setIsLoading(false);
    setIsOpening(false);
  };


  if (isLoading) {
    return <Loader message={isOpening ? 'Opening rewards...' : 'Loading...'} />;
  }

  if (!address) {
    return (
      <div className="backdrop-filter backdrop-blur-lg w-full h-96 flex justify-center items-center">
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
            You don&apos;t own any NFTs. <br></br>Please purchase an NFT first.
          </p>
          <div className="flex justify-center">
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
              onClick={() => router.push('/buy')}
            >
              Purchase NFT
            </button>
          </div>
        </div>
      </div>
    );
  }

  const buttonStatus = nftStatus[tokenId] || 'OPEN';

  const openTransferModal = () => {
    setIsTransferModalOpen(true);
  };

  const closeTransferModal = () => {
    setIsTransferModalOpen(false);
  };



  return (
    <>
      <Toaster position="bottom-center" reverseOrder={false} />
      <Container maxWidth="lg">


        <div className=" flex flex-col items-center md:flex-row justify-center">
          <div className="md:mr-8 flex justify-center">
            <div className="animate-fade-down rounded-lg cursor-pointer">
              {!isLoading && nft ? (
                <ThirdwebNftMedia metadata={nft.metadata} className={`${styles.image2} `} />
              ) : (<p>Loading...</p>)}
            </div>
          </div>
          <div className={styles.listingContainer}>
            <h3 className="mb-8 font-bold text-4xl  text-center shadow-2xl shadow-current text-ellipsis bg-gradient-to-r from-pink-300 via-pink-500 to-pink-300 text-transparent bg-clip-text">
              {nft?.metadata.name}
            </h3>
            <p className="text-center">{nft?.metadata?.description}</p>


            <div className={styles.pricingContainer}>
              <p className="text-lg mb-2  text-center bg-opacity-20 rounded-lg p-4 bg-slate-500">
                You Have: {balanceText}
              </p>
              <p className='flex flex-row items-center justify-center'>
                <p className='text-lg mb-2  mr-2 bg-opacity-20 rounded-lg p-4 bg-red-500'>Amount</p>
                <input
                  className="text-lg mb-2 text-center w-screen bg-opacity-20 rounded-lg p-4 bg-slate-500"
                  type="number"
                  min="1"
                  max="10"
                  value={rewardCount}
                  onChange={(e) => setRewardCount(parseInt(e.target.value))}
                />
              </p>

              <button
                className="text-2xl    rounded-lg p-4 text-black text-bold  bg-slate-200 hover:animate-pulse"
                onClick={() => handleOpen(rewardCount)}
                disabled={buttonStatus === 'CLOSE' || isLoading}
              >
                {isLoading ? 'Opening...' : buttonStatus === 'CLOSE' ? 'Closed' : 'Open'}
              </button>

              <button
                className="text-xl mb-2 mt-2  md:mb-4 rounded-lg p-4 text-white bg-opacity-70 text-bold bg-red-500 hover:animate-pulse"
                onClick={openTransferModal}
              >
                Transfer
              </button>
            </div>
          </div>
        </div>

        {/* Rewards Box */}
        <div className="flex flex-col mt-8 sm:flex-col md:flex-row w-full justify-center">

          {/* ERC 20 Rewards */}
          {openedPackRewards && openedPackRewards?.erc20Rewards && openedPackRewards?.erc20Rewards?.length > 0 && (
            <div className="p-2">
              <div className="grid flex-col md:flex-row shadow-lg hover:shadow-slate-400 border-t-8  w-full border backdrop-brightness-50 rounded-lg">
                <h3 className="py-4 border-b text-center  rounded-t-md text-white backdrop-brightness-70 pl-28 pr-28 bg-purple-950 bg-opacity-20">ERC-20 Tokens</h3>
                <div className="grid grid-cols-1  h-full">
                  {openedPackRewards?.erc20Rewards?.map((reward, i) => (
                    <ERC20RewardBox reward={reward} key={i} />
                  ))}
                </div>
              </div>
            </div>
          )}
          {/* ERC 20 Rewards End */}

          {/* ERC 1155 Rewards */}
          {openedPackRewards && openedPackRewards?.erc1155Rewards && openedPackRewards?.erc1155Rewards?.length > 0 && (
            <div className="p-2">
              <div className="grid flex-col md:flex-row shadow-lg hover:shadow-slate-400 border-t-8 w-full border backdrop-brightness-50 rounded-lg">
                <h3 className="py-4 border-b text-center rounded-t-md text-white backdrop-brightness-70 pl-28 pr-28 bg-purple-950 bg-opacity-20">ERC-1155 Tokens</h3>
                <div className="flex flex-wrap justify-center">
                  {openedPackRewards?.erc1155Rewards.map((reward, i) => (
                    <ERC1155RewardBox reward={reward} key={i} />
                  ))}
                </div>
              </div>
            </div>
          )}
          {/* ERC 1155 Rewards End */}
        </div>
        {/* Rewards Box End */}

        {/* Transfer Modal */}
        {isTransferModalOpen && (
          <div className="fixed backdrop-blur-md inset-0 flex items-center justify-center z-50">
            <div className="  border bg-slate-800 items-center rounded-xl p-8 bg-opacity-90">
              <p className='text-center text-bold text-2xl'>Transfer NFT </p>
              <Transfer tokenId={Number(tokenId)} />
              <button className=" text-lg mb-2 text-center text-white w-64 md:mb-4 md:w-64 mt-2 rounded-xl p-2 bg-red-800" onClick={closeTransferModal}>Close</button>
            </div>
          </div>
        )
        }
      </Container>

    </>
  );
};


export default OpenNFTPage;

