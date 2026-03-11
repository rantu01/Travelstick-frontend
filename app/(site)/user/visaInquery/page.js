"use client";
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { useFetch } from "@/app/helper/hooks";
import { useI18n } from "@/app/contexts/i18n";
import { getAllVisaQuery } from "@/app/helper/backend";
import UserTable from "@/app/(dashboard)/components/common/userTable";
import Link from "next/link";

const VisaInquery = () => {
  const i18n = useI18n();
  const { langCode } = useI18n();
  const [activeTab, setActiveTab] = useState("inquiry");
  const [data, getData, { loading }] = useFetch(getAllVisaQuery, {}, false);

  useEffect(() => {
    getData({ inquiry_type: activeTab });
  }, [activeTab]);

  // ── Inquiry Columns ──
  const inquiryColumns = [
    {
      text: "Full Name",
      dataField: "full_name",
      formatter: (d) => d || "N/A",
    },
    {
      text: "Visa Type",
      dataField: "visa_type",
      formatter: (d) => d ? <span>{d?.name?.[langCode]}</span> : "N/A",
    },
    {
      text: "Email",
      dataField: "email",
      formatter: (d) => d || "N/A",
    },
    {
      text: "Phone",
      dataField: "phone",
      formatter: (d) => d || "N/A",
    },
    {
      text: "Message",
      dataField: "message",
      formatter: (d) => {
        if (!d) return "N/A";
        return d.length > 30 ? (
          <span title={d}>{d.substring(0, 30)}...</span>
        ) : (
          <span>{d}</span>
        );
      },
    },
    {
      text: "Date",
      dataField: "createdAt",
      formatter: (_, d) => (
        <span>{dayjs(d?.createdAt).format("DD MMM, YYYY")}</span>
      ),
    },
    {
      text: "Document",
      dataField: "file",
      formatter: (file) =>
        file ? (
          <Link target="_blank" href={file} className="details-button">
            {i18n.t("View")}
          </Link>
        ) : (
          <span className="text-gray-500">{i18n.t("No Document")}</span>
        ),
    },
  ];

  // ── Apply Columns ──
  const applyColumns = [
    {
      text: "Full Name",
      dataField: "full_name",
      formatter: (d) => d || "N/A",
    },
    {
      text: "Email",
      dataField: "email",
      formatter: (d) => d || "N/A",
    },
    {
      text: "Phone",
      dataField: "phone",
      formatter: (d) => d || "N/A",
    },
    {
      text: "Appointment Date",
      dataField: "appointment_date",
      formatter: (d) =>
        d ? dayjs(d).format("DD MMM, YYYY") : "N/A",
    },
    {
      text: "Applicants",
      dataField: "number_of_applicants",
      formatter: (d) => d ?? "N/A",
    },
    {
      text: "Per Person",
      dataField: "price_per_person",
      formatter: (d) => (d !== undefined ? `৳ ${d.toLocaleString()}` : "N/A"),
    },
    {
      text: "Total",
      dataField: "total_price",
      formatter: (d) => (d !== undefined ? `৳ ${d.toLocaleString()}` : "N/A"),
    },
    {
      text: "Date",
      dataField: "createdAt",
      formatter: (_, d) => (
        <span>{dayjs(d?.createdAt).format("DD MMM, YYYY")}</span>
      ),
    },
  ];

  return (
    <div className="w-full overflow-x-auto dashboardModal">
      <div className="rounded dashboardInput bg-white">
        <div className="flex justify-between mt-2 items-center mb-4">
          <h1 className="text-[#05073C] heading-3">
            {i18n.t("Visa Inquiry List")}
          </h1>
        </div>

        {/* ── Tabs ── */}
        <div className="flex border-b mb-6">
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

        <UserTable
          columns={activeTab === "inquiry" ? inquiryColumns : applyColumns}
          data={data}
          loading={loading}
          onReload={() => getData({ inquiry_type: activeTab })}
          indexed
          noActions={true}
          pagination
          permission={"user_list"}
        />
      </div>
    </div>
  );
};

export default VisaInquery;