'use client';
import { useState } from 'react';
import { motion } from "framer-motion";
import { usePathname } from 'next/navigation';

const Button = ({
  disabled = false,
  children,
  onClick,
  className = '',
  type = 'button',
  loadingText = 'Loading...',
  pathName,
  whileTapScale = 0.85  
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();

  const handleClick = async (event) => {
    if (type === 'submit') {
      setIsLoading(true); 
    }
    if (onClick) {
      await onClick(event); 
    }
    if (type === 'submit') {
      setIsLoading(false); 
    }
  };

  const isHomePage = pathName === 'home3' && pathname === '/'; 
  const buttonClasses = `
    border-2 description border-primary bg-primary lg:px-4 text-lg text-white !font-poppins md:px-4 py-[6px] px-4 capitalize rounded transition-colors duration-300 ease-in-out 
    ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'hover:bg-[#EB662B] hover:text-white'}
    ${isHomePage ? 'hover:bg-primary text-white' : ''}
    ${className}
  `;

  return (
    <motion.button
      whileTap={{ scale: whileTapScale }}
      type={type}
      onClick={handleClick}
      className={buttonClasses}
      disabled={isLoading || disabled} 
      aria-label={isLoading ? 'Submitting...' : 'Click to submit'} 
    >
      {isLoading ? loadingText : children}
    </motion.button>
  );
};

export default Button;
