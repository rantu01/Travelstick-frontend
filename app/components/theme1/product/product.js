"use client";
import {
  fetchPageContentTheme1,
  getPublicProducts,
} from "@/app/helper/backend";
import { useFetch } from "@/app/helper/hooks";
import SectionHeader from "../../common/sectionHeader";
import ProductCard from "../../site/common/card/productCard";
import { Empty, Pagination } from "antd";
import { useI18n } from "@/app/contexts/i18n";
import { useState } from "react";
import Banner from "../../site/common/component/Banner";
import Banner2 from "../../site/common/component/Banner2";
import SectionHeaderPage2 from "../../common/sectionHeader2";

const ProductPage = ({ theme }) => {
  const [data] = useFetch(getPublicProducts, { limit: 1000 });
  const [products] = useFetch(fetchPageContentTheme1);
  const productData = products?.content?.product;
  const { langCode } = useI18n();

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  // Get paginated data
  const paginatedData = data?.docs?.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="">
      {
        theme === 'one' ?
          <Banner title="Product" /> :
          <Banner2 title="Product" />
      }
      <div className="lg:py-[100px] md:py-20 sm:py-16 py-12 travel-container  overflow-hidden">

        {
          theme === 'one' ?
            <SectionHeader
              align="right"
              maxWidth="max-w-[647px]"
              title={productData?.heading?.[langCode]}
              heading={productData?.title?.[langCode]}
              description={productData?.offer_description?.[langCode]}
            /> :
            <SectionHeaderPage2
              align="right"
              maxWidth="max-w-[647px]"
              title={productData?.heading?.[langCode]}
              heading={productData?.title?.[langCode]}
              description={productData?.offer_description?.[langCode]}
            />
        }

        {/* Product Grid */}
        <div className="xl:mt-14 lg:mt-10 md:mt-8 mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-6 md:gap-5 sm:gap-4 gap-3">
          {paginatedData?.length > 0 ? (
            paginatedData.map((item, index) => (
              <ProductCard key={index} data={item} />
            ))
          ) : (
            <div className="flex justify-center mt-10 col-span-full">
              <Empty description="No Projects Found" />
            </div>
          )}
        </div>

        {/* Pagination */}
        {data?.docs?.length > pageSize && (
          <div className="flex justify-center mt-10 theme4Ant">
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={data.docs.length}
              onChange={(page) => setCurrentPage(page)}
              showSizeChanger={false}
              className="text-primary"
              itemRender={(page, type, originalElement) => {
                if (type === "page") {
                  return (
                    <a className="!text-primary hover:!text-primary font-medium">
                      {page}
                    </a>
                  );
                }
                return originalElement;
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductPage;
