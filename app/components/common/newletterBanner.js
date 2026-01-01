'use client'
import { useI18n } from "@/app/contexts/i18n";
import Image from "next/image";
import AnimatedContent from "../ui/animatedContent";

const NewsletterBannerPage = ({ align = 'center', maxWidth = 'max-w-[710px]', title, heading, description, theme = 1 }) => {
   const i18n = useI18n();
   return (
      <div className="agency-container">
         <div className={`${align === 'center' ? 'flex flex-col items-center justify-center text-center' : ''} `}>
            {
               theme === 'one' ?
                  <div className="relative w-[271px] h-[63px] animate-bounceUpDown">
                     <Image src="/theme1/newsletter/bg.png" width={1000} height={1000} className="object-cover" alt="background" />
                     <p className="absolute inset-0 flex text-[#05073C] items-center justify-center section-heading -mt-1 ">{i18n.t(title)}</p>
                  </div> :
                  <div className="flex items-center animate-bounceUpDown">
                     <Image
                        src="/theme2/star.png"
                        width={1000}
                        height={1000}
                        className="object-cover w-14 h-14 relative z-10"
                        alt="background"
                     />
                     <p className={` text-white text-sm lg:text-base font-lato capitalize px-4 lg:px-6 py-2 lg:py-3.5 rounded-full border-2 -ml-2`}>
                        {i18n.t(title)}
                     </p>
                  </div>
            }
            <AnimatedContent direction="horizontal" distance={100} reverse={true}>
               <h1 className={`heading-1 text-[#FFFFFF] md:mt-4 mt-3 ${maxWidth}`}>{i18n.t(heading)}</h1>
            </AnimatedContent>
            <AnimatedContent direction="horizontal" distance={100} reverse={false}>
               <p className={`description-1 text-[#FFFFFF] lg:mt-6 md:mt-5 mt-4 ${maxWidth}`}>{i18n.t(description)}</p>
            </AnimatedContent>
         </div>
      </div>
   );
}
export default NewsletterBannerPage