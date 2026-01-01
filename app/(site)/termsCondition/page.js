
"use client";
import ContentPage from "@/app/components/theme1/contentPage/contentPage.js";
import { fetchPageContent, fetchPageContentTheme1 } from "@/app/helper/backend";
import { useFetch } from "@/app/helper/hooks";

const TermsCondition = () => {
  const [data] = useFetch(fetchPageContent, {
    slug: "terms_and_conditions",
  });

  const [data1] = useFetch(fetchPageContentTheme1, {
    status: true,
  });
  const theme = data1?.theme;

  return (
    <div>
      <ContentPage theme={theme} slug={"Terms & Conditions"} data={data} />
    </div>
  );
};

export default TermsCondition;
