# Midnight Hello World - Frontend

A beautiful React + Vite frontend for the Midnight Hello World DApp. This interface allows users to interact with the Midnight blockchain through their Lace wallet.

## 🎨 Features

- **Modern UI**: Built with React, TypeScript, and Tailwind CSS
- **Lace Wallet Integration**: Connect and interact with your Midnight wallet
- **Real-time Updates**: View stored messages from the blockchain
- **Responsive Design**: Works on desktop and mobile devices
- **Educational**: Learn about Zero-Knowledge Proofs and privacy-preserving tech
- **Beautiful Gradient Theme**: Dark mode with Midnight Network branding

## 🚀 Quick Start

### Prerequisites

- Node.js v18 or higher
- Lace Midnight Preview wallet extension installed
- The smart contract deployed (run `npm run deploy` from the root directory)

### Installation

```bash
# From the frontend directory
npm install
```

### Development

```bash
# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
# Build the production bundle
npm run build

# Preview the production build
npm run preview
```

## 🔗 Connecting Your Wallet

1. **Install Lace Wallet**  
   Get it from the [Chrome Web Store](https://chromewebstore.google.com/detail/lace-beta/hgeekaiplokcnmakghbdfbgnlfheichg)

2. **Create/Setup Your Wallet**
   - Open Lace and create a new wallet or import existing one
   - Save your seed phrase securely

3. **Get Test Tokens**  
   Visit the [Midnight Faucet](https://midnight.network/test-faucet) to get tDUST tokens

4. **Connect to DApp**  
   Click the "Connect Wallet" button in the app and approve the connection

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── WalletConnect.tsx      # Wallet connection UI
│   │   ├── MessageForm.tsx        # Message submission form
│   │   └── MessageDisplay.tsx     # Display stored messages
│   ├── services/
│   │   └── midnight.ts            # API service for blockchain interaction
│   ├── types/
│   │   └── midnight.ts            # TypeScript type definitions
│   ├── App.tsx                    # Main app component
│   ├── index.css                  # Tailwind styles
│   └── main.tsx                   # Entry point
├── public/
│   └── deployment.json            # Contract deployment info
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── vite.config.ts
```

## 🎨 UI Components

### WalletConnect Component
- Detects Lace wallet installation
- Handles wallet connection and disconnection
- Displays wallet address (truncated)
- Shows tDUST balance
- Installation prompt if wallet not found

### MessageForm Component
- Textarea input for message submission
- Character count indicator (280 max)
- Submit button with loading state
- Disabled when wallet not connected
- Visual feedback during transaction

### MessageDisplay Component
- Shows current message from blockchain
- Refresh button to fetch latest data
- Displays contract address
- Loading and error states
- Empty state when no message exists

### Main App Features
- Header with branding and GitHub link
- Info banner explaining the DApp
- Feature cards (ZKPs, Selective Disclosure, Security)
- "How It Works" 4-step guide
- Quick links to resources
- Responsive grid layout

## 🔧 Configuration

The frontend automatically reads the contract address from `public/deployment.json`. This file should be copied from the root directory after contract deployment.

### Copy Deployment Info

```bash
# From the root directory, after deploying the contract
cp deployment.json frontend/public/deployment.json
```

### Environment Variables (Optional)

Create a `.env` file if needed:

```env
VITE_API_URL=http://localhost:3001
```

## 🎯 How to Use the DApp

1. **Deploy the Contract** (if not done)
   ```bash
   # From root directory
   npm run deploy
   ```

2. **Copy Deployment Info**
   ```bash
   cp deployment.json frontend/public/deployment.json
   ```

3. **Start Frontend**
   ```bash
   cd frontend
   npm run dev
   ```

4. **Connect Wallet**
   - Click "Connect Wallet"
   - Approve in Lace extension

5. **Store a Message**
   - Enter your message (max 280 characters)
   - Click "Store Message on Blockchain"
   - Approve transaction in wallet
   - Wait for confirmation (10-30 seconds)

6. **View Messages**
   - Current message displays automatically
   - Click refresh to update
   - View transaction details on blockchain

## 🌐 Deployment

### Static Hosting (Vercel, Netlify, GitHub Pages)

```bash
# Build the project
npm run build

# The dist/ folder contains the static files
# Deploy the contents of dist/ to your hosting provider
```

### Vercel Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Netlify Deployment

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod
```

### Important Notes for Deployment

1. **Copy deployment.json**: Ensure the contract deployment info is in `public/deployment.json`
2. **Lace Wallet Required**: Users must have the Lace extension installed
3. **Testnet Only**: This demo works with Midnight Testnet
4. **CORS**: If using a separate backend API, configure CORS appropriately

## 🐛 Troubleshooting

### "Lace Wallet Not Found"
**Problem**: Browser extension not detected

**Solution**:
- Install the [Lace browser extension](https://chromewebstore.google.com/detail/lace-beta/hgeekaiplokcnmakghbdfbgnlfheichg)
- Refresh the page after installation
- Make sure you're using Chrome or a Chromium-based browser

### "Failed to connect to Lace wallet"
**Problem**: Connection request rejected

**Solution**:
- Check that you've approved the connection in Lace
- Try disconnecting and reconnecting
- Restart the browser if issues persist

### "No deployment.json found"
**Problem**: Contract address not available

**Solution**:
```bash
# Deploy the contract first (from root directory)
npm run deploy

# Copy to frontend
cp deployment.json frontend/public/deployment.json
```

### "No message found"
**Problem**: Contract has no stored message

**Solution**:
- This is normal for newly deployed contracts
- Store a message using the form
- Wait for transaction confirmation
- Refresh the display

### Build Errors
**Problem**: npm run build fails

**Solution**:
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Try building again
npm run build
```

### TypeScript Errors
**Problem**: Type errors during development

**Solution**:
- Check that all dependencies are installed
- Restart the TypeScript server in your IDE
- Run `npm run build` to see all errors

## 🎓 Technical Details

### Technologies Used

- **React 18**: Modern React with hooks
- **TypeScript**: Type-safe development
- **Vite**: Fast build tool and dev server
- **Tailwind CSS**: Utility-first styling
- **Lucide React**: Beautiful icon library
- **Midnight SDK**: Blockchain integration (in progress)

### Browser Compatibility

- Chrome 90+ (recommended)
- Edge 90+
- Brave 1.20+
- Other Chromium-based browsers

**Note**: Lace wallet is currently only available for Chromium browsers.

### Performance

- Fast initial load (< 100KB gzipped)
- Code splitting for optimal performance
- Lazy loading of components
- Optimized Tailwind CSS output

## 🔐 Security Notes

- Never share your wallet seed phrase
- Always verify transaction details before approving
- This is a testnet demo - use only tDUST tokens
- Keep your Lace wallet extension updated

## 📚 Learn More

### Midnight Network
- [Midnight Network](https://midnight.network/) - Official website
- [Midnight Documentation](https://docs.midnight.network/) - Developer docs
- [Compact Language](https://docs.midnight.network/develop/compact) - Smart contract language

### Frontend Technologies
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

### Wallet & Tools
- [Lace Wallet](https://www.lace.io/)
- [Midnight Faucet](https://midnight.network/test-faucet)

## 🤝 Contributing

Contributions are welcome! This is a demonstration project to help developers learn about Midnight Network.

### Development Guidelines

1. Follow TypeScript best practices
2. Use Tailwind utility classes for styling
3. Keep components small and focused
4. Add proper error handling
5. Write clear comments for complex logic

### Submitting Changes

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.

---

Built with 🌙 on Midnight Network | [Back to Main README](../README.md)
