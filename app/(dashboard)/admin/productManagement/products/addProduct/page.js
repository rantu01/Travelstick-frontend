'use client';
import React from "react";
import BackButton from "@/app/(dashboard)/components/common/backButton";
import ProductForm from "../productForm/page";
import { useI18n } from "@/app/contexts/i18n";

const AddProduct = () => {
  const i18n = useI18n();
  return (
    <div className="w-full overflow-x-auto mt-7 dashboardModal">
        <div className="rounded dashboardInput mx-6 p-6 bg-white">
        <div className="flex justify-between items-center pb-4">
          <h2 className="pt-3 pb-2 text-xl text-[#05073C] heading-4">{i18n.t('Add New Product')}</h2>
          <BackButton />
        </div>
        <div>
          <ProductForm isEdit={false} />
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
