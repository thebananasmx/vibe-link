import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { UserProfile, BentoItemData } from '../types';
import BentoGrid from '../components/BentoGrid';
import EditModal from '../components/EditModal';
import { RefreshCw, Upload } from 'lucide-react';

interface VibeConfig {
  userProfile: UserProfile;
  items: BentoItemData[];
}

interface RevealScreenProps {
  vibeConfig: VibeConfig;
  onShuffle: () => void;
  onPublish: () => void;
  onUpdateItem: (item: BentoItemData) => void;
}

const RevealScreen: React.FC<RevealScreenProps> = ({ vibeConfig, onShuffle, onPublish, onUpdateItem }) => {
  const [editingItem, setEditingItem] = useState<BentoItemData | null>(null);

  const { userProfile, items } = vibeConfig;

  return (
    <div className="min-h-screen w-full bg-[#F5EFE6] text-[#1E1E1E] p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      <main className="mx-auto max-w-4xl">
        {/* Profile Section */}
        <motion.div 
          className="flex flex-col items-center text-center my-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <img
            src={userProfile.avatarUrl}
            alt={userProfile.name}
            className="w-24 h-24 rounded-full object-cover border-4 border-black shadow-[4px_4px_0px_#000] mb-4"
          />
          <h1 className="text-4xl font-bold">{userProfile.name}</h1>
          <p className="text-md mt-2 max-w-md">{userProfile.bio}</p>
        </motion.div>

        {/* Bento Grid Section */}
        <BentoGrid items={items} onEditItem={setEditingItem} />

        {/* Footer */}
        <footer className="text-center py-6 mt-8 text-gray-500/80 text-sm">
            <p>Powered by VibeLink</p>
        </footer>
      </main>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-4 z-50">
         <motion.button
            onClick={onShuffle}
            className="w-16 h-16 flex items-center justify-center gap-2 bg-[#FFB703] text-black font-bold rounded-full border-2 border-black shadow-[4px_4px_0px_#000] hover:shadow-[6px_6px_0px_#000] active:shadow-[2px_2px_0px_#000] transform active:translate-x-[2px] active:translate-y-[2px] transition-all duration-200"
            aria-label="Shuffle Vibe"
            whileHover={{ rotate: 45 }}
            whileTap={{ scale: 0.9 }}
        >
            <RefreshCw size={28} />
        </motion.button>
        <motion.button
            onClick={onPublish}
            className="w-16 h-16 flex items-center justify-center gap-2 bg-[#8ECAE6] text-black font-bold rounded-full border-2 border-black shadow-[4px_4px_0px_#000] hover:shadow-[6px_6px_0px_#000] active:shadow-[2px_2px_0px_#000] transform active:translate-x-[2px] active:translate-y-[2px] transition-all duration-200"
            aria-label="Publish VibeLink"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
        >
            <Upload size={28} />
        </motion.button>
      </div>

      {/* Edit Modal */}
      <EditModal 
        item={editingItem}
        onClose={() => setEditingItem(null)}
        onSave={onUpdateItem}
      />
    </div>
  );
};

export default RevealScreen;