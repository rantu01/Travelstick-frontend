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

  // ── MongoDB $date object handle করে date parse করে
  const parseDate = (val) => {
    if (!val) return null;
    if (val?.$date) return dayjs(val.$date);
    return dayjs(val);
  };

  const formatDate = (val, fmt = "DD MMM, YYYY") => {
    const d = parseDate(val);
    return d && d.isValid() ? d.format(fmt) : "N/A";
  };

  const getLocalizedText = (value) => {
    if (!value) return "";
    if (typeof value === "string") return value;
    return value?.[langCode] || value?.en || Object.values(value)?.[0] || "";
  };

  const getVisaName = (item) => {
    return getLocalizedText(item?.visa?.title) || item?.visa_name || "N/A";
  };

  const getVisaTypeName = (item) => {
    return (
      getLocalizedText(item?.visa?.visa_type?.name) ||
      getLocalizedText(item?.visa_type?.name) ||
      item?.visa_type_name ||
      "N/A"
    );
  };

  // visa object populated কিনা চেক করে
  const isVisaPopulated = (item) =>
    item?.visa && typeof item.visa === "object" && !item.visa?.$oid;

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
      formatter: (_, d) => <span>{getVisaTypeName(d)}</span>,
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
      formatter: (_, d) => <span>{formatDate(d?.createdAt)}</span>,
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
      formatter: (d) => <span>{formatDate(d)}</span>,
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
      formatter: (_, d) => <span>{formatDate(d?.createdAt)}</span>,
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

            {/* ── Header ── */}
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-[#05073C]">
                  {viewData?.full_name || "N/A"}
                </h2>
                <p className="text-sm text-[#717171]">
                  Inquiry ID:{" "}
                  {viewData?._id?.$oid || viewData?._id || "N/A"}
                </p>
              </div>
              <div className="text-sm text-right text-[#717171]">
                <p>{formatDate(viewData?.createdAt)}</p>
                <p className="mt-1">{viewData?.email || ""}</p>
              </div>
            </div>

            {/* ── Visa Info — শুধু populated হলে দেখাবে ── */}
            {isVisaPopulated(viewData) && (
              <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                <div>
                  <span className="font-semibold text-[#05073C]">Visa Name:</span>{" "}
                  <span className="text-[#717171]">{getVisaName(viewData)}</span>
                </div>
                <div>
                  <span className="font-semibold text-[#05073C]">Visa Type:</span>{" "}
                  <span className="text-[#717171]">{getVisaTypeName(viewData)}</span>
                </div>
                <div>
                  <span className="font-semibold text-[#05073C]">Visa Code:</span>{" "}
                  <span className="text-[#717171]">
                    {viewData?.visa?.visa_code || "N/A"}
                  </span>
                </div>
                <div>
                  <span className="font-semibold text-[#05073C]">Entry Type:</span>{" "}
                  <span className="text-[#717171]">
                    {viewData?.visa?.entry_type || "N/A"}
                  </span>
                </div>
                <div>
                  <span className="font-semibold text-[#05073C]">Category:</span>{" "}
                  <span className="text-[#717171]">
                    {viewData?.visa?.visa_category || "N/A"}
                  </span>
                </div>
              </div>
            )}

            {/* visa populate না হলে শুধু visa type দেখাবে */}
            {!isVisaPopulated(viewData) && (
              <div className="bg-gray-50 rounded-xl p-4">
                <div>
                  <span className="font-semibold text-[#05073C]">Visa Type:</span>{" "}
                  <span className="text-[#717171]">{getVisaTypeName(viewData)}</span>
                </div>
              </div>
            )}

            {/* ── Contact & Meta Info ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[#05073C]">
              <div>
                <p>
                  <span className="font-semibold">Email:</span>{" "}
                  <span className="text-[#717171]">{viewData?.email || "N/A"}</span>
                </p>
                <p className="mt-2">
                  <span className="font-semibold">Phone:</span>{" "}
                  <span className="text-[#717171]" dir="ltr">
                    {viewData?.phone || "N/A"}
                  </span>
                </p>
                <p className="mt-2">
                  <span className="font-semibold">Inquiry Type:</span>{" "}
                  <span className="text-[#717171]">
                    {viewData?.inquiry_type || "N/A"}
                  </span>
                </p>
              </div>

              <div>
                <p>
                  <span className="font-semibold">Submitted On:</span>{" "}
                  <span className="text-[#717171]">
                    {formatDate(viewData?.createdAt, "DD MMM, YYYY HH:mm")}
                  </span>
                </p>
              </div>
            </div>

            {/* ── Message (Inquiry tab) ── */}
            {activeTab === "inquiry" && (
              <div>
                <h3 className="font-semibold text-[#05073C] mb-2">Message</h3>
                <div className="text-[#717171] whitespace-pre-line">
                  {viewData?.message || "N/A"}
                </div>
              </div>
            )}

            {/* ── Application Details (Apply tab) ── */}
            {activeTab === "apply" && (
              <div>
                <h3 className="font-semibold text-[#05073C] mb-2">
                  Application Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[#05073C]">
                  <p>
                    <span className="font-semibold">Given Name:</span>{" "}
                    <span className="text-[#717171]">
                      {viewData?.given_name || "N/A"}
                    </span>
                  </p>
                  <p>
                    <span className="font-semibold">Last Name:</span>{" "}
                    <span className="text-[#717171]">
                      {viewData?.last_name || "N/A"}
                    </span>
                  </p>
                  <p>
                    <span className="font-semibold">Gender:</span>{" "}
                    <span className="text-[#717171]">
                      {viewData?.gender || "N/A"}
                    </span>
                  </p>
                  <p>
                    <span className="font-semibold">Date of Birth:</span>{" "}
                    <span className="text-[#717171]">
                      {formatDate(viewData?.date_of_birth)}
                    </span>
                  </p>
                  <p>
                    <span className="font-semibold">Nationality:</span>{" "}
                    <span className="text-[#717171]">
                      {viewData?.nationality || "N/A"}
                    </span>
                  </p>
                  <p>
                    <span className="font-semibold">Passport Number:</span>{" "}
                    <span className="text-[#717171]">
                      {viewData?.passport_number || "N/A"}
                    </span>
                  </p>
                  <p>
                    <span className="font-semibold">Passport Expiry:</span>{" "}
                    <span className="text-[#717171]">
                      {formatDate(viewData?.passport_expiry_date)}
                    </span>
                  </p>
                  <p>
                    <span className="font-semibold">Profession:</span>{" "}
                    <span className="text-[#717171]">
                      {viewData?.profession || "N/A"}
                    </span>
                  </p>
                </div>
                <div className="mt-3 text-[#05073C]">
                  <p>
                    <span className="font-semibold">Visited Countries:</span>{" "}
                    <span className="text-[#717171]">
                      {viewData?.visited_countries || "N/A"}
                    </span>
                  </p>
                  <p className="mt-2">
                    <span className="font-semibold">Local Address:</span>{" "}
                    <span className="text-[#717171]">
                      {viewData?.local_address || "N/A"}
                    </span>
                  </p>
                  <p className="mt-2">
                    <span className="font-semibold">Foreign Address:</span>{" "}
                    <span className="text-[#717171]">
                      {viewData?.foreign_address || "N/A"}
                    </span>
                  </p>
                </div>
              </div>
            )}

            {/* ── Document (Inquiry tab only) ── */}
            {activeTab === "inquiry" && viewData?.file && (
              <div className="bg-white p-3 rounded-md border border-[#E8EAE8]">
                <h3 className="heading-4 font-semibold text-[#05073C] mb-3">
                  Document
                </h3>
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
                  <span className="text-sm text-[#717171]">
                    {viewData.file.split("/").pop()}
                  </span>
                </div>
              </div>
            )}

            {/* ── Raw JSON Toggle ── */}
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