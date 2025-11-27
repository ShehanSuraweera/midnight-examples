import { Moon, Github, ExternalLink, Info, Zap, Shield, Eye } from 'lucide-react';
import { useState } from 'react';
import WalletConnect from './components/WalletConnect';
import MessageForm from './components/MessageForm';
import MessageDisplay from './components/MessageDisplay';
import { submitMessage } from './services/midnight';

function App() {
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState<string>();
  const [balance, setBalance] = useState<string>();

  const handleConnect = (addr: string, bal: string) => {
    setConnected(true);
    setAddress(addr);
    setBalance(bal);
  };

  const handleSubmitMessage = async (message: string) => {
    // In a real implementation, this would interact with the Lace wallet
    // and submit a transaction to the Midnight network
    console.log('Submitting message:', message);
    
    const success = await submitMessage(message);
    
    if (success) {
      alert('Message submitted successfully! (Demo mode - check console)');
    } else {
      alert('Failed to submit message');
    }
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="bg-midnight-500/20 p-3 rounded-xl">
                <Moon className="w-8 h-8 text-midnight-400" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-midnight-300 bg-clip-text text-transparent">
                  Midnight Hello World
                </h1>
                <p className="text-white/60 mt-1">
                  Privacy-Preserving DApp Demo
                </p>
              </div>
            </div>
            
            <a
              href="https://github.com/ShehanSuraweera/midnight-examples"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary flex items-center gap-2"
            >
              <Github className="w-4 h-4" />
              View on GitHub
            </a>
          </div>

          {/* Info Banner */}
          <div className="card p-6">
            <div className="flex items-start gap-4">
              <Info className="w-5 h-5 text-midnight-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold mb-2">About This DApp</h3>
                <p className="text-white/70 text-sm leading-relaxed">
                  This is a demonstration of Midnight Network's privacy-preserving technology.
                  Store and retrieve messages on the blockchain using zero-knowledge proofs.
                  Your interactions are secured by ZKPs, ensuring data confidentiality while
                  maintaining verifiability.
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="card p-6">
            <div className="bg-midnight-500/20 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-midnight-400" />
            </div>
            <h3 className="font-semibold mb-2">Zero-Knowledge Proofs</h3>
            <p className="text-white/60 text-sm">
              Transactions are validated without revealing sensitive data, ensuring privacy by default.
            </p>
          </div>

          <div className="card p-6">
            <div className="bg-midnight-500/20 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
              <Eye className="w-6 h-6 text-midnight-400" />
            </div>
            <h3 className="font-semibold mb-2">Selective Disclosure</h3>
            <p className="text-white/60 text-sm">
              Choose what information to reveal while keeping other data private on the blockchain.
            </p>
          </div>

          <div className="card p-6">
            <div className="bg-midnight-500/20 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-midnight-400" />
            </div>
            <h3 className="font-semibold mb-2">Fast & Secure</h3>
            <p className="text-white/60 text-sm">
              Transactions are processed quickly while maintaining the highest security standards.
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-6 mb-12">
          {/* Wallet Connection */}
          <div className="lg:col-span-1">
            <WalletConnect
              onConnect={handleConnect}
              connected={connected}
              address={address}
              balance={balance}
            />

            {/* Quick Links */}
            <div className="card p-6 mt-6">
              <h3 className="font-semibold mb-4">Resources</h3>
              <div className="space-y-3">
                <a
                  href="https://midnight.network/test-faucet"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between text-sm hover:text-midnight-400 transition-colors"
                >
                  <span>Get Test Tokens</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
                <a
                  href="https://docs.midnight.network/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between text-sm hover:text-midnight-400 transition-colors"
                >
                  <span>Documentation</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
                <a
                  href="https://midnight.network/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between text-sm hover:text-midnight-400 transition-colors"
                >
                  <span>Midnight Network</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Message Interaction */}
          <div className="lg:col-span-2 space-y-6">
            <MessageDisplay />
            <MessageForm
              onSubmit={handleSubmitMessage}
              disabled={!connected}
            />
          </div>
        </div>

        {/* How It Works */}
        <div className="card p-8">
          <h3 className="font-semibold text-xl mb-6">How It Works</h3>
          <div className="grid md:grid-cols-4 gap-6">
            <div>
              <div className="bg-midnight-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-semibold mb-3">
                1
              </div>
              <h4 className="font-semibold mb-2">Connect Wallet</h4>
              <p className="text-white/60 text-sm">
                Use your Lace Midnight wallet to authenticate and interact with the DApp.
              </p>
            </div>

            <div>
              <div className="bg-midnight-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-semibold mb-3">
                2
              </div>
              <h4 className="font-semibold mb-2">Write Message</h4>
              <p className="text-white/60 text-sm">
                Enter your message that you want to store on the Midnight blockchain.
              </p>
            </div>

            <div>
              <div className="bg-midnight-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-semibold mb-3">
                3
              </div>
              <h4 className="font-semibold mb-2">Generate Proof</h4>
              <p className="text-white/60 text-sm">
                A zero-knowledge proof is generated to validate your transaction privately.
              </p>
            </div>

            <div>
              <div className="bg-midnight-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-semibold mb-3">
                4
              </div>
              <h4 className="font-semibold mb-2">On-Chain Storage</h4>
              <p className="text-white/60 text-sm">
                Your message is permanently stored on the blockchain with privacy guarantees.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-white/50 text-sm">
          <p>Built with 🌙 on Midnight Network</p>
          <p className="mt-2">
            Learn more about privacy-preserving DApps at{' '}
            <a
              href="https://midnight.network/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-midnight-400 hover:text-midnight-300 transition-colors"
            >
              midnight.network
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;

