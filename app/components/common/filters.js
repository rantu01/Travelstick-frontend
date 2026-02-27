"use client";
import { Form, Rate, Slider, Select, Radio, Button } from "antd";
import FormCheckbox from "../form/checkbox";
import FormInput from "../form/input";
import { useI18n } from "@/app/contexts/i18n";
import { useFetch } from "@/app/helper/hooks";
import { getAllSidePublicPackages } from "@/app/helper/backend";
import { useCurrency } from "@/app/contexts/site";
import { useEffect, useState } from "react";
import { SearchOutlined } from "@ant-design/icons";

const Filters = ({ getData }) => {
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const { currency_symbol } = useCurrency();
  const [packageSideData, getPackageSideData] = useFetch(getAllSidePublicPackages);
  const [destinations, setDestinations] = useState([]);
  const [activities, setActivities] = useState([]);
  const [selectedReview, setSelectedReview] = useState(0);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [selectedActivities, setSelectedActivities] = useState([]);
  const i18n = useI18n();
  const { langCode } = useI18n();
  const [form] = Form.useForm();

  useEffect(() => {
    getPackageSideData();
  }, []);

  const reviewsAll = packageSideData?.find((item) => item.key === "reviews");

  useEffect(() => {
    if (!packageSideData) return;
    const destinationBlock = packageSideData?.find((item) => item.key === "destination");
    if (destinationBlock) setDestinations(destinationBlock.values || []);

    const activitiesBlock = packageSideData?.find((item) => item.key === "activities");
    if (activitiesBlock) setActivities(activitiesBlock.values || []);

    const reviewsBlock = packageSideData?.find((item) => item.key === "reviews");
    if (reviewsBlock) setSelectedReview("all");

    const priceBlock = packageSideData?.find((item) => item.key === "price");
    if (priceBlock?.values) {
      const min = priceBlock.values.min_price || 0;
      const max = priceBlock.values.max_price || 1000;
      setMinPrice(min);
      setMaxPrice(max);
      setPriceRange([min, max]);
    }
  }, [packageSideData]);

  const handleActivityChange = (value) => (e) => {
    const checked = e.target.checked;
    let updatedActivities;
    if (checked) {
      updatedActivities = [...selectedActivities, value];
    } else {
      updatedActivities = selectedActivities.filter((id) => id !== value);
    }
    setSelectedActivities(updatedActivities);
    getData({ activities: updatedActivities.join(",") });
  };

  const handleSliderChange = (value) => {
    const [min, max] = value;
    setPriceRange(value);
    getData({ maxPrice: max, minPrice: min });
  };

  const handleReset = () => {
    setPriceRange([minPrice, maxPrice]);
    setSelectedActivities([]);
    setSelectedReview("all");
    getData({
      maxPrice: null,
      minPrice: null,
      activities: null,
      destination: null,
      review: null,
      search: null,
    });
    form.resetFields();
  };

  const Reviews = [
    { rating: 5, rate: <Rate disabled value={5} className="text-[#FBBF24] text-[16px]" />, count: reviewsAll?.values?.five },
    { rating: 4, rate: <Rate disabled value={4} className="text-[#FBBF24] text-[16px]" />, count: reviewsAll?.values?.four },
    { rating: 3, rate: <Rate disabled value={3} className="text-[#FBBF24] text-[16px]" />, count: reviewsAll?.values?.three },
    { rating: 2, rate: <Rate disabled value={2} className="text-[#FBBF24] text-[16px]" />, count: reviewsAll?.values?.two },
    { rating: 1, rate: <Rate disabled value={1} className="text-[#FBBF24] text-[16px]" />, count: reviewsAll?.values?.one },
  ];

  return (
    <div className="flex flex-col gap-4 border border-[#E8EAE8] rounded-[10px] lg:rounded-[20px] xl:p-6 lg:p-5 md:p-4 p-3 bg-white">
      {/* Price Range Section - Image UI Match */}
      <div>
        <h4 className="text-[#05073C] font-bold text-lg mb-4">{i18n.t("Price Range")}</h4>
        <div className="flex justify-between items-center mb-2">
          <span className="text-[#1a4fa0] font-semibold text-sm">
            {currency_symbol} {priceRange[0].toLocaleString()}
          </span>
          <span className="text-[#1a4fa0] font-semibold text-sm">
            {currency_symbol} {priceRange[1].toLocaleString()}
          </span>
        </div>
        <div className="package-slider px-1">
          <Slider
            range
            min={minPrice}
            max={maxPrice}
            value={priceRange}
            onChange={handleSliderChange}
            trackStyle={[{ backgroundColor: "#D17A7A" }]}
            handleStyle={[
              { backgroundColor: "#D17A7A", borderColor: "#D17A7A" },
              { backgroundColor: "#D17A7A", borderColor: "#D17A7A" },
            ]}
          />
        </div>
        <div className="flex justify-between text-[10px] text-gray-400 mt-1 uppercase font-bold tracking-tighter">
          <span>Min Price</span>
          <span>Max Price</span>
        </div>
      </div>

      <hr className="border-[#E8EAE8]" />

      {/* Search Package Section - Image UI Match */}
      <div>
        <h4 className="text-[#05073C] font-bold text-lg mb-3">{i18n.t("Search Package")}</h4>
        <FormInput
          placeholder={i18n.t("Search package...")}
          suffix={<SearchOutlined className="text-gray-400" />}
          onChange={(e) => getData({ search: e.target.value })}
          className="rounded-xl border-[#E8EAE8] py-2"
        />
      </div>

      <hr className="border-[#E8EAE8]" />

      {/* Duration Section - Image UI Match */}
      <div>
        <h4 className="text-[#05073C] font-bold text-lg mb-3">{i18n.t("Duration")}</h4>
        <Select
          placeholder="Select duration"
          className="w-full rounded-xl"
          size="large"
          onChange={(value) => getData({ duration: value })}
          options={[
            { value: "1-3", label: "1-3 Days" },
            { value: "4-7", label: "4-7 Days" },
            { value: "8-12", label: "8-12 Days" },
          ]}
        />
      </div>

      <hr className="border-[#E8EAE8]" />

      {/* Airfare Section - Image UI Match */}
      <div>
        <h4 className="text-[#05073C] font-bold text-lg mb-3">{i18n.t("Airfare")}</h4>
        <Radio.Group className="flex flex-col gap-3">
          <Radio value="with" className="text-[#05073C] font-medium">With Airfare</Radio>
          <Radio value="without" className="text-[#05073C] font-medium">Without Airfare</Radio>
        </Radio.Group>
      </div>

      <hr className="border-[#E8EAE8]" />

      {/* --- Existing Dynamic Filters Below --- */}

      {/* Destination (Dynamic) */}
      <div>
        <h4 className="description-2 text-[#05073C] !font-bold border-b border-[#E8EAE8] pb-2 mb-4">
          {i18n.t("Destination")}
        </h4>
        <Radio.Group
          className="w-full flex flex-col gap-2"
          defaultValue="all"
          onChange={(e) => getData({ destination: e.target.value === "all" ? null : e.target.value })}
        >
          <div className="flex justify-between items-center py-1">
            <Radio value="all" className="text-sm font-medium text-[#05073C]">All</Radio>
          </div>
          {destinations?.map((item) => (
            <div key={item?._id} className="flex justify-between items-center py-1">
              <Radio value={item?._id} className="text-sm font-medium text-[#05073C]">{item?.name}</Radio>
              <div className="w-6 h-6 flex justify-center items-center rounded-full bg-[#E8EAE8] text-[12px] font-medium">
                {item?.count}
              </div>
            </div>
          ))}
        </Radio.Group>
      </div>

      {/* Activities (Dynamic) */}
      <div>
        <h4 className="description-2 text-[#05073C] !font-bold border-b border-[#E8EAE8] pb-2 mb-4">
          {i18n.t("Activities")}
        </h4>
        <div className="flex flex-col gap-3">
          {activities?.map((item) => (
            <div key={item._id} className="flex justify-between items-center">
              <FormCheckbox
                name={item.name?.[langCode]}
                label={item.name?.[langCode]}
                onChange={handleActivityChange(item?._id)}
              />
              <div className="w-6 h-6 flex justify-center items-center rounded-full bg-[#E8EAE8] text-[12px] font-medium">
                {item.count}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews (Dynamic) */}
      <div>
        <h4 className="description-2 text-[#05073C] !font-bold border-b border-[#E8EAE8] pb-2 mb-4">
          {i18n.t("Reviews")}
        </h4>
        <Radio.Group 
          className="w-full flex flex-col gap-3"
          value={selectedReview}
          onChange={(e) => {
            setSelectedReview(e.target.value);
            getData({ review: e.target.value === "all" ? null : e.target.value });
          }}
        >
          <div className="flex justify-between items-center">
            <Radio value="all" className="text-sm font-medium text-[#05073C]">All</Radio>
            <div className="px-2 py-0.5 rounded-full bg-[#E8EAE8] text-[12px] font-medium">All</div>
          </div>
          {Reviews.map((item, index) => (
            <div key={index} className="flex justify-between items-center">
              <Radio value={item.rating}>{item.rate}</Radio>
              <div className="w-6 h-6 flex justify-center items-center rounded-full bg-[#E8EAE8] text-[12px] font-medium">
                {item.count}
              </div>
            </div>
          ))}
        </Radio.Group>
      </div>

      {/* Reset Button - Image UI Match */}
      <div className="mt-4">
        <Button 
          onClick={handleReset}
          className="w-full py-6 rounded-xl border-[#E8EAE8] text-gray-500 font-bold text-base hover:bg-gray-50"
        >
          Reset Filters
        </Button>
      </div>
    </div>
  );
};

export default Filters;