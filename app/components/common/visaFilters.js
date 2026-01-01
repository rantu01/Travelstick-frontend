"use client";
import { Form, Slider } from "antd";
import { useI18n } from "@/app/contexts/i18n";
import FormInput from "../form/input";
import { useCurrency } from "@/app/contexts/site";
import { useFetch } from "@/app/helper/hooks";
import { getAllSidePublicVisa } from "@/app/helper/backend";
import { useEffect, useState } from "react";
const VisaFilters = ({ getData }) => {
  const { currency_symbol } = useCurrency();
  const [packageSideData, getPackageSideData] = useFetch(
    getAllSidePublicVisa
  );
  const [visaTypes, setVisaTypes] = useState([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000);
  const i18n = useI18n();
  const {langCode} = useI18n();
  const form = Form.useFormInstance();
  const [priceRange, setPriceRange] = useState([0, 1000]);
  useEffect(() => {
    getPackageSideData();
  }, []);
  useEffect(() => {
    if (!packageSideData) return;

    const visaTypeBlock = packageSideData?.find(
      (item) => item.key === "visa_type"
    );
    if (visaTypeBlock) {
      setVisaTypes(visaTypeBlock.values || []);
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

  return (
    <div>
      {/* Search */}
      <div className="border border-[#E8EAE8] rounded-[10px] lg:rounded-[20px] xl:p-6 lg:p-5 md:p-4 p-3">
        <h4 className="description-2 text-[#05073C] !font-bold border-b border-[#E8EAE8] pb-2">{i18n.t("Search Visa")}</h4>
        <div className="xl:mt-6 lg:mt-5 mt-4 package-slider">
          <Form layout="vertical" form={form}>
            <FormInput
              placeholder={i18n.t("Type Visa Name")}
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

      {/* Visa Type */}
      <div className="xl:mt-6 lg:mt-5 mt-4 border border-[#E8EAE8] rounded-[10px] lg:rounded-[20px] xl:p-6 lg:p-5 md:p-4 p-3">
        <h4 className="description-2 text-[#05073C] !font-bold border-b border-[#E8EAE8] pb-2">{i18n.t("Visa Type")}</h4>
        <Form form={form}>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center package xl:mt-5 lg:mt-4 mt-3">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="visa_type"
                  value="all"
                  defaultChecked
                  onChange={() => getData({ visa_type: null })}
                  className="w-4 h-4 appearance-none rounded-full border-[1px] border-gray-300 checked:bg-primary checked:border-primary cursor-pointer"
                />
                <span className="text-sm font-medium text-[#05073C]">
                  All
                </span>
              </label>
            </div>

            {visaTypes?.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center package xl:mt-5 lg:mt-4 mt-3"
              >
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="visa_type"
                    value={item.name}
                    onChange={() => getData({ visa_type: item?._id })}
                    className="w-4 h-4 appearance-none rounded-full border-[1px] border-gray-300 checked:bg-primary checked:border-primary cursor-pointer"
                  />
                  <span className="text-sm font-medium text-[#05073C]">
                    {item?.name?.[langCode]}
                  </span>
                </label>
                <div className="w-6 h-6 flex justify-center items-center rounded-full bg-[#E8EAE8]">
                  <p className="text-[#05073C] text-[12px] font-medium">
                    {item?.count}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Form>
      </div>
    </div>
  );
}
export default VisaFilters;