"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { MdOutlineLocationOn } from "react-icons/md";
import { FaStar } from "react-icons/fa6";
import { useCurrency } from "@/app/contexts/site";
import { useI18n } from "@/app/contexts/i18n";

const HotelCard = ({ data }) => {
  const { formatPrice } = useCurrency();
  const { langCode } = useI18n();

  const safeDestination =
    (() => {
      if (!data?.destination) return "Unknown location";
      if (typeof data.destination === "string") return data.destination;
      const name = data.destination?.name;
      if (name) {
        try {
          // name can be a Map-like object with language keys
          if (typeof name === 'object') {
            return name[langCode] || name.en || Object.values(name)[0] || data.destination.address || 'Unknown location';
          }
          return name;
        } catch (e) {
          return data.destination.address || 'Unknown location';
        }
      }
      return data.destination.address || 'Unknown location';
    })();

  const getDistanceText = () => {
    if (typeof data?.distance_from_city === "number" && Number.isFinite(data?.distance_from_city)) {
      return `${data.distance_from_city} km from centre`;
    }
    return "Distance not specified";
  };

  const badges = Array.isArray(data?.card_badges) && data.card_badges.length
    ? data.card_badges
    : Array.isArray(data?.facilities_services) && data.facilities_services.length
      ? data.facilities_services
      : [];

  const visibleBadges = badges.slice(0, 3);
  const remainingBadgeCount = badges.length > 3 ? badges.length - 3 : 0;

  const roomLabel = data?.card_room_label || data?.room_type || "Standard";
  const roomDetails = data?.card_room_details || [
    data?.refundability === "non_refundable" ? "Non Refundable" : data?.refundability === "refundable" ? "Refundable" : null,
    Array.isArray(data?.meal_plans) && data.meal_plans.length ? data.meal_plans[0] : null,
  ].filter(Boolean).join(" • ") || "Room details not specified";

  const starLabel = Number(data?.star) > 0 ? `${Number(data?.star)}-star hotel` : "Hotel";

  return (
    <div className="group w-full rounded-[15px] border border-[#E8EAE8] bg-white overflow-hidden flex flex-col md:flex-row transition-shadow hover:shadow-md h-auto md:h-[220px] box-border">

      <div className="relative w-full md:w-[280px] lg:w-[320px] flex-shrink-0 p-3 md:p-4 h-auto md:h-full">
        {data?.card_image && (
          <Image
            className="w-full h-[200px] md:h-full object-cover rounded-[10px]"
            src={data?.card_image}
            width={400}
            height={300}
            alt="hotel image"
          />
        )}
      </div>

      <div className="flex flex-col flex-grow p-4 md:py-5 md:px-2 justify-start h-auto md:h-full overflow-hidden min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="text-[20px] font-bold text-[#1A1A1A] leading-tight">
            {data?.name?.[langCode]}
          </h3>
          <div className="flex items-center gap-0.5">
            {[...Array(Number(data?.star) || 0)].map((_, i) => (
              <FaStar key={i} className="text-[#FBAD17] text-sm" />
            ))}
          </div>
        </div>

        <div className="flex items-center gap-1 text-[#717171] mb-4 overflow-hidden">
          <span className="text-[14px] whitespace-nowrap">Hotel</span>
          <span className="text-[14px] ml-1 whitespace-nowrap">• {getDistanceText()}</span>
          <MdOutlineLocationOn className="ml-1 text-[16px] flex-shrink-0" />
          <p className="text-[14px] truncate">{safeDestination}</p>
          <p className="text-[14px] truncate">{starLabel}</p>
        </div>

        <div className="grid grid-cols-2 gap-y-2 gap-x-4 mb-4">
          {visibleBadges.map((badge, index) => (
            <div key={`${badge}-${index}`} className="flex items-center gap-2 text-[13px] text-[#555]">
              <span className="opacity-60">•</span> {badge}
            </div>
          ))}
          {remainingBadgeCount > 0 && (
            <div className="text-[13px] text-blue-500 cursor-pointer">+ {remainingBadgeCount} more</div>
          )}
        </div>

        <div className="mt-auto border-t pt-3 flex items-start gap-3">
          
          <div>
            <p className="font-semibold text-sm text-[#1A1A1A] capitalize">{roomLabel}</p>
            <p className="text-[12px] text-[#717171]">{roomDetails}</p>
          </div>
        </div>
      </div>

      {/* ✅ Fix: removed md:m-3 margin that caused overflow. Using p-3 internally instead */}
      <div className="w-full md:w-[140px] flex-shrink-0 bg-[#EBF3FF] flex flex-col items-center justify-center p-5 text-center gap-2 md:rounded-r-[15px] h-auto md:h-full box-border">
        <p className="text-[12px] text-[#717171]">Starts From</p>
        <div className="flex flex-col">
          <span className="text-[22px] font-bold text-[#1A1A1A]">
            {formatPrice(data?.current_price)}
          </span>
          <span className="text-[14px] text-[#717171] line-through">
            {formatPrice(data?.regular_price)}
          </span>
        </div>
        <p className="text-[11px] text-[#717171] mb-2">Per Night/Room</p>

        <Link
          href={`/hotel/${data?._id}`}
          className="bg-[#3583FE] text-white font-medium py-2 px-4 rounded-full text-[14px] flex items-center gap-2 hover:bg-[#2866cc] transition-all w-full justify-center truncate"
        >
          <span className="truncate">Details</span>
          <span className="text-[10px] ml-1">{">"}</span>
        </Link>
      </div>

    </div>
  );
};

export default HotelCard;