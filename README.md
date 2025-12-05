# Midnight Hello World DApp

A privacy-preserving decentralized application (DApp) built on the Midnight blockchain network. This project demonstrates how to deploy and interact with a smart contract that stores and retrieves messages on the Midnight testnet using zero-knowledge proofs (ZKPs).

## 📑 Table of Contents

- [Overview](#🌙-overview)
- [Quick Start (Clone & Run)](#🚀-quick-start-for-developers-cloning-this-repo)
- [Frontend Web Interface](#🌐-frontend-web-interface)
- [Understanding Midnight Network](#📚-understanding-midnight-network)
- [Installation Guide (Detailed)](#🛠️-installation)
- [Project Structure](#📁-project-structure)
- [Smart Contract Explained](#📝-smart-contract)
- [Building the Contract](#🔨-building-the-contract)
- [Configuration](#🔧-configuration)
- [Deploying the Contract](#🚀-deploying-the-hello-world-contract)
- [Interacting with the Contract](#💬-interacting-with-the-deployed-contract)
- [Security Notes](#🔐-security-notes)
- [Troubleshooting](#🐛-troubleshooting)
- [Resources](#🔗-resources)

## 🌙 Overview

Midnight Network apps use zero-knowledge proofs to maintain data confidentiality while enabling selective disclosure. This allows users to prove specific information while keeping other sensitive data private.

This application showcases:
- Smart contract deployment on Midnight Testnet
- Zero-knowledge proof generation for transactions
- Wallet integration and management (CLI and Web UI)
- Reading and writing to blockchain state
- Transaction submission and tracking
- Token transfers (tDUST)
- Privacy-preserving message storage with selective disclosure
- **Modern React frontend** with Lace wallet integration
- Privacy-preserving message storage with selective disclosure

---

## 🚀 Quick Start (For Developers Cloning This Repo)

**New to Midnight?** Follow this section to get up and running quickly!

### Step 1: Clone the Repository

```bash
git clone https://github.com/ShehanSuraweera/midnight-examples.git
cd midnight-examples
```

### Step 2: Install System Prerequisites

Before running this project, you need:

1. **Node.js** (v18 or higher) - [Download Node.js](https://nodejs.org/)
   ```bash
   # Verify installation
   node --version  # Should be v18.x or higher
   npm --version   # Should be v9.x or higher
   ```

2. **Docker Desktop** - [Download Docker](https://www.docker.com/products/docker-desktop/)
   ```bash
   # Verify installation
   docker --version
   ```

3. **Compact Compiler** - Install with this command:
   ```bash
   curl --proto '=https' --tlsv1.2 -LsSf https://github.com/midnightntwrk/compact/releases/download/compact-v0.2.0/compact-installer.sh | sh
   ```
   
   After installation, restart your terminal and verify:
   ```bash
   compact --version  # Should show version number
   ```

4. **Lace Wallet** (Chrome Extension) - [Install from Chrome Web Store](https://chromewebstore.google.com/detail/lace-beta/hgeekaiplokcnmakghbdfbgnlfheichg)
   - Create a wallet and save your seed phrase securely
   - Get test tokens from [Midnight Faucet](https://midnight.network/test-faucet/)

### Step 3: Install Project Dependencies

```bash
npm install
```

This installs all required Midnight SDK packages and TypeScript dependencies.

### Step 4: Set Up Environment Variables

Create your `.env` file from the example:

```bash
cp .env.example .env
```

**Option A: Use the deployment script to generate a wallet seed**
- Leave the `.env` file empty for now
- The deployment script will generate a seed and display it
- Copy the generated seed to your `.env` file

**Option B: Use an existing wallet seed**
- If you already have a Midnight wallet seed, add it to `.env`:
  ```env
  WALLET_SEED=your_64_character_hex_seed_here
  ```

⚠️ **Security Warning:** Never commit your `.env` file! It's already in `.gitignore`.

### Step 5: Start the Proof Server

Open a **new terminal window** and run:

```bash
docker run -p 6300:6300 midnightnetwork/proof-server -- 'midnight-proof-server --network testnet'
```

**Keep this terminal running** - the proof server generates zero-knowledge proofs needed for all contract interactions.

Verify it's running:
```bash
curl http://127.0.0.1:6300/health
```

### Step 6: Compile the Contract

```bash
npm run compile
```

This compiles the Compact smart contract and generates ZK circuits, cryptographic keys, and TypeScript APIs.

**What happens:** The `contracts/hello-world.compact` file is compiled into the `contracts/managed/hello-world/` directory.

### Step 7: Build the TypeScript Code

```bash
npm run build
```

This compiles `src/deploy.ts` and `src/cli.ts` into JavaScript in the `dist/` directory.

### Step 8: Deploy the Contract

```bash
npm run deploy
```

**First-time deployment:**
1. If no wallet seed in `.env`, the script will ask if you have one
2. Choose "n" to generate a new seed
3. **SAVE THE DISPLAYED SEED** - you'll need it!
4. Copy the seed to your `.env` file
5. The script shows your wallet address
6. Visit [Midnight Faucet](https://midnight.network/test-faucet/) and paste your address
7. Wait for tDUST tokens to arrive (check in terminal)
8. Contract deploys automatically once funded

**Subsequent deployments:**
- Uses the seed from your `.env` file
- Checks your balance
- Deploys immediately if you have funds

The contract address is saved to `deployment.json`.

### Step 9: Interact with Your Contract

```bash
npm run cli
```

The interactive CLI provides these options:

1. **Store message** - Write a message to the blockchain
2. **Read current message** - Retrieve the stored message
3. **Exit** - Close the application
4. **Send tDUST** - Transfer tokens to another address
5. **Show wallet balance** - Display your tDUST balance
6. **Show transaction details by hash** - Query transaction info
7. **Show transaction details by identifier** - Alternative query method

### 🎉 Success!

You've successfully:
- ✅ Set up the Midnight development environment
- ✅ Compiled a privacy-preserving smart contract
- ✅ Deployed it to Midnight Testnet
- ✅ Interacted with your contract using zero-knowledge proofs

### 📊 Development Workflow

Here's the typical development workflow you just completed:

```
1. Clone Repo
   ↓
2. Install Dependencies (npm install)
   ↓
3. Setup Environment (.env file)
   ↓
4. Start Proof Server (Docker)
   ↓
5. Compile Contract (npm run compile)
   ↓
6. Build TypeScript (npm run build)
   ↓
7. Deploy Contract (npm run deploy)
   ↓
8. Interact via CLI (npm run cli)
   ↓
9. Make Changes & Repeat Steps 5-8
```

### 🔄 Quick Command Reference

After initial setup, you'll commonly use these commands:

| Command | Purpose | When to Use |
|---------|---------|-------------|
| `npm run compile` | Compile Compact contract | After changing `.compact` file |
| `npm run build` | Compile TypeScript | After changing `.ts` files |
| `npm run deploy` | Deploy new contract | First time or new version |
| `npm run cli` | Interact with contract | Testing & usage |

**Pro Tip:** Keep the proof server running in a separate terminal to avoid restarting it.

---

## 🌐 Frontend Web Interface

In addition to the CLI, this project includes a beautiful React + Vite frontend that provides a user-friendly web interface for interacting with your Midnight smart contract.

### ✨ Frontend Features

- **🎨 Modern UI**: Beautiful gradient design with Tailwind CSS
- **🔗 Lace Wallet Integration**: Connect with browser extension
- **📝 Message Management**: Store and retrieve messages visually
- **⚡ Real-time Updates**: Automatic blockchain state updates
- **📱 Responsive Design**: Works on desktop and mobile
- **🎓 Educational**: Built-in explanations of ZKPs and privacy tech

### 🚀 Quick Start (Frontend)

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:5173`

### 📋 Frontend Setup Steps

1. **Deploy the Contract First**
   ```bash
   # From root directory
   npm run deploy
   ```

2. **Copy Deployment Info**
   ```bash
   # Copy contract address to frontend
   cp deployment.json frontend/public/deployment.json
   ```

3. **Install Lace Wallet**
   - Install [Lace extension](https://chromewebstore.google.com/detail/lace-beta/hgeekaiplokcnmakghbdfbgnlfheichg)
   - Create/import wallet
   - Get tDUST from [faucet](https://midnight.network/test-faucet)

4. **Launch Frontend**
   ```bash
   cd frontend
   npm run dev
   ```

5. **Connect & Interact**
   - Open http://localhost:5173
   - Click "Connect Wallet"
   - Store and read messages!

### 🎯 Frontend vs CLI

| Feature | Frontend (Web UI) | CLI (Terminal) |
|---------|------------------|----------------|
| **User Experience** | Visual, intuitive | Command-line |
| **Wallet** | Lace browser extension | Seed phrase |
| **Best For** | End users, demos | Developers, automation |
| **Message Storage** | ✅ Yes | ✅ Yes |
| **Message Reading** | ✅ Yes | ✅ Yes |
| **Token Transfers** | 🚧 Coming soon | ✅ Yes |
| **Transaction Details** | 🚧 Coming soon | ✅ Yes |

### 📱 Frontend UI Components

The frontend includes:
- **Wallet Connection Panel**: Shows address, balance, connection status
- **Message Display Card**: Current blockchain message with refresh
- **Message Submission Form**: Store new messages (280 char limit)
- **Info Sections**: ZKP education, how it works, resources
- **Responsive Layout**: Beautiful on all screen sizes

### 🔗 Frontend Documentation

For detailed frontend documentation, see [frontend/README.md](frontend/README.md)

---

## 📚 Understanding Midnight Network

Continue reading to learn more about how Midnight works and what this project demonstrates.

### 🎓 What You'll Learn from This Project

By working through this example, you'll understand:

1. **Zero-Knowledge Proofs** - How ZKPs enable privacy-preserving transactions
2. **Selective Disclosure** - Proving information without revealing everything
3. **Compact Language** - Midnight's smart contract language designed for privacy
4. **Contract Deployment** - The full lifecycle from code to blockchain
5. **State Management** - How contracts store both public and private state
6. **Transaction Proofs** - How every transaction generates cryptographic proofs
7. **Wallet Integration** - Managing keys, balances, and transaction signing

### 🏗️ Architecture Overview

```
┌─────────────────┐
│  Your Computer  │
├─────────────────┤
│                 │
│  ┌───────────┐  │
│  │ CLI App   │  │  ← You interact here
│  └─────┬─────┘  │
│        │        │
│  ┌─────▼─────┐  │
│  │  Wallet   │  │  ← Manages keys & signs transactions
│  └─────┬─────┘  │
│        │        │
│  ┌─────▼─────┐  │
│  │   Proof   │  │  ← Generates zero-knowledge proofs
│  │  Server   │  │     (Running in Docker)
│  └─────┬─────┘  │
│        │        │
└────────┼────────┘
         │
    ┌────▼──────────────────────────────┐
    │   Midnight Testnet Network        │
    ├───────────────────────────────────┤
    │                                   │
    │  ┌──────────┐    ┌─────────────┐ │
    │  │ Indexer  │    │  RPC Node   │ │
    │  └──────────┘    └─────────────┘ │
    │                                   │
    │  ┌──────────────────────────────┐ │
    │  │  Your Smart Contract         │ │
    │  │  (Stores messages on-chain)  │ │
    │  └──────────────────────────────┘ │
    │                                   │
    └───────────────────────────────────┘
```

## 🎯 About Midnight Network Apps

A Midnight Network (MN) app is a privacy-preserving DApp that uses zero-knowledge proofs (ZKPs) to maintain data confidentiality. The core value proposition is **selective disclosure**, which allows users to prove specific information while keeping other sensitive data private.

### Quick Start with create-mn-app

The easiest way to create a new Midnight Network app is using the `create-mn-app` CLI tool, which scaffolds applications with zero configuration:

```bash
npx create-mn-app my-app
cd my-app
npm run setup
```

This tool provides:
- Preconfigured TypeScript setup
- Hot reloading
- Automatic wallet generation
- Automatic dependency management

**Available templates:**
- **Hello World** (this project) - Message storage with zkProofs
- **Counter DApp** - Increment/decrement with zkProofs
- **Bulletin Board** (in development)
- **DEX** (in development)
- **Midnight Kitties** (in development)

### Manual Project Creation

This project was created manually following the Midnight documentation. Here's how it maps to the official structure:

## 📋 Prerequisites

Before you begin, ensure you have:

- **Google Chrome browser** installed
- **Node.js** (v18 or higher)
- **npm** (v9 or higher)
- **Docker Desktop** installed and running
- **Compact compiler** installed
- **Lace Midnight Preview wallet** (browser extension)
- **Midnight Proof Server** running locally on port 6300
- **tDUST tokens** from the [Midnight Faucet](https://midnight.network/test-faucet)
- Basic familiarity with command-line operations
- Administrative privileges on your computer

## 🛠️ Installation

### 1. Install the Lace Midnight Preview Wallet

The Lace Midnight Preview wallet is a browser extension wallet for the Midnight network, currently compatible with Google Chrome.

1. Open Google Chrome browser
2. Install the Lace wallet extension from the [Chrome Web Store](https://chromewebstore.google.com/detail/lace-beta/hgeekaiplokcnmakghbdfbgnlfheichg)
3. Click **Add to Chrome** and confirm by clicking **Add extension**
4. Pin the extension to your toolbar for easy access

**Verification:** The Lace wallet icon appears in your Chrome toolbar.

### 2. Create Your Wallet

Your wallet is protected by a seed phrase, which acts as your master key. Keep it secret and safe.

1. Click the Lace wallet icon in your toolbar
2. Select **Create a new wallet**
3. Choose a strong password
4. **Crucially:** Write down your seed phrase on paper and store it in a secure, offline location. Never store it digitally or share it
5. Confirm your seed phrase to complete the setup

**Verification:** Your wallet dashboard opens, showing a 0 tDUST balance.

### 3. Get Test Tokens (tDUST)

tDUST is the token used on the Midnight Testnet. It has no real-world value and is used for testing transactions.

1. In your Lace wallet, click **Receive** and copy your wallet address
2. Go to the [Testnet Faucet](https://midnight.network/test-faucet/)
3. Paste your address into the form and click **Request tDUST**
4. Wait a few minutes for the tokens to arrive

**Verification:** Your Lace wallet shows a new balance of tDUST tokens.

### 4. Install Compact Compiler

Compact is Midnight's dedicated smart contract language for creating privacy-preserving DApps.

Install the pre-built binaries using the installer script:

```bash
curl --proto '=https' --tlsv1.2 -LsSf https://github.com/midnightntwrk/compact/releases/download/compact-v0.2.0/compact-installer.sh | sh
```

### 5. Update Your Shell PATH

Make sure the Compact binary is in your shell's PATH to run it from any directory. Your shell needs to be updated after installation (restart your terminal or source your shell config).

### 6. Verify Compact Installation

```bash
compact --version  # Print version of Compact
which compact      # Print installation path
```

**Verification:** These commands return the Compact version number and installation path.

### 7. Install Docker Desktop

The proof server is required to generate zero-knowledge proofs for transactions locally. It runs as a background service using Docker.

Download and install Docker Desktop for your operating system:
- **Get Docker:** [https://www.docker.com/products/docker-desktop/](https://www.docker.com/products/docker-desktop/)

### 8. Run the Proof Server

Start the proof server in your terminal:

```bash
docker run -p 6300:6300 midnightnetwork/proof-server -- 'midnight-proof-server --network testnet'
```

**Note:** This command occupies the terminal window while running. Keep it running in a separate terminal.

**Verification:** The terminal displays logs indicating the server is running and listening at `http://localhost:6300`.

**Lace Wallet Configuration:** To use a local proof server with Lace Midnight Preview wallet, go to **Settings > Midnight** and select **Local (http://localhost:6300)**.

### 9. Install Compact VS Code Extension (Optional)

The Compact VS Code extension provides helpful syntax highlighting and code snippets.

1. Download the VSIX package from the [Compact VS Code extension release page](https://github.com/midnightntwrk/compact/releases)
2. In VS Code go to **Extensions**, then **Install from VSIX** and select the extension file

**Verification:** You now see Compact Language Support extension in your installed VS Code extensions.

## 🚀 Quick Start

### Project Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables (Optional)

Create a `.env` file in the project root:

```env
WALLET_SEED=your_64_character_hex_seed_here
```

If you don't provide a seed, the deployment script will generate one for you.

### 3. Compile the Contract

```bash
npm run compile
```

This compiles the `hello-world.compact` contract and generates necessary artifacts in `contracts/managed/hello-world/`.

### 4. Build TypeScript Files

```bash
npm run build
```

This compiles the TypeScript source files to JavaScript in the `dist/` directory.

### 5. Deploy the Contract

```bash
npm run deploy
```

The deployment process will:
- Build or use your existing wallet
- Display your wallet address
- Wait for tDUST funding (if balance is 0)
- Deploy the contract to Midnight Testnet
- Save deployment info to `deployment.json`

**Important:** Visit the [Midnight Faucet](https://midnight.network/test-faucet) if your wallet has no funds.

### 6. Interact with the Contract

```bash
npm run cli
```

This starts the interactive CLI with the following options:
- **Store message**: Write a custom message to the blockchain
- **Read current message**: Retrieve the stored message
- **Send tDUST**: Transfer tokens to another address
- **Show wallet balance**: Display your current tDUST balance
- **Show transaction details**: View transaction information by hash or identifier
- **Exit**: Close the application

## 📁 Project Structure

This project follows the standard Midnight Network app structure with both CLI and web frontend:

```
/
├── contracts/
│   ├── hello-world.compact          # Compact smart contract source
│   ├── keys/                         # ZK proof keys (proving & verifying)
│   │   ├── storeMessage.prover
│   │   └── storeMessage.verifier
│   ├── managed/                      # Compiled contract artifacts
│   │   └── hello-world/
│   │       ├── compiler/             # Intermediate compiler files
│   │       │   └── contract-info.json
│   │       ├── contract/             # Compiled contract for deployment
│   │       │   ├── index.cjs
│   │       │   └── index.d.cts
│   │       ├── keys/                 # Cryptographic keys
│   │       └── zkir/                 # Zero-Knowledge IR
│   └── zkir/                         # ZK Intermediate Representation
│       ├── storeMessage.bzkir
│       └── storeMessage.zkir
├── src/
│   ├── cli.ts                       # Interactive CLI application
│   └── deploy.ts                    # Contract deployment script
├── frontend/                         # React + Vite Web UI ✨ NEW
│   ├── src/
│   │   ├── components/
│   │   │   ├── WalletConnect.tsx   # Lace wallet integration
│   │   │   ├── MessageForm.tsx     # Message submission UI
│   │   │   └── MessageDisplay.tsx  # Message display UI
│   │   ├── services/
│   │   │   └── midnight.ts         # Blockchain API service
│   │   ├── types/
│   │   │   └── midnight.ts         # TypeScript definitions
│   │   ├── App.tsx                 # Main application
│   │   └── index.css               # Tailwind styles
│   ├── public/
│   │   └── deployment.json         # Contract info (copy from root)
│   ├── package.json
│   ├── tailwind.config.js
│   └── README.md                   # Frontend documentation
├── midnight-level-db/               # Private state storage
├── deployment.json                  # Deployed contract information
├── .env.example                     # Environment variables template
├── package.json                     # Project dependencies
├── tsconfig.json                    # TypeScript configuration
└── README.md                        # This file
```
│   │       ├── compiler/             # Intermediate compiler files
│   │       │   └── contract-info.json
│   │       ├── contract/             # Compiled contract for deployment
│   │       │   ├── index.cjs
│   │       │   └── index.d.cts
│   │       ├── keys/                 # Cryptographic keys
│   │       └── zkir/                 # Zero-Knowledge IR
│   └── zkir/                         # ZK Intermediate Representation
│       ├── storeMessage.bzkir
│       └── storeMessage.zkir
├── src/
│   ├── cli.ts                       # Interactive CLI application
│   └── deploy.ts                    # Contract deployment script
├── midnight-level-db/               # Private state storage
├── deployment.json                  # Deployed contract information
├── package.json                     # Project dependencies
├── tsconfig.json                    # TypeScript configuration
└── README.md                        # This file
```

### Directory Breakdown

- **`contracts/`**: Contains the Compact smart contract source code
  - **`hello-world.compact`**: The main contract file
  - **`keys/`**: Cryptographic proving and verifying keys for zero-knowledge proofs
  - **`managed/hello-world/`**: Generated artifacts from compilation
    - **`contract/`**: Compiled contract artifacts (JSON files for deployment and TypeScript APIs)
    - **`keys/`**: Stores cryptographic keys
    - **`zkir/`**: Zero-Knowledge Intermediate Representation bridging Compact to ZK backend
    - **`compiler/`**: Intermediate files used during build process
  - **`zkir/`**: Additional ZK intermediate representation files

- **`src/`**: TypeScript source files for the DApp
  - **`cli.ts`**: Interactive command-line interface for contract interaction
  - **`deploy.ts`**: Script for deploying the contract to the blockchain

- **`midnight-level-db/`**: LevelDB database for storing private state locally

## 📝 Smart Contract

The `hello-world.compact` contract demonstrates Midnight's privacy features:

### Complete Contract Code

```compact
pragma language_version >= 0.18.0;

import CompactStandardLibrary;

export ledger message: Opaque<"string">;

export circuit storeMessage(customMessage: Opaque<"string">): [] {
    message = disclose(customMessage);
}
```

### Contract Breakdown

#### 1. Pragma Directive

```compact
pragma language_version >= 0.18.0;
```

Every Compact contract begins with a pragma directive that declares the compiler version compatibility. This ensures predictable behavior and prevents issues with future compiler updates.

#### 2. Import Statement

```compact
import CompactStandardLibrary;
```

Imports the Compact Standard Library, which provides built-in types and functions essential for contract development.

#### 3. Ledger Declaration

```compact
export ledger message: Opaque<"string">;
```

The **ledger** section defines on-chain state variables. This functions as a schema for data stored permanently on the blockchain.

- `export`: Makes the variable accessible from the dApp
- `message`: Variable name for storing the message
- `Opaque<"string">`: A privacy-preserving type that stores variable-length strings

#### 4. Circuit Definition

```compact
export circuit storeMessage(customMessage: Opaque<"string">): [] {
    message = disclose(customMessage);
}
```

**Circuits** are the functions of a Compact smart contract, compiled directly into zero-knowledge circuits.

- `export`: Allows the circuit to be called from external applications
- `storeMessage`: Function name
- `customMessage`: Input parameter (private by default)
- `disclose()`: Explicitly makes the data public on the ledger

**Why disclose() is required:** Compact enforces privacy by default. All user input is considered private unless explicitly made public using `disclose()`. This demonstrates Midnight's selective disclosure capability.

### Contract Capabilities

The contract provides:
- **Ledger State**: Stores a single message as an opaque string
- **Circuit Function**: `storeMessage(customMessage)` - Writes a new message to the ledger with zero-knowledge proof

## 🔨 Building the Contract

### Compilation Process

Compiling a Compact contract transforms high-level logic into zero-knowledge circuits, generates cryptographic keys, and creates TypeScript APIs for the dApp frontend. This process enforces Midnight's privacy and security guarantees.

### Compile Command

```bash
npm run compile
```

This runs:
```bash
compact compile contracts/hello-world.compact contracts/managed/hello-world
```

### Generated Artifacts

The compilation generates the following structure in `contracts/managed/hello-world/`:

- **`contract/`**: Compiled contract artifacts including JSON files for deployment and frontend integration
- **`keys/`**: Cryptographic proving and verifying keys for zero-knowledge proofs
- **`zkir/`**: Zero-Knowledge Intermediate Representation bridging Compact code to the ZK backend
- **`compiler/`**: Intermediate files used during the build process

## 🔧 Configuration

### Testnet Endpoints

The application connects to Midnight Testnet using these endpoints:

```typescript
{
  indexer: "https://indexer.testnet-02.midnight.network/api/v1/graphql",
  indexerWS: "wss://indexer.testnet-02.midnight.network/api/v1/graphql/ws",
  node: "https://rpc.testnet-02.midnight.network",
  proofServer: "http://127.0.0.1:6300"
}
```

### Proof Server Setup

Ensure the Midnight proof server is running locally:

```bash
# Check if proof server is running
curl http://127.0.0.1:6300/health
```

If not running, run the Docker command from the installation section above.

## 🚀 Deploying the Hello World Contract

This section explains how to deploy your contract to Midnight Testnet and establish your DApp on-chain.

### Deployment Prerequisites

Before deploying, ensure you have:

- ✅ A `contracts/hello-world.compact` file
- ✅ Compiled contract artifacts in `contracts/managed/hello-world/`
- ✅ A complete `package.json` with all deployment dependencies
- ✅ TypeScript configuration (`tsconfig.json`)
- ✅ The proof server running on `http://127.0.0.1:6300`

### Understanding the Deployment Process

The deployment process involves several key steps:

1. **Wallet Creation/Recovery**: Generate a new wallet or use an existing seed
2. **Funding Check**: Verify wallet has tDUST tokens for transaction fees
3. **Contract Loading**: Import the compiled contract artifacts
4. **Provider Configuration**: Set up connections to the Midnight network
5. **Contract Deployment**: Submit the deployment transaction with ZK proofs
6. **Save Deployment Info**: Store contract address for future interactions

### Package Configuration

Our `package.json` includes all necessary dependencies for deployment:

```json
{
  "name": "my-mn-app",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "compile": "compact compile contracts/hello-world.compact contracts/managed/hello-world",
    "build": "tsc",
    "deploy": "node dist/deploy.js",
    "cli": "node dist/cli.js"
  },
  "dependencies": {
    "@midnight-ntwrk/compact-runtime": "^0.9.0",
    "@midnight-ntwrk/ledger": "^4.0.0",
    "@midnight-ntwrk/midnight-js-contracts": "2.0.2",
    "@midnight-ntwrk/midnight-js-http-client-proof-provider": "2.0.2",
    "@midnight-ntwrk/midnight-js-indexer-public-data-provider": "2.0.2",
    "@midnight-ntwrk/midnight-js-level-private-state-provider": "2.0.2",
    "@midnight-ntwrk/midnight-js-node-zk-config-provider": "2.0.2",
    "@midnight-ntwrk/midnight-js-network-id": "2.0.2",
    "@midnight-ntwrk/midnight-js-types": "2.0.2",
    "@midnight-ntwrk/wallet": "5.0.0",
    "@midnight-ntwrk/wallet-api": "5.0.0",
    "@midnight-ntwrk/zswap": "^4.0.0",
    "dotenv": "^17.2.3",
    "ws": "^8.18.3"
  }
}
```

### TypeScript Configuration

The `tsconfig.json` defines how TypeScript compiles the project:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "node",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "resolveJsonModule": true
  },
  "include": ["src/**/*"]
}
```

### Deployment Script Architecture

The `src/deploy.ts` script orchestrates the entire deployment process:

#### 1. Import Required Libraries

```typescript
import { WalletBuilder } from "@midnight-ntwrk/wallet";
import { deployContract } from "@midnight-ntwrk/midnight-js-contracts";
import { httpClientProofProvider } from "@midnight-ntwrk/midnight-js-http-client-proof-provider";
import { indexerPublicDataProvider } from "@midnight-ntwrk/midnight-js-indexer-public-data-provider";
import { NodeZkConfigProvider } from "@midnight-ntwrk/midnight-js-node-zk-config-provider";
import { levelPrivateStateProvider } from "@midnight-ntwrk/midnight-js-level-private-state-provider";
import {
  NetworkId,
  setNetworkId,
  getZswapNetworkId,
  getLedgerNetworkId
} from "@midnight-ntwrk/midnight-js-network-id";
import { createBalancedTx } from "@midnight-ntwrk/midnight-js-types";
import { nativeToken, Transaction } from "@midnight-ntwrk/ledger";
import { Transaction as ZswapTransaction } from "@midnight-ntwrk/zswap";
```

#### 2. Configure Network Settings

```typescript
// Fix WebSocket for Node.js environment
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
```

#### 3. Wallet Funding Helper

The `waitForFunds` function monitors wallet state until tDUST tokens arrive:

```typescript
const waitForFunds = (wallet: Wallet) =>
  Rx.firstValueFrom(
    wallet.state().pipe(
      Rx.tap((state) => {
        if (state.syncProgress) {
          console.log(`Sync progress: synced=${state.syncProgress.synced}`);
        }
      }),
      Rx.filter((state) => state.syncProgress?.synced === true),
      Rx.map((s) => s.balances[nativeToken()] ?? 0n),
      Rx.filter((balance) => balance > 0n),
      Rx.tap((balance) => console.log(`Wallet funded with balance: ${balance}`))
    )
  );
```

#### 4. Wallet Creation/Recovery

The script prompts for an existing seed or generates a new one:

```typescript
const choice = await rl.question("Do you have a wallet seed? (y/n): ");

let walletSeed: string;
if (choice.toLowerCase() === "y" || choice.toLowerCase() === "yes") {
  walletSeed = await rl.question("Enter your 64-character seed: ");
} else {
  // Generate new wallet seed
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  walletSeed = Array.from(bytes, (b) =>
    b.toString(16).padStart(2, "0")
  ).join("");
  console.log(`\n📝 SAVE THIS SEED: ${walletSeed}\n`);
}
```

**Enhanced Version**: Our implementation also supports `.env` file for seed storage.

#### 5. Build Wallet and Check Balance

```typescript
// Build wallet from seed
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
const state = await Rx.firstValueFrom(wallet.state());
console.log(`Your wallet address is: ${state.address}`);

let balance = state.balances[nativeToken()] || 0n;

if (balance === 0n) {
  console.log("Visit: https://midnight.network/test-faucet to get funds.");
  console.log("Waiting to receive tokens...");
  balance = await waitForFunds(wallet);
}
```

#### 6. Load Compiled Contract

```typescript
const contractPath = path.join(process.cwd(), "contracts");
const contractModulePath = path.join(
  contractPath,
  "managed",
  "hello-world",
  "contract",
  "index.cjs"
);

if (!fs.existsSync(contractModulePath)) {
  console.error("Contract not found! Run: npm run compile");
  process.exit(1);
}

const HelloWorldModule = await import(contractModulePath);
const contractInstance = new HelloWorldModule.Contract({});
```

#### 7. Create Wallet Provider

The wallet provider handles transaction signing and submission:

```typescript
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
  }
};
```

#### 8. Configure Providers

These providers handle all aspects of contract interaction:

```typescript
const providers = {
  privateStateProvider: levelPrivateStateProvider({
    privateStateStoreName: "hello-world-state"
  }),
  publicDataProvider: indexerPublicDataProvider(
    TESTNET_CONFIG.indexer,
    TESTNET_CONFIG.indexerWS
  ),
  zkConfigProvider: new NodeZkConfigProvider(contractPath),
  proofProvider: httpClientProofProvider(TESTNET_CONFIG.proofServer),
  walletProvider: walletProvider,
  midnightProvider: walletProvider
};
```

**Provider Roles:**
- **privateStateProvider**: Manages local private state using LevelDB
- **publicDataProvider**: Fetches blockchain data via the indexer
- **zkConfigProvider**: Loads ZK circuit configuration and keys
- **proofProvider**: Generates zero-knowledge proofs via the proof server
- **walletProvider**: Handles transaction balancing and signing
- **midnightProvider**: Submits transactions to the Midnight network

#### 9. Deploy Contract

```typescript
console.log("Deploying contract (30-60 seconds)...");

const deployed = await deployContract(providers, {
  contract: contractInstance,
  privateStateId: "helloWorldState",
  initialPrivateState: {}
});

const contractAddress = deployed.deployTxData.public.contractAddress;
```

#### 10. Save Deployment Information

```typescript
const info = {
  contractAddress,
  deployedAt: new Date().toISOString()
};

fs.writeFileSync("deployment.json", JSON.stringify(info, null, 2));
console.log("✅ Saved to deployment.json");

await wallet.close();
```

### Step-by-Step Deployment

Follow these steps to deploy your contract:

#### Step 1: Start the Proof Server

Open a **new terminal window** and start the proof server:

```bash
docker run -p 6300:6300 midnightnetwork/proof-server -- 'midnight-proof-server --network testnet'
```

**Keep this terminal open** throughout the deployment process. The proof server generates zero-knowledge proofs required for deployment.

#### Step 2: Compile TypeScript

In your main terminal:

```bash
npm run build
```

This compiles `src/deploy.ts` and `src/cli.ts` into JavaScript in the `dist/` directory.

#### Step 3: Execute Deployment

```bash
npm run deploy
```

The script will:
1. Prompt for wallet seed (or use `.env` file)
2. Build wallet and display your address
3. Check balance and wait for funding if needed
4. Load compiled contract
5. Deploy to Midnight Testnet
6. Save contract address to `deployment.json`

**Example Output:**

```
🌙 Midnight Hello World Deployment

✓ Using wallet seed from .env file
Building wallet...
Your wallet address is: mn1abc123...
Balance: 1000000
Loading contract...
Setting up providers...
Deploying contract (30-60 seconds)...

✅ DEPLOYED!
Contract: 0x1234abcd5678ef90...

Saved to deployment.json
```

### Created Artifacts

After successful deployment, your project contains:

- **`deployment.json`**: Contains contract address and deployment timestamp
  ```json
  {
    "contractAddress": "0x1234abcd5678ef90...",
    "deployedAt": "2025-11-27T10:30:00.000Z"
  }
  ```
- **`dist/`**: Compiled JavaScript files
- **`midnight-level-db/`**: Private state storage database
- **Wallet seed**: 64-character hex string (save securely!)

### Final Project Structure After Deployment

```
my-mn-app/
├── contracts/
│   ├── hello-world.compact
│   ├── keys/
│   ├── managed/
│   │   └── hello-world/
│   │       ├── compiler/
│   │       ├── contract/              # Contains index.cjs
│   │       ├── keys/
│   │       └── zkir/
│   └── zkir/
├── src/
│   ├── cli.ts
│   └── deploy.ts
├── dist/                              # Generated by TypeScript compiler
│   ├── cli.js
│   └── deploy.js
├── midnight-level-db/                 # Generated during deployment
├── node_modules/
├── deployment.json                    # Generated after deployment ✨
├── .env                               # Optional: Store WALLET_SEED here
├── package.json
├── package-lock.json
├── tsconfig.json
└── README.md
```

### Important: Save These Securely

- **Wallet Seed**: 64-character hex string
  - Keep **private and secure**
  - Losing it means **losing wallet access**
  - Never share or commit to version control
  - Store in `.env` file (add to `.gitignore`)

- **Contract Address**: Found in `deployment.json`
  - Required for all contract interactions
  - Can be shared publicly
  - Needed by the CLI to connect to your deployed contract

### Next Steps

Your Hello World contract is now live on Midnight Testnet! 🎉

Continue to the [Interacting with the Contract](#💬-interacting-with-the-deployed-contract) section to learn how to use the CLI.

## 💬 Interacting with the Deployed Contract

After deployment, you can use the interactive CLI to interact with your Hello World contract on Midnight Testnet.

### CLI Prerequisites

Before running the CLI, ensure you have:

- ✅ A `deployment.json` file containing the contract address
- ✅ Your 64-character hexadecimal wallet seed (or `.env` file with `WALLET_SEED`)
- ✅ All project dependencies installed (`npm install`)
- ✅ Compiled TypeScript code (`npm run build`)
- ✅ The proof server running on `http://127.0.0.1:6300`

### Understanding the CLI Script

The `src/cli.ts` script provides an interactive menu for calling contract functions and managing blockchain interactions.

#### CLI Architecture

The CLI script (`src/cli.ts`) follows this structure:

##### 1. Import Required Libraries

```typescript
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
  getLedgerNetworkId
} from "@midnight-ntwrk/midnight-js-network-id";
import { createBalancedTx } from "@midnight-ntwrk/midnight-js-types";
import { Transaction } from "@midnight-ntwrk/ledger";
import { Transaction as ZswapTransaction, nativeToken } from "@midnight-ntwrk/zswap";
```

These modules provide wallet management, contract connectivity, and command-line interface functionality.

##### 2. Network Configuration

```typescript
// Fix WebSocket for Node.js environment
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
```

##### 3. Main Function Initialization

```typescript
async function main() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
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
      process.env.WALLET_SEED || 
      await rl.question("Enter your wallet seed: ");

    console.log("\nConnecting to Midnight network...");
```

##### 4. Build and Sync Wallet

```typescript
// Build wallet from seed
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

// Wait for wallet to sync with blockchain
console.log("Waiting for wallet to sync with blockchain...");
await Rx.firstValueFrom(
  wallet.state().pipe(
    Rx.tap((state) => {
      if (state.syncProgress) {
        console.log(`📊 Syncing... (Synced: ${state.syncProgress.synced})`);
      }
    }),
    Rx.filter((s) => s.syncProgress?.synced === true),
    Rx.take(1)
  )
);
console.log("\n✅ Wallet successfully synced with network!");
```

##### 5. Load Compiled Contract

```typescript
// Load compiled contract
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
```

##### 6. Create Wallet Provider

```typescript
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
  }
};
```

##### 7. Configure Providers and Connect to Contract

```typescript
// Configure providers
const zkConfigPath = path.join(contractPath, "managed", "hello-world");
const providers = {
  privateStateProvider: levelPrivateStateProvider({
    privateStateStoreName: "hello-world-state"
  }),
  publicDataProvider: indexerPublicDataProvider(
    TESTNET_CONFIG.indexer,
    TESTNET_CONFIG.indexerWS
  ),
  zkConfigProvider: new NodeZkConfigProvider(contractPath),
  proofProvider: httpClientProofProvider(TESTNET_CONFIG.proofServer),
  walletProvider: walletProvider,
  midnightProvider: walletProvider
};

// Connect to deployed contract
const deployed: any = await findDeployedContract(providers, {
  contractAddress: deployment.contractAddress,
  contract: contractInstance,
  privateStateId: "helloWorldState",
  initialPrivateState: {}
});

console.log("✅ Connected to contract\n");
```

##### 8. Interactive Menu Loop

```typescript
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

  const choice = await rl.question("\nYour choice: ");

  switch (choice) {
    case "1":
      // Store message logic
      break;
    case "2":
      // Read message logic
      break;
    case "3":
      running = false;
      console.log("\nGoodbye! 👋");
      break;
    // ... other cases
  }
}

// Clean up
await wallet.close();
```

### Running the CLI

Follow these steps to interact with your deployed contract:

#### Step 1: Ensure Proof Server is Running

If not already running, start it in a separate terminal:

```bash
docker run -p 6300:6300 midnightnetwork/proof-server -- 'midnight-proof-server --network testnet'
```

#### Step 2: Build the Project

```bash
npm run build
```

This compiles the TypeScript CLI application to JavaScript.

#### Step 3: Run the CLI

```bash
npm run cli
```

The CLI will:
1. Check for `deployment.json`
2. Prompt for your wallet seed (or use `.env`)
3. Connect to the Midnight network
4. Sync your wallet with the blockchain
5. Connect to your deployed contract
6. Display the interactive menu

### CLI Menu Options

Our enhanced CLI provides seven interactive options:

#### Option 1: Store Message

Calls the `storeMessage()` function in the smart contract to write a new message to the blockchain.

**Process:**
1. Prompts for custom message input
2. Creates a transaction with your message
3. Generates zero-knowledge proof
4. Submits transaction to blockchain
5. Costs gas fees (tDUST)
6. Takes 10-30 seconds to complete

**Example interaction:**

```
Your choice: 1

Storing custom message...
Enter your message: Privacy is powerful!
✅ Success!
Message: "Privacy is powerful!"
Transaction hash: 0x5678abcd...
Transaction ID: 0x5678...efgh
Block height: 123457
```

**Important Notes:**
- Each call creates a new transaction
- The latest message overwrites previous messages
- You can call `storeMessage()` multiple times
- Transaction must be mined before appearing on-chain

#### Option 2: Read Current Message

Reads the current message stored in the contract's ledger state.

**Process:**
1. Queries the contract state via the indexer
2. Deserializes the ledger data
3. Decodes the message from the opaque string
4. Displays the message

**Example interaction:**

```
Your choice: 2

Reading message from blockchain...
📝 Current message: "Privacy is powerful!"
```

**Important Notes:**
- Reads from the public ledger state
- No transaction or gas fees required
- Shows the most recently stored message
- Returns "No message found" if contract is newly deployed

#### Option 3: Exit

Closes the CLI application gracefully.

**Process:**
1. Exits the menu loop
2. Closes wallet connection
3. Terminates the application

#### Option 4: Send tDUST

Transfer tDUST tokens to another Midnight address.

**Process:**
1. Prompts for recipient Midnight address
2. Prompts for amount (in tDUST)
3. Prepares transfer transaction
4. Generates ZK proof
5. Submits transaction
6. Returns transaction identifier

**Example interaction:**

```
Your choice: 4

Enter recipient Midnight address: mn1xyz789...
Enter amount of tDUST to send (integer, e.g. 1): 100

Preparing transfer transaction...
Proving transaction (generating ZK proofs)...
Submitting transaction to Midnight network...
Transaction submitted successfully:
  transaction identifier: 0xabc123...
```

#### Option 5: Show Wallet Balance

Displays your current tDUST balance.

**Example interaction:**

```
Your choice: 5

Your wallet balance is: 950000 tDUST
```

#### Option 6: Show Transaction Details by Hash

Query and display full transaction details using the transaction hash.

**Process:**
1. Prompts for transaction hash (HexEncoded)
2. Queries the indexer GraphQL API
3. Displays comprehensive transaction information

**Example interaction:**

```
Your choice: 6

Enter transaction hash (HexEncoded): 0x5678abcd...

=== Transaction Details ===
Hash:        0x5678abcd...
Protocol ver: 1
Block:       #123457 (0xblock123...)
Identifiers: 0xid1..., 0xid2...
Merkle root: 0xmerkle...
Contract actions:
  type: ContractCall
    address: 0x1234abcd...
    entryPoint: storeMessage
    state: 0xstate...
===========================
```

#### Option 7: Show Transaction Details by Identifier

Query transaction details using the transaction identifier.

**Process:**
1. Prompts for transaction identifier (HexEncoded)
2. Queries the indexer GraphQL API
3. Displays comprehensive transaction information

**Usage:** Similar to Option 6, but uses the transaction identifier instead of hash.

### Understanding Contract Interactions

#### Storing Messages (Write Operation)

When you store a message:

1. **Input**: Your message is kept private by default
2. **ZK Proof Generation**: The proof server creates a zero-knowledge proof that you:
   - Know the message content
   - Have authority to call the contract
   - Have sufficient tDUST for gas fees
3. **Disclosure**: The `disclose()` function in the contract makes the message public on the ledger
4. **Transaction Submission**: The proven transaction is submitted to the network
5. **Mining**: Miners include your transaction in a block
6. **Confirmation**: The message is now permanently stored on-chain

#### Reading Messages (Read Operation)

When you read a message:

1. **Query**: The CLI queries the indexer for current contract state
2. **Deserialization**: The ledger state is deserialized into the contract's data structure
3. **Decoding**: The opaque string is converted to readable text
4. **Display**: The message is shown in the console

**No transaction required** - reading is free!

### Multiple Interactions

You can perform multiple operations in a single CLI session:

```
--- Menu ---
1. Store message
2. Read current message
3. Exit
4. Send tDUST
5. Show wallet balance
6. Show transaction details by hash
7. Show transaction details by identifier

Your choice: 1
[Store "Hello Midnight"]

Your choice: 2
[Read: "Hello Midnight"]

Your choice: 1
[Store "Privacy is powerful!"]

Your choice: 2
[Read: "Privacy is powerful!"]

Your choice: 5
[Balance: 945000 tDUST]

Your choice: 3
[Exit]
```

Each `storeMessage()` call creates a new transaction that updates the contract state with the latest message.

### Enhanced Features in Our Implementation

Our CLI includes additional features beyond the basic tutorial:

✅ **Environment Variable Support** - Store wallet seed in `.env`  
✅ **Token Transfers** - Send tDUST to other addresses  
✅ **Balance Checking** - View your current tDUST balance  
✅ **Transaction Queries** - Look up transaction details by hash or identifier  
✅ **GraphQL Integration** - Query the indexer for detailed blockchain data  
✅ **Sync Progress Monitoring** - Visual feedback during wallet sync  
✅ **Error Handling** - Graceful error messages and recovery  
✅ **Timeout Protection** - Prevents hanging on network issues  

### Next Steps: Enhancing Your DApp

Now that you can interact with a privacy-preserving smart contract, consider these enhancements:

#### Enhanced Contract Features

**Message Validation:**
```compact
export circuit storeMessage(customMessage: Opaque<"string">): [] {
    // Add length validation
    assert(length(customMessage) <= 280, "Message too long");
    message = disclose(customMessage);
}
```

**Message History:**
```compact
export ledger messages: Array<Opaque<"string">>;

export circuit storeMessage(customMessage: Opaque<"string">): [] {
    messages = append(messages, disclose(customMessage));
}
```

**Private Messaging:**
```compact
// Store confidential data using private state
ledger publicMessage: Opaque<"string">;
witness privateNote: Opaque<"string">;

export circuit storeMessage(
    publicMsg: Opaque<"string">,
    privateNote: Opaque<"string">
): [] {
    publicMessage = disclose(publicMsg);
    privateNote = privateNote; // Kept private, not disclosed
}
```

#### UI Improvements

**Web Interface:**
- Build a frontend using React or Next.js
- Integrate Lace wallet for browser-based interactions
- Create a modern UI for message storage and retrieval

**Real-time Updates:**
- Use WebSocket connection to listen for blockchain events
- Update UI automatically when new messages are stored
- Show live transaction confirmations

**Transaction Status:**
- Display pending transactions with loading indicators
- Show confirmation progress (block confirmations)
- Provide transaction history with timestamps

**Enhanced Features:**
- Message pagination and search
- User authentication and profiles
- Message threading and replies
- Emoji and markdown support

#### Advanced Development

**Testing:**
- Write unit tests for contract logic
- Create integration tests for the CLI
- Implement end-to-end testing

**Deployment Automation:**
- CI/CD pipeline for contract updates
- Automated testing on testnet
- Mainnet deployment procedures

**Monitoring:**
- Transaction tracking dashboard
- Gas usage analytics
- Contract state monitoring

## 🔐 Security Notes

- **Never share your wallet seed** - Anyone with your seed has full access to your funds
- Store your seed in the `.env` file and add `.env` to `.gitignore`
- The `.env` file should never be committed to version control
- Keep your seed backed up in a secure location

## 📚 Key Dependencies

- `@midnight-ntwrk/wallet` - Wallet management
- `@midnight-ntwrk/ledger` - Ledger interactions
- `@midnight-ntwrk/midnight-js-contracts` - Contract deployment and interaction
- `@midnight-ntwrk/compact-runtime` - Compact language runtime
- `@midnight-ntwrk/zswap` - Zero-knowledge swap protocol

## 🐛 Troubleshooting

### Common Issues After Cloning

#### "command not found: compact"

**Problem:** Compact compiler not installed or not in PATH.

**Solution:**
```bash
# Install Compact
curl --proto '=https' --tlsv1.2 -LsSf https://github.com/midnightntwrk/compact/releases/download/compact-v0.2.0/compact-installer.sh | sh

# Restart your terminal or source your shell config
source ~/.bashrc  # or ~/.zshrc for zsh

# Verify installation
compact --version
```

#### "Cannot find module" errors after npm install

**Problem:** Dependencies not properly installed.

**Solution:**
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

#### "Contract not found! Run: npm run compile"

**Problem:** Contract hasn't been compiled yet.

**Solution:**
```bash
npm run compile
npm run build
```

#### "No deployment.json found!"

**Problem:** Contract hasn't been deployed yet.

**Solution:**
```bash
# Make sure proof server is running first
npm run deploy
```

#### "Error: connect ECONNREFUSED 127.0.0.1:6300"

**Problem:** Proof server not running.

**Solution:**
```bash
# In a separate terminal window
docker run -p 6300:6300 midnightnetwork/proof-server -- 'midnight-proof-server --network testnet'

# Verify it's running
curl http://127.0.0.1:6300/health
```

#### "Docker: command not found"

**Problem:** Docker not installed.

**Solution:**
- Download and install [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- Restart your computer after installation
- Verify: `docker --version`

### Wallet and Network Issues

#### Wallet Sync Timeout

**Problem:** Wallet taking too long to sync or timing out.

**Solution:**
- Check your internet connection
- Verify indexer endpoints are reachable:
  ```bash
  curl https://indexer.testnet-02.midnight.network/api/v1/graphql
  ```
- Ensure WebSocket connections aren't blocked by firewall
- Try again - first sync can take 3-5 minutes

#### "Invalid seed. Must be 64 characters"

**Problem:** Wallet seed is incorrect format.

**Solution:**
- Seed must be exactly 64 hexadecimal characters (0-9, a-f)
- Check for spaces or line breaks in your `.env` file
- Generate a new seed using the deployment script if needed

#### "Your wallet balance is: 0"

**Problem:** No tDUST tokens in wallet.

**Solution:**
1. Copy your wallet address from the terminal
2. Visit [Midnight Faucet](https://midnight.network/test-faucet/)
3. Paste your address and request tDUST
4. Wait 2-5 minutes for tokens to arrive
5. The deployment script will automatically continue

### Build and Compilation Issues

#### TypeScript compilation errors

**Problem:** `npm run build` fails with TypeScript errors.

**Solution:**
```bash
# Ensure you're using compatible Node.js version
node --version  # Should be v18 or higher

# Clean build
rm -rf dist
npm run build
```

#### "EACCES: permission denied" errors

**Problem:** Permission issues with npm global packages.

**Solution:**
```bash
# Use nvm to manage Node.js (recommended)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 20
nvm use 20
```

### Contract Interaction Issues

#### "Failed to store message" or transaction errors

**Problem:** Transaction submission failed.

**Solution:**
1. Verify proof server is running: `curl http://127.0.0.1:6300/health`
2. Check your wallet has sufficient tDUST balance
3. Ensure you're connected to the correct network (Testnet)
4. Try again - network congestion can cause occasional failures

#### "No message found" when reading

**Problem:** Contract has no stored message yet.

**Solution:**
- This is normal for newly deployed contracts
- Store a message first using option 1 in the CLI
- Wait for the transaction to be confirmed (10-30 seconds)
- Then read the message using option 2

### Docker Issues

#### "port is already allocated"

**Problem:** Port 6300 is already in use.

**Solution:**
```bash
# Find what's using port 6300
lsof -i :6300  # On macOS/Linux
netstat -ano | findstr :6300  # On Windows

# Stop the existing process or use a different port
docker run -p 6301:6300 midnightnetwork/proof-server -- 'midnight-proof-server --network testnet'

# Update TESTNET_CONFIG in your code to use port 6301
```

#### "Cannot connect to Docker daemon"

**Problem:** Docker Desktop not running.

**Solution:**
- Start Docker Desktop application
- Wait for it to fully start (icon should be green/running)
- Try the docker command again

## 🆘 Getting Help

If you encounter issues not covered here:

1. **Check the logs** - Error messages often contain helpful details
2. **GitHub Issues** - [Report an issue](https://github.com/ShehanSuraweera/midnight-examples/issues)
3. **Midnight Documentation** - [Official Docs](https://docs.midnight.network/)
4. **Community** - Join the Midnight Network community channels

## 📝 Project Checklist

Use this checklist to ensure you've completed all setup steps:

- [ ] Node.js v18+ installed (`node --version`)
- [ ] npm v9+ installed (`npm --version`)
- [ ] Docker Desktop installed and running (`docker --version`)
- [ ] Compact compiler installed (`compact --version`)
- [ ] Lace wallet created with test tokens
- [ ] Repository cloned
- [ ] Dependencies installed (`npm install`)
- [ ] `.env` file created from `.env.example`
- [ ] Proof server running (separate terminal)
- [ ] Contract compiled (`npm run compile`)
- [ ] TypeScript built (`npm run build`)
- [ ] Contract deployed (`npm run deploy`)
- [ ] CLI tested (`npm run cli`)

## 🔐 Security Notes

- **Never share your wallet seed** - Anyone with your seed has full access to your funds
- Store your seed in the `.env` file and add `.env` to `.gitignore`
- The `.env` file should never be committed to version control
- Keep your seed backed up in a secure location

## 📚 Key Dependencies

- `@midnight-ntwrk/wallet` - Wallet management
- `@midnight-ntwrk/ledger` - Ledger interactions
- `@midnight-ntwrk/midnight-js-contracts` - Contract deployment and interaction
- `@midnight-ntwrk/compact-runtime` - Compact language runtime
- `@midnight-ntwrk/zswap` - Zero-knowledge swap protocol

## 🔗 Resources

### Official Midnight Resources

- **[Midnight Network](https://midnight.network/)** - Official website
- **[Midnight Documentation](https://docs.midnight.network/)** - Comprehensive developer docs
- **[Midnight Test Faucet](https://midnight.network/test-faucet)** - Get free tDUST tokens
- **[Compact Language Reference](https://docs.midnight.network/develop/compact)** - Smart contract language guide

### Development Tools

- **[Lace Wallet](https://chromewebstore.google.com/detail/lace-beta/hgeekaiplokcnmakghbdfbgnlfheichg)** - Chrome extension wallet
- **[Compact Compiler](https://github.com/midnightntwrk/compact/releases)** - Latest compiler releases
- **[VS Code Extension](https://github.com/midnightntwrk/compact/releases)** - Syntax highlighting for Compact

### Community & Support

- **[GitHub Issues](https://github.com/ShehanSuraweera/midnight-examples/issues)** - Report bugs or request features
- **[Midnight Documentation](https://docs.midnight.network/)** - Official docs and guides

### Next Steps

This repository demonstrates:
- ✅ Basic contract deployment and interaction
- ✅ Wallet management and transaction signing
- ✅ Zero-knowledge proof generation
- ✅ State management (public ledger)

For more advanced examples, explore:
- **Counter DApp** - State modification with circuits
- **Bulletin Board** - Multi-user messaging system
- **DEX** - Decentralized exchange with privacy
- **Private Voting** - Anonymous voting with ZKPs

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

---

Built with 🌙 on Midnight Network
