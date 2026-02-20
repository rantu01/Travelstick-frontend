"use client";
import HotelBooking from "@/app/components/common/hotelBooking";
import ImageVideo from "@/app/components/common/imageVideo";
import Rating from "@/app/components/common/Rating";
import Banner from "@/app/components/site/common/component/Banner";
import {
  fetchPageContentTheme1,
  getAllHotelBookingByUser,
  getAllPublicHotel,
} from "@/app/helper/backend";
import { useFetch } from "@/app/helper/hooks";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { CiLocationOn } from "react-icons/ci";
import { FiMap } from "react-icons/fi";
import AboutDetails from "@/app/components/common/aboutDetails";
import { useUser } from "@/app/contexts/user";
import { MapSelector } from "@/app/components/form/location";
import Banner2 from "@/app/components/site/common/component/Banner2";

const HotelDetails = () => {
  const { user } = useUser();
  const params = useParams();
  const { id } = params;
  const [data, getData] = useFetch(getAllPublicHotel, {}, false);
  const [hotelBookings] = useFetch(getAllHotelBookingByUser);
  const checked = !!hotelBookings?.docs?.find(
    (item) => item?.hotel?._id === id
  );
  const [showModal, setShowModal] = useState(false);
  useEffect(() => {
    getData({ _id: id });
  }, []);

  const location = data?.destination?.address;
  const [googleAddress, setGoogleAddress] = useState(location);


  const [data1] = useFetch(fetchPageContentTheme1, {
    status: true,
  });
  const theme = data1?.theme;

  return (
    <div className="">
      {
        theme === 'one' ?
          <Banner title="Hotel Details" /> :
          <Banner2 title="Hotel Details" />
      }
      <div className="travel-container xl:mt-[106px] lg:mt-[90px] md:mt-20 xm:mt-16 mt-12 pb-20 relative overflow-hidden">
        <ImageVideo data={data} />
        <div className="xl:mt-10 lg:mt-8 md:mt-7 sm:mt-6 mt-5 ">
          <div className="flex items-center xl:gap-6 lg:gap-5 md:gap-4 sm:gap-3 gap-2 ">
            <div className="flex items-center md:gap-2 gap-1 ">
              <CiLocationOn className="description-1 text-[#717171]" />
              <p className="description-1 text-[#717171]">
                {data?.destination?.name}
              </p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center md:gap-2 gap-1"
            >
              <FiMap className="description-1 text-primary" />
              <p className="description-1 text-primary underline">See On Map</p>
            </button>
          </div>
          <div className="xl:mt-6 lg:mt-5 md:mt-4 mt-4 flex flex-col lg:flex-row gap-6 ">
            <div className="w-full lg:w-[60%] xl:w-[70%]">
              <AboutDetails data={data} />
            </div>
            {/* Book This Tour */}
            <div className="w-full lg:w-[40%] xl:w-[30%]">
              <HotelBooking user={user} data={data} />
            </div>
          </div>
        </div>
        <div className="xl:mt-[101px] lg:mt-20 md:mt-16 sm:mt-12 mt-10 w-full">
          <Rating checked={checked} data={data} slug="hotel" />
        </div>
      </div>
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-xl max-w-3xl w-full p-8 relative">
            {/* Close Button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-black text-xl"
            >
              &times;
            </button>

            {/* Map View */}
            <MapSelector
              height={360}
              isGoogleMap={true}
              onChange={(e) => {
                setGoogleAddress(e);
              }}
              value={location}
              inputHidden
            />
            <p className="text-center font-semibold mt-2">{location?.name}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default HotelDetails;
