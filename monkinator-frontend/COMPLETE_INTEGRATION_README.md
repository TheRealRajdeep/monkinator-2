# Monkinator - AI Job Guessing Game

A blockchain-based job guessing game powered by OpenAI, similar to Akinator but for professions and careers. The game uses a commit-reveal scheme to ensure fair play and integrates with three smart contracts.

## 🏗️ **Architecture Overview**

The system consists of three deployed smart contracts:

1. **CommitReveal** (`0x17fd7327b38f378c0e76436a8ddf97e220703512`)

   - Handles commit-reveal scheme for job verification
   - Prevents players from changing their job mid-game

2. **JobGuessingGame** (`0x8410feb4a1dbfb58a2bb1c72c150c09352695aee`)

   - Main game contract managing deposits, payouts, and game state
   - Integrates with CommitReveal for job verification

3. **JobGuessingGameFactory** (`0x227c1031ac10ab7342b6b9f54d3b2d9fbfcd9fac`)
   - Factory contract that deployed the other two contracts
   - Provides contract addresses

## 🎮 **Complete Game Flow**

### Phase 1: Job Commitment

1. Player thinks of a job/profession
2. Player commits the job hash to `CommitReveal` contract
3. Player deposits 0.2 MON tokens to `JobGuessingGame` contract
4. Game starts with both AI and blockchain components

### Phase 2: AI Questioning

1. OpenAI asks strategic yes/no questions
2. Player answers each question
3. AI narrows down possibilities through 8-12 questions
4. AI makes final guess with confidence level

### Phase 3: Job Reveal & Resolution

1. Player reveals their actual job
2. Smart contract verifies the reveal matches the original commit
3. AI guess result is submitted to blockchain
4. Payout is calculated based on AI accuracy
5. Player can claim winnings

## 💰 **Payout System**

- **AI Guesses Correctly**: Player gets 99% of deposit back (1% house edge)
- **AI Guesses Wrong**: Player gets deposit + 0.2 MON reward
- **Commit-Reveal Verification**: Ensures fair play and prevents cheating

## 🚀 **Features**

- 🤖 **AI-Powered Questions**: OpenAI GPT-4 generates intelligent yes/no questions
- 🔒 **Commit-Reveal Scheme**: Cryptographic job commitment prevents cheating
- 💰 **Blockchain Integration**: Full smart contract integration with MON tokens
- 🎯 **Akinator-Style Gameplay**: Strategic questioning to narrow down professions
- 📊 **Game Status Tracking**: Real-time blockchain state monitoring
- 🎨 **Modern UI**: Beautiful, responsive interface with loading states

## 📋 **Setup Instructions**

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

### 3. Smart Contract Integration

The contracts are already deployed and integrated:

- **CommitReveal**: `0x17fd7327b38f378c0e76436a8ddf97e220703512`
- **JobGuessingGame**: `0x8410feb4a1dbfb58a2bb1c72c150c09352695aee`
- **Factory**: `0x227c1031ac10ab7342b6b9f54d3b2d9fbfcd9fac`

### 4. Run the Application

```bash
npm run dev
```

## 🎯 **How to Play**

1. **Connect Wallet**: Connect your Web3 wallet (MetaMask, etc.)
2. **Commit Job**: Think of a job and commit it to the blockchain
3. **Deposit Tokens**: Deposit 0.2 MON tokens to start the game
4. **Answer Questions**: Respond to AI's yes/no questions
5. **AI Makes Guess**: AI provides final guess with confidence level
6. **Reveal Job**: Submit your actual job for verification
7. **Claim Winnings**: Collect your payout based on AI's accuracy

## 🔧 **Technical Implementation**

### Smart Contract Integration

```typescript
// Contract addresses are already configured
const COMMIT_REVEAL_ADDRESS = "0x17fd7327b38f378c0e76436a8ddf97e220703512";
const JOB_GUESSING_GAME_ADDRESS = "0x8410feb4a1dbfb58a2bb1c72c150c09352695aee";

// Complete flow implementation
const { commitJob, startGame, submitGuessResult, revealJob, claimWinnings } =
  useJobGuessingContract();
```

### AI Question Generation

```typescript
// OpenAI integration for intelligent questioning
const ai = new JobGuessingAI();
const response = await ai.generateQuestion();
// Returns: { question: "Do you work primarily indoors?", isComplete: false }
```

### Commit-Reveal Implementation

```typescript
// Job commitment with cryptographic hash
const jobHash = keccak256(encodePacked(["string", "address"], [job, address]));
await commitJob(jobHash);

// Job reveal with verification
await revealJob(actualJob); // Verifies against original commit
```

## 📁 **Project Structure**

```
monkinator-frontend/
├── src/
│   ├── components/
│   │   ├── game/              # Game-specific components
│   │   │   ├── JobCommitment.tsx    # Job commitment step
│   │   │   ├── GameQuestion.tsx      # AI question display
│   │   │   ├── GameResult.tsx        # AI guess result
│   │   │   ├── JobGuessingGame.tsx   # Main game component
│   │   │   └── GameStatus.tsx       # Blockchain state display
│   │   ├── home/              # Home page components
│   │   ├── layout/            # Layout components
│   │   └── ui/                # Reusable UI components
│   ├── hooks/
│   │   └── useJobGuessingGame.ts     # Game state management
│   ├── lib/
│   │   ├── openai.ts          # OpenAI integration
│   │   └── contract.ts        # Smart contract integration
│   └── pages/
│       └── HomePage.tsx       # Main page with game integration
```

## 🔒 **Security Features**

- **Commit-Reveal Scheme**: Prevents job changing mid-game
- **Cryptographic Verification**: Hash-based job verification
- **Smart Contract Validation**: All game logic enforced on-chain
- **Time Windows**: Commit and reveal periods prevent abuse

## 🎨 **UI Components**

- **JobCommitment**: Initial job commitment interface
- **GameQuestion**: AI question display with Yes/No buttons
- **GameResult**: AI guess display with confidence meter
- **GameStatus**: Real-time blockchain state monitoring
- **JobGuessingGame**: Main orchestrator component

## 🚨 **Security Notes**

⚠️ **Important**: The current implementation uses OpenAI API directly in the frontend for demo purposes. In production, you should:

1. Move OpenAI API calls to a backend server
2. Implement proper API key management
3. Add rate limiting and abuse prevention
4. Validate and sanitize all inputs
5. Implement proper error handling and logging

## 🎯 **AI Question Examples**

The AI asks strategic questions like:

- "Do you work primarily indoors?"
- "Do you use specialized tools or equipment?"
- "Do you interact directly with customers?"
- "Do you work in healthcare?"
- "Do you need a college degree for your job?"
- "Do you work with numbers and data?"
- "Do you provide services to other businesses?"

## 📊 **Game States**

The game tracks multiple states:

- **Commitment**: Job committed to blockchain
- **In Progress**: AI asking questions
- **Completed**: AI made final guess
- **Revealed**: Job revealed and verified
- **Claimed**: Winnings claimed

## 🔄 **Error Handling**

Comprehensive error handling for:

- OpenAI API failures
- Blockchain transaction failures
- Network connectivity issues
- Invalid user inputs
- Contract state mismatches

## 📈 **Future Enhancements**

- Backend API for OpenAI calls
- Multiple difficulty levels
- Tournament modes
- Leaderboards
- NFT rewards
- Mobile app development

## 📄 **License**

MIT License - see LICENSE file for details.
