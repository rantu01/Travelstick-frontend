/* eslint-disable react-hooks/rules-of-hooks */
'use client'
import React, { useState, useEffect } from "react";
import { Form, Switch } from "antd";
import { useAction } from "@/app/helper/hooks";
import { postEmailSettings } from "@/app/helper/backend";
import { Loader } from "./common/loader";
import FormInput, { HiddenInput } from "@/app/components/form/input";
import Button from "./common/button";
import { useI18n } from "@/app/contexts/i18n";

const Brevo = ({ settings, getSettings, loading, setCheckedValue }) => {
  const i18n = useI18n();
  const [form] = Form.useForm();

  // ✅ Set defaultEmail to "brevo" by default
  const [defaultEmail, setDefaultEmail] = useState("brevo");

  const config = settings?.email_config;

  /** 🔹 Initialize form with API values */
  useEffect(() => {
    form.setFieldsValue({
      brevo: { apiKey: config?.brevo?.apiKey || "" },
      gmail: config?.gmail || {},       // hidden, just pass data
      sendgrid: config?.sendgrid || {}, // hidden, just pass data
      default: config?.default || "brevo",
    });

    setDefaultEmail(config?.default || "brevo");
    setCheckedValue(config?.default === "brevo");
  }, [config, form, setCheckedValue]);

  /** 🔹 Handle form submission */
  const onFinish = async (values) => {
    const postData = {
      body: {
        email_config: {
          brevo: { apiKey: values?.brevo?.apiKey },
          gmail: config?.gmail || {},
          sendgrid: config?.sendgrid || {},
          default: defaultEmail,
        },
      },
    };

    // @ts-ignore
    return useAction(postEmailSettings, { ...postData }, () => {
      getSettings();
    });
  };

  /** 🔹 Loader while fetching data */
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[300px]">
        <Loader />
      </div>
    );
  }

  return (
    <div className="pt-0">
      <Form form={form} onFinish={onFinish} autoComplete="off" layout="vertical">
        <div className="p-3">
          <p className="text-[16px] mb-6 border-b-[1px] text-[#05073C] border-b-primary">
            {i18n?.t("Brevo SMTP Configuration")}
          </p>

          <HiddenInput name="_id" />

          {/* Brevo API Key */}
          <FormInput
            name={["brevo", "apiKey"]}
            label={i18n?.t("Brevo API Key")}
            required
            placeholder={i18n?.t("Please input Brevo API Key")}
            className="w-full rounded bg-transparent p-3 dashinput"
          />

          {/* Default Email Switch */}
          <Form.Item
            className="mt-4"
            name="default"
            label={i18n?.t("Set Default Email")}
          >
            <Switch
              checked={defaultEmail === "brevo"}
              onChange={(checked) =>
                setDefaultEmail(checked ? "brevo" : "gmail")
              }
              className={defaultEmail === "brevo" ? "bg-primary" : "bg-gray-500"}
              checkedChildren={<span className="text-white">{i18n?.t("On")}</span>}
              unCheckedChildren={<span className="text-white">{i18n?.t("Off")}</span>}
            />
          </Form.Item>

          <div className="relative mt-2">
            <Button type="submit" className="mt-2.5 rounded-lg">
              {i18n?.t("Submit")}
            </Button>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default Brevo;
