"use client";
import { useI18n } from "@/app/contexts/i18n";
import { getAllPublicVisa } from "@/app/helper/backend";
import { useFetch } from "@/app/helper/hooks";
import { useParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { Drawer, Breadcrumb, Rate, Collapse } from "antd";
import Image from "next/image";
import VisaForm from "@/app/components/common/visaForm";
import { RiArrowDropDownLine } from "react-icons/ri";
import CommonContact from "@/app/components/common/commonConatc";
import { FiHeart, FiShare2, FiMapPin, FiCheckCircle } from "react-icons/fi";

const VisaDetails = () => {
  const i18n = useI18n();
  const { langCode, t } = useI18n();
  const [data, getData] = useFetch(getAllPublicVisa, {}, false);
  const params = useParams();
  const { id } = params;

  const [activePanel, setActivePanel] = useState(null);
  const [openDrawer, setOpenDrawer] = useState(false);

  // Refs for Scroll to Section
  const overviewRef = useRef(null);
  const infoRef = useRef(null);
  const faqRef = useRef(null);
  const reviewRef = useRef(null);

  useEffect(() => {
    getData({ _id: id });
  }, [id]);

  const scrollToSection = (ref) => {
    window.scrollTo({
      top: ref.current.offsetTop - 100,
      behavior: "smooth",
    });
  };

  const visaStats = [
    { label: "Visa Type", value: data?.visa_type?.name?.[langCode], img: "/theme1/visa/student.png" },
    { label: "Language", value: data?.language, img: "/theme1/visa/lan.png" },
    { label: "Validity", value: data?.validity, img: "/theme1/blog/watch.png" },
    { label: "Processing", value: data?.processing_type, img: "/theme1/visa/process.png" },
    { label: "Mode", value: data?.visa_mode, img: "/theme1/visa/mode.png" },
    { label: "Country", value: data?.country, img: "/theme1/visa/globe.png" },
  ];

  return (
    <div className="min-h-screen pb-20 ">
      {/* 1. Header Section (Title & Breadcrumb) */}
      <div className="bg-white">
        <div className="travel-container py-8">
          <Breadcrumb className="mb-3 text-sm"
            items={[
              { title: <a href="/">Home</a> },
              { title: <a href="/visa">Visa</a> },
              { title: "Visa Details" },
            ]}
          />
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-[#05073C] font-bold text-2xl md:text-3xl lg:text-4xl">
                {data?.country} {data?.visa_type?.name?.[langCode]} Visa From Bangladesh
              </h1>
              <div className="flex items-center gap-4 mt-3">
                <div className="flex items-center gap-1 text-[#717171] text-sm">
                  <FiMapPin className="text-primary" /> {data?.country}
                </div>
                <div className="flex items-center gap-2 border-l pl-4">
                  <Rate disabled defaultValue={4.5} className="text-xs text-orange-400" />
                  <span className="text-sm text-gray-500">(120 Reviews)</span>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 hover:bg-red-50 hover:text-red-500 transition-all">
                <FiHeart />
              </button>
              <button className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 hover:bg-blue-50 hover:text-blue-600 transition-all">
                <FiShare2 />
              </button>
            </div>
          </div>
        </div>

        {/* 2. Gallery Grid - Container width limited to 7xl or 6xl as requested */}
        <div className="travel-container pb-10">
          {/* 2. Gallery Grid - Image এর মতো ৩ কলাম ও ২ সারির লেআউট */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 h-[300px] md:h-[600px] overflow-hidden rounded-2xl mb-6">
            {/* বাম পাশের বড় ইমেজ */}
            <div className="md:col-span-3 md:row-span-2 h-full">
              <Image
                src={data?.banner_image || "/placeholder.jpg"}
                alt="Main"
                width={1200}
                height={800}
                className="w-full h-full object-cover transition-transform hover:scale-105 duration-700"
              />
            </div>

            {/* ডান পাশের উপরের ভিডিও/ইমেজ */}
            <div className="hidden md:block h-full relative group">
              <Image src={data?.banner_image || "/placeholder.jpg"} alt="sub-1" width={400} height={300} className="w-full h-full object-cover rounded-xl" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/50 cursor-pointer">
                  <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[12px] border-l-white border-b-[8px] border-b-transparent ml-1"></div>
                </div>
              </div>
            </div>

            {/* একদম ডানের উপরের ইমেজ */}
            <div className="hidden md:block h-full">
              <Image src={data?.banner_image || "/placeholder.jpg"} alt="sub-2" width={400} height={300} className="w-full h-full object-cover rounded-xl" />
            </div>

            {/* ডান পাশের নিচের বামের ইমেজ */}
            <div className="hidden md:block h-full">
              <Image src={data?.banner_image || "/placeholder.jpg"} alt="sub-3" width={400} height={300} className="w-full h-full object-cover rounded-xl" />
            </div>

            {/* একদম ডানের নিচের ইমেজ (See all photos overlay) */}
            <div className="hidden md:block h-full relative overflow-hidden rounded-xl group cursor-pointer">
              <Image src={data?.banner_image || "/placeholder.jpg"} alt="sub-4" width={400} height={300} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white transition-all group-hover:bg-black/50">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-sm font-semibold whitespace-nowrap">See all 9 photos</span>
              </div>
            </div>
          </div>

          {/* 4. Quick Stats Cards - ইমেজের মতো ক্লিন হোয়াইট লেআউট */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-sm">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">

              {/* Left Side: Visa Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-y-8 gap-x-12 flex-grow">
                {visaStats.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4">
                    {/* Icon Container */}
                    <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center relative">
                      {/* যদি প্রথম আইটেম (Visa Type) হয় তবে স্পেশাল গ্রাফিক্স ইফেক্ট যোগ করতে পারেন */}
                      {idx === 0 && (
                        <div className="absolute -top-2 -left-2 w-14 h-14 bg-gradient-to-br from-yellow-200/40 to-transparent rounded-full blur-lg -z-10"></div>
                      )}
                      <Image
                        src={item.img}
                        alt={item.label}
                        width={35}
                        height={35}
                        className="object-contain"
                      />
                    </div>

                    {/* Text Content */}
                    <div className="flex flex-col">
                      <p className="text-[13px] text-gray-400 font-normal leading-tight">
                        {t(item.label)}
                      </p>
                      <p className="text-[16px] font-bold text-[#05073C] mt-0.5 leading-tight">
                        {item.value || "N/A"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Right Side: Processing Fee - ইমেজের মতো ভার্টিক্যাল ডিভাইডার সহ */}
              <div className="w-full lg:w-auto flex justify-end items-center lg:border-l lg:border-gray-100 lg:pl-10 min-h-[60px]">
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 text-[15px] font-medium">Processing Fee:</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-[#28b6ea] text-2xl font-extrabold">৳ 9000</span>
                    <span className="text-gray-400 text-sm">/ person</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      <div className="travel-container mt-8">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* LEFT SIDE CONTENT */}
          <div className="w-full lg:w-[68%]">

            {/* Sticky Navigation Bar */}
            <div className="sticky top-16 z-50 bg-white border-b flex gap-8 mb-8 overflow-x-auto no-scrollbar px-4 shadow-sm">
              {[
                { label: "Details", ref: overviewRef },
                { label: "Other Information", ref: infoRef },
                { label: "FAQs", ref: faqRef },
                { label: "Reviews", ref: reviewRef },
              ].map((tab, idx) => (
                <button
                  key={idx}
                  onClick={() => scrollToSection(tab.ref)}
                  className="py-4 text-sm font-bold text-[#05073C] whitespace-nowrap border-b-2 border-transparent hover:border-primary hover:text-primary transition-all active:text-primary"
                >
                  {tab.label}
                </button>
              ))}
            </div>



            {/* 5. Visa Overview Section */}
            <div ref={overviewRef} className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm mb-8">
              <h2 className="text-2xl font-bold text-[#05073C] mb-5">Visa Overview</h2>
              <div
                className="text-[#717171] leading-relaxed text-[15px] space-y-4"
                dangerouslySetInnerHTML={{ __html: data?.overview?.[langCode] }}
              />
            </div>

            {/* 6. Required Documents Section */}
            <div ref={infoRef} className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm mb-8">
              <h2 className="text-2xl font-bold text-[#05073C] mb-4">Required Documents</h2>
              <p className="text-[#717171] mb-6">{data?.document_about?.[langCode]}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data?.documents?.map((doc, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 rounded-xl bg-[#F9FAFF] border border-blue-50">
                    <FiCheckCircle className="text-primary mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-bold text-[#05073C] text-sm mb-1">{doc?.key?.[langCode]}</p>
                      <p className="text-gray-500 text-xs leading-relaxed">{doc?.value?.[langCode]}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 7. FAQs Section */}
            <div ref={faqRef} className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm mb-8">
              <h2 className="text-2xl font-bold text-[#05073C] mb-6">Frequently Asked Questions</h2>
              <Collapse
                accordion
                expandIconPosition="end"
                className="bg-transparent border-none"
                expandIcon={({ isActive }) => (
                  <div className={`w-8 h-8 flex items-center justify-center rounded-full transition-all ${isActive ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500'}`}>
                    <RiArrowDropDownLine className={`text-3xl ${isActive ? 'rotate-180' : ''}`} />
                  </div>
                )}
              >
                {data?.faqs?.map((item, index) => (
                  <Collapse.Panel
                    key={item?._id}
                    header={<span className="font-bold text-[#05073C] text-md">0{index + 1}. {item?.heading?.[langCode]}</span>}
                    className="mb-4 border border-gray-100 rounded-xl overflow-hidden bg-white hover:border-primary/30 transition-all"
                  >
                    <p className="text-gray-500 text-[14px] leading-relaxed pl-2">{item?.description?.[langCode]}</p>
                  </Collapse.Panel>
                ))}
              </Collapse>
            </div>

            {/* Reviews Section Placeholder */}
            <div ref={reviewRef} className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm mb-8">
              <h2 className="text-2xl font-bold text-[#05073C] mb-6">Guest Reviews</h2>
              <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                <p>No reviews yet. Be the first to share your experience!</p>
              </div>
            </div>

          </div>

          {/* RIGHT SIDEBAR (Sticky Form) */}
          <div className="w-full lg:w-[32%]">
            <div className="sticky top-24">
              <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden mb-6">
                <div className="bg-primary p-6 text-white">
                  <p className="text-xs uppercase font-bold opacity-80 mb-1 tracking-widest">Apply Online</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black">৳ 4,000</span>
                    <span className="text-sm opacity-80">/ Per Person</span>
                  </div>
                </div>
                <div className="p-6">
                  <VisaForm id={data?._id} />
                </div>
              </div>

              {/* --- নতুন ডিজাইন করা সেকশন (হুবহু ইমেজের মতো) --- */}
              {/* --- নতুন ডিজাইন করা সেকশন (হুবহু ইমেজের মতো) --- */}
              <div className="space-y-6 mb-6 ">
                {/* You May Like Tour Section */}
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-2 mb-5">
                    <h3 className="text-[#05073C] font-bold text-sm uppercase tracking-wide whitespace-nowrap">You May Like Tour</h3>
                    <div className="h-[1px] bg-gray-100 w-full"></div>
                  </div>

                  <div className="space-y-5">
                    {[
                      {
                        title: "Urban & Island Escape: Manila to Boracay",
                        price: "59,900",
                        days: "6 Days",
                        img: "https://img.freepik.com/free-psd/travel-tourism-socila-media-template-with-photo-frame_47987-20749.jpg?semt=ais_user_personalization&w=740&q=80"
                      },
                      {
                        title: "Turkey Tour Package: Istanbul & Cappadocia",
                        price: "2,50,900",
                        days: "6 Days",
                        img: "https://img.freepik.com/free-psd/travel-tourism-socila-media-template-with-photo-frame_47987-20749.jpg?semt=ais_user_personalization&w=740&q=80"
                      },
                      {
                        title: "The Best of Sri Lanka & Malaysia Colombo",
                        price: "35,900",
                        days: "6 Days",
                        img: "https://img.freepik.com/free-psd/travel-tourism-socila-media-template-with-photo-frame_47987-20749.jpg?semt=ais_user_personalization&w=740&q=80"
                      },
                    ].map((item, idx) => (
                      <div key={idx} className="flex gap-3 group cursor-pointer">
                        <div className="relative w-20 h-20 flex-shrink-0 overflow-hidden rounded-xl">
                          <Image src={item.img} alt="tour" fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                        </div>
                        <div className="flex flex-col justify-between py-0.5">
                          <h4 className="text-[#05073C] font-bold text-[13px] leading-snug line-clamp-2 group-hover:text-[#28b6ea] transition-colors">
                            {item.title}
                          </h4>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="bg-[#28b6ea] text-white text-[11px] font-bold px-2 py-1 rounded">
                              ৳ {item.price}
                            </span>
                            <span className="bg-[#28b6ea] text-white text-[11px] font-bold px-2 py-1 rounded">
                              {item.days}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* You May Like Hajj Umrah Section */}
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-2 mb-5">
                    <h3 className="text-[#05073C] font-bold text-sm uppercase tracking-wide whitespace-nowrap">You May Like Hajj Umrah</h3>
                    <div className="h-[1px] bg-gray-100 w-full"></div>
                  </div>

                  <div className="space-y-5">
                    {[
                      {
                        title: "Noor-e-Haram Journey 10 Nights & 11 Days Umrah",
                        price: "1,95,000",
                        days: "11 Days",
                        img: "https://img.freepik.com/free-psd/travel-tourism-socila-media-template-with-photo-frame_47987-20749.jpg?semt=ais_user_personalization&w=740&q=80"
                      },
                      {
                        title: "40 Days Cheap Hajj Package from Bangladesh",
                        price: "6,00,000",
                        days: "41 Days",
                        img: "https://img.freepik.com/free-psd/travel-tourism-socila-media-template-with-photo-frame_47987-20749.jpg?semt=ais_user_personalization&w=740&q=80"
                      },
                    ].map((item, idx) => (
                      <div key={idx} className="flex gap-3 group cursor-pointer">
                        <div className="relative w-20 h-20 flex-shrink-0 overflow-hidden rounded-xl">
                          <Image src={item.img} alt="hajj" fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                        </div>
                        <div className="flex flex-col justify-between py-0.5">
                          <h4 className="text-[#05073C] font-bold text-[13px] leading-snug line-clamp-2 group-hover:text-[#28b6ea] transition-colors">
                            {item.title}
                          </h4>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="bg-[#28b6ea] text-white text-[11px] font-bold px-2 py-1 rounded">
                              ৳ {item.price}
                            </span>
                            <span className="bg-[#28b6ea] text-white text-[11px] font-bold px-2 py-1 rounded">
                              {item.days}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <CommonContact />
              </div> */}
            </div>
          </div>

        </div>
      </div>

      {/* Mobile Sticky CTA */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white p-4 border-t z-50 flex items-center justify-between shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
        <div>
          <p className="text-xs text-gray-400 font-bold uppercase">Price Starts From</p>
          <p className="text-xl font-black text-primary">৳ 4,000</p>
        </div>
        <button
          onClick={() => setOpenDrawer(true)}
          className="bg-primary text-white px-8 py-3 rounded-xl font-bold text-sm shadow-lg active:scale-95 transition-all"
        >
          Apply Now
        </button>
      </div>

      <Drawer
        title={<span className="font-bold text-lg">Apply Visa</span>}
        onClose={() => setOpenDrawer(false)}
        open={openDrawer}
        width="100%"
        closeIcon={<RiArrowDropDownLine className="rotate-90 text-2xl" />}
      >
        <VisaForm id={data?._id} />
      </Drawer>
    </div>
  );
};

export default VisaDetails;