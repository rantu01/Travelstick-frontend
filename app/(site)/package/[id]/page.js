"use client";
import BookTour from "@/app/components/common/bookTour";
import Iternary from "@/app/components/common/iternary";
import Rating from "@/app/components/common/Rating";
import {
  createPackageInquiry,
  fetchPageContentTheme1,
  getAllPackageBookingByUser,
  getAllPublicPackages,
} from "@/app/helper/backend";
import { useAction, useFetch } from "@/app/helper/hooks";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { Form } from "antd";
import Image from "next/image";
import { useUser } from "@/app/contexts/user";
import { MapSelector } from "@/app/components/form/location";
import { useI18n } from "@/app/contexts/i18n";
import { RiArrowDropDownLine } from "react-icons/ri";
import { FiShare2, FiX, FiChevronLeft, FiChevronRight, FiCheck, FiMap } from "react-icons/fi";
import { CiLocationOn, CiClock2, CiCalendar } from "react-icons/ci";
import { motion, AnimatePresence } from "framer-motion";
import { useCurrency } from "@/app/contexts/site";
import AboutDetails from "@/app/components/common/aboutDetails";
import CustomTourCard from "@/app/components/theme1/package/CustomTourCard";

const PackageDetails = () => {
  const { user } = useUser();
  const { langCode, t } = useI18n();
  const [data, getData] = useFetch(getAllPublicPackages, {}, false);
  const [showModal, setShowModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [copied, setCopied] = useState(false);
  const [sidebarTab, setSidebarTab] = useState("booking");
  const [inquiryLoading, setInquiryLoading] = useState(false);
  const [inquiryForm, setInquiryForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    message: "",
  });

  const params = useParams();
  const router = useRouter();
  const { id } = params;

  const [packageBooking] = useFetch(getAllPackageBookingByUser);
  const checked = !!packageBooking?.docs?.find(
    (item) => item?.package?._id === data?._id
  );

  const location = data?.destination?.address;
  const [googleAddress, setGoogleAddress] = useState(location);

  const [data1] = useFetch(fetchPageContentTheme1, { status: true });

  // Section refs for sticky nav
  const overviewRef = useRef(null);
  const itineraryRef = useRef(null);
  const otherInfoRef = useRef(null);
  const policiesRef = useRef(null);
  const reviewRef = useRef(null);

  useEffect(() => {
    getData({ _id: id });
  }, [id]);

  // Build allImages from banner + gallery
  const allImages = useMemo(() => {
    const images = [];
    if (data?.card_image) images.push(data.card_image);
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

  // Package stats (similar to visaStats in VisaDetails)
  const packageStats = [
    {
      label: "Tour Type",
      value: data?.tour_type,
      img: "/Holidays Icon/Tour Type.png",
    },
    {
      label: "Destination",
      value: data?.destination?.name,
      img: "/Holidays Icon/Destination.png",
    },
    {
      label: "Duration",
      value: data?.duration ? `${data.duration} Days` : null,
      img: "/Holidays Icon/Duration.png",
    },
    {
      label: "Group Size",
      value: data?.group_size ? `Max ${data.group_size}` : null,
      img: "/Holidays Icon/Group Size.png",
    },
    // ...(data?.difficulty_level
    //   ? [{ label: "Difficulty", value: data.difficulty_level.charAt(0).toUpperCase() + data.difficulty_level.slice(1), img: "/theme1/visa/student.png" }]
    //   : []),
    // ...(data?.min_age
    //   ? [{ label: "Min Age", value: `${data.min_age}+`, img: "/theme1/visa/lan.png" }]
    //   : []),
    // ...(data?.transport_type
    //   ? [{ label: "Transport", value: data.transport_type, img: "/theme1/visa/process.png" }]
    //   : []),
  ].filter((item) => item.value);

  const totalPrice = data?.price?.amount || 0;
  const includesList = data?.includes || data?.include || [];
  const excludesList = data?.excludes || data?.exclude || [];
  const policiesData = Array.isArray(data?.policies)
    ? data.policies?.[0]
    : Array.isArray(data?.policy)
    ? data.policy?.[0]
    : data?.policies || data?.policy;
  const policyContent =
    policiesData?.[langCode] || policiesData?.en || Object.values(policiesData || {})?.[0] || "";
  const discountAmount =
    data?.price?.discount_type === "flat"
      ? data?.price?.discount
      : (totalPrice * data?.price?.discount) / 100;
  const finalPrice = totalPrice - (discountAmount || 0);
  const { formatPrice } = useCurrency();

  useEffect(() => {
    if (user) {
      setInquiryForm((prev) => ({
        ...prev,
        full_name: user?.name || prev.full_name,
        email: user?.email || prev.email,
        phone: user?.phone || prev.phone,
      }));
    }
  }, [user]);

  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    if (!data?._id || inquiryLoading) return;

    setInquiryLoading(true);
    try {
      await useAction(createPackageInquiry, {
        body: {
          package: data._id,
          full_name: inquiryForm.full_name,
          email: inquiryForm.email,
          phone: inquiryForm.phone,
          message: inquiryForm.message,
        },
      });
      setInquiryForm((prev) => ({
        ...prev,
        message: "",
      }));
    } finally {
      setInquiryLoading(false);
    }
  };

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
            <button
              onClick={prevImage}
              className="absolute left-4 z-[1000] text-white bg-white/10 p-3 rounded-full hover:bg-white/20 transition-all"
            >
              <FiChevronLeft size={40} />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 z-[1000] text-white bg-white/10 p-3 rounded-full hover:bg-white/20 transition-all"
            >
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
          {/* Breadcrumb */}
          {/* <Breadcrumb
            className="mb-3 text-sm"
            items={[
              { title: <a href="/">Home</a> },
              { title: <a href="/package">Packages</a> },
              { title: "Package Details" },
            ]}
          /> */}

          {/* Title Row */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-[#05073C] font-extrabold text-3xl md:text-4xl lg:text-5xl leading-tight">
                {data?.name?.[langCode] || data?.name?.en || "Package Details"}
              </h1>
              <div className="flex items-center gap-4 mt-3">
                <div className="flex items-center gap-2 text-gray-500 text-sm tracking-wide">
                  <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
                    <CiLocationOn className="text-primary" />
                    <span className="font-medium">{data?.destination?.name || "N/A"}</span>
                  </div>
                </div>
                {/* <div className="flex items-center gap-2 border-l pl-4">
                  <Rate
                    disabled
                    defaultValue={data?.rating?.average || 0}
                    className="text-xs text-orange-400"
                  />
                  <span className="text-sm text-gray-500">
                    {data?.rating?.count
                      ? `(${data.rating.count} Reviews)`
                      : "No Reviews Yet"}
                  </span>
                </div> */}
              </div>
            </div>

            {/* Share + Map Buttons */}
            <div className="flex items-center gap-3">
              {/* <button
                onClick={() => setShowModal(true)}
                title="See on map"
                className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 hover:bg-blue-50 hover:text-blue-600 transition-all"
              >
                <FiMap />
              </button> */}
              <div className="relative">
                <button
                  onClick={handleShare}
                  title="Copy link"
                  className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 hover:bg-blue-50 hover:text-blue-600 transition-all"
                >
                  {copied ? (
                    <FiCheck className="text-green-500" />
                  ) : (
                    <FiShare2 />
                  )}
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
            {/* Main large image */}
            <div
              className="md:col-span-3 md:row-span-2 h-full relative group overflow-hidden cursor-zoom-in"
              onClick={() => setCurrentIndex(0)}
            >
              <img
                src={data?.card_image || "/placeholder.jpg"}
                alt="Main Banner"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
            {/* Side thumbnails */}
            {[0, 1, 2, 3].map((index) => (
              <div
                key={index}
                className="hidden md:block h-full relative group overflow-hidden rounded-xl cursor-zoom-in"
                onClick={() => setCurrentIndex(index + 1)}
              >
                <img
                  src={data?.images?.[index] || data?.card_image || "/placeholder.jpg"}
                  alt={`Gallery Image ${index + 1}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {index === 3 && data?.images?.length > 4 && (
                  <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white transition-all group-hover:bg-black/60">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mb-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span className="text-xs font-bold">
                      See all {data?.images?.length} photos
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Stats Card */}
          <div className="bg-white rounded-3xl border border-gray-100 p-6 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_40px_rgb(0,0,0,0.07)] transition-shadow duration-500">
            <div className="flex flex-col lg:flex-row justify-between items-center gap-10">

              {/* Left Side: Stats Grid */}
              <div className="flex flex-wrap gap-y-8 gap-x-4 w-full lg:flex-1">
                {packageStats.map((item, idx) => (
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
                      <span className="text-xs uppercase tracking-wide text-gray-400 font-semibold mb-0.5">
                        {t(item.label)}
                      </span>
                      <span className="text-base md:text-lg font-semibold text-[#1e293b] leading-tight">
                        {item.value || "N/A"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Right Side: Price Section */}
              <div className="w-full text lg:w-auto flex-shrink-0 border-t lg:border-t-0 lg:border-l lg:border-dashed lg:border-gray-200 pt-6 lg:pt-0 lg:pl-10">
                <div className="flex items-baseline gap-2 justify-center lg:justify-end">
                  <span className="text-gray-400 text-sm font-medium">From:</span>
                  <span className="text-primary text-3xl lg:text-4xl font-extrabold">{formatPrice(finalPrice)}</span>
                  <span className="text-gray-400 text-sm font-medium">/ person</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="travel-container mt-8">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Left: Content Sections */}
          <div className="w-full lg:w-[68%]">

            {/* Sticky Tab Nav */}
            <div className="sticky top-[90px] z-50 justify-start md:justify-between bg-white border-b flex overflow-hidden flex-nowrap md:flex-wrap gap-0 mb-8 px-0 shadow-sm">
              {[
                { label: "Overview", ref: overviewRef },
                { label: "Itinerary", ref: itineraryRef },
                { label: "Other Information", ref: otherInfoRef },
                { label: "Policies", ref: policiesRef },
                { label: "Reviews", ref: reviewRef },
              ].map((tab, idx) => (
                <button
                  key={idx}
                  onClick={() => scrollToSection(tab.ref)}
                  className="py-3 px-2 md:py-4 md:px-2 text-xs md:text-sm font-semibold text-gray-600 whitespace-nowrap border-b-2 border-transparent hover:text-primary hover:border-primary active:scale-95 transition-all duration-300 ease-in-out tracking-wide flex-shrink-0">
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Overview / About */}
            <div
              ref={overviewRef}
              className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm mb-8"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-[#05073C] leading-snug mb-5">Overview</h2>
              <AboutDetails data={data} slug="package" />
            </div>

            {/* Itinerary */}
            <div
              ref={itineraryRef}
              className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm mb-8"
            >
              {/* <h2 className="text-2xl md:text-3xl font-bold text-[#05073C] leading-snug mb-5">Itinerary</h2> */}
              <Iternary data={data} />
            </div>

            {/* Other Information */}
            <div
              ref={otherInfoRef}
              className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm mb-8"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-[#05073C] leading-snug mb-6">
                Other Information
              </h2>
              <div className="text-gray-600 text-base leading-relaxed mb-6">
                Book your{" "}
                <span className="font-bold">
                  {data?.name?.[langCode] || data?.name?.en}
                </span>{" "}
                package with ease. Our expert team ensures a seamless travel experience
                from planning to your return.
              </div>

              <div className="overflow-hidden border border-gray-200 rounded-xl">
                <table className="w-full text-left border-collapse">
                  <tbody>
                    {[
                      { label: "Destination", value: data?.destination?.name },
                      { label: "Tour Type", value: data?.tour_type },
                      { label: "Duration", value: data?.duration ? `${data.duration} Days` : null },
                      { label: "Group Size", value: data?.group_size ? `Max ${data.group_size} People` : null },
                      { label: "Start Location", value: data?.start_location },
                      { label: "End Location", value: data?.end_location },
                      { label: "Difficulty", value: data?.difficulty_level },
                      { label: "Transport", value: data?.transport_type },
                      { label: "Minimum Age", value: data?.min_age ? `${data.min_age}+` : null },
                      { label: "Accommodation", value: data?.accommodation_type },
                      { label: "Meals Included", value: data?.meals_included },
                    ]
                      .filter((info) => info.value)
                      .map((info, index) => (
                        <tr
                          key={index}
                          className="border-b border-gray-200 last:border-0 hover:bg-gray-50 transition-colors"
                        >
                          <td className="py-4 px-6 font-semibold text-sm text-[#05073C] w-1/3 border-r border-gray-200 bg-gray-50/50">
                            {info.label}
                          </td>
                          <td className="py-4 px-6 text-gray-600 text-sm">
                            {info.value}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>

              {/* Includes / Excludes if available */}
              {(includesList?.length > 0 || excludesList?.length > 0) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  {includesList?.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-[#05073C] mb-3 text-base">
                        ✅ Included
                      </h3>
                      <ul className="space-y-2">
                        {includesList.map((item, i) => (
                          <li key={i} className="text-gray-600 text-sm flex gap-2">
                            <span className="text-green-500 mt-0.5">•</span>
                            {item?.[langCode] || item?.en || item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {excludesList?.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-[#05073C] mb-3 text-base">
                        ❌ Excluded
                      </h3>
                      <ul className="space-y-2">
                        {excludesList.map((item, i) => (
                          <li key={i} className="text-gray-600 text-sm flex gap-2">
                            <span className="text-red-400 mt-0.5">•</span>
                            {item?.[langCode] || item?.en || item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Policies */}
            <div
              ref={policiesRef}
              className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm mb-8"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-[#05073C] leading-snug mb-6">
                Policies
              </h2>
              {policyContent ? (
                <div
                  className="prose prose-sm max-w-none text-gray-700"
                  dangerouslySetInnerHTML={{ __html: policyContent }}
                />
              ) : (
                <p className="text-sm text-gray-500">No policies available for this package yet.</p>
              )}
            </div>

            {/* Reviews */}
            <div
              ref={reviewRef}
              className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm mb-8"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-[#05073C] leading-snug mb-6">
                Guest Reviews
              </h2>
              <Rating
                slug={"package"}
                checked={checked}
                data={data}
                getData={getData}
              />
              {/* Custom tour card placed under Guest Reviews - responsive */}

            </div>
            <div className="mt-6">
              <CustomTourCard />
            </div>
          </div>

          {/* Right: Sticky Sidebar */}
          <div className="w-full lg:w-[32%] hidden lg:block">
            <div className="sticky top-24">
              {/* Booking Card */}
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-6">
                <div className="flex border-b border-gray-100">
                  {[
                    { key: "booking", label: "Book Now" },
                    { key: "inquiry", label: "Inquiry" },
                  ].map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setSidebarTab(tab.key)}
                      className={`flex-1 py-3 text-sm font-bold transition-all border-b-2 ${sidebarTab === tab.key
                        ? "border-primary text-primary"
                        : "border-transparent text-gray-400 hover:text-gray-600"
                        }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
                <div className="bg-primary p-6 text-white">
                  <div className="flex items-baseline gap-1">

                    {sidebarTab === "booking" && (
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-extrabold">{formatPrice(finalPrice)}</span>
                        <span className="text-sm opacity-80">/ Per Person</span>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  {sidebarTab === "booking" ? (
                    <div className="">
                      <BookTour user={user} data={data} />
                    </div>
                  ) : (
                    <form onSubmit={handleInquirySubmit} className="p-5 space-y-3">
                      <Form.Item label="Full Name" className="mb-3">
                        <input
                          required
                          value={inquiryForm.full_name}
                          onChange={(e) =>
                            setInquiryForm((prev) => ({
                              ...prev,
                              full_name: e.target.value,
                            }))
                          }
                          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary"
                          placeholder="Your full name"
                        />
                      </Form.Item>
                      <Form.Item label="Email" className="mb-3">
                        <input
                          required
                          type="email"
                          value={inquiryForm.email}
                          onChange={(e) =>
                            setInquiryForm((prev) => ({
                              ...prev,
                              email: e.target.value,
                            }))
                          }
                          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary"
                          placeholder="you@example.com"
                        />
                      </Form.Item>
                      <Form.Item label="Phone" className="mb-3">
                        <input
                          required
                          value={inquiryForm.phone}
                          onChange={(e) =>
                            setInquiryForm((prev) => ({
                              ...prev,
                              phone: e.target.value,
                            }))
                          }
                          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary"
                          placeholder="Phone number"
                        />
                      </Form.Item>
                      <Form.Item label="Message" className="mb-3">
                        <textarea
                          required
                          rows={4}
                          value={inquiryForm.message}
                          onChange={(e) =>
                            setInquiryForm((prev) => ({
                              ...prev,
                              message: e.target.value,
                            }))
                          }
                          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary resize-none"
                          placeholder="Tell us what you need"
                        />
                      </Form.Item>
                      <button
                        type="submit"
                        disabled={inquiryLoading || !data?._id}
                        className="w-full bg-primary text-white py-3 rounded-xl font-semibold disabled:opacity-70"
                      >
                        {inquiryLoading ? "Submitting..." : "Submit Inquiry"}
                      </button>
                    </form>
                  )}
                </div>
              </div>

              {/* Map Preview Card */}
              {data?.destination?.address && (
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm mb-6">
                  <div className="flex items-center gap-2 mb-4">
                    <h3 className="text-[#05073C] font-semibold text-sm uppercase tracking-wide">
                      Location
                    </h3>
                    <div className="h-[1px] bg-gray-100 w-full"></div>
                  </div>
                  <button
                    onClick={() => setShowModal(true)}
                    className="w-full flex items-center gap-2 text-primary text-sm font-semibold hover:underline"
                  >
                    <FiMap />
                    <span>{data?.destination?.name || "View on Map"}</span>
                  </button>
                </div>
              )}

              {/* Quick Info Card */}
              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <h3 className="text-[#05073C] font-semibold text-sm uppercase tracking-wide whitespace-nowrap">
                    Quick Info
                  </h3>
                  <div className="h-[1px] bg-gray-100 w-full"></div>
                </div>
                <div className="space-y-3">
                  {data?.duration && (
                    <div className="flex items-center gap-3 text-gray-600 text-sm">
                      <CiClock2 className="text-primary text-lg flex-shrink-0" />
                      <span>{data.duration} Days Tour</span>
                    </div>
                  )}
                  {data?.tour_type && (
                    <div className="flex items-center gap-3 text-gray-600 text-sm">
                      <CiCalendar className="text-primary text-lg flex-shrink-0" />
                      <span>{data.tour_type}</span>
                    </div>
                  )}
                  {data?.destination?.name && (
                    <div className="flex items-center gap-3 text-gray-600 text-sm">
                      <CiLocationOn className="text-primary text-lg flex-shrink-0" />
                      <span>{data.destination.name}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Footer */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white p-4 border-t z-50 flex items-center justify-between shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
        <div>
          <p className="text-xs text-gray-400 font-semibold uppercase">Price Per Person</p>
          <p className="text-xl font-extrabold text-primary">
            {formatPrice(finalPrice)}
          </p>
        </div>
        <button
          onClick={() => {
            setSidebarTab("booking");
            setShowBookingModal(true);
          }}
          className="bg-primary text-white px-8 py-3 rounded-xl font-bold text-sm shadow-lg active:scale-95 transition-all"
        >
          Book Now
        </button>
      </div>

      {/* Map Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-xl max-w-3xl w-full p-8 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-black text-xl"
            >
              <FiX />
            </button  >
            <MapSelector
              height={360}
              isGoogleMap={true}
              onChange={(e) => setGoogleAddress(e)}
              value={location}
              inputHidden
            />
            <p className="text-center font-semibold mt-2">{location?.name}</p>
          </div>
        </div>
      )}

      {/* Booking Modal (mobile) - tabs: Book Now / Inquiry */}
      {showBookingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 rounded-lg p-4">
          <div className="bg-white rounded-xl max-w-3xl w-full p-5 relative mx-4">
            <button
              onClick={() => setShowBookingModal(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-black text-xl z-20"
            >
              <FiX />
            </button>
            <div className="border-b bg-white">
              <div className="flex">
                {[
                  { key: "booking", label: "Book Now" },
                  { key: "inquiry", label: "Inquiry" },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setSidebarTab(tab.key)}
                    className={`flex-1 py-3 text-sm font-bold transition-all border-b-2 ${sidebarTab === tab.key
                      ? "border-primary text-primary"
                      : "border-transparent text-gray-400 hover:text-gray-600"
                      }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="p-5 max-h-[80vh] overflow-auto">
              {sidebarTab === "booking" ? (
                <BookTour user={user} data={data} />
              ) : (
                <div className="p-0">
                  <form onSubmit={handleInquirySubmit} className="space-y-3">
                    <Form.Item label="Full Name" className="mb-3">
                      <input
                        required
                        value={inquiryForm.full_name}
                        onChange={(e) =>
                          setInquiryForm((prev) => ({
                            ...prev,
                            full_name: e.target.value,
                          }))
                        }
                        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary"
                        placeholder="Your full name"
                      />
                    </Form.Item>
                    <Form.Item label="Email" className="mb-3">
                      <input
                        required
                        type="email"
                        value={inquiryForm.email}
                        onChange={(e) =>
                          setInquiryForm((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }))
                        }
                        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary"
                        placeholder="you@example.com"
                      />
                    </Form.Item>
                    <Form.Item label="Phone" className="mb-3">
                      <input
                        required
                        value={inquiryForm.phone}
                        onChange={(e) =>
                          setInquiryForm((prev) => ({
                            ...prev,
                            phone: e.target.value,
                          }))
                        }
                        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary"
                        placeholder="Phone number"
                      />
                    </Form.Item>
                    <Form.Item label="Message" className="mb-3">
                      <textarea
                        required
                        rows={4}
                        value={inquiryForm.message}
                        onChange={(e) =>
                          setInquiryForm((prev) => ({
                            ...prev,
                            message: e.target.value,
                          }))
                        }
                        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary resize-none"
                        placeholder="Tell us what you need"
                      />
                    </Form.Item>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setShowBookingModal(false)}
                        className="flex-1 border border-gray-200 py-3 rounded-xl font-semibold"
                      >
                        Close
                      </button>
                      <button
                        type="submit"
                        disabled={inquiryLoading || !data?._id}
                        className="flex-1 bg-primary text-white py-3 rounded-xl font-semibold disabled:opacity-70"
                      >
                        {inquiryLoading ? "Submitting..." : "Submit Inquiry"}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PackageDetails;