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
      http: ['https://rpc.open-campus-codex.gelato.digital'],
    },
    public: {
      http: ['https://rpc.open-campus-codex.gelato.digital'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Codex Block Explorer',
      url: 'https://educhain.blockscout.com',
    },
  },
  testnet: true
}); 