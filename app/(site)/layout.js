/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { usePathname, useRouter } from "next/navigation";
import Footer from "../components/site/layout/footer";
import I18nProvider from "../contexts/i18n";
import Providers from "../provider/userProvider";
import { fetchPageContentTheme1, fetchPublicSettings } from "../helper/backend";
import { useEffect, useState } from "react";
import { useFetch } from "../helper/hooks";
import axios from "axios";
import { LayoutLoader } from "../(dashboard)/components/common/loader";
import Navbar from "../components/site/layout/navbar";
import { SkeletonTheme } from "react-loading-skeleton";
import Navbar2 from "../components/site/layout/navbar2";
import WhatsappChat from "../(dashboard)/components/common/whatsapp";
const Layout = ({ children }) => {
  const [setting, getSetting] = useFetch(fetchPublicSettings);
  const [data] = useFetch(fetchPageContentTheme1, { status: true });
  useEffect(() => {
    getSetting();
  }, []);

  const [dataTheme, getDataTheme] = useFetch(fetchPageContentTheme1, {
    status: true,
  });
  useEffect(() => {
    getDataTheme();
  }, []);
  //for env
  const [loading, setLoading] = useState(true);
  const [animateOut, setAnimateOut] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkEnvFile = async () => {
      const { data } = await axios.get(
        process.env.BACKEND_URL + "/api/v1/settings/env-checks"
      );
      if (data?.data?.status === true && data?.data?.env === false) {
        return router.push("/setting");
      }
    };
    checkEnvFile();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimateOut(true);
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }, 50);

    return () => clearTimeout(timer);
  }, []);

  const theme = data?.theme || "one";
  const pathname = usePathname();
  const isHomepage = pathname === "/";
  const isSetting = pathname === "/setting";
  const textMainPaths = [
    "/payment/package/stripe/success",
    "/payment/package/paypal/success",
    "/payment/package/razorpay/success",
    "/payment/hotel/stripe/success",
    "/payment/hotel/paypal/success",
    "/payment/hotel/razorpay/success",
    "/payment/product/stripe/success",
    "/payment/product/paypal/success",
    "/payment/product/razorpay/success",
    "/payment/failed",
  ];

  const isTextMain = isSetting || textMainPaths.includes(pathname);

  let bgColor = "bg-transparent";
  if (isHomepage && theme === "one") {
    bgColor = "bg-[#FFFFFF]";
  }

  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <LayoutLoader />
      </div>
    );
  }
  return (
    <div>
      <I18nProvider>
        <SkeletonTheme color="#0F172A" highlightColor="#444">
          <Providers>
            {theme === "one" ? (
              <Navbar
                textColor={isTextMain ? "text-[#05073C]" : "text-white"}
              />
            ) : (
              <Navbar2
                textColor={isTextMain ? "text-[#05073C]" : "text-white"}
              />
            )}

            {children}
            <WhatsappChat />
            <Footer />
          </Providers>
        </SkeletonTheme>
      </I18nProvider>
    </div>
  );
};

export default Layout;
