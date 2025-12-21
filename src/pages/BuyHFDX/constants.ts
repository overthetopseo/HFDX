import { ARBITRUM, ARBITRUM_SEPOLIA, AVALANCHE, AVALANCHE_FUJI, BOTANIX, ContractsChainId } from "config/chains";
import { getContract } from "config/contracts";

const ARBITRUM_HFDX = getContract(ARBITRUM, "HFDX").toLowerCase();
const AVALANCHE_HFDX = getContract(AVALANCHE, "HFDX").toLowerCase();

type Exchange = {
  name: string;
  icon: string;
  links: { [key: number]: string };
};

export const EXTERNAL_LINKS: Record<
  ContractsChainId,
  {
    networkWebsite: string;
    buyHfdx: {
      uniswap?: string;
      gmx?: string;
      traderjoe?: string;
    };
  }
> = {
  [ARBITRUM]: {
    networkWebsite: "https://arbitrum.io/",
    buyHfdx: {
      uniswap: `https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=${ARBITRUM_HFDX}`,
      gmx: `https://app.gmx.io/#/trade/swap/?mode=market&from=usdc&to=gmx`,
    },
  },
  [AVALANCHE]: {
    networkWebsite: "https://www.avax.network/",
    buyHfdx: {
      traderjoe: `https://traderjoexyz.com/trade?outputCurrency=${AVALANCHE_HFDX}`,
    },
  },
  [AVALANCHE_FUJI]: {
    networkWebsite: "https://www.avax.network/",
    buyHfdx: {
      traderjoe: `https://traderjoexyz.com/trade?outputCurrency=${AVALANCHE_HFDX}`,
    },
  },
  [ARBITRUM_SEPOLIA]: {
    networkWebsite: "https://arbitrum.io/",
    buyHfdx: {},
  },
  [BOTANIX]: {
    networkWebsite: "https://botanixlabs.com/",
    buyHfdx: {
      uniswap: undefined,
    },
  },
};

export const FIAT_GATEWAYS: Exchange[] = [
  {
    name: "Banxa",
    icon: "ic_banxa.svg",
    links: {
      [ARBITRUM]: "https://gmx.banxa.com/?coinType=HFDX&fiatType=USD&fiatAmount=500&blockchain=arbitrum",
      [AVALANCHE]: "https://gmx.banxa.com/?coinType=HFDX&fiatType=USD&fiatAmount=500&blockchain=avalanche",
    },
  },
  {
    name: "Transak",
    icon: "ic_tansak.svg",
    links: {
      [ARBITRUM]:
        "https://global.transak.com/?apiKey=28a15a9b-d94e-4944-99cc-6aa35b45cc74&networks=arbitrum&defaultCryptoCurrency=HFDX&isAutoFillUserData=true&hideMenu=true&isFeeCalculationHidden=true",
    },
  },
];

export const HFDX_FROM_ANY_NETWORKS: Exchange[] = [
  {
    name: "Bungee",
    icon: "ic_bungee.png",
    links: {
      [ARBITRUM]: `https://multitx.bungee.exchange/?toChainId=42161&toTokenAddress=${ARBITRUM_HFDX}`,
      [AVALANCHE]: `https://multitx.bungee.exchange/?toChainId=43114&toTokenAddress=${AVALANCHE_HFDX}`,
    },
  },
];

export const BUY_NATIVE_TOKENS: Exchange[] = [
  {
    name: "Bungee",
    icon: "ic_bungee.png",
    links: {
      [ARBITRUM]: `https://multitx.bungee.exchange/?fromChainId=1&fromTokenAddress=0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee&toChainId=42161&toTokenAddress=0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee `,
      [AVALANCHE]: `https://multitx.bungee.exchange/?fromChainId=1&fromTokenAddress=0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee&toChainId=43114&toTokenAddress=0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee`,
    },
  },
  {
    name: "Banxa",
    icon: "ic_banxa.svg",
    links: {
      [ARBITRUM]: "https://gmx.banxa.com/?coinType=ETH&fiatType=USD&fiatAmount=500&blockchain=arbitrum",
      [AVALANCHE]: "https://gmx.banxa.com/?coinType=AVAX&fiatType=USD&fiatAmount=500&blockchain=avalanche",
    },
  },
  {
    name: "Transak",
    icon: "ic_tansak.svg",
    links: {
      [ARBITRUM]:
        "https://global.transak.com/?apiKey=28a15a9b-d94e-4944-99cc-6aa35b45cc74&networks=arbitrum&isAutoFillUserData=true&hideMenu=true&isFeeCalculationHidden=true",
      [AVALANCHE]:
        "https://global.transak.com/?apiKey=28a15a9b-d94e-4944-99cc-6aa35b45cc74&networks=avaxcchain&defaultCryptoCurrency=AVAX&isAutoFillUserData=true&hideMenu=true&isFeeCalculationHidden=true",
    },
  },
];

