import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
// FIX: Import 'Variants' type from framer-motion to correctly type the animation variants.
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import type { BentoItemData } from '../types';
import { X } from 'lucide-react';

interface EditModalProps {
  item: BentoItemData | null;
  onClose: () => void;
  onSave: (item: BentoItemData) => void;
}

const EditModal: React.FC<EditModalProps> = ({ item, onClose, onSave }) => {
  const { t } = useTranslation();
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');

  useEffect(() => {
    if (item) {
      setTitle(item.title);
      setSubtitle(item.subtitle);
    }
  }, [item]);

  const handleSave = () => {
    if (item) {
      onSave({ ...item, title, subtitle });
      onClose();
    }
  };
  
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  // FIX: Apply the 'Variants' type to ensure the 'transition' property is correctly typed.
  const modalVariants: Variants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 300, damping: 30 } },
    exit: { opacity: 0, y: 50, scale: 0.9 },
  };

  if (!item) return null;
  const isProfile = item.type === 'profile';

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={onClose}
        >
          <motion.div
            className="bg-[#F5EFE6] rounded-2xl border-2 border-black p-6 w-full max-w-md"
            variants={modalVariants}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">{t('editModal.title')}</h2>
              <button onClick={onClose} className="p-1 rounded-full hover:bg-black/10 transition-colors">
                <X size={24} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-bold mb-1">{t('editModal.titleLabel')}</label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  disabled={isProfile}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-lg px-4 py-2 rounded-lg border-2 border-black bg-transparent focus:outline-none focus:ring-2 focus:ring-[#FB8500] transition-all duration-300 disabled:opacity-50"
                />
              </div>
              <div>
                <label htmlFor="subtitle" className="block text-sm font-bold mb-1">{t('editModal.subtitleLabel')}</label>
                <input
                  id="subtitle"
                  type="text"
                  value={subtitle}
                   disabled={isProfile}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="w-full text-lg px-4 py-2 rounded-lg border-2 border-black bg-transparent focus:outline-none focus:ring-2 focus:ring-[#FB8500] transition-all duration-300 disabled:opacity-50"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-4">
              <button
                onClick={onClose}
                className="px-6 py-2 bg-gray-200 text-black font-bold rounded-lg border-2 border-black shadow-[2px_2px_0px_#000] hover:shadow-[4px_4px_0px_#000] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all duration-200"
              >
                {t('editModal.cancelButton')}
              </button>
              <button
                onClick={handleSave}
                disabled={isProfile}
                className="px-6 py-2 bg-[#8ECAE6] text-black font-bold rounded-lg border-2 border-black shadow-[2px_2px_0px_#000] hover:shadow-[4px_4px_0px_#000] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all duration-200 disabled:opacity-50"
              >
                {t('editModal.saveButton')}
              </button>
            </div>
             {isProfile && <p className="text-xs text-center mt-4 text-gray-500">{t('editModal.profileHelpText')}</p>}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EditModal;