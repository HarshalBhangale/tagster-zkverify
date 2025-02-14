import { http, createConfig } from 'wagmi';
import { openCampusCodex } from './chains';

// Create wagmi config without connectors (Privy will handle this)
const wagmiConfig = createConfig({
  chains: [openCampusCodex],
  transports: {
    [openCampusCodex.id]: http(openCampusCodex.rpcUrls.default.http[0])
  },
});

export { wagmiConfig };
export default wagmiConfig; 