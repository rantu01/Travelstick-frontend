const CommonButton = ({ text, className,  }) => {
  return (
    <button className={`${className} bg-[#EF8248] w-full animate-bounceUpDown text-white whitespace-pre xl:px-8 lg:px-5 md:px-4 px-3 lg:py-3 py-2 rounded-full hover:bg-[#EB662B] transition duration-300 font-lato leading-6 font-medium xl:text-base lg:text-sm text-xs`}>
      {text}
    </button>
  );
}
export default CommonButton