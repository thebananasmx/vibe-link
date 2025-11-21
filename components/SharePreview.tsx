import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import type { VibeConfig } from '../types';
import BentoGrid from './BentoGrid';
import AuthModal from './AuthModal';
import { Edit, Check, Copy, AlertTriangle } from 'lucide-react';
import { auth, db } from '../firebase';
import CircleLoader from './CircleLoader';

interface SharePreviewProps {
  vibeConfig: VibeConfig;
  onBack: () => void;
  navigate: (path: string) => void;
}

// Simple slugify function
const createSlug = (name: string) => {
    return name
        .toLowerCase()
        .trim()
        .replace(/^@/, '') // Remove leading @
        .replace(/[^\w\s-]/g, '') // Remove non-word chars
        .replace(/[\s_-]+/g, '-') //-
        .replace(/^-+|-+$/g, '');
};

const SharePreview: React.FC<SharePreviewProps> = ({ vibeConfig, onBack, navigate }) => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  const { userProfile, items } = vibeConfig;
  const loggedInUser = auth.currentUser;

  const handleClaimSuccess = async () => {
    setIsAuthModalOpen(false);
    setSaveState('saving');
    
    const currentUser = auth.currentUser;
    if (!currentUser || !vibeConfig) {
        console.error("No user logged in or no vibe config available to save.");
        setSaveState('error');
        toast.error('Something went wrong. Please try again.');
        return;
    }

    try {
        let slug = createSlug(vibeConfig.userProfile.name);
        
        // Check for slug uniqueness
        let slugExists = (await db.collection('slugs').doc(slug).get()).exists;
        let attempts = 0;
        while(slugExists && attempts < 5) {
            const newSlug = `${slug}${Math.floor(Math.random() * 100)}`;
            slugExists = (await db.collection('slugs').doc(newSlug).get()).exists;
            if (!slugExists) {
                slug = newSlug;
            }
            attempts++;
        }

        if (slugExists) {
            throw new Error("Could not generate a unique slug.");
        }

        const finalVibeConfig: VibeConfig = { ...vibeConfig, slug };

        // Use a batch write to make it atomic
        const batch = db.batch();
        const userRef = db.collection("users").doc(currentUser.uid);
        const slugRef = db.collection("slugs").doc(slug);

        batch.set(userRef, finalVibeConfig);
        batch.set(slugRef, { uid: currentUser.uid });
        
        await batch.commit();

        setSaveState('saved');
        toast.success('URL Claimed! Redirecting...');
        // Redirect to the new editor page
        setTimeout(() => navigate(`/edit/${slug}`), 1500);

    } catch (error) {
        console.error("Error claiming URL: ", error);
        setSaveState('error');
        toast.error('Could not claim URL. Please try again.');
        setTimeout(() => setSaveState('idle'), 3000);
    }
  };
  
  const handleCopyLink = () => {
    if (!loggedInUser || !vibeConfig.slug) return;
    const url = `${window.location.origin}/${vibeConfig.slug}`;
    navigator.clipboard.writeText(url);
    toast.success('Link copied to clipboard!');
  };


  const getButtonContent = () => {
    if (loggedInUser) {
       return <><Copy size={20} /> Copy Link</>;
    }
    
    switch(saveState) {
        case 'saving': return <><CircleLoader /> Saving...</>;
        case 'saved': return <><Check size={20} /> URL Claimed!</>;
        case 'error': return <><AlertTriangle size={20} /> Try Again</>;
        default: return <>Claim URL</>;
    }
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen w-full bg-gray-800 p-4">
          <motion.div
           initial={{ opacity: 0, scale: 0.8 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ duration: 0.5, type: 'spring' }}
          >
              <h1 className="text-4xl font-bold text-white text-center mb-2">Almost there!</h1>
              <p className="text-lg text-gray-300 text-center mb-6">This is how your VibeLink will look. Perfect for your stories!</p>

              {/* Story Preview */}
              <div className="aspect-[9/16] h-[70vh] max-h-[800px] w-auto bg-[#F5EFE6] rounded-3xl border-8 border-black shadow-[8px_8px_0px_rgba(255,255,255,0.1)] overflow-hidden">
                  <div className="overflow-y-auto h-full p-4 scale-[0.9] origin-top">
                  {/* Profile Section */}
                  <div className="flex flex-col items-center text-center my-6">
                      <img
                      src={userProfile.avatarUrl}
                      alt={userProfile.name}
                      className="w-20 h-20 rounded-full object-cover border-4 border-black shadow-[4px_4px_0px_#000] mb-3"
                      />
                      <h1 className="text-2xl font-bold text-black">{userProfile.name}</h1>
                      <p className="text-sm mt-1 max-w-xs text-black/80">{userProfile.bio}</p>
                  </div>

                  {/* Bento Grid Section */}
                  <div className="scale-[0.95]">
                       <BentoGrid items={items} onEditItem={() => {}} />
                  </div>
                 
                  {/* Footer */}
                  <footer className="text-center py-4 mt-4 text-gray-400 text-xs">
                      <p>Powered by VibeLink</p>
                  </footer>
                  </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center gap-4 mt-6">
                   <button
                      onClick={onBack}
                      className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 text-black font-bold text-lg rounded-xl border-2 border-black shadow-[4px_4px_0px_#000] hover:shadow-[6px_6px_0px_#000] active:shadow-[2px_2px_0px_#000] transform active:translate-x-[2px] active:translate-y-[2px] transition-all duration-200"
                  >
                      <Edit size={20} /> Back to Edit
                  </button>
                  <button
                      onClick={() => loggedInUser ? handleCopyLink() : setIsAuthModalOpen(true)}
                      disabled={saveState === 'saving' || saveState === 'saved'}
                      className={`flex items-center justify-center gap-2 px-6 py-3 text-black font-bold text-lg rounded-xl border-2 border-black shadow-[4px_4px_0px_#000] transition-all duration-200 min-w-[200px] 
                      ${saveState === 'saved' ? 'bg-green-400 cursor-default' : 'bg-[#8ECAE6] hover:shadow-[6px_6px_0px_#000] active:shadow-[2px_2px_0px_#000] transform active:translate-x-[2px] active:translate-y-[2px]'} 
                      ${saveState === 'error' ? 'bg-red-400' : ''}
                      ${saveState === 'saving' ? 'bg-yellow-400 cursor-wait' : ''}`}
                  >
                    {getButtonContent()}
                  </button>
              </div>
          </motion.div>
      </div>

      {isAuthModalOpen && (
        <AuthModal
          onClose={() => setIsAuthModalOpen(false)}
          onSuccess={handleClaimSuccess}
        />
      )}
    </>
  );
};

export default SharePreview;