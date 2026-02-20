"use client";
import Banner from "@/app/components/site/common/component/Banner";
import { useI18n } from "@/app/contexts/i18n";
import { fetchPageContentTheme1, getAllPublicVisa } from "@/app/helper/backend";
import { useFetch } from "@/app/helper/hooks";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Drawer } from "antd";
import Image from "next/image";
import { Collapse } from "antd";
import VisaForm from "@/app/components/common/visaForm";
import { RiArrowDropDownLine } from "react-icons/ri";
import CommonContact from "@/app/components/common/commonConatc";
import Banner2 from "@/app/components/site/common/component/Banner2";
const VisaDetails = () => {
  const i18n = useI18n();
  const { langCode } = useI18n();
  const [data, getData] = useFetch(getAllPublicVisa, {}, false);
  const params = useParams();
  const { id } = params;
  const [activePanel, setActivePanel] = useState(null);
  const handlePanelChange = (key) => {
    setActivePanel(key);
  };
  useEffect(() => {
    getData({ _id: id });
  }, [id]);
  const [openDrawer, setOpenDrawer] = useState(false);
  const blogDetailsData1 = [
    {
      heading: "Visa Type",
      title: `${data?.visa_type?.name?.[langCode]}`,
      image: "/theme1/visa/student.png",
    },
    {
      heading: "Language",
      title: `${data?.language}`,
      image: "/theme1/visa/lan.png",
    },
    {
      heading: "Validity",
      title: `${data?.validity}`,
      image: "/theme1/blog/watch.png",
    },
  ];
  const blogDetailsData2 = [
    {
      heading: "Processing Time",
      title: `${data?.processing_type}`,
      image: "/theme1/visa/process.png",
    },
    {
      heading: "Visa Mode",
      title: `${data?.visa_mode}`,
      image: "/theme1/visa/mode.png",
    },
    {
      heading: "County",
      title: `${data?.country}`,
      image: "/theme1/visa/globe.png",
    },
  ];

  const [data1] = useFetch(fetchPageContentTheme1, {
    status: true,
  });
  const theme = data1?.theme;

  return (
    <div className="">
      {
        theme === 'one' ?
          <Banner title="Visa Details" /> :
          <Banner2 title="Visa Details" />
      }
      <div className="travel-container xl:mt-[106px] lg:mt-[90px] md:mt-20 xm:mt-16 mt-12 pb-20 relative">
        <div className="w-full rounded-[10px] lg:rounded-[20px] overflow-hidden">
          {data?.banner_image && (
            <Image
              src={data?.banner_image}
              alt="Image"
              width={2000}
              height={2000}
              className="w-[1320px] xl:h-[560px] lg:h-[400px] md:h-[300px] h-[250px] object-cover rounded-[10px] lg:rounded-[20px]"
            />
          )}
        </div>
        {/* Filter icon for mobile */}
        <div className="flex gap-2 items-center justify-end lg:hidden my-4 md:my-6">
          <button
            className="text-xl p-2 border border-gray-300 rounded-md"
            onClick={() => setOpenDrawer(true)}
          >
            <Image
              src="/theme1/filter.png"
              alt="Filter"
              width={20}
              height={20}
              className="w-[20px] h-[20px]"
            />
          </button>
          <p className="heading-1 text-[#000000]">{i18n.t("Filters")}</p>
        </div>
        {/* Drawer for filters */}
        <Drawer
          title={i18n.t("Filters")}
          onClose={() => setOpenDrawer(false)}
          open={openDrawer}
          className="sm:hidden"
        >
          <VisaForm />
        </Drawer>
        <div className="flex xl:gap-14 lg:gap-6 md:gap-4 gap-3 xl:mt-10 lg:mt-8 md:mt-6 mt-5">
          <div className="w-full lg:w-[70%]">
            <div>
              <div className="p-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:gap-4 lg:gap-3 md:gap-2 gap-6 sm:border-b">
                {blogDetailsData1?.map((item, index) => (
                  <div
                    key={index}
                    className={`${index === 0 ? "" : "justify-start sm:justify-center"
                      }  flex lg:gap-3 gap-2 last:border-0 sm:border-r`}
                  >
                    <div className="w-14 h-14 flex justify-center items-center rounded-full bg-[#FEF5EE]">
                      <Image
                        src={item?.image}
                        alt="Book"
                        width={1000}
                        height={1000}
                        className={`object-cover h-full w-full p-3`}
                      />
                    </div>
                    <div>
                      <h3 className="description-1 !font-medium text-[#717171]">
                        {i18n.t(item?.heading)}
                      </h3>
                      <p className="description-2 !font-bold text-[#05073C]">
                        {item?.title}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:gap-4 lg:gap-3 md:gap-2 gap-6">
                {blogDetailsData2?.map((item, index) => (
                  <div
                    key={index}
                    className={`${index === 0 ? "" : "justify-start sm:justify-center"
                      }  flex lg:gap-3 gap-2 last:border-0 sm:border-r`}
                  >
                    <div className="w-14 h-14 flex justify-center items-center rounded-full bg-[#FEF5EE]">
                      <Image
                        src={item?.image}
                        alt="Book"
                        width={1000}
                        height={1000}
                        className={`object-cover h-full w-full p-3`}
                      />
                    </div>
                    <div>
                      <h3 className="description-1 !font-medium text-[#717171]">
                        {i18n.t(item?.heading)}
                      </h3>
                      <p className="description-2 !font-bold text-[#05073C]">
                        {item?.title}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div>
                <p className="heading-3 !font-bold text-[#05073C] xl:mt-10 lg:mt-8 md:mt-6 mt-5">
                  {i18n.t("Visa Overview")}
                </p>
                <p
                  className="description-1 text-[#717171] xl:mt-6 lg:mt-5 md:mt-4 mt-3"
                  dangerouslySetInnerHTML={{ __html: data?.overview?.[langCode] }}
                />
              </div>
              <div>
                <p className="heading-3 !font-bold text-[#05073C] xl:mt-[60px] lg:mt-10 md:mt-8 mt-6">
                  {i18n.t("Required Documents")}
                </p>
                <p className="description-1 text-[#717171] xl:mt-6 lg:mt-5 md:mt-4 mt-3">
                  {data?.document_about?.[langCode]}
                </p>
              </div>
              <div className="space-y-2 mt-6">
                {data?.documents?.map((doc, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <Image
                      src={"/theme1/visa/okay.svg"}
                      alt="check"
                      width={24}
                      height={24}
                      className="mt-1 w-6 h-6"
                    />
                    <p className="text-base text-[#717171] mt-[2px] flex items-center">
                      <span className="font-semibold text-[#05073C] mr-2">
                        {doc?.key?.[langCode]}:{" "}
                      </span>
                      {doc?.value?.[langCode]}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="w-full lg:w-[30%] hidden lg:block">
            <VisaForm id={data?._id} />
          </div>
        </div>
        <div className="overflow-hidden xl:mt-10 lg:mt-8 md:mt-6 mt-5 flex justify-between lg:gap-6 md:gap-4 gap-2">
          {data?.card_image && (
            <Image
              src={data?.card_image}
              alt="Book"
              width={1000}
              height={1000}
              className="object-cover w-[648px] xl:h-[440px] lg:h-[380px] md:h-[300px] h-[150px] rounded-[10px] lg:rounded-[20px]"
            />
          )}
          {data?.images[0] && (
            <Image
              src={data?.images[0]}
              alt="Book"
              width={1000}
              height={1000}
              className="object-cover w-[648px] xl:h-[440px] lg:h-[380px] md:h-[300px] h-[150px] rounded-[10px] lg:rounded-[20px]"
            />
          )}
        </div>
        <div className="w-full xl:mt-[60px] lg:mt-10 md:mt-8 mt-6 flex flex-col lg:flex-row xl:gap-[136px] lg:gap-12 md:gap-10 sm:gap-6 gap-8">
          {/*start faq */}
          <div className="lg:w-[70%] w-full">
            <div className="faq">
              <Collapse
                accordion
                onChange={handlePanelChange}
                expandIconPosition="end"
                expandIcon={({ isActive }) => (
                  <RiArrowDropDownLine
                    style={{
                      fontSize: "30px",
                      color: isActive ? "#EF8248" : "#05073C",
                      transform: `rotate(${isActive ? 180 : 0}deg)`,
                      transition: "transform 0.5s ease",
                    }}
                  />
                )}
              >
                {data?.faqs?.map((item, index) => (
                  <Collapse.Panel
                    key={item?._id}
                    header={
                      <p
                        className={`description-3 ${activePanel == item?._id
                          ? "text-primary"
                          : "text-[#05073C]"
                          }`}
                      >
                        <span> 0{index + 1}. </span>
                        {item?.heading?.[langCode]}
                      </p>
                    }
                    className="py-2"
                  >
                    <p className="text-[#717171] description-2">
                      {item?.description?.[langCode]}
                    </p>
                  </Collapse.Panel>
                ))}
              </Collapse>
            </div>
          </div>
          <div className="lg:w-[30%] w-full">
            <CommonContact />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisaDetails;
