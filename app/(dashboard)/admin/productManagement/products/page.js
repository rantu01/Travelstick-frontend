/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import BackButton from "@/app/(dashboard)/components/common/backButton";
import Button from "@/app/(dashboard)/components/common/button";
import Table, { TableImage } from "@/app/(dashboard)/components/common/table";
import { useI18n } from "@/app/contexts/i18n";
import { useCurrency } from "@/app/contexts/site";
import {
  deleteProduct,
  getAllProducts,
  updateProduct,
} from "@/app/helper/backend";
import { useActionConfirm, useFetch } from "@/app/helper/hooks";
import { Image, Modal, Switch, Tooltip } from "antd";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Products = () => {
  const router = useRouter();
  let { langCode } = useI18n();
  const [data, getData, { loading }] = useFetch(getAllProducts);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewData, setViewData] = useState(null);
  const i18n = useI18n();
  const { currency_symbol } = useCurrency();

  const columns = [
    {
      text: "Image",
      dataField: "thumb_image",
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
          <Tooltip title={title?.length > 40 ? title : undefined}>
            <span className="cursor-help">
              {title?.length > 40 ? title?.slice(0, 40) + "..." : title}
            </span>
          </Tooltip>
        </span>
      ),
    },
    {
      text: "Quantity",
      dataField: "quantity",
      formatter: (value) => value,
    },
    {
      text: "Price",
      dataField: "price",
      formatter: (value) => (
        <p>
          {currency_symbol} {value?.amount}
        </p>
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
            checked={d?.status}
            onChange={() => {
              const newStatus = !d?.status;
              useActionConfirm(
                updateProduct,
                {
                  body: {
                    _id: d?._id,
                    status: newStatus,
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
      <div className="w-full overflow-x-auto mt-7">
        <div className="rounded dashboardInput mx-6 p-6 bg-white">
          <div className="flex justify-between mx-4 items-center pb-4">
            <h1 className="text-[#05073C] heading-3">
              {i18n.t("Product List")}
            </h1>
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
                  router.push("/admin/productManagement/products/addProduct");
                }}
              >
                {"Add New"}
              </Button>
            }
            onEdit={(values) => {
              router.push(
                `/admin/productManagement/products/editProduct?_id=${values._id}`
              );
            }}
            onView={handleView}
            onDelete={deleteProduct}
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
                  <h3 className="heading-3 text-center text-[#05073C]">
                    {i18n.t("Product Details of")} {viewData?.name}
                  </h3>
                  <div className="flex gap-5 items-center mt-6">
                    {viewData?.thumb_image && (
                      <Image
                        src={viewData?.thumb_image}
                        width={350}
                        height={290}
                        alt={viewData?.name}
                        className="rounded-md border border-[#D5D5D5]"
                      />
                    )}
                    <div className="mt-4 lg:mt-6 relative w-full overflow-hidden flex items-start flex-wrap gap-4 lg:gap-4 justify-start">
                      {viewData?.images?.map((item, index) => (
                        <div key={index}>
                          <Image
                            className="w-full h-[100px] object-fill rounded-[10px] lg:rounded-[12px] border border-[#D5D5D5]"
                            src={item}
                            width={130}
                            height={130}
                            alt="images"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  <table className="w-full mt-6 text-left">
                    <tbody>
                      {[
                        { label: "Name", value: viewData?.name },
                        {
                          label: "Description",
                          value: viewData?.description?.[langCode],
                        },
                        {
                          label: "Category",
                          value: viewData?.category?.name?.[langCode],
                        },
                        { label: "Quantity", value: viewData?.quantity },
                        {
                          label: "Price",
                          value: `${currency_symbol} ${viewData?.price?.amount}`,
                        },
                        {
                          label: "Discount Type",
                          value: viewData?.price?.discount_type,
                        },
                        {
                          label: "Discount",
                          value:
                            viewData?.price?.discount_type === "flat"
                              ? `${currency_symbol} ${viewData?.price?.discount}`
                              : `${viewData?.price?.discount} %`,
                        },
                        {
                          label: "Create At",
                          value: dayjs(viewData?.createdAt).format(
                            "DD MMM YYYY"
                          ),
                        },
                      ]
                        .flat()
                        .filter(Boolean)
                        .map((item, index) => (
                          <tr
                            key={index}
                            className={
                              index < 20 ? "border border-gray-200" : ""
                            }
                          >
                            <td className="py-2 px-4 font-semibold text-[#05073C] description-2 whitespace-pre">
                              {i18n.t(item.label)}
                            </td>
                            {i18n.t(item.label) == "Description" ? (
                              <td
                                dangerouslySetInnerHTML={{ __html: item.value }}
                                className="py-2 px-4 text-[#717171] description-1"
                              />
                            ) : (
                              <td className="py-2 px-4 text-[#717171] description-1">
                                {item.value || "N/A"}
                              </td>
                            )}
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

export default Products;
