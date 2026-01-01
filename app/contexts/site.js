'use client';
import React, { createContext, useContext } from "react";
import { useFetch } from "../helper/hooks";
import { fetchPublicSettings } from "../helper/backend";

const SiteContext = createContext(null);
const SiteProvider = (props) => {
  const [sitedata, getSiteData] = useFetch(fetchPublicSettings);
  const siteSettingsData = {
    currency_symbol: sitedata?.currency_symbol || "$",
    getSiteData,
  };

  return React.createElement(SiteContext.Provider, { value: siteSettingsData }, props.children);
};

export const useCurrency = () => {
  const context = useContext(SiteContext);
  if (!context) {
    throw new Error("useCurrency must be used within a SiteProvider");
  }
  return context;
};

export default SiteProvider;
