/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Dropdown, Drawer, Select, message, Badge, Popover } from "antd";
import {
  IoChevronDownOutline,
  IoMenuOutline,
  IoNotificationsOutline,
} from "react-icons/io5";
import { PiUser } from "react-icons/pi";
import { useI18n } from "@/app/contexts/i18n";
import { FcBusinessman } from "react-icons/fc";
import { useUser } from "@/app/contexts/user";
import { useFetch } from "@/app/helper/hooks";
import { fetchPublicSettings, getNotificationsByAdmin } from "@/app/helper/backend";
import AuthModal from "../common/component/authModal";
import { useCart } from "@/app/contexts/cartContext";
import { MdOutlineShoppingCart, MdSimCard } from "react-icons/md";
import NotificationDropdown from "../../common/notification";

// Icons for Menu
import { FaPlane, FaHotel, FaPassport, FaUmbrellaBeach, FaGlobeAsia, FaShoppingCart } from "react-icons/fa";
import { RiMoonClearLine } from "react-icons/ri"; // Umrah/Islamic Icon suggestion
import { FaGift } from "react-icons/fa6";

const Navbar = ({ textColor = "text-[#1A2B6D]" }) => {
  const [setting] = useFetch(fetchPublicSettings);
  const [notifications, getNotifications] = useFetch(getNotificationsByAdmin, { limit: 100 });
  const findUnreadNotifications = notifications?.docs?.filter(
    (notification) => !notification?.is_read
  );
  const pathname = usePathname();
  const router = useRouter();
  const i18n = useI18n();
  const { cart } = useCart();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const isProduct = setting?.is_product_module;
  const { user, setUser, getCurrentUser } = useUser();
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const langFromLocalStorage = typeof localStorage !== "undefined" ? localStorage.getItem("lang") : null;
  const defaultLang = i18n?.languages?.find((lang) => lang?.default)?.code;

  useEffect(() => {
    getCurrentUser();
  }, []);

  // Updated Menu items with Custom Icons from /Header Icon/
  const menuItems = [
    {
      path: "/flight",
      label: i18n.t("Flight"),
      icon: <Image src="/Header Icon/2.png" width={28} height={28} alt="Flight" />
    },
    {
      path: "/hotel",
      label: i18n.t("Hotel"),
      icon: <Image src="/Header Icon/1.png" width={28} height={28} alt="Hotel" />
    },
    {
      path: "/visa",
      label: i18n.t("Visa"),
      icon: <Image src="/Header Icon/4.png" width={28} height={28} alt="Visa" />
    },
    {
      path: "/package",
      label: i18n.t("Holiday"),
      icon: <Image src="/Header Icon/3.png" width={28} height={28} alt="Holiday" />
    },
    {
      path: "/umrah",
      label: i18n.t("Umrah"),
      icon: <Image src="/Header Icon/5.png" width={28} height={28} alt="Umrah" />
    },
    {
      path: "/Shop",
      label: i18n.t("Shop"),
      icon: <Image src="/Header Icon/6.png" width={28} height={28} alt="Shop" />
    },
    {
      path: "/e-sim",
      label: i18n.t("E-Sim"),
      icon: <Image src="/Header Icon/7.png" width={28} height={28} alt="E-Sim" />
    },
    {
      path: "/Gift Card",
      label: i18n.t("Gift Card"),
      icon: <Image src="/Header Icon/8.png" width={28} height={28} alt="Gift Card" />
    },
  ];

  const userMenuItems = [
    user?.role === "admin" || user?.role === "employee"
      ? {
        key: "dashboard",
        label: i18n.t("Dashboard"),
        onClick: () => router.push("/admin"),
      }
      : {
        key: "userDashboard",
        label: i18n.t("Dashboard"),
        onClick: () => router.push("/user"),
      },
    {
      key: "logout",
      label: i18n.t("Logout"),
      onClick: () => {
        localStorage.removeItem("token");
        router.push("/");
        message.success(i18n?.t("Logged out successfully"));
        setUser(null);
      },
    },
  ];

  return (
    <div className=" bg-white shadow-sm font-lato sticky top-0 z-50 overflow-hidden">
      <div className="max-w-6xl mx-auto flex flex-row justify-between items-center py-3 px-4 lg:px-0">

        {/* 1. Logo Section */}
        <Link href="/">
          <div className="flex flex-col">
            {setting?.fav_icon ? (
              <Image
                src={setting.fav_icon}
                width={150}
                height={45}
                className="object-contain"
                alt="logo"
                priority
              />
            ) : (
              <>
                <h1 className="text-2xl font-black italic text-[#1A2B6D]">
                  Banglaco<span className="text-[#00B7EB]">.com</span>
                  <span className="text-xs align-top">®</span>
                </h1>
                <p className="text-[10px] italic text-gray-500 -mt-1 tracking-widest text-right">for endless travel</p>
              </>
            )}
          </div>
        </Link>

        {/* 2. Central Menu (Icon + Text) */}
        <ul className="hidden lg:flex items-center gap-6">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link href={item.path} className="flex flex-col items-center group">
                <span className={`text-xl mb-1 transition-colors ${pathname === item.path ? 'text-[#00B7EB]' : 'text-blue-500 group-hover:text-[#1A2B6D]'
                  }`}>
                  {item.icon}
                </span>
                <span className={`text-[13px] font-bold transition-colors ${pathname === item.path ? 'text-[#1A2B6D]' : 'text-[#1A2B6D] group-hover:text-[#00B7EB]'
                  }`}>
                  {item.label}
                </span>
              </Link>
            </li>
          ))}
        </ul>

        {/* 3. Right Side - Actions & Auth */}
        <div className="flex items-center gap-4">

          {isProduct && (
            <Link href={user ? "/cart" : "#"} onClick={() => !user && setAuthModalOpen(true)} className="relative">
              <MdOutlineShoppingCart className="text-2xl text-[#1A2B6D]" />
              {cart?.docs?.length > 0 && (
                <span className="absolute -top-2 -right-2 text-[10px] bg-[#00B7EB] text-white w-4 h-4 flex items-center justify-center rounded-full">
                  {cart?.docs?.length}
                </span>
              )}
            </Link>
          )}

          {/* Language Select */}
          <div className="hidden sm:block">
            <Select
              labelInValue
              value={{ value: langFromLocalStorage || defaultLang }}
              variant="borderless"
              onChange={(selected) => {
                i18n?.changeLanguage(selected.value);
                localStorage.setItem("lang", selected.value);
              }}
              options={i18n?.languages?.map((lang) => ({
                value: lang._id,
                label: (
                  <div className="flex items-center gap-2">
                    <Image width={16} height={12} src={lang?.flag || "/eng.png"} alt="flag" className="rounded-sm" />
                    <span className="text-xs font-bold text-[#1A2B6D] uppercase">{lang.code}</span>
                  </div>
                ),
              }))}
              className="min-w-[70px]"
            />
          </div>

          {/* Notification */}
          {user?._id && (
            <Popover
              content={<NotificationDropdown notices={notifications} getNotifications={getNotifications} />}
              trigger="click"
              placement="bottom"
            >
              <Badge count={findUnreadNotifications?.length || 0} size="small">
                <IoNotificationsOutline className="text-2xl text-[#1A2B6D] cursor-pointer" />
              </Badge>
            </Popover>
          )}

          {/* Auth Buttons / Profile */}
          <div className="flex items-center gap-2">
            {!user?._id ? (
              <div className="hidden sm:flex gap-2">
                <button
                  onClick={() => setAuthModalOpen(true)}
                  className="bg-[#1A2B6D] text-white px-6 py-2 rounded-md text-sm font-bold hover:bg-opacity-90 transition-all"
                >
                  Sign In
                </button>
              </div>
            ) : (
              <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
                <div className="cursor-pointer">
                  {user?.image ? (
                    <Image src={user.image} width={35} height={35} alt="user" className="rounded-full border border-gray-200" />
                  ) : (
                    <FcBusinessman className="text-3xl" />
                  )}
                </div>
              </Dropdown>
            )}

            <button className="lg:hidden text-3xl text-[#1A2B6D]" onClick={() => setIsDrawerOpen(true)}>
              <IoMenuOutline />
            </button>
          </div>
        </div>
      </div>

      <AuthModal authModalOpen={authModalOpen} setAuthModalOpen={setAuthModalOpen} />

      <Drawer open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} placement="right" width={280}>
        <div className="flex flex-col gap-6 mt-4">
          {menuItems.map(item => (
            <Link key={item.path} href={item.path} onClick={() => setIsDrawerOpen(false)} className="flex items-center gap-3 text-lg font-bold text-[#1A2B6D]">
              <span className="text-blue-400">{item.icon}</span> {item.label}
            </Link>
          ))}
          <hr />
          {!user?._id && (
            <div className="flex flex-col gap-3">
              <button onClick={() => { setAuthModalOpen(true); setIsDrawerOpen(false) }} className="bg-[#1A2B6D] text-white py-3 rounded-md font-bold">Sign In</button>
              <button onClick={() => { setAuthModalOpen(true); setIsDrawerOpen(false) }} className="border-2 border-[#1A2B6D] text-[#1A2B6D] py-3 rounded-md font-bold">Sign Up</button>
            </div>
          )}
        </div>
      </Drawer>
    </div>
  );
};

export default Navbar;