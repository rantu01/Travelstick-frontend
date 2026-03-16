/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import React, { useEffect, useState } from "react";
import { Form, Modal, Switch, Input, InputNumber } from "antd";
import BackButton from "@/app/(dashboard)/components/common/backButton";
import Table, { TableImage } from "@/app/(dashboard)/components/common/table";
import { useI18n } from "@/app/contexts/i18n";
import { useAction, useActionConfirm, useFetch } from "@/app/helper/hooks";
import {
  createGiftCard,
  getGiftCardsByAdmin,
  updateGiftCard,
  deleteGiftCard,
  fetchAdminLanguages,
  singleImageUpload,
} from "@/app/helper/backend";
import Button from "@/app/(dashboard)/components/common/button";
import MultipleImageInput from "@/app/components/form/multiImage";

const GiftCardAdmin = () => {
  const i18n = useI18n();
  const [data, getData, { loading }] = useFetch(getGiftCardsByAdmin, {}, true);
  const [languages, getLanguages] = useFetch(fetchAdminLanguages, {}, false);
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    getData();
    getLanguages();
  }, []);

  const columns = [
    {
      text: "Title",
      dataField: "title",
      formatter: (val) => {
        if (!val) return "-";
        const code = (languages && languages[0] && languages[0].code) || "en";
        return typeof val === "string" ? val : val[code] || Object.values(val)[0] || "-";
      },
    },
    {
      text: "Image",
      dataField: "image",
      formatter: (value) => <TableImage url={value || "/man.png"} />,
    },
    {
      text: "Price",
      dataField: "price",
    },
    {
      text: "Service",
      dataField: "applicable_service",
    },
    {
      text: "Status",
      dataField: "status",
      formatter: (_, d) => (
        <Switch
          checkedChildren={"Active"}
          unCheckedChildren={"Inactive"}
          checked={d?.status}
          onChange={async (e) => {
            await useActionConfirm(
              updateGiftCard,
              { body: { _id: d._id, status: e } },
              getData,
              "Are you sure you want to change status?",
            );
          }}
        />
      ),
    },
    {
      text: "Created At",
      dataField: "createdAt",
      formatter: (_, d) => <span>{new Date(d?.createdAt).toLocaleDateString()}</span>,
    },
  ];

  const openCreate = () => {
    form.resetFields();
    setIsEdit(false);
    setOpen(true);
  };

  const openEdit = (values) => {
    form.resetFields();
    // populate multilingual fields
    const initial = {};
    if (values?.title) {
      Object.entries(values.title).forEach(([k, v]) => {
        initial[`title_${k}`] = v;
      });
    }
    if (values?.subtitle) {
      Object.entries(values.subtitle).forEach(([k, v]) => {
        initial[`subtitle_${k}`] = v;
      });
    }
    initial.price = values.price;
    initial.applicable_service = values.applicable_service;
    initial.status = values.status;
    initial._id = values._id;
    initial.image = values.image ? [ { uid: '-1', name: 'img', status: 'done', url: values.image } ] : [];
    form.setFieldsValue(initial);
    setIsEdit(true);
    setOpen(true);
  };

  const handleFinish = async (values) => {
    let imageUrl = "";
    if (values.image && values.image[0]) {
      if (values.image[0].originFileObj) {
        const { data } = await singleImageUpload({ image: values.image[0].originFileObj });
        imageUrl = data?.image || "";
      } else {
        imageUrl = values.image[0].url || "";
      }
    }

    const title = {};
    const subtitle = {};
    (languages || []).forEach((lang) => {
      title[lang.code] = values[`title_${lang.code}`] || "";
      subtitle[lang.code] = values[`subtitle_${lang.code}`] || "";
    });

    const payload = {
      title,
      subtitle,
      image: imageUrl,
      price: values.price,
      applicable_service: values.applicable_service,
      status: values.status,
    };

    if (isEdit && values._id) payload._id = values._id;

    await useAction(
      isEdit ? updateGiftCard : createGiftCard,
      { body: payload },
      () => {
        setOpen(false);
        getData();
      },
      true,
      isEdit ? "Gift card updated" : "Gift card created",
    );
  };

  return (
    <div className="w-full overflow-x-auto mt-7 px-6">
      <div className="rounded dashboardInput bg-white">
        <div className="flex justify-between px-8 pt-8 items-center">
          <h1 className="text-[#05073C] heading-3">{i18n.t("Gift Cards")}</h1>
          <BackButton />
        </div>
        <Table
          columns={columns}
          data={data}
          loading={loading}
          onReload={getData}
          pagination
          indexed
          action={
            <Button onClick={openCreate}>Add New</Button>
          }
          onEdit={openEdit}
          onDelete={deleteGiftCard}
        />
      </div>

      <Modal
        className=" xl:!w-[800px]"
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        title={<h2 className="text-[#05073C] heading-3">{isEdit ? "Edit Gift Card" : "Add Gift Card"}</h2>}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleFinish}>
          {isEdit && <Form.Item name="_id" hidden />}

          {(languages || []).map((lang) => (
            <div key={lang.code} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Form.Item
                label={`Title (${lang.code})`}
                name={`title_${lang.code}`}
                rules={[{ required: true, message: `Title ${lang.code} is required` }]}
              >
                <Input />
              </Form.Item>
              <Form.Item label={`Subtitle (${lang.code})`} name={`subtitle_${lang.code}`}>
                <Input />
              </Form.Item>
            </div>
          ))}

          <Form.Item label="Image" name="image">
            <MultipleImageInput limit={1} />
          </Form.Item>

          <Form.Item label="Price" name="price">
            <InputNumber className="w-full" />
          </Form.Item>

          <Form.Item label="Applicable Service" name="applicable_service">
            <Input />
          </Form.Item>

          <Form.Item label="Status" name="status" valuePropName="checked">
            <Switch checkedChildren={"Active"} unCheckedChildren={"Inactive"} />
          </Form.Item>

          <div className="flex justify-end space-x-2 mt-4">
            <Button onClick={() => setOpen(false)}>Close</Button>
            <Button type="submit">{isEdit ? "Update" : "Create"}</Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default GiftCardAdmin;
