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
import { MdOutlineShoppingCart } from "react-icons/md";
import NotificationDropdown from "../../common/notification";

const Navbar = ({ textColor = "text-white" }) => {
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
  const tourItems = [
    { path: "/visa", label: i18n.t("Visa") },
    { path: "/hotel", label: i18n.t("Hotel") },
  ];

  const pagesItems = [
    ...(isProduct ? [{ path: "/product", label: i18n.t("Product") }] : []),
    { path: "/blog", label: i18n.t("Blog") },
    { path: "/team", label: i18n.t("Tour Guiders") },
    { path: "/faq", label: i18n.t("FAQ") },
    { path: "/contact", label: i18n.t("Contact") },
    { path: "/privacyPolicy", label: i18n.t("Privacy Policy") },
    { path: "/termsCondition", label: i18n.t("Terms & Conditions") },
  ];
  const defaultLang = i18n?.languages?.find((lang) => lang?.default)?.code;
  const langFromLocalStorage =
    typeof localStorage !== "undefined" ? localStorage.getItem("lang") : null;
  const { user, setUser, getCurrentUser } = useUser();

  useEffect(() => {
    getCurrentUser();
  }, []);
  const [authModalOpen, setAuthModalOpen] = useState(false);
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
    <div className="w-full font-lato overflow-hidden relative z-50">
      <div className="travel-container flex flex-row justify-between items-center lg:py-8 py-4 lg:px-0">
        {/* Logo */}
        {/* Logo */}
        <Link href="/">
          <div className="sm:w-[133px] sm:h-[40px] w-[153px] h-[46px] flex justify-start items-center -ml-2 lg:ml-0 mt-1">
            {setting?.site_logo && (
              <Image
                src={setting.site_logo}
                width={153}
                height={46}
                className="sm:w-[153px] sm:h-[46px] w-[153px] h-[46px] object-fill"
                alt="logo"
                priority // লোগো দ্রুত লোড হওয়ার জন্য priority ব্যবহার করা ভালো
              />
            )}
          </div>
        </Link>
        {/* Desktop Menu */}
        <ul className="list-none xl:gap-10 gap-4 items-center hidden lg:flex">
          <NavItem
            path="/"
            label={i18n.t("Home")}
            pathname={pathname}
            textColor={textColor}
          />
          <NavItem
            path="/about"
            label={i18n.t("About")}
            pathname={pathname}
            textColor={textColor}
          />
          <DropdownMenuTrigger
            label={i18n.t("Tour")}
            items={tourItems}
            textColor={textColor}
          />
          <NavItem
            path="/destination"
            label={i18n.t("Destination")}
            pathname={pathname}
            textColor={textColor}
          />
          <NavItem
            path="/package"
            label={i18n.t("Packages")}
            pathname={pathname}
            textColor={textColor}
          />
          <DropdownMenuTrigger
            label={i18n.t("Pages")}
            items={pagesItems}
            textColor={textColor}
          />
        </ul>

        <div className="flex gap-0 sm:gap-2 items-center">
          {isProduct &&
            (user ? (
              <Link href="/cart" className="relative">
                <MdOutlineShoppingCart
                  className={`text-xl sm:text-2xl ${textColor}`}
                />
                {cart?.docs?.length > 0 && (
                  <span className="absolute -top-2 md:-right-3 -right-1 text-xs bg-primary text-white md:w-5 md:h-5 w-3 h-3 flex items-center justify-center rounded-full">
                    {cart?.docs?.length}
                  </span>
                )}
              </Link>
            ) : (
              <button
                className="flex relative items-center"
                onClick={() => setAuthModalOpen(true)}
              >
                <MdOutlineShoppingCart
                  className={`text-xl sm:text-2xl ${textColor}`}
                />
              </button>
            ))}


          <div
            className={`flex items-center  ml-2 -mr-12 navbar ${textColor == "text-[#05073C]"
                ? "language_select"
                : "language_select1"
              }`}
          >
            {defaultLang === undefined ? (
              <p className={`text-sm sm:text-lg hidden  ${textColor}`}>EN</p>
            ) : (
              <div className="">
                <Select
                  labelInValue
                  value={
                    langFromLocalStorage
                      ? {
                        value: i18n?.languages?.find(
                          (lang) => lang?._id === langFromLocalStorage
                        )?._id,
                        label: (
                          <Image
                            width={100}
                            height={100}
                            src={
                              i18n?.languages?.find(
                                (lang) => lang?._id === langFromLocalStorage
                              )?.flag || "/eng.png"
                            }
                            alt="flag"
                            className="w-5 h-5 object-cover rounded-full"
                          />
                        ),
                      }
                      : {
                        value: defaultLang,
                        label: (
                          <Image
                            width={100}
                            height={100}
                            src={
                              i18n?.languages?.find(
                                (lang) => lang?.code === defaultLang
                              )?.flag || "/eng.png"
                            }
                            alt="flag"
                            className="w-5 h-5 object-cover rounded-full"
                          />
                        ),
                      }
                  }
                  style={{ inlineSize: 100 }}
                  variant="borderless"
                  onChange={(selected) => {
                    i18n?.changeLanguage(selected.value);
                    localStorage.setItem("lang", selected.value);
                  }}
                  options={i18n?.languages?.map((lang) => ({
                    value: lang._id,
                    label: (
                      <div className="flex items-center gap-2">
                        <Image
                          width={100}
                          height={100}
                          src={lang?.flag || "/eng.png"}
                          alt={lang.code}
                          className="w-3 h-3 object-cover rounded-full"
                        />
                        <span className="text-xs">{lang.name}</span>
                      </div>
                    ),
                  }))}
                  className={`inline-flex items-center text-sm sm:text-lg justify-center uppercase ${textColor === "text-textMain"
                      ? "language_select"
                      : "language_select1"
                    }`}
                />
              </div>
            )}
          </div>
          {user?._id && (
            <div className="cursor-pointer flex mr-3  items-center justify-center rounded-full ">
              <Popover
                content={
                  <NotificationDropdown
                    notices={notifications}
                    getNotifications={getNotifications}
                  />
                }
                trigger="click"
                placement="bottom"
                overlayClassName="custom-popover"
                overlayStyle={{ padding: 0 }}
              >
                <Badge
                  className="rounded-full"
                  count={findUnreadNotifications?.length || 0}
                  size="small"
                  showZero
                >
                  <IoNotificationsOutline className={`text-xl lg:text-[22px]  ${textColor}`} />
                </Badge>
              </Popover>
            </div>
          )}

          <div className="flex items-center  sm:gap-3 relative !z-50 ">
            {user?._id ? (
              <Dropdown
                menu={{ items: userMenuItems }}
                placement="bottomRight"
                trigger={["hover"]}
              >
                <button className="flex mr-3 relative items-center">
                  <div className="ml-2 sm:ml-0">
                    {user?.image ? (
                      <Image
                        src={user?.image}
                        width={40}
                        height={40}
                        alt="user"
                        className="w-[25px] h-[25px] md:w-[30px] md:h-[30px] lg:w-[40px] lg:h-[40px] rounded-full object-contain"
                      />
                    ) : (
                      <FcBusinessman className="text-xl sm:text-2xl rounded-full" />
                    )}
                  </div>
                </button>
              </Dropdown>
            ) : (
              <button
                onClick={() => setAuthModalOpen(true)}
                className={`${textColor} text-sm whitespace-pre xl:text-base mr-4 rounded-[10px]`}
              >
                <PiUser
                  className={`${textColor} xl:text-2xl md:text-2xl text-base`}
                />
              </button>
            )}
          </div>
          <div className="hidden lg:block">
            <Link href="/package" className="view-button">
              {i18n?.t("Book A Trip")}
            </Link>
          </div>

          <button
            className={`lg:hidden ${textColor} text-2xl`}
            onClick={() => setIsDrawerOpen(true)}
          >
            <IoMenuOutline className="text-2xl relative z-50 ml-2 sm:ml-0" />
          </button>
        </div>
      </div>

      <Drawer
        title="Menu"
        placement="right"
        closable={true}
        onClose={() => setIsDrawerOpen(false)}
        open={isDrawerOpen}
        className="lg:hidden"
      >
        <div className="flex flex-col gap-4">
          <Link
            href="/"
            className="text-lg"
            onClick={() => setIsDrawerOpen(false)}
          >
            {i18n?.t("Home")}
          </Link>
          <Link
            href="/about"
            className="text-lg"
            onClick={() => setIsDrawerOpen(false)}
          >
            {i18n?.t("About")}
          </Link>
          <MobileDropdown title="Tour" items={tourItems} />
          <Link
            href="/destination"
            className="text-lg"
            onClick={() => setIsDrawerOpen(false)}
          >
            {i18n?.t("Destination")}
          </Link>
          <MobileDropdown title="Pages" items={pagesItems} />
          <Link
            href="/contact"
            className="text-lg"
            onClick={() => setIsDrawerOpen(false)}
          >
            {i18n?.t("Contact")}
          </Link>

          <div className="mt-4 w-full">
            <Link href="/package" className="view-button">
              {i18n?.t("Book A Trip")}
            </Link>
          </div>
        </div>
      </Drawer>
      <AuthModal
        authModalOpen={authModalOpen}
        setAuthModalOpen={setAuthModalOpen}
      />
    </div>
  );
};

