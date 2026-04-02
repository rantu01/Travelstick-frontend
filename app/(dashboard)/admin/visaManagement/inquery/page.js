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
  const [showRaw, setShowRaw] = useState(false);

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
        onCancel={() => {
          setViewOpen(false);
          setShowRaw(false);
        }}
        footer={null}
        destroyOnClose
        width={640}
        centered
      >
        {viewData && (
          <div className="max-w-4xl mx-auto bg-white rounded-xl p-6 space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-[#05073C]">
                  {viewData?.full_name || "N/A"}
                </h2>
                <p className="text-sm text-[#717171]">
                  ID: {viewData?._id?.$oid || viewData?._id || "N/A"}
                </p>
              </div>
              <div className="text-sm text-right text-[#717171]">
                <p>{dayjs(viewData?.createdAt).format("DD MMM, YYYY")}</p>
                <p className="mt-1">{viewData?.email || ""}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[#05073C]">
              <div>
                <p>
                  <span className="font-semibold">Email:</span>{" "}
                  <span className="text-[#717171]">{viewData?.email || "N/A"}</span>
                </p>
                <p className="mt-2">
                  <span className="font-semibold">Phone:</span>{" "}
                  <span className="text-[#717171]">{viewData?.phone || "N/A"}</span>
                </p>
                <p className="mt-2">
                  <span className="font-semibold">Visa Type:</span>{" "}
                  <span className="text-[#717171]">
                    {(() => {
                      const vt = viewData?.visa_type;
                      if (!vt) return "N/A";
                      if (typeof vt === "string") return vt;
                      if (vt?.$oid) return vt.$oid;
                      if (vt?.name) return vt.name?.[langCode] || JSON.stringify(vt);
                      return JSON.stringify(vt);
                    })()}
                  </span>
                </p>
              </div>

              <div>
                <p>
                  <span className="font-semibold">Submitted On:</span>{" "}
                  <span className="text-[#717171]">
                    {viewData?.createdAt
                      ? dayjs(viewData.createdAt).format("DD MMM, YYYY HH:mm")
                      : "N/A"}
                  </span>
                </p>
                <p className="mt-2">
                  <span className="font-semibold">Last Updated:</span>{" "}
                  <span className="text-[#717171]">
                    {viewData?.updatedAt
                      ? dayjs(viewData.updatedAt).format("DD MMM, YYYY HH:mm")
                      : "N/A"}
                  </span>
                </p>
                <p className="mt-2">
                  <span className="font-semibold">Version:</span>{" "}
                  <span className="text-[#717171]">{viewData?.__v ?? "N/A"}</span>
                </p>
              </div>
            </div>

            {/* Message / Details */}
            {activeTab === "inquiry" && (
              <div>
                <h3 className="font-semibold text-[#05073C] mb-2">Message</h3>
                <div className="text-[#717171] whitespace-pre-line">
                  {viewData?.message || "N/A"}
                </div>
              </div>
            )}

            {/* Document - only for inquiry */}
            {activeTab === "inquiry" && viewData?.file && (
              <div className="bg-white p-3 rounded-md border border-[#E8EAE8]">
                <h3 className="heading-4 font-semibold text-[#05073C] mb-3">Document</h3>
                <div className="flex items-center gap-4">
                  <a
                    href={encodeURI(viewData.file)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block px-4 py-2 bg-primary text-white rounded-lg hover:bg-[#e6491c] transition"
                  >
                    Open
                  </a>
                  <a
                    href={encodeURI(viewData.file)}
                    download
                    className="inline-block px-4 py-2 border rounded-lg text-[#05073C] hover:bg-gray-50 transition"
                  >
                    Download
                  </a>
                  <span className="text-sm text-[#717171]">{viewData.file.split("/").pop()}</span>
                </div>
              </div>
            )}

            {/* Toggle raw JSON - optional */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => setShowRaw((s) => !s)}
                className="text-sm text-primary underline"
              >
                {showRaw ? "Hide JSON" : "Show raw JSON"}
              </button>
              <div className="text-sm text-[#717171]">&nbsp;</div>
            </div>

            {showRaw && (
              <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto max-h-64">
                {JSON.stringify(viewData, null, 2)}
              </pre>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default VisaInquery;