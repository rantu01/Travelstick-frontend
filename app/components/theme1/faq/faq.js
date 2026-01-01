'use client';
import Banner from "@/app/components/site/common/component/Banner";
import { fetchFAQ, fetchPageContentTheme1 } from "@/app/helper/backend";
import { useFetch } from "@/app/helper/hooks";
import { Collapse } from "antd";
import { useState } from "react";
import { RiArrowDropDownLine } from "react-icons/ri";
import SectionHeaderPage from "../../common/sectionHeader";
import { useI18n } from "@/app/contexts/i18n";
import Banner2 from "../../site/common/component/Banner2";
import SectionHeaderPage2 from "../../common/sectionHeader2";

const FAQPage = () => {
  const [data] = useFetch(fetchFAQ);
  const [activePanel, setActivePanel] = useState(null);
  const { langCode } = useI18n();
  const [faqData] = useFetch(fetchPageContentTheme1);
  const faq = faqData?.content?.faq;

  const handlePanelChange = (key) => {
    setActivePanel(key);
  };

  const items = data?.map((item) => ({
    key: item?._id,
    label: (
      <span className={`description-3 ${activePanel == item?._id ? 'text-primary' : 'text-[#05073C]'}`}>
        {item?.question?.[langCode]}
      </span>
    ),
    children: (
      <p className="text-[#717171] description-2">
        {item?.answer?.[langCode]}
      </p>
    ),
    className: 'py-2',
  }));

  const [data1] = useFetch(fetchPageContentTheme1, {
    status: true,
  });
  const theme = data1?.theme;

  return (
    <div>
      <div>
        {
          theme === 'one' ?
            <Banner title="FAQ" /> :
            <Banner2 title="FAQ" />
        }
        <div className='travel-container xl:mt-[106px] lg:mt-[90px] md:mt-20 xm:mt-16 mt-12 relative'>
          {
            theme === 'one' ?
              <SectionHeaderPage
                maxWidth="max-w-[680px]"
                align="right"
                title={faq?.heading?.[langCode]}
                heading={faq?.title?.[langCode]}
                description={faq?.offer_description?.[langCode]}
              /> :
              <SectionHeaderPage2
                maxWidth="max-w-[680px]"
                align="right"
                title={faq?.heading?.[langCode]}
                heading={faq?.title?.[langCode]}
                description={faq?.offer_description?.[langCode]}
              />
          }

          <div className="mt-6 sm:mt-7 lg:mt-9 xl:mt-[44px]">
            <div className="faq">
              <Collapse
                accordion
                onChange={handlePanelChange}
                expandIconPosition="end"
                items={items}
                expandIcon={({ isActive }) => (
                  <RiArrowDropDownLine
                    style={{
                      fontSize: '30px',
                      color: isActive ? '#EF8248' : '#05073C',
                      transform: `rotate(${isActive ? 180 : 0}deg)`,
                      transition: 'transform 0.5s ease',
                    }}
                  />
                )}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