export default Navbar;

const NavItem = ({ path, label, pathname, textColor }) => (
  <li
    className={`text-lg font-medium hover:text-primary ${pathname === path
        ? "text-primary"
        : textColor === "text-[#05073C]"
          ? "text-[#05073C]"
          : "text-white"
      }`}
  >
    <Link href={path}>{label}</Link>
  </li>
);

const DropdownMenuTrigger = ({ label, items, textColor }) => (
  <li className={`text-[17px] font-medium ${textColor} hover:text-primary`}>
    <Dropdown
      menu={{
        items: items.map(({ path, label }) => ({
          key: path,
          label: (
            <Link href={path} className="block w-full">
              {label}
            </Link>
          ),
        })),
      }}
      trigger={["hover"]}
    >
      <span className="flex items-center gap-2 cursor-pointer">
        {label}
        <IoChevronDownOutline className="text-lg mt-[2px]" />
      </span>
    </Dropdown>
  </li>
);

const MobileDropdown = ({ title, items }) => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="w-full">
      <button
        onClick={() => setOpen(!open)}
        className="!text-lg flex justify-between items-center w-full py-2"
      >
        {title}
        <IoChevronDownOutline
          className={`transition-transform duration-300 ${open ? "rotate-180" : ""
            }`}
        />
      </button>

      {open && (
        <div className="flex flex-col ps-4">
          {items.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              onClick={() => location.assign(item.path)}
              className={`py-2 text-sm ${pathname === item.path
                  ? "text-primary font-semibold"
                  : "text-textMain"
                } hover:text-primary`}
            >
              {item.label.toUpperCase()}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