export const TRANSFER_EXCHANGES: Exchange[] = [
  {
    name: "Binance",
    icon: "ic_binance.svg",
    links: {
      [ARBITRUM]: "https://www.binance.com/en/trade/",
      [AVALANCHE]: "https://www.binance.com/en/trade/",
    },
  },
  {
    name: "Synapse",
    icon: "ic_synapse.svg",
    links: {
      [ARBITRUM]: "https://synapseprotocol.com/?inputCurrency=ETH&outputCurrency=ETH&outputChain=42161",
      [AVALANCHE]: "https://synapseprotocol.com/",
    },
  },
  {
    name: "Arbitrum",
    icon: "ic_arbitrum.svg",
    links: {
      [ARBITRUM]: "https://bridge.arbitrum.io/",
      [ARBITRUM_SEPOLIA]:
        "https://bridge.arbitrum.io/?amount=0.1&sourceChain=sepolia&destinationChain=arbitrum-sepolia&tab=bridge",
    },
  },
  {
    name: "Avalanche",
    icon: "ic_avax_30.svg",
    links: {
      [AVALANCHE]: "https://bridge.avax.network/",
    },
  },
  {
    name: "Hop",
    icon: "ic_hop.svg",
    links: { [ARBITRUM]: "https://app.hop.exchange/send?token=ETH&sourceNetwork=ethereum&destNetwork=arbitrum" },
  },
  {
    name: "Bungee",
    icon: "ic_bungee.png",
    links: {
      [ARBITRUM]:
        "https://multitx.bungee.exchange/?fromChainId=1&fromTokenAddress=0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee&toChainId=42161&toTokenAddress=0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
      [AVALANCHE]:
        "https://multitx.bungee.exchange/?fromChainId=1&fromTokenAddress=0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee&toChainId=43114&toTokenAddress=0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
    },
  },
  {
    name: "Across",
    icon: "ic_across.svg",
    links: { [ARBITRUM]: "https://across.to/bridge?from=1&to=42161&asset=ETH" },
  },
];

export const CENTRALISED_EXCHANGES: Exchange[] = [
  {
    name: "Binance",
    icon: "ic_binance.svg",
    links: {
      [ARBITRUM]: "https://www.binance.com/en/trade/HFDX_USDT",
      [AVALANCHE]: "https://www.binance.com/en/trade/HFDX_USDT",
    },
  },
  {
    name: "Bybit",
    icon: "ic_bybit.svg",
    links: {
      [ARBITRUM]: "https://www.bybit.com/en-US/trade/spot/HFDX/USDT",
      [AVALANCHE]: "https://www.bybit.com/en-US/trade/spot/HFDX/USDT",
    },
  },
  {
    name: "Kucoin",
    icon: "ic_kucoin.svg",
    links: {
      [ARBITRUM]: "https://www.kucoin.com/trade/HFDX-USDT",
      [AVALANCHE]: "https://www.kucoin.com/trade/HFDX-USDT",
    },
  },
  {
    name: "Huobi",
    icon: "ic_huobi.svg",
    links: {
      [ARBITRUM]: "https://www.huobi.com/en-us/exchange/gmx_usdt/",
      [AVALANCHE]: "https://www.huobi.com/en-us/exchange/gmx_usdt/",
    },
  },
];

export const DECENTRALISED_AGGRIGATORS: Exchange[] = [
  {
    name: "1inch",
    icon: "ic_1inch.svg",
    links: {
      [ARBITRUM]: "https://app.1inch.io/#/42161/unified/swap/ETH/HFDX",
      [AVALANCHE]: "https://app.1inch.io/#/43114/unified/swap/AVAX/HFDX",
    },
  },
  {
    name: "Matcha",
    icon: "ic_matcha.svg",
    links: {
      [ARBITRUM]: `https://www.matcha.xyz/markets/42161/${ARBITRUM_HFDX}`,
      [AVALANCHE]: `https://www.matcha.xyz/markets/43114/${AVALANCHE_HFDX}`,
    },
  },
  {
    name: "Paraswap",
    icon: "ic_paraswap.svg",
    links: {
      [ARBITRUM]: `https://app.paraswap.io/#/${ARBITRUM_HFDX}?network=arbitrum`,
      [AVALANCHE]: `https://app.paraswap.io/#/${AVALANCHE_HFDX}?network=avalanche`,
    },
  },
  {
    name: "KyberSwap",
    icon: "ic_kyberswap.svg",
    links: {
      [ARBITRUM]: "https://kyberswap.com/swap/arbitrum/eth-to-gmx",
      [AVALANCHE]: "https://kyberswap.com/swap/avalanche/avax-to-gmx",
    },
  },
  {
    name: "OpenOcean",
    icon: "ic_openocean.svg",
    links: {
      [ARBITRUM]: "https://app.openocean.finance/CLASSIC#/ARBITRUM/ETH/HFDX",
      [AVALANCHE]: "https://app.openocean.finance/CLASSIC#/AVAX/AVAX/HFDX",
    },
  },
  {
    name: "DODO",
    icon: "ic_dodo.svg",
    links: {
      [ARBITRUM]: `https://app.dodoex.io/?from=ETH&to=${ARBITRUM_HFDX}&network=arbitrum`,
      [AVALANCHE]: `https://app.dodoex.io/?from=AVAX&to=${AVALANCHE_HFDX}&network=avalanche`,
    },
  },
  {
    name: "Slingshot",
    icon: "ic_slingshot.svg",
    links: { [ARBITRUM]: "https://app.slingshot.finance/swap/ETH?network=arbitrum" },
  },
  {
    name: "Yieldyak",
    icon: "ic_yield_yak.png",
    links: {
      [AVALANCHE]: `https://yieldyak.com/swap?outputCurrency=${AVALANCHE_HFDX}`,
    },
  },
  {
    name: "Firebird",
    icon: "ic_firebird.png",
    links: {
      [ARBITRUM]: "https://app.firebird.finance/swap",
      [AVALANCHE]: "https://app.firebird.finance/swap",
    },
  },
  {
    name: "Odos",
    icon: "ic_odos.png",
    links: {
      [ARBITRUM]: "https://app.odos.xyz/swap/42161/ETH/HFDX",
      [AVALANCHE]: "https://app.odos.xyz/swap/43114/AVAX/HFDX",
    },
  },
];
