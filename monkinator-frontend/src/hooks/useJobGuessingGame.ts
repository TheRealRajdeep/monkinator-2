import { useState } from 'react';
import JobGuessingAI, { type GameState } from '../lib/openai';

export interface UseJobGuessingGameReturn {
  gameState: GameState;
  isLoading: boolean;
  error: string | null;
  currentQuestion: string | null;
  isGameComplete: boolean;
  finalGuess: string | null;
  confidence: number | null;
  startGame: () => Promise<void>;
  submitAnswer: (answer: 'yes' | 'no') => Promise<void>;
  resetGame: () => void;
}

export const useJobGuessingGame = (): UseJobGuessingGameReturn => {
  const [ai] = useState(() => new JobGuessingAI());
  const [gameState, setGameState] = useState<GameState>(ai.getGameState());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startGame = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      ai.resetGame();
      const response = await ai.generateQuestion();
      setGameState(ai.getGameState());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start game');
    } finally {
      setIsLoading(false);
    }
  };

  const submitAnswer = async (answer: 'yes' | 'no') => {
    setIsLoading(true);
    setError(null);
    
    try {
      ai.submitAnswer(answer);
      const response = await ai.generateQuestion();
      setGameState(ai.getGameState());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit answer');
    } finally {
      setIsLoading(false);
    }
  };

  const resetGame = () => {
    ai.resetGame();
    setGameState(ai.getGameState());
    setError(null);
  };

  return {
    gameState,
    isLoading,
    error,
    currentQuestion: gameState.currentQuestion || null,
    isGameComplete: gameState.isGameComplete,
    finalGuess: gameState.finalGuess || null,
    confidence: gameState.confidence || null,
    startGame,
    submitAnswer,
    resetGame
  };
};
