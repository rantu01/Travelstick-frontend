'use client'
import Image from "next/image";
import { useI18n } from "@/app/contexts/i18n";
import { useFetch } from "@/app/helper/hooks";
import { getDashboardData } from "@/app/helper/backend";
import { useCurrency } from "@/app/contexts/site";
import RevenueChart from "../components/revenueChart";
import BookingPieChart from "../components/bookingChart";
import EmployeeList from "../components/employeeList";
import DashboardPackage from "../components/dashboardPackage";
import DashboardPackageBooking from "../components/dashboardPackageBooking";
import DashboardHotelBooking from "../components/dashboardHotelBooking";


const AdminDashboard = () => {
  const i18n = useI18n();
  const { currency_symbol } = useCurrency();
  const [summeryData] = useFetch(getDashboardData);
  const data = [
    {
      image: "/theme1/dashboard/package.png",
      value: `${currency_symbol} ${summeryData?.package.toFixed(2) || 0}`,
      title: "Packages Revenue",
    },
    {
      image: "/theme1/dashboard/hotel.png",
      value: `${currency_symbol} ${summeryData?.hotel.toFixed(2) || 0}`,
      title: "Hotel Revenue",
    },
    {
      image: "/theme1/dashboard/product.png",
      value: `${currency_symbol} ${summeryData?.product.toFixed(2) || 0}`,
      title: "Product Revenue",
    },
    {
      image: "/theme1/dashboard/visa.png",
      value: `${summeryData?.visa || 0}`,
      title: "Total Visa",
    },
  ]
  return (
    <div className="w-full overflow-x-auto">
      <div className="xl:m-6 lg:m-4 m-3">
        <div className="rounded-md grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 xl:gap-6 lg:gap-3 sm:gap-3 gap-4">
          {
            data.map((item, index) => (
              <div key={index} className='shadow-custom-light rounded-md border xl:p-6 lg:p-5 md:p-3 p-4 lg:gpa-6 md:gap-5 sm:gap-4 gap-3'>
                <div className="w-16 h-16 ">
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
              </div>
            ))
          }
        </div>
        <div className="xl:mt-6 lg:mt-4 mt-3 flex flex-col xl:flex-row xl:gap-6 lg:gap-5 md:gap-4 sm:gap-3 gap-2">
          <div className="w-full xl:w-[70%] shadow-custom-light overflow-x-auto">
            <RevenueChart />
          </div>
          <div className="w-full xl:w-[30%] shadow-custom-light bg-white">
            <BookingPieChart />
          </div>
        </div>
        <div className="xl:mt-6 lg:mt-4 mt-3 flex flex-col xl:flex-row xl:gap-6 lg:gap-5 md:gap-4 sm:gap-3 gap-2">
          <div className="w-full xl:w-[30%] shadow-custom-light bg-white">
            <EmployeeList />
          </div>
          <div className="w-full xl:w-[70%] shadow-custom-light bg-white overflow-x-auto">
            <DashboardPackage />
          </div>
        </div>

        <div className="xl:mt-6 lg:mt-4 mt-3 flex flex-col xl:flex-row xl:gap-6 lg:gap-5 md:gap-4 sm:gap-3 gap-2">
          <div className="w-full xl:w-[50%] shadow-custom-light bg-white">
            <DashboardPackageBooking />
          </div>
          <div className="w-full xl:w-[50%] shadow-custom-light overflow-x-auto bg-white">
            <DashboardHotelBooking />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard
