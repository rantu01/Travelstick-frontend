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
  const [data, getData, { loading }] = useFetch(getAllVisaQuery, {}, false);
  const [viewOpen, setViewOpen] = useState(false);
  const [viewData, setViewData] = useState(null);
  useEffect(() => {
    getData();
  }, []);

  const columns = [
    {
      text: "User Name",
      dataField: "full_name",
      formatter: (_, d) => <span>{d?.full_name}</span>,
    },
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
      text: "Phone",
      dataField: "phone",
      formatter: (_, d) =>
        d?.phone ? (
          <span dir="ltr">{d?.phone}</span>
        ) : (
          <span dir="ltr">N/A</span>
        ),
    },
    {
      text: "Message",
      dataField: "message",
      formatter: (d) => {
        if (!d) return "N/A";

        const isLong = d.length > 50;
        const shortMessage = isLong ? `${d.substring(0, 50)}...` : d;

        return <span title={isLong ? d : ""}>{shortMessage}</span>;
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

  const handleView = (user) => {
    setViewData(user);
    setViewOpen(true);
  };

  return (
    <div className="w-full overflow-x-auto mt-7 dashboardModal">
      <div className="rounded dashboardInput mx-8 bg-white">
        <div className="flex justify-between px-8 pt-8 items-center">
          <h1 className="text-[#05073C]  heading-3">Visa Inquery List</h1>
        </div>
        <Table
          columns={columns}
          data={data}
          loading={loading}
          onReload={getData}
          onView={handleView}
          onDelete={deleteVisaQuery}
          indexed
          pagination
          permission={"user_list"}
        />
      </div>
      <Modal
        className=""
        open={viewOpen}
        onCancel={() => setViewOpen(false)}
        footer={null}
        destroyOnClose
        width={500}
        centered
      >
        {viewData && (
          <div className="max-w-4xl mx-auto bg-white rounded-xl  p-6 space-y-6">
            <h2 className="text-2xl font-bold text-[#05073C]">
              {viewData?.full_name || "N/A"}
            </h2>

            <div className="space-y-2 text-[#05073C]">
              <p>
                <span className="font-semibold">Email:</span>{" "}
                <span className="text-[#717171]">
                  {viewData?.email || "N/A"}
                </span>
              </p>

              <p>
                <span className="font-semibold">Phone:</span>{" "}
                <span className="text-[#717171]">
                  {viewData?.phone || "N/A"}
                </span>
              </p>

              <p>
                <span className="font-semibold">Visa Type:</span>{" "}
                <span className="text-[#717171]">
                  {viewData?.visa_type?.name?.en || "N/A"}
                </span>
              </p>

              <p>
                <span className="font-semibold">Message:</span>
                <span className="block mt-1 text-[#717171] whitespace-pre-line">
                  {viewData?.message || "N/A"}
                </span>
              </p>

              <p>
                <span className="font-semibold">Submitted On:</span>{" "}
                <span className="text-[#717171]">
                  {dayjs(viewData?.createdAt).format("DD MMM, YYYY")}
                </span>
              </p>
            </div>

            {viewData?.file && (
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
