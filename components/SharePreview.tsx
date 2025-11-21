import React from 'react';
import { motion } from 'framer-motion';
import type { UserProfile, BentoItemData } from '../types';
import BentoGrid from './BentoGrid';
import { Download, Edit } from 'lucide-react';

interface VibeConfig {
  userProfile: UserProfile;
  items: BentoItemData[];
}

interface SharePreviewProps {
  vibeConfig: VibeConfig;
  onBack: () => void;
}

const SharePreview: React.FC<SharePreviewProps> = ({ vibeConfig, onBack }) => {
  const { userProfile, items } = vibeConfig;

  // No-op edit function for preview
  const handleDummyEdit = () => {};

  return (
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
                     <BentoGrid items={items} onEditItem={handleDummyEdit} />
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
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-[#8ECAE6] text-black font-bold text-lg rounded-xl border-2 border-black shadow-[4px_4px_0px_#000] hover:shadow-[6px_6px_0px_#000] active:shadow-[2px_2px_0px_#000] transform active:translate-x-[2px] active:translate-y-[2px] transition-all duration-200"
                >
                    <Download size={20} /> Claim URL
                </button>
            </div>
        </motion.div>
    </div>
  );
};

export default SharePreview;