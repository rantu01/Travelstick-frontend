/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import React, { useEffect, useState } from "react";
import { Form, Spin } from "antd";
import { useI18n } from "@/app/contexts/i18n";
import { useAction } from "@/app/helper/hooks";
import FormInput from "@/app/components/form/input";
import MultipleImageInput from "@/app/components/form/multiImage";
import FormSelect from "@/app/components/form/select";
import Button from "../button";
import { postSettings, singleImageUpload } from "@/app/helper/backend";

const StripePaymentMethod = ({ settings, getSettings }) => {
  const i18n = useI18n();
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState(" ");
  const [imgLoading, setImgLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    if (settings?._id) {
      const data = settings?.stripe;

      setImageUrl(data?.logo); // Store logo URL in state

      form.setFieldsValue({
        ...data,
        logo: data?.logo
          ? [
              {
                uid: "-1",
                name: "logo.svg",
                status: "done",
                url: data?.logo, // Ensure the URL is properly set
              },
            ]
          : [],
      });

    }
  }, [settings?._id, form]);

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
      stripe: {
        credentials: {
          stripe_publishable_key: values.credentials?.stripe_publishable_key,
          stripe_secret_key: values.credentials?.stripe_secret_key,
          stripe_webhook_secret: values.credentials?.stripe_webhook_secret,
        },
        is_active: values.is_active,
        name: values.name,
        logo: logoUrl,
      },
    };

    await useAction(
      postSettings,
      { body: payload },
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
          initialValue="Stripe"
          readOnly
          name={"name"}
          label="Name"
          placeholder="Name"
          className="w-full rounded bg-transparent p-3 dashinput"
          required
        />
        <FormInput
          name={["credentials", "stripe_publishable_key"]}
          label="Publishable key"
          placeholder="Please Provide Publishable key"
          className="w-full rounded bg-transparent p-3 dashinput"
          required
        />
        <FormInput
          name={["credentials", "stripe_secret_key"]}
          label="Secret Key"
          placeholder="Please Provide Secret Key"
          className="w-full rounded bg-transparent p-3 dashinput"
          required
        />
        <FormInput
          name={["credentials", "stripe_webhook_secret"]}
          label="Stripe Webhook Secret"
          placeholder="Please Stripe Webhook Secret"
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
          Submit
        </Button>
      </Form>
    </div>
  );
};

export default StripePaymentMethod;
