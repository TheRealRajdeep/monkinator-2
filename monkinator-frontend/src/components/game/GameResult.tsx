import React from 'react';
import { Button } from '../ui';
import { Card } from '../ui';

interface GameResultProps {
    finalGuess: string;
    confidence: number;
    onPlayAgain: () => void;
    onRevealJob: () => void;
}

const GameResult: React.FC<GameResultProps> = ({
    finalGuess,
    confidence,
    onPlayAgain,
    onRevealJob
}) => {
    const getConfidenceColor = (conf: number) => {
        if (conf >= 80) return 'text-green-600';
        if (conf >= 60) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getConfidenceText = (conf: number) => {
        if (conf >= 80) return 'Very Confident';
        if (conf >= 60) return 'Confident';
        if (conf >= 40) return 'Somewhat Confident';
        return 'Not Very Confident';
    };

    return (
        <Card className="w-full max-w-2xl mx-auto p-8 bg-white/90 backdrop-blur-sm">
            <div className="text-center space-y-6">
                {/* AI Character */}
                <div className="text-6xl mb-4">🤖</div>

                {/* AI Guess */}
                <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-gray-800">
                        I think your job is:
                    </h2>
                    <div className="text-3xl font-bold text-blue-600 bg-blue-50 p-4 rounded-lg">
                        {finalGuess}
                    </div>
                </div>

                {/* Confidence */}
                <div className="space-y-2">
                    <div className={`text-lg font-semibold ${getConfidenceColor(confidence)}`}>
                        {getConfidenceText(confidence)} ({confidence}%)
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                            className={`h-3 rounded-full ${confidence >= 80 ? 'bg-green-500' :
                                    confidence >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                            style={{ width: `${confidence}%` }}
                        ></div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 justify-center pt-4">
                    <Button
                        variant="default"
                        size="lg"
                        onClick={onRevealJob}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3"
                    >
                        Reveal My Job
                    </Button>
                    <Button
                        variant="outline"
                        size="lg"
                        onClick={onPlayAgain}
                        className="px-6 py-3"
                    >
                        Play Again
                    </Button>
                </div>
            </div>
        </Card>
    );
};

export default GameResult;
