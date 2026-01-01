'use client';
import Banner from "@/app/components/site/common/component/Banner";
import { useI18n } from "@/app/contexts/i18n";
import Banner2 from "../../site/common/component/Banner2";
const ContentPage = ({ data, slug, theme }) => {
  const { langCode } = useI18n();
  const i18n = useI18n();
  return (
    <div className="">
      {
        theme === 'one' ?
          <Banner title={slug} /> :
          <Banner2 title={slug} />
      }
      <div className="travel-container xl:mt-[106px] lg:mt-[90px] md:mt-20 xm:mt-16 mt-12">
        <h1 className="heading-5 text-[#171717]">{i18n.t(slug)}</h1>
        <p
          className="description text-[#171717] pt-8 pb-40"
          dangerouslySetInnerHTML={{
            __html: data?.content?.description?.[langCode],
          }}
        />
      </div>
    </div>
  );
};

export default ContentPage;