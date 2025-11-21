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
import { generateVibeWithGemini } from './lib/gemini';
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
  const [originalInput, setOriginalInput] = useState('');
  

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
      try {
        const slugDoc = await db.collection('slugs').doc(slug).get();
        if (slugDoc.exists) {
          const slugData = slugDoc.data();
          const uid = slugData?.uid; // Safely access uid

          if (uid) {
            const userDoc = await db.collection('users').doc(uid).get();
            if(userDoc.exists) {
                setPublicProfileData(userDoc.data() as VibeConfig);
                setAppState('public_profile');
            } else {
                 toast.error('This VibeLink profile no longer exists.');
                 navigate('/'); // User for this slug was deleted
            }
          } else {
            toast.error('This VibeLink is misconfigured.');
            navigate('/');
          }
        } else {
          toast.error('This VibeLink does not exist.');
          navigate('/'); // Slug not found
        }
      } catch (error) {
        console.error("Error fetching public profile:", error);
        toast.error('Sorry, we could not load this VibeLink.');
        navigate('/');
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


  const handleGenerate = async (input: string) => {
    setOriginalInput(input);
    setAppState('loading');
    try {
      const newVibe = await generateVibeWithGemini(input);
      if (!newVibe) {
        throw new Error("AI generation returned null");
      }
      setVibeConfig({ ...newVibe, slug: '' });
      setAppState('reveal');
    } catch (e) {
      toast.error("Couldn't generate a vibe. The AI might be tired. Please try again.");
      setAppState('input');
    }
  };
  
  const handleSignOut = async () => {
    await auth.signOut();
    setVibeConfig(null);
    setUser(null);
    navigate('/');
    setAppState('input');
    toast.success('Logged out successfully!');
  }

  const handleShuffle = async () => {
    if (!vibeConfig) return;
    const inputForShuffle = originalInput || vibeConfig.userProfile.name;
    const currentSlug = vibeConfig.slug;
    const returnState = appState;
    setAppState('loading');

    try {
      const newVibe = await generateVibeWithGemini(inputForShuffle);
      if (!newVibe) throw new Error("AI shuffle returned null");
      setVibeConfig({ ...newVibe, slug: currentSlug });
    } catch (error) {
      console.error("AI Shuffle failed:", error);
      toast.error("AI shuffle failed. Please try again in a moment.");
    } finally {
      setAppState(returnState);
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

  const handleLoginSuccess = async (user: firebase.User) => {
    setIsHeaderAuthModalOpen(false);
    setProfileLoading(true);
    try {
      const userDoc = await db.collection('users').doc(user.uid).get();
      if (userDoc.exists) {
        const userData = userDoc.data() as VibeConfig;
        // The routeApp logic will handle setting the state when the path changes
        navigate(`/edit/${userData.slug}`); 
      } else {
        // User exists but has no profile, send to create one
        toast('Welcome! Create your VibeLink to get started.');
        navigate('/');
        setAppState('input');
      }
    } catch (error) {
        console.error("Error fetching user profile after login:", error);
        toast.error("Could not load your profile. Please try again.");
        navigate('/');
    } finally {
        setProfileLoading(false);
    }
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
    <div className="antialiased min-h-screen flex flex-col bg-[#F5EFE6] text-[#1E1E1E]">
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
      {appState !== 'share' && <Header user={user} onLogin={() => setIsHeaderAuthModalOpen(true)} onLogout={handleSignOut} />}
      <main className="flex-grow flex flex-col">
        {renderContent()}
      </main>
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