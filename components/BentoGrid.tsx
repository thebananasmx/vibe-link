import React from 'react';
import { motion } from 'framer-motion';
import type { BentoItemData } from '../types';
import BentoItem from './BentoItem';

interface BentoGridProps {
  items: BentoItemData[];
  onEditItem: (item: BentoItemData) => void;
}

const BentoGrid: React.FC<BentoGridProps> = ({ items, onEditItem }) => {
  const gridVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[200px]"
      variants={gridVariants}
      initial="hidden"
      animate="visible"
    >
      {items.map((item) => (
        <BentoItem 
          key={item.id} 
          {...item} 
          onClick={() => onEditItem(item)} 
        />
      ))}
    </motion.div>
  );
};

export default BentoGrid;
