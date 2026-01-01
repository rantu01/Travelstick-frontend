/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import React, { useEffect, useState } from "react";
import { Form, Spin } from "antd";
import Button from "../button";
import FormSelect from "@/app/components/form/select";
import FormInput from "@/app/components/form/input";
import MultipleImageInput from "@/app/components/form/multiImage";
import { useAction } from "@/app/helper/hooks";
import { postSettings, singleImageUpload } from "@/app/helper/backend";
import { useI18n } from "@/app/contexts/i18n";
const PaypalPaymentMethod = ({ settings, getSettings }) => {
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState("");
  const [imgLoading, setImgLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const i18n = useI18n();

  useEffect(() => {
    if (settings?._id) {
      const data = settings?.paypal;
      setImageUrl(data?.logo);
      form.setFieldsValue({
        ...data,
        logo:
          data?.logo && data?.logo.length > 0
            ? [
                {
                  uid: "-1",
                  name: "paypal.png",
                  status: "done",
                  url: data?.logo,
                },
              ]
            : [],
      });
    }
  }, [settings?._id]);

  const onFinish = async (values) => {
    setSubmitLoading(true);

    let logoUrl = imageUrl;
    if (values?.logo?.[0]?.originFileObj) {
      setImgLoading(true);
      try {
        const { data } = await singleImageUpload({
          image: values.logo[0].originFileObj,
          image_name: "logo",
        });
        logoUrl = data?.image || "";
        setImageUrl(logoUrl);
      } catch (error) {
        console.error("Image upload failed:", error);
      } finally {
        setImgLoading(false);
      }
    }

    const payload = {
      paypal: {
        ...values,
        logo: logoUrl,
      },
    };
    return await useAction(
      postSettings,
      {
        body: {
          ...payload,
        },
      },
      () => {
        getSettings();
        setSubmitLoading(false);
      },
      setSubmitLoading
    );
  };

  return (
    <div className=" p-5">
      <Form form={form} onFinish={onFinish} layout="vertical">
        <MultipleImageInput name="logo" label={"Logo"} required />
        {imgLoading && <Spin fullscreen />}
        <FormInput
          initialValue="paypal"
          readOnly
          name={"name"}
          label="Name"
          placeholder="Name"
          className="w-full rounded bg-transparent p-3 dashinput"
          required
        />

        <FormInput
          name={["credentials", "paypal_client_id"]}
          label="Client ID"
          placeholder="Please Provide Client ID"
          required
          className="w-full rounded bg-transparent p-3 dashinput"
        />

        <FormInput
          name={["credentials", "paypal_secret_key"]}
          label="Secret Key"
          placeholder="Please Provide Secret Key"
          className="w-full rounded bg-transparent p-3 dashinput"
          required
        />
        <FormInput
          name={["credentials", "paypal_base_url"]}
          label="Paypal Base Url"
          placeholder="Please Provide Secret Key"
          className="w-full rounded bg-transparent p-3 dashinput"
          required
        />

        <FormSelect
          name={"is_active"}
          label={"Status"}
          placeholder="Select Payment Status"
          className="w-full rounded bg-transparent px-2 py-[23px] dashinput"
          options={[
            { label: i18n?.t("Enable"), value: true },
            { label: i18n?.t("Disable"), value: false },
          ]}
          required
        />

        <Button type="submit" loading={submitLoading} className={"mt-2 rounded-lg"}>
          {i18n?.t("Submit")}
        </Button>
      </Form>
    </div>
  );
};

export default PaypalPaymentMethod;
