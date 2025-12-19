# HFDX - Decentralized Perpetual Exchange

A white-label decentralized perpetual futures exchange powered by GMX Protocol.

## 🌟 Overview

HFDX is a fully functional perpetual trading platform built on top of GMX's battle-tested infrastructure. It provides:

- **Up to 100x Leverage** on BTC, ETH, AVAX and other top cryptocurrencies
- **Multi-Chain Support** - Arbitrum, Avalanche, and Botanix
- **Non-Custodial Trading** - Trade directly from your wallet
- **Deep Liquidity** - Powered by GMX's liquidity pools
- **Advanced Trading Tools** - Full TradingView integration

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18.x or higher
- **Yarn** 3.x (package manager)
- **Git**

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/hfdx.git
cd hfdx

# Install dependencies
yarn install

# Start development server
yarn start
```

The app will be available at `http://localhost:3010`

## 🛠️ Development Scripts

| Command | Description |
|---------|-------------|
| `yarn start` | Start development server on port 3010 |
| `yarn build` | Build for production |
| `yarn test` | Run tests |
| `yarn lint` | Run ESLint |
| `yarn lint:fix` | Fix ESLint issues |
| `yarn tscheck` | TypeScript type checking |

## 📦 Production Build

```bash
# Create optimized production build
yarn build

# The build output will be in the `build` directory
```

## 🌐 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Configure build settings:
   - **Framework Preset**: Vite
   - **Build Command**: `yarn build`
   - **Output Directory**: `build`
   - **Install Command**: `yarn install`
3. Add custom domain: `app.hfdx.xyz`

### Netlify

1. Connect your GitHub repository to Netlify
2. Build settings are automatically configured via `netlify.toml`
3. Add custom domain in Netlify dashboard

### AWS S3 + CloudFront

1. Create an S3 bucket for static hosting
2. Build the project: `yarn build`
3. Upload contents of `build/` to S3
4. Configure CloudFront distribution with:
   - Origin: Your S3 bucket
   - Default Root Object: `index.html`
   - Error Pages: 403/404 → `/index.html` (for SPA routing)

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Optional: UI fee receiver address to collect trading fees
VITE_APP_UI_FEE_RECEIVER=0xYOUR_FEE_RECEIVER_ADDRESS
```

### Customization

#### Branding

- **Logos**: Update SVGs in `src/img/logo-icon.svg` and `src/img/logo-text.svg`
- **Colors**: Modify `src/config/colors.ts`
- **Meta Tags**: Edit `index.html` and `src/components/Seo/SEO.tsx`

#### Links & Configuration

- **Production Host**: Update in `src/config/links.ts`
- **App Name**: Update in `src/lib/wallets/rainbowKitConfig.ts`

## 📁 Project Structure

```
hfdx/
├── public/                 # Static assets
│   ├── charting_library/   # TradingView charting
│   └── favicon/            # App icons
├── sdk/                    # GMX SDK (built-in)
├── src/
│   ├── App/               # React App root & routing
│   ├── components/        # React components
│   ├── config/            # Configuration files
│   ├── context/           # React contexts
│   ├── domain/            # Business logic
│   ├── img/               # Images & icons
│   ├── lib/               # Utility libraries
│   ├── locales/           # Translations (i18n)
│   ├── pages/             # Page components
│   └── styles/            # Global styles
├── index.html             # HTML entry point
├── package.json           # Dependencies
├── netlify.toml           # Netlify config
├── vercel.json            # Vercel config
└── vite.config.ts         # Vite bundler config
```

## 🔗 GMX Protocol APIs

HFDX uses the following GMX infrastructure:

### Oracle APIs
- **Arbitrum**: `https://arbitrum-api.gmxinfra.io`
- **Avalanche**: `https://avalanche-api.gmxinfra.io`
- **Botanix**: `https://botanix-api.gmxinfra.io`

### Subsquid (GraphQL)
- **Arbitrum**: `https://gmx.squids.live/gmx-synthetics-arbitrum:prod/api/graphql`
- **Avalanche**: `https://gmx.squids.live/gmx-synthetics-avalanche:prod/api/graphql`
- **Botanix**: `https://gmx.squids.live/gmx-synthetics-botanix:prod/api/graphql`

## 🎨 UI Fee Collection

To collect UI fees from trades on your platform:

1. Set `VITE_APP_UI_FEE_RECEIVER` to your wallet address
2. Configure fee factor via GMX's `ExchangeRouter.setUiFeeFactor`
3. Claim fees using `ExchangeRouter.claimUiFees`

Maximum UI fee is limited by `dataStore.getUint(Keys.MAX_UI_FEE_FACTOR)`.

## 📚 Documentation

- [GMX Docs](https://docs.gmx.io)
- [GMX SDK](https://github.com/gmx-io/gmx-interface/tree/master/sdk)
- [GMX Synthetics Contracts](https://github.com/gmx-io/gmx-synthetics)

## 🛡️ Security

- All trades execute directly on GMX smart contracts
- No funds are held by HFDX
- Users maintain full custody of their assets
- Smart contracts are audited by leading security firms

## 📄 License

Licensed under MIT. See [LICENSE](./LICENSE) for details.

---

**Built with ❤️ powered by GMX Protocol**
