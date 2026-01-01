/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import Image from "next/image";
import { useFetch } from "@/app/helper/hooks";
import { getDashboardData } from "@/app/helper/backend";
import { useI18n } from "@/app/contexts/i18n";
import PackageBookingPage from "./packageBooking/packageBookingPage";
import Link from "next/link";
const UserDashboard = () => {
  const i18n = useI18n();
  const [dashboardData] = useFetch(getDashboardData);

  const allData = dashboardData?.[0]
  
  const data = [
    {
      image: "/theme1/dashboard/package.png",
      value: allData?.package_booking || 0,
      title: "Packages Booking",
      link: "/user/packageBooking",
    },
    {
      image: "/theme1/dashboard/hotel.png",
      title: "Hotel Booking",
      value: allData?.hotel_booking || 0,
      link: "/user/hotelBooking",
    },
    {
      image: "/theme1/dashboard/visa.png",
      title: "Visa Inquiry",
      value: allData?.visa_inquery || 0,
      link: "/user/visaInquery",
    },
    {
      image: "/theme1/dashboard/product.png",
      value: allData?.product_booking || 0,
      title: "Product Orders Completed",
      link: "/user/productOrder",
    },
  ]
  return (
    <div>
      <div className="rounded-md grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:gap-6 lg:gap-3 sm:gap-3 gap-4">
        {
          data.map((item, index) => (
            <Link href={item?.link} key={index} className='shadow-custom-light rounded-md border xl:p-6 lg:p-5 md:p-3 p-4 lg:gpa-6 md:gap-5 sm:gap-4 gap-3'>
              <div className="w-16 h-16">
                <Image
                  width={1000}
                  height={1000}
                  src={item?.image}
                  className="text-[#22F55DCC] w-14 h-14"
                  alt={item.title}
                />
              </div>
              <div className="">
                <p className="description-3 font-normal text-[#05073C] mt-4">{i18n.t(item.title)}</p>
                <p className="heading-3 !font-bold  text-[#05073C] mt-2">{item.value}</p>
              </div>
            </Link>
          ))
        }
      </div>
      <div className="mt-8">
        <PackageBookingPage />
      </div>
    </div>
  );
}

export default UserDashboard
