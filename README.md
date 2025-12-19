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
├── favicon.ico         # Site favicon
├── deploy.sh           # AWS deployment script
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

2. Install local-web-server for development:
   ```bash
   npm init -y
   npm install local-web-server
   ```

3. Create `lws.config.cjs` for API proxying:
   ```javascript
   module.exports = {
     rewrite: [
       {
         from: '/bapi/(.*)',
         to: 'https://www.apollox.finance/bapi/$1',
       },
       {
         from: '/fapi/(.*)',
         to: 'https://www.apollox.finance/fapi/$1',
       },
       {
         from: '/cloud-futures/(.*)',
         to: 'https://static.apollox.com/cloud-futures/$1',
       },
       {
         from: '/api/(.*)',
         to: 'https://static.apollox.com/api/$1',
       },
     ],
     directory: './',
     logFormat: 'stats',
   };
   ```

4. Start the development server:
   ```bash
   ./node_modules/.bin/ws --port 3333
   ```

5. Open [http://localhost:3333](http://localhost:3333) in your browser.

---

## AWS Deployment

### Prerequisites

- AWS CLI installed and configured
- Access to create S3 buckets and CloudFront distributions
- SSL certificate in AWS Certificate Manager

### Deploy

Run the deployment script:

```bash
chmod +x deploy.sh
./deploy.sh
```

Or manually:

```bash
# Create S3 bucket
aws s3 mb s3://hfdx-dex

# Sync files with public read access
aws s3 sync . s3://hfdx-dex \
  --exclude ".git/*" \
  --exclude "*.sh" \
  --exclude "README.md" \
  --exclude "node_modules/*" \
  --grants read=uri=http://acs.amazonaws.com/groups/global/AllUsers
```

### CloudFront Setup

1. Create a CloudFront distribution pointing to your S3 bucket
2. Configure the custom domain: `app.hfdx.xyz`
3. Add SSL certificate from ACM
4. Configure error pages to redirect to `index.html` for SPA routing

### DNS Configuration

Add a CNAME record:
```
app.hfdx.xyz -> [your-cloudfront-distribution].cloudfront.net
```

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

3. **Favicon**: Replace `favicon.ico` with your icon

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

