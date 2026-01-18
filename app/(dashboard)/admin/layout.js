/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import {
  FaWrench,
  FaUserTie,
  FaQuestionCircle,
  FaTags,
  FaBlogger,
  FaBloggerB,
  FaUsersCog,
  FaUsers,
  FaMoneyCheckAlt,
} from "react-icons/fa";

import {
  MdCategory,
  MdChat,
  MdOutlineContactPhone,
  MdOutlineDynamicFeed,
  MdOutlineEmail,
  MdOutlineSettings,
} from "react-icons/md";
import { BiCategory, BiSolidOffer } from "react-icons/bi";
import { MdOutlineSpaceDashboard } from "react-icons/md";
import { RiFolderSettingsLine, RiMailSettingsFill } from "react-icons/ri";
import { TbBrandGoogleBigQuery, TbBrandVisa, TbMessageCog } from "react-icons/tb";
import { GrServices } from "react-icons/gr";
import Sidebar from "./layout/sideBar";
import Header from "./layout/header";
import I18nProvider from "@/app/contexts/i18n";
import Providers from "@/app/provider/userProvider";
import MainLoader from "../components/common/loader";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { GoPackage } from "react-icons/go";
import { AiFillProduct, AiOutlineProduct } from "react-icons/ai";
import {
  BsCalendar2Check,
  BsCalendarEventFill,
  BsFillHouseGearFill,
} from "react-icons/bs";
import {
  FaCcVisa,
  FaClipboardList,
  FaGlobe,
  FaHotel,
  FaRegCalendarCheck,
} from "react-icons/fa6";
import { fetchPublicSettings, getUser } from "@/app/helper/backend";
import { IoChatbox } from "react-icons/io5";
import { PiMapPinAreaFill } from "react-icons/pi";
import Image from "next/image";
import { useFetch } from "@/app/helper/hooks";
import { useUser } from "@/app/contexts/user";
import Link from "next/link"; // লোগোতে ক্লিকের জন্য লিঙ্ক ইমপোর্ট করা হলো

const Layout = ({ children }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setCurrentUser] = useState(null);
  const { setUser } = useUser();
  const [siteSetting] = useFetch(fetchPublicSettings);

  useEffect(() => {
    getUser().then(({ data }) => {
      if (data?.role == "admin" || data?.role == "employee") {
        setCurrentUser(data);
        setUser(data);
        setLoading(false);
      } else {
        router.push("/");
        setLoading(false);
      }
    });
  }, [user?._id]);

  if (loading) {
    return <MainLoader />;
  }

  return (
    <div className="font-inter">
      {user && (user?.role == "admin" || user?.role == "employee") && (
        <Providers>
          <I18nProvider>
            <div className="flex">
              <div className="lg:w-[320px] bg-white">
                <div className="w-full hidden lg:flex items-center justify-center !mt-6">
                  {/* লোগো সেকশনটি ডাইনামিক করা হলো */}
                  <Link href="/">
                    <div className="w-[168px] h-[50px] flex items-center justify-center">
                      {siteSetting?.fav_icon ? (
                        <Image
                          src={siteSetting.fav_icon}
                          alt="Logo"
                          width={168}
                          height={50}
                          className="w-full h-full object-fill"
                          priority
                        />
                      ) : (
                        // লোগো ডাটা না আসা পর্যন্ত একটি ছোট প্লেসহোল্ডার বা এম্পটি স্পেস দেখাবে 
                        // যাতে হার্ডকোডেড কিছু না দেখায়
                        <div className="w-full h-full bg-slate-50 animate-pulse rounded" />
                      )}
                    </div>
                  </Link>
                </div>
                <Sidebar menu={menu} />
              </div>
              <div className="w-full overflow-auto bg-slate-50">
                <Header />
                <div className="min-h-screen">
                  <div className="w-full ">{children}</div>
                </div>
              </div>
            </div>
          </I18nProvider>
        </Providers>
      )}
    </div>
  );
};

export default Layout;

