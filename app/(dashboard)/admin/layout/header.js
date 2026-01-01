/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import {
  Badge,
  Dropdown,
  Form,
  Modal,
  Popover,
  Select,
  Space,
  message,
} from "antd";
import { FaBars } from "react-icons/fa";
import { FiLock, FiLogOut, FiUser } from "react-icons/fi";
import { BiUser } from "react-icons/bi";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useI18n } from "@/app/contexts/i18n";
import { useUser } from "@/app/contexts/user";
import FormPassword from "@/app/components/form/password";
import { getNotificationsByAdmin, updatePassword } from "@/app/helper/backend";
import Image from "next/image";
import { IoNotificationsOutline } from "react-icons/io5";
import Link from "next/link";
import NotificationDropdown from "@/app/components/common/notification";
import { useFetch } from "@/app/helper/hooks";
const Header = () => {
  const [open, setOpen] = useState(false);
  const { user, getCurrentUser } = useUser();
  useEffect(() => {
    getCurrentUser();
  }, []);
  const router = useRouter();
  const i18n = useI18n();
  const [notifications, getNotifications] = useFetch(getNotificationsByAdmin, { limit: 100 });
  const findUnreadNotifications = notifications?.docs?.filter(
    (notification) => !notification?.is_read
  );
  const langFromLocalStorage =
    typeof localStorage !== "undefined" ? localStorage.getItem("lang") : null;
  const defaultLang = i18n?.languages?.find((lang) => lang?.default);
  const [selectedLang, setSelectedLang] = useState(() => {
    return (
      i18n?.languages?.find((lang) => lang._id === langFromLocalStorage) ||
      defaultLang
    );
  });

  useEffect(() => {
    const langFromStorage = localStorage.getItem("lang");
    const currentLang = i18n?.languages?.find(
      (lang) => lang._id === langFromStorage
    );
    if (currentLang) {
      setSelectedLang(currentLang);
    }
  }, [i18n?.languages]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
    message.success(i18n?.t("Logged out successfully"));
    getCurrentUser();
  };
  const items = [
    {
      label: i18n?.t("Profile"),
      icon: <FiUser />,
      key: "1",
      onClick: () => router.push("/admin/profile"),
    },
    {
      label: i18n?.t("Change Password"),
      icon: <FiLock />,
      key: "2",
      onClick: () => {
        setOpen(true);
      },
    },
    {
      label: i18n?.t("Logout"),
      icon: <FiLogOut />,
      key: "3",
      onClick: handleLogout,
    },
  ];

  const [form] = Form.useForm();
  const handleSubmit = async (value) => {
    if (
      !!value?.oldPassword &&
      !!value?.password &&
      !!value?.confirm_password
    ) {
      const data = await updatePassword({
        body: {
          old_password: value.oldPassword,
          password: value.password,
          confirm_password: value.confirm_password,
        },
      });
      if (data.success) {
        message.success(data.message);
        localStorage.removeItem("token");
        router.push("/");
        getCurrentUser();
        setOpen(false);
        form.resetFields();
      } else {
        message.error(data.errorMessage);
      }
    }
  };

  return (
    <div className="z-30 header shadow-lg bg-white">
      <div className="flex justify-between items-center p-4">
        <div className="">
          <FaBars
            className="lg:hidden sm:-ml-20"
            role="button"
            onClick={() => {
              window.document
                .querySelector(".sidebar")
                .classList.toggle("open");
              window.document
                .querySelector(".sidebar-overlay")
                .classList.toggle("open");
            }}
          />
        </div>

        <div className="flex items-center gap-x-3 xl:gap-x-6">
          <Link
            target="_blank"
            href={"/"}
            className="cursor-pointer flex items-center justify-center gap-1"
          >
            <Image
              src="/theme1/dashboard/live.png"
              alt="live"
              width={1000}
              height={1000}
              className="rounded-full object-cover w-[25px] h-[25px] md:w-[30px] md:h-[30px] lg:w-[40px] lg:h-[40px] p-1 lg:p-1.5"
            />
            <p className="description-1 text-[#05073C]">Live Site</p>
          </Link>
          {selectedLang ? (
            <Dropdown
              placement="bottom"
              trigger={["hover"]}
              menu={{
                items: i18n?.languages?.map((lang) => ({
                  key: lang?._id,
                  label: (
                    <div className="flex items-center gap-2">
                      <Image
                        src={lang.flag || "/eng.png"}
                        alt={lang.name}
                        width={20}
                        height={15}
                        className="rounded-sm"
                      />
                      <span className="capitalize">{lang.name}</span>
                    </div>
                  ),
                  onClick: () => {
                    i18n?.changeLanguage(lang._id);
                    localStorage.setItem("lang", lang._id);
                    setSelectedLang(lang);
                  },
                })),
              }}
            >
              <div className="cursor-pointer overflow-hidden flex items-center justify-center w-[25px] h-[25px] md:w-[30px] md:h-[30px] lg:w-[40px] lg:h-[40px] rounded-full bg-primary/40">
                <Image
                  src={selectedLang.flag || "/eng.png"}
                  alt={selectedLang.name}
                  width={1000}
                  height={1000}
                  className="rounded-full object-cover w-[25px] h-[25px] md:w-[30px] md:h-[30px] lg:w-[40px] lg:h-[40px] p-1 lg:p-2"
                />
              </div>
            </Dropdown>
          ) : (
            <Dropdown
              placement="bottom"
              trigger={["hover"]}
              menu={{
                items: i18n?.languages?.map((lang) => ({
                  key: lang?._id,
                  label: (
                    <div className="flex items-center gap-2">
                      <Image
                        src={lang.flag || "/eng.png"}
                        alt={lang.name}
                        width={20}
                        height={15}
                        className="rounded-sm"
                      />
                      <span className="capitalize">{lang.name}</span>
                    </div>
                  ),
                  onClick: () => {
                    i18n?.changeLanguage(lang._id);
                    localStorage.setItem("lang", lang._id);
                    setSelectedLang(lang);
                  },
                })),
              }}
            >
              <div className="cursor-pointer overflow-hidden flex items-center justify-center w-[25px] h-[25px] md:w-[30px] md:h-[30px] lg:w-[40px] lg:h-[40px] rounded-full bg-primary/40">
                <Image
                  src="/eng.png"
                  alt="English"
                  width={1000}
                  height={1000}
                  className="rounded-full object-cover w-[25px] h-[25px] md:w-[30px] md:h-[30px] lg:w-[40px] lg:h-[40px] p-1 lg:p-2"
                />
              </div>
            </Dropdown>
          )}

          <div className="cursor-pointer flex mr-3  items-center justify-center rounded-full">
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
                className=""
                count={findUnreadNotifications?.length || 0}
                size="small"
                showZero
              >
                <IoNotificationsOutline className="text-xl lg:text-2xl text-[#05073C] " />
              </Badge>
            </Popover>
          </div>

          <Dropdown
            menu={{
              items,
            }}
          >
            <div className="cursor-pointer flex items-center px-3">
              <Space className="cursor-pointer">
                {user?.image ? (
                  <Image
                    src={user?.image}
                    alt={user?.name}
                    width={40}
                    height={40}
                    className="w-[25px] h-[25px] md:w-[30px] md:h-[30px] lg:w-[40px] lg:h-[40px] rounded-full"
                  />
                ) : (
                  <BiUser className="text-lg sm:text-xl" />
                )}
              </Space>
              <p className="text-lg ml-6 capitalize">{user?.role}</p>
            </div>
          </Dropdown>
        </div>
      </div>

      <Modal
        className=" xl:!w-[700px]"
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        destroyOnClose={true}
      >
        <div>
          <Form
            className=""
            layout="vertical"
            onFinish={handleSubmit}
            form={form}
          >
            <h4 className="heading-4 font-bold pb-5 border-b !border-primary/20">
              Update Password
            </h4>
            <div className="auth grid grid-cols-1 gap-3 mt-5 ">
              <div>
                <FormPassword
                  className="w-full rounded bg-transparent p-3 dashinput"
                  label="Old Password"
                  name="oldPassword"
                  placeholder="Enter your Old Password"
                  required={true}
                />
              </div>
              <div className="">
                <FormPassword
                  className="w-full rounded bg-transparent p-3 dashinput"
                  label="Password"
                  name="password"
                  placeholder="Enter your password"
                  required={true}
                />
              </div>
              <div className="">
                <FormPassword
                  className="w-full rounded bg-transparent p-3 dashinput"
                  confirm
                  label="Re-type Password"
                  name="confirm_password"
                  placeholder="Confirm your password"
                  required={true}
                />
              </div>
            </div>
            <button className=" md:mt-6 sm:mt-5 mt-4 common-btn bg-primary text-[#02050A] !rounded">
              Save Changes
            </button>
          </Form>
        </div>
      </Modal>
    </div>
  );
};

export default Header;
