import { createPublicClient, createWalletClient, http, custom } from 'viem';

// ── Deployment ───────────────────────────────────────────────────────────────
// Update CONTRACT_ADDRESS after deploying PredictionScroller to Monad testnet:
//   npx hardhat ignition deploy ignition/modules/PredictionScroller.ts --network monadTestnet
export const CONTRACT_ADDRESS = '0xD2396eE4007a63a5b889e0c5b752582fc3837fbc' as const;

export const EXPLORER_URL = 'https://testnet.monadexplorer.com';

// ── Chain definition ─────────────────────────────────────────────────────────
export const MONAD_CHAIN = {
  id: 10143,
  name: 'Monad Testnet',
  network: 'monad-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Monad',
    symbol: 'MON',
  },
  rpcUrls: {
    default: { http: ['https://testnet-rpc.monad.xyz'] },
    public: { http: ['https://testnet-rpc.monad.xyz'] },
  },
  blockExplorers: {
    default: { name: 'Monad Explorer', url: EXPLORER_URL },
  },
  testnet: true,
} as const;

// ── PredictionScroller ABI ───────────────────────────────────────────────────
export const ABI = [
  {
    inputs: [
      { internalType: 'string', name: '_conditionId', type: 'string' },
      { internalType: 'bool', name: '_prediction', type: 'bool' },
    ],
    name: 'placeBet',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'string', name: '_conditionId', type: 'string' }],
    name: 'getMarketStats',
    outputs: [
      { internalType: 'uint256', name: 'yes', type: 'uint256' },
      { internalType: 'uint256', name: 'no', type: 'uint256' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'string', name: '_conditionId', type: 'string' }],
    name: 'getMarketBetCount',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '_user', type: 'address' }],
    name: 'getUserMarkets',
    outputs: [{ internalType: 'string[]', name: '', type: 'string[]' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'string', name: '_conditionId', type: 'string' },
      { internalType: 'address', name: '_user', type: 'address' },
    ],
    name: 'getUserBetsOnMarket',
    outputs: [
      { internalType: 'uint256', name: 'totalYesBet', type: 'uint256' },
      { internalType: 'uint256', name: 'totalNoBet', type: 'uint256' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'string', name: 'conditionId', type: 'string' },
      { indexed: true, internalType: 'address', name: 'user', type: 'address' },
      { indexed: false, internalType: 'bool', name: 'prediction', type: 'bool' },
      { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'timestamp', type: 'uint256' },
    ],
    name: 'BetPlaced',
    type: 'event',
  },
] as const;

// ── Viem clients ─────────────────────────────────────────────────────────────
export function getPublicClient() {
  return createPublicClient({
    chain: MONAD_CHAIN as any,
    transport: http('https://testnet-rpc.monad.xyz'),
  });
}

export function getWalletClient() {
  if (typeof window === 'undefined' || !window.ethereum) {
    throw new Error('No wallet found');
  }
  return createWalletClient({
    chain: MONAD_CHAIN as any,
    transport: custom(window.ethereum!),
  });
}
