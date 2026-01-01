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
  DeleteAdvertisement,
  GetAdvertisement,
  PostAdvertisement,
  singleImageUpload,
  UpdateAdvertisement,
} from "@/app/helper/backend";
import { useAction, useFetch } from "@/app/helper/hooks";
import { columnFormatter, noSelected } from "@/app/helper/utils";
import { Form, Modal, Tooltip } from "antd";

import dayjs from "dayjs";
import { useEffect, useState } from "react";

const Advertisement = () => {
  const [form] = Form.useForm();
  let { languages, langCode } = useI18n();
  const [open, setOpen] = useState(false);
  const [data, getData, { loading }] = useFetch(GetAdvertisement);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedLang, setSelectedLang] = useState(undefined);
  const [editData, setEditData] = useState(null);
  const i18n = useI18n();
  useEffect(() => {
    setSelectedLang(langCode);
  }, [langCode]);

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
      text: "Title",
      dataField: "title",
      formatter: (title) => (
        <Tooltip
          title={
            columnFormatter(title?.length) > 40
              ? columnFormatter(title)
              : undefined
          }
        >
          <span className="cursor-help">
            {columnFormatter(title?.length) > 40
              ? `${columnFormatter(title?.slice(0, 40))}...`
              : columnFormatter(title)}
          </span>
        </Tooltip>
      ),
    },
    {
      text: "Clicks",
      dataField: "click",
    },
    {
      text: "Impressions",
      dataField: "impression",
    },
    {
      text: "Status",
      dataField: "status",
      formatter: (status) => <p className="capitalize">{status}</p>,
    },

    {
      text: "Created At",
      dataField: "createdAt",
      formatter: (_, d) => (
        <span>{dayjs(d?.createdAt).format("DD MMM, YYYY")}</span>
      ),
    },
  ];
  return (
    <>
      <div className="w-full overflow-x-auto mt-7 px-6">
        <div className=" rounded dashboardInput bg-white">
          <div className="flex justify-between px-8 pt-8 items-center">
            <h1 className="heading-3 text-[#05073C]">
              {i18n.t("Advertisement List")}
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
            onDelete={DeleteAdvertisement}
            indexed
            langCode={langCode}
            pagination
          />

          <Modal
            className=" xl:!w-[700px]"
            open={open}
            onCancel={() => setOpen(false)}
            title={
              <h2 className="text-[#05073C] heading-3 text-center">
                {i18n.t(isEdit ? "Edit Advertisement" : "Add Advertisement")}
              </h2>
            }
            footer={null}
            destroyOnHidden
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

                const multiLangFields = ["title"];
                const formattedData = multiLangFields.reduce((acc, field) => {
                  acc[field] = {};
                  languages?.forEach((lang) => {
                    acc[field][lang.code] = values[field]?.[lang.code] || "";
                  });
                  return acc;
                }, {});
                const requestData = {
                  ...formattedData,
                  _id: isEdit ? values._id : undefined,
                  status: values.status,
                  type: values.type,
                  redirect_url: values.redirect_url,
                  image: image,
                };
                await useAction(
                  isEdit ? UpdateAdvertisement : PostAdvertisement,
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
                    label="Title"
                    name={["title", l.code]}
                    required
                    initialValue={editData?.title?.[l.code] || ""}
                    className="w-full rounded bg-transparent p-3 dashinput"
                    placeholder={i18n.t("Title")}
                  />
                </div>
              ))}
              <FormSelect
                label="Status"
                name="status"
                className={"w-full rounded bg-transparent py-6 px-1 dashinput"}
                placeholder={"Select Status"}
                options={[
                  { value: "public", label: "Public" },
                  { value: "private", label: "Private" },
                ]}
                required
              />
              <FormSelect
                label="Type"
                name="type"
                className={"w-full rounded bg-transparent py-6 px-1 dashinput"}
                placeholder={"Select type"}
                options={[{ value: "image", label: "Image" }]}
                required
              />
              <FormInput
                label="Redirect Url"
                name="redirect_url"
                required
                type="url"
                className="w-full rounded bg-transparent p-3 dashinput"
                placeholder={i18n.t("Redirect url")}
              />
              <Button
                type="submit"
                onClick={() => noSelected({ form, setSelectedLang })}
                className="mt-2.5"
              >
                {i18n.t(isEdit ? "Update Advertisement" : "Submit")}
              </Button>
            </Form>
          </Modal>
        </div>
      </div>
    </>
  );
};

export default Advertisement;
