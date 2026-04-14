"use client";
import { Drawer, Empty, Popover, DatePicker, Pagination } from "antd"; // Pagination import kora hoyeche
import { useEffect, useState } from "react";
import Banner from "@/app/components/site/common/component/Banner";
import React from "react";
import PackageCard from "../../site/common/card/packageCard";
import Filters from "../../common/filters";
import { useI18n } from "@/app/contexts/i18n";
import Image from "next/image";
import { useFetch } from "@/app/helper/hooks";
import { getAllPublicPackages, getHeroFilterData } from "@/app/helper/backend";
import Banner2 from "../../site/common/component/Banner2";
import PackageCard2 from "../../site/common/card/packageCard2";
import dayjs from "dayjs";
import { FaSearch, FaTimesCircle } from "react-icons/fa";
import CustomTourCard from "./CustomTourCard";

const PackagePage = ({ discount, discount_type, destination: initialDest, startDate: initialDate, endDate, tourType, theme }) => {
  const PACKAGE_LIST_LIMIT = 1000;
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openSearch, setOpenSearch] = useState(false);
  const i18n = useI18n();
  const [data, getData] = useFetch(getAllPublicPackages, { limit: PACKAGE_LIST_LIMIT }, false);

  // --- Search States ---
  const [searchDest, setSearchDest] = useState(initialDest || null);
  const [prefDate, setPrefDate] = useState(initialDate ? dayjs(initialDate) : null);
  const [openPopover, setOpenPopover] = useState(null);

  const [filterData] = useFetch(getHeroFilterData);

  useEffect(() => {
    getData({
      limit: PACKAGE_LIST_LIMIT,
      discount: discount,
      discount_type: discount_type,
      destination: searchDest,
      check_in: prefDate ? prefDate.format("YYYY-MM-DD") : null,
      check_out: endDate,
      tour_type: tourType
    });
  }, [discount, discount_type, searchDest, prefDate, endDate, tourType]);

  const disabledDate = (current) => {
    return current && current < dayjs().startOf('day');
  };

  const handleSearch = () => {
    getData({
      limit: PACKAGE_LIST_LIMIT,
      destination: searchDest,
      check_in: prefDate ? prefDate.format("YYYY-MM-DD") : null,
    });
  };

  // --- Pagination Handler ---
  const handlePageChange = (page) => {
    getData({
      limit: PACKAGE_LIST_LIMIT,
      page: page, // Backend e page number pathano hochhe
      discount: discount,
      discount_type: discount_type,
      destination: searchDest,
      check_in: prefDate ? prefDate.format("YYYY-MM-DD") : null,
      tour_type: tourType
    });
    // Page change hole smoothly upore scroll korbe
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const SelectionList = ({ options, onSelect }) => (
    <div className="flex flex-col w-60 max-h-64 overflow-y-auto bg-white rounded-md shadow-lg border border-gray-100">
      {options.map((opt, idx) => (
        <button
          key={idx}
          onClick={() => { onSelect(opt); setOpenPopover(null); }}
          className="text-left px-4 py-3 hover:bg-gray-50 text-sm font-semibold text-gray-700 border-b border-gray-50 last:border-none"
        >
          {opt}
        </button>
      ))}
    </div>
  );

  const SearchBarContent = (
    <div className="travel-container -mt-4 relative z-20 md:sticky md:top-[105px]">
      <div className="bg-white rounded-xl shadow-sm grid grid-cols-1 md:grid-cols-12 items-stretch border border-gray-200 overflow-hidden">

        {/* Destination */}
        <div className="md:col-span-6 border-b md:border-b-0 md:border-r p-4 hover:bg-gray-50 cursor-pointer group">
          <div className="flex justify-between items-center">
            <Popover
              open={openPopover === 'tour-dest'}
              onOpenChange={(v) => setOpenPopover(v ? 'tour-dest' : null)}
              content={<SelectionList options={filterData?.find(f => f.key === 'package_destination')?.values?.map(v => v.name?.[i18n.langCode] || v.name?.en || v.name) || []} onSelect={(v) => setSearchDest(v)} />}
              trigger="click" placement="bottomLeft"
            >
              <div className="flex-1">
                <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Destination</p>
                <div className="mt-1 font-bold text-gray-700 text-lg leading-tight truncate">
                  {searchDest || "Select City/Country"}
                </div>
              </div>
            </Popover>
            {searchDest && (
              <button
                onClick={(e) => { e.stopPropagation(); setSearchDest(null); }}
                className="text-gray-300 hover:text-red-500 transition-colors p-1"
              >
                <FaTimesCircle size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Preferred Date */}
        <div className="md:col-span-5 border-b md:border-b-0 md:border-r p-4 hover:bg-gray-50">
          <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Preferred Date</p>
          <div className="flex items-center justify-between">
            <DatePicker
              onChange={(d) => setPrefDate(d)}
              placeholder="Select date"
              disabledDate={disabledDate}
              variant="borderless"
              className={`p-0 font-bold text-lg w-full mt-1 ${prefDate ? "text-gray-700" : "text-gray-400"}`}
              value={prefDate} format="DD MMM, YYYY" suffixIcon={null}
            />
            {prefDate && <FaTimesCircle className="text-gray-300 hover:text-red-400 cursor-pointer" onClick={() => setPrefDate(null)} />}
          </div>
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
  );

  return (
    <div className="">
      {/* {
        theme === 'one' ?
          <Banner title="Tour Packages" /> :
          <Banner2 title="Tour Packages" />
      } */}

      {/* --- Package Search Bar --- */}
      <div className="hidden md:block mt-[10px] bg-gray-100 w-full border-b py-6 md:sticky md:top-[90px] z-30">
        <div className="hidden md:block mt-[20px]">{SearchBarContent}</div>
      </div>
      

      <div className="travel-container xl:mt-[106px] lg:mt-[90px] md:mt-20 xm:mt-16 mt-12 pb-20 relative">
        <div className="w-full md:hidden mb-4">
          <button
            onClick={() => setOpenSearch(true)}
            className="w-full flex items-center justify-between gap-3 text-sm px-3 py-3 bg-white border border-gray-300 rounded-md shadow-sm overflow-hidden whitespace-nowrap"
          >
            <div className="flex items-center gap-3 min-w-0">
              <FaSearch className="flex-shrink-0" />
              <div className="min-w-0 text-left">
                <div className="text-xs text-gray-400 uppercase font-bold tracking-wider">Destination</div>
                <div className="font-bold text-gray-700 truncate text-sm">{searchDest || "Select City/Country"}</div>
                <div className="text-[11px] text-gray-400 truncate">{prefDate ? prefDate.format('DD MMM') : 'Pick date'}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm text-blue-600 font-semibold">Edit</span>
            </div>
          </button>
        </div>

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

        <div className={`fixed inset-0 z-50 ${openSearch ? "visible" : "invisible"}`}>

          {/* Overlay */}
          <div
            onClick={() => setOpenSearch(false)}
            className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${openSearch ? "opacity-100" : "opacity-0"}`}
          ></div>

          {/* Bottom drawer */}
          <div
            className={`absolute bottom-0 left-0 w-full h-[520px] bg-white rounded-t-2xl p-4 
                            transform transition-transform duration-300 ease-out
                            ${openSearch ? "translate-y-0" : "translate-y-full"}`}
          >
            {SearchBarContent}
          </div>

        </div>

        <Drawer
          title={i18n.t("Filters")}
          onClose={() => setOpenDrawer(false)}
          open={openDrawer}
          className="md:hidden"
          width="100%"
        >
          {data && <Filters getData={getData} />}
        </Drawer>
        <div className="flex flex-col sm:flex-row xl:gap-6 lg:gap-5 md:gap-4 gap-3">
          <div className="w-full md:w-[30%] xl:w-[25%] hidden md:block">
            <Filters getData={getData} />
          </div>
          {/* Package Card */}
          <div className="w-full md:w-[70%] xl:w-[75%]">
            <CustomTourCard></CustomTourCard>
            {
              data?.docs?.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                    {
                      data?.docs?.map((item, index) => (
                        theme === 'one' ?
                          <PackageCard key={index} data={item} index={index} /> :
                          <PackageCard2 key={index} data={item} index={index} />
                      ))
                    }
                  </div>

                  {/* --- Pagination Section --- */}
                  <div className="mt-12 flex flex-col md:flex-row items-center justify-between gap-4 pt-6">
                    {/* Left side text */}
                    <p className="text-sm text-gray-500">
                      Showing {((data?.page - 1) * data?.limit) + 1} - {Math.min(data?.page * data?.limit, data?.totalDocs)} of {data?.totalDocs} packages
                    </p>

                    {/* Right side pagination buttons */}
                    <Pagination
                      current={data?.page}
                      total={data?.totalDocs}
                      pageSize={data?.limit || PACKAGE_LIST_LIMIT}
                      onChange={handlePageChange}
                      showSizeChanger={false}
                      className="custom-pagination"
                    />
                  </div>
                </>
              ) : (
                <div className="flex justify-center items-center min-h-[300px] w-full bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                  <Empty description="No Packages Found" />
                </div>
              )
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackagePage;