'use client';
import React, { createContext, useContext, useState, useEffect } from "react";
import { useFetch } from "../helper/hooks";
import { fetchPublicSettings } from "../helper/backend";

// Currency configuration - 50+ currencies from around the world
const CURRENCIES = [
  // Asia
  { code: "BDT", symbol: "৳", label: "৳ BDT", country: "Bangladesh" },
  { code: "USD", symbol: "$", label: "$ USD", country: "United States" },
  { code: "AED", symbol: "د.إ", label: "د.إ AED", country: "UAE" },
  
  { code: "INR", symbol: "₹", label: "₹ INR", country: "India" },
  { code: "PKR", symbol: "₨", label: "₨ PKR", country: "Pakistan" },
  { code: "LKR", symbol: "Rs", label: "Rs LKR", country: "Sri Lanka" },
  { code: "THB", symbol: "฿", label: "฿ THB", country: "Thailand" },
  { code: "MYR", symbol: "RM", label: "RM MYR", country: "Malaysia" },
  { code: "SGD", symbol: "S$", label: "S$ SGD", country: "Singapore" },
  { code: "IDR", symbol: "Rp", label: "Rp IDR", country: "Indonesia" },
  { code: "PHP", symbol: "₱", label: "₱ PHP", country: "Philippines" },
  { code: "VND", symbol: "₫", label: "₫ VND", country: "Vietnam" },
  { code: "CNY", symbol: "¥", label: "¥ CNY", country: "China" },
  { code: "JPY", symbol: "¥", label: "¥ JPY", country: "Japan" },
  { code: "KRW", symbol: "₩", label: "₩ KRW", country: "South Korea" },
  { code: "HKD", symbol: "HK$", label: "HK$ HKD", country: "Hong Kong" },
  { code: "TWD", symbol: "NT$", label: "NT$ TWD", country: "Taiwan" },
  
  // Middle East
  
  { code: "SAR", symbol: "﷼", label: "﷼ SAR", country: "Saudi Arabia" },
  { code: "QAR", symbol: "ر.ق", label: "ر.ق QAR", country: "Qatar" },
  { code: "OMR", symbol: "ر.ع.", label: "ر.ع. OMR", country: "Oman" },
  { code: "KWD", symbol: "د.ك", label: "د.ك KWD", country: "Kuwait" },
  { code: "BHD", symbol: "د.ب", label: "د.ب BHD", country: "Bahrain" },
  { code: "ILS", symbol: "₪", label: "₪ ILS", country: "Israel" },
  { code: "TRY", symbol: "₺", label: "₺ TRY", country: "Turkey" },
  
  // Europe
  { code: "EUR", symbol: "€", label: "€ EUR", country: "Eurozone" },
  { code: "GBP", symbol: "£", label: "£ GBP", country: "United Kingdom" },
  { code: "CHF", symbol: "CHF", label: "CHF CHF", country: "Switzerland" },
  { code: "SEK", symbol: "kr", label: "kr SEK", country: "Sweden" },
  { code: "NOK", symbol: "kr", label: "kr NOK", country: "Norway" },
  { code: "DKK", symbol: "kr", label: "kr DKK", country: "Denmark" },
  { code: "PLN", symbol: "zł", label: "zł PLN", country: "Poland" },
  { code: "CZK", symbol: "Kč", label: "Kč CZK", country: "Czech Republic" },
  { code: "HUF", symbol: "Ft", label: "Ft HUF", country: "Hungary" },
  { code: "RON", symbol: "lei", label: "lei RON", country: "Romania" },
  { code: "RUB", symbol: "₽", label: "₽ RUB", country: "Russia" },
  
  // Americas
  
  { code: "CAD", symbol: "C$", label: "C$ CAD", country: "Canada" },
  { code: "MXN", symbol: "$", label: "$ MXN", country: "Mexico" },
  { code: "BRL", symbol: "R$", label: "R$ BRL", country: "Brazil" },
  { code: "ARS", symbol: "$", label: "$ ARS", country: "Argentina" },
  { code: "CLP", symbol: "$", label: "$ CLP", country: "Chile" },
  { code: "COP", symbol: "$", label: "$ COP", country: "Colombia" },
  { code: "UYU", symbol: "$U", label: "$U UYU", country: "Uruguay" },
  
  // Africa
  { code: "EGP", symbol: "£", label: "£ EGP", country: "Egypt" },
  { code: "ZAR", symbol: "R", label: "R ZAR", country: "South Africa" },
  { code: "NGN", symbol: "₦", label: "₦ NGN", country: "Nigeria" },
  { code: "GHS", symbol: "GH₵", label: "GH₵ GHS", country: "Ghana" },
  { code: "KES", symbol: "KSh", label: "KSh KES", country: "Kenya" },
  
  // Oceania
  { code: "AUD", symbol: "A$", label: "A$ AUD", country: "Australia" },
  { code: "NZD", symbol: "NZ$", label: "NZ$ NZD", country: "New Zealand" },
];

// Fallback static rates (1 BDT = X foreign currency)
// These are used only when the live API fails
const FALLBACK_RATES = {
  BDT: 1,
  USD: 1 / 110,
  EUR: 1 / 120,
  JPY: 1 / 0.73,
  GBP: 1 / 140,
  INR: 100 / 110,
  AED: 0.04,
  SAR: 0.04,
  CAD: 1 / 85,
  AUD: 1 / 75,
  THB: 0.39,
  SGD: 1 / 85,
  MYR: 0.24,
  HKD: 1 / 14,
  KRW: 1 / 0.084,
  CNY: 1 / 15,
  PHP: 0.62,
  IDR: 1 / 0.0068,
  VND: 1 / 0.0043,
  PKR: 1 / 3.05,
  LKR: 1 / 3.60,
  CHF: 1 / 100,
  SEK: 1 / 11,
  NOK: 1 / 11,
  DKK: 1 / 16,
  PLN: 1 / 28,
  CZK: 1 / 25,
  HUF: 1 / 0.39,
  RON: 1 / 25,
  RUB: 1 / 0.12,
  QAR: 0.04,
  OMR: 0.04,
  KWD: 0.035,
  BHD: 0.036,
  ILS: 1 / 40,
  TRY: 1 / 3.5,
  EGP: 1 / 5.5,
  ZAR: 1 / 6.5,
  NGN: 1 / 0.084,
  GHS: 1 / 0.088,
  KES: 1 / 0.76,
  MXN: 1 / 6.5,
  BRL: 1 / 22,
  ARS: 1 / 0.56,
  CLP: 1 / 0.13,
  COP: 1 / 0.027,
  UYU: 1 / 4.2,
  TWD: 1 / 3.45,
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
          // Build rates object for all currencies dynamically
          const newRates = { BDT: 1 };
          CURRENCIES.forEach(currency => {
            if (currency.code !== "BDT") {
              newRates[currency.code] = json.rates[currency.code] || FALLBACK_RATES[currency.code] || 0;
            }
          });
          setRates(newRates);
        } else {
          setRates(FALLBACK_RATES);
        }
      } catch (e) {
        // silently fall back to static rates
        console.warn("Currency rate fetch failed, using fallback rates.", e);
        setRates(FALLBACK_RATES);
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
