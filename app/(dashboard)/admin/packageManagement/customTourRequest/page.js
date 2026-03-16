/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import BackButton from "@/app/(dashboard)/components/common/backButton";
import Table from "@/app/(dashboard)/components/common/table";
import { useI18n } from "@/app/contexts/i18n";
import {
  deleteCustomTourRequest,
  getAllCustomTourRequests,
  updateCustomTourRequest,
} from "@/app/helper/backend";
import { useActionConfirm, useFetch } from "@/app/helper/hooks";
import { Select, Tag, Tooltip } from "antd";
import dayjs from "dayjs";

const STATUS_COLORS = {
  pending: "orange",
  contacted: "blue",
  resolved: "green",
};

const CustomTourRequestList = () => {
  const [data, getData, { loading }] = useFetch(getAllCustomTourRequests);
  const i18n = useI18n();

  const handleStatusChange = (id, newStatus) => {
    useActionConfirm(
      updateCustomTourRequest,
      { _id: id, status: newStatus },
      getData,
      "Are you sure you want to update status?"
    );
  };

  const columns = [
    {
      text: "Traveler",
      dataField: "firstName",
      formatter: (_, row) => {
        const fullName = `${row?.firstName || ""} ${row?.lastName || ""}`.trim();
        return (
          <Tooltip title={fullName?.length > 24 ? fullName : undefined}>
            <span className="cursor-help font-medium text-[#05073C]">
              {fullName?.length > 24 ? fullName.slice(0, 24) + "..." : fullName || "-"}
            </span>
          </Tooltip>
        );
      },
    },
    {
      text: "Email",
      dataField: "email",
      formatter: (email) => (
        <a href={`mailto:${email}`} className="text-blue-600 hover:underline text-sm">
          {email}
        </a>
      ),
    },
    {
      text: "Phone",
      dataField: "phone",
      formatter: (phone) =>
        phone ? (
          <a href={`tel:${phone}`} className="text-blue-600 hover:underline text-sm">
            {phone}
          </a>
        ) : (
          <span className="text-gray-400 text-sm">—</span>
        ),
    },
    {
      text: "Destination",
      dataField: "selectedDestination",
      formatter: (_, row) => row?.selectedDestination || row?.customDestination || "-",
    },
    {
      text: "Travel Date",
      dataField: "travelDate",
      formatter: (travelDate) =>
        travelDate ? dayjs(travelDate).format("DD MMM YYYY") : "-",
    },
    {
      text: "Requirements",
      dataField: "requirements",
      formatter: (requirements) => {
        const value = requirements || "";
        const shouldTruncate = value.length > 30;

        return (
          <Tooltip title={shouldTruncate ? value : undefined}>
            <span className="cursor-help">
              {shouldTruncate ? value.slice(0, 30) + "..." : value || "-"}
            </span>
          </Tooltip>
        );
      },
    },
    {
      text: "Status",
      dataField: "status",
      formatter: (status, row) => (
        <div className="flex items-center gap-2">
          <Tag color={STATUS_COLORS[status] || "default"}>
            {status || "pending"}
          </Tag>
          <Select
            value={status || "pending"}
            size="small"
            style={{ width: 130 }}
            onChange={(value) => handleStatusChange(row._id, value)}
            options={[
              { value: "pending", label: "Pending" },
              { value: "contacted", label: "Contacted" },
              { value: "resolved", label: "Resolved" },
            ]}
            className="text-xs"
          />
        </div>
      ),
    },
    {
      text: "Submitted At",
      dataField: "createdAt",
      formatter: (_, row) => (
        <span className="text-sm text-gray-500">
          {dayjs(row?.createdAt).format("DD MMM YYYY")}
        </span>
      ),
    },
  ];

  return (
    <div className="w-full overflow-x-auto mt-7 px-6">
      <div className="rounded dashboardInput bg-white">
        <div className="flex justify-between px-8 pt-8 items-center">
          <h1 className="text-[#05073C] heading-3">
            {i18n.t("Custom Tour Requests")}
          </h1>
          <BackButton />
        </div>
        <Table
          columns={columns}
          data={data}
          loading={loading}
          onReload={getData}
          onDelete={deleteCustomTourRequest}
          indexed
        />
      </div>
    </div>
  );
};

export default CustomTourRequestList;
