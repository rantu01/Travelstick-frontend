"use client";
import { Form, Rate, Slider } from "antd";
import { useI18n } from "@/app/contexts/i18n";
import FormInput from "../form/input";
import { useCurrency } from "@/app/contexts/site";
import { useFetch } from "@/app/helper/hooks";
import { getAllSidePublicHotel } from "@/app/helper/backend";
import { useEffect, useState } from "react";
const HotelFilters = ({ getData }) => {
  const { currency_symbol } = useCurrency();
  const [packageSideData, getPackageSideData] = useFetch(
    getAllSidePublicHotel
  );
  const [destinations, setDestinations] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [hotelTypes, setHotelTypes] = useState([]);
  const [selectedReview, setSelectedReview] = useState("all");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000);
  const i18n = useI18n();
  const form = Form.useFormInstance();
  const [priceRange, setPriceRange] = useState([0, 1000]);
  useEffect(() => {
    getPackageSideData();
  }, []);
  const reviewsAll = packageSideData?.find((item) => item.key === "reviews");
  useEffect(() => {
    if (!packageSideData) return;

    const destinationBlock = packageSideData?.find(
      (item) => item.key === "destination"
    );
    if (destinationBlock) {
      setDestinations(destinationBlock.values || []);
    }

    const roomTypeBlock = packageSideData?.find(
      (item) => item.key === "room_type"
    );
    if (roomTypeBlock) {
      setRoomTypes(roomTypeBlock.values || []);
    }

    const hotelTypeBlock = packageSideData?.find(
      (item) => item.key === "hotel_type"
    );
    if (hotelTypeBlock) {
      setHotelTypes(hotelTypeBlock.values || []);
    }

    const reviewsBlock = packageSideData?.find(
      (item) => item.key === "reviews"
    );
    if (reviewsBlock) {
      setSelectedReview("all");
    }

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
    [minPrice]: {
      style: { color: "#05073C" },
      label: (
        <strong>
          {currency_symbol}
          {minPrice}
        </strong>
      ),
    },
    [maxPrice]: {
      style: { color: "#05073C" },
      label: (
        <strong>
          {currency_symbol}
          {maxPrice}
        </strong>
      ),
    },
  };

  const handleSliderChange = (value) => {
    const [min, max] = value;
    setPriceRange(value); 
    getData({ maxPrice: max, minPrice: min });
  };

  const Reviews = [
    {
      rating: 5,
      rate: <Rate disabled value={5} className="text-[#FBBF24] text-[16px]" />,
      count: reviewsAll?.values?.five,
    },
    {
      rating: 4,
      rate: <Rate disabled value={4} className="text-[#FBBF24] text-[16px]" />,
      count: reviewsAll?.values?.four,
    },
    {
      rating: 3,
      rate: <Rate disabled value={3} className="text-[#FBBF24] text-[16px]" />,
      count: reviewsAll?.values?.three,
    },
    {
      rating: 2,
      rate: <Rate disabled value={2} className="text-[#FBBF24] text-[16px]" />,
      count: reviewsAll?.values?.two,
    },
    {
      rating: 1,
      rate: <Rate disabled value={1} className="text-[#FBBF24] text-[16px]" />,
      count: reviewsAll?.values?.one,
    },
  ];
  return (
    <div>
      {/* Search */}
      <div className="border border-[#E8EAE8] rounded-[10px] lg:rounded-[20px] xl:p-6 lg:p-5 md:p-4 p-3">
        <h4 className="description-2 text-[#05073C] !font-bold border-b border-[#E8EAE8] pb-2">{i18n.t("Search Hotel")}</h4>
        <div className="xl:mt-6 lg:mt-5 mt-4 package-slider">
          <Form layout="vertical" form={form}>
            <FormInput
              placeholder={i18n.t("Type Hotel Name")}
              type="text"
              onChange={(e) => getData({ search: e.target.value })}
              className={"focus:outline-primary w-full border border-[#E8EAE8] rounded-[10px] lg:rounded-[20px] xl:p-5 lg:p-4 p-3"}
            />
          </Form>
        </div>
      </div>

      {/* Price Range */}
      <div className="xl:mt-6 lg:mt-5 mt-4 border border-[#E8EAE8] rounded-[10px] lg:rounded-[20px] xl:p-6 lg:p-5 md:p-4 p-3">
        <h4 className="description-2 text-[#05073C] !font-bold border-b border-[#E8EAE8] pb-2">{i18n.t("Price Filter")}</h4>
        <div className="xl:mt-6 lg:mt-5 mt-4 package-slider">
          <Slider
            onChange={handleSliderChange}
            range
            min={minPrice}
            max={maxPrice}
            marks={marks}
            value={priceRange}
          />
        </div>
      </div>

      {/* Hotel Type */}
      <div className="xl:mt-6 lg:mt-5 mt-4 border border-[#E8EAE8] rounded-[10px] lg:rounded-[20px] xl:p-6 lg:p-5 md:p-4 p-3">
        <h4 className="description-2 text-[#05073C] !font-bold border-b border-[#E8EAE8] pb-2">{i18n.t("Hotel Type")}</h4>
        <Form form={form}>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center package xl:mt-5 lg:mt-4 mt-3">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="hotel_type"
                  value="all"
                  defaultChecked
                  onChange={() => getData({ hotel_type: null })}
                  className="w-4 h-4 appearance-none rounded-full border-[1px] border-gray-300 checked:bg-primary checked:border-primary cursor-pointer"
                />
                <span className="text-sm font-medium text-[#05073C]">
                  All
                </span>
              </label>
            </div>

            {hotelTypes?.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center package xl:mt-5 lg:mt-4 mt-3"
              >
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="hotel_type"
                    value={item.name}
                    onChange={() => getData({ hotel_type: item.name })}
                    className="w-4 h-4 appearance-none rounded-full border-[1px] border-gray-300 checked:bg-primary checked:border-primary cursor-pointer"
                  />
                  <span className="text-sm font-medium text-[#05073C] capitalize">
                    {item.name}
                  </span>
                </label>
                <div className="w-6 h-6 flex justify-center items-center rounded-full bg-[#E8EAE8]">
                  <p className="text-[#05073C] text-[12px] font-medium">
                    {item.count}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Form>
      </div>

      {/* Room Type */}
      <div className="xl:mt-6 lg:mt-5 mt-4 border border-[#E8EAE8] rounded-[10px] lg:rounded-[20px] xl:p-6 lg:p-5 md:p-4 p-3">
        <h4 className="description-2 text-[#05073C] !font-bold border-b border-[#E8EAE8] pb-2">{i18n.t("Room Type")}</h4>
        <Form form={form}>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center package xl:mt-5 lg:mt-4 mt-3">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="room_type"
                  value="all"
                  defaultChecked
                  onChange={() => getData({ room_type: null })}
                  className="w-4 h-4 appearance-none rounded-full border-[1px] border-gray-300 checked:bg-primary checked:border-primary cursor-pointer"
                />
                <span className="text-sm font-medium text-[#05073C]">
                  All
                </span>
              </label>
            </div>

            {roomTypes.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center package xl:mt-5 lg:mt-4 mt-3"
              >
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="room_type"
                    value={item.name}
                    onChange={() => getData({ room_type: item.name })}
                    className="w-4 h-4 appearance-none rounded-full border-[1px] border-gray-300 checked:bg-primary checked:border-primary cursor-pointer"
                  />
                  <span className="text-sm font-medium text-[#05073C] capitalize">
                    {item.name}
                  </span>
                </label>
                <div className="w-6 h-6 flex justify-center items-center rounded-full bg-[#E8EAE8]">
                  <p className="text-[#05073C] text-[12px] font-medium">
                    {item.count}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Form>
      </div>

      {/* Location */}
      <div className="xl:mt-6 lg:mt-5 mt-4 border border-[#E8EAE8] rounded-[10px] lg:rounded-[20px] xl:p-6 lg:p-5 md:p-4 p-3">
        <h4 className="description-2 text-[#05073C] !font-bold border-b border-[#E8EAE8] pb-2">{i18n.t("Hotel Location")}</h4>
        <div className="xl:mt-6 lg:mt-5 mt-4">
          <Form form={form}>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center package xl:mt-5 lg:mt-4 mt-3">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="destination"
                    value="all"
                    defaultChecked
                    onChange={() => getData({ destination: null })}
                    className="w-4 h-4 appearance-none rounded-full border-[1px] border-gray-300 checked:bg-primary checked:border-primary cursor-pointer"
                  />
                  <span className="text-sm font-medium text-[#05073C]">
                    All
                  </span>
                </label>
              </div>

              {destinations.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center package xl:mt-5 lg:mt-4 mt-3"
                >
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="destination"
                      value={item._id}
                      onChange={() => getData({ destination: item._id })}
                      className="w-4 h-4 appearance-none rounded-full border-[1px] border-gray-300 checked:bg-primary checked:border-primary cursor-pointer"
                    />
                    <span className="text-sm font-medium text-[#05073C]">
                      {item.name}
                    </span>
                  </label>
                  <div className="w-6 h-6 flex justify-center items-center rounded-full bg-[#E8EAE8]">
                    <p className="text-[#05073C] text-[12px] font-medium">
                      {item.count}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Form>
        </div>
      </div>

      {/* Reviews */}
      <div className="xl:mt-6 lg:mt-5 mt-4 border border-[#E8EAE8] rounded-[10px] lg:rounded-[20px] xl:p-6 lg:p-5 md:p-4 p-3">
        <h4 className="description-2 text-[#05073C] !font-bold border-b border-[#E8EAE8] pb-2">{i18n.t("Reviews")}</h4>
        <div className="xl:mt-6 lg:mt-5 mt-4">
          <Form form={form}>
            <div className="xl:mt-6 lg:mt-5 mt-4">
              {/* "All" Option */}
              <div className="flex justify-between items-center package xl:mt-5 lg:mt-4 mt-3">
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="reviews"
                    value="all"
                    defaultChecked={selectedReview === "all"}
                    checked={selectedReview === "all"}
                    onChange={() => {
                      setSelectedReview("all");
                      getData({ review: null });
                    }}
                    className="w-4 h-4 appearance-none rounded-full border-[1px] border-gray-300 checked:bg-primary checked:border-primary cursor-pointer"
                  />
                  <label className="text-sm font-medium text-[#05073C]">
                    All
                  </label>
                </div>
                <div className="w-6 h-6 flex justify-center items-center rounded-full bg-[#E8EAE8]">
                  <p className="text-[#05073C] text-[12px] font-medium">All</p>
                </div>
              </div>

              {Reviews.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center package xl:mt-5 lg:mt-4 mt-3"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="review"
                      value={item.rating}
                      onChange={() => {
                        setSelectedReview(item.rating);
                        getData({ review: item.rating });
                      }}
                      checked={selectedReview === item.rating}
                      className="w-4 h-4 appearance-none rounded-full border-[1px] border-gray-300 checked:bg-primary checked:border-primary cursor-pointer"
                    />
                    <label className="text-sm font-medium text-primary">
                      {item.rate}
                    </label>
                  </div>
                  <div className="w-6 h-6 flex justify-center items-center rounded-full bg-[#E8EAE8]">
                    <p className="text-[#05073C] text-[12px] font-medium">
                      {item.count}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default HotelFilters;