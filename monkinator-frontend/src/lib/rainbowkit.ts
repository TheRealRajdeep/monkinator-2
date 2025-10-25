import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import type { Chain } from '@rainbow-me/rainbowkit';
import { mainnet, polygon, arbitrum, optimism, base, sepolia } from 'wagmi/chains';
import { customTheme } from './rainbowkit-theme';

const monadTestnet = {
  id: 10143,
  name: 'Monad Testnet',
  iconUrl: 'https://assets.coingecko.com/coins/images/38900/standard/monad.png',
  iconBackground: '#000',
  nativeCurrency: {
    name: 'Monad',
    symbol: 'MON',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://testnet-rpc.monad.xyz'],
    },
    public: {
      http: ['https://testnet-rpc.monad.xyz'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Monad Explorer',
      url: 'https://testnet.monadexplorer.com/',
    },
  },
  contracts: {
    multicall3: {
      address: '0xca11bde05977b3631167028862be2a173976ca11',
      blockCreated: 1,
    },
  },
} as const satisfies Chain;

export const config = getDefaultConfig({
  appName: 'Monkinator',
  projectId: "30bede5f518fc2c9a9900ada7ef88888", // Updated project ID
  chains: [sepolia, monadTestnet, mainnet, polygon, arbitrum, optimism, base], // Put Sepolia first for testing
  ssr: false, // Disable SSR to prevent hydration issues
});

export { customTheme };