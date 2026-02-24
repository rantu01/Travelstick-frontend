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
import { getAllPublicPackages } from "@/app/helper/backend";
import Banner2 from "../../site/common/component/Banner2";
import PackageCard2 from "../../site/common/card/packageCard2";
import dayjs from "dayjs";
import { FaSearch, FaTimesCircle } from "react-icons/fa";

const PackagePage = ({ discount, discount_type, destination: initialDest, startDate: initialDate, endDate, tourType, theme }) => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const i18n = useI18n();
  const [data, getData] = useFetch(getAllPublicPackages, { limit: 12 }, false); // Default limit 12 kora hoyeche better view er jonno

  // --- Search States ---
  const [searchDest, setSearchDest] = useState(initialDest || null);
  const [prefDate, setPrefDate] = useState(initialDate ? dayjs(initialDate) : null);
  const [openPopover, setOpenPopover] = useState(null);

  useEffect(() => {
    getData({
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
      destination: searchDest,
      check_in: prefDate ? prefDate.format("YYYY-MM-DD") : null,
    });
  };

  // --- Pagination Handler ---
  const handlePageChange = (page) => {
    getData({
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

  return (
    <div className="">
      {
        theme === 'one' ?
          <Banner title="Tour Packages" /> :
          <Banner2 title="Tour Packages" />
      }

      {/* --- Search Section --- */}
      <div className="travel-container -mt-10 relative z-20 ">
        <div className="bg-white rounded-xl shadow-xl flex flex-col md:flex-row items-stretch border border-gray-200 overflow-hidden">

          {/* Destination */}
          <div className="flex-[2] border-b md:border-b-0 md:border-r p-4 hover:bg-gray-50 cursor-pointer group">
            <div className="flex justify-between items-center">
              <Popover
                open={openPopover === 'tour-dest'}
                onOpenChange={(v) => setOpenPopover(v ? 'tour-dest' : null)}
                content={<SelectionList options={["Dubai", "Maldives", "Bhutan", "Thailand", "Cox's Bazar"]} onSelect={(v) => setSearchDest(v)} />}
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
          <div className="flex-1 border-b md:border-b-0 md:border-r p-4 hover:bg-gray-50">
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
          <div className="p-3 bg-white flex items-center justify-center">
            <button
              onClick={handleSearch}
              className="bg-[#1A4FA0] hover:bg-blue-900 text-white w-full md:w-20 h-12 md:h-14 rounded-lg flex items-center justify-center shadow-lg transition-all active:scale-95"
            >
              <FaSearch size={20} className="md:hidden mr-2" />
              <span className="md:hidden font-bold">Search Packages</span>
              <FaSearch size={20} className="hidden md:block" />
            </button>
          </div>
        </div>
      </div>

      <div className="travel-container xl:mt-[106px] lg:mt-[90px] md:mt-20 xm:mt-16 mt-12 pb-20 relative">
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
        <Drawer
          title={i18n.t("Filters")}
          onClose={() => setOpenDrawer(false)}
          open={openDrawer}
          className="sm:hidden"
        >
          {data && <Filters getData={getData} />}
        </Drawer>
        <div className="flex flex-col sm:flex-row xl:gap-6 lg:gap-5 md:gap-4 gap-3">
          <div className="w-full md:w-[30%] xl:w-[25%] hidden md:block">
            <Filters getData={getData} />
          </div>
          {/* Package Card */}
          <div className="w-full md:w-[70%] xl:w-[75%]">
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
                      pageSize={data?.limit || 12}
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