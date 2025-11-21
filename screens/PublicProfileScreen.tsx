import React from 'react';
import { motion } from 'framer-motion';
import type { VibeConfig } from '../types';
import BentoGrid from '../components/BentoGrid';

interface PublicProfileScreenProps {
  vibeConfig: VibeConfig;
}

const PublicProfileScreen: React.FC<PublicProfileScreenProps> = ({ vibeConfig }) => {
  const { userProfile, items } = vibeConfig;

  // A dummy on-click handler for the grid items in public view
  const handleItemClick = (href: string) => {
    if (href && href !== '#') {
      window.open(href, '_blank', 'noopener,noreferrer');
    }
  };

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

        {/* Bento Grid Section - Pass a handler that opens the link */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[200px]">
            {items.map((item) => (
                <motion.a
                key={item.id}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`relative flex flex-col justify-between p-6 rounded-3xl overflow-hidden group border-2 border-black shadow-[4px_4px_0px_#000] hover:shadow-[8px_8px_0px_#000] transition-all duration-300 cursor-pointer ${item.colSpan} ${item.rowSpan} ${item.bgColor}`}
                whileHover={{ scale: 1.02, rotate: -1 }}
                whileTap={{ scale: 0.98, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                {/* Re-implementing simplified item content here for public view */}
                 <div className="relative z-10">
                    {item.Icon && <item.Icon size={40} className="mb-2 text-black" />}
                    <h3 className="text-xl md:text-2xl font-bold text-black">{item.title}</h3>
                    <p className="text-sm text-black/80">{item.subtitle}</p>
                </div>
                </motion.a>
            ))}
        </div>


        {/* Footer */}
        <footer className="text-center py-6 mt-8 text-gray-500/80 text-sm">
            <a href="/" className="hover:underline">Powered by VibeLink</a>
        </footer>
      </main>
    </div>
  );
};

export default PublicProfileScreen;
