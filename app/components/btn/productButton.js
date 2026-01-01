import { useState } from "react";
import { CiCircleMinus, CiCirclePlus } from "react-icons/ci";

const ProductButton = ({ productQuantity, onCountChange }) => {
  const [count, setCount] = useState(1);

  const handleIncrement = () => {
    if (count < productQuantity) {
      const newCount = count + 1;
      setCount(newCount);
      if (onCountChange) {
        onCountChange(newCount);
      }
    }
  };

  const handleDecrement = () => {
    if (count > 1) {
      const newCount = count - 1;
      setCount(newCount);
      if (onCountChange) {
        onCountChange(newCount);
      }
    }
  };

  return (
    <div className="rounded-[20px] text-[16px] lg:text-xl font-medium flex items-center justify-between border border-primary p-2 lg:p-3  font-lora w-[80px] md:w-[90px] lg:w-[110px]">
      <button
        onClick={handleDecrement}
        disabled={count <= 1}
        className={`${
          count <= 1 ? "opacity-10 cursor-not-allowed" : ""
        }`}
      >
        <CiCircleMinus className="text-primary !text-xl"/>
      </button>
      <span className="text-sm text-primary">{count}</span>
      <button
        onClick={handleIncrement}
        disabled={count >= productQuantity}
        className={` ${
          count >= productQuantity ? "opacity-10 cursor-not-allowed" : ""
        }`}
      >
     <CiCirclePlus className="text-primary !text-xl" />
      </button>
    </div>
  );
};

export default ProductButton;
