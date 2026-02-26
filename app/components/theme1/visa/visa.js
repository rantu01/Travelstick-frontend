"use client";
import { Drawer, Empty, Popover } from "antd";
import { useEffect, useState } from "react";
import Banner from "@/app/components/site/common/component/Banner";
import React from "react";
import { useI18n } from "@/app/contexts/i18n";
import Image from "next/image";
import VisaFilters from "../../common/visaFilters";
import { getAllPublicVisa } from "@/app/helper/backend";
import { useFetch } from "@/app/helper/hooks";
import VisaCard1 from "../../site/common/card/visaCard1";
import VisaCard2 from "../../site/common/card/visaCard2";
import Banner2 from "../../site/common/component/Banner2";
import { FaSearch, FaTimesCircle } from "react-icons/fa";

const VisaPage = ({ visaType: initialType, visaMode, country: initialCountry, validity, theme }) => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [data, getData] = useFetch(getAllPublicVisa, { limit: 100 }, false);
  const i18n = useI18n();

  // --- Search States ---
  const [searchCountry, setSearchCountry] = useState(initialCountry || null);
  const [searchType, setSearchType] = useState(initialType || null);
  const [openPopover, setOpenPopover] = useState(null);

  useEffect(() => {
    getData({
      visa_type: searchType,
      visa_mode: visaMode,
      country: searchCountry,
      validity: validity,
    });
  }, [searchType, visaMode, searchCountry, validity]);

  const handleSearch = () => {
    getData({
      country: searchCountry,
      visa_type: searchType,
    });
  };

  const SelectionList = ({ options, onSelect }) => (
    <div className="flex flex-col w-60 max-h-64 overflow-y-auto bg-white rounded-md shadow-xl border border-gray-100">
      {options.map((opt, idx) => (
        <button 
          key={idx} 
          onClick={() => { onSelect(opt); setOpenPopover(null); }} 
          className="text-left px-4 py-3 hover:bg-blue-50 text-sm font-semibold text-gray-700 border-b border-gray-50 last:border-none transition-colors"
        >
          {opt}
        </button>
      ))}
    </div>
  );

  return (
    <div className="">
      {
        theme === 'one' ?
          <Banner title="Visa" /> :
          <Banner2 title="Visa" />
      }

      {/* --- Visa Search Bar --- */}
      <div className="travel-container -mt-10 relative z-30">
        <div className="bg-white rounded-xl shadow-2xl flex flex-col md:flex-row items-stretch border border-gray-100 overflow-hidden">
          
          {/* Country Selection */}
          <div className="flex-[1.5] border-b md:border-b-0 md:border-r p-4 hover:bg-gray-50 cursor-pointer group">
            <div className="flex justify-between items-center">
              <Popover 
                open={openPopover === 'country'}
                onOpenChange={(v) => setOpenPopover(v ? 'country' : null)}
                content={<SelectionList options={["Saudi Arabia", "United Arab Emirates", "Thailand", "Malaysia", "Singapore", "United Kingdom", "USA"]} onSelect={(v) => setSearchCountry(v)} />} 
                trigger="click" placement="bottomLeft"
              >
                <div className="flex-1">
                  <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Select Country</p>
                  <div className="mt-1 font-bold text-gray-700 text-lg leading-tight truncate">
                    {searchCountry || "Where do you want to go?"}
                  </div>
                </div>
              </Popover>
              {searchCountry && (
                <button onClick={() => setSearchCountry(null)} className="text-gray-300 hover:text-red-500 transition-colors">
                  <FaTimesCircle size={16} />
                </button>
              )}
            </div>
          </div>

          {/* Visa Type Selection */}
          <div className="flex-1 border-b md:border-b-0 md:border-r p-4 hover:bg-gray-50 cursor-pointer group">
            <div className="flex justify-between items-center">
              <Popover 
                open={openPopover === 'type'}
                onOpenChange={(v) => setOpenPopover(v ? 'type' : null)}
                content={<SelectionList options={["Tourist Visa", "Business Visa", "Student Visa", "Work Visa"]} onSelect={(v) => setSearchType(v)} />} 
                trigger="click" placement="bottomLeft"
              >
                <div className="flex-1">
                  <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Visa Type</p>
                  <div className="mt-1 font-bold text-gray-700 text-lg leading-tight truncate">
                    {searchType || "All Types"}
                  </div>
                </div>
              </Popover>
              {searchType && (
                <button onClick={() => setSearchType(null)} className="text-gray-300 hover:text-red-500 transition-colors">
                  <FaTimesCircle size={16} />
                </button>
              )}
            </div>
          </div>

          {/* Search Button */}
          <div className="p-3 bg-white flex items-center justify-center">
            <button 
              onClick={handleSearch}
              className="bg-[#1A4FA0] hover:bg-blue-900 text-white w-full md:w-20 h-12 md:h-14 rounded-lg flex items-center justify-center shadow-lg transition-all active:scale-95"
            >
              <FaSearch size={20} className="md:hidden mr-2" />
              <span className="md:hidden font-bold">Search Visa</span>
              <FaSearch size={20} className="hidden md:block" />
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
          {/* Visa Card */}
          <div className="w-full md:w-[70%] xl:w-[75%]">
            <h2 className="mb-6 font-bold text-xl text-gray-800">
               {data?.docs?.length || 0} Visa Options Available
            </h2>
            {
              data?.docs?.length > 0 ? (
                theme === 'one' ?
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 xl:gap-6 lg:gap-5 md:gap-4 gap-3">
                    {
                      data?.docs?.map((item, index) => (
                        <VisaCard1 key={index} data={item} />
                      ))
                    }
                  </div> :
                  <div className="w-full grid grid-cols-1 xl:grid-cols-2 xl:gap-6 lg:gap-5 md:gap-4 gap-3">
                    {
                      data?.docs?.map((item, index) => (
                        <VisaCard2 key={index} data={item} slug='page' />
                      ))
                    }
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