import React from "react";


export interface WalletCardProps {
  isConnected: boolean;
  walletAddress: string | null;
  onConnect: () => void;
  onDisconnect: () => void;
}

const WalletCard: React.FC<WalletCardProps> = ({
  isConnected,
  walletAddress,
  onConnect,
  onDisconnect,
}) => {
  return (
    <div className="w-full max-w-md bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl shadow-purple-500/10 border border-gray-700 p-8 transform transition-all duration-500 hover:scale-105">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-100">
          Connection Status
        </h2>
        <div
          className={`flex items-center space-x-2 ${
            isConnected ? "text-green-400" : "text-red-400"
          }`}
        >
          <span className="text-sm font-medium">
            {isConnected ? "Connected" : "Disconnected"}
          </span>
        </div>
      </div>

      <div className="bg-gray-900 rounded-lg p-6 min-h-[120px] flex flex-col justify-center items-center text-center">
        {isConnected && walletAddress ? (
          <>
            <p className="text-sm text-gray-400 mb-2">Wallet Address:</p>
            <p
              className="text-lg font-mono break-all text-purple-300"
              title={walletAddress}
            >
              {walletAddress}
            </p>
          </>
        ) : (
          <p className="text-gray-400">
            Please connect your wallet to proceed.
          </p>
        )}
      </div>

      <div className="mt-8">
        {isConnected ? (
          <button
            className="w-full bg-red-600 hover:bg-red-700 focus:ring-red-500"
            onClick={onDisconnect}
          >
            Disconnect Wallet
          </button>
        ) : (
          <button
            onClick={onConnect}
            className="w-full bg-purple-600 hover:bg-purple-700 focus:ring-purple-500"
          >
            Connect Wallet
          </button>
        )}
      </div>
    </div>
  );
};

export default WalletCard;