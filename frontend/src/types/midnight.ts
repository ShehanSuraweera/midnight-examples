// Type definitions for Lace Midnight API
export interface LaceAPI {
  isEnabled: () => Promise<boolean>;
  enable: () => Promise<boolean>;
  getAddress: () => Promise<string>;
  getBalance: () => Promise<string>;
  signTransaction: (tx: string) => Promise<string>;
  submitTransaction: (signedTx: string) => Promise<string>;
}

declare global {
  interface Window {
    midnight?: LaceAPI;
  }
}

export interface ContractState {
  message: string;
}

export interface Transaction {
  hash: string;
  txId: string;
  blockHeight?: number;
}

export interface WalletInfo {
  address: string;
  balance: string;
  connected: boolean;
}
