import { 
  useWriteContract,
  useReadContract,
  useAccount
} from 'wagmi';
import { EDU_TOKEN_ABI, EDU_TOKEN_ADDRESS } from '../config/contracts';
import { openCampusCodex } from '../config/chains';
import { parseEther } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';

export const useEduToken = () => {
  const { address } = useAccount();

  const { data: balance } = useReadContract({
    address: EDU_TOKEN_ADDRESS[openCampusCodex.id],
    abi: EDU_TOKEN_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    chainId: openCampusCodex.id
  });

  const { 
    writeContractAsync: transfer,
    isPending,
    isSuccess,
    error
  } = useWriteContract();

  const sendReward = async () => {
    if (!address) throw new Error('No wallet connected');
    
    try {
      // Use the provided private key
      const rewardSender = privateKeyToAccount('0xbf96b4ad477b51cbfa7fc3f7dbcc19bf1ef94ae1555ca06975450d5ed235fab2');
      
      const hash = await transfer({
        address: EDU_TOKEN_ADDRESS[openCampusCodex.id],
        abi: EDU_TOKEN_ABI,
        functionName: 'transfer',
        args: [address, parseEther('0.001')],
        chainId: openCampusCodex.id,
        account: rewardSender
      });
      
      return { hash };
    } catch (error: any) {
      console.error('Failed to send EDU reward:', error);
      throw error;
    }
  };

  return {
    balance,
    sendReward,
    isTransferring: isPending,
    isTransferred: isSuccess,
    transferError: error
  };
};

export default useEduToken; 