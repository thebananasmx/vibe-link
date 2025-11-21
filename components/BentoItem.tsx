import React from 'react';
import { motion, type Variants } from 'framer-motion';
import type { BentoItemData } from '../types';
import { ArrowUpRight } from 'lucide-react';

// Extender las props para incluir el callback onClick
interface BentoItemProps extends BentoItemData {
  onClick: () => void;
}

const BentoItem: React.FC<BentoItemProps> = ({
  Icon,
  title,
  subtitle,
  href,
  bgColor,
  colSpan,
  rowSpan,
  type = 'default',
  img,
  onClick,
}) => {
  // FIX: Explicitly type itemVariants with Variants to fix type inference issue with transition.type
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 50, scale: 0.8 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 260,
        damping: 25,
      }
    },
  };

  const content = () => {
    if (type === 'profile' && img) {
      return (
        <div className="relative w-full h-full">
          <img 
            src={img} 
            alt={title} 
            className="absolute inset-0 w-full h-full object-cover rounded-3xl filter grayscale contrast-125 brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div className="relative z-10 flex flex-col justify-end h-full p-6 text-white">
            <h3 className="text-xl md:text-2xl font-bold">{title}</h3>
            <p className="text-sm text-white/80">{subtitle}</p>
          </div>
        </div>
      );
    }

    if (type === 'sticker' && Icon) {
        return (
            <div className="flex items-center justify-center w-full h-full">
                <Icon size={80} className="text-black/80 transform group-hover:scale-125 transition-transform duration-300" />
            </div>
        )
    }

    // Default content
    return (
      <>
        <div className="relative z-10">
          {Icon && <Icon size={40} className="mb-2 text-black" />}
          <h3 className="text-xl md:text-2xl font-bold text-black">{title}</h3>
          <p className="text-sm text-black/80">{subtitle}</p>
        </div>
        <ArrowUpRight
          size={24}
          className="absolute top-4 right-4 text-black transform transition-transform duration-300 group-hover:rotate-45"
        />
        <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-all ease-in-out duration-400 [clip-path:circle(0%_at_100%_100%)] group-hover:[clip-path:circle(150%_at_100%_100%)]" />
      </>
    );
  };
  
  const handleItemClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    onClick();
  }

  return (
    <motion.div
      onClick={handleItemClick}
      variants={itemVariants}
      className={`relative flex flex-col justify-between p-0 rounded-3xl overflow-hidden group border-2 border-black shadow-[4px_4px_0px_#000] hover:shadow-[8px_8px_0px_#000] transition-all duration-300 cursor-pointer ${colSpan} ${rowSpan} ${bgColor}`}
      whileHover={{ scale: 1.02, rotate: -1 }}
      whileTap={{ scale: 0.98, rotate: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {content()}
    </motion.div>
  );
};

export default BentoItem;