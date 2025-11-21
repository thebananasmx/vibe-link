import React from 'react';
import { motion } from 'framer-motion';

const circleVariants = {
  animate: {
    rotate: 360,
  },
};

const CircleLoader: React.FC = () => {
  return (
    <div className="w-10 h-10">
      <motion.svg
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
        variants={circleVariants}
        animate="animate"
        transition={{
          duration: 1,
          ease: 'linear',
          repeat: Infinity,
        }}
      >
        <circle
          cx="50"
          cy="50"
          r="45"
          stroke="currentColor"
          strokeWidth="10"
          fill="none"
          strokeDasharray="283"
          strokeDashoffset="71"
          strokeLinecap="round"
          className="text-black/20"
        />
         <circle
          cx="50"
          cy="50"
          r="45"
          stroke="currentColor"
          strokeWidth="10"
          fill="none"
          strokeDasharray="283"
          strokeDashoffset="212"
           strokeLinecap="round"
          className="text-black"
        />
      </motion.svg>
    </div>
  );
};

export default CircleLoader;
