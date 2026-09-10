"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { getUserProfile } from "@/app/actions";

type CurrencyContextType = {
  currency: string;
  currencySymbol: string;
  setCurrency: (currency: string) => void;
};

const CurrencyContext = createContext<CurrencyContextType>({
  currency: "USD",
  currencySymbol: "$",
  setCurrency: () => {},
});

export const useCurrency = () => useContext(CurrencyContext);

const getCurrencySymbol = (currencyCode: string) => {
  switch (currencyCode) {
    case "EUR": return "€";
    case "GBP": return "£";
    case "INR": return "₹";
    case "JPY": return "¥";
    case "USD":
    default:
      return "$";
  }
};

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState("USD");

  useEffect(() => {
    getUserProfile()
      .then((profile) => {
        if (profile && profile.currency) {
          setCurrencyState(profile.currency);
        }
      })
      .catch((error) => {
        // User not logged in, ignore the error
        console.log("No active session for currency.");
      });
  }, []);

  const setCurrency = (newCurrency: string) => {
    setCurrencyState(newCurrency);
  };

  return (
    <CurrencyContext.Provider value={{ 
      currency, 
      currencySymbol: getCurrencySymbol(currency), 
      setCurrency 
    }}>
      {children}
    </CurrencyContext.Provider>
  );
}
