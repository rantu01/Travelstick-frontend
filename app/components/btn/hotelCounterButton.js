import React from 'react';
const HotelCounterButton = ({ check_in, check_out, hotelBookingCalculation, setInitialPrice, id, count, setCount, selectedServices }) => {

  const handleIncrease = async () => {
    if (count < 10) {
      const hotelData = await hotelBookingCalculation({
        body: {
          hotel: id,
          person: count + 1,
          check_in: check_in,
          check_out: check_out,
          ...selectedServices?.length > 0 && { services: selectedServices }
        },
      });
      if (hotelData?.success) {
        setInitialPrice(hotelData?.data);
      }
      setCount(prev => prev + 1);
    }
  };

  const handleDecrease = async () => {
    if (count > 1) {
      const hotelData = await hotelBookingCalculation({
        body: {
          hotel: id,
          person: count - 1,
          check_in: check_in,
          check_out: check_out,
          ...selectedServices?.length > 0 && { services: selectedServices }
        },
      });
      if (hotelData?.success) {
        setInitialPrice(hotelData?.data);
      }
      setCount(prev => prev - 1);
    }
  };

  return (
    <div className="flex items-center gap-4 border rounded-md">
      <button
        onClick={handleDecrease}
        className="px-3 py-1 bg-[#E8EAE8] rounded description-2 !font-bold"
      >
        -
      </button>
      <span className="description-1 !font-medium text-[#05073C] w-4">{count}</span>
      <button
        onClick={handleIncrease}
        className="px-3 py-1 bg-[#E8EAE8] rounded description-2 !font-bold"
      >
        +
      </button>
    </div>
  );
};

export default HotelCounterButton;
