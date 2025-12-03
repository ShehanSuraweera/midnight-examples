// Simple demonstration API for interacting with the deployed contract
// Note: For a full implementation, you would need the actual Midnight SDK integration

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const INDEXER_URL = 'https://indexer.testnet-02.midnight.network/api/v1/graphql';

export interface ContractInfo {
  contractAddress: string;
  deployedAt: string;
}

// TypeScript declarations for Lace Midnight wallet
declare global {
  interface Window {
    midnight?: {
      mnLace: {
        enable: () => Promise<MidnightWalletAPI>;
        isEnabled: () => Promise<boolean>;
      };
    };
  }
}

interface MidnightWalletAPI {
  state: () => Promise<WalletState>;
  balances?: () => Promise<{
    unshielded: bigint;
    shielded: bigint;
  }>;
  getBalance?: () => Promise<string>;
  signData?: (address: string, payload: string) => Promise<SignDataResult>;
  submitTx?: (tx: any) => Promise<TransactionResult>;
  balanceTransaction?: (tx: any, newCoins: any) => Promise<any>;
  proveTransaction?: (tx: any) => Promise<any>;
  submitTransaction?: (tx: any) => Promise<string>;
  [key: string]: any;
}

interface WalletState {
  address?: string;
  shieldedAddress?: string;
  balance?: number | string;
  balances?: Record<string, bigint>;
  coinPublicKey?: string;
  encryptionPublicKey?: string;
  coins?: any[];
  syncProgress?: {
    synced: boolean;
    lag?: {
      applyGap?: bigint;
      sourceGap?: bigint;
    };
  };
}

interface SignDataResult {
  signature: string;
  key: string;
}

interface TransactionResult {
  txHash: string;
  success: boolean;
  txId?: string;
  blockHeight?: number;
}

// Store wallet API instance globally for reuse
let walletApiInstance: MidnightWalletAPI | null = null;

export async function getContractInfo(): Promise<ContractInfo | null> {
  try {
    const response = await fetch('/deployment.json');
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch contract info:', error);
    return null;
  }
}

export async function queryContractMessage(contractAddress: string): Promise<string | null> {
  try {
    const query = `
      query GetContractState($address: HexEncoded!) {
        contractState(address: $address) {
          data
        }
      }
    `;

    const response = await fetch(INDEXER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables: { address: contractAddress },
      }),
    });

    const result = await response.json();
    
    if (result.data?.contractState?.data) {
      // Parse the contract state data
      const data = result.data.contractState.data;
      // Helper to decode base64 into a UTF-8 string in the browser
      const decodeBase64ToString = (b64: string): string => {
        try {
          // atob produces a binary string where each character's charCode is a byte
          const binary = typeof atob !== 'undefined' ? atob(b64) : '';
          const len = binary.length;
          const bytes = new Uint8Array(len);
          for (let i = 0; i < len; i++) {
            bytes[i] = binary.charCodeAt(i);
          }
          return new TextDecoder().decode(bytes);
        } catch {
          // If decoding fails, return the original string
          return b64;
        }
      };

      // Try to extract message from the ledger data
      if (data.message) {
        const msg = data.message;

        // If it's already a string, attempt base64 decode (common for binary payloads)
        if (typeof msg === 'string') {
          // Basic base64 validation (may be plain text too)
          const base64Pattern = /^[A-Za-z0-9+/=]+$/;
          if (base64Pattern.test(msg)) {
            return decodeBase64ToString(msg);
          }
          return msg;
        }

        // If it's an array of bytes or a Uint8Array, decode with TextDecoder
        if (Array.isArray(msg) || msg instanceof Uint8Array) {
          const bytes = msg instanceof Uint8Array ? msg : Uint8Array.from(msg as any);
          try {
            return new TextDecoder().decode(bytes);
          } catch {
            // Fallback: convert byte values to chars
            return Array.from(bytes).map(b => String.fromCharCode(b)).join('');
          }
        }

        // Fallback for any other types
        return String(msg);
      }
      return 'No message found';
    }
    
    return null;
  } catch (error) {
    console.error('Failed to query contract:', error);
    return null;
  }
}

export async function submitMessage(
  message: string,
  contractAddress: string
): Promise<TransactionResult | null> {
  try {
    if (!walletApiInstance) {
      throw new Error('Wallet not connected. Please connect your wallet first.');
    }

    console.log('Preparing to submit message:', message);

    // In a real implementation with full SDK integration:
    // 1. Load the contract instance
    // 2. Call the contract's storeMessage method
    // 3. The wallet API will handle balancing, proving, and submission
    
    // For now, this is a placeholder that shows the expected flow
    // You would need to integrate with your contract's callTx.storeMessage
    
    // Example of what the full implementation would look like:
    /*
    const tx = await contractInstance.callTx.storeMessage(message);
    return {
      txHash: tx.public.txHash,
      success: true,
      txId: tx.public.txId,
      blockHeight: tx.public.blockHeight,
    };
    */

    console.warn('Full contract integration not yet implemented');
    console.log('Message would be:', message);
    console.log('Contract address:', contractAddress);
    
    return {
      txHash: '0x' + Math.random().toString(16).slice(2),
      success: true,
      txId: 'placeholder-tx-id',
      blockHeight: 0,
    };
  } catch (error) {
    console.error('Failed to submit message:', error);
    throw error;
  }
}

