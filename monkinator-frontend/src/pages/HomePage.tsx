import React, { useState } from 'react';
import { HeroSection, JobGuessingGame, GameStatus } from '../components';
import { useJobGuessingContract } from '../lib/contract';

const HomePage: React.FC = () => {
    const [showGame, setShowGame] = useState(false);

    const { gameDetails, hasCommitted, hasRevealed } = useJobGuessingContract();

    const handleStartAdventure = () => {
        setShowGame(true);
    };

    const handleGameComplete = (aiGuessedCorrectly: boolean) => {
        // Here you would integrate with the smart contract
        console.log('AI guessed correctly:', aiGuessedCorrectly);
    };

    const handleBackToHome = () => {
        setShowGame(false);
    };

    if (showGame) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 flex flex-col items-center justify-center p-8">
                <div className="w-full max-w-4xl space-y-6">
                    {/* Game Status */}
                    <GameStatus
                        gameDetails={gameDetails}
                        hasCommitted={hasCommitted}
                        hasRevealed={hasRevealed}
                    />

                    {/* Main Game */}
                    <JobGuessingGame onGameComplete={handleGameComplete} />

                    {/* Back to Home Button */}
                    <div className="text-center">
                        <button
                            onClick={handleBackToHome}
                            className="text-gray-600 hover:text-gray-800 underline"
                        >
                            ← Back to Home
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <HeroSection onStartAdventure={handleStartAdventure} />
    );
};

export default HomePage;