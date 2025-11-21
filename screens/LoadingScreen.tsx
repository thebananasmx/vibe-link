import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CircleLoader from '../components/CircleLoader';

const LoadingScreen: React.FC = () => {
  const loadingTexts = [
      "Analyzing your vibe...",
      "Consulting the digital oracle...",
      "Calibrating neobrutalism...",
      "Assembling pixels with attitude...",
      "Rolling the cosmic dice...",
      "Cooking up something awesome..."
    ];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % loadingTexts.length);
    }, 1500);

    return () => clearInterval(interval);
  }, [loadingTexts.length]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-[#F5EFE6] text-[#1E1E1E] p-4 overflow-hidden">
      <CircleLoader />
      <div className="mt-12 text-xl font-semibold text-center h-8">
        <AnimatePresence mode="wait">
          <motion.p
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
          >
            {loadingTexts[index]}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default LoadingScreen;
