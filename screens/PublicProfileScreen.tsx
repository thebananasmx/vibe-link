import React from 'react';
import { motion } from 'framer-motion';
import type { VibeConfig } from '../types';
import BentoGrid from '../components/BentoGrid';

interface PublicProfileScreenProps {
  vibeConfig: VibeConfig;
}

const PublicProfileScreen: React.FC<PublicProfileScreenProps> = ({ vibeConfig }) => {
  const { userProfile, items } = vibeConfig;

  return (
    <div className="w-full p-4 sm:p-6 lg:p-8 relative overflow-hidden">
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

        {/* Bento Grid Section - Now reusable and functional! */}
        <BentoGrid 
          items={items} 
          isPublic={true}
          onItemClick={() => {}} // No action needed on click in public view
        />

        {/* Footer */}
        <footer className="text-center py-6 mt-8 text-gray-500/80 text-sm">
            <a href="/" className="hover:underline">Powered by VibeLink</a>
        </footer>
      </main>
    </div>
  );
};

export default PublicProfileScreen;
