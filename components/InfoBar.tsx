import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const InfoBar: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleConsent = (consent: 'accepted' | 'declined') => {
    setIsVisible(false);
    localStorage.setItem('cookieConsent', consent);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="bg-black text-white p-3 flex flex-col sm:flex-row items-center justify-center text-center text-sm relative gap-4">
      <p>
        We use cookies to improve your experience. By using our site, you agree to our use of cookies.
      </p>
      <div className="flex items-center gap-3">
        <button
          onClick={() => handleConsent('declined')}
          className="px-4 py-1 bg-gray-700 text-white font-semibold rounded-md hover:bg-gray-600 transition-colors text-xs"
        >
          Decline
        </button>
        <button
          onClick={() => handleConsent('accepted')}
          className="px-4 py-1 bg-white text-black font-semibold rounded-md hover:bg-gray-200 transition-colors text-xs"
        >
          Accept
        </button>
      </div>
      <button
        onClick={() => handleConsent('declined')}
        className="absolute top-1/2 right-4 -translate-y-1/2 p-1 rounded-full hover:bg-white/20 transition-colors"
        aria-label="Dismiss"
      >
        <X size={18} />
      </button>
    </div>
  );
};

export default InfoBar;