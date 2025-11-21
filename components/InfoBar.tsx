import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const InfoBar: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Small delay to let the page render first, feels smoother.
    const timer = setTimeout(() => {
        const consent = localStorage.getItem('cookieConsent');
        if (!consent) {
          setIsVisible(true);
        }
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleConsent = (consent: 'accepted' | 'declined') => {
    setIsVisible(false);
    localStorage.setItem('cookieConsent', consent);
  };

  const variants = {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: 20 }
  };


  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed bottom-4 left-4 z-50 bg-white text-black p-5 rounded-2xl border-2 border-black shadow-[4px_4px_0px_#000] max-w-sm"
          variants={variants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        >
          <button
            onClick={() => handleConsent('declined')}
            className="absolute top-2 right-2 p-1 rounded-full hover:bg-black/10 transition-colors"
            aria-label="Dismiss"
          >
            <X size={18} />
          </button>
          
          <p className="text-sm pr-4">
            We use cookies to improve your experience. By using our site, you agree to our use of cookies.
          </p>

          <div className="flex items-center gap-3 mt-4">
            <button
              onClick={() => handleConsent('declined')}
              className="px-4 py-1.5 bg-gray-200 text-black font-bold rounded-lg border-2 border-black shadow-[2px_2px_0px_#000] hover:shadow-[3px_3px_0px_#000] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all duration-200 text-xs"
            >
              Decline
            </button>
            <button
              onClick={() => handleConsent('accepted')}
              className="px-4 py-1.5 bg-[#8ECAE6] text-black font-bold rounded-lg border-2 border-black shadow-[2px_2px_0px_#000] hover:shadow-[3px_3px_0px_#000] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all duration-200 text-xs"
            >
              Accept
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default InfoBar;