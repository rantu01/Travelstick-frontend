"use client";
import dayjs from "dayjs";
import React, { useState } from "react";
import { IoCheckmarkDoneCircleOutline, IoSadOutline } from "react-icons/io5";
import { AiOutlineDelete, AiOutlineNotification } from "react-icons/ai";
import {
  deleteNotificationByAdmin,
  getAllReadNotifications,
  updateNotificationByAdmin,
} from "@/app/helper/backend";
import { useI18n } from "@/app/contexts/i18n";
import { useAction, useActionConfirm } from "@/app/helper/hooks";
import PackageBookingModal from "@/app/(dashboard)/admin/packageManagement/packageBooking/packageBookingModal";
import HotelBookingModal from "@/app/(dashboard)/admin/hotelManagement/hotelBooking/bookingModal";
import ProductOrderModal from "@/app/(dashboard)/admin/productManagement/orders/peoductOrderModal";
import { Image } from "antd";

const NotificationDropdown = ({ isOpen = true, notices, getNotifications }) => {
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewModalOpenHotel, setViewModalOpenHotel] = useState(false);
  const [viewModalOpenOrder, setViewModalOpenOrder] = useState(false);
  const [viewData, setViewData] = useState(null);
  const i18n = useI18n();

  if (!isOpen) return null;

  const handleDeleteNotification = (notificationId) => {
    useActionConfirm(deleteNotificationByAdmin, { _id: notificationId }, () => {
      getNotifications();
    });
  };

  const showDetails = (data, type) => {
    setViewData(data);
    if (type === "package") {
      setViewModalOpen(true);
    } else if (type === "hotel") {
      setViewModalOpenHotel(true);
    } else if (type === "order") {
      setViewModalOpenOrder(true);
    }
  };


  return (
    <>
      <div className="max-w-96 pb-3 ">
        <div
          className="px-4 mt-2 pb-2 border-b"
          style={{
            borderColor: "#E67529",
          }}
        >
          <div className="flex items-center justify-between">
            <h4
              className="text-sm font-medium flex"
              style={{ color: "#05073C" }}
            >
              <AiOutlineNotification className="mr-1 text-xl" />
              {i18n.t("Notifications")}
            </h4>
            <button
              onClick={() => {
                useAction(getAllReadNotifications, {}, () => {
                  getNotifications();
                });
              }}
              className="text-sm flex font-medium hover:underline ml-4"
              style={{ color: "#05073C" }}
              disabled={notices?.docs?.length === 0}
            >
              <IoCheckmarkDoneCircleOutline className="mr-1  text-xl" />
              {i18n.t("Mark all as read")}
            </button>
          </div>
        </div>
        <div className="max-h-96 border overflow-y-auto">
          {notices?.docs?.length > 0 ? (
            notices.docs.map((notification) => (
              <div
                key={notification?._id}
                className={`${
                  !notification?.is_read
                    ? "bg-gray-200 border-b border-b-gray-200"
                    : ""
                } px-3 py-3 flex items-start relative`}
              >
                <div
                  className="w-10 h-10 flex-shrink-0 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: "#FFE6D7", color: "#E67529" }}
                >
                  {notification?.type === "order" ? (
                    <Image
                      src={
                        notification?.data?.products?.[0]?.product?.thumb_image || "/noti.jpg"
                      }
                      width={40}
                      height={40}
                      className="w-10 h-10 flex-shrink-0 rounded-lg flex items-center justify-center"
                    />
                  ) : notification?.type === "package" ? (
                    <Image
                      src={
                        notification?.data?.package?.banner_image || "/noti.jpg"
                      }
                      width={40}
                      height={40}
                      className="w-10 h-10 flex-shrink-0 rounded-lg flex items-center justify-center"
                    />
                  ) : notification?.type === "hotel" ? (
                    <Image
                      src={notification?.data?.hotel?.banner_image || "/noti.jpg"}
                      width={40}
                      height={40}
                      className="w-10 h-10 flex-shrink-0 rounded-lg flex items-center justify-center"
                    />
                  ) : (
                    <Image src={"/noti.jpg"} width={32} height={32} />
                  )}
                </div>
                <div className="flex-1 ml-2">
                  {notification?.type === "order" ? (
                    <button
                      onClick={() =>
                        showDetails(notification?.data, notification?.type)
                      }
                      className="text-[#05073C] hover:underline relative line-clamp-2 text-left hover:text-primary cursor-pointer"
                    >
                      {notification?.title}
                    </button>
                  ) : notification?.type === "package" ? (
                    <button
                      onClick={() =>
                        showDetails(notification?.data, notification?.type)
                      }
                      className="text-[#05073C] text-left  hover:underline hover:text-primary cursor-pointer"
                    >
                      {notification?.title}
                    </button>
                  ) : notification?.type === "hotel" ? (
                    <button
                      onClick={() =>
                        showDetails(notification?.data, notification?.type)
                      }
                      className=" text-[#05073C] line-clamp-2 text-left  relative  hover:underline hover:text-primary cursor-pointer"
                    >
                      {notification?.title}
                    </button>
                  ) : (
                    <p className="text-[#05073C] line-clamp-2 text-left hover:underline relative hover:text-primary cursor-pointer">
                      {notification?.title}
                    </p>
                  )}
                  <p className="text-[12px] text-gray-600 line-clamp-2">
                    {notification?.message}
                  </p>
                  <div className="flex justify-between mt-2">
                    <p className="text-xs text-gray-400 mt-1 flex items-center gap-2 justify-between">
                      <span>
                        {dayjs(notification?.createdAt).format(
                          "YYYY-MM-DD HH:mm"
                        )}
                      </span>
                      <span
                        onClick={() => {
                          if (!notification?.is_read) {
                            useAction(
                              updateNotificationByAdmin,
                              {
                                body: {
                                  _id: notification?._id,
                                  is_read: true,
                                },
                              },
                              () => {
                                getNotifications();
                              }
                            );
                          }
                        }}
                        className=""
                      >
                        {notification?.is_read ? (
                          <span className="text-green-500 hover:no-underline cursor-not-allowed">
                            {i18n.t("Already marked")}
                          </span>
                        ) : (
                          <span className="font-semibold text-primary/80 hover:underline cursor-pointer">
                            {i18n.t("Mark as read")}
                          </span>
                        )}
                      </span>
                    </p>
                    <button
                      className=" text-red-500 hover:text-red-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteNotification(notification?._id);
                      }}
                    >
                      <AiOutlineDelete size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="px-4 py-3 flex items-center gap-2 justify-center">
              <IoSadOutline />
              <p className="text-sm font-medium text-gray-800 line-clamp-1">
                {i18n.t("No Notification Found")}
              </p>
            </div>
          )}
        </div>
      </div>
      <PackageBookingModal
        viewModalOpen={viewModalOpen}
        setViewModalOpen={setViewModalOpen}
        viewData={viewData}
        setViewData={setViewData}
      />
      <HotelBookingModal
        viewModalOpen={viewModalOpenHotel}
        setViewModalOpen={setViewModalOpenHotel}
        viewData={viewData}
        setViewData={setViewData}
      />

      <ProductOrderModal
        viewModalOpen={viewModalOpenOrder}
        setViewModalOpen={setViewModalOpenOrder}
        viewData={viewData}
        setViewData={setViewData}
      />
    </>
  );
};

export default NotificationDropdown;
