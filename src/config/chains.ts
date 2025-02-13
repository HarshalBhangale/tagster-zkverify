import { defineChain } from 'viem';

export const openCampusCodex = defineChain({
  id: 656476,
  name: 'Open Campus Codex',
  nativeCurrency: {
    decimals: 18,
    name: 'EDU',
    symbol: 'EDU',
  },
  rpcUrls: {
    default: {
      http: ['https://open-campus-codex-sepolia.drpc.org'],
    },
    public: {
      http: ['https://open-campus-codex-sepolia.drpc.org'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Open Campus Codex Explorer',
      url: 'https://opencampus-codex.blockscout.com',
    },
  },
  testnet: true
}); 