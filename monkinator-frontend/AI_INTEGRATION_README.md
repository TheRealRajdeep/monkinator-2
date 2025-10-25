# Monkinator - AI Job Guessing Game

A blockchain-based job guessing game powered by OpenAI, similar to Akinator but for professions and careers.

## Features

- 🤖 AI-powered job guessing using OpenAI GPT-4
- 🎯 Yes/No question format like Akinator
- 💰 Blockchain integration with MON token deposits
- 🎮 Interactive game flow with smart contract integration
- 🎨 Modern React UI with Tailwind CSS

## Setup Instructions

### 1. Environment Variables

Create a `.env` file in the `monkinator-frontend` directory:

```bash
# OpenAI Configuration
VITE_OPENAI_API_KEY=your_openai_api_key_here
```

Get your OpenAI API key from: https://platform.openai.com/api-keys

### 2. Install Dependencies

```bash
cd monkinator-frontend
npm install
```

### 3. Smart Contract Setup

1. Deploy the smart contracts from the `smart-contracts` directory
2. Update the `CONTRACT_ADDRESS` in `src/lib/contract.ts` with your deployed contract address

### 4. Run the Application

```bash
npm run dev
```

## How It Works

1. **Start Game**: Player deposits 0.2 MON tokens to start a new game
2. **AI Questions**: OpenAI asks yes/no questions to narrow down the profession
3. **AI Guess**: After 8-12 questions, AI makes a final guess with confidence level
4. **Job Reveal**: Player reveals their actual job
5. **Payout**:
   - If AI guessed correctly: Player gets 99% of deposit back (1% house edge)
   - If AI guessed wrong: Player gets deposit + 0.2 MON reward

## Game Flow

```
Start Game (0.2 MON deposit)
    ↓
AI asks yes/no questions
    ↓
Player answers questions
    ↓
AI makes final guess
    ↓
Player reveals actual job
    ↓
Smart contract determines payout
    ↓
Player claims winnings
```

## Smart Contract Integration

The game integrates with the `JobGuessingGame` smart contract which handles:

- Game state management
- Token deposits and payouts
- Commit-reveal scheme for job verification
- House edge and reward calculations

## AI Question Examples

The AI asks questions like:

- "Do you work primarily indoors?"
- "Do you use specialized tools or equipment?"
- "Do you interact directly with customers?"
- "Do you work in healthcare?"
- "Do you need a college degree for your job?"

## Development

### Project Structure

```
monkinator-frontend/
├── src/
│   ├── components/
│   │   ├── game/           # Game-specific components
│   │   ├── home/           # Home page components
│   │   ├── layout/         # Layout components
│   │   └── ui/             # Reusable UI components
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utilities and services
│   │   ├── openai.ts       # OpenAI integration
│   │   └── contract.ts     # Smart contract integration
│   └── pages/              # Page components
```

### Key Files

- `src/lib/openai.ts` - OpenAI service for generating questions
- `src/hooks/useJobGuessingGame.ts` - Game state management hook
- `src/lib/contract.ts` - Smart contract integration
- `src/components/game/JobGuessingGame.tsx` - Main game component

## Security Notes

⚠️ **Important**: The current implementation uses OpenAI API directly in the frontend for demo purposes. In production, you should:

1. Move OpenAI API calls to a backend server
2. Implement proper API key management
3. Add rate limiting and abuse prevention
4. Validate and sanitize all inputs

## License

MIT License - see LICENSE file for details.
