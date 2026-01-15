import { useState } from "react";
import { TbMapPins } from "react-icons/tb";
import { LuHotel } from "react-icons/lu";
import { TbDevicesQuestion } from "react-icons/tb";
import { FaSearch } from "react-icons/fa";
import { DatePicker, message } from "antd";
import { FaChevronDown } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useI18n } from "@/app/contexts/i18n";
import { useFetch } from "@/app/helper/hooks";
import { getHeroFilterData } from "@/app/helper/backend";

const HeroFilters = () => {
  const i18n = useI18n();
  const { langCode } = useI18n();
  const router = useRouter();
  const [tab, setTab] = useState("tour");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [destination, setDestination] = useState(null);
  const [tourType, setTourType] = useState(null);
  const [hotelType, setHotelType] = useState(null);
  const [roomType, setRoomType] = useState(null);
  const [reputation, setReputation] = useState(null);
  const [visaType, setVisaType] = useState(null);
  const [visaMode, setVisaMode] = useState(null);
  const [country, setCountry] = useState(null);
  const [validity, setValidity] = useState(null);

  const [filterData] = useFetch(getHeroFilterData);
  const handleFilters = (value) => {
    if (value === "tour") {
      if (endDate && !startDate) {
        message.error(i18n.t("Please select a start date when an end date is selected."));
        return;
      }
      if (startDate || endDate || destination || tourType) {
        const query = new URLSearchParams();
        if (startDate) query.append("startDate", startDate);
        if (endDate) query.append("endDate", endDate);
        if (destination) query.append("destination", destination);
        if (tourType) query.append("tourType", tourType);
        router.push(`/package?${query.toString()}`);
      } else {
        message.error(i18n.t("Please select at least one filter option for tour."));
      }
    }

    if (value === "hotel") {
      if (destination || hotelType || roomType || reputation) {
        const query = new URLSearchParams();
        if (destination) query.append("destination", destination);
        if (hotelType) query.append("hotelType", hotelType);
        if (roomType) query.append("roomType", roomType);
        if (reputation) query.append("reputation", reputation);
        router.push(`/hotel?${query.toString()}`);
      }
      else {
        message.error(i18n.t("Please select at least one filter option for hotel."));
      }
    }

    if (value === "visa") {
      if (visaType || visaMode || country || validity) {
        const query = new URLSearchParams();
        if (visaType) query.append("visaType", visaType);
        if (visaMode) query.append("visaMode", visaMode);
        if (country) query.append("country", country);
        if (validity) query.append("validity", validity);
        router.push(`/visa?${query.toString()}`);
      }
      else {
        message.error(i18n.t("Please select at least one filter option for visa."));
      }
    }
  };

  return (
    <div>
      <div className="flex flex-row mx-auto items-center justify-center rounded-t-[10px] xl:mt-[132px] mt-[60px]">
        <button
          className={`text-[12px] sm:text-sm md:text-base rounded-tl-[10px] font-lato font-medium flex gap-[8px] items-center py-[18px]  px-4 sm:px-[32.5px]  text-[#05073C] ${tab === "tour"
            ? "bg-primary text-white"
            : "bg-white text-[#05073C]"
            }`}
          onClick={() => {
            setTab("tour");
          }}
        >
          <TbMapPins />
          <span>{i18n.t("Tour")}</span>
        </button>
        <button
          className={`text-[12px] sm:text-sm md:text-base font-lato font-medium  flex gap-[8px] items-center py-[18px] px-4 sm:px-[32.5px]  text-[#05073C] ${tab === "hotel"
            ? "bg-primary text-white"
            : "bg-white text-[#05073C]"
            }`}
          onClick={() => {
            setTab("hotel");
          }}
        >
          <LuHotel />
          <span>{i18n.t("Hotel")}</span>
        </button>

        <button
          className={`text-[12px] sm:text-sm md:text-base font-lato font-medium rounded-tr-[10px] flex gap-[8px] items-center py-[18px] px-4 sm:px-[32.5px]  text-[#05073C] ${tab === "visa"
            ? "bg-primary text-white"
            : "bg-white text-[#05073C]"
            }`}
          onClick={() => {
            setTab("visa");
          }}
        >
          <TbDevicesQuestion />
          <span>{i18n.t("Visa")}</span>
        </button>
      </div>
      <div
        className="p-[32px] bg-white  rounded-[20px] "
        style={{ boxShadow: "0px 80px 200px -12px #0F1C331F" }}
      >
        <div>
          {
            tab === "tour" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-6 items-center">
                <SelectComponent
                  label="Destination"
                  name="destination"
                  placeholder={"Select Destination"}
                  array={
                    filterData
                      ?.find((item) => item.key === "package_destination")
                      ?.values?.map((val) => ({
                        name: val.name,
                        value: val._id,
                      }))
                  }
                  onChange={(e) => {
                    setDestination(e?.target?.value);
                  }}
                />
                <SelectComponent
                  label="Tour Type"
                  name="tourtype"
                  placeholder={"Select Tour Type"}
                  array={
                    filterData?.find((item) => item?.key === "package_tour_type")?.values?.map((val) => ({
                      name: val.name,
                      value: val._id,
                    }))
                  }
                  onChange={(e) => {
                    setTourType(e?.target?.value);
                  }}
                />

                <DateComponent
                  label="Start From"
                  name="start"
                  placeholder="Select start date"
                  onChange={(e) => {
                    setStartDate(e?.target?.value);
                  }}
                />
                <DateComponent
                  label="End At"
                  name="end"
                  placeholder="Select end date"
                  onChange={(e) => {
                    setEndDate(e?.target?.value);
                  }}
                  minDate={startDate} 
                />
                <div className="col-span-1">
                  <button onClick={() => handleFilters("tour")} className="flex gap-2 w-full justify-center items-center font-lato font-medium sm:text-base text-sm px-[32px] py-[18px] bg-primary hover:bg-[#2A3479] transition-all duration-300 text-white rounded-full">
                    <FaSearch />
                    {i18n.t("Search")}
                  </button>
                </div>
              </div>
            )
          }
          {
            tab === "hotel" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-6 items-center">
                <SelectComponent
                  label="Destination"
                  name="destination"
                  placeholder={"Select Destination"}
                  array={
                    filterData
                      ?.find((item) => item.key === "hotel_destination")
                      ?.values?.map((val) => ({
                        name: val.name,
                        value: val._id,
                      }))
                  }
                  onChange={(e) => {
                    setDestination(e?.target?.value);
                  }}
                />
                <SelectComponent
                  label="Hotel Type"
                  name="hotelType"
                  placeholder={"Select Hotel Type"}
                  array={
                    filterData?.find((item) => item?.key === "hotel_type")?.values?.map((val) => ({
                      name: val.name,
                      value: val._id,
                    }))
                  }
                  onChange={(e) => {
                    setHotelType(e?.target?.value);
                  }}
                />
                <SelectComponent
                  label="Room Type"
                  name="roomType"
                  placeholder={"Select Room Type"}
                  array={
                    filterData?.find((item) => item?.key === "hotel_room_type")?.values?.map((val) => ({
                      name: val.name,
                      value: val._id,
                    }))
                  }
                  onChange={(e) => {
                    setRoomType(e?.target?.value);
                  }}
                />
                <SelectComponent
                  label="Reputation"
                  name="reputation"
                  placeholder={"Hotel Reputation"}
                  array={
                    filterData?.find((item) => item?.key === "hotel_reputation")?.values?.map((val) => ({
                      name: `${val.name} start hotel`,
                      value: val._id,
                    }))
                  }
                  onChange={(e) => {
                    setReputation(e?.target?.value.match(/(\d+)/)?.[0]);
                  }}
                />
                <div className="col-span-1">
                  <button onClick={() => handleFilters("hotel")} className="hover:bg-[#2A3479] transition-all duration-300 flex gap-2 w-full justify-center items-center font-lato font-medium sm:text-base text-sm px-[32px] py-[18px] bg-primary text-white rounded-full">
                    <FaSearch />
                    {i18n.t("Search")}
                  </button>
                </div>
              </div>
            )
          }
          {
            tab === "visa" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-6 items-center">
                <SelectComponent
                  label="Visa Type"
                  name="visaType"
                  placeholder={"Select Visa Type"}
                  array={
                    filterData?.find((item) => item?.key === "visa_type")?.values?.map((val) => ({
                      name: val.name?.[langCode],
                      value: val._id,
                    }))

                  }
                  onChange={(e) => {
                    setVisaType(e?.target?.value);
                  }}
                />
                <SelectComponent
                  label="Visa Mode"
                  name="visaMode"
                  placeholder={"Select Visa Mode"}
                  array={
                    filterData?.find((item) => item?.key === "visa_mode")?.values?.map((val) => ({
                      name: val.name,
                      value: val._id,
                    }))
                  }
                  onChange={(e) => {
                    setVisaMode(e?.target?.value);
                  }}
                />
                <SelectComponent
                  label="Country"
                  name="country"
                  placeholder={"Select country"}
                  array={
                    filterData?.find((item) => item?.key === "visa_country")?.values?.map((val) => ({
                      name: val.name,
                      value: val._id,
                    }))
                  }
                  onChange={(e) => {
                    setCountry(e?.target?.value);
                  }}
                />
                <SelectComponent
                  label="Validity"
                  name="validity"
                  placeholder={"Select validity"}
                  array={
                    filterData?.find((item) => item?.key === "visa_validity")?.values?.map((val) => ({
                      name: `${val?.name} months`,
                      value: val._id,
                    }))
                  }
                  onChange={(e) => {
                    setValidity(e?.target?.value.match(/(\d+)/)?.[0]);
                  }}
                />
                <div className="col-span-1">
                  <button onClick={() => handleFilters("visa")} className="hover:bg-[#2A3479] transition-all duration-300 flex gap-2 w-full justify-center items-center font-lato font-medium sm:text-base text-sm px-[32px] py-[18px] bg-primary text-white rounded-full">
                    <FaSearch />
                    {i18n.t("Search")}
                  </button>
                </div>
              </div>
            )
          }
        </div>
      </div>
    </div>
  )
};
export default HeroFilters


