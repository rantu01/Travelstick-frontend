/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import BackButton from "@/app/(dashboard)/components/common/backButton";
import Button from "@/app/(dashboard)/components/common/button";
import Table, { TableImage } from "@/app/(dashboard)/components/common/table";
import FormInput, { HiddenInput } from "@/app/components/form/input";
import MultipleImageInput from "@/app/components/form/multiImage";
import FormSelect from "@/app/components/form/select";
import { useI18n } from "@/app/contexts/i18n";
import {
  createOffers,
  deleteOffers,
  getAllOffers,
  getAllPackages,
  singleImageUpload,
  updateOffers,
} from "@/app/helper/backend";
import { useAction, useActionConfirm, useFetch } from "@/app/helper/hooks";
import { noSelected } from "@/app/helper/utils";
import { Form, Modal, Switch, Tooltip } from "antd";
import dayjs from "dayjs";
import Image from "next/image";
import { use, useEffect, useState } from "react";

const Offer = () => {
  const [form] = Form.useForm();
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewData, setViewData] = useState(null);
  let { languages, langCode } = useI18n();
  const [open, setOpen] = useState(false);
  const [data, getData, { loading }] = useFetch(getAllOffers);

  const [isEdit, setIsEdit] = useState(false);
  const [selectedLang, setSelectedLang] = useState(undefined);
  const [editData, setEditData] = useState(null);

  const [discountType, setDiscountType] = useState();

  useEffect(() => {
    setDiscountType(editData?.discount_type);
  }, [editData?.discount_type]);

  const [packages, getPackages] = useFetch(
    getAllPackages,
    { limit: 100 },
    false
  );

  const filteredDiscountOptions =
    packages?.docs
      ?.filter((item) => item?.price?.discount_type === discountType)
      ?.map((item) => ({
        label: item?.price?.discount,
        value: item?.price?.discount,
      })) || [];

  const i18n = useI18n();
  useEffect(() => {
    setSelectedLang(langCode);
  }, [langCode]);

  useEffect(() => {
    getPackages();
  }, []);
  const handleView = (value) => {
    setViewModalOpen(true);
    setViewData(value);
  };

  const columns = [
    {
      text: "Image",
      dataField: "image",
      formatter: (value) => (
        <div>
          <TableImage url={value || "/man.png"} />
        </div>
      ),
    },
    {
      text: "Title",
      dataField: "title",
      formatter: (value) => (
        <span>
          <Tooltip title={value?.[langCode]?.length > 50 ? value?.[langCode] : ""}>
            <span className="cursor-help">
              {value?.[langCode]?.length > 50
                ? value?.[langCode]?.slice(0, 50) + "..."
                : value?.[langCode]}
            </span>
          </Tooltip>
        </span>
      ),
    },
    {
      text: "Offer Type",
      dataField: "offer_type",
      formatter: (value) => <p className="capitalize">{value}</p>,
    },
    {
      text: "Discount",
      dataField: "discount",
      formatter: (value) => <p className="capitalize">{value}</p>,
    },
    {
      text: "Discount Type",
      dataField: "discount_type",
      formatter: (value) => <p className="capitalize">{value}</p>,
    },
    {
      text: "Created At",
      dataField: "createdAt",
      formatter: (_, d) => (
        <span>{dayjs(d?.createdAt).format("DD MMM, YYYY")}</span>
      ),
    },
    {
      text: "Expires At",
      dataField: "expireAt",
      formatter: (_, d) => (
        <span>{dayjs(d?.expireAt).format("DD MMM, YYYY")}</span>
      ),
    },
    {
      text: i18n.t("Status"),
      dataField: "status",
      formatter: (_, d) => {
        return (
          <Switch
            checked={d?.status}
            onChange={() => {
              const newStatus = !d?.status;
              useActionConfirm(
                updateOffers,
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
  ];
  return (
    <>
      <div className="w-full overflow-x-auto mt-7 px-6">
        <div className="rounded dashboardInput bg-white">
          <div className="flex justify-between px-8 pt-8 items-center">
            <h1 className="text-[#05073C] heading-3">
              {" "}
              {i18n.t("Offer List")}{" "}
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
                  form.resetFields();
                  setOpen(true);
                  setIsEdit(false);
                }}
              >
                {"Add New"}
              </Button>
            }
            onEdit={(values) => {
              form.resetFields();
              setEditData(values);
              form.setFieldsValue({
                ...values,
                image: values?.image
                  ? [
                      {
                        uid: "-1",
                        name: "image.png",
                        status: "done",
                        url: values?.image,
                      },
                    ]
                  : [],
              });
              setOpen(true);
              setIsEdit(true);
            }}
            onView={handleView}
            onDelete={deleteOffers}
            indexed
            langCode={langCode}
            // pagination
          />

          {/* update and add modal */}
          <Modal
            className="xl:!w-[700px]"
            open={open}
            onCancel={() => setOpen(false)}
            title={
              <h2 className="text-[#05073C] heading-4">
                {i18n.t(isEdit ? "Edit Offer" : "Add Offer")}
              </h2>
            }
            footer={null}
            destroyOnClose
          >
            <div className="flex justify-start flex-wrap gap-3 mt-4">
              {languages?.map((l) => (
                <button
                  key={l.code}
                  onClick={() => setSelectedLang(l.code)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${
                    l.code === selectedLang
                      ? "bg-primary text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {l.name}
                </button>
              ))}
            </div>
            <Form
              form={form}
              layout="vertical"
              onFinish={async (values) => {
                let image;
                if (!values?.image?.[0]?.url) {
                  const { message, data } = await singleImageUpload({
                    image: values?.image?.[0]?.originFileObj,
                  });
                  if (data) {
                    image = data.image;
                  } else {
                    console.error("Image upload failed:", message);
                  }
                } else {
                  image = values?.image?.[0]?.url;
                }
                const requestData = {
                  ...values,
                  _id: isEdit ? values._id : undefined,
                  image: image,
                };
                await useAction(
                  isEdit ? updateOffers : createOffers,
                  { body: requestData },
                  () => {
                    setOpen(false);
                    getData();
                  }
                );
              }}
              className="mt-2"
            >
              {isEdit && <HiddenInput name="_id" />}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
                <MultipleImageInput label="Image" name="image" required />
              </div>
              {languages?.map((l) => (
                <div
                  key={l.code}
                  style={{
                    display: l.code === selectedLang ? "block" : "none",
                  }}
                >
                  <FormInput
                    label="Offer Title"
                    name={["title", l.code]}
                    required
                    type="text"
                    className="w-full rounded bg-transparent p-3 dashinput"
                    placeholder={i18n.t("Offer Name")}
                  />
                  <FormInput
                    label="Offer Description"
                    name={["description", l.code]}
                    required
                    type="text"
                    className="w-full rounded bg-transparent p-3 dashinput"
                    placeholder={i18n.t("Offer Title")}
                  />
                </div>
              ))}
              <FormSelect
                label="Offer Type"
                name="offer_type"
                required
                className="w-full rounded bg-transparent !py-5 dashinput"
                options={[
                  { label: "Weekly", value: "weakly" },
                  { label: "Monthly", value: "monthly" },
                  { label: "Yearly", value: "yearly" },
                ]}
              />
              {/* <FormSelect
                label="Discount Type"
                name="discount_type"
                className="w-full rounded bg-transparent py-5 dashinput"
                required
                options={[
                  { label: "Percentage", value: "percent" },
                  { label: "Flat", value: "flat" },
                ]}
              /> */}
              {/* <FormInput
                label="Discount"
                name="discount"
                required
                type='number'
                getValueFromEvent={(e) => +e.target.value}
                className="w-full rounded bg-transparent p-3 dashinput"
                placeholder={i18n.t("Offer Discount")}
              /> */}

              <FormSelect
                label="Discount Type"
                name="discount_type"
                className="w-full rounded bg-transparent py-5 dashinput"
                required
                value={discountType}
                onChange={(value) => setDiscountType(value)}
                options={[
                  { label: "Percentage", value: "percent" },
                  { label: "Flat", value: "flat" },
                ]}
              />

              {/* Select Discount (Filtered) */}
              <FormSelect
                label={i18n.t("Discount")}
                name="discount"
                placeholder={i18n.t("Select Discount")}
                required
                className="!w-full rounded bg-transparent py-6 px-2 dashinput"
                options={filteredDiscountOptions}
              />

              <Button
                type="submit"
                onClick={() => noSelected({ form, setSelectedLang })}
                className="mt-2.5"
              >
                {i18n.t(isEdit ? "Update Offer" : "Submit")}
              </Button>
            </Form>
          </Modal>

          {/* view Modal */}
          <Modal
            open={viewModalOpen}
            onCancel={() => {
              setViewModalOpen(false), setViewData(null);
            }}
            footer={null}
            destroyOnClose
            width={500}
            centered
          >
            {viewData && (
              <div className="modal-wrapper">
                <div className="mt-3">
                  <h3 className="heading-4  text-[#05073C] mb-4">
                    {i18n.t("Offer Details")}
                  </h3>
                  <div className="relative w-full overflow-hidden flex items-center justify-center">
                    <Image
                      className="lg:mt-4 mt-3 w-full md:w-[424px] h-[200px] lg:h-[245px] object-cover rounded-[10px] lg:rounded-[12px]"
                      src={viewData?.image}
                      width={424}
                      height={380}
                      alt="images"
                    />
                  </div>
                  <table className="w-full text-left xl:mt-10 md:mt-6 mt-4">
                    <tbody>
                      {[
                        {
                          label: i18n.t("Title"),
                          value: viewData?.title?.[langCode],
                        },
                        {
                          label: i18n.t("Description"),
                          value: viewData?.description?.[langCode],
                        },
                        {
                          label: i18n.t("Offer Type"),
                          value: viewData?.offer_type,
                        },
                        {
                          label: i18n.t("Discount Type"),
                          value: viewData?.discount_type,
                        },
                        {
                          label: i18n.t("Discount"),
                          value: viewData?.discount,
                        },
                        {
                          label: i18n.t("Expire At"),
                          value: dayjs(viewData?.expireAt).format(
                            "DD MMM YYYY"
                          ),
                        },
                        {
                          label: i18n.t("Created At"),
                          value: dayjs(viewData?.createdAt).format(
                            "DD MMM YYYY"
                          ),
                        },
                      ].map((item, index) => (
                        <tr key={index} className={index < 20 ? "border " : ""}>
                          <td className="py-2 px-4 description-2 text-[#05073C]  whitespace-pre">
                            {i18n.t(item.label)}
                          </td>
                          <td className="py-2 px-4 text-[#717171] description-1 capitalize">
                            {item.value || "N/A"}
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

export default Offer;
