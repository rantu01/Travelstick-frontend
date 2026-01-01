'use client';
import BackButton from "@/app/(dashboard)/components/common/backButton";
import { getAllProducts } from "@/app/helper/backend";
import { useSearchParams } from "next/navigation";
import { useFetch } from "@/app/helper/hooks";
import { useEffect } from "react";
import ProductForm from "../productForm/page";
import { useI18n } from "@/app/contexts/i18n";


const EditProduct = () => {
  const i18n = useI18n();
  const searchParams = useSearchParams();
  const id = searchParams.get("_id");
  const [data, getData] = useFetch(getAllProducts, {}, false);
  useEffect(() => {
    getData({ _id: id });
  }, [id]);
  return (
    <div className="w-full overflow-x-auto mt-7 dashboardModal">
        <div className="rounded dashboardInput mx-6 p-6 bg-white">
        <div className="flex justify-between  items-center pb-4">
          <h2 className="pt-3 pb-2 text-xl text-[#05073C] heading-4">{i18n.t('Edit Product')}</h2>
          <BackButton />
        </div>
        <div>
          <ProductForm data={data} isEdit={true} />
        </div>
      </div>
    </div>
  );
};

export default EditProduct;
