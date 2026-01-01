/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useEffect, useState } from "react";
import Banner from "../../components/site/common/component/Banner";
import { usePathname, useRouter } from "next/navigation";
import { useI18n } from "@/app/contexts/i18n";
import { FaCartShopping, FaSuitcaseRolling } from "react-icons/fa6";
import { HiOutlineLogout, HiOutlineMenu } from "react-icons/hi";
import { Drawer, message } from "antd";
import { RxCross2 } from "react-icons/rx";
import Link from "next/link";
import { MdDashboard } from "react-icons/md";
import { FaUserEdit, FaUserTie } from "react-icons/fa";
import { BiEdit } from "react-icons/bi";
import Image from "next/image";
import Providers from "@/app/provider/userProvider";
import MainLoader from "@/app/(dashboard)/components/common/loader";
import { getUser } from "@/app/helper/backend";
import { BsCalendarCheckFill } from "react-icons/bs";
import { useUser } from "@/app/contexts/user";
import { TbBrandGoogleBigQuery } from "react-icons/tb";

const Layout = ({ children }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const pathname = usePathname();
  const i18n = useI18n();
  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };
  const menuItems = [
    { id: 1, name: "Dashboard", href: "/user", icon: <MdDashboard /> },
    {
      id: 2,
      name: "Packages Booking",
      href: "/user/packageBooking",
      icon: <FaSuitcaseRolling />,
    },
    {
      id: 3,
      name: "Hotel Booking",
      href: "/user/hotelBooking",
      icon: <BsCalendarCheckFill />,
    },
    {
      id: 4,
      name: "Visa Inquiry",
      href: "/user/visaInquery",
      icon: <TbBrandGoogleBigQuery />,
    },
    {
      id: 5,
      name: "Product Orders",
      href: "/user/productOrder",
      icon: <FaCartShopping />,
    },
    {
      id: 6,
      name: "Testimonials",
      href: "/user/testimonials",
      icon: <FaUserTie />,
    },
    {
      id: 7,
      name: "Edit profile",
      href: "/user/editProfile",
      icon: <FaUserEdit />,
    },
    {
      id: 8,
      name: "Change Password",
      href: "/user/changePassword",
      icon: <BiEdit />,
    },
  ];

  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const { getCurrentUser } = useUser();
  useEffect(() => {
    getCurrentUser();
  }, []);

  useEffect(() => {
    getUser().then(({ data }) => {
      if (data?.role == "user") {
        setUser(data);
        setLoading(false);
      } else {
        router.push("/");
        setLoading(false);
      }
      setLoading(false);
    });
  }, [user?._id]);

  if (loading) {
    return <MainLoader />;
  }
  return (
    <Providers>
      {user && user?.role == "user" && (
        <div className="bg-white">
          <div className="w-full h-full">
            <Banner title="User Dashboard" />
            <div className="lg:flex travel-container lg:gap-x-6 py-[60px] md:pb-[120px] ">
              <div className="lg:hidden mb-5">
                <HiOutlineMenu
                  className="text-2xl cursor-pointer text-[#05073C]"
                  onClick={toggleDrawer}
                />
              </div>
              {/* Small Screen */}
              <Drawer
                title={false}
                closable={false}
                onClose={toggleDrawer}
                open={drawerOpen}
                width={286}
                rootClassName="custom-drawer"
              >
                <div className="flex justify-end items-end">
                  <RxCross2 onClick={toggleDrawer} className="text-2xl" />
                </div>
                <nav>
                  <div className="overflow-hidden flex items-center justify-center rounded-full border  w-24 h-24 mx-auto mb-3">
                    {user?.image ? (
                      <Image
                        crossOrigin="anonymous"
                        className="rounded-full w-full h-full object-fill"
                        src={user?.image}
                        width={200}
                        height={300}
                        alt="user"
                      />
                    ) : (
                      <Image
                        className="rounded-full w-full"
                        src="/theme1/user.jpg"
                        width={1000}
                        height={1000}
                        alt="user"
                      />
                    )}
                  </div>
                  <p className="description-2 text-center text-[#05073C]">
                    {user?.name}
                  </p>
                  <ul className="space-y-4 mt-3">
                    {menuItems.map((item) => (
                      <li key={item.id}>
                        <Link
                          href={item.href}
                          className={`flex items-center p-[8px] sm:p-[18px] border border-primary rounded font-poppins transition-colors duration-200
                         ${
                           pathname === item.href
                             ? "bg-primary text-white"
                             : "text-[#05073C] hover:text-primary "
                         }
                  `}
                        >
                          <span className="description-1 mr-2">
                            {item.icon}
                          </span>
                          <span className="description-1">
                            {i18n?.t(item.name)}
                          </span>
                        </Link>
                      </li>
                    ))}
                    <li>
                      <button
                        onClick={() => {
                          localStorage.removeItem("token");
                          message.success(i18n?.t("Logged out successfully"));
                          router.push("/");
                          getCurrentUser();
                        }}
                        className="flex items-center p-[8px] w-full sm:p-[18px] border border-primary rounded transition-colors duration-300"
                      >
                        <span className="description-1 mr-2">
                          <HiOutlineLogout />
                        </span>
                        <span className="description-1">
                          {i18n?.t("Sign Out")}
                        </span>
                      </button>
                    </li>
                  </ul>
                </nav>
              </Drawer>
              {/* Large Screen */}
              <div className="hidden lg:block lg:max-w-[300px] xl:max-w-[350px] lg:mb-0 mb-6 w-full h-fit shadow-custom-light p-4 sm:p-8 rounded-lg">
                <nav>
                  {/* image */}
                  <div className="overflow-hidden flex items-center justify-center rounded-full border border-primary/80 w-36 h-36 mx-auto mb-3">
                    {user?.image ? (
                      <Image
                        crossOrigin="anonymous"
                        className="rounded-full !w-[144px] !h-[144px] !object-fill"
                        src={user?.image}
                        width={200}
                        height={300}
                        alt="user"
                      />
                    ) : (
                      <Image
                        className="rounded-full w-full "
                        src="/theme1/user.jpg"
                        width={1000}
                        height={1000}
                        alt="user"
                      />
                    )}
                  </div>
                  <p className="heading-4 text-center text-[#05073C]">
                    {user?.name}
                  </p>
                  <ul className="mt-4 text-[#05073C] hover:text-primary transition-all duration-300">
                    {menuItems.map((item) => (
                      <li key={item.id}>
                        <Link
                          href={item.href}
                          className={`flex items-center p-2 sm:p-[18px] group rounded-lg transition-colors duration-200
                        ${
                          pathname === item.href
                            ? "text-primary "
                            : "text-[#05073C] group-hover:text-primary transition-all duration-300"
                        }
                          `}
                        >
                          <span
                            className={`description-3 mr-2 ${
                              pathname === item.href
                                ? "text-primary"
                                : "text-[#05073C] group-hover:text-primary transition-all duration-300"
                            }`}
                          >
                            {item.icon}
                          </span>
                          <span
                            className={`description-3 ${
                              pathname === item.href
                                ? "text-primary"
                                : "text-[#05073C] group-hover:text-primary transition-all duration-300"
                            }`}
                          >
                            {i18n?.t(item.name)}
                          </span>
                        </Link>
                      </li>
                    ))}
                    <li className="hover:text-primary group text-[#05073C]">
                      <button
                        onClick={() => {
                          localStorage.removeItem("token");
                          message.success(i18n?.t("Logged out successfully"));
                          router.push("/");
                          getCurrentUser();
                        }}
                        className="flex items-center p-[8px] w-full sm:p-[18px] rounded transition-colors duration-300"
                      >
                        <span className="text-lg sm:text-2xl mr-2 text-[#05073C]">
                          <HiOutlineLogout className="text-[#05073C] group-hover:text-primary transition-colors duration-300" />
                        </span>
                        <span className="description-3 text-[#05073C] group-hover:text-primary transition-colors duration-300">
                          {i18n?.t("Sign Out")}
                        </span>
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
              <div className="flex-1 shadow-custom-light xl:p-6 lg:p-5 md:p-4 p-3 rounded h-fit w-full lg:w-4/6">
                {children}
              </div>
            </div>
          </div>
        </div>
      )}
    </Providers>
  );
};

export default Layout;
