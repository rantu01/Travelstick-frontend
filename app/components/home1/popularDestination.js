"use client";
import { IoLocationOutline } from "react-icons/io5";
import SectionHeaderPage from "../common/sectionHeader";
import { useFetch } from "@/app/helper/hooks";
import {
  fetchPageContentTheme1,
  getAllPublicDestination,
} from "@/app/helper/backend";
import { useI18n } from "@/app/contexts/i18n";
import Link from "next/link";
import AnimatedContent from "../ui/animatedContent";
import TextWithTooltip from "@/app/helper/utils";
import SkeletonLoading from "../common/skeletonLoading";

const PopularDestination = () => {
  const [data] = useFetch(getAllPublicDestination, { limit: 6 });
  const [offers] = useFetch(fetchPageContentTheme1);
  const destination = offers?.content?.destination;
  const { langCode } = useI18n();
  const i18n = useI18n();
  const isLoading = data?.docs?.length === 0;
  return (
    <>
      {isLoading ? (
        <SkeletonLoading cols={3} />
      ) : (
        <div className="travel-container w-full">
          <SectionHeaderPage
            maxWidth="max-w-[790px]"
            align="center"
            title={destination?.heading?.[langCode]}
            heading={destination?.title?.[langCode]}
            description={destination?.offer_description?.[langCode]}
          />

          {/* Grid Section */}
          <AnimatedContent direction="vertical" reverse={false} distance={50}>
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 mt-10">
              {data?.docs?.map((destination, index) => {
                let colSpan = "lg:col-span-3";
                if (index === 0) colSpan = "lg:col-span-6";
                if (index === 2)
                  colSpan =
                    "lg:col-span-3 lg:row-span-2 h-[240px] lg:h-[504px]";
                else colSpan += " h-[240px]";
                return (
                  <div
                    key={index}
                    className={`col-span-1 md:col-span-1 ${colSpan} w-full bg-cover bg-center rounded-[20px] relative`}
                    style={{
                      backgroundImage: `url(${destination?.banner_image})`,
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-b from-[#05073C1A] to-[#00000099] rounded-[20px] z-10"></div>
                    <Link
                      href={`/destination/${destination?._id}`}
                      className="absolute bottom-6 left-6 text-white z-20"
                    >
                      <h2 className="text-xl font-lato font-bold mb-2 mr-2">
                        <TextWithTooltip
                          text={destination?.address?.name}
                          limit={50}
                        />
                      </h2>
                      <p className="text-base flex items-center -ml-2">
                        <IoLocationOutline className="text-2xl mr-1" />
                        {destination?.name}
                      </p>
                    </Link>
                  </div>
                );
              })}
            </div>
          </AnimatedContent>
          {data?.docs?.length > 0 && (
            <Link
              href="/destination"
              className="flex justify-center  xl:mt-14 lg:mt-10 md:mt-8 sm:mt-5 mt-5"
            >
              <button className="common-btn animate-bounceLeftRight">
                {i18n.t("Explore More")}
              </button>
            </Link>
          )}
        </div>
      )}
    </>
  );
};

export default PopularDestination;
