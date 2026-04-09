"use client";
import TravelLandingPage from "@/app/components/theme1/login/TravelLandingPage";
import VisaPage from "@/app/components/theme1/visa/visa";
import { fetchPageContentTheme1 } from "@/app/helper/backend";
import { useFetch } from "@/app/helper/hooks";
import { useSearchParams } from "next/navigation";
const login = () => {
  
  return (
    <div>
      <TravelLandingPage  />
    </div>
  );
}

export default login;