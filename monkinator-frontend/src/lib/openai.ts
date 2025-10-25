import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Only for frontend demo - use backend in production
});

export interface GameState {
  questionNumber: number;
  previousQuestions: Array<{
    question: string;
    answer: 'yes' | 'no';
  }>;
  currentQuestion?: string;
  isGameComplete: boolean;
  finalGuess?: string;
  confidence?: number;
}

export interface JobGuessingResponse {
  question?: string;
  finalGuess?: string;
  confidence?: number;
  isComplete: boolean;
  reasoning?: string;
}

export class JobGuessingAI {
  private gameState: GameState;

  constructor() {
    this.gameState = {
      questionNumber: 0,
      previousQuestions: [],
      isGameComplete: false
    };
  }

  async generateQuestion(): Promise<JobGuessingResponse> {
    if (this.gameState.isGameComplete) {
      return {
        isComplete: true,
        finalGuess: this.gameState.finalGuess,
        confidence: this.gameState.confidence
      };
    }

    try {
      const prompt = this.buildPrompt();
      
      const completion = await openai.chat.completions.create({
        model: "gpt-5-mini",
        messages: [
          {
            role: "system",
            content: `You are an AI job guessing game similar to Akinator. Your goal is to guess what job/profession the player is thinking of by asking yes/no questions.

Rules:
1. Ask only ONE yes/no question per turn
2. Questions should be specific and help narrow down the profession
3. Be creative and think like Akinator - ask about work environment, tools, skills, etc.
4. After 8-12 questions, make your final guess
5. Respond in JSON format with: {"question": "your question", "isComplete": false} or {"finalGuess": "job title", "confidence": 0-100, "isComplete": true, "reasoning": "why you guessed this"}

Current game state: ${JSON.stringify(this.gameState)}`
          },
          {
            role: "user",
            content: prompt
          }
        ],
      });

      const response = completion.choices[0]?.message?.content;
      if (!response) {
        throw new Error('No response from OpenAI');
      }

      // Parse JSON response
      const parsedResponse: JobGuessingResponse = JSON.parse(response);
      
      if (parsedResponse.isComplete) {
        this.gameState.isGameComplete = true;
        this.gameState.finalGuess = parsedResponse.finalGuess;
        this.gameState.confidence = parsedResponse.confidence;
      } else if (parsedResponse.question) {
        this.gameState.currentQuestion = parsedResponse.question;
        this.gameState.questionNumber++;
      }

      return parsedResponse;
    } catch (error) {
      console.error('Error generating question:', error);
      throw new Error('Failed to generate AI question');
    }
  }

  submitAnswer(answer: 'yes' | 'no'): void {
    if (!this.gameState.currentQuestion) {
      throw new Error('No current question to answer');
    }

    this.gameState.previousQuestions.push({
      question: this.gameState.currentQuestion,
      answer
    });

    this.gameState.currentQuestion = undefined;
  }

  private buildPrompt(): string {
    const previousQAs = this.gameState.previousQuestions
      .map(qa => `Q: ${qa.question}\nA: ${qa.answer}`)
      .join('\n\n');

    return `Previous questions and answers:
${previousQAs}

Current question number: ${this.gameState.questionNumber + 1}

Based on the previous answers, generate the next question or make a final guess if you have enough information.`;
  }

  getGameState(): GameState {
    return { ...this.gameState };
  }

  resetGame(): void {
    this.gameState = {
      questionNumber: 0,
      previousQuestions: [],
      isGameComplete: false
    };
  }
}

export default JobGuessingAI;