const menu = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: <MdOutlineSpaceDashboard />,
    permission: "dashboard",
  },
  {
    label: "Users",
    href: "/admin/users",
    icon: <FaUsers />,
    permission: "hrm",
  },
    {
    label: "Advertisement",
    href: "/admin/advertisement",
    icon: <FaUsers />,
    permission: "advertise",
  },
  {
    label: "Package Management",
    icon: <GoPackage />,
    permission: "package",
    child: [
      {
        label: "Activity",
        href: "/admin/packageManagement/activity",
        icon: <BiCategory />,
      },
      {
        label: "Services",
        href: "/admin/packageManagement/services",
        icon: <GrServices />,
      },
      {
        label: "Packages",
        href: "/admin/packageManagement/package",
        icon: <BsCalendarEventFill />,
      },
      {
        label: "Bookings",
        href: "/admin/packageManagement/packageBooking",
        icon: <FaRegCalendarCheck />,
      },
      {
        label: "Reviews",
        href: "/admin/packageManagement/review",
        icon: <IoChatbox />,
      },
    ],
  },
  {
    label: "Destination",
    href: "/admin/destination",
    icon: <PiMapPinAreaFill />,
    permission: "destination",
  },
  {
    label: "Hotel Management",
    icon: <BsFillHouseGearFill />,
    permission: "hotel",
    child: [
      {
        label: "Services",
        href: "/admin/hotelManagement/services",
        icon: <GrServices />,
      },
      {
        label: "Hotels",
        href: "/admin/hotelManagement/hotel",
        icon: <FaHotel />,
      },
      {
        label: "Bookings",
        href: "/admin/hotelManagement/hotelBooking",
        icon: <BsCalendar2Check />,
      },
      {
        label: "Reviews",
        href: "/admin/hotelManagement/review",
        icon: <IoChatbox />,
      },
    ],
  },
  {
    label: "Offer Management",
    href: "/admin/offer",
    icon: <BiSolidOffer />,
    permission: "offer",
  },
  {
    label: "Visa Management",
    icon: <FaCcVisa />,
    permission: "visa",
    child: [
      {
        label: "Visa Type",
        href: "/admin/visaManagement/type",
        icon: <GrServices />,
      },
      {
        label: "Visa",
        href: "/admin/visaManagement/visa",
        icon: <TbBrandVisa />
      },
      {
        label: "Visa Inquery",
        href: "/admin/visaManagement/inquery",
        icon: <TbBrandGoogleBigQuery />,
      },
    ],
  },
  {
    label: "Tour Guiders",
    href: "/admin/provider",
    icon: <FaUserTie />,
    permission: "guide",
  },
  {
    label: "Product Management",
    icon: <AiFillProduct />,
    permission: "product",
    child: [
      {
        label: "Categories",
        href: "/admin/productManagement/categories",
        icon: <MdCategory />,
      },
      {
        label: "Products",
        href: "/admin/productManagement/products",
        icon: <AiOutlineProduct />,
      },
      {
        label: "Orders",
        href: "/admin/productManagement/orders",
        icon: <FaClipboardList />,
      },
    ],
  },
  {
    label: "Site Testimonials",
    href: "/admin/testimonials",
    icon: <MdChat />,
    permission: "review",
  },
  {
    label: "Blog Management",
    icon: <FaBlogger />,
    permission: "blog",
    child: [
      {
        label: "Tags",
        href: "/admin/blog-management/tags",
        icon: <FaTags />,
      },
      {
        label: "Categories",
        href: "/admin/blog-management/categories",
        icon: <BiCategory />,
      },
      {
        label: "Blogs",
        href: "/admin/blog-management/blogs",
        icon: <FaBloggerB />,
      },
    ],
  },
  {
    label: "FAQ",
    href: "/admin/faq",
    icon: <FaQuestionCircle />,
    permission: "faq",
  },
  {
    label: "HRM",
    icon: <FaUsersCog />,
    permission: "hrm",
    child: [
      {
        label: "All Employee",
        href: "/admin/employeeList",
        icon: <FaUsers />,
      },
      {
        label: "Roles",
        href: "/admin/rolePermission",
        icon: <GrServices />,
      },
    ],
  },
  {
    label: "Contact Us",
    href: "/admin/contactUs",
    icon: <MdOutlineContactPhone />,
    permission: "contact",
  },
  {
    label: "Settings",
    icon: <FaWrench />,
    permission: "setting",
    child: [
      {
        label: "Site Settings",
        href: "/admin/settings",
        icon: <MdOutlineSettings />,
      },
      {
        label: "Page Settings",
        href: "/admin/settings/page-settings",
        icon: <RiFolderSettingsLine />,
      },
      {
        label: "Email Settings",
        href: "/admin/settings/email",
        icon: <RiMailSettingsFill />,
      },
      {
        label: "SMS Settings",
        href: "/admin/settings/sms",
        icon: <TbMessageCog />,
      },
      {
        label: "Payment Settings",
        href: "/admin/settings/payment",
        icon: <FaMoneyCheckAlt />,
      },
      {
        label: "Dynamic Sections",
        href: "/admin/settings/dynamic",
        icon: <MdOutlineDynamicFeed />,
      },
    ],
  },
  {
    label: "Newsletter",
    href: "/admin/newsletter",
    icon: <MdOutlineEmail />,
    permission: "subscriber",
  },
  {
    label: "Languages",
    href: "/admin/languages",
    icon: <FaGlobe />,
    permission: "language",
  },
];