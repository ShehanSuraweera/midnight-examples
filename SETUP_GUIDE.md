# Quick Setup Guide for Midnight Hello World DApp

This is a quick reference guide. For full details, see the main [README.md](README.md).

## 🚀 Quick Start (5 Steps)

### 1. Prerequisites Check
```bash
# Verify installations
node --version    # Need v18+
npm --version     # Need v9+
docker --version  # Need Docker Desktop
compact --version # Need Compact compiler
```

### 2. Clone & Install
```bash
git clone https://github.com/ShehanSuraweera/midnight-examples.git
cd midnight-examples/my-mn-app
npm install
```

### 3. Setup Environment
```bash
cp .env.example .env
# Edit .env and add your wallet seed (or let deploy script generate one)
```

### 4. Start Proof Server (Keep Running)
```bash
# In a separate terminal
docker run -p 6300:6300 midnightnetwork/proof-server -- 'midnight-proof-server --network testnet'
```

### 5. Build & Deploy
```bash
npm run compile  # Compile Compact contract
npm run build    # Build TypeScript
npm run deploy   # Deploy to Testnet
npm run cli      # Interact with contract
```

## 📋 Complete Checklist

Before you start:
- [ ] Node.js v18+ installed
- [ ] npm v9+ installed
- [ ] Docker Desktop running
- [ ] Compact compiler installed
- [ ] Lace wallet setup with tDUST tokens

After cloning:
- [ ] `npm install` completed
- [ ] `.env` file created
- [ ] Proof server running
- [ ] `npm run compile` successful
- [ ] `npm run build` successful
- [ ] `npm run deploy` successful
- [ ] `npm run cli` working

## 🐛 Common Issues

| Issue | Solution |
|-------|----------|
| "compact: command not found" | Install Compact compiler (see README) |
| "Cannot connect to proof server" | Start Docker proof server |
| "No deployment.json found" | Run `npm run deploy` first |
| "Contract not found" | Run `npm run compile` then `npm run build` |
| "Balance is 0" | Get tDUST from faucet |

## 🔗 Quick Links

- [Full README](README.md) - Complete documentation
- [Midnight Faucet](https://midnight.network/test-faucet) - Get test tokens
- [Midnight Docs](https://docs.midnight.network/) - Official documentation
- [Report Issues](https://github.com/ShehanSuraweera/midnight-examples/issues)

## 💡 Tips

1. **Keep proof server running** - Start it once and leave it
2. **Use .env file** - Store wallet seed securely
3. **Check balance first** - Ensure you have tDUST before deploying
4. **Read error messages** - They usually tell you what's wrong
5. **First sync takes time** - Wallet sync can take 3-5 minutes initially

---

Happy building on Midnight! 🌙
