import React from 'react';
import { useAccount, useChainId } from 'wagmi';
import { Card } from '../ui';

const NetworkDebug: React.FC = () => {
    const { address, isConnected, connector } = useAccount();
    const chainId = useChainId();

    const getChainName = (chainId: number) => {
        switch (chainId) {
            case 1: return 'Ethereum Mainnet';
            case 11155111: return 'Sepolia Testnet';
            case 10143: return 'Monad Testnet';
            case 137: return 'Polygon';
            case 42161: return 'Arbitrum';
            case 10: return 'Optimism';
            case 8453: return 'Base';
            default: return `Unknown Chain (${chainId})`;
        }
    };

    if (!isConnected) {
        return (
            <Card className="w-full max-w-2xl mx-auto p-4 bg-yellow-50 border-yellow-200">
                <div className="text-yellow-800 text-sm">
                    <div className="font-semibold">Debug Info:</div>
                    <div>Wallet not connected</div>
                </div>
            </Card>
        );
    }

    return (
        <Card className="w-full max-w-2xl mx-auto p-4 bg-blue-50 border-blue-200">
            <div className="text-blue-800 text-sm">
                <div className="font-semibold mb-2">Debug Info:</div>
                <div>Wallet: {connector?.name || 'Unknown'}</div>
                <div>Address: {address}</div>
                <div>Chain: {getChainName(chainId)} (ID: {chainId})</div>
                <div className="mt-2 text-xs text-blue-600">
                    Note: For testing, try switching to Sepolia testnet if Monad testnet is not working.
                </div>
            </div>
        </Card>
    );
};

export default NetworkDebug;
