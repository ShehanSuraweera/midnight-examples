import { MessageSquare, RefreshCw, AlertTriangle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getContractInfo, queryContractMessage } from '../services/midnight';

export default function MessageDisplay() {
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [contractAddress, setContractAddress] = useState<string | null>(null);

  useEffect(() => {
    loadContractInfo();
  }, []);

  const loadContractInfo = async () => {
    const info = await getContractInfo();
    if (info) {
      setContractAddress(info.contractAddress);
      fetchMessage(info.contractAddress);
    }
  };

  const fetchMessage = async (address: string) => {
    setLoading(true);
    setError(null);

    try {
      const msg = await queryContractMessage(address);
      setMessage(msg);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch message');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    if (contractAddress) {
      fetchMessage(contractAddress);
    }
  };

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-midnight-400" />
          Current Message
        </h3>
        <button
          onClick={handleRefresh}
          disabled={loading || !contractAddress}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50"
          title="Refresh message"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {!contractAddress ? (
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2 text-yellow-400 mb-2">
            <AlertTriangle className="w-4 h-4" />
            <p className="font-semibold">Contract Not Deployed</p>
          </div>
          <p className="text-sm text-white/70">
            No deployment.json found. Please deploy the contract first using:
          </p>
          <code className="block mt-2 bg-black/30 p-2 rounded text-sm font-mono">
            npm run deploy
          </code>
        </div>
      ) : loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="flex items-center gap-3 text-white/70">
            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            <span>Loading message...</span>
          </div>
        </div>
      ) : error ? (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      ) : message ? (
        <div className="bg-white/5 border border-white/10 rounded-lg p-6">
          <p className="text-white/90 text-lg leading-relaxed">
            "{message}"
          </p>
          <p className="text-white/50 text-xs mt-4">
            Stored on Midnight Blockchain
          </p>
        </div>
      ) : (
        <div className="bg-white/5 border border-white/10 rounded-lg p-6 text-center">
          <p className="text-white/50">No message found</p>
          <p className="text-white/30 text-sm mt-2">
            Store a message to see it here
          </p>
        </div>
      )}

      {contractAddress && (
        <div className="mt-4 pt-4 border-t border-white/10">
          <p className="text-white/50 text-xs mb-1">Contract Address</p>
          <p className="font-mono text-xs bg-white/5 p-2 rounded border border-white/10 truncate">
            {contractAddress}
          </p>
        </div>
      )}
    </div>
  );
}
