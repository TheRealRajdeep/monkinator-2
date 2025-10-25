import React from 'react';
import { Button } from '../ui';
import { Card } from '../ui';

interface GameQuestionProps {
    question: string;
    questionNumber: number;
    isLoading: boolean;
    onAnswer: (answer: 'yes' | 'no') => void;
}

const GameQuestion: React.FC<GameQuestionProps> = ({
    question,
    questionNumber,
    isLoading,
    onAnswer
}) => {
    return (
        <Card className="w-full max-w-2xl mx-auto p-6 bg-white/90 backdrop-blur-sm">
            <div className="text-center space-y-6">
                {/* Question Counter */}
                <div className="text-sm text-gray-600 font-medium">
                    Question {questionNumber}
                </div>

                {/* AI Question */}
                <div className="text-xl font-semibold text-gray-800 leading-relaxed">
                    {question}
                </div>

                {/* Answer Buttons */}
                <div className="flex gap-4 justify-center">
                    <Button
                        variant="default"
                        size="lg"
                        onClick={() => onAnswer('yes')}
                        disabled={isLoading}
                        className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 text-lg font-semibold"
                    >
                        Yes
                    </Button>
                    <Button
                        variant="default"
                        size="lg"
                        onClick={() => onAnswer('no')}
                        disabled={isLoading}
                        className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 text-lg font-semibold"
                    >
                        No
                    </Button>
                </div>

                {/* Loading Indicator */}
                {isLoading && (
                    <div className="text-gray-500 text-sm">
                        AI is thinking...
                    </div>
                )}
            </div>
        </Card>
    );
};

export default GameQuestion;
