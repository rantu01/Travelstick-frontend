
"use client";
import ContentPage from "@/app/components/theme1/contentPage/contentPage.js";
import { fetchPageContent } from "@/app/helper/backend";
import { useFetch } from "@/app/helper/hooks";

const PrivacyPolicy = () => {
  const [data] = useFetch(fetchPageContent, {
    slug: "refund_policy",
  });
  return (
    <div>
      <ContentPage slug="Refund & Policy" data={data} />
    </div>
  );
};

export default PrivacyPolicy;
