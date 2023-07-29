import React, { useState, useEffect } from 'react';
import { Web3Button, useContract, useTransferNFT } from '@thirdweb-dev/react';
import { NFT_COLLECTION_ADDRESS } from '../const/contractAddresses';
import Loader from '../components/Loader';

const Transfer = ({ tokenId }: { tokenId: number }) => {
  const { contract } = useContract(NFT_COLLECTION_ADDRESS);
  const { mutateAsync: transferNFT, isLoading: transferLoading, error } = useTransferNFT(contract);
  const [walletAddress, setWalletAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Track loading state
  const [isSuccess, setIsSuccess] = useState(false); // Track success state
  const [isCancelled, setIsCancelled] = useState(false); // Track cancellation state

  const handleTransfer = async () => {
    setIsLoading(true); // Start loading

    try {
      await transferNFT({
        to: walletAddress,
        tokenId: tokenId,
        amount: amount,
      });
      setIsSuccess(true); // Set success state
      setWalletAddress('');
      setAmount('1');
    } catch (error) {
      setIsCancelled(true); // Set cancellation state
      // Handle error
    }

    setIsLoading(false); // Stop loading
  };

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (isSuccess || isCancelled) {
      timer = setTimeout(() => {
        setIsSuccess(false);
        setIsCancelled(false);
      }, 2000); // Set the duration for the messages to be displayed (2 seconds in this example)
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [isSuccess, isCancelled]);

  return (
    <div className="grid items-center justify-center w-64 mt-2">
      {isLoading ? (
        <><h1 className='p-5 rounded-lg text-center  text-White'>Please Wait</h1>
          <h1 className='text-2xl mt-2 text-center text-red-800 text-bold'>WARNING</h1>
          <input
            className=" text-xs mb-2 mt-2 text-center w-64 md:mb-4 md:w-64 bg-opacity-20 rounded-lg p-4 bg-slate-500"
            value={walletAddress}
          />
          <p className=' text-sm text-center'>This transaction is irreversible. <br></br>Please make sure to enter the wallet address correctly</p>
        </>
      ) : (
        <>
          {isSuccess && (
            <h1 className=' p-5 rounded-lg shadow-lg text-red'>OK</h1>
          )}
          {isCancelled && (
            <h1 className=' p-5 rounded-lg shadow-lg text-red'>Failed</h1>
          )}

          {!isSuccess && !isCancelled && (
            <>
              <input
                type="text"
                className="text-lg  text-center w-64 md:w-64 flex bg-opacity-20 rounded-lg p-2 bg-slate-500"
                placeholder="Wallet ID"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                onPaste={(e) => {
                  const pastedText = e.clipboardData.getData('text');
                  setWalletAddress(pastedText);
                }}
              />
              <span
                className="text-sm text-blue-500 cursor-pointer text-center mt-2 mb-2"
                onClick={() => navigator.clipboard.readText().then(setWalletAddress)}
              >
                Paste Adress
              </span>

              <input
                type="number"
                className="text-lg mb-2 text-center w-64 md:mb-4 md:w-64 bg-opacity-20 rounded-lg p-2 bg-slate-500"
                placeholder="Amount"
                value={amount}
                min={1}
                onChange={(e) => setAmount(e.target.value)}
              />
              <Web3Button
                contractAddress={NFT_COLLECTION_ADDRESS}
                action={handleTransfer}
                isDisabled={!walletAddress || !amount || transferLoading}
              >
                Transfer
              </Web3Button>

            </>
          )}
        </>
      )}
    </div>
  );
};

export default Transfer;