export function checkLaceWallet(): boolean {
  return typeof window !== 'undefined' && 
         typeof window.midnight !== 'undefined' &&
         typeof window.midnight.mnLace !== 'undefined';
}

export async function connectLaceWallet(): Promise<{ address: string; balance: string } | null> {
  try {
    if (!window.midnight?.mnLace) {
      throw new Error('Lace Midnight Preview wallet not found. Please install the extension.');
    }

    // Check if already enabled
    const isEnabled = await window.midnight.mnLace.isEnabled();
    
    console.log('Wallet enabled status:', isEnabled);

    // Enable the wallet (this will prompt user for permission if not already enabled)
    const walletApi = await window.midnight.mnLace.enable();
    
    if (!walletApi) {
      throw new Error('Failed to enable Lace wallet');
    }

    // Store the wallet API instance for later use
    walletApiInstance = walletApi;

    // Get the current wallet state
    const state = await walletApi.state();
    
    if (!state) {
      throw new Error('Failed to get wallet state');
    }

    console.log('Wallet state:', state);

    // Extract address and balance from state
    const address = state.shieldedAddress || state.address || 'Unknown';
    
    // Get balance - try multiple methods
    let balance = '0';
    
    if (state.balance !== undefined) {
      balance = state.balance.toString();
    } else if (state.balances) {
      // Get native token balance (tDUST)
      const nativeTokenBalance = state.balances[''] || state.balances['native'] || 0n;
      balance = nativeTokenBalance.toString();
    } else if (walletApi.getBalance) {
      balance = await walletApi.getBalance();
    } else if (walletApi.balances) {
      const balances = await walletApi.balances();
      balance = (balances.shielded + balances.unshielded).toString();
    }

    console.log('Wallet connected:', { address, balance, state });

    return { address, balance };
  } catch (error) {
    console.error('Failed to connect to Lace wallet:', error);
    throw error;
  }
}

// Get the wallet API instance
export function getWalletAPI(): MidnightWalletAPI | null {
  return walletApiInstance;
}

// Additional helper function to get wallet state after connection
export async function getWalletState(): Promise<WalletState | null> {
  try {
    if (!walletApiInstance) {
      // Try to reconnect
      if (!window.midnight?.mnLace) {
        return null;
      }

      const isEnabled = await window.midnight.mnLace.isEnabled();
      if (!isEnabled) {
        return null;
      }

      walletApiInstance = await window.midnight.mnLace.enable();
    }

    const state = await walletApiInstance.state();
    return state;
  } catch (error) {
    console.error('Failed to get wallet state:', error);
    return null;
  }
}

// Query transaction by hash
export async function queryTransactionByHash(txHash: string): Promise<any> {
  try {
    const query = `
      query ($hash: HexEncoded!) {
        transactions(offset: { hash: $hash }) {
          hash
          protocolVersion
          merkleTreeRoot
          block {
            height
            hash
          }
          identifiers
          raw
          contractActions {
            __typename
            ... on ContractDeploy {
              address
              state
              chainState
            }
            ... on ContractCall {
              address
              state
              entryPoint
              chainState
            }
            ... on ContractUpdate {
              address
              state
              chainState
            }
          }
        }
      }
    `;

    const response = await fetch(INDEXER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables: { hash: txHash } }),
    });

    if (!response.ok) {
      throw new Error(`Indexer HTTP error: ${response.status}`);
    }

    const body = await response.json();
    
    if (body.errors) {
      throw new Error(`GraphQL errors: ${JSON.stringify(body.errors)}`);
    }

    const txs = body.data?.transactions ?? [];
    return txs.length > 0 ? txs[0] : null;
  } catch (error) {
    console.error('Failed to query transaction:', error);
    return null;
  }
}

// Query transaction by identifier
export async function queryTransactionByIdentifier(identifier: string): Promise<any> {
  try {
    const query = `
      query ($identifier: HexEncoded!) {
        transactions(offset: { identifier: $identifier }) {
          hash
          protocolVersion
          merkleTreeRoot
          block {
            height
            hash
          }
          identifiers
          raw
          contractActions {
            __typename
            ... on ContractDeploy {
              address
              state
              chainState
            }
            ... on ContractCall {
              address
              state
              entryPoint
              chainState
            }
            ... on ContractUpdate {
              address
              state
              chainState
            }
          }
        }
      }
    `;

    const response = await fetch(INDEXER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables: { identifier } }),
    });

    if (!response.ok) {
      throw new Error(`Indexer HTTP error: ${response.status}`);
    }

    const body = await response.json();
    
    if (body.errors) {
      throw new Error(`GraphQL errors: ${JSON.stringify(body.errors)}`);
    }

    const txs = body.data?.transactions ?? [];
    return txs.length > 0 ? txs[0] : null;
  } catch (error) {
    console.error('Failed to query transaction:', error);
    return null;
  }
}
