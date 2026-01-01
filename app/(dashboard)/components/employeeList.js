'use client';
import { useState } from "react";
import { Modal } from "antd";
import { CgProfile } from "react-icons/cg";
import { useFetch } from "@/app/helper/hooks";
import { GetAllEmployees } from "@/app/helper/backend";
import { useI18n } from "@/app/contexts/i18n";
import DashboardTable from "./common/dashboardTable";
import { FaEye } from "react-icons/fa6";

const EmployeeList = () => {
  const [data, getData, { loading }] = useFetch(GetAllEmployees, { limit: 6 });
  const employeeData = data?.docs || [];

  const [viewOpen, setViewOpen] = useState(false);
  const [viewData, setViewData] = useState(null);
  const i18n = useI18n();

  const columns = [
    {
      title: i18n?.t("Name") || "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: i18n?.t("Phone") || "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Action",
      key: "actions",
      render: (_, record) => (
        <button
          className="btn btn-outline-success btn-sm focus:shadow-none border border-primary text-primary p-2 rounded hover:bg-primary hover:text-[#fff] transition-all duration-300 ease-in-out"
          title="View"
          onClick={() => {
            setViewData(record);
            setViewOpen(true);
          }}
        >
          <FaEye />
        </button>
      ),
    },
  ];

  return (
    <div className="xl:m-6 lg:m-4 m-3">
      <h2 className="heading-3 text-[#05073C] mb-4">{i18n.t("Employee List")}</h2>
      <DashboardTable
        columns={columns}
        data={employeeData}
        loading={loading}
      />
      <Modal
        open={viewOpen}
        className=""
        onCancel={() => setViewOpen(false)}
        footer={null}
        destroyOnClose
      >
        {viewData && (
          <div className="mt-6 gap-8 px-5 md:px-6 py-2 md:py-3 lg:py-4 xl:py-5">
            <h5 className="text-[#05073C] heading-4 text-center">
              {i18n.t(`Details of ${viewData?.name}`)}
            </h5>
            <div className="mt-4">
              <div>
                {
                  viewData?.images?.length > 0 && viewData?.images[0] ? (
                    <Image
                      src={viewData?.images[0]}
                      alt="User Image"
                      width={1000}
                      height={1000}
                      className="Rounded-full bg-light mb-6 mx-auto object-cover"
                    />
                  ) :
                    <CgProfile className="lg:text-8xl text-6xl mx-auto mb-2 text-[#05073C]" />
                }
              </div>
              <div className="w-full">
                {[
                  { label: i18n.t("Name") || "Name", value: viewData?.name, icon: "👤" },
                  { label: i18n.t("Email") || "Email", value: viewData?.email, icon: "✉️" },
                  { label: i18n.t("Phone") || "Phone", value: viewData?.phone, icon: "📞" },
                ].map((item, index) => (
                  <div
                    key={index}
                    className={`flex justify-between items-center gap-4 pb-4 w-full ${index < 6 ? "border-b border-gray-200" : ""
                      }`}
                  >
                    <div className="flex items-center gap-2 mt-4">
                      <span className="text-[#05073C] description-2">{item?.icon}</span>
                      <h3 className="text-sm capitalize font-semibold text-[#05073C] description-2">
                        {i18n.t(item?.label) || item?.label}
                      </h3>
                    </div>
                    <h3 className="text-sm font-medium truncate mt-4 text-[#171717] description-1">
                      {i18n.t(item?.value) || "N/A"}
                    </h3>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default EmployeeList;
