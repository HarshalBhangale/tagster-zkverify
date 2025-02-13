import { http, createConfig } from 'wagmi';
import { openCampusCodex } from './chains';
import { walletConnect, injected } from 'wagmi/connectors';

const wagmiConfig = createConfig({
  chains: [openCampusCodex],
  connectors: [
    injected(),
    walletConnect({ projectId: 'YOUR_PROJECT_ID' }),
  ],
  transports: {
    [openCampusCodex.id]: http(),
  },
});

export { wagmiConfig };
export default wagmiConfig; 