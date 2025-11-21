import React, { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import InputScreen from './screens/InputScreen';
import LoadingScreen from './screens/LoadingScreen';
import RevealScreen from './screens/RevealScreen';
import PublicProfileScreen from './screens/PublicProfileScreen';
import EditorScreen from './screens/EditorScreen';
import SharePreview from './components/SharePreview';
import InfoBar from './components/InfoBar';
import Header from './components/Header';
import AuthModal from './components/AuthModal';
import { generateNewVibe } from './data/mockData';
import type { UserProfile, BentoItemData } from './types';
import type firebase from 'firebase/compat/app';
import { auth, db } from './firebase';

type AppState = 'input' | 'loading' | 'reveal' | 'share' | 'auth_loading' | 'public_profile' | 'editor';

export interface VibeConfig {
  slug: string;
  userProfile: UserProfile;
  items: BentoItemData[];
}

// A simple utility to navigate without page reloads
const navigate = (path: string) => {
  window.history.pushState({}, '', path);
  // Dispatch a popstate event to make sure our App component re-renders with the new path
  window.dispatchEvent(new PopStateEvent('popstate'));
};


const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('auth_loading');
  const [vibeConfig, setVibeConfig] = useState<VibeConfig | null>(null);
  const [isHeaderAuthModalOpen, setIsHeaderAuthModalOpen] = useState(false);
  const [user, setUser] = useState<firebase.User | null>(null);
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [publicProfileData, setPublicProfileData] = useState<VibeConfig | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  

  useEffect(() => {
    // Listen to path changes from browser back/forward
    const handlePopState = () => setCurrentPath(window.location.pathname);
    window.addEventListener('popstate', handlePopState);
    
    // Auth state listener
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      setUser(currentUser);
      // After auth state is resolved, route the user
      routeApp(currentUser);
    });

    return () => {
      window.removeEventListener('popstate', handlePopState);
      unsubscribe();
    }
  }, []);

  useEffect(() => {
    // Re-route whenever the path changes
    if(appState !== 'auth_loading') {
       routeApp(user);
    }
  }, [currentPath]);

  const routeApp = async (currentUser: firebase.User | null) => {
    setProfileLoading(true);
    const path = window.location.pathname;
    const parts = path.split('/').filter(Boolean);

    if (parts[0] === 'edit' && parts[1]) {
      // Edit route: /edit/[slug]
      if (currentUser) {
        const userDoc = await db.collection('users').doc(currentUser.uid).get();
        if (userDoc.exists) {
          const userData = userDoc.data() as VibeConfig;
          if (userData.slug === parts[1]) {
            setVibeConfig(userData);
            setAppState('editor');
          } else {
            // Logged in, but trying to edit someone else's page
            navigate(`/edit/${userData.slug}`); // Redirect to their own page
          }
        } else {
           // Logged in but no profile, send to create one
          setAppState('input');
        }
      } else {
        // Not logged in, trying to edit
        navigate('/'); // Go home
        setIsHeaderAuthModalOpen(true); // Prompt login
      }
    } else if (parts[0] === 'view' && parts[1]) {
      // Public profile route: /view/[slug]
      const slug = parts[1];
      const slugDoc = await db.collection('slugs').doc(slug).get();
      if (slugDoc.exists) {
        const { uid } = slugDoc.data() as { uid: string };
        const userDoc = await db.collection('users').doc(uid).get();
        if(userDoc.exists) {
            setPublicProfileData(userDoc.data() as VibeConfig);
            setAppState('public_profile');
        } else {
             navigate('/'); // User for this slug was deleted
        }
      } else {
        navigate('/'); // Slug not found
      }
    } else if (parts.length === 1 && !['edit', 'view'].includes(parts[0])) {
      // Old public profile route: /[slug] -> redirect to /view/[slug]
      navigate(`/view/${parts[0]}`);
    } else {
      // Home route: /
      setVibeConfig(null);
      setAppState('input');
    }
     setProfileLoading(false);
  };


  const handleGenerate = (input: string) => {
    setAppState('loading');
    setTimeout(() => {
      const newVibe = generateNewVibe(input);
      // Temporarily set a vibe config to go to the preview/share screen
      // The real config with slug will be created on signup
      setVibeConfig({ ...newVibe, slug: '' });
      setAppState('reveal');
    }, 2000); 
  };
  
  const handleSignOut = async () => {
    await auth.signOut();
    setVibeConfig(null);
    setUser(null);
    navigate('/');
    setAppState('input');
    toast.success('Logged out successfully!');
  }

  const handleShuffle = () => {
    if (vibeConfig) {
      setVibeConfig({ ...generateNewVibe(vibeConfig.userProfile.name), slug: vibeConfig.slug });
    }
  };
  
  const handlePublish = () => {
    setAppState('share');
  };

  const handleBackToEdit = () => {
    // For a new user, the URL hasn't changed from `/`.
    // We just need to change the component state back to the editor view.
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
    // onAuthStateChanged will handle routing
  };


  const renderContent = () => {
    if (appState === 'auth_loading' || profileLoading) {
      return <LoadingScreen />;
    }

    switch (appState) {
      case 'input':
        return <InputScreen onGenerate={handleGenerate} />;
      case 'loading':
        return <LoadingScreen />;
      case 'reveal':
        if (!vibeConfig) return <LoadingScreen />;
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
      case 'editor':
        if (!vibeConfig) return <LoadingScreen />;
        return (
            <EditorScreen
                vibeConfig={vibeConfig}
                user={user}
                onShuffle={handleShuffle}
                onUpdateItem={handleUpdateItem}
                onUpdateConfig={handleUpdateConfig}
            />
        );
      case 'share':
        if (!vibeConfig) return <LoadingScreen />;
        return <SharePreview vibeConfig={vibeConfig} onBack={handleBackToEdit} navigate={navigate} />;
      case 'public_profile':
        if(!publicProfileData) return <LoadingScreen />;
        return <PublicProfileScreen vibeConfig={publicProfileData} />;
      default:
        return <InputScreen onGenerate={handleGenerate} />;
    }
  };

  return (
    <div className="antialiased relative">
      <Toaster 
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#F5EFE6',
            color: '#1E1E1E',
            border: '2px solid #000',
            boxShadow: '4px 4px 0px #000',
            fontWeight: 'bold',
          },
          success: {
            icon: '✅',
          },
          error: {
            icon: '❌',
          },
        }}
      />
      <InfoBar />
      <Header user={user} onLogin={() => setIsHeaderAuthModalOpen(true)} onLogout={handleSignOut} />
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