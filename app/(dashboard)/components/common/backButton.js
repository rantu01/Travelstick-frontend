"use client"; 

import { IoMdArrowBack } from "react-icons/io";
import { useRouter } from "next/navigation"; // Use Next.js router

const BackButton = () => {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="flex items-center gap-2 text-sm lg:text-[18px]">
      <button
        onClick={handleBack}
        className="flex items-center gap-1 bg-primary text-white px-4 py-2 lg:py-3 lg:px-5 rounded-md hover:bg-[#EB662B] transition duration-300"
      >
        <IoMdArrowBack />
        <p>Back</p>
      </button>
    </div>
  );
};

export default BackButton;
