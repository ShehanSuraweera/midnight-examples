import * as readline from "readline/promises";
import { WalletBuilder } from "@midnight-ntwrk/wallet";
import { findDeployedContract } from "@midnight-ntwrk/midnight-js-contracts";
import { httpClientProofProvider } from "@midnight-ntwrk/midnight-js-http-client-proof-provider";
import { indexerPublicDataProvider } from "@midnight-ntwrk/midnight-js-indexer-public-data-provider";
import { NodeZkConfigProvider } from "@midnight-ntwrk/midnight-js-node-zk-config-provider";
import { levelPrivateStateProvider } from "@midnight-ntwrk/midnight-js-level-private-state-provider";
import {
  NetworkId,
  setNetworkId,
  getZswapNetworkId,
  getLedgerNetworkId,
} from "@midnight-ntwrk/midnight-js-network-id";
import { createBalancedTx } from "@midnight-ntwrk/midnight-js-types";
import { Transaction } from "@midnight-ntwrk/ledger";
import { Transaction as ZswapTransaction } from "@midnight-ntwrk/zswap";
import { WebSocket } from "ws";
import * as path from "path";
import * as fs from "fs";
import * as Rx from "rxjs";
import * as dotenv from 'dotenv';


// Load environment variables from .env file
dotenv.config();

// Fix WebSocket for Node.js environment
// @ts-ignore
globalThis.WebSocket = WebSocket;

// Configure for Midnight Testnet
setNetworkId(NetworkId.TestNet);

// Testnet connection endpoints
const TESTNET_CONFIG = {
  indexer: "https://indexer.testnet-02.midnight.network/api/v1/graphql",
  indexerWS: "wss://indexer.testnet-02.midnight.network/api/v1/graphql/ws",
  node: "https://rpc.testnet-02.midnight.network",
  proofServer: "http://127.0.0.1:6300"
};

