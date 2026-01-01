/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import React, { useState, useEffect } from "react";
import { Form, Switch } from "antd";
import { useAction } from "@/app/helper/hooks";
import { postEmailSettings, updateEmailSettings } from "@/app/helper/backend";
import { Loader } from "./common/loader";
import FormInput, { HiddenInput } from "@/app/components/form/input";
import Button from "./common/button";
import { useI18n } from "@/app/contexts/i18n";
const GmailEmailProvider = ({
  settings,
  getSettings,
  loading,
  setCheckedValue,
}) => {
  const i18n = useI18n();
  const [form] = Form.useForm();
  const [defaultEmail, setDefaultEmail] = useState("gmail");
  const setting = settings?.email_config;
  useEffect(() => {
    form.setFieldsValue({
      gmail: {
        auth_email: setting?.gmail?.auth_email,
        password: setting?.gmail?.password,
        service_provider: setting?.gmail?.service_provider,
      },
    });

    if (setting?.default === "gmail") {
      setDefaultEmail("gmail");
      form.setFieldsValue({ default: "gmail" });
      setCheckedValue(true);
    } else {
      setDefaultEmail("");
      form.setFieldsValue({ default: "" });
      setCheckedValue(false);
    }
  }, [setting, form, setCheckedValue]);

  const onFinish = async (values) => {
    const postData = {
      body: {
        email_config: {
          sendgrid: {
            host: setting?.sendgrid?.host,
            port: parseInt(setting?.sendgrid?.port),
            username: setting?.sendgrid?.username,
            password: setting?.sendgrid?.password,
            sender_email: setting?.sendgrid?.sender_email,
          },
          brevo: {
            apiKey: setting?.brevo?.apiKey,
          },
          default: defaultEmail,
          gmail: {
            auth_email: values?.gmail?.auth_email,
            password: values?.gmail?.password,
            service_provider: values?.gmail?.service_provider,
          },
        },
      },
    };
    // @ts-ignore
    return useAction(postEmailSettings, { ...postData }, () => {
      getSettings();
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[300px]">
        <Loader />
      </div>
    );
  }

  return (
    <div className="pt-0">
      <Form
        form={form}
        onFinish={onFinish}
        autoComplete="off"
        layout="vertical"
      >
        <div className="p-3">
          <p className="text-[16px] mb-6 border-b-[1px] text-[#05073C] border-b-primary">
            {i18n?.t("Gmail SMTP")}
          </p>

          <HiddenInput name="_id" />

          <FormInput
            name={["gmail", "auth_email"]}
            label={i18n?.t("Email Username")}
            required
            placeholder={i18n?.t("Please input email username")}
            className="w-full rounded bg-transparent p-3 dashinput"
          />
          <FormInput
            name={["gmail", "password"]}
            label={i18n?.t("Email Password")}
            required
            placeholder={i18n?.t("Please input  email password")}
            className="w-full rounded bg-transparent p-3 dashinput"
          />

          <FormInput
            name={["gmail", "service_provider"]}
            label={i18n?.t("Service Provider")}
            required
            placeholder={i18n?.t("Please input service provider")}
            className="w-full rounded bg-transparent p-3 dashinput"
          />
          <Form.Item
            className="mt-1"
            name="default"
            label={i18n?.t("Set Default")}
          >
            <Switch
              checked={defaultEmail === "gmail"}
              onChange={(checked) =>
                setDefaultEmail(checked ? "gmail" : "sendgrid")
              }
              className={
                defaultEmail === "gmail" ? "bg-primary" : "bg-gray-500"
              }
              checkedChildren={
                <span className="text-white">{i18n?.t("On")}</span>
              }
              unCheckedChildren={
                <span className="text-white">{i18n?.t("Off")}</span>
              }
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

export default GmailEmailProvider;
