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
import { Transaction as ZswapTransaction, nativeToken } from "@midnight-ntwrk/zswap";
import { WebSocket } from "ws";
import * as path from "path";
import * as fs from "fs";
import * as Rx from "rxjs";
import * as dotenv from "dotenv";

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
  proofServer: "http://127.0.0.1:6300",
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

    // Get wallet seed (from .env or prompt)
    const walletSeed =
      process.env.WALLET_SEED || (await rl.question("Enter your wallet seed: "));

    console.log("\nConnecting to Midnight network...");

    // Build wallet from seed (per docs)
    const wallet = await WalletBuilder.buildFromSeed(
      TESTNET_CONFIG.indexer,
      TESTNET_CONFIG.indexerWS,
      TESTNET_CONFIG.proofServer,
      TESTNET_CONFIG.node,
      walletSeed,
      getZswapNetworkId(),
      "info"
    );

    wallet.start();

    // Wait for sync with logging and timeout
    console.log("Waiting for wallet to sync with blockchain...");
    console.log("This may take several minutes on first run.\n");

    try {
await Rx.firstValueFrom(
  wallet.state().pipe(
    Rx.tap((state) => {
      if (state.syncProgress) {
        console.log(`📊 Syncing... (Synced: ${state.syncProgress.synced})`);
        const applyGap = state.syncProgress.lag?.applyGap ?? 0n;
        const sourceGap = state.syncProgress.lag?.sourceGap ?? 0n;
        console.log(
          `   Lag: applyGap=${applyGap.toString()}, sourceGap=${sourceGap.toString()}`
        );
      }
    }),
    Rx.timeout({
      each: 120000,  // 2 minutes between updates
      first: 300000, // 5 minutes for initial connection
    }),
    Rx.filter((s) => s.syncProgress?.synced === true),
    Rx.take(1),
  ),
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

    // Load compiled contract (Hello World)
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

    // Create wallet provider for contract calls
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
    const zkConfigPath = path.join(contractPath, "managed", "hello-world");
    const providers = {
      privateStateProvider: levelPrivateStateProvider({
        privateStateStoreName: "hello-world-state",
      }),
      publicDataProvider: indexerPublicDataProvider(
        TESTNET_CONFIG.indexer,
        TESTNET_CONFIG.indexerWS
      ),
      zkConfigProvider: new NodeZkConfigProvider(zkConfigPath),
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

    console.log("Wallet Address:", walletState.address);

    // Main menu loop
    let running = true;
    while (running) {
      console.log("--- Menu ---");
      console.log("1. Store message");
      console.log("2. Read current message");
      console.log("3. Exit");
      console.log("4. Send tDUST");
      console.log("5. Show wallet balance");
      console.log("6. Show transaction details by hash");
      console.log("7. Show transaction details by identifier");
      console.log("8. Show wallet address");
      console.log("9. Show coin public key");
      console.log("10. Show full wallet state");


      const choice = await rl.question("\nYour choice: ");

      switch (choice) {
        case "1":
          console.log("\nStoring custom message...");
          const customMessage = await rl.question("Enter your message: ");
          try {
            const tx = await deployed.callTx.storeMessage(customMessage);
            console.log("✅ Success!");
            console.log(`Message: "${customMessage}"`);
             console.log(`Transaction hash: ${tx.public.txHash}`);   // <-- add this
            console.log(`Transaction ID: ${tx.public.txId}`);
            console.log(`Block height: ${tx.public.blockHeight}\n`);
          } catch (error) {
            console.error("Failed to store message:", error);
          }
          break;

        case "2":
          console.log("\nReading message from blockchain...");
          try {
            const state =
              await providers.publicDataProvider.queryContractState(
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

        case "4":
          await sendTdust(wallet, rl);
          break;

        case "5":
  await showBalance(wallet);
  break;


    case "6": {
      const txHash = await rl.question(
        "\nEnter transaction hash (HexEncoded): "
      );
      await showTransactionDetailsByHash(txHash);
      break;
    }
    case "7": {
  const identifier = await rl.question(
    "\nEnter transaction identifier (HexEncoded): "
  );
  await showTransactionDetailsByIdentifier(identifier);
  break;
}

  case "8":{
    // show wallet address
    const walletState = await Rx.firstValueFrom(wallet.state());
    console.log(`\nWallet Address: ${walletState.address}\n`);
    break;
  }
  case "9": {
    // show coin public key
    const walletState = await Rx.firstValueFrom(wallet.state());
    console.log(`\nCoin Public Key: ${walletState.coinPublicKey}\n`);
    break;
  }
  case "10": {
    // show all wallet details
    const walletState = await Rx.firstValueFrom(wallet.state());
    console.log(`\nFull Wallet State:\n${JSON.stringify(walletState, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    , 2)}\n`);
    
    break;
  }

        default:
          console.log("Invalid choice. Please enter 1, 2, 3, 4, 5, 6, or 7.\n");
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

// Function to display wallet balance
async function showBalance(wallet: any) {
  // Get the latest wallet state (cast to any because wallet.state() returns unknown)
  const state: any = await Rx.firstValueFrom(wallet.state());
  // Get the balance for the native token (tDUST)
  const balance = (state?.balances?.[nativeToken()] ?? 0n) as bigint;
  console.log(`Your wallet balance is: ${balance.toString()} tDUST`);
}


import fetch from "node-fetch"; // or global fetch in newer Node

async function showTransactionDetailsByHash(txHash: string): Promise<void> {
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

  const res = await fetch(TESTNET_CONFIG.indexer, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ query, variables: { hash: txHash } }),
  });

  if (!res.ok) {
    console.error(`Indexer HTTP error: ${res.status} ${res.statusText}`);
    return;
  }

  // Type the response as 'any' (or a proper interface) so we can safely inspect its fields.
  const body: any = await res.json();
  if (body && body.errors) {
    console.error("Indexer GraphQL errors:", JSON.stringify(body.errors, null, 2));
    return;
  }

const txs = body.data?.transactions ?? [];
if (txs.length === 0) {
  console.log("No transaction found for that hash.");
  return;
}

const tx = txs[0];
console.log("\n=== Transaction Details ===");
console.log(`Hash:        ${tx.hash}`);
console.log(`Protocol ver: ${tx.protocolVersion}`);
console.log(
  `Block:       #${tx.block?.height ?? "(unknown)"} (${tx.block?.hash ?? "n/a"})`
);
console.log(`Identifiers: ${tx.identifiers?.join(", ") || "(none)"}`);
console.log(`Merkle root: ${tx.merkleTreeRoot ?? "(none)"}`);
console.log(`Raw (hex):   ${tx.raw ?? "(not available)"}`);

// Contract actions
if (tx.contractActions?.length) {
  console.log("Contract actions:");
  for (const ca of tx.contractActions) {
    console.log(`  type: ${ca.__typename}`);
    console.log(`    address: ${ca.address}`);
    if ("entryPoint" in ca && ca.entryPoint) {
      console.log(`    entryPoint: ${ca.entryPoint}`);
    }
    console.log(`    state: ${ca.state}`);
    console.log(`    chainState: ${ca.chainState}`);
  }
} else {
  console.log("No contract actions.");
}
console.log("===========================\n");
}

async function sendTdust(wallet: any, rl: readline.Interface): Promise<void> {
  try {
    const receiverAddress = await rl.question(
      "\nEnter recipient Midnight address: "
    );
    const amountStr = await rl.question(
      "Enter amount of tDUST to send (integer, e.g. 1): "
    );

    const amount = BigInt(amountStr);

    console.log("\nPreparing transfer transaction...");

    // 1. Prepare transfer transaction
    const transferRecipe = await wallet.transferTransaction([
      {
        amount,
        receiverAddress,
        type: nativeToken(), // tDUST
      },
    ]);

    console.log("Proving transaction (generating ZK proofs)...");

    // 2. Prove transaction
    const provenTransaction = await wallet.proveTransaction(transferRecipe);

    console.log("Submitting transaction to Midnight network...");

  

const txIdentifier = await wallet.submitTransaction(provenTransaction);

    console.log("Transaction submitted successfully:");
    console.log(`  transaction identifier: ${txIdentifier}`);
  } catch (error) {
    console.error("Failed to send tDUST:", error);
  }
}

async function showTransactionDetailsByIdentifier(identifier: string): Promise<void> {
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

  const res = await fetch(TESTNET_CONFIG.indexer, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ query, variables: { identifier } }),
  });

  if (!res.ok) {
    console.error(`Indexer HTTP error: ${res.status} ${res.statusText}`);
    return;
  }

  const body: any = await res.json();
  if (body && body.errors) {
    console.error("Indexer GraphQL errors:", JSON.stringify(body.errors, null, 2));
    return;
  }

  const txs = body.data?.transactions ?? [];
  if (txs.length === 0) {
    console.log("No transaction found for that identifier.");
    return;
  }

  const tx = txs[0];
  console.log("\n=== Transaction Details ===");
  console.log(`Identifier:  ${identifier}`);
  console.log(`Hash:        ${tx.hash}`);
  console.log(`Protocol ver: ${tx.protocolVersion}`);
  console.log(
    `Block:       #${tx.block?.height ?? "(unknown)"} (${tx.block?.hash ?? "n/a"})`
  );
  console.log(`Identifiers: ${tx.identifiers?.join(", ") || "(none)"}`);
  console.log(`Merkle root: ${tx.merkleTreeRoot ?? "(none)"}`);
  console.log(`Raw (hex):   ${tx.raw ?? "(not available)"}`);

  if (tx.contractActions?.length) {
    console.log("Contract actions:");
    for (const ca of tx.contractActions) {
      console.log(`  type: ${ca.__typename}`);
      console.log(`    address: ${ca.address}`);
      if ("entryPoint" in ca && ca.entryPoint) {
        console.log(`    entryPoint: ${ca.entryPoint}`);
      }
      console.log(`    state: ${ca.state}`);
      console.log(`    chainState: ${ca.chainState}`);
    }
  } else {
    console.log("No contract actions.");
  }
  console.log("===========================\n");
}

main().catch(console.error);

