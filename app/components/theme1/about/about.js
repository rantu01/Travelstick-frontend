
'use client';
import Choose from "../../home1/choose";
import WhoWeAre from "../../home1/whoWe";
import Banner from "../../site/common/component/Banner";
import Expert1 from "../../home1/expert1";
import Newsletter from "../../home1/newsletter";
import Testimonials from "../../home1/testimonials";
import { fetchPageContentTheme1 } from "@/app/helper/backend";
import { useFetch } from "@/app/helper/hooks";
import Banner2 from "../../site/common/component/Banner2";
import Choose2 from "../../home2/choose2";
import WhoWeAre2 from "../../home2/whoWe2";

const AboutPage = () => {
   const [data] = useFetch(fetchPageContentTheme1, {
      status: true,
   });
   const theme = data?.theme;
   return (
      <div className=''>
         {
            theme === 'one' ?
               <Banner title='About' /> :
               <Banner2 title='About' />
         }
         <div className='flex flex-col lg:gap-[100px] md:gap-20 sm:gap-14 gap-10 overflow-hidden'>
            <div className="py-10 bg-[#F8F7F6]">
               <WhoWeAre2 theme={theme} path="about" />
            </div>
            {
               theme === 'one' ?
                  <Choose position="lg:flex-row-reverse" /> :
                  <Choose2 />
            }
            <Testimonials theme={theme} />
            <Expert1 theme={theme} />
            <Newsletter theme={theme} />
         </div>
      </div>
   );
};

export default AboutPage;