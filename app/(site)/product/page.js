"use client";
import ProductPage from "@/app/components/theme1/product/product";
import {
  fetchPageContentTheme1,
  fetchPublicSettings,
} from "@/app/helper/backend";
import { useFetch } from "@/app/helper/hooks";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Product = () => {

  const [dataProduct] = useFetch(fetchPublicSettings);
  const isProduct = dataProduct?.is_product_module;
  const router = useRouter();
  useEffect(() => {
    if (isProduct == false) {
      router.push("/404");
    }
  }, [isProduct, router]);


  const [data] = useFetch(fetchPageContentTheme1, {
    status: true,
  });
  const theme = data?.theme;

  return (
    <div>
      <ProductPage theme={theme} />
    </div>
  );
};

export default Product;
