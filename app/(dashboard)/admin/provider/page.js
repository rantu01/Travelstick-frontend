"use client";
import BackButton from "@/app/(dashboard)/components/common/backButton";
import Button from "@/app/(dashboard)/components/common/button";
import Table, { TableImage } from "@/app/(dashboard)/components/common/table";
import { useI18n } from "@/app/contexts/i18n";
import { DeleteProvider, GetAllProviders } from "@/app/helper/backend";
import { useFetch } from "@/app/helper/hooks";
import { Image, Modal, Tooltip } from "antd";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Providers = () => {
  const router = useRouter();
  let { languages, langCode } = useI18n();
  const [data, getData, { loading }] = useFetch(GetAllProviders);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewData, setViewData] = useState(null);
  const i18n = useI18n();

  const columns = [
    {
      text: "Image",
      dataField: "image",
      formatter: (value) => (
        <>
          <TableImage url={value || "/man.png"} />
        </>
      ),
    },
    {
      text: "Name",
      dataField: "name",
      formatter: (title) => (
        <span>
          <Tooltip title={title?.length > 30 ? title : undefined}>
            <span className="cursor-help">
              {title?.length > 30 ? title?.slice(0, 30) + "..." : title}
            </span>
          </Tooltip>
        </span>
      ),
    },
    {
      text: "Email",
      dataField: "email",
      formatter: (email) => <p className="">{email}</p>,
    },
    {
      text: "Phone",
      dataField: "phone",
      formatter: (phone) => <p className="">{phone}</p>,
    },
    {
      text: "Created At",
      dataField: "createdAt",
      formatter: (_, d) => (
        <span>{dayjs(d?.createdAt).format("DD MMM, YYYY")}</span>
      ),
    },
  ];
  const handleView = (value) => {
    setViewModalOpen(true);
    setViewData(value);
  };
  return (
    <>
      <div className="w-full overflow-x-auto mt-7 px-6">
        <div className="rounded dashboardInput bg-white">
          <div className="flex justify-between px-8 pt-8 items-center">
            <h1 className="text-[#05073C] heading-3">{i18n.t("Tours Guiders")}</h1>
            <BackButton />
          </div>
          <Table
            columns={columns}
            data={data}
            loading={loading}
            onReload={getData}
            action={
              <Button
                onClick={() => {
                  router.push("/admin/provider/addProvider");
                }}
              >
                {i18n.t("Add New")}
              </Button>
            }
            onEdit={(values) => {
              router.push(`/admin/provider/editProvider?_id=${values._id}`);
            }}
            onDelete={DeleteProvider}
            onView={handleView}
            indexed
            langCode={langCode}
            pagination
          />

          {/* view modal  */}
          <Modal
            className=""
            open={viewModalOpen}
            onCancel={() => {
              setViewModalOpen(false), setViewData(null);
            }}
            footer={null}
            destroyOnClose
            width={800}
            centered
          >
            {viewData && (
              <div className="modal-wrapper">
                <div className="mt-3">
                  <h3 className="heading-4 text-center text-[#05073C]">
                    {i18n.t("Tour Guider Details of")} {viewData?.name}
                  </h3>
                  <div className="w-full flex items-center justify-center mt-3">
                    <Image
                      src={viewData?.image}
                      width={200}
                      height={200}
                      alt="image"
                      className="w-full h-full rounded-full"
                    />
                  </div>
                  <table className="w-full text-left mt-6 text-[#05073C]">
                    <tbody>
                      {[
                        { label: "Name", value: viewData?.name },
                        { label: "About", value: viewData?.about?.[langCode] },
                        {
                          label: "Specialists",
                          value: Array.isArray(viewData?.specialists)
                            ? viewData?.specialists
                            : null,
                          isList: true,
                        },
                        {
                          label: "Qualifications",
                          value: Array.isArray(viewData?.qualifications)
                            ? viewData.qualifications
                            : null,
                          isList: true,
                        },
                        { label: "Email", value: viewData?.email },
                        { label: "Phone", value: viewData?.phone },
                        {
                          label: "Professional Information",
                          value: viewData?.professional_info?.[langCode],
                        },
                        {
                          label: "Facebook Url",
                          value: viewData?.facebook_url,
                        },
                        {
                          label: "Linkedin Url",
                          value: viewData?.linkedin_url,
                        },
                        {
                          label: "Instagram Url",
                          value: viewData?.instagram_url,
                        },
                        { label: "Twitter Url", value: viewData?.x_url },
                        {
                          label: "Create At",
                          value: dayjs(viewData?.createdAt).format(
                            "DD MMM YYYY"
                          ),
                        },
                      ].map((item, index) => (
                        <tr
                          key={index}
                          className={index < 20 ? "border border-gray-200" : ""}
                        >
                          <td className="py-2 px-4 font-semibold text-[#05073C] description-2 whitespace-pre">
                            {i18n.t(item.label)}
                          </td>
                          <td className="py-2 px-4 text-[#717171] description-1 ">
                            {item?.isList && Array.isArray(item.value) ? (
                              <ul className="list-disc list-inside space-y-1">
                                {item.value.map((listItem, i) => (
                                  <li key={i}>{listItem}</li>
                                ))}
                              </ul>
                            ) : (
                              item?.value || "N/A"
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </Modal>
        </div>
      </div>
    </>
  );
};

export default Providers;
