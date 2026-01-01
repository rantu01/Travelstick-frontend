/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import BackButton from "@/app/(dashboard)/components/common/backButton";
import Button from "@/app/(dashboard)/components/common/button";
import Table, { TableImage } from "@/app/(dashboard)/components/common/table";
import { useI18n } from "@/app/contexts/i18n";
import { blogDelete, blogGet, blogUpdate } from "@/app/helper/backend";
import { useActionConfirm, useFetch } from "@/app/helper/hooks";
import { Image, Modal, Switch, Tooltip } from "antd";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Blogs = () => {
  const router = useRouter();
  const { langCode } = useI18n();
  const [data, getData, { loading }] = useFetch(blogGet);
  const [selectedLang, setSelectedLang] = useState(undefined);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewData, setViewData] = useState(null);

  const i18n = useI18n();
  useEffect(() => {
    setSelectedLang(langCode);
  }, [langCode]);

  const columns = [
    {
      text: "Image",
      dataField: "card_image",
      formatter: (value) => (
        <>
          <TableImage url={value || "/man.png"} />
        </>
      ),
    },
    {
      text: "Title",
      dataField: "title",

      formatter: (title) => (
        <span>
          <Tooltip
            title={
              (title?.[langCode])?.length > 20
                ? (title?.[langCode])
                : undefined
            }
          >
            <span className="cursor-help">
              {title?.[langCode]?.length > 20
                ? (title?.[langCode])?.slice(0, 20) + "..."
                : (title?.[langCode])}
            </span>
          </Tooltip>
        </span>
      ),
    },
    {
      text: "Short Description",
      dataField: "short_description",
      formatter: (value) => (
        <span>
          <Tooltip
            title={
              (value?.[langCode])?.length > 30 ? (value?.[langCode]) : ""
            }
          >
            <span className="cursor-help">
              {value?.[langCode]?.length > 30
                ? (value?.[langCode])?.slice(0, 30) + "..."
                : (value?.[langCode])}
            </span>
          </Tooltip>
        </span>
      ),
    },
    {
      text: "Category",
      dataField: "category",
      formatter: (value) => (value?.name?.[langCode]),
    },
    {
      text: i18n.t("Status"),
      dataField: "is_active",
      formatter: (_, d) => {
        return (
          <Switch
            checked={d?.is_active}
            onChange={() => {
              const newStatus = !d?.is_active;
              useActionConfirm(
                blogUpdate,
                {
                  body: {
                    _id: d?._id,
                    is_active: newStatus,
                  },
                },
                getData
              );
            }}
            checkedChildren={
              <span className="text-white">{i18n.t("Active")}</span>
            }
            unCheckedChildren={
              <span className="text-white">{i18n.t("Inactive")}</span>
            }
          />
        );
      },
    },
    {
      text: i18n.t("Latest"),
      dataField: "is_latest",
      formatter: (_, d) => {
        return (
          <Switch
            checked={d?.is_latest}
            onChange={() => {
              const newStatus = !d?.is_latest;
              useActionConfirm(
                blogUpdate,
                {
                  body: {
                    _id: d?._id,
                    is_latest: newStatus,
                  },
                },
                getData
              );
            }}
            checkedChildren={
              <span className="text-white">{i18n.t("Latest")}</span>
            }
            unCheckedChildren={
              <span className="text-white">{i18n.t("Not Latest")}</span>
            }
          />
        );
      },
    },

    {
      text: "Created At",
      dataField: "createdAt",
      formatter: (_, d) => (
        <span>{dayjs(d?.createdAt).format("DD MMM YYYY")}</span>
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
        <div className=" rounded dashboardInput bg-white">
          <div className="flex justify-between px-8 pt-8 items-center">
            <h1 className="heading-3 text-[#05073C]">{i18n.t("Blogs List")}</h1>
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
                  router.push("/admin/blog-management/blogs/addBlog");
                }}
              >
                {"Add New"}
              </Button>
            }
            onEdit={(values) => {
              router.push(
                `/admin/blog-management/blogs/editBlog?_id=${values._id}`
              );
            }}
            onView={handleView}
            onDelete={blogDelete}
            indexed
            langCode={langCode}
            pagination
          />
          <Modal
            open={viewModalOpen}
            onCancel={() => {
              setViewModalOpen(false);
              setViewData(null);
            }}
            footer={null}
            destroyOnClose
            width={750}
            centered
          >
            {viewData && (
              <div className="p-6 space-y-6">
                <h2 className="text-2xl font-semibold text-center text-[#05073C]">
                  {i18n.t("Blog Details")}
                </h2>
                <div className="w-full mx-auto">
                  <h1 className="description-2 mb-4">{i18n.t("Banner Image")}:</h1>
                  {viewData?.banner_image && (
                    <div className="w-full aspect-[13/6] overflow-hidden rounded-lg">
                      <Image
                        src={viewData?.banner_image}
                        alt={viewData?.name}
                        preview={false}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>

                <div className="flex flex-col md:flex-row gap-6">
                  {/* Images */}
                  <div className="flex flex-col items-start w-full md:w-1/2 gap-4">
                    <h1 className="description-2 ">{i18n.t("Image")}:</h1>
                    {viewData?.card_image && (
                      <Image
                        src={viewData?.card_image}
                        width={300}
                        height={200}
                        alt={viewData?.name}
                        className="rounded shadow-md"
                      />
                    )}
                  </div>
                  <div className="w-full md:w-1/2 md:mt-8">
                    <table className="w-full text-left text-sm">
                      <tbody>
                        <tr className="border-b space-x-6">
                          <td className="py-2 font-semibold text-[#05073C]">
                            {i18n.t("Title")}
                          </td>
                          <td className="py-2 text-[#444]">
                            {viewData?.title?.[langCode] || "N/A"}
                          </td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2 font-semibold text-[#05073C]">
                           {i18n.t("Author")}
                          </td>
                          <td className="py-2 text-[#444]">
                            {viewData?.author?.name}
                          </td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2 font-semibold text-[#05073C]">
                            Category
                          </td>
                          <td className="py-2 text-[#444]">
                            {viewData?.category?.name?.[langCode]}
                          </td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2 font-semibold text-[#05073C]">
                            {i18n.t("Tags")}
                          </td>
                          <td className="py-2 text-[#444] flex flex-wrap gap-2">
                            {Array.isArray(viewData?.tags) &&
                              viewData.tags.length > 0
                              ? viewData.tags.map((tag, index) => (
                                <span
                                  key={index}
                                  className="bg-gray-300 text-primary/80 text-xs px-2 py-1 rounded-full"
                                >
                                  {tag?.name?.[langCode] || "all"}
                                </span>
                              ))
                              : "N/A"}
                          </td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2 font-semibold text-[#05073C]">
                            {i18n.t("Read Time")}
                          </td>
                          <td className="py-2 text-[#444]">
                            {viewData?.read_time} mins
                          </td>
                        </tr>
                        <tr>
                          <td className="py-2 font-semibold text-[#05073C] whitespace-pre mr-6">
                            {i18n.t("Created At")}
                          </td>
                          <td className="py-2 text-[#444]">
                            {dayjs(viewData?.createdAt).format("DD MMM YYYY")}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                {viewData?.short_description?.[langCode] && (
                  <div>
                    <h3 className="text-lg font-semibold text-[#05073C] mb-2">
                      {i18n.t("Short Description")}
                    </h3>
                    <p className="text-[#444]">
                      {viewData.short_description?.[langCode]}
                    </p>
                  </div>
                )}

                {viewData?.description?.[langCode] && (
                  <div>
                    <h3 className="text-lg font-semibold text-[#05073C] mb-2">
                      {i18n.t("Description")}
                    </h3>
                    <div
                      className="text-[#444] prose max-w-none"
                      dangerouslySetInnerHTML={{
                        __html: viewData.description?.[langCode],
                      }}
                    />
                  </div>
                )}
              </div>
            )}
          </Modal>
        </div>
      </div>
    </>
  );
};

export default Blogs;
