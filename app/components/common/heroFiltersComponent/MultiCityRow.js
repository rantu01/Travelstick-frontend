import React from "react";
import { FaExchangeAlt, FaTrash } from "react-icons/fa";
import { DatePicker, Popover } from "antd";
import SelectionList from "./SelectionList";

const MultiCityRow = ({
  flight,
  index,
  openPopover,
  setOpenPopover,
  handleMultiCityChange,
  handleSwapMultiCity,
  handleRemoveMultiCityFlight,
  multiCityFlightsLength,
  adults,
  children,
  childrenAges,
  infants,
  bookingClass,
  disabledDate,
  dateRender,
  guestContent,
  filterData,
  langCode,
}) => (
  <div className="grid grid-cols-1 md:grid-cols-12 gap-0 border rounded-xl overflow-hidden relative">
    {/* From */}
    <div className="md:col-span-3 border-b md:border-b-0 md:border-r p-6 hover:bg-gray-50 relative cursor-pointer">
      <Popover
        open={openPopover === `mc-from-${index}`}
        onOpenChange={(v) => setOpenPopover(v ? `mc-from-${index}` : null)}
        content={
          <SelectionList
            options={filterData?.find(f => f.key === 'package_destination')?.values?.map(v => v.name?.[langCode] || v.name?.en || v.name) || []}
            onSelect={(v) => {
              handleMultiCityChange(index, "from", v);
              setOpenPopover(null);
            }}
          />
        }
        trigger="click"
        placement="bottomLeft"
      >
        <div>
          <p className="text-[11px] text-gray-400 font-bold">From</p>
          <h4 className="font-bold text-gray-700 text-lg leading-tight mt-1">
            {flight.from || "Select city"}
          </h4>
        </div>
      </Popover>
      {/* Swap button */}
      <div
        onClick={() => handleSwapMultiCity(index)}
        className="absolute right-4 md:-right-3 top-1/2 -translate-y-1/2 z-20 bg-[#00BCE4] text-white rounded-full p-1 border-2 border-white shadow-md cursor-pointer hover:bg-[#1A4FA0] transition-colors"
      >
        <FaExchangeAlt size={10} className="rotate-90 md:rotate-0" />
      </div>
    </div>

    {/* To */}
    <div className="md:col-span-3 border-b md:border-b-0 md:border-r p-6 hover:bg-gray-50 cursor-pointer">
      <Popover
        open={openPopover === `mc-to-${index}`}
        onOpenChange={(v) => setOpenPopover(v ? `mc-to-${index}` : null)}
        content={
          <SelectionList
            options={filterData?.find(f => f.key === 'package_destination')?.values?.map(v => v.name?.[langCode] || v.name?.en || v.name) || []}
            onSelect={(v) => {
              handleMultiCityChange(index, "to", v);
              setOpenPopover(null);
            }}
          />
        }
        trigger="click"
        placement="bottomLeft"
      >
        <div>
          <p className="text-[11px] text-gray-400 font-bold">To</p>
          <h4 className="font-bold text-gray-700 text-lg leading-tight mt-1">
            {flight.to || "Select city"}
          </h4>
        </div>
      </Popover>
    </div>

    {/* Date */}
    <div className="md:col-span-3 border-b md:border-b-0 md:border-r p-6 hover:bg-gray-50">
      <p className="text-[11px] text-gray-400 font-bold">Departure</p>
      <DatePicker
        onChange={(d) => handleMultiCityChange(index, "date", d)}
        placeholder="Select date"
        disabledDate={disabledDate}
        variant="borderless"
        className={`p-0 font-bold text-lg w-full mt-1 ${flight.date ? "text-gray-700" : "text-gray-400"
          }`}
        value={flight.date}
        format="DD MMM, YYYY"
        suffixIcon={null}
        dateRender={dateRender}
      />
      <p className="text-[10px] text-gray-400">
        {flight.date ? flight.date.format("dddd") : ""}
      </p>
    </div>

    {/* Traveller */}
    <div className="md:col-span-2 border-b md:border-b-0 md:border-r p-6 hover:bg-gray-50">
      <Popover
        open={openPopover === `mc-guests-${index}`}
        onOpenChange={(v) => setOpenPopover(v ? `mc-guests-${index}` : null)}
        content={guestContent}
        trigger="click"
        placement="bottomRight"
      >
        <div className="cursor-pointer">
          <p className="text-[11px] text-gray-400 font-bold">Traveller, Class</p>
          <h4 className="font-bold text-gray-700 text-lg leading-tight mt-1">
            {adults} Adult{adults > 1 ? "s" : ""}, {children} Child{children > 1 ? "ren" : ""}, {infants} Infant{infants > 1 ? "s" : ""}
            {children > 0 && childrenAges && childrenAges.length > 0 && (
              <span className="text-sm text-gray-500 block">
                Ages: {childrenAges.join(", ")}
              </span>
            )}
          </h4>
          <p className="text-[10px] text-gray-400">{bookingClass}</p>
        </div>
      </Popover>
    </div>

    {/* Remove button */}
    <div className="md:col-span-1 flex items-center justify-center p-2">
      {multiCityFlightsLength > 2 ? (
        <button
          onClick={() => handleRemoveMultiCityFlight(index)}
          className="text-red-400 hover:text-red-600 transition-colors p-2 rounded-full hover:bg-red-50"
        >
          <FaTrash size={14} />
        </button>
      ) : (
        <div className="w-8 h-8" />
      )}
    </div>
  </div>
);

export default MultiCityRow;
