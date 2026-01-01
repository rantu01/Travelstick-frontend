'use client';
import { useCart } from "@/app/contexts/cartContext";
import { CiCircleMinus, CiCirclePlus } from "react-icons/ci";

const ProductButtonCart = ({ count, id}) => {
  const { addItem } = useCart();

  const handleIncrement = async (id, quantity) => {
      await addItem(id, quantity, "product", true);
  };

  return (
    <div className="rounded-[20px] text-[16px] lg:text-xl font-medium flex items-center justify-between border p-3 lg:p-4 font-lora w-[80px] md:w-[90px] lg:w-[110px]">
      <button
        onClick={() => handleIncrement(id, -1)}
        disabled={count <= 1}
        className={`rounded-full  px-1 text-xs ${
          count <= 1 ? "opacity-10 cursor-not-allowed" : ""
        }`}
      >
       <CiCircleMinus className="text-primary !text-xl"/>
      </button>
      <span className="text-sm text-primary">{count}</span>
      <button
        onClick={() => handleIncrement(id, 1)}
        disabled={count >= 10}
        className={`rounded-full  px-1 text-xs ${
          count >= 10 ? "opacity-10 cursor-not-allowed" : ""
        }`}
      >
        <CiCirclePlus className="text-primary !text-xl" />
      </button>
    </div>
  );
};

export default ProductButtonCart;
