import React from 'react';
import { Card } from '../ui';

interface GameStatusProps {
    gameDetails?: {
        player: string;
        depositAmount: bigint;
        status: number;
        startTime: bigint;
        aiGuessedCorrectly: boolean;
        playerClaimed: boolean;
        revealedJob: string;
        jobRevealed: boolean;
    };
    hasCommitted?: boolean;
    hasRevealed?: boolean;
}

const GameStatus: React.FC<GameStatusProps> = ({
    gameDetails,
    hasCommitted,
    hasRevealed
}) => {
    const getStatusText = (status: number) => {
        switch (status) {
            case 0: return 'Not Started';
            case 1: return 'In Progress';
            case 2: return 'Completed';
            case 3: return 'Cancelled';
            default: return 'Unknown';
        }
    };

    const getStatusColor = (status: number) => {
        switch (status) {
            case 0: return 'text-gray-600';
            case 1: return 'text-blue-600';
            case 2: return 'text-green-600';
            case 3: return 'text-red-600';
            default: return 'text-gray-600';
        }
    };

    if (!gameDetails) {
        return (
            <Card className="w-full max-w-2xl mx-auto p-4 bg-gray-50">
                <div className="text-center text-gray-500">
                    No active game
                </div>
            </Card>
        );
    }

    return (
        <Card className="w-full max-w-2xl mx-auto p-4 bg-gray-50">
            <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                    <span className="font-semibold">Game Status:</span>
                    <span className={`ml-2 ${getStatusColor(gameDetails.status)}`}>
                        {getStatusText(gameDetails.status)}
                    </span>
                </div>

                <div>
                    <span className="font-semibold">Deposit:</span>
                    <span className="ml-2">
                        {Number(gameDetails.depositAmount) / 1e18} MON
                    </span>
                </div>

                <div>
                    <span className="font-semibold">Job Committed:</span>
                    <span className={`ml-2 ${hasCommitted ? 'text-green-600' : 'text-red-600'}`}>
                        {hasCommitted ? 'Yes' : 'No'}
                    </span>
                </div>

                <div>
                    <span className="font-semibold">Job Revealed:</span>
                    <span className={`ml-2 ${hasRevealed ? 'text-green-600' : 'text-red-600'}`}>
                        {hasRevealed ? 'Yes' : 'No'}
                    </span>
                </div>

                {gameDetails.status === 2 && (
                    <>
                        <div>
                            <span className="font-semibold">AI Guessed Correctly:</span>
                            <span className={`ml-2 ${gameDetails.aiGuessedCorrectly ? 'text-green-600' : 'text-red-600'}`}>
                                {gameDetails.aiGuessedCorrectly ? 'Yes' : 'No'}
                            </span>
                        </div>

                        <div>
                            <span className="font-semibold">Winnings Claimed:</span>
                            <span className={`ml-2 ${gameDetails.playerClaimed ? 'text-green-600' : 'text-yellow-600'}`}>
                                {gameDetails.playerClaimed ? 'Yes' : 'No'}
                            </span>
                        </div>
                    </>
                )}

                {gameDetails.revealedJob && (
                    <div className="col-span-2">
                        <span className="font-semibold">Revealed Job:</span>
                        <span className="ml-2 text-blue-600">
                            {gameDetails.revealedJob}
                        </span>
                    </div>
                )}
            </div>
        </Card>
    );
};

export default GameStatus;