async function main() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  console.log("🌙 Hello World Contract CLI\n");

  try {
    // Check for deployment file
    if (!fs.existsSync("deployment.json")) {
      console.error("No deployment.json found! Run npm run deploy first.");
      process.exit(1);
    }

    const deployment = JSON.parse(fs.readFileSync("deployment.json", "utf-8"));
    console.log(`Contract Address: ${deployment.contractAddress}\n`);



    // Get wallet seed
    const walletSeed = process.env.WALLET_SEED || await rl.question("Enter your wallet seed: ");

    console.log("\nConnecting to Midnight network...");

// Build wallet with updated API
const wallet = await WalletBuilder.build(
  TESTNET_CONFIG.indexer,
  TESTNET_CONFIG.indexerWS,
  TESTNET_CONFIG.proofServer,
  TESTNET_CONFIG.node,
  walletSeed,
 getZswapNetworkId(),  // Use the function, not the enum directly
  "debug",  // Changed to debug for troubleshooting
  false
);

    wallet.start();

// Wait for sync with extended timeout
console.log("Waiting for wallet to sync with blockchain...");
console.log("This may take several minutes on first run.\n");

try {
  await Rx.firstValueFrom(
    wallet.state().pipe(
      Rx.tap((state) => {
        if (state.syncProgress) {
          console.log(`📊 Syncing... (Synced: ${state.syncProgress.synced})`);
          // You can also log the lag information if needed
          if (state.syncProgress.lag) {
            console.log(`   Lag: ${JSON.stringify(state.syncProgress.lag)}`);
          }
        }
      }),
      Rx.timeout({
        each: 120000,  // 2 minutes between updates
        first: 300000  // 5 minutes for initial connection
      }),
      Rx.filter((s) => s.syncProgress?.synced === true),
      Rx.take(1)
    )
  );
  
  console.log("\n✅ Wallet successfully synced with network!");
} catch (error) {
  console.error("\n❌ Connection Error:");
  if (error instanceof Rx.TimeoutError) {
    console.error("   Timed out waiting for wallet sync.");
    console.error("\n   Possible causes:");
    console.error("   - Indexer endpoints are unreachable");
    console.error("   - Network connectivity issues");
    console.error("   - Firewall blocking WebSocket connections");
  } else {
    console.error("   ", error);
  }
  await wallet.close();
  process.exit(1);
}

    // Load contract
    const contractPath = path.join(process.cwd(), "contracts");
    const contractModulePath = path.join(
      contractPath,
      "managed",
      "hello-world",
      "contract",
      "index.cjs"
    );
    const HelloWorldModule = await import(contractModulePath);
    const contractInstance = new HelloWorldModule.Contract({});

    // Create wallet provider
    const walletState = await Rx.firstValueFrom(wallet.state());

    const walletProvider = {
      coinPublicKey: walletState.coinPublicKey,
      encryptionPublicKey: walletState.encryptionPublicKey,
      balanceTx(tx: any, newCoins: any) {
        return wallet
          .balanceTransaction(
            ZswapTransaction.deserialize(
              tx.serialize(getLedgerNetworkId()),
              getZswapNetworkId()
            ),
            newCoins
          )
          .then((tx) => wallet.proveTransaction(tx))
          .then((zswapTx) =>
            Transaction.deserialize(
              zswapTx.serialize(getZswapNetworkId()),
              getLedgerNetworkId()
            )
          )
          .then(createBalancedTx);
      },
      submitTx(tx: any) {
        return wallet.submitTransaction(tx);
      },
    };

    // Configure providers
    const providers = {
      privateStateProvider: levelPrivateStateProvider({
        privateStateStoreName: "hello-world-state",
      }),
      publicDataProvider: indexerPublicDataProvider(
        TESTNET_CONFIG.indexer,
        TESTNET_CONFIG.indexerWS
      ),
      zkConfigProvider: new NodeZkConfigProvider(contractPath),
      proofProvider: httpClientProofProvider(TESTNET_CONFIG.proofServer),
      walletProvider: walletProvider,
      midnightProvider: walletProvider,
    };

    // Connect to contract
    const deployed: any = await findDeployedContract(providers, {
      contractAddress: deployment.contractAddress,
      contract: contractInstance,
      privateStateId: "helloWorldState",
      initialPrivateState: {},
    });

    console.log("✅ Connected to contract\n");

    // Main menu loop
    let running = true;
    while (running) {
      console.log("--- Menu ---");
      console.log("1. Store message");
      console.log("2. Read current message");
      console.log("3. Exit");

      const choice = await rl.question("\nYour choice: ");

      switch (choice) {
        case "1":
          console.log("\nStoring custom message...");

          // Prompt user for custom message
          const customMessage = await rl.question("Enter your message: ");

          try {
            const tx = await deployed.callTx.storeMessage(customMessage);
            console.log("✅ Success!");
            console.log(`Message: "${customMessage}"`);
            console.log(`Transaction ID: ${tx.public.txId}`);
            console.log(`Block height: ${tx.public.blockHeight}\n`);
          } catch (error) {
            console.error("Failed to store message:", error);
          }
          break;

        case "2":
          console.log("\nReading message from blockchain...");
          try {
            const state = await providers.publicDataProvider.queryContractState(
              deployment.contractAddress
            );

            if (state) {
              const ledger = HelloWorldModule.ledger(state.data);
              const message = Buffer.from(ledger.message).toString();
              console.log(`📝 Current message: "${message}"\n`);
            } else {
              console.log("No message found\n");
            }
          } catch (error) {
            console.error("Failed to read message:", error);
          }
          break;

        case "3":
          running = false;
          console.log("\nGoodbye! 👋");
          break;

        default:
          console.log("Invalid choice. Please enter 1, 2, or 3.\n");
      }
    }

    // Clean up
    await wallet.close();
  } catch (error) {
    console.error("\nError:", error);
  } finally {
    rl.close();
  }
}

main().catch(console.error);