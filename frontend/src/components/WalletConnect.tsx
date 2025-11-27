import { Moon, Wallet, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { checkLaceWallet, connectLaceWallet } from '../services/midnight';

interface WalletConnectProps {
  onConnect: (address: string, balance: string) => void;
  connected: boolean;
  address?: string;
  balance?: string;
}

export default function WalletConnect({ onConnect, connected, address, balance }: WalletConnectProps) {
  const [hasLace, setHasLace] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setHasLace(checkLaceWallet());
  }, []);

  const handleConnect = async () => {
    setConnecting(true);
    setError(null);

    try {
      const result = await connectLaceWallet();
      
      if (result) {
        onConnect(result.address, result.balance);
      } else {
        setError('Failed to connect to Lace wallet');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Connection failed');
    } finally {
      setConnecting(false);
    }
  };

  if (!hasLace) {
    return (
      <div className="card p-6">
        <div className="flex items-center gap-3 text-yellow-400 mb-4">
          <AlertCircle className="w-5 h-5" />
          <h3 className="font-semibold">Lace Wallet Not Found</h3>
        </div>
        <p className="text-white/70 mb-4">
          You need the Lace Midnight Preview wallet extension to use this DApp.
        </p>
        <a
          href="https://chromewebstore.google.com/detail/lace-beta/hgeekaiplokcnmakghbdfbgnlfheichg"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary inline-block text-center"
        >
          Install Lace Wallet
        </a>
      </div>
    );
  }

  if (connected && address) {
    return (
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Wallet className="w-5 h-5 text-green-400" />
            <h3 className="font-semibold">Wallet Connected</h3>
          </div>
          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
        </div>
        
        <div className="space-y-3">
          <div>
            <p className="text-white/50 text-sm mb-1">Address</p>
            <p className="font-mono text-sm bg-white/5 p-2 rounded border border-white/10 truncate">
              {address}
            </p>
          </div>
          
          <div>
            <p className="text-white/50 text-sm mb-1">Balance</p>
            <p className="font-semibold text-lg">
              {balance} <span className="text-white/50 text-sm">tDUST</span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card p-6">
      <div className="flex items-center gap-3 mb-4">
        <Moon className="w-5 h-5 text-midnight-400" />
        <h3 className="font-semibold">Connect Your Wallet</h3>
      </div>
      
      <p className="text-white/70 mb-6">
        Connect your Lace wallet to interact with the Midnight Hello World contract.
      </p>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-4">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      <button
        onClick={handleConnect}
        disabled={connecting}
        className="btn-primary w-full"
      >
        {connecting ? (
          <span className="flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            Connecting...
          </span>
        ) : (
          'Connect Wallet'
        )}
      </button>
    </div>
  );
}
