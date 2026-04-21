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
  disabledDate,
  dateRender,
  filterData,
  langCode,
  sideElement,
}) => (
  <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
    {/* From */}
    <div className="md:col-span-3 border rounded-xl p-4 hover:bg-gray-50 relative cursor-pointer bg-white">
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
        className="absolute -right-4 md:-right-5 top-1/2 -translate-y-1/2 z-20 bg-primary text-white rounded-full p-1 border-2 border-white shadow-md cursor-pointer hover:bg-[#1A4FA0] transition-colors"
      >
        <FaExchangeAlt size={20} className="rotate-90 md:rotate-0" />
      </div>
    </div>

    {/* To */}
    <div className="md:col-span-4 border rounded-xl p-4 hover:bg-gray-50 cursor-pointer bg-white">
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

    {/* Departure */}
    <div className="md:col-span-3 border rounded-xl p-4 hover:bg-gray-50 bg-white">
      <p className="text-[11px] text-gray-400 font-bold">Departure</p>
      <DatePicker
        onChange={(d) => handleMultiCityChange(index, "date", d)}
        placeholder="Select date"
        disabledDate={disabledDate}
        variant="borderless"
        className={`p-0 font-bold text-lg w-full mt-1 ${flight.date ? "text-gray-700" : "text-gray-400"}`}
        value={flight.date}
        format="DD MMM, YYYY"
        suffixIcon={null}
        dateRender={dateRender}
      />
      <p className="text-[10px] text-gray-400">
        {flight.date ? flight.date.format("dddd") : ""}
      </p>
    </div>

    {/* Remove button */}
    <div className="md:col-span-2 flex items-center justify-center">
      {sideElement ? (
        <div className="w-full h-full flex items-center justify-center">{sideElement}</div>
      ) : (multiCityFlightsLength > 2 ? (
        <button
          onClick={() => handleRemoveMultiCityFlight(index)}
          className="text-red-400 hover:text-red-600 transition-colors p-2 rounded-full hover:bg-red-50 border border-red-100 w-full h-full flex items-center justify-center"
        >
          <FaTrash size={14} />
        </button>
      ) : (
        <div className="w-full h-full" />
      ))}
    </div>
  </div>
);

export default MultiCityRow;