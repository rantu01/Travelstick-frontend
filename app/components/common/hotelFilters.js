"use client";
import { Rate, Slider, Checkbox, Radio } from "antd";
import { useI18n } from "@/app/contexts/i18n";
import { useCurrency } from "@/app/contexts/site";
import { useFetch } from "@/app/helper/hooks";
import { getAllSidePublicHotel } from "@/app/helper/backend";
import { useEffect, useMemo, useState } from "react";

const HotelFilters = ({ getData }) => {
  const { formatPrice } = useCurrency();
  const [sidebarData, getSidebarData] = useFetch(getAllSidePublicHotel);
  const i18n = useI18n();

  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000);

  const [filters, setFilters] = useState({
    minPrice: undefined,
    maxPrice: undefined,
    destination: undefined,
    hotel_type: undefined,
    star: [],
    review: undefined,
    maxDistance: undefined,
    meal_plans: [],
    neighborhood: [],
    reservation_policies: [],
    refundability: undefined,
    facilities_services: [],
  });

  useEffect(() => {
    getSidebarData();
  }, []);

  const sidebarMap = useMemo(() => {
    const map = {};
    (sidebarData || []).forEach((item) => {
      map[item.key] = item.values;
    });
    return map;
  }, [sidebarData]);

  useEffect(() => {
    const priceBlock = sidebarMap.price;
    if (priceBlock) {
      const min = Number(priceBlock.min_price || 0);
      const max = Number(priceBlock.max_price || 1000);
      setMinPrice(min);
      setMaxPrice(max);
      setFilters((prev) => ({
        ...prev,
        minPrice: prev.minPrice ?? min,
        maxPrice: prev.maxPrice ?? max,
      }));
    }
  }, [sidebarMap]);

  const applyFilters = (nextFilters) => {
    const toCsv = (values) => (Array.isArray(values) && values.length ? values.join(",") : undefined);

    getData({
      minPrice: nextFilters.minPrice,
      maxPrice: nextFilters.maxPrice,
      destination: nextFilters.destination,
      hotel_type: nextFilters.hotel_type,
      star: toCsv(nextFilters.star),
      review: nextFilters.review,
      maxDistance: nextFilters.maxDistance,
      meal_plans: toCsv(nextFilters.meal_plans),
      neighborhood: toCsv(nextFilters.neighborhood),
      reservation_policies: toCsv(nextFilters.reservation_policies),
      refundability: nextFilters.refundability,
      facilities_services: toCsv(nextFilters.facilities_services),
    });
  };

  const updateFilters = (patch) => {
    setFilters((prev) => {
      const next = { ...prev, ...patch };
      applyFilters(next);
      return next;
    });
  };

  const marks = {
    [minPrice]: {
      style: { color: "#05073C" },
      label: <strong>{formatPrice(minPrice)}</strong>,
    },
    [maxPrice]: {
      style: { color: "#05073C" },
      label: <strong>{formatPrice(maxPrice)}</strong>,
    },
  };

  const reviewsAll = sidebarMap.reviews || {};
  const reviews = [
    {
      rating: 5,
      rate: <Rate disabled value={5} className="text-[#FBBF24] text-[16px]" />,
      count: reviewsAll?.five || 0,
    },
    {
      rating: 4,
      rate: <Rate disabled value={4} className="text-[#FBBF24] text-[16px]" />,
      count: reviewsAll?.four || 0,
    },
    {
      rating: 3,
      rate: <Rate disabled value={3} className="text-[#FBBF24] text-[16px]" />,
      count: reviewsAll?.three || 0,
    },
  ];

  const sectionStyle =
    "xl:mt-6 lg:mt-5 mt-4 border border-[#E8EAE8] rounded-[10px] lg:rounded-[20px] xl:p-6 lg:p-5 md:p-4 p-3";
  const titleStyle =
    "description-2 text-[#05073C] !font-bold border-b border-[#E8EAE8] pb-2 mb-4 flex justify-between items-center";

  const getDisplayLabel = (value, fallback = "Unknown") => {
    if (!value) return fallback;
    if (typeof value === "string" || typeof value === "number") {
      return String(value);
    }
    if (typeof value === "object") {
      if (typeof value.name === "string") return value.name;
      if (typeof value?.name?.[i18n?.langCode] === "string") return value.name[i18n.langCode];
      if (typeof value?.name?.en === "string") return value.name.en;
      const firstValue = Object.values(value).find((item) => typeof item === "string");
      if (typeof firstValue === "string") return firstValue;
    }
    return fallback;
  };

  const distanceRange = sidebarMap.distance_from_city || {};
  const maxDistance = Number(distanceRange.max_distance || 0);
  const distanceOptions = maxDistance
    ? [...new Set([6, 12, 18, 24, 27, maxDistance].filter((item) => item <= maxDistance).concat(maxDistance))].sort((a, b) => a - b)
    : [6, 12, 18, 24, 27];

  const starOptions = (sidebarMap.star_category || []).length
    ? sidebarMap.star_category
    : [3, 4, 5].map((value) => ({ name: value, count: 0 }));

  return (
    <div className="flex flex-col gap-1">
      <div className={sectionStyle}>
        <h4 className={titleStyle}>{i18n.t("Price Filter (Range)")}</h4>
        <div className="package-slider px-2">
          <Slider
            range
            min={minPrice}
            max={maxPrice}
            marks={marks}
            value={[filters.minPrice ?? minPrice, filters.maxPrice ?? maxPrice]}
            onChange={(value) => {
              const [min, max] = value;
              updateFilters({ minPrice: min, maxPrice: max });
            }}
          />
        </div>
      </div>

      <div className={sectionStyle}>
        <h4 className={titleStyle}>
          {i18n.t("Distance from City C...")} <span className="text-[10px]">▲</span>
        </h4>
        <Radio.Group
          className="flex flex-col gap-3 w-full"
          value={filters.maxDistance ?? "all"}
          onChange={(e) => updateFilters({ maxDistance: e.target.value === "all" ? undefined : e.target.value })}
        >
          <Radio value="all" className="text-[#05073C] font-medium w-full py-1 px-2 rounded hover:bg-gray-50">
            All
          </Radio>
          {distanceOptions.map((distance) => (
            <Radio
              key={distance}
              value={distance}
              className="text-[#05073C] font-medium w-full py-1 px-2 rounded hover:bg-gray-50"
            >
              {`< ${distance} km`}
            </Radio>
          ))}
        </Radio.Group>
      </div>

      <div className={sectionStyle}>
        <h4 className={titleStyle}>
          {i18n.t("Star Category")} <span className="text-[10px]">▲</span>
        </h4>
        <Checkbox.Group
          value={filters.star}
          onChange={(values) => updateFilters({ star: values })}
          className="flex gap-2 mt-2 flex-wrap"
        >
          {starOptions.map((item) => (
            <Checkbox
              key={String(item.name)}
              value={Number(item.name)}
              className="border border-[#E8EAE8] px-4 py-1 rounded-md flex items-center gap-1 hover:bg-gray-50"
            >
              <span className="font-bold text-[#05073C]">{item.name}</span>
              <span className="text-gray-400">★</span>
            </Checkbox>
          ))}
        </Checkbox.Group>
      </div>

      <div className={sectionStyle}>
        <h4 className={titleStyle}>{i18n.t("Meal Plans")} <span className="text-[10px]">▲</span></h4>
        <Checkbox.Group
          value={filters.meal_plans}
          onChange={(values) => updateFilters({ meal_plans: values })}
          className="flex flex-col gap-3 w-full"
        >
          {(sidebarMap.meal_plans || []).map((item, index) => (
            <div key={`${item.name}-${index}`} className="flex justify-between items-center w-full">
              <Checkbox value={item.name} className="text-[#05073C] font-medium">{i18n.t(item.name)}</Checkbox>
              <span className="text-gray-400 text-xs">({item.count || 0})</span>
            </div>
          ))}
        </Checkbox.Group>
      </div>

      <div className={sectionStyle}>
        <h4 className={titleStyle}>{i18n.t("Neighborhood")}</h4>
        <Checkbox.Group
          value={filters.neighborhood}
          onChange={(values) => updateFilters({ neighborhood: values })}
          className="flex flex-col gap-3 w-full"
        >
          {(sidebarMap.neighborhood || []).map((item, index) => (
            <div key={`${item.name}-${index}`} className="flex justify-between items-center w-full">
              <Checkbox value={item.name} className="text-[#05073C] font-normal text-sm">
                {i18n.t(item.name)}
              </Checkbox>
              <span className="text-gray-500 text-xs">{item.count || 0}</span>
            </div>
          ))}
        </Checkbox.Group>
      </div>

      <div className={sectionStyle}>
        <h4 className={titleStyle}>{i18n.t("Reservation policy")}</h4>
        <Checkbox.Group
          value={filters.reservation_policies}
          onChange={(values) => updateFilters({ reservation_policies: values })}
          className="flex flex-col gap-3 w-full"
        >
          {(sidebarMap.reservation_policies || []).map((item, index) => (
            <div key={`${item.name}-${index}`} className="flex justify-between items-center w-full">
              <Checkbox value={item.name} className="text-[#05073C] font-normal text-sm">
                {i18n.t(item.name)}
              </Checkbox>
              <span className="text-gray-500 text-xs">{item.count || 0}</span>
            </div>
          ))}
        </Checkbox.Group>
      </div>

      <div className={sectionStyle}>
        <h4 className={titleStyle}>{i18n.t("Refundability")} <span className="text-[10px]">▲</span></h4>
        <Radio.Group
          value={filters.refundability ?? "all"}
          onChange={(e) => updateFilters({ refundability: e.target.value === "all" ? undefined : e.target.value })}
          className="flex flex-col gap-2"
        >
          <Radio value="all" className="text-[#05073C] font-medium">All</Radio>
          {(sidebarMap.refundability || []).map((item, index) => (
            <div key={`${item.name}-${index}`} className="flex justify-between items-center w-full">
              <Radio value={item.name} className="text-[#05073C] font-medium capitalize">
                {item.name === "non_refundable" ? "Non Refundable" : "Refundable"}
              </Radio>
              <span className="text-gray-400 text-xs">({item.count || 0})</span>
            </div>
          ))}
        </Radio.Group>
      </div>

      <div className={sectionStyle}>
        <h4 className={titleStyle}>{i18n.t("Hotel Type")}</h4>
        <Radio.Group
          onChange={(e) => updateFilters({ hotel_type: e.target.value === "all" ? undefined : e.target.value })}
          value={filters.hotel_type || "all"}
          className="w-full"
        >
          <div className="flex justify-between items-center mb-3">
            <Radio value="all" className="text-sm font-medium text-[#05073C]">All</Radio>
          </div>
          {(sidebarMap.hotel_type || []).map((item, index) => (
            <div key={index} className="flex justify-between items-center mb-3">
              <Radio value={item.name} className="text-sm font-medium text-[#05073C] capitalize">{item.name}</Radio>
              <div className="w-6 h-6 flex justify-center items-center rounded-full bg-[#E8EAE8]">
                <p className="text-[#05073C] text-[12px] font-medium">{item.count || 0}</p>
              </div>
            </div>
          ))}
        </Radio.Group>
      </div>

      <div className={sectionStyle}>
        <h4 className={titleStyle}>{i18n.t("Facilities and Services")} <span className="text-[10px]">▲</span></h4>
        <Checkbox.Group
          value={filters.facilities_services}
          onChange={(values) => updateFilters({ facilities_services: values })}
          className="flex flex-col gap-3 w-full"
        >
          {(sidebarMap.facilities_services || []).map((item, index) => (
            <div key={`${item.name}-${index}`} className="flex justify-between items-center w-full">
              <Checkbox value={item.name} className="text-[#05073C] font-medium">{item.name}</Checkbox>
              <span className="text-gray-400 text-xs">({item.count || 0})</span>
            </div>
          ))}
        </Checkbox.Group>
      </div>

      <div className={sectionStyle}>
        <h4 className={titleStyle}>{i18n.t("Hotel Location")}</h4>
        <Radio.Group
          onChange={(e) => updateFilters({ destination: e.target.value === "all" ? undefined : e.target.value })}
          value={filters.destination || "all"}
          className="w-full"
        >
          <div className="mb-3"><Radio value="all">All</Radio></div>
          {(sidebarMap.destination || []).map((item, index) => (
            <div key={index} className="flex justify-between items-center mb-3">
              <Radio value={item._id} className="text-sm font-medium text-[#05073C]">
                {getDisplayLabel(item?.name, getDisplayLabel(item?.address, "Unknown"))}
              </Radio>
              <div className="w-6 h-6 flex justify-center items-center rounded-full bg-[#E8EAE8]">
                <p className="text-[#05073C] text-[12px] font-medium">{item.count || 0}</p>
              </div>
            </div>
          ))}
        </Radio.Group>
      </div>

      <div className={sectionStyle}>
        <h4 className={titleStyle}>{i18n.t("Reviews")}</h4>
        <Radio.Group
          value={filters.review ?? "all"}
          onChange={(e) => updateFilters({ review: e.target.value === "all" ? undefined : e.target.value })}
          className="w-full"
        >
          <div className="flex justify-between items-center mb-3">
            <Radio value="all">All</Radio>
            <div className="w-10 h-6 flex justify-center items-center rounded-full bg-[#E8EAE8]">
              <p className="text-[#05073C] text-[12px] font-medium">All</p>
            </div>
          </div>
          {reviews.map((item, index) => (
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
