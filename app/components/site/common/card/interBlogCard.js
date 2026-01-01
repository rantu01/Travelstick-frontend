'use client'
import Image from 'next/image';
import React from 'react';
import { MdPerson } from "react-icons/md";
import { CiClock2 } from "react-icons/ci";
import { GoArrowUpRight } from "react-icons/go";
import Link from 'next/link';
import dayjs from "dayjs";
import { useI18n } from '@/app/contexts/i18n';
import AnimatedContent from '@/app/components/ui/animatedContent';
const InnerBlogCard = ({ data, slug }) => {
   const { langCode } = useI18n();
   return (
      <AnimatedContent direction="horizontal" distance={100} reverse={true}>
      <div className='group first:mt-0 2xl:mt-[60px] xl:mt-12 lg:mt-10 md:mt-8 mt-6'>
         <div className='relative'>
            {
               data?.card_image && (
                  <Image className='w-full xl:h-[420px] lg:h-[320px] md:h-[250px] sm:h-[220px] h-[200px] object-fill' src={data?.card_image} width={1000} height={1000} alt="image" />
               )
            }
            <div className='absolute common-btn bg-primary lg:right-8 lg:bottom-8 sm:right-5 sm:bottom-5 right-3 bottom-3'>{data?.category?.name?.[langCode]}</div>
         </div>
         <div className='lg:mt-6 sm:mt-5 mt-4 flex flex-col sm:flex-row xl:gap-14 lg:gap-12 md:gap-3 sm:gap-3 gap-2'>
            <div className='flex gap-1 sm:gap-2 lg:gap-3'>
               <MdPerson className='text-primary text-base lg:text-xl' />
               <p className='description-2 font-normal text-[#888AA0]'>{data?.author?.name}</p>
            </div>
            <div className='flex xl:gap-14 lg:gap-12 md:gap-3 sm:gap-3 gap-2'>
               <div className='flex gap-1 sm:gap-2 lg:gap-3'>
                  <CiClock2 className='text-primary text-base lg:text-xl' />
                  <p className='description-2 font-normal text-[#888AA0]'>{dayjs(data?.createdAt).format('DD MMMM YYYY')}</p>
               </div>
            </div>
         </div>
         <h2 className='xl:mt-8 lg:mt-7 md:mt-5 mt-4 heading-2 text-white'>{data?.title?.[langCode]}</h2>
         <p className='lg:mt-6 md:mt-5 mt-4 description-2 text-[#888AA0] font-normal leading-6'>
            {data?.short_description?.[langCode]}
         </p>
         {
            slug === 'blog' && (
               <button className='transform duration-300 group-hover:text-[#02050A] mt-4 learn-btn bg-[#55E6A5] text-white flex items-center justify-center gap-1 md:gap-2'>
                  <Link href={`/blog/${data?._id}`}>Learn More</Link>
                  <GoArrowUpRight className=' text-xl font-bold group-hover:rotate-45 transform duration-300' />
               </button>
            )
         }
      </div>
      </AnimatedContent>
   );
};

export default InnerBlogCard;