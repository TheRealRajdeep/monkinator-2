import React, { useState } from 'react';
import { Button } from '../ui';
import { Card } from '../ui';

interface JobCommitmentProps {
    onJobCommitted: (job: string) => void;
    isLoading: boolean;
}

const JobCommitment: React.FC<JobCommitmentProps> = ({ onJobCommitted, isLoading }) => {
    const [job, setJob] = useState<string>('');

    const handleSubmit = () => {
        if (job.trim()) {
            onJobCommitted(job.trim());
        }
    };

    return (
        <Card className="w-full max-w-2xl mx-auto p-8 bg-white/90 backdrop-blur-sm">
            <div className="text-center space-y-6">
                <div className="text-6xl mb-4">🔒</div>
                <h2 className="text-2xl font-bold text-gray-800">
                    Commit Your Job
                </h2>
                <p className="text-gray-600 text-lg">
                    First, think of a job or profession and commit it to the blockchain.
                    This ensures you can't change your mind during the game!
                </p>

                <div className="space-y-4">
                    <input
                        type="text"
                        value={job}
                        onChange={(e) => setJob(e.target.value)}
                        placeholder="Enter the job/profession you're thinking of..."
                        className="w-full p-4 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <div className="text-sm text-gray-500">
                        💡 Tip: Be specific! Instead of "doctor", try "cardiologist" or "pediatrician"
                    </div>

                    <Button
                        variant="default"
                        size="lg"
                        onClick={handleSubmit}
                        disabled={!job.trim() || isLoading}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 text-lg font-semibold"
                    >
                        {isLoading ? 'Committing...' : 'Commit Job & Start Game'}
                    </Button>
                </div>

                <div className="text-xs text-gray-400 mt-4">
                    Your job will be hashed and stored on-chain. You'll reveal it after the AI makes its guess.
                </div>
            </div>
        </Card>
    );
};

export default JobCommitment;
