import { useAccount, useWriteContract, useReadContract } from 'wagmi';
import { parseEther, keccak256, encodePacked } from 'viem';

// Deployed contract addresses
const COMMIT_REVEAL_ADDRESS = "0x17fd7327b38f378c0e76436a8ddf97e220703512" as const;
const JOB_GUESSING_GAME_ADDRESS = "0x8410feb4a1dbfb58a2bb1c72c150c09352695aee" as const;
const FACTORY_ADDRESS = "0x227c1031ac10ab7342b6b9f54d3b2d9fbfcd9fac" as const;

// CommitReveal ABI
const COMMIT_REVEAL_ABI = [
  {
    "inputs": [{"internalType": "bytes32", "name": "_jobHash", "type": "bytes32"}],
    "name": "commitJob",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "string", "name": "_job", "type": "string"}],
    "name": "revealJob",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "_player", "type": "address"}],
    "name": "hasCommitted",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "_player", "type": "address"}],
    "name": "hasRevealed",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "_player", "type": "address"}, {"internalType": "string", "name": "_job", "type": "string"}],
    "name": "verifyReveal",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

// JobGuessingGame ABI
const JOB_GUESSING_GAME_ABI = [
  {
    "inputs": [],
    "name": "startGame",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "bool", "name": "_aiGuessedCorrectly", "type": "bool"}],
    "name": "submitGuessResult",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "string", "name": "_job", "type": "string"}],
    "name": "revealJob",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "claimWinnings",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "_player", "type": "address"}],
    "name": "getGameDetails",
    "outputs": [
      {
        "components": [
          {"internalType": "address", "name": "player", "type": "address"},
          {"internalType": "uint256", "name": "depositAmount", "type": "uint256"},
          {"internalType": "enum JobGuessingGame.GameStatus", "name": "status", "type": "uint8"},
          {"internalType": "uint256", "name": "startTime", "type": "uint256"},
          {"internalType": "bool", "name": "aiGuessedCorrectly", "type": "bool"},
          {"internalType": "bool", "name": "playerClaimed", "type": "bool"},
          {"internalType": "string", "name": "revealedJob", "type": "string"},
          {"internalType": "bool", "name": "jobRevealed", "type": "bool"}
        ],
        "internalType": "struct JobGuessingGame.Game",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

export interface GameDetails {
  player: string;
  depositAmount: bigint;
  status: number; // 0: NotStarted, 1: InProgress, 2: Completed, 3: Cancelled
  startTime: bigint;
  aiGuessedCorrectly: boolean;
  playerClaimed: boolean;
  revealedJob: string;
  jobRevealed: boolean;
}

export const useJobGuessingContract = () => {
  const { address } = useAccount();
  const { writeContract, isPending: isWritePending } = useWriteContract();

  // Read game details
  const { data: gameDetails, refetch: refetchGameDetails } = useReadContract({
    address: JOB_GUESSING_GAME_ADDRESS,
    abi: JOB_GUESSING_GAME_ABI,
    functionName: 'getGameDetails',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  // Read commit status
  const { data: hasCommitted, refetch: refetchCommitStatus } = useReadContract({
    address: COMMIT_REVEAL_ADDRESS,
    abi: COMMIT_REVEAL_ABI,
    functionName: 'hasCommitted',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  // Read reveal status
  const { data: hasRevealed, refetch: refetchRevealStatus } = useReadContract({
    address: COMMIT_REVEAL_ADDRESS,
    abi: COMMIT_REVEAL_ABI,
    functionName: 'hasRevealed',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  const commitJob = async (job: string) => {
    if (!address) throw new Error('No wallet address available. Please connect your wallet.');
    
    try {
      // Create hash: keccak256(job + address)
      const jobHash = keccak256(encodePacked(['string', 'address'], [job, address]));
      
      await writeContract({
        address: COMMIT_REVEAL_ADDRESS,
        abi: COMMIT_REVEAL_ABI,
        functionName: 'commitJob',
        args: [jobHash],
      });
      
      await refetchCommitStatus();
    } catch (error: any) {
      console.error('Error committing job:', error);
      
      // Provide more specific error messages
      if (error?.message?.includes('User rejected')) {
        throw new Error('Transaction was cancelled by user');
      } else if (error?.message?.includes('insufficient funds')) {
        throw new Error('Insufficient funds for transaction. Please check your wallet balance.');
      } else if (error?.message?.includes('network')) {
        throw new Error('Network error. Please check your connection and try again.');
      } else if (error?.message?.includes('gas')) {
        throw new Error('Gas estimation failed. Please try again.');
      } else {
        throw new Error(`Failed to commit job: ${error?.message || 'Unknown error'}`);
      }
    }
  };

  const startGame = async () => {
    if (!address) throw new Error('No wallet address available. Please connect your wallet.');
    
    try {
      await writeContract({
        address: JOB_GUESSING_GAME_ADDRESS,
        abi: JOB_GUESSING_GAME_ABI,
        functionName: 'startGame',
        value: parseEther('0.2'), // 0.2 MON tokens
      });
      
      await refetchGameDetails();
    } catch (error: any) {
      console.error('Error starting game:', error);
      
      // Provide more specific error messages
      if (error?.message?.includes('User rejected')) {
        throw new Error('Transaction was cancelled by user');
      } else if (error?.message?.includes('insufficient funds')) {
        throw new Error('Insufficient funds. You need at least 0.2 MON tokens plus gas fees.');
      } else if (error?.message?.includes('network')) {
        throw new Error('Network error. Please check your connection and try again.');
      } else if (error?.message?.includes('gas')) {
        throw new Error('Gas estimation failed. Please try again.');
      } else if (error?.message?.includes('execution reverted')) {
        throw new Error('Transaction failed. The contract may not be properly deployed or configured.');
      } else {
        throw new Error(`Failed to start game: ${error?.message || 'Unknown error'}`);
      }
    }
  };

  const submitGuessResult = async (aiGuessedCorrectly: boolean) => {
    try {
      await writeContract({
        address: JOB_GUESSING_GAME_ADDRESS,
        abi: JOB_GUESSING_GAME_ABI,
        functionName: 'submitGuessResult',
        args: [aiGuessedCorrectly],
      });
      
      await refetchGameDetails();
    } catch (error) {
      console.error('Error submitting guess result:', error);
      throw error;
    }
  };

  const revealJob = async (job: string) => {
    try {
      // First reveal in CommitReveal contract
      await writeContract({
        address: COMMIT_REVEAL_ADDRESS,
        abi: COMMIT_REVEAL_ABI,
        functionName: 'revealJob',
        args: [job],
      });
      
      // Then reveal in JobGuessingGame contract
      await writeContract({
        address: JOB_GUESSING_GAME_ADDRESS,
        abi: JOB_GUESSING_GAME_ABI,
        functionName: 'revealJob',
        args: [job],
      });
      
      await Promise.all([refetchRevealStatus(), refetchGameDetails()]);
    } catch (error) {
      console.error('Error revealing job:', error);
      throw error;
    }
  };

  const claimWinnings = async () => {
    try {
      await writeContract({
        address: JOB_GUESSING_GAME_ADDRESS,
        abi: JOB_GUESSING_GAME_ABI,
        functionName: 'claimWinnings',
      });
      
      await refetchGameDetails();
    } catch (error) {
      console.error('Error claiming winnings:', error);
      throw error;
    }
  };

  return {
    gameDetails: gameDetails as GameDetails | undefined,
    hasCommitted: hasCommitted as boolean | undefined,
    hasRevealed: hasRevealed as boolean | undefined,
    refetchGameDetails,
    refetchCommitStatus,
    refetchRevealStatus,
    commitJob,
    startGame,
    submitGuessResult,
    revealJob,
    claimWinnings,
    isPending: isWritePending,
    contractAddresses: {
      commitReveal: COMMIT_REVEAL_ADDRESS,
      gameContract: JOB_GUESSING_GAME_ADDRESS,
      factory: FACTORY_ADDRESS,
    },
  };
};
