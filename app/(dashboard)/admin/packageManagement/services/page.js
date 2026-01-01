/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import BackButton from "@/app/(dashboard)/components/common/backButton";
import Button from "@/app/(dashboard)/components/common/button";
import Table from "@/app/(dashboard)/components/common/table";
import FormInput, { HiddenInput } from "@/app/components/form/input";
import { useI18n } from "@/app/contexts/i18n";
import { useCurrency } from "@/app/contexts/site";
import {
  getAllPackageServices,
  updatePackageServices,
} from "@/app/helper/backend";
import { useAction, useActionConfirm, useFetch } from "@/app/helper/hooks";
import { noSelected } from "@/app/helper/utils";
import { Form, Modal, Switch } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

const PackageServices = () => {
  const [form] = Form.useForm();
  let { languages, langCode } = useI18n();
  const [open, setOpen] = useState(false);
  const [data, getData, { loading }] = useFetch(getAllPackageServices);
  const [selectedLang, setSelectedLang] = useState(undefined);
  const { currency_symbol } = useCurrency();
  const i18n = useI18n();
  useEffect(() => {
    setSelectedLang(langCode);
    getData();
  }, [langCode]);

  const columns = [
    {
      text: "Name",
      dataField: "title",
      formatter: (value) => (value?.[langCode]),
    },
    {
      text: "Price",
      dataField: "price",
      formatter: (value) => (
        <span>{currency_symbol} {value}</span>
      ),
    },
    {
      text: "Created At",
      dataField: "createdAt",
      formatter: (_, d) => (
        <span>{dayjs(d?.createdAt).format("DD MMM, YYYY")}</span>
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
                updatePackageServices,
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
            <h1 className="text-[#05073C] heading-3">{i18n.t("Package Services")}</h1>
            <BackButton />
          </div>
          <Table
            columns={columns}
            data={data}
            loading={loading}
            onReload={getData}
            // action={
            //   <Button
            //     onClick={() => {
            //       form.resetFields();
            //       setOpen(true);
            //       setIsEdit(false);
            //     }}
            //   >
            //     {"Add New"}
            //   </Button>
            // }
            onEdit={(values) => {
              form.resetFields();
              form.setFieldsValue({
                ...values,
              });
              setOpen(true);
              setIsEdit(true);
            }}
            indexed
            langCode={langCode}
          // pagination
          />

          <Modal
            className=" xl:!w-[700px]"
            open={open}
            onCancel={() => setOpen(false)}
            title={
              <h2 className="text-[#05073C] heading-4">
                {i18n.t("Edit Package Service")}
              </h2>
            }
            footer={null}
            destroyOnClose={true}
          >
            <div className="flex justify-start flex-wrap gap-3 mt-4">
              {languages?.map((l, index) => (
                <button
                  onClick={() => setSelectedLang(l.code)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${l.code === selectedLang
                    ? "bg-primary text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  key={index}
                >
                  {l.name}
                </button>
              ))}
            </div>
            <Form
              form={form}
              layout="vertical"
              onFinish={(values) => {
                const multiLangFields = ["name"];
                const formattedData = multiLangFields.reduce((acc, field) => {
                  acc[field] = {};
                  languages?.forEach((lang) => {
                    if (values[field] && values[field][lang.code]) {
                      acc[field][lang.code] = values[field][lang.code];
                    }
                  });
                  return acc;
                }, {});
                return useAction(
                  updatePackageServices,
                  {
                    body: {
                      // ...formattedData,
                      ...values,
                      _id: values?._id,
                    },
                  },
                  () => {
                    setOpen(false);
                    getData();
                  }
                );
              }}
              className="mt-2"
            >
              {<HiddenInput name="_id" />}

              {languages?.map((l, index) => (
                <div
                  key={index}
                  style={{
                    display: l.code === selectedLang ? "block" : "none",
                  }}
                >
                  <div className="mt-3">
                    <FormInput
                      name={["title", l.code]}
                      label={i18n?.t("Service Title")}
                      key={index}
                      required
                      placeholder={i18n?.t("Service Title")}
                      className="w-full rounded bg-transparent p-3 dashinput"
                    />
                  </div>
                </div>
              ))}
              <FormInput
                name="price"
                label={i18n?.t("Service Price")}
                required
                type={"number"}
                getValueFromEvent={(e) => +e.target.value}
                placeholder={i18n?.t("Service Price")}
                className="w-full rounded bg-transparent p-3 dashinput"
              />
              <Button
                type="submit"
                onClick={() => noSelected({ form, setSelectedLang })}
                className="mt-2.5"
              >
                {"Submit"}
              </Button>
            </Form>
          </Modal>
        </div>
      </div>
    </>
  );
};

export default PackageServices;
