'use client'
import { useI18n } from '@/app/contexts/i18n';
import { fetchPublicSettings } from '@/app/helper/backend';
import { useFetch } from '@/app/helper/hooks';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { FaChevronRight, FaHome } from "react-icons/fa";

const Banner3 = ({ title = 'Home' }) => {
    const i18n = useI18n();
    const [data] = useFetch(fetchPublicSettings);

    // Banner2 এর মতো ভিডিও সোর্স নেওয়া হয়েছে
    const bannerVideo = data?.banner_video ?? '/banner.mp4';
    const bannerImage = '/theme1/coxs-bazar.jpg';

    return (
        <div className="relative -mt-24 lg:-mt-[140px] h-[300px] sm:h-[400px] lg:h-[500px] overflow-hidden">

            <Image
                src={bannerImage}
                alt={i18n.t(title) || 'Banner Image'}
                fill // পুরো কন্টেইনার জুড়ে থাকার জন্য
                className="absolute inset-0 object-cover" // object-cover যাতে ইমেজ রেশিও ঠিক থাকে
                priority // ব্যানার ইমেজের জন্য দ্রুত লোড হতে সাহায্য করে
                sizes="100vw" // রেসপন্সিভ সাইজ অপ্টিমাইজেশন
            />
            <div className='bg-black bg-opacity-40 absolute inset-0'></div>

            {/* Content - Banner2 এর মতো এলাইনমেন্ট */}
            <div className="flex flex-col justify-center items-center z-10 relative h-full text-center px-4">
                <h1 className="heading-1 text-white">{i18n.t(title)}</h1>
                <div className="flex items-center justify-center gap-2 sm:gap-3 xl:mt-[14px] lg:mt-3 mt-2">
                    <Link href='/' className='flex items-center justify-center gap-2 sm:gap-3'>
                        <FaHome className='text-white' />
                        <p className='description-2 text-white'>{i18n.t('Home')}</p>
                    </Link>
                    <FaChevronRight className='text-white' />
                    <p className="description-2 text-primary">{i18n.t(title)}</p>
                </div>
            </div>
        </div>
    );
};

export default Banner3;