'use client';
import { useState } from "react";
import { Select, Tooltip } from "antd";
import { useAction, useFetch } from "@/app/helper/hooks";
import { getAllPackageBookingByAdmin, updatePackageBookingStatus } from "@/app/helper/backend";
import { useI18n } from "@/app/contexts/i18n";
import DashboardTable from "./common/dashboardTable";
import { FaEye } from "react-icons/fa6";
import { useCurrency } from "@/app/contexts/site";
import dayjs from "dayjs";
import PackageBookingModal from "../admin/packageManagement/packageBooking/packageBookingModal";
const DashboardPackageBooking = () => {
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [data, getData, { loading }] = useFetch(getAllPackageBookingByAdmin, { limit: 5 });
  const bookingData = data?.docs || [];
  const { currency_symbol } = useCurrency();
  const [viewData, setViewData] = useState(null);
  const i18n = useI18n();
  const { langCode } = useI18n();

  const handleStatusChange = async (newStatus, id) => {
    await useAction(updatePackageBookingStatus, {
      body: {
        status: newStatus,
        _id: id,
      },
    });
    getData();
  };
  const columns = [
    {
      title: "Package Name",
      key: "package",
      render: (value) => (
        <Tooltip title={value?.package?.name?.[langCode]?.length > 20 ? value?.package?.name?.[langCode] : undefined}>
          <span className="cursor-help">
            {
              value?.package?.name?.[langCode]?.length > 20
                ? value?.package?.name?.[langCode]?.slice(0, 20) + "..."
                : value?.package?.name?.[langCode]
            }
          </span>
        </Tooltip>
      ),
    },
    {
      title: "Booking Date",
      key: "createdAt",
      render: (_, d) => (
        <span>{dayjs(d?.createdAt).format("DD MMM YYYY")}</span>
      ),
    },
    {
      title: "Amount",
      key: "amount",
      render: (value) => (
        <p>
          {currency_symbol} {value?.amount.toFixed(2)}
        </p>
      ),
    },
    {
      title: i18n.t("Order Status"),
      key: "status",
      render: (_, d) => (
        <div className="dashboardSelect">
          <Select
            value={d?.status || "pending"}
            onChange={(newStatus) => {
              handleStatusChange(newStatus, d?._id);
            }}
            className="w-28" 
            options={
              d?.status === "pending" || d?.status === "cancelled"
                ? [
                  { label: i18n.t("Pending"), value: "pending" },
                  { label: i18n.t("Cancelled"), value: "cancelled" },
                ]
                : [
                  { label: i18n.t("Pending"), value: "pending" },
                  { label: i18n.t("Cancelled"), value: "cancelled" },
                  { label: i18n.t("Confirmed"), value: "confirmed" },
                  { label: i18n.t("Completed"), value: "completed" },
                ]
            }
          />
        </div>
      ),
    },
    {
      title: "Action",
      key: "actions",
      render: (_, record) => (
        <button
          className="btn btn-outline-success btn-sm focus:shadow-none border border-primary text-primary p-2 rounded hover:bg-primary hover:text-[#fff] transition-all duration-300 ease-in-out"
          title="View"
          onClick={() => {
            setViewModalOpen(true);
            setViewData(record);
          }}
        >
          <FaEye />
        </button>
      ),
    },
  ];

  return (
    <div className="xl:m-6 lg:m-4 m-3">
      <h2 className="heading-3 text-[#05073C] mb-4">{i18n.t("Recent Package Bookings")}</h2>
      <DashboardTable
        columns={columns}
        data={bookingData}
        loading={loading}
      />
      <PackageBookingModal viewModalOpen={viewModalOpen} setViewModalOpen={setViewModalOpen} viewData={viewData} setViewData={setViewData} />
    </div>
  );
};

export default DashboardPackageBooking;