export const SelectComponent = ({
  label,
  name,
  array,
  placeholder,
  onChange,
}) => {
  const i18n = useI18n();
  return (
    <div className="form-control">
      <label
        htmlFor={name}
        className="leading-[18px] font-lato font-normal text-[12px] text-[#717171]"
      >
        {i18n.t(label)}
      </label>
      <select
        name={name}
        id={name}
        className="select-item mt-1 -ml-1"
        onChange={onChange}
        defaultValue=""
      >
        <option value="" disabled hidden>
          {i18n.t(placeholder)}
        </option>
        {array?.map((i, index) => (
          <option value={i?.value} key={index}>
            {i?.name}
          </option>
        ))}
      </select>
    </div>
  );
};


export const DateComponent = ({ label, name, placeholder, onChange, minDate }) => {
  const i18n = useI18n();

  return (
    <div className="visa-form border rounded-md relative py-1">
      <label
        htmlFor={name}
        className="leading-[18px] font-lato font-normal text-[12px] text-[#717171] px-2"
      >
        {i18n.t(label)}
      </label>
      <div className="relative">
        <DatePicker
          format="YYYY-MM-DD"
          onChange={(date, dateString) =>
            onChange?.({ target: { name, value: dateString } })
          }
          disabledDate={(current) => {
            const today = new Date();
            const min = minDate ? new Date(minDate) : null;
            return (
              current && (
                current < today.setHours(0, 0, 0, 0) || 
                (min && current < min.setHours(0, 0, 0, 0)) 
              )
            );
          }}
          name={name}
          placeholder={i18n.t(placeholder)}
          className="w-full select-item text-[#05073C] font-lato border !-mt-3"
          suffixIcon={<FaChevronDown className="text-[#717171]" />}
        />
      </div>
    </div>
  );
};


