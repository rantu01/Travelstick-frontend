
"use client";
import ContentPage from "@/app/components/theme1/contentPage/contentPage.js";
import { fetchPageContent } from "@/app/helper/backend";
import { useFetch } from "@/app/helper/hooks";

const PrivacyPolicy = () => {
  const [data] = useFetch(fetchPageContent, {
    slug: "privacy_policy",
  });
  return (
    <div>
      <ContentPage slug="Privacy & Policy" data={data} />
    </div>
  );
};

export default PrivacyPolicy;
