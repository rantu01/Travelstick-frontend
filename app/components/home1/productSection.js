"use client";
import {
  fetchPageContentTheme1,
  getPublicProducts,
} from "@/app/helper/backend";
import { useFetch } from "@/app/helper/hooks";
import { Empty } from "antd";
import { useI18n } from "@/app/contexts/i18n";
import SectionHeaderPage from "../common/sectionHeader";
import ProductCard from "../site/common/card/productCard";
import Link from "next/link";
import SkeletonLoading from "../common/skeletonLoading";
import SectionHeaderPage2 from "../common/sectionHeader2";

const ProductSection = ({ theme }) => {
  const [data] = useFetch(getPublicProducts, { limit: 1000 });
  const [products] = useFetch(fetchPageContentTheme1);
  const productData = products?.content?.product;
  const { langCode } = useI18n();
  const i18n = useI18n();
  const isLoading = data?.docs?.length === 0;
  return (
    <>
      {isLoading ? (
        <SkeletonLoading height1="50" height2="50" height3="50" height4="50" />
      ) : (
        <div className="">
          <div className="travel-container">
            {
              theme === 'one' ?
                <SectionHeaderPage
                  align="center"
                  maxWidth="max-w-[647px]"
                  title={productData?.heading?.[langCode]}
                  heading={productData?.title?.[langCode]}
                  description={productData?.offer_description?.[langCode]}
                /> :
                <SectionHeaderPage2
                  align="center"
                  maxWidth="max-w-[647px]"
                  title={productData?.heading?.[langCode]}
                  heading={productData?.title?.[langCode]}
                  description={productData?.offer_description?.[langCode]}
                />
            }
            <div className="xl:mt-14 lg:mt-10 md:mt-8 mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-6 md:gap-5 sm:gap-4 gap-3">
              {data?.docs?.length > 0 ? (
                data?.docs?.map((item, index) => (
                  <ProductCard key={index} data={item} />
                ))
              ) : (
                <div className="flex justify-center mt-10 col-span-full">
                  <Empty description="No Projects Found" />
                </div>
              )}
            </div>
            <div className="flex justify-center animate-bounceLeftRight xl:mt-14 lg:mt-10 md:mt-8 sm:mt-5 mt-5">
              {data?.docs?.length > 0 ? (
                <Link href="/product">
                  <button className="common-btn">{i18n.t("Show More")}</button>
                </Link>
              ) : (
                " "
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductSection;
