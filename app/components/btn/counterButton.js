import React, { useState } from 'react';

const CounterButton = ({ postPackageBookingCalculation, setInitialPrice, id, count, setCount, selectedServices }) => {

  const handleIncrease = async () => {
    if (count < 10) {
      const packageData = await postPackageBookingCalculation({
        body: {
          package: id,
          person: count + 1,
          services: selectedServices
        },
      });
      if (packageData?.success) {
        setInitialPrice(packageData?.data);
      }
      setCount(prev => prev + 1);
    }
  };

  const handleDecrease = async () => {
    if (count > 1) {
      const packageData = await postPackageBookingCalculation({
        body: {
          package: id,
          person: count - 1,
          services: selectedServices
        },
      });
      if (packageData?.success) {
        setInitialPrice(packageData?.data);
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

export default CounterButton;
