'use client';
import { useEffect, useState } from 'react';
import { motion } from "framer-motion";
import { usePathname } from 'next/navigation';
import { subscribeUploadLoading } from '@/app/helper/api';

const Button = ({
  disabled = false,
  children,
  onClick,
  className = '',
  type = 'button',
  loading = false,
  loadingText = 'Loading...',
  pathName,
  whileTapScale = 0.85  
}) => {
  const [isInternalLoading, setIsInternalLoading] = useState(false);
  const [isUploadLoading, setIsUploadLoading] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (type !== 'submit') {
      return undefined;
    }

    return subscribeUploadLoading(setIsUploadLoading);
  }, [type]);

  const isLoading = Boolean(loading || isInternalLoading || (type === 'submit' && isUploadLoading));
  const effectiveLoadingText = type === 'submit' && isUploadLoading ? 'Uploading...' : loadingText;

  const handleClick = async (event) => {
    // Allow form submission to proceed naturally for type="submit" without onClick
    if (type === 'submit' && !onClick) {
      return;
    }
    
    if (!onClick || loading) {
      return;
    }

    setIsInternalLoading(true);
    try {
      await onClick(event);
    } finally {
      setIsInternalLoading(false);
    }
  };

  const isHomePage = pathName === 'home3' && pathname === '/'; 
  const buttonClasses = `
    border-2 description border-primary bg-primary lg:px-4 text-lg text-white !font-poppins md:px-4 py-[6px] px-4 capitalize rounded transition-colors duration-300 ease-in-out 
    ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'hover:bg-[#15438a] hover:text-white'}
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
      {isLoading ? effectiveLoadingText : children}
    </motion.button>
  );
};

export default Button;
