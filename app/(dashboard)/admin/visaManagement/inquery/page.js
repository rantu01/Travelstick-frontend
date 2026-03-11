/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { useFetch } from "@/app/helper/hooks";
import { useI18n } from "@/app/contexts/i18n";
import { deleteVisaQuery, getAllVisaQuery } from "@/app/helper/backend";
import { Modal } from "antd";
import Table from "@/app/(dashboard)/components/common/table";

const VisaInquery = () => {
  const i18n = useI18n();
  const { langCode } = useI18n();
  const [activeTab, setActiveTab] = useState("inquiry");
  const [data, getData, { loading }] = useFetch(getAllVisaQuery, {}, false);
  const [viewOpen, setViewOpen] = useState(false);
  const [viewData, setViewData] = useState(null);

  useEffect(() => {
    getData({ inquiry_type: activeTab });
  }, [activeTab]);

  // ── Inquiry Columns ──
  const inquiryColumns = [
    {
      text: "User Name",
      dataField: "full_name",
      formatter: (_, d) => <span>{d?.full_name || "N/A"}</span>,
    },
    {
      text: "Visa Type",
      dataField: "visa_type",
      formatter: (d) => (d ? <span>{d?.name?.[langCode]}</span> : "N/A"),
    },
    {
      text: "Email",
      dataField: "email",
      formatter: (d) => (d ? <span>{d}</span> : "N/A"),
    },
    {
      text: "Phone",
      dataField: "phone",
      formatter: (_, d) =>
        d?.phone ? <span dir="ltr">{d?.phone}</span> : <span>N/A</span>,
    },
    {
      text: "Message",
      dataField: "message",
      formatter: (d) => {
        if (!d) return "N/A";
        const isLong = d.length > 50;
        return (
          <span title={isLong ? d : ""}>
            {isLong ? `${d.substring(0, 50)}...` : d}
          </span>
        );
      },
    },
    {
      text: "Joined At",
      dataField: "createdAt",
      formatter: (_, d) => (
        <span>{dayjs(d?.createdAt).format("DD MMM, YYYY")}</span>
      ),
    },
  ];

  // ── Apply Columns ──
  const applyColumns = [
    {
      text: "User Name",
      dataField: "full_name",
      formatter: (_, d) => <span>{d?.full_name || "N/A"}</span>,
    },
    {
      text: "Email",
      dataField: "email",
      formatter: (d) => (d ? <span>{d}</span> : "N/A"),
    },
    {
      text: "Phone",
      dataField: "phone",
      formatter: (_, d) =>
        d?.phone ? <span dir="ltr">{d?.phone}</span> : <span>N/A</span>,
    },
    {
      text: "Appointment Date",
      dataField: "appointment_date",
      formatter: (d) =>
        d ? <span>{dayjs(d).format("DD MMM, YYYY")}</span> : "N/A",
    },
    {
      text: "Applicants",
      dataField: "number_of_applicants",
      formatter: (d) => <span>{d ?? "N/A"}</span>,
    },
    {
      text: "Per Person",
      dataField: "price_per_person",
      formatter: (d) =>
        d !== undefined ? <span>৳ {d.toLocaleString()}</span> : "N/A",
    },
    {
      text: "Total",
      dataField: "total_price",
      formatter: (d) =>
        d !== undefined ? <span>৳ {d.toLocaleString()}</span> : "N/A",
    },
    {
      text: "Applied At",
      dataField: "createdAt",
      formatter: (_, d) => (
        <span>{dayjs(d?.createdAt).format("DD MMM, YYYY")}</span>
      ),
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
          <h1 className="text-[#05073C] heading-3">Visa Inquiry List</h1>
        </div>

        {/* ── Tabs ── */}
        <div className="flex border-b px-8 mt-4">
          {[
            { key: "inquiry", label: "Enquiry" },
            { key: "apply", label: "Applications" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-6 py-2.5 text-sm font-bold transition-all border-b-2 ${
                activeTab === tab.key
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-400 hover:text-gray-600"
              }`}
            >
              {i18n.t(tab.label)}
            </button>
          ))}
        </div>

        <Table
          columns={activeTab === "inquiry" ? inquiryColumns : applyColumns}
          data={data}
          loading={loading}
          onReload={() => getData({ inquiry_type: activeTab })}
          onView={handleView}
          onDelete={deleteVisaQuery}
          indexed
          pagination
          permission={"user_list"}
        />
      </div>

      {/* ── View Modal ── */}
      <Modal
        open={viewOpen}
        onCancel={() => setViewOpen(false)}
        footer={null}
        destroyOnClose
        width={500}
        centered
      >
        {viewData && (
          <div className="max-w-4xl mx-auto bg-white rounded-xl p-6 space-y-6">
            <h2 className="text-2xl font-bold text-[#05073C]">
              {viewData?.full_name || "N/A"}
            </h2>

            <div className="space-y-2 text-[#05073C]">
              <p>
                <span className="font-semibold">Email:</span>{" "}
                <span className="text-[#717171]">{viewData?.email || "N/A"}</span>
              </p>
              <p>
                <span className="font-semibold">Phone:</span>{" "}
                <span className="text-[#717171]">{viewData?.phone || "N/A"}</span>
              </p>

              {/* Inquiry specific */}
              {activeTab === "inquiry" && (
                <>
                  <p>
                    <span className="font-semibold">Visa Type:</span>{" "}
                    <span className="text-[#717171]">
                      {viewData?.visa_type?.name?.[langCode] || "N/A"}
                    </span>
                  </p>
                  <p>
                    <span className="font-semibold">Message:</span>
                    <span className="block mt-1 text-[#717171] whitespace-pre-line">
                      {viewData?.message || "N/A"}
                    </span>
                  </p>
                </>
              )}

              {/* Apply specific */}
              {activeTab === "apply" && (
                <>
                  <p>
                    <span className="font-semibold">Appointment Date:</span>{" "}
                    <span className="text-[#717171]">
                      {viewData?.appointment_date
                        ? dayjs(viewData.appointment_date).format("DD MMM, YYYY")
                        : "N/A"}
                    </span>
                  </p>
                  <p>
                    <span className="font-semibold">Number of Applicants:</span>{" "}
                    <span className="text-[#717171]">
                      {viewData?.number_of_applicants ?? "N/A"}
                    </span>
                  </p>
                  <p>
                    <span className="font-semibold">Price Per Person:</span>{" "}
                    <span className="text-[#717171]">
                      {viewData?.price_per_person !== undefined
                        ? `৳ ${viewData.price_per_person.toLocaleString()}`
                        : "N/A"}
                    </span>
                  </p>
                  <p>
                    <span className="font-semibold">Total Price:</span>{" "}
                    <span className="text-[#717171]">
                      {viewData?.total_price !== undefined
                        ? `৳ ${viewData.total_price.toLocaleString()}`
                        : "N/A"}
                    </span>
                  </p>
                </>
              )}

              <p>
                <span className="font-semibold">Submitted On:</span>{" "}
                <span className="text-[#717171]">
                  {dayjs(viewData?.createdAt).format("DD MMM, YYYY")}
                </span>
              </p>
            </div>

            {/* Document - only for inquiry */}
            {activeTab === "inquiry" && viewData?.file && (
              <div className="bg-white p-2 rounded-md border border-[#E8EAE8]">
                <h3 className="heading-4 font-semibold text-[#05073C] mb-4">
                  Show The Document
                </h3>
                <a
                  href={encodeURI(viewData.file)}
                  download
                  className="inline-block px-5 py-2 bg-primary text-white rounded-lg hover:bg-[#e6491c] transition"
                >
                  {viewData.file.split("/").pop()}
                </a>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default VisaInquery;