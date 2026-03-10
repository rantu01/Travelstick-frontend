"use client";
import { Drawer, Empty, Popover } from "antd";
import { useEffect, useState } from "react";
import Banner from "@/app/components/site/common/component/Banner";
import React from "react";
import { useI18n } from "@/app/contexts/i18n";
import Image from "next/image";
import VisaFilters from "../../common/visaFilters";
import { getAllPublicVisa, getHeroFilterData } from "@/app/helper/backend";
import { useFetch } from "@/app/helper/hooks";
import VisaCard1 from "../../site/common/card/visaCard1";
import VisaCard2 from "../../site/common/card/visaCard2";
import Banner2 from "../../site/common/component/Banner2";
import { FaSearch, FaTimesCircle } from "react-icons/fa";
import { useRouter } from "next/navigation";
import SelectionList from "../../common/heroFiltersComponent/SelectionList";

const VisaPage = ({ visaType: initialType, visaMode, country: initialCountry, validity, theme }) => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [data, getData] = useFetch(getAllPublicVisa, { limit: 100 }, false);
  const i18n = useI18n();
  const router = useRouter();

  const [openPopover, setOpenPopover] = useState(null);
  const [filterData] = useFetch(getHeroFilterData);

  // ✅ Dependent visa search states (same as HeroFilters)
  const [citizenOf, setCitizenOf] = useState(null);
  const [travellingTo, setTravellingTo] = useState(null);
  const [visaCategory, setVisaCategory] = useState(null);

  const [travellingToOptions, setTravellingToOptions] = useState([]);
  const [visaCategoryOptions, setVisaCategoryOptions] = useState([]);
  const [matchedVisaId, setMatchedVisaId] = useState(null);

  const [loadingTravellingTo, setLoadingTravellingTo] = useState(false);
  const [loadingVisaCategory, setLoadingVisaCategory] = useState(false);

  // ✅ citizen_of options from filterData
  const visaCitizenOptions =
    filterData?.find(f => f.key === "visa_citizen_of")?.values?.map(v => v.name) ||
    filterData?.find(f => f.key === "visa_country")?.values?.map(v => v.name) ||
    [];

  // ✅ Step 2: citizenOf select হলে → travelling_to fetch
  useEffect(() => {
    if (!citizenOf) {
      setTravellingTo(null);
      setTravellingToOptions([]);
      setVisaCategory(null);
      setVisaCategoryOptions([]);
      setMatchedVisaId(null);
      return;
    }
    const fetchTravellingTo = async () => {
      setLoadingTravellingTo(true);
      setTravellingTo(null);
      setVisaCategory(null);
      setVisaCategoryOptions([]);
      setMatchedVisaId(null);
      try {
        const { data } = await getAllPublicVisa({ citizen_of: citizenOf, limit: 100 });
        const docs = data?.docs || [];
        const unique = [...new Set(docs.map(v => v.travelling_to).filter(Boolean))];
        setTravellingToOptions(unique);
      } catch {
        setTravellingToOptions([]);
      } finally {
        setLoadingTravellingTo(false);
      }
    };
    fetchTravellingTo();
  }, [citizenOf]);

  // ✅ Step 3: travellingTo select হলে → visa category fetch
  useEffect(() => {
    if (!citizenOf || !travellingTo) {
      setVisaCategory(null);
      setVisaCategoryOptions([]);
      setMatchedVisaId(null);
      return;
    }
    const fetchVisaCategories = async () => {
      setLoadingVisaCategory(true);
      setVisaCategory(null);
      setMatchedVisaId(null);
      try {
        const { data } = await getAllPublicVisa({
          citizen_of: citizenOf,
          travelling_to: travellingTo,
          limit: 100,
        });
        const docs = data?.docs || [];
        const seen = new Map();
        docs.forEach(v => {
          if (v.visa_type?._id && !seen.has(v.visa_type._id)) {
            seen.set(v.visa_type._id, {
              label: v.visa_type?.name?.[i18n.langCode] || v.visa_type?.name?.en || "",
              visaId: v._id,
            });
          }
        });
        const options = Array.from(seen.entries()).map(([, val]) => ({
          label: val.label,
          visaId: val.visaId,
        }));
        setVisaCategoryOptions(options);
        if (docs.length === 1) {
          setMatchedVisaId(docs[0]._id);
        }
      } catch {
        setVisaCategoryOptions([]);
      } finally {
        setLoadingVisaCategory(false);
      }
    };
    fetchVisaCategories();
  }, [citizenOf, travellingTo]);

  const handleSelect = (setter, value) => {
    setter(value);
    setOpenPopover(null);
  };

  const handleVisaCategorySelect = (option) => {
    setVisaCategory(option.label);
    setMatchedVisaId(option.visaId);
    setOpenPopover(null);
  };

  // ✅ Search: HeroFilters এর মতো — match হলে details, না হলে list
  const handleSearch = () => {
    if (citizenOf && travellingTo && visaCategory && matchedVisaId) {
      router.push(`/visa/${matchedVisaId}`);
      return;
    }
    const query = new URLSearchParams();
    if (citizenOf) query.append("citizen_of", citizenOf);
    if (travellingTo) query.append("travelling_to", travellingTo);
    getData({
      citizen_of: citizenOf || undefined,
      travelling_to: travellingTo || undefined,
      visa_type: visaCategory || undefined,
      visa_mode: visaMode,
      validity: validity,
      limit: 100,
    });
  };

  // Initial data load
  useEffect(() => {
    getData({
      visa_type: initialType,
      visa_mode: visaMode,
      country: initialCountry,
      validity: validity,
    });
  }, [initialType, visaMode, initialCountry, validity]);

  return (
    <div className="">
      {/* --- Visa Search Bar --- */}
      <div className="travel-container -mt-10 relative z-30 sticky top-[92px]">
        <div className="bg-white rounded-xl shadow-sm flex flex-col md:grid md:grid-cols-12 items-stretch border border-gray-100 overflow-hidden">

          {/* ✅ Step 1: Citizen Of */}
          <div className="md:col-span-4 border-b md:border-b-0 md:border-r p-4 hover:bg-gray-50 cursor-pointer transition-colors">
            <Popover
              open={openPopover === "visa-cit"}
              onOpenChange={(v) => setOpenPopover(v ? "visa-cit" : null)}
              content={
                <SelectionList
                  options={visaCitizenOptions}
                  onSelect={(v) => handleSelect(setCitizenOf, v)}
                />
              }
              trigger="click" placement="bottomLeft"
            >
              <div className="w-full">
                <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">{i18n.t("Citizen of")}</p>
                <div className={`mt-1 font-bold text-lg leading-tight truncate ${!citizenOf ? "text-gray-400" : "text-gray-700"}`}>
                  {citizenOf || i18n.t("Select country")}
                </div>
              </div>
            </Popover>
          </div>

          {/* ✅ Step 2: Travelling To — citizenOf এর পর enable */}
          <div className={`md:col-span-4 border-b md:border-b-0 md:border-r p-4 transition-colors ${!citizenOf ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50 cursor-pointer"}`}>
            <div className="flex justify-between items-center w-full">
              <Popover
                open={citizenOf ? openPopover === "visa-to" : false}
                onOpenChange={(v) => citizenOf && setOpenPopover(v ? "visa-to" : null)}
                content={
                  loadingTravellingTo ? (
                    <div className="p-4 text-sm text-gray-500">Loading...</div>
                  ) : (
                    <SelectionList
                      options={travellingToOptions}
                      onSelect={(v) => handleSelect(setTravellingTo, v)}
                    />
                  )
                }
                trigger="click" placement="bottomLeft"
              >
                <div className="flex-1">
                  <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">{i18n.t("Travelling to")}</p>
                  <div className={`mt-1 font-bold text-lg leading-tight truncate ${!travellingTo ? "text-gray-400" : "text-gray-700"}`}>
                    {loadingTravellingTo ? "Loading..." : travellingTo || i18n.t("Select destination")}
                  </div>
                </div>
              </Popover>
              {travellingTo && (
                <FaTimesCircle
                  className="text-gray-300 hover:text-red-500 cursor-pointer ml-2 flex-shrink-0"
                  onClick={() => { setTravellingTo(null); setVisaCategory(null); setVisaCategoryOptions([]); setMatchedVisaId(null); }}
                />
              )}
            </div>
          </div>

          {/* ✅ Step 3: Visa Category — travellingTo এর পর enable */}
          <div className={`md:col-span-3 border-b md:border-b-0 md:border-r p-4 transition-colors ${!travellingTo ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50 cursor-pointer"}`}>
            <Popover
              open={travellingTo ? openPopover === "visa-cat" : false}
              onOpenChange={(v) => travellingTo && setOpenPopover(v ? "visa-cat" : null)}
              content={
                loadingVisaCategory ? (
                  <div className="p-4 text-sm text-gray-500">Loading...</div>
                ) : (
                  <SelectionList
                    options={visaCategoryOptions.map(o => o.label)}
                    onSelect={(label) => {
                      const found = visaCategoryOptions.find(o => o.label === label);
                      handleVisaCategorySelect(found);
                    }}
                  />
                )
              }
              trigger="click" placement="bottomLeft"
            >
              <div className="w-full">
                <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">{i18n.t("Visa Category")}</p>
                <div className={`mt-1 font-bold text-lg leading-tight truncate ${!visaCategory ? "text-gray-400" : "text-gray-700"}`}>
                  {loadingVisaCategory ? "Loading..." : visaCategory || i18n.t("Select category")}
                </div>
              </div>
            </Popover>
          </div>

          {/* Search Button */}
          <div className="md:col-span-1 flex items-center justify-center">
            <button
              onClick={handleSearch}
              className="bg-[#1A4FA0] hover:bg-blue-900 text-white w-full h-full min-h-[60px] md:min-h-0 rounded-xl flex items-center justify-center shadow-lg transition-transform active:scale-95"
            >
              <FaSearch size={20} />
            </button>
          </div>

        </div>
      </div>

      <div className="travel-container xl:mt-[106px] lg:mt-[90px] md:mt-20 xm:mt-16 mt-12 pb-20 relative">
        {/* Filter icon for mobile */}
        <div className="flex gap-2 items-center justify-end md:hidden mb-4">
          <button
            className="text-xl p-2 border border-gray-300 rounded-md"
            onClick={() => setOpenDrawer(true)}
          >
            <Image
              src="/theme1/filter.png"
              alt="Filter"
              width={20}
              height={20}
            />
          </button>
          <p className="heading-1 text-[#000000]">{i18n.t("Filters")}</p>
        </div>

        {/* Drawer for filters */}
        <Drawer
          title={i18n.t("Filters")}
          onClose={() => setOpenDrawer(false)}
          open={openDrawer}
          className="sm:hidden"
        >
          <VisaFilters getData={getData} />
        </Drawer>

        <div className="flex flex-col sm:flex-row xl:gap-6 lg:gap-5 md:gap-4 gap-3">
          {/* Filter part */}
          <div className="w-full md:w-[30%] xl:w-[25%] hidden md:block">
            <div className="sticky top-24">
              <VisaFilters getData={getData} />
            </div>
          </div>
          {/* Visa Cards List */}
          <div className="w-full md:w-[70%] xl:w-[75%]">
            <h2 className="mb-6 font-bold text-xl text-gray-800">
              {data?.docs?.length || 0} Visa Options Available
            </h2>
            {
              data?.docs?.length > 0 ? (
                theme === 'one' ?
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 xl:gap-6 lg:gap-5 md:gap-4 gap-3">
                    {data?.docs?.map((item, index) => (
                      <VisaCard1 key={index} data={item} />
                    ))}
                  </div> :
                  <div className="w-full grid grid-cols-1 xl:grid-cols-2 xl:gap-6 lg:gap-5 md:gap-4 gap-3">
                    {data?.docs?.map((item, index) => (
                      <VisaCard2 key={index} data={item} slug='page' />
                    ))}
                  </div>
              ) : (
                <div className="flex flex-col items-center justify-center min-h-[300px] bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                  <Empty description={i18n.t("No Visa Found")} />
                </div>
              )
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisaPage;