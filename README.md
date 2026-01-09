# HFDX - Perpetual Futures DEX

A white-label perpetual futures decentralized exchange built on the ApolloX Broker SDK.

**Live URL:** [https://app.hfdx.xyz](https://app.hfdx.xyz)

---

## Overview

HFDX is a perpetual futures trading platform powered by the ApolloX Broker SDK v4.0.3. It enables users to trade cryptocurrency perpetual futures with up to 500x leverage on BNB Chain.

### Key Features

- **Perpetual Futures Trading** - Trade BTC, ETH, and 100+ crypto pairs
- **Up to 500x Leverage** - High leverage trading in Degen Mode
- **Non-Custodial** - Your keys, your crypto
- **BNB Chain** - Fast, low-cost transactions
- **Professional Trading UI** - TradingView charts, advanced order types

---

## Configuration

| Setting | Value |
|---------|-------|
| Broker ID | `2063` |
| Domain | `app.hfdx.xyz` |
| Network | BNB Chain |
| SDK Version | 4.0.3 |

---

## Project Structure

```
HFDX/
├── index.html          # Main entry point
├── custom.css          # HFDX brand styling
├── vercel.json         # Vercel deployment config
├── package.json        # NPM package file
├── lws.config.cjs      # Local dev server config
├── assets/             # HFDX branding assets
│   ├── logo-dark.svg
│   ├── logo-dark-rwd.svg
│   ├── logo-light.svg
│   └── logo-light-rwd.svg
├── sdk/                # ApolloX SDK files
│   ├── sdk.4.0.3.js
│   └── sdk.4.0.3.esm.js
└── static/             # SDK static assets
    ├── um_futures.4.0.3.html
    ├── charting_library_26/
    ├── images/
    └── [chunk files...]
```

---

## Local Development

### Prerequisites

- Node.js 18+
- npm or yarn

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/overthetopseo/HFDX.git
   cd HFDX
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3333](http://localhost:3333) in your browser.

---

## Vercel Deployment (Recommended)

### Prerequisites
- Vercel account (free at [vercel.com](https://vercel.com))
- GitHub repository connected to Vercel

### Deploy Steps

1. **Connect GitHub to Vercel:**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your `overthetopseo/HFDX` repository
   - Click "Deploy"

2. **Configure Custom Domain:**
   - Go to your Vercel project → Settings → Domains
   - Add `app.hfdx.xyz`
   - Vercel will provide DNS records to configure

3. **That's it!** Vercel automatically:
   - Deploys on every push to `main`
   - Provides free SSL certificate
   - Global CDN distribution
   - Automatic HTTPS

---

## Cloudflare DNS Setup

If you're using Cloudflare for DNS (recommended for hfdx.xyz):

### Option 1: Vercel + Cloudflare DNS (Recommended)

1. **In Cloudflare Dashboard:**
   - Go to DNS settings for hfdx.xyz
   - Add a CNAME record:
     ```
     Type: CNAME
     Name: app
     Target: cname.vercel-dns.com
     Proxy status: DNS only (grey cloud)
     ```
   - **Important:** Set proxy to "DNS only" (grey cloud icon) for Vercel

2. **In Vercel:**
   - Add `app.hfdx.xyz` as a custom domain
   - Vercel handles SSL automatically

### Option 2: Full Cloudflare (Pages + CDN)

If you want to use Cloudflare Pages instead of Vercel:

1. **Create Cloudflare Pages Project:**
   - Go to Cloudflare Dashboard → Pages
   - Connect your GitHub account
   - Select `overthetopseo/HFDX` repository
   - Build settings:
     - Framework preset: None
     - Build command: (leave empty)
     - Build output directory: `/`

2. **Configure Custom Domain:**
   - In Pages project → Custom domains
   - Add `app.hfdx.xyz`
   - Cloudflare automatically handles DNS and SSL

### Cloudflare Settings (if using proxy)

If using Cloudflare proxy (orange cloud), configure these:

1. **SSL/TLS:**
   - Mode: Full (strict)

2. **Caching:**
   - Go to Rules → Cache Rules
   - Create rule to cache `/static/*` and `/sdk/*`

3. **Page Rules (optional):**
   ```
   app.hfdx.xyz/static/* → Cache Level: Cache Everything
   app.hfdx.xyz/sdk/* → Cache Level: Cache Everything
   ```

---

## Server Requirements

**No traditional server needed!** This is a static site that can be hosted on:

| Platform | Cost | Recommended |
|----------|------|-------------|
| **Vercel** | Free | Yes - Easiest setup |
| **Cloudflare Pages** | Free | Yes - If already using Cloudflare |
| **Netlify** | Free | Alternative option |
| **AWS S3 + CloudFront** | ~$1-5/month | Enterprise option |

All platforms provide:
- Free SSL/HTTPS
- Global CDN
- Automatic deployments from GitHub

---

## Customization

### Branding

1. **Logos**: Replace files in `/assets/` with your HFDX logos
   - `logo-dark.svg` - Full logo for dark theme
   - `logo-dark-rwd.svg` - Mobile/compact logo for dark theme
   - `logo-light.svg` - Full logo for light theme
   - `logo-light-rwd.svg` - Mobile/compact logo for light theme

2. **Colors**: Edit `/custom.css` to change the color scheme
   - Modify CSS variables in `:root` and `html.light` sections

3. **Favicon**: Add `favicon.ico` to the root directory

### Configuration

Edit `index.html` to modify:
- `brokerId` - Your ApolloX broker ID
- `supportNetworks` - Supported blockchain networks
- `headerConfig` - Navigation menu and links
- `features` - Enable/disable platform features

---

## Important Links

| Resource | URL |
|----------|-----|
| Live DEX | https://app.hfdx.xyz |
| Main Website | https://hfdx.xyz |
| Commission Dashboard | https://www.apollox.finance/en/build-your-dex/commission?Broker=2063 |
| Referral Link | https://www.apollox.finance/en/futures/v2/BTCUSD?Broker=2063 |

---

## Ecosystem Updates (Static Pages)

- GMX Development Update (Jan 9, 2026): `/updates/gmx-development-update-2026-01-09.html`

---

## SDK Documentation

For detailed SDK documentation, refer to:
- [ApolloX Broker Web SDK](https://github.com/apollox-finance/broker-web-sdk)
- [SDK Releases](https://github.com/apollox-finance/broker-web-sdk/releases)

---

## Support

For technical support or questions:
- Visit [hfdx.xyz/support](https://hfdx.xyz/support)
- Check [ApolloX Documentation](https://github.com/apollox-finance/broker-web-sdk#readme)

---

## License

This project uses the ApolloX Broker SDK under their license terms.

© 2024 HFDX. All rights reserved.
