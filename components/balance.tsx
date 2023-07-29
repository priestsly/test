import { useAddress, useContract, useTokenBalance } from "@thirdweb-dev/react";

export default function Token() {
  const address = useAddress();
  const { contract: tokenContract } = useContract("0x254662F3cCf64E5Ac16079b31325D04238962d1B");
  const { data: currentBalance, isLoading } = useTokenBalance(tokenContract, address);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex justify-center mt-4">
      <h3 className="text-lg p-4 border border-opacity-30 bg-opacity-30 backdrop-blur-md w-64 bg-slate-700 rounded-xl ">Your Balance: {currentBalance === undefined
        ? "Loading..."
        : "" +
        currentBalance?.displayValue +
        " " +
        currentBalance?.symbol +
        ""}</h3>
      <p>

      </p>
    </div>
  );
}
