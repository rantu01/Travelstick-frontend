/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import { useI18n } from "@/app/contexts/i18n";
import { getAllPackageBookingByAdmin, updateOrderStatus, updatePackageBookingStatus } from "@/app/helper/backend";
import { useAction, useFetch } from "@/app/helper/hooks";
import { Select, Tooltip } from "antd";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import BackButton from "@/app/(dashboard)/components/common/backButton";
import Table, { TableImage } from "@/app/(dashboard)/components/common/table";
import { getStatusClass } from "@/app/helper/utils";
import { useCurrency } from "@/app/contexts/site";
import PackageBookingModal from "./packageBookingModal";
const AdminPackageBooking = ({ limit, title = "Package Booking" }) => {
  let { languages, langCode } = useI18n();
  const [data, getData, { loading }] = useFetch(
    getAllPackageBookingByAdmin,
    limit ? { limit: limit } : {}
  );
  const [selectedLang, setSelectedLang] = useState(undefined);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewData, setViewData] = useState(null);
  const { currency_symbol } = useCurrency();
  const i18n = useI18n();
  useEffect(() => {
    setSelectedLang(langCode);
  }, [langCode]);

  const handleView = (value) => {
    setViewModalOpen(true);
    setViewData(value);
  };
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
      text: "Booking ID",
      dataField: "booking_id",
    },
    {
      text: "Package Name",
      dataField: "package",
      formatter: (value) => (
        <Tooltip title={(value?.name?.[langCode])?.length > 20 ? (value?.name?.[langCode]) : undefined}>
          <span className="cursor-help">
            {
              (value?.name?.[langCode])?.length > 20
                ? (value?.name?.[langCode])?.slice(0, 20) + "..."
                : (value?.name?.[langCode])
            }
          </span>
        </Tooltip>
      ),
    },
    {
      text: "Package Image",
      dataField: "package",
      formatter: (value) => <TableImage url={value?.card_image} />,
    },
    {
      text: "Booking Date",
      dataField: "createdAt",
      formatter: (_, d) => (
        <span>{dayjs(d?.createdAt).format("DD MMM YYYY")}</span>
      ),
    },
    {
      text: "User Name",
      dataField: "user",
      formatter: (value) => (
        <Tooltip title={value?.name?.length > 20 ? value?.name : undefined}>
          <span className="cursor-help">
            {value?.name?.length > 20
              ? value?.name?.slice(0, 20) + "..."
              : value?.name}
          </span>
        </Tooltip>
      ),
    },
    {
      text: "Payment Method",
      dataField: "payment",
      formatter: (value) => <span className="capitalize">{value?.method}</span>,
    },
    {
      text: i18n.t("Order Status"),
      dataField: "status",
      formatter: (_, d) => (
        <div className="dashboardSelect">
          <Select
            value={d?.status || "pending"}
            onChange={(newStatus) => {
              handleStatusChange(newStatus, d?._id);
            }}
            className="w-28 "
            options={
              d?.status === "pending"
                ? [
                  { label: i18n.t("Pending"), value: "pending" },
                  { label: i18n.t("Cancelled"), value: "cancelled" },
                ]
                : [
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
      text: "Payment Status",
      dataField: "payment",
      formatter: (value) => (
        <span className={getStatusClass(value?.status)}>
          {value?.status ? value?.status : "N/A"}
        </span>
      ),
    },
    {
      text: "Amount",
      dataField: "amount",
      formatter: (value) => (
        <p>
          {currency_symbol} {value?.toFixed(2)}
        </p>
      ),
    },
  ];
  let action = (
    <div className="flex gap-2">
      <div className="dashboardSelect">
        <Select
          allowClear
          placeholder={i18n?.t("Filter Status")}
          width={150}
          onClear={() => getData({ status: undefined })}
          onChange={(value) => getData({ status: value })}
        >
          <Select.Option value={undefined}>{i18n?.t("All")}</Select.Option>
          <Select.Option value={"accepted"}>
            {i18n?.t("Accepted")}
          </Select.Option>
          <Select.Option value={"pending"}>{i18n?.t("Pending")}</Select.Option>
          <Select.Option value={"cancelled"}>
            {i18n?.t("Cancelled")}
          </Select.Option>
        </Select>
      </div>
    </div>
  );
  return (
    <div
      className={`${limit ? "" : "w-full overflow-x-auto mt-7 px-6"
        } `}
    >
      <div>
        <div
          className={`${limit ? "" : "pt-8"
            } flex justify-between px-8 items-center`}
        >
          <h1 className="text-[#05073C] heading-3">
            {!limit && i18n.t(title)}
          </h1>
          {!limit && <BackButton />}
        </div>
        <div className={`${limit ? " !-mt-6" : ""} `}>
          <Table
            title={limit && title}
            columns={columns}
            data={data}
            loading={loading}
            onReload={getData}
            onView={handleView}
            indexed
            langCode={langCode}
            pagination
            action={!limit && action}
          />
        </div>
        {/* view modal  */}
        <PackageBookingModal viewModalOpen={viewModalOpen} setViewModalOpen={setViewModalOpen} viewData={viewData} setViewData={setViewData} />
      </div>
    </div>
  );
};

export default AdminPackageBooking;
