"use client";
import React, { useState } from "react";
import dayjs from "dayjs";
import { Modal } from "antd";
import Table from "@/app/(dashboard)/components/common/table";
import { useFetch } from "@/app/helper/hooks";
import {
  deletePackageInquiry,
  getAllPackageInquiries,
} from "@/app/helper/backend";
import { useI18n } from "@/app/contexts/i18n";

const PackageInquiryList = () => {
  const i18n = useI18n();
  const { langCode } = useI18n();
  const [data, getData, { loading }] = useFetch(getAllPackageInquiries, {}, false);
  const [viewOpen, setViewOpen] = useState(false);
  const [viewData, setViewData] = useState(null);

  React.useEffect(() => {
    getData({ page: 1, limit: 10 });
  }, []);

  const columns = [
    {
      text: "User Name",
      dataField: "full_name",
      formatter: (_, row) => <span>{row?.full_name || "N/A"}</span>,
    },
    {
      text: "Package",
      dataField: "package",
      formatter: (value) => {
        const packageName = value?.name?.[langCode] || value?.name?.en;
        return <span>{packageName || "N/A"}</span>;
      },
    },
    {
      text: "Email",
      dataField: "email",
      formatter: (value) => <span>{value || "N/A"}</span>,
    },
    {
      text: "Phone",
      dataField: "phone",
      formatter: (value) => <span dir="ltr">{value || "N/A"}</span>,
    },
    {
      text: "Message",
      dataField: "message",
      formatter: (value) => {
        if (!value) return "N/A";
        const isLong = value.length > 60;
        return <span title={isLong ? value : ""}>{isLong ? `${value.slice(0, 60)}...` : value}</span>;
      },
    },
    {
      text: "Submitted",
      dataField: "createdAt",
      formatter: (_, row) => <span>{dayjs(row?.createdAt).format("DD MMM, YYYY")}</span>,
    },
  ];

  const handleView = (item) => {
    setViewData(item);
    setViewOpen(true);
  };

  return (
    <div className="w-full overflow-x-auto mt-7 dashboardModal">
      <div className="rounded dashboardInput mx-8 bg-white">
        <div className="flex justify-between px-8 pt-8 items-center">
          <h1 className="text-[#05073C] heading-3">Package Inquiry List</h1>
        </div>

        <Table
          columns={columns}
          data={data}
          loading={loading}
          onReload={getData}
          onView={handleView}
          onDelete={deletePackageInquiry}
          indexed
          pagination
        />
      </div>

      <Modal
        open={viewOpen}
        onCancel={() => setViewOpen(false)}
        footer={null}
        destroyOnClose
        width={640}
        centered
      >
        {viewData && (
          <div className="max-w-4xl mx-auto bg-white rounded-xl p-6 space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-[#05073C]">
                  {viewData?.full_name || "N/A"}
                </h2>
                <p className="text-sm text-[#717171]">
                  {viewData?.package?.name?.[langCode] || viewData?.package?.name?.en || "N/A"}
                </p>
              </div>
              <div className="text-sm text-right text-[#717171]">
                <p>{dayjs(viewData?.createdAt).format("DD MMM, YYYY HH:mm")}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[#05073C]">
              <p>
                <span className="font-semibold">Email:</span>{" "}
                <span className="text-[#717171]">{viewData?.email || "N/A"}</span>
              </p>
              <p>
                <span className="font-semibold">Phone:</span>{" "}
                <span className="text-[#717171]">{viewData?.phone || "N/A"}</span>
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-[#05073C] mb-2">Message</h3>
              <div className="text-[#717171] whitespace-pre-line">
                {viewData?.message || "N/A"}
              </div>
            </div>

            <div className="text-xs text-[#94a3b8]">ID: {viewData?._id || "N/A"}</div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default PackageInquiryList;
