import React from 'react';
import { Header, Footer } from '../layout';
import CharacterDisplay from './CharacterDisplay.tsx';
import ActionButtons from './ActionButtons.tsx';

interface HeroSectionProps {
    onStartAdventure?: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onStartAdventure }) => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 flex flex-col items-center justify-center p-8">
            <Header />

            <CharacterDisplay />

            <ActionButtons onStartAdventure={onStartAdventure} />

            <Footer />
        </div>
    );
};

export default HeroSection;