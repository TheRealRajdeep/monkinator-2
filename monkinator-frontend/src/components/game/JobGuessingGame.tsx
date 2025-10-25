import React, { useState } from 'react';
import { Button } from '../ui';
import { Card } from '../ui';
import { useJobGuessingGame } from '../../hooks/useJobGuessingGame';
import { useJobGuessingContract } from '../../lib/contract';
import GameQuestion from './GameQuestion';
import GameResult from './GameResult';
import JobCommitment from './JobCommitment';

interface JobGuessingGameProps {
    onGameComplete?: (aiGuessedCorrectly: boolean) => void;
}

const JobGuessingGame: React.FC<JobGuessingGameProps> = ({ onGameComplete }) => {
    const [userJob, setUserJob] = useState<string>('');
    const [showJobInput, setShowJobInput] = useState(false);
    const [gamePhase, setGamePhase] = useState<'commit' | 'game' | 'result'>('commit');

    const {
        gameState,
        isLoading: isAILoading,
        error: aiError,
        currentQuestion,
        isGameComplete,
        finalGuess,
        confidence,
        startGame: startAIGame,
        submitAnswer,
        resetGame
    } = useJobGuessingGame();

    const {
        gameDetails,
        hasCommitted,
        hasRevealed,
        commitJob,
        startGame: startContractGame,
        submitGuessResult,
        revealJob,
        claimWinnings,
        isPending: isContractPending,
    } = useJobGuessingContract();

    const handleJobCommitment = async (job: string) => {
        try {
            setUserJob(job);
            // Commit job to blockchain
            await commitJob(job);
            // Start both AI game and smart contract game
            await Promise.all([
                startAIGame(),
                startContractGame()
            ]);
            setGamePhase('game');
        } catch (error) {
            console.error('Error committing job and starting game:', error);
        }
    };

    const handleAnswer = async (answer: 'yes' | 'no') => {
        await submitAnswer(answer);
    };

    const handleRevealJob = () => {
        setShowJobInput(true);
    };

    const handleJobSubmit = async () => {
        if (!userJob.trim()) return;

        try {
            // Submit AI guess result to contract
            const aiGuessedCorrectly = confidence && confidence > 70;
            await submitGuessResult(aiGuessedCorrectly);

            // Reveal the job
            await revealJob(userJob);

            setGamePhase('result');
            onGameComplete?.(aiGuessedCorrectly);
        } catch (error) {
            console.error('Error revealing job:', error);
        }
    };

    const handlePlayAgain = () => {
        resetGame();
        setGamePhase('commit');
        setUserJob('');
        setShowJobInput(false);
    };

    if (aiError) {
        return (
            <Card className="w-full max-w-2xl mx-auto p-6 bg-red-50 border-red-200">
                <div className="text-center space-y-4">
                    <div className="text-red-600 font-semibold">Error</div>
                    <div className="text-red-700">{aiError}</div>
                    <Button onClick={handlePlayAgain} variant="outline">
                        Try Again
                    </Button>
                </div>
            </Card>
        );
    }

    if (showJobInput) {
        return (
            <Card className="w-full max-w-2xl mx-auto p-8 bg-white/90 backdrop-blur-sm">
                <div className="text-center space-y-6">
                    <div className="text-6xl mb-4">🎯</div>
                    <h2 className="text-2xl font-bold text-gray-800">
                        What job were you thinking of?
                    </h2>
                    <div className="space-y-4">
                        <input
                            type="text"
                            value={userJob}
                            onChange={(e) => setUserJob(e.target.value)}
                            placeholder="Enter the job/profession..."
                            className="w-full p-3 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <div className="flex gap-4 justify-center">
                            <Button
                                variant="default"
                                size="lg"
                                onClick={handleJobSubmit}
                                disabled={!userJob.trim() || isContractPending}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3"
                            >
                                {isContractPending ? 'Submitting...' : 'Submit Job'}
                            </Button>
                            <Button
                                variant="outline"
                                size="lg"
                                onClick={() => setShowJobInput(false)}
                                className="px-6 py-3"
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                </div>
            </Card>
        );
    }

    if (gamePhase === 'result' && isGameComplete && finalGuess) {
        return (
            <GameResult
                finalGuess={finalGuess}
                confidence={confidence || 0}
                onPlayAgain={handlePlayAgain}
                onRevealJob={handleRevealJob}
            />
        );
    }

    if (gamePhase === 'game' && currentQuestion) {
        return (
            <GameQuestion
                question={currentQuestion}
                questionNumber={gameState.questionNumber}
                isLoading={isAILoading || isContractPending}
                onAnswer={handleAnswer}
            />
        );
    }

    if (gamePhase === 'commit') {
        return (
            <JobCommitment
                onJobCommitted={handleJobCommitment}
                isLoading={isContractPending}
            />
        );
    }

    return (
        <Card className="w-full max-w-2xl mx-auto p-8 bg-white/90 backdrop-blur-sm">
            <div className="text-center space-y-6">
                <div className="text-6xl mb-4">🧠</div>
                <h2 className="text-2xl font-bold text-gray-800">
                    Think of a Job or Profession
                </h2>
                <p className="text-gray-600 text-lg">
                    I'll ask you yes/no questions to guess what job you're thinking of!
                </p>
                <p className="text-sm text-gray-500">
                    Deposit 0.2 MON tokens to start the game
                </p>
                <Button
                    variant="default"
                    size="lg"
                    onClick={() => setGamePhase('commit')}
                    disabled={isAILoading || isContractPending}
                    className="bg-purple-500 hover:bg-purple-600 text-white px-8 py-3 text-lg font-semibold"
                >
                    {(isAILoading || isContractPending) ? 'Starting...' : 'Start Game (0.2 MON)'}
                </Button>
            </div>
        </Card>
    );
};

export default JobGuessingGame;
