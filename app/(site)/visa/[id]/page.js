"use client";
import { useI18n } from "@/app/contexts/i18n";
import { getAllPublicVisa, getAllPublicPackages } from "@/app/helper/backend";
import { useFetch } from "@/app/helper/hooks";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { Drawer, Breadcrumb, Rate, Collapse } from "antd";
import Image from "next/image";
import VisaForm from "@/app/components/common/visaForm";
import { RiArrowDropDownLine } from "react-icons/ri";
import { FiShare2, FiX, FiChevronLeft, FiChevronRight, FiCheck } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { useCurrency } from "@/app/contexts/site";

const countryToCode = {
  "usa": "us",
  "united states": "us",
  "japan": "jp",
  "australia": "au",
  "bangladesh": "bd",
  "canada": "ca",
  "uk": "gb",
  "united kingdom": "gb",
  "turkey": "tr",
  "costa rica": "cr",
  "india": "in",
  "germany": "de",
  "france": "fr",
  "malaysia": "my",
  "uae": "ae",
  "united arab emirates": "ae",
  "italy": "it",
  "china": "cn",
  "thailand": "th",
  "singapore": "sg",
};

const VisaDetails = () => {
  const { langCode, t } = useI18n();
  const [data, getData] = useFetch(getAllPublicVisa, {}, false);
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  const [packages, getPackages] = useFetch(getAllPublicPackages, { limit: 3 }, false);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [copied, setCopied] = useState(false);

  const countryName = data?.travelling_to?.toLowerCase() || "";
  const countryCode = countryToCode[countryName] || "un";

  const [openDrawer, setOpenDrawer] = useState(false);

  const overviewRef = useRef(null);
  const otherInfoRef = useRef(null);
  const faqRef = useRef(null);
  const reviewRef = useRef(null);

  useEffect(() => {
    getData({ _id: id });
    getPackages();
  }, [id]);

  const allImages = useMemo(() => {
    const images = [];
    if (data?.banner_image) images.push(data.banner_image);
    if (data?.images && Array.isArray(data.images)) {
      images.push(...data.images);
    }
    return images;
  }, [data]);

  const nextImage = useCallback((e) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % allImages.length);
  }, [allImages.length]);

  const prevImage = useCallback((e) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  }, [allImages.length]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (currentIndex === null) return;
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
      if (e.key === "Escape") setCurrentIndex(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, nextImage, prevImage]);

  const scrollToSection = (ref) => {
    if (ref.current) {
      window.scrollTo({ top: ref.current.offsetTop - 100, behavior: "smooth" });
    }
  };

  const handleShare = useCallback(() => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  }, []);

  // visaStats array টা এভাবে replace করো

  const visaStats = [
    { label: "Visa Type", value: data?.visa_type?.name?.[langCode], img: "/theme1/visa/student.png" },
    { label: "Travelling To", value: data?.travelling_to, img: "/theme1/visa/globe.png" },
    { label: "Citizen Of", value: data?.citizen_of, img: "/theme1/visa/lan.png" },
    { label: "Validity", value: data?.validity, img: "/theme1/blog/watch.png" },
    { label: "Processing", value: data?.processing_type, img: "/theme1/visa/process.png" },
    ...(data?.visa_code
      ? [{ label: "Visa Code", value: data.visa_code, img: "/theme1/visa/student.png" }]
      : []),
    ...(data?.max_stay_days
      ? [{ label: "Max Stay", value: `${data.max_stay_days} Days`, img: "/theme1/blog/watch.png" }]
      : []),
    ...(data?.entry_type
      ? [{ label: "Entry Type", value: data.entry_type.charAt(0).toUpperCase() + data.entry_type.slice(1), img: "/theme1/visa/process.png" }]
      : []),
    ...(data?.visa_category
      ? [{ label: "Visa Category", value: data.visa_category.charAt(0).toUpperCase() + data.visa_category.slice(1), img: "/theme1/visa/lan.png" }]
      : []),
  ];

  const totalPrice = data?.price?.amount || 0;
  const discountAmount = data?.price?.discount_type === "flat"
    ? data?.price?.discount
    : (totalPrice * data?.price?.discount) / 100;
  const processingFee = totalPrice - (discountAmount || 0);
  const { formatPrice } = useCurrency();

  const otherInfoDetails = [
    { label: "Citizen Of", value: data?.citizen_of },
    { label: "Travelling To", value: data?.travelling_to },
    { label: "Processing Time", value: data?.processing_type },
    { label: "Visa Mode", value: data?.visa_mode },
    { label: "Validity", value: data?.validity },
    ...(data?.documents || [])
      .filter(doc => doc?.key?.en)
      .map(doc => ({
        label: doc.key.en,
        value: doc.value?.en
      }))
  ];

  return (
    <div className="min-h-screen pb-20 isolate">
      {/* Image Preview Overlay */}
      <AnimatePresence>
        {currentIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCurrentIndex(null)}
            className="fixed inset-0 z-[999] bg-black/95 flex items-center justify-center p-4"
          >
            <button
              className="absolute top-5 right-5 z-[1000] text-white bg-white/10 p-2 rounded-full hover:bg-white/20 transition-all"
              onClick={() => setCurrentIndex(null)}
            >
              <FiX size={30} />
            </button>
            <button onClick={prevImage} className="absolute left-4 z-[1000] text-white bg-white/10 p-3 rounded-full hover:bg-white/20 transition-all">
              <FiChevronLeft size={40} />
            </button>
            <button onClick={nextImage} className="absolute right-4 z-[1000] text-white bg-white/10 p-3 rounded-full hover:bg-white/20 transition-all">
              <FiChevronRight size={40} />
            </button>
            <motion.img
              key={currentIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              src={allImages[currentIndex]}
              className="max-w-full max-h-[85vh] rounded-lg shadow-2xl object-contain pointer-events-none"
              alt="Preview"
            />
            <div className="absolute bottom-10 text-white bg-black/50 px-4 py-2 rounded-full text-sm">
              {currentIndex + 1} / {allImages.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
                {data?.title?.[langCode] || `${data?.travelling_to} Visa`} From {data?.citizen_of || "Bangladesh"}
              </h1>
              <div className="flex items-center gap-4 mt-3">
                <div className="flex items-center gap-2 text-[#717171] text-sm">
                  <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
                    <Image
                      src={`https://flagcdn.com/w40/${countryCode}.png`}
                      alt="flag"
                      width={20}
                      height={14}
                      className="object-contain rounded-sm shadow-sm"
                    />
                    <span className="font-medium uppercase">{data?.travelling_to}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 border-l pl-4">
                  <Rate disabled defaultValue={data?.rating?.average || 0} className="text-xs text-orange-400" />
                  <span className="text-sm text-gray-500">
                    {data?.rating?.count ? `(${data.rating.count} Reviews)` : "No Reviews Yet"}
                  </span>
                </div>
              </div>
            </div>

            {/* Share Button with Copied Feedback */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <button
                  onClick={handleShare}
                  title="Copy link"
                  className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 hover:bg-blue-50 hover:text-blue-600 transition-all"
                >
                  {copied ? <FiCheck className="text-green-500" /> : <FiShare2 />}
                </button>

                <AnimatePresence>
                  {copied && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.9 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 top-12 bg-gray-800 text-white text-xs font-semibold px-3 py-1.5 rounded-lg whitespace-nowrap shadow-lg z-50"
                    >
                      ✅ Link Copied!
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="travel-container pb-10">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 h-[250px] md:h-[420px] overflow-hidden rounded-2xl mb-6">
            <div className="md:col-span-3 md:row-span-2 h-full relative group overflow-hidden cursor-zoom-in" onClick={() => setCurrentIndex(0)}>
              <img
                src={data?.banner_image || "/placeholder.jpg"}
                alt="Main Banner"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
            {[0, 1, 2, 3].map((index) => (
              <div key={index} className="hidden md:block h-full relative group overflow-hidden rounded-xl cursor-zoom-in" onClick={() => setCurrentIndex(index + 1)}>
                <img
                  src={data?.images?.[index] || data?.card_image || "/placeholder.jpg"}
                  alt={`Gallery Image ${index + 1}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {index === 3 && data?.images?.length > 4 && (
                  <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white transition-all group-hover:bg-black/60">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-xs font-bold">See all {data?.images?.length} photos</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 p-6 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_40px_rgb(0,0,0,0.07)] transition-shadow duration-500">
            <div className="flex flex-col lg:flex-row justify-between items-center gap-10">

              {/* Left Side: Stats Grid */}
              <div className="flex flex-wrap gap-y-8 gap-x-8 w-full lg:flex-1">
                {visaStats.map((item, idx) => (
                  <div
                    key={idx}
                    className="group flex items-center gap-4 pr-4 border-r-0 xl:border-r border-gray-100"
                  >
                    <div className="relative w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-2xl bg-gray-50 group-hover:bg-blue-50 transition-colors duration-300">
                      {idx === 0 && (
                        <div className="absolute inset-0 bg-blue-400/10 rounded-2xl animate-pulse"></div>
                      )}
                      <Image
                        src={item.img}
                        alt={item.label}
                        width={28}
                        height={28}
                        className="object-contain z-10 group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>

                    <div className="flex flex-col">
                      <span className="text-[11px] md:text-[12px] uppercase tracking-wider text-gray-400 font-semibold mb-0.5">
                        {t(item.label)}
                      </span>
                      <span className="text-[15px] md:text-[16px] font-bold text-[#1e293b] leading-tight">
                        {item.value || "N/A"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Right Side: Price Section */}
              <div className="w-full lg:w-auto flex-shrink-0 border-t lg:border-t-0 lg:border-l lg:border-dashed lg:border-gray-200 pt-6 lg:pt-0 lg:pl-10">
                <div className="bg-[#f8fafc] px-8 py-5 rounded-2xl border border-gray-100 flex flex-col items-center lg:items-end min-w-[200px]">
                  <span className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">
                    Processing Fee
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-[#0ea5e9] text-3xl font-black">{formatPrice(processingFee)}</span>
                    <span className="text-gray-400 text-sm font-medium">/ person</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

      <div className="travel-container mt-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-[68%]">
            <div className="sticky top-[90px] z-50 bg-white border-b flex gap-8 mb-8 overflow-x-auto no-scrollbar px-4 shadow-sm">
              {[
                { label: "Details", ref: overviewRef },
                { label: "Other Information", ref: otherInfoRef },
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

            <div ref={overviewRef} className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm mb-8">
              <h2 className="text-2xl font-bold text-[#05073C] mb-5">Details</h2>
              <div
                className="text-[#717171] leading-relaxed text-[15px] space-y-4"
                dangerouslySetInnerHTML={{ __html: data?.overview?.[langCode] }}
              />
            </div>

            <div ref={otherInfoRef} className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm mb-8">
              <h2 className="text-2xl font-bold text-[#05073C] mb-6">Other Information</h2>
              <div className="text-[#717171] text-[15px] leading-relaxed mb-6">
                Applying for a <span className="font-bold">{data?.travelling_to} {data?.title?.[langCode]}</span> is simple and hassle-free with a trusted visa processing agency in {data?.citizen_of || "Bangladesh"}. We provide professional assistance with document preparation.
              </div>

              <div className="overflow-hidden border border-gray-200 rounded-xl">
                <table className="w-full text-left border-collapse">
                  <tbody>
                    {otherInfoDetails.filter(info => info.value).map((info, index) => (
                      <tr key={index} className="border-b border-gray-200 last:border-0 hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-6 font-bold text-[#05073C] text-[15px] w-1/3 border-r border-gray-200 bg-gray-50/50">
                          {info.label}
                        </td>
                        <td className="py-4 px-6 text-gray-600 text-[15px]">
                          {info.value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

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

            <div ref={reviewRef} className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm mb-8">
              <h2 className="text-2xl font-bold text-[#05073C] mb-6">Guest Reviews</h2>
              <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                <p>No reviews yet. Be the first to share your experience!</p>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-[32%]">
            <div className="sticky top-24">
              <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden mb-6">
                <div className="bg-primary p-6 text-white">
                  <p className="text-xs uppercase font-bold opacity-80 mb-1 tracking-widest">Apply Online</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black">{formatPrice(processingFee)}</span>
                    <span className="text-sm opacity-80">/ Per Person</span>
                  </div>
                </div>
                <div>
                  <VisaForm id={data?._id} pricePerPerson={processingFee} />
                </div>
              </div>

              <div className="space-y-6 mb-6">
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-2 mb-5">
                    <h3 className="text-[#05073C] font-bold text-sm uppercase tracking-wide whitespace-nowrap">You May Like Tour</h3>
                    <div className="h-[1px] bg-gray-100 w-full"></div>
                  </div>
                  <div className="space-y-5">
                    {packages?.docs?.map((item, idx) => (
                      <div key={idx} className="flex gap-3 group cursor-pointer" onClick={() => router.push(`/package/${item._id}`)}>
                        <div className="relative w-20 h-20 flex-shrink-0 overflow-hidden rounded-xl">
                          <Image src={item.card_image || "/placeholder.jpg"} alt="tour" fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                        </div>
                        <div className="flex flex-col justify-between py-0.5">
                          <h4 className="text-[#05073C] font-bold text-[13px] leading-snug line-clamp-2 group-hover:text-[#28b6ea] transition-colors">{item.name?.[langCode]}</h4>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="bg-[#28b6ea] text-white text-[11px] font-bold px-2 py-1 rounded">{formatPrice(item.price?.amount)}</span>
                            <span className="bg-[#28b6ea] text-white text-[11px] font-bold px-2 py-1 rounded">{item.tour_type}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Footer */}
          <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white p-4 border-t z-50 flex items-center justify-between shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
        <div>
          <p className="text-xs text-gray-400 font-bold uppercase">Price Starts From</p>
          <p className="text-xl font-black text-primary">{formatPrice(processingFee)}</p>
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
        <VisaForm id={data?._id} pricePerPerson={processingFee} />
      </Drawer>
    </div>
  );
};

export default VisaDetails;