import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import InputScreen from './screens/InputScreen';
import LoadingScreen from './screens/LoadingScreen';
import RevealScreen from './screens/RevealScreen';
import SharePreview from './components/SharePreview';
import InfoBar from './components/InfoBar';
import { generateNewVibe } from './data/mockData';
import type { UserProfile, BentoItemData } from './types';

type AppState = 'input' | 'loading' | 'reveal' | 'share';

export interface VibeConfig {
  userProfile: UserProfile;
  items: BentoItemData[];
}

const App: React.FC = () => {
  const { t } = useTranslation();
  const [appState, setAppState] = useState<AppState>('input');
  const [vibeConfig, setVibeConfig] = useState<VibeConfig | null>(null);

  const handleGenerate = (input: string) => {
    console.log(`Generating VibeLink for: ${input}`);
    setAppState('loading');

    setTimeout(() => {
      setVibeConfig(generateNewVibe(input, t));
      setAppState('reveal');
    }, 3000); 
  };

  const handleShuffle = () => {
    if (vibeConfig) {
      setVibeConfig(generateNewVibe(vibeConfig.userProfile.name, t));
    }
  };
  
  const handlePublish = () => {
    setAppState('share');
  };

  const handleBackToEdit = () => {
    setAppState('reveal');
  }

  const handleUpdateItem = (updatedItem: BentoItemData) => {
    if (vibeConfig) {
      const newItems = vibeConfig.items.map(item => 
        item.id === updatedItem.id ? updatedItem : item
      );
      setVibeConfig({ ...vibeConfig, items: newItems });
    }
  };


  const renderContent = () => {
    switch (appState) {
      case 'input':
        return <InputScreen onGenerate={handleGenerate} />;
      case 'loading':
        return <LoadingScreen />;
      case 'reveal':
        if (!vibeConfig) return <LoadingScreen />; // Fallback
        return (
            <RevealScreen 
                vibeConfig={vibeConfig} 
                onShuffle={handleShuffle} 
                onPublish={handlePublish}
                onUpdateItem={handleUpdateItem}
            />
        );
      case 'share':
        if (!vibeConfig) return <LoadingScreen />; // Fallback
        return <SharePreview vibeConfig={vibeConfig} onBack={handleBackToEdit}/>;
      default:
        return <InputScreen onGenerate={handleGenerate} />;
    }
  };

  return (
    <div className="antialiased">
      <InfoBar />
      {renderContent()}
    </div>
  );
};

export default App;