"use client";
import { useEffect, useState } from "react";
import DestinationCard from "@/app/components/site/common/card/destinationCard";
import Banner from "@/app/components/site/common/component/Banner";
import { useFetch } from "@/app/helper/hooks";
import { fetchPageContentTheme1, getAllPublicDestination } from "@/app/helper/backend";
import Banner2 from "@/app/components/site/common/component/Banner2";
import DestinationCard2 from "@/app/components/site/common/card/destinationCard2";
import SectionHeaderPage from "@/app/components/common/sectionHeader";
import SectionHeaderPage2 from "@/app/components/common/sectionHeader2";
import { useI18n } from "@/app/contexts/i18n";

const Destination = () => {
  const [destiData, getDestiData] = useFetch(getAllPublicDestination, { limit: 100 });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);

  // Determine screen width
  useEffect(() => {
    const updateItemsPerPage = () => {
      const width = window.innerWidth;
      if (width >= 1280) {
        setItemsPerPage(8);
      } else if (width >= 768) {
        setItemsPerPage(6);
      } else if (width >= 600) {
        setItemsPerPage(4);
      } else {
        setItemsPerPage(3);
      }
    };

    updateItemsPerPage();
    window.addEventListener("resize", updateItemsPerPage);
    return () => window.removeEventListener("resize", updateItemsPerPage);
  }, []);


  const totalPages = Math.ceil(destiData?.docs?.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = destiData?.docs?.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const [data] = useFetch(fetchPageContentTheme1, {
    status: true,
  });
  const theme = data?.theme;
  const { langCode } = useI18n();
  const [offers] = useFetch(fetchPageContentTheme1);
  const destination = offers?.content?.destination;

  return (
    <div>
      {
        theme === 'one' ?
          <Banner title="Destination" /> :
          <Banner2 title="Destination" />
      }

      {
        theme === 'one' ?
          <div className="mt-8 md:mt-12 lg:mt-20">
            <SectionHeaderPage
              maxWidth="max-w-[790px]"
              align="center"
              title={destination?.heading?.[langCode]}
              heading={destination?.title?.[langCode]}
              description={destination?.offer_description?.[langCode]}
            />
          </div> :
          <div className="mt-8 md:mt-12 lg:mt-20">
            <SectionHeaderPage2
              maxWidth="max-w-[790px]"
              align="center"
              title={destination?.heading?.[langCode]}
              heading={destination?.title?.[langCode]}
              description={destination?.offer_description?.[langCode]}
            />
          </div>
      }
      <div className="travel-container xl:mt-[90px] lg:mt-[70px] md:mt-16 sm:mt-12 mt-10 relative">
        {
          theme === 'one' ?
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {currentItems?.map((item) => (
                <DestinationCard key={item._id} data={item} />
              ))}
            </div> :
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3  gap-6">
              {currentItems?.map((item) => (
                <DestinationCard2 key={item._id} item={item} />
              ))}
            </div>
        }
        {/* Pagination Buttons */}
        <div className="flex justify-center gap-2 mt-8">
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev - 1, totalPages))
            }
            disabled={currentPage === 1}
            className="w-8 h-8 rounded-md text-gray-500 hover:text-white hover:bg-[#EB662B] bg-gray-100 disabled:opacity-50"
          >
            &lt;
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`w-8 h-8 rounded-md text-sm font-medium transition-colors ${currentPage === i + 1
                ? "bg-primary hover:bg-[#EB662B] text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
            >
              {i + 1}
            </button>
          ))}
          {/* Next Button */}
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="w-8 h-8 rounded-md text-gray-500 hover:text-white bg-gray-100 hover:bg-[#EB662B] disabled:opacity-50"
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
};

export default Destination;
