"use client";
import { useEffect } from "react";
import DynamicFavicon from "./components/dynamicFavicon";
import I18nProvider from "./contexts/i18n";
import SiteProvider from "./contexts/site";
import Providers from "./provider/userProvider";
import "./styles/globals.scss";
import { useFetch } from "./helper/hooks";
import { fetchPublicSettings } from "./helper/backend";
import { CartProvider } from "./contexts/cartContext";

export default function RootLayout({ children }) {
  const [data, getData] = useFetch(fetchPublicSettings);
  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (data?.site_name) {
      document.title = data?.site_name;
    }
  }, [data]);

  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <I18nProvider>
          <CartProvider>
          <Providers>
            <SiteProvider>
              <DynamicFavicon />
              {children}
            </SiteProvider>
          </Providers>
          </CartProvider>
        </I18nProvider>
      </body>
    </html>
  );
}

