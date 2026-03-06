"use client";
import ContactPage from "@/app/components/theme1/contact/contact";
import CustomTourRequest from "@/app/components/theme1/package/CustomTourRequest";
import { fetchPageContentTheme1 } from "@/app/helper/backend";
import { useFetch } from "@/app/helper/hooks";
const CustomTourRequestPage = () => {

  return (
    <div>
      <CustomTourRequest/>
    </div>
  );
};

export default CustomTourRequestPage;