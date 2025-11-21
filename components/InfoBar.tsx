import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, X } from 'lucide-react';

const InfoBar: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const isDismissed = localStorage.getItem('infoBarDismissed');
    if (!isDismissed) {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('infoBarDismissed', 'true');
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(e.target.value);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="bg-black text-white p-3 flex items-center justify-center text-center text-sm relative">
      <p className="hidden sm:block mr-4">{t('infoBar.message')}</p>
      <div className="flex items-center gap-2">
        <Globe size={16} />
        <label htmlFor="language-select" className="sr-only">{t('infoBar.language')}</label>
        <select
          id="language-select"
          value={i18n.language}
          onChange={handleLanguageChange}
          className="bg-black border border-gray-600 rounded-md p-1 text-xs focus:outline-none focus:ring-1 focus:ring-white"
        >
          <option value="en">English</option>
          <option value="es">Español</option>
        </select>
      </div>
      <button
        onClick={handleDismiss}
        className="absolute right-4 p-1 rounded-full hover:bg-white/20 transition-colors"
        aria-label="Dismiss"
      >
        <X size={18} />
      </button>
    </div>
  );
};

export default InfoBar;
