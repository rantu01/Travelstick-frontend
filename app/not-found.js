import React from 'react'
import Link from 'next/link'
import Banner from './components/site/common/component/Banner'
import Image from 'next/image'
export default function NotFound() {
   return (
      <div className='bg-primary bg-opacity-45'>
         <Banner title='404' />
         <div className="travel-container flex flex-col justify-center items-center lg:py-20 sm:py-14 py-10">
            <h1 className='heading-1 text-red-600 text-center'>Whoops! That page doesn&apos;t exist.</h1>
            <Image className='lg:mt-[64px] mt-7 h-[300px] md:h-[430px] lg:h-[530px] w-[1320px]' src="/404.png" width={1320} height={1000} alt="image" />
            <Link className='common-btn bg-primary lg:mt-[64px] mt-7 text-white' href="/">
               Back to Home
            </Link>
         </div>
      </div>
   )
}