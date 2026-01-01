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
  const [data, getData, { loading }] = useFetch(getAllVisaQuery, {}, false);

  useEffect(() => {
    getData();
  }, []);

  const columns = [
    {
      text: "Visa Type",
      dataField: "visa_type",
      formatter: (d) => (d ? <span>{d?.name?.[langCode]}</span> : N / A),
    },
    {
      text: "Email",
      dataField: "email",
      formatter: (d) => (d ? <span>{d}</span> : N / A),
    },
    {
      text: "Message",
      dataField: "message",
      formatter: (d) => {
        if (!d) return "N/A";
        const isLong = d.length > 20;
        const shortMessage = isLong ? `${d.substring(0, 20)}...` : d;
        return <span title={isLong ? d : ""}>{shortMessage}</span>;
      },
    },
    {
      text: "Inquired At",
      dataField: "createdAt",
      formatter: (_, d) => (
        <span>{dayjs(d?.createdAt).format("DD MMM, YYYY")}</span>
      ),
    },
    {
      text: "View Document",
      dataField: "file",
      formatter: (file) => (
        file ? (
          <Link
            target="_blank"
            href={file}
            className="details-button"
          >
            {i18n.t("View Document")}
          </Link>
        ) : (
          <span className="text-gray-500">{i18n.t("No Document")}</span>
        )
      ),
    },
  ];


  return (
    <div className="w-full overflow-x-auto  dashboardModal">
      <div className="rounded dashboardInput bg-white">
        <div className="flex justify-between mt-2 items-center mb-6">
          <h1 className="text-[#05073C]  heading-3">{i18n.t("Visa Inquiry List")}</h1>
        </div>
        <UserTable
          columns={columns}
          data={data}
          loading={loading}
          onReload={getData}
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
