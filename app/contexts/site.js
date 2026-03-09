'use client';
import React, { createContext, useContext, useState, useEffect } from "react";
import { useFetch } from "../helper/hooks";
import { fetchPublicSettings } from "../helper/backend";

// Currency configuration
const CURRENCIES = [
  { code: "BDT", symbol: "৳", label: "৳ BDT" },
  { code: "USD", symbol: "$", label: "$ USD" },
  { code: "EUR", symbol: "€", label: "€ EUR" },
  { code: "JPY", symbol: "¥", label: "¥ JPY" },
];

// Fallback static rates (1 BDT = X foreign currency)
// These are used only when the live API fails
const FALLBACK_RATES = {
  BDT: 1,
  USD: 1 / 110,   // approx 1 USD = 110 BDT
  EUR: 1 / 120,   // approx 1 EUR = 120 BDT
  JPY: 1 / 0.73,  // approx 1 JPY = 0.73 BDT
};

const SiteContext = createContext(null);

const SiteProvider = (props) => {
  const [sitedata, getSiteData] = useFetch(fetchPublicSettings);

  // selectedCurrency: "BDT", "USD", "EUR", or "JPY"
  const [selectedCurrency, setSelectedCurrencyState] = useState("BDT");

  // Live exchange rates (base: BDT), e.g. { USD: 0.0091, EUR: 0.0083, JPY: 1.37 }
  const [rates, setRates] = useState(FALLBACK_RATES);
  const [ratesLoading, setRatesLoading] = useState(true);

  // Load saved currency from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("currency");
    if (CURRENCIES.some(c => c.code === saved)) {
      setSelectedCurrencyState(saved);
    }
  }, []);

  // Fetch live exchange rates from open.er-api.com (free, no API key, supports BDT)
  useEffect(() => {
    const fetchRates = async () => {
      try {
        setRatesLoading(true);
        const res = await fetch("https://open.er-api.com/v6/latest/BDT");
        const json = await res.json();
        if (json?.result === "success" && json?.rates) {
          setRates({
            BDT: 1,
            USD: json.rates["USD"] || FALLBACK_RATES.USD,
            EUR: json.rates["EUR"] || FALLBACK_RATES.EUR,
            JPY: json.rates["JPY"] || FALLBACK_RATES.JPY,
          });
        }
      } catch (e) {
        // silently fall back to static rates
        console.warn("Currency rate fetch failed, using fallback rates.");
      } finally {
        setRatesLoading(false);
      }
    };
    fetchRates();
  }, []);

  const setCurrency = (cur) => {
    setSelectedCurrencyState(cur);
    localStorage.setItem("currency", cur);
  };

  // Get the symbol for the selected currency
  const currencyInfo = CURRENCIES.find(c => c.code === selectedCurrency) || CURRENCIES[0];
  const currency_symbol = currencyInfo.symbol;

  // formatPrice: takes a BDT amount, converts and formats according to selectedCurrency
  const formatPrice = (bdtAmount) => {
    if (bdtAmount === null || bdtAmount === undefined || isNaN(Number(bdtAmount))) {
      return `${currency_symbol} —`;
    }
    const num = Number(bdtAmount);
    const rate = rates[selectedCurrency] ?? 1;
    const converted = num * rate;

    if (selectedCurrency === "BDT") {
      return `৳ ${Math.round(converted).toLocaleString()}`;
    } else if (selectedCurrency === "JPY") {
      return `¥ ${Math.round(converted).toLocaleString()}`;
    } else {
      // USD, EUR - show 2 decimals
      return `${currency_symbol} ${converted.toFixed(2)}`;
    }
  };

  const siteSettingsData = {
    currency_symbol,
    selectedCurrency,
    setCurrency,
    formatPrice,
    rates,
    ratesLoading,
    currencies: CURRENCIES,
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
