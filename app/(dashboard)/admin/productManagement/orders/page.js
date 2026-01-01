"use client";
import { useI18n } from "@/app/contexts/i18n";
import { getAllProductList, updateProductOrderStatus } from "@/app/helper/backend";
import { useAction, useFetch } from "@/app/helper/hooks";
import { Select, Tooltip } from "antd";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import BackButton from "@/app/(dashboard)/components/common/backButton";
import Table from "@/app/(dashboard)/components/common/table";
import { getStatusClass } from "@/app/helper/utils";
import { useCurrency } from "@/app/contexts/site";
import ProductOrderModal from "./peoductOrderModal";
const AdminProductOrders = ({ limit, title = "Product Orders" }) => {
  let { langCode } = useI18n();
  const [data, getData, { loading }] = useFetch(
    getAllProductList,
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
    await useAction(updateProductOrderStatus, {
      body: {
        status: newStatus,
        _id: id,
      },
    });
    getData();
  };
  const columns = [
    {
      text: "Order ID",
      dataField: "order_id",
    },
    {
      text: "Order Date",
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
          {" "}
          {currency_symbol} {value}
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
          style={{ inlineSize: 150 }}
          onClear={() => getData({ status: undefined })}
          onChange={(value) => getData({ status: value })}
        >
          <Select.Option value=" ">{i18n?.t("All")}</Select.Option>
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
    <div className="w-full overflow-x-auto mt-7 px-6">
      <div className="rounded dashboardInput bg-white">
        <div className="flex justify-between items-center px-8 pt-8">
          <h1 className="text-[#05073C] heading-3"> {i18n.t("Product Orders")} </h1>
          <BackButton />
        </div>
        <div className=''>
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
      </div>
      <ProductOrderModal setViewData={setViewData} viewData={viewData} viewModalOpen={viewModalOpen} setViewModalOpen={setViewModalOpen} />
    </div>
  );
};

export default AdminProductOrders;
