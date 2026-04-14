"use client";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState, useCallback } from "react";
import { CiLocationOn } from "react-icons/ci";
import { FiShare2, FiHeart, FiX, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useFetch } from "@/app/helper/hooks";
import { getAllPublicHotel } from "@/app/helper/backend";
import { useI18n } from "@/app/contexts/i18n";
import { useCurrency } from "@/app/contexts/site";
import { FaCheck, FaStar } from "react-icons/fa6";
import RoomSelection from "@/app/components/theme1/hotels/RoomSelection";
import { motion, AnimatePresence } from "framer-motion";
import { FaWifi, FaUsers, FaSmokingBan, FaParking, FaSnowflake, FaUtensils } from "react-icons/fa";
import { MdOutlineCleaningServices } from "react-icons/md";
import { IoFastFoodOutline } from "react-icons/io5";
const HotelDetails = () => {
  const params = useParams();
  const { id } = params;
  const { langCode } = useI18n();
  const { formatPrice } = useCurrency();
  const [data, getData] = useFetch(getAllPublicHotel, {}, false);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [copied, setCopied] = useState(false);

  const copyUrl = useCallback((e) => {
    e?.stopPropagation();
    try {
      const url = window.location.href;
      navigator.clipboard.writeText(url).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    } catch (err) {
      try {
        window.prompt("Copy to clipboard: Ctrl+C, Enter", window.location.href);
      } catch (e) { }
    }
  }, []);

  useEffect(() => {
    if (id) {
      getData({ _id: id });
    }
  }, [id]);

  const allImages = useMemo(() => {
    const images = [];
    if (data?.banner_image) images.push(data.banner_image);
    if (data?.images && Array.isArray(data.images)) {
      images.push(...data.images);
    }
    return images;
  }, [data]);

  const nextImage = useCallback((e) => {
    e?.stopPropagation();
    if (allImages.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % allImages.length);
  }, [allImages.length]);

  const prevImage = useCallback((e) => {
    e?.stopPropagation();
    if (allImages.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  }, [allImages.length]);

  const hotelName = useMemo(() => {
    if (!data?.name) return "Hotel";
    // Handle both Map objects and plain objects
    if (typeof data.name === 'object') {
      const nameValue = data.name[langCode] || data.name['en'] || data.name.en;
      return String(nameValue || "Hotel Name");
    }
    return String(data.name || "Hotel Name");
  }, [data, langCode]);

  const hotelAddress = useMemo(() => {
    const dest = data?.destination;
    if (!dest) return "";

    // Handle destination name
    if (dest.name) {
      if (typeof dest.name === "object") {
        const nameValue = dest.name[langCode] || dest.name['en'] || dest.name.en;
        return String(nameValue || "");
      }
      return String(dest.name || "");
    }
    return "";
  }, [data, langCode]);

  const destinationFullAddress = useMemo(() => {
    const dest = data?.destination;
    if (!dest) return "";
    return String(dest.address || "");
  }, [data]);

  // Use mapLink from backend if available, otherwise generate search URL
  const embedMapUrl = useMemo(() => {
    if (data?.mapLink) {
      // If mapLink is a full embed URL, use it directly
      if (data.mapLink.includes('embed')) {
        return data.mapLink;
      }
      // If it's a regular Google Maps link, convert to embed
      if (data.mapLink.includes('google.com/maps')) {
        return data.mapLink.replace('/maps/', '/maps/embed/');
      }
    }
    // Fallback to search query
    const searchQuery = encodeURIComponent(`${hotelName} ${destinationFullAddress || hotelAddress}`);
    return `https://maps.google.com/maps?q=${searchQuery}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
  }, [data?.mapLink, hotelName, hotelAddress, destinationFullAddress]);

  const googleMapsLink = useMemo(() => {
    if (data?.mapLink && !data.mapLink.includes('embed')) {
      return data.mapLink;
    }
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hotelName + " " + (destinationFullAddress || hotelAddress))}`;
  }, [data?.mapLink, hotelName, hotelAddress, destinationFullAddress]);

  // Use current_price from backend (already calculated)
  const currentPrice = useMemo(() => {
    return Number(data?.current_price || 0);
  }, [data?.current_price]);

  const regularPrice = useMemo(() => {
    return Number(data?.price?.amount || 0);
  }, [data?.price?.amount]);

  // Use review data from backend response
  const reviewData = useMemo(() => {
    if (!data?.review || !Array.isArray(data.review) || data.review.length === 0) {
      return null;
    }

    const reviews = data.review;
    const reviewCalculation = data.review_calculation;

    // Use average_review from backend if available
    const average = data.average_review ||
      (reviewCalculation?.rating || 0);

    return {
      average: Number(average).toFixed(1),
      count: Number(data.reviews_count || reviews.length),
      latestComment: String(reviews[0]?.comment || ""),
      calculation: reviewCalculation
    };
  }, [data]);

  const renderStars = useMemo(() => {
    const starCount = Math.max(0, Math.min(5, Number(data?.star) || 5));
    return Array.from({ length: starCount }, (_, i) => (
      <FaStar key={`star-${i}`} />
    ));
  }, [data?.star]);

  const popularFacilities = [
    { name: "Free WiFi", icon: <FaWifi className="text-[#008009]" /> },
    { name: "Family rooms", icon: <FaUsers className="text-[#008009]" /> },
    { name: "Non-smoking rooms", icon: <FaSmokingBan className="text-[#008009]" /> },
    { name: "Parking on site", icon: <FaParking className="text-[#008009]" /> },
    { name: "Air conditioning", icon: <FaSnowflake className="text-[#008009]" /> },
    { name: "Daily housekeeping", icon: <MdOutlineCleaningServices className="text-[#008009]" /> },
    { name: "Tea/Coffee Maker in All Rooms", icon: <FaUtensils className="text-[#008009]" /> },
  ];

  const aboutContent = useMemo(() => {
    if (!data?.about) return "";

    // Handle both Map objects and plain objects
    if (typeof data.about === 'object') {
      const aboutValue = data.about[langCode] || data.about['en'] || data.about.en;
      return String(aboutValue || "");
    }
    return String(data.about || "");
  }, [data?.about, langCode]);

  return (
    <div className="bg-white min-h-screen pb-20 font-sans text-[#1a1a1a] isolate">

      <AnimatePresence>
        {currentIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCurrentIndex(null)}
            className="fixed inset-0 z-[999] bg-black/95 flex items-center justify-center p-4"
          >
            <button className="absolute top-5 right-5 text-white bg-white/10 p-2 rounded-full" onClick={() => setCurrentIndex(null)}>
              <FiX size={30} />
            </button>
            <button onClick={nextImage} className="absolute right-4 text-white bg-white/10 p-3 rounded-full"><FiChevronRight size={40} /></button>
            <button onClick={prevImage} className="absolute left-4 text-white bg-white/10 p-3 rounded-full"><FiChevronLeft size={40} /></button>
            <img src={allImages[currentIndex]} className="max-w-full max-h-[85vh] rounded-lg object-contain" alt="Preview" />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto mt-6 px-4 lg:px-0">
        <div className="flex justify-between items-start mb-2">
          <div className="flex flex-col gap-1">
            {/* <div className="flex items-center gap-2">
              <span className="bg-[#8E8E8E] text-white text-[10px] px-1 rounded-sm uppercase font-bold">{String(data?.hotel_type || "Hotel")}</span>
              <div className="flex text-yellow-400 text-xs">{renderStars}</div>
            </div> */}
            <h1 className="text-4xl font-bold leading-tight">{hotelName}</h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={copyUrl}
              aria-label="Copy page URL"
              className="flex items-center gap-2 text-[#006ce4] hover:opacity-80"
            >
              <FiShare2 size={22} />
              {copied && <span className="text-sm text-[#006ce4] font-medium">Copied</span>}
            </button>
          </div>
        </div>

        {/* <div className="flex items-center gap-1 mb-4 text-[14px]">
          <CiLocationOn className="text-[#006ce4] font-bold" />
          <p className="text-[#006ce4] underline cursor-pointer font-medium">
            {destinationFullAddress || hotelAddress}
          </p>
        </div> */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
          <div className="lg:col-span-2">
            <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[450px] overflow-hidden rounded-lg">
              <div className="col-span-2 row-span-2 relative cursor-zoom-in overflow-hidden group" onClick={() => setCurrentIndex(0)}>
                <img src={data?.banner_image} alt="Banner" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              {data?.images?.slice(0, 3).map((img, index) => (
                <div key={index} className="cursor-zoom-in overflow-hidden group" onClick={() => setCurrentIndex(index + 1)}>
                  <img src={img} alt="Hotel" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
              ))}
              <div className="relative cursor-pointer overflow-hidden group" onClick={() => setCurrentIndex(4)}>
                <img src={data?.images?.[3] || data?.images?.[0]} alt="Hotel" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-bold">
                  +{data?.images?.length > 3 ? Number(data.images.length) - 3 : 0} photos
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col h-[450px] space-y-4 min-h-0">
            {/* <div className="border rounded-lg p-4">
              {reviewData ? (
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <p className="font-bold text-[#1a1a1a]">{parseFloat(reviewData.average) >= 4 ? "Excellent" : "Very good"}</p>
                    <p className="text-xs text-gray-500">{reviewData.count} reviews</p>
                  </div>
                  <div className="bg-[#003580] text-white px-2 py-1 rounded font-bold">{reviewData.average}</div>
                </div>
              ) : <p className="font-bold">No reviews yet</p>}
            </div> */}

            {/* Map Section */}
            <div className="border rounded-lg p-4 bg-white">
              <p className="font-semibold mb-2 text-sm">Location</p>
              <div className="relative h-1/2 w-full overflow-hidden rounded-md mb-3 border bg-gray-100">
                <iframe
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  src={embedMapUrl}
                ></iframe>
              </div>
              <a
                href={googleMapsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#006ce4] text-white py-2 rounded font-semibold text-sm text-center block"
              >
                View on Google Maps
              </a>
            </div>
            <div className="space-y-4 min-h-0">
              <div className="bg-[#f0f6ff] p-5 rounded-lg border border-blue-100 flex-1 overflow-auto">
                <h3 className="font-bold text-lg mb-2">Property Highlights</h3>

                <div className="space-y-4 text-[14px]">

                  {/* Meal Plans Section */}
                  {data?.meal_plans && data.meal_plans.length > 0 && (
                    <div className="space-y-2">
                      <p className="font-bold text-[#1a1a1a] flex items-center gap-2">
                        <IoFastFoodOutline className="text-lg" /> Meal Options:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {data.meal_plans.map((meal, index) => (
                          <span
                            key={index}
                            className="bg-white border border-blue-200 px-2 py-1 rounded-md text-[12px] font-medium text-blue-700"
                          >
                            {meal}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}


                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-3 space-y-8">
            <div>
              <h2 className="text-xl font-bold mb-4">About this property</h2>
              <div className="text-[15px] text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: aboutContent }} />
            </div>

            {/* Most Popular Facilities Section */}
            <div className="mt-8 border-t pt-6">
              <h2 className="text-xl font-bold mb-4">Most popular facilities</h2>
              <div className="flex flex-wrap gap-x-6 gap-y-4">
                {popularFacilities.map((facility, index) => (
                  <div key={index} className="flex items-center gap-2 text-[14px] text-[#1a1a1a]">
                    <span className="text-xl">{facility.icon}</span>
                    <span>{facility.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>


        </div>
        <RoomSelection />
      </div>
    </div>
  );
};

export default HotelDetails;