import React, { useState, useEffect } from 'react';
import InputScreen from './screens/InputScreen';
import LoadingScreen from './screens/LoadingScreen';
import RevealScreen from './screens/RevealScreen';
import SharePreview from './components/SharePreview';
import InfoBar from './components/InfoBar';
import Header from './components/Header';
import AuthModal from './components/AuthModal';
import { generateNewVibe } from './data/mockData';
import type { UserProfile, BentoItemData } from './types';
// FIX: Using Firebase v8 compat imports and types. Removed v9 modular imports.
// FIX: Use 'firebase/compat/app' to get correct types for v8 compat mode.
import type firebase from 'firebase/compat/app';
import { auth, db } from './firebase';


type AppState = 'input' | 'loading' | 'reveal' | 'share' | 'auth_loading';

export interface VibeConfig {
  userProfile: UserProfile;
  items: BentoItemData[];
}

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('auth_loading');
  const [vibeConfig, setVibeConfig] = useState<VibeConfig | null>(null);
  const [isHeaderAuthModalOpen, setIsHeaderAuthModalOpen] = useState(false);
  // FIX: Use firebase.User type for v8.
  const [user, setUser] = useState<firebase.User | null>(null);

  useEffect(() => {
    // FIX: Use auth.onAuthStateChanged for v8.
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        // User is signed in, see if they have a VibeLink config
        // FIX: Use db.collection().doc().get() for v8.
        const docRef = db.collection("users").doc(currentUser.uid);
        const docSnap = await docRef.get();

        if (docSnap.exists) {
          // If they have data, load it and go to the editor
          setVibeConfig(docSnap.data() as VibeConfig);
          setAppState('reveal');
        } else {
          // If they are new or haven't saved a vibe, go to input
          setAppState('input');
        }
      } else {
        // User is signed out
        setUser(null);
        setVibeConfig(null);
        setAppState('input');
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);


  const handleGenerate = (input: string) => {
    console.log(`Generating VibeLink for: ${input}`);
    setAppState('loading');

    setTimeout(() => {
      setVibeConfig(generateNewVibe(input));
      setAppState('reveal');
    }, 3000); 
  };

  const handleShuffle = () => {
    if (vibeConfig) {
      setVibeConfig(generateNewVibe(vibeConfig.userProfile.name));
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
  
  const handleUpdateConfig = (newConfig: VibeConfig) => {
    setVibeConfig(newConfig);
  }

  const handleLoginSuccess = () => {
    setIsHeaderAuthModalOpen(false);
    // onAuthStateChanged will handle the rest
  };


  const renderContent = () => {
    switch (appState) {
      case 'auth_loading':
        return <LoadingScreen />;
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
                onUpdateConfig={handleUpdateConfig}
                user={user}
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
    <div className="antialiased relative">
      <InfoBar />
      {appState === 'input' && !user && <Header onLogin={() => setIsHeaderAuthModalOpen(true)} />}
      {renderContent()}
       {isHeaderAuthModalOpen && (
        <AuthModal
          initialMode="login"
          onClose={() => setIsHeaderAuthModalOpen(false)}
          onSuccess={handleLoginSuccess}
        />
      )}
    </div>
  );
};

export default App;