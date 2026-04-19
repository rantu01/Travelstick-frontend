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
import { FaSearch } from "react-icons/fa";
import { useMemo } from "react";

const ProductPage = ({ theme }) => {
  const [data] = useFetch(getPublicProducts, { limit: 1000 });
  const [products] = useFetch(fetchPageContentTheme1);
  const productData = products?.content?.product;
  const { langCode } = useI18n();

  // Search/filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  // Normalize text so search works regardless of uppercase/lowercase and accents.
  const normalize = (s) =>
    String(s || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();

  const getLocalizedText = (value) => {
    if (!value) return "";
    if (typeof value === "string") return value;
    if (typeof value === "object") {
      if (value?.[langCode]) return value[langCode];
      if (value?.en) return value.en;
      const firstString = Object.values(value).find((v) => typeof v === "string");
      return firstString || "";
    }
    return "";
  };

  const getCategoryMeta = (product) => {
    const category = product?.category;

    if (!category) return { id: "", label: "" };
    if (typeof category === "string") return { id: category, label: "" };
    if (typeof category === "object" && category?.$oid) {
      return { id: String(category.$oid), label: "" };
    }

    const rawId = category?._id?.$oid || category?._id || category?.id || "";
    const rawLabel = getLocalizedText(category?.name);
    return {
      id: rawId ? String(rawId) : "",
      label: rawLabel ? String(rawLabel).trim() : "",
    };
  };

  // Build category list from populated category names (if available)
  const categories = useMemo(() => {
    const map = new Map();
    (data?.docs || []).forEach((p) => {
      const { id, label } = getCategoryMeta(p);
      const fallbackNameKey = label ? `name:${normalize(label)}` : "";
      const value = id || fallbackNameKey;

      if (value) {
        const optionLabel = label || value;
        if (!map.has(value)) map.set(value, { label: optionLabel, value });
      }
    });
    return Array.from(map.values());
  }, [data?.docs]);

  const filtered = useMemo(() => {
    const q = normalize(searchQuery);

    return (data?.docs || []).filter((p) => {
      const pname = normalize(getLocalizedText(p?.name));
      const { id, label } = getCategoryMeta(p);
      const categoryValue = id || (label ? `name:${normalize(label)}` : "");

      if (selectedCategory && categoryValue !== selectedCategory) return false;
      if (q && !pname.includes(q)) return false;
      return true;
    });
  }, [data?.docs, searchQuery, selectedCategory, langCode]);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  // Get paginated data from filtered list
  const paginatedData = filtered?.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="">
      {/* {
        theme === 'one' ?
          <Banner title="Product" /> :
          <Banner2 title="Product" />
      } */}
      <div className="lg:py-[100px] md:py-20 sm:py-16 py-12 travel-container  overflow-hidden">

        {/* {
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
        } */}

        {/* Search / Filters */}
        <div className="mt-6 flex flex-col sm:flex-row items-stretch gap-3 mb-4">
          <div className="flex-1 flex items-center gap-2 bg-white border border-gray-200 rounded-md px-3 py-2">
            <FaSearch className="text-gray-400" />
            <input
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              placeholder="Search product name..."
              className="w-full outline-none text-sm"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
            className="w-56 bg-white border border-gray-200 rounded-md px-3 py-2 text-sm"
          >
            <option value="">All categories</option>
            {categories.map((c, i) => (
              <option key={i} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>

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
        {filtered?.length > pageSize && (
          <div className="flex justify-center mt-10 theme4Ant">
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={filtered.length}
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
