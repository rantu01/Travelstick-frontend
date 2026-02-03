/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState } from "react";
import { Modal, Empty } from "antd";

import Expert1 from "../components/home1/expert1";
import { useFetch } from "../helper/hooks";
import {
  fetchPageContentTheme1,
  fetchPublicSettings,
  getAllPublicAdvertisement,
} from "../helper/backend";

import Newsletter from "../components/home1/newsletter";
import Hero from "../components/home1/hero";
import OffersSection from "../components/home1/specialOffers";
import Choose from "../components/home1/choose";
import VisaService from "../components/home1/visaService";
import WhoWeAre from "../components/home1/whoWe";
import Package from "../components/home1/package";
import PopularDestination from "../components/home1/popularDestination";
import Testimonials from "../components/home1/testimonials";
import Blog1 from "../components/home1/blog1";
import Partner from "../components/home1/partner";
import ProductSection from "../components/home1/productSection";

import Hero2 from "../components/home2/hero2";
import PopularDestination2 from "../components/home2/popularDestination2";
import Choose2 from "../components/home2/choose2";
import VisaService2 from "../components/home2/visaService2";
import WhoWeAre2 from "../components/home2/whoWe2";
import { Loader } from "../(dashboard)/components/common/loader";
import Advertisement from "../components/site/common/advertisement";
import { columnFormatter } from "../helper/utils";

export default function Home() {
  const [data, getData, { loading }] = useFetch(fetchPageContentTheme1, {
    status: true,
  });

  const [settings] = useFetch(fetchPublicSettings);
  const [ads, loadAds] = useFetch(getAllPublicAdvertisement, {}, false);
  const [isModalVisible, setIsModalVisible] = useState(() => {
    return !sessionStorage.getItem("modalShown");
  });


  useEffect(() => {
    getData();
    loadAds();
  }, []);

  useEffect(() => {
    if (isModalVisible) {
      sessionStorage.setItem("modalShown", "true");
    }
  }, [isModalVisible]);

  const theme = data?.theme || "one";
  const hasProduct = !!settings?.is_product_module;

  const sortedAds =
    ads?.docs?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) ||
    [];
  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  const ThemeOne = (
    <main className="flex flex-col 2xl:gap-[50px] xl:gap-[20px] md:gap-20 gap-10 ">
      <Hero data={data} />
      <div className="flex flex-col xl:gap-[80px] md:gap-20 gap-10 overflow-hidden">
        <OffersSection theme={theme} />
        <Partner />
        <PopularDestination />
        {/* <WhoWeAre theme={theme} /> */}
        <Package theme={"two"} />
        <VisaService />
        {/* <Choose /> */}
        {/* <Testimonials theme={theme} /> */}
        {/* <Expert1 theme={theme} /> */}
        {/* <ProductSection visible={hasProduct} theme={theme} /> */}
        {/* <Blog1 theme={theme} /> */}
        <Newsletter theme={theme} />
      </div>
    </main>
  );

  const ThemeTwo = (
    <main className="flex flex-col 2xl:gap-[150px] xl:gap-[120px] md:gap-20 gap-10 ">
      <Hero2 heroData={data} />
      <div className="flex flex-col xl:gap-[120px] md:gap-20 gap-10 overflow-hidden">
        <OffersSection theme={theme} />
        <PopularDestination2 />
        <WhoWeAre2 theme={theme} />
        <VisaService2 />
        <Package theme={theme} />
        <Choose2 />
        <Testimonials theme={theme} />
        <Expert1 theme={theme} />
        <ProductSection visible={hasProduct} theme={theme} />
        <Blog1 theme={theme} />
        <Newsletter theme={theme} />
      </div>
    </main>
  );

  return (
    <main className="flex flex-col">
      {theme === "two" ? ThemeTwo : ThemeOne}

      {isModalVisible && sortedAds?.length > 0 && (
        <Modal
          open={true} // already controlled by isModalVisible
          onCancel={() => setIsModalVisible(false)}
          footer={null}
          centered
          width={800}
          className="custom-modal"
        >
          <div className="flex justify-between items-center gap-4 w-full mt-6">
            {sortedAds?.slice(0, 3).map((item) => (
              <Advertisement
                key={item._id}
                id={item._id}
                title={columnFormatter(item.title)}
                image={item.image}
                link={item.redirect_url}
              />
            ))}
          </div>
        </Modal>
      )}
    </main>
  );
}
