"use client";
import { Form, Rate, Slider, Checkbox, Radio } from "antd";
import { useI18n } from "@/app/contexts/i18n";
import FormInput from "../form/input";
import { useCurrency } from "@/app/contexts/site";
import { useFetch } from "@/app/helper/hooks";
import { getAllSidePublicHotel } from "@/app/helper/backend";
import { useEffect, useState } from "react";

const HotelFilters = ({ getData }) => {
  const { formatPrice } = useCurrency();
  const [packageSideData, getPackageSideData] = useFetch(getAllSidePublicHotel);
  const [destinations, setDestinations] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [hotelTypes, setHotelTypes] = useState([]);
  const [selectedReview, setSelectedReview] = useState("all");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000);
  const i18n = useI18n();
  const [form] = Form.useForm();
  const [priceRange, setPriceRange] = useState([0, 1000]);

  useEffect(() => {
    getPackageSideData();
  }, []);

  const reviewsAll = packageSideData?.find((item) => item.key === "reviews");

  useEffect(() => {
    if (!packageSideData) return;

    const destinationBlock = packageSideData?.find((item) => item.key === "destination");
    if (destinationBlock) setDestinations(destinationBlock.values || []);

    const roomTypeBlock = packageSideData?.find((item) => item.key === "room_type");
    if (roomTypeBlock) setRoomTypes(roomTypeBlock.values || []);

    const hotelTypeBlock = packageSideData?.find((item) => item.key === "hotel_type");
    if (hotelTypeBlock) setHotelTypes(hotelTypeBlock.values || []);

    const priceBlock = packageSideData?.find((item) => item.key === "price");
    if (priceBlock?.values) {
      const min = priceBlock.values.min_price || 0;
      const max = priceBlock.values.max_price || 1000;
      setMinPrice(min);
      setMaxPrice(max);
      setPriceRange([min, max]);
    }
  }, [packageSideData]);

  const marks = {
    [minPrice]: { style: { color: "#05073C" }, label: <strong>{formatPrice(minPrice)}</strong> },
    [maxPrice]: { style: { color: "#05073C" }, label: <strong>{formatPrice(maxPrice)}</strong> },
  };

  const handleSliderChange = (value) => {
    const [min, max] = value;
    setPriceRange(value);
    getData({ maxPrice: max, minPrice: min });
  };

  const Reviews = [
    { rating: 5, rate: <Rate disabled value={5} className="text-[#FBBF24] text-[16px]" />, count: reviewsAll?.values?.five },
    { rating: 4, rate: <Rate disabled value={4} className="text-[#FBBF24] text-[16px]" />, count: reviewsAll?.values?.four },
    { rating: 3, rate: <Rate disabled value={3} className="text-[#FBBF24] text-[16px]" />, count: reviewsAll?.values?.three },
  ];

  const sectionStyle = "xl:mt-6 lg:mt-5 mt-4 border border-[#E8EAE8] rounded-[10px] lg:rounded-[20px] xl:p-6 lg:p-5 md:p-4 p-3";
  const titleStyle = "description-2 text-[#05073C] !font-bold border-b border-[#E8EAE8] pb-2 mb-4 flex justify-between items-center";

  return (
    <div className="flex flex-col gap-1">
      {/* Search Hotel */}


      {/* Price per Night - Image Mockup style */}


      {/* Existing Dynamic Price Filter */}
      <div className={sectionStyle}>
        <h4 className={titleStyle}>{i18n.t("Price Filter (Range)")}</h4>
        <div className="package-slider px-2">
          <Slider range min={minPrice} max={maxPrice} marks={marks} value={priceRange} onChange={handleSliderChange} />
        </div>
      </div>

      {/* Distance from City Center - Image Mockup */}
      <div className={sectionStyle}>
        <h4 className={titleStyle}>{i18n.t("Distance from City C...")} <span className="text-[10px]">▲</span></h4>
        <Radio.Group className="flex flex-col gap-3 w-full">
          {["< 6 km", "< 12 km", "< 18 km", "< 24 km", "< 27 km"].map((dist) => (
            <Radio key={dist} value={dist} className="text-[#05073C] font-medium w-full py-1 px-2 rounded hover:bg-gray-50">
              {dist}
            </Radio>
          ))}
        </Radio.Group>
      </div>

      {/* Star Category - Image Mockup */}
      <div className={sectionStyle}>
        <h4 className={titleStyle}>{i18n.t("Star Category")} <span className="text-[10px]">▲</span></h4>
        <div className="flex gap-2 mt-2">
          {[3, 4, 5].map((star) => (
            <div key={star} className="border border-[#E8EAE8] px-4 py-1 rounded-md flex items-center gap-1 cursor-pointer hover:bg-gray-50">
              <span className="font-bold text-[#05073C]">{star}</span>
              <span className="text-gray-400">★</span>
            </div>
          ))}
        </div>
      </div>

      {/* Meal Plans - Updated */}
      <div className={sectionStyle}>
        <h4 className={titleStyle}>{i18n.t("Meal Plans")} <span className="text-[10px]">▲</span></h4>
        <div className="flex flex-col gap-3">

          {/* Bed & Breakfast (BB) */}
          <div className="flex justify-between w-full">
            <Checkbox className="text-[#05073C] font-medium">{i18n.t("Bed & Breakfast (BB)")}</Checkbox>
            <span className="text-gray-400 text-xs">(11)</span>
          </div>

          {/* Half Board (HB) */}
          <div className="flex justify-between w-full">
            <Checkbox className="text-[#05073C] font-medium">{i18n.t("Half Board (HB)")}</Checkbox>
            <span className="text-gray-400 text-xs">(8)</span>
          </div>

          {/* Room Only / Only Bed */}
          <div className="flex justify-between w-full">
            <Checkbox className="text-[#05073C] font-medium">{i18n.t("Room Only (RO)")}</Checkbox>
            <span className="text-gray-400 text-xs">(4)</span>
          </div>

        </div>
      </div>

      {/* Neighborhood / Area Section */}
      <div className={sectionStyle}>
        <div className="flex items-center justify-between mb-3">
          <h4 className={titleStyle}>{i18n.t("Neighborhood")}</h4>
          {/* Optional: Add Arrow icon here if needed */}
        </div>

        <div className="flex flex-col gap-3">
          {[
            { label: "Sukhumvit", count: 1085 },
            { label: "Guests' favorite area", count: 856 },
            { label: "Downtown Bangkok", count: 570 },
            { label: "Bangkok Old Town", count: 558 },
            { label: "Wattana", count: 552 },
            { label: "Best areas outside center", count: 411 },
            { label: "Khlong Toei", count: 403 },
            { label: "Khaosan", count: 308 },
            { label: "Embassy District", count: 284 },
            { label: "Nana", count: 257 },
          ].map((item, index) => (
            <div key={index} className="flex justify-between items-center w-full">
              <Checkbox className="text-[#05073C] font-normal text-sm">
                {i18n.t(item.label)}
              </Checkbox>
              <span className="text-gray-500 text-xs">{item.count}</span>
            </div>
          ))}
        </div>

        {/* Show All Button */}
        <button className="flex items-center gap-1 text-blue-600 text-sm mt-4 hover:underline">
          {i18n.t("Show all 25")}
          <span className="text-[10px]">▼</span>
        </button>
      </div>

      {/* Reservation Policy Section */}
      <div className={sectionStyle}>
        <h4 className={titleStyle}>{i18n.t("Reservation policy")}</h4>
        <div className="flex flex-col gap-3">
          {[
            { label: "Free cancellation", count: 331 },
            { label: "Book without credit card", count: 260 },
            { label: "No prepayment", count: 307 },
          ].map((item, index) => (
            <div key={index} className="flex justify-between items-center w-full">
              <Checkbox className="text-[#05073C] font-normal text-sm">
                {i18n.t(item.label)}
              </Checkbox>
              <span className="text-gray-500 text-xs">{item.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Refundability - Image Mockup */}
      <div className={sectionStyle}>
        <h4 className={titleStyle}>{i18n.t("Refundability")} <span className="text-[10px]">▲</span></h4>
        <div className="flex justify-between w-full">
          <Radio className="text-[#05073C] font-medium">Non Refundable</Radio>
          <span className="text-gray-400 text-xs">(15)</span>
        </div>
      </div>

      {/* Hotel Type (Dynamic) */}
      <div className={sectionStyle}>
        <h4 className={titleStyle}>{i18n.t("Hotel Type")}</h4>
        <div className="flex flex-col gap-2">
          <Radio.Group onChange={(e) => getData({ hotel_type: e.target.value === "all" ? null : e.target.value })} defaultValue="all" className="w-full">
            <div className="flex justify-between items-center mb-3">
              <Radio value="all" className="text-sm font-medium text-[#05073C]">All</Radio>
            </div>
            {hotelTypes?.map((item, index) => (
              <div key={index} className="flex justify-between items-center mb-3">
                <Radio value={item.name} className="text-sm font-medium text-[#05073C] capitalize">{item.name}</Radio>
                <div className="w-6 h-6 flex justify-center items-center rounded-full bg-[#E8EAE8]">
                  <p className="text-[#05073C] text-[12px] font-medium">{item.count}</p>
                </div>
              </div>
            ))}
          </Radio.Group>
        </div>
      </div>

      {/* Facilities and Services - Image Mockup */}
      <div className={sectionStyle}>
        <h4 className={titleStyle}>{i18n.t("Facilities and Services")} <span className="text-[10px]">▲</span></h4>
        <div className="flex flex-col gap-3">
          {["Air conditioning", "Television in lobby", "Reception desk", "Security guard", "24-hour reception"].map((faci) => (
            <Checkbox key={faci} className="text-[#05073C] font-medium">{faci}</Checkbox>
          ))}
          <p className="text-primary text-xs cursor-pointer font-medium mt-1">Show 23 More</p>
        </div>
      </div>

      {/* Location (Dynamic) */}
      <div className={sectionStyle}>
        <h4 className={titleStyle}>{i18n.t("Hotel Location")}</h4>
        <Radio.Group onChange={(e) => getData({ destination: e.target.value === "all" ? null : e.target.value })} defaultValue="all" className="w-full">
          <div className="mb-3"><Radio value="all">All</Radio></div>
          {destinations.map((item, index) => (
            <div key={index} className="flex justify-between items-center mb-3">
              <Radio value={item._id} className="text-sm font-medium text-[#05073C]">{item.name}</Radio>
              <div className="w-6 h-6 flex justify-center items-center rounded-full bg-[#E8EAE8]">
                <p className="text-[#05073C] text-[12px] font-medium">{item.count}</p>
              </div>
            </div>
          ))}
        </Radio.Group>
      </div>

      {/* Reviews (Dynamic) */}
      <div className={sectionStyle}>
        <h4 className={titleStyle}>{i18n.t("Reviews")}</h4>
        <Radio.Group value={selectedReview} onChange={(e) => { setSelectedReview(e.target.value); getData({ review: e.target.value === "all" ? null : e.target.value }); }} className="w-full">
          <div className="flex justify-between items-center mb-3">
            <Radio value="all">All</Radio>
            <div className="w-10 h-6 flex justify-center items-center rounded-full bg-[#E8EAE8]">
              <p className="text-[#05073C] text-[12px] font-medium">All</p>
            </div>
          </div>
          {Reviews.map((item, index) => (
            <div key={index} className="flex justify-between items-center mb-3">
              <Radio value={item.rating}>{item.rate}</Radio>
              <div className="w-6 h-6 flex justify-center items-center rounded-full bg-[#E8EAE8]">
                <p className="text-[#05073C] text-[12px] font-medium">{item.count}</p>
              </div>
            </div>
          ))}
        </Radio.Group>
      </div>
    </div>
  );
};

export default HotelFilters;