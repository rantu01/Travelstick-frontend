/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import React, { useEffect, useState } from "react";
import { Form, Switch } from "antd";
import { useI18n } from "@/app/contexts/i18n";
import { postEmailSettings } from "@/app/helper/backend";
import { Loader } from "./common/loader";
import FormInput, { HiddenInput } from "@/app/components/form/input";
import Button from "./common/button";
import { useAction } from "@/app/helper/hooks";
const SendGridManageEmail = ({
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
    form.resetFields();
    form.setFieldsValue({
      ...setting,
      sendgrid: {
        host: setting?.sendgrid?.host,
        port: setting?.sendgrid?.port,
        username: setting?.sendgrid?.username,
        password: setting?.sendgrid?.password,
        sender_email: setting?.sendgrid?.sender_email,
      },
    });

    if (setting?.default === "sendgrid") {
      setDefaultEmail("sendgrid");
      form.setFieldsValue({ default: "sendgrid" });
      setCheckedValue(true);
    } else {
      setDefaultEmail("gmail");
      form.setFieldsValue({ default: "gmail" });
      setCheckedValue(false);
    }
  }, [setting, form, setCheckedValue]);

  const onFinish = async (values) => {
    const postData = {
      body: {
        email_config: {
          default: defaultEmail,
          sendgrid: {
            host: values?.sendgrid?.host || "",
            port: parseInt(values?.sendgrid?.port) || 0,
            username: values?.sendgrid?.username || "",
            password: values?.sendgrid?.password || "",
            sender_email: values?.sendgrid?.sender_email || "",
          },
          gmail: {
            auth_email: setting?.gmail?.auth_email || "",
            password: setting?.gmail?.password || "",
            service_provider: setting?.gmail?.service_provider || "",
          },
          brevo: {
            apiKey: setting?.brevo?.apiKey,
          },
        },
      },
    };

    try {
      await useAction(postEmailSettings, postData, () => {
        getSettings();
      });
    } catch (error) {
      console.error("Error while submitting form:", error);
    }
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
            {i18n?.t("SendGrid SMTP")}
          </p>
          <HiddenInput name="_id" />
          <FormInput
            name={["sendgrid", "host"]}
            label={i18n?.t("Email Host")}
            required
            placeholder={i18n?.t("Please input email host!")}
            className="w-full rounded bg-transparent p-3 dashinput"
          />

          <FormInput
            name={["sendgrid", "port"]}
            label={i18n?.t("Email Port")}
            required
            placeholder={i18n?.t("Please input email port!")}
            className="w-full rounded bg-transparent p-3 dashinput"
          />

          <FormInput
            name={["sendgrid", "username"]}
            label={i18n?.t("Email Username")}
            required
            placeholder={i18n?.t("Please input email username!")}
            className="w-full rounded bg-transparent p-3 dashinput"
          />

          <FormInput
            name={["sendgrid", "password"]}
            label={i18n?.t("Email Password")}
            required
            placeholder={i18n?.t("Please input email password")}
            className="w-full rounded bg-transparent p-3 dashinput"
          />

          <FormInput
            name={["sendgrid", "sender_email"]}
            label={i18n?.t("Sender Email")}
            required
            placeholder={i18n?.t("Please input sender email")}
            className="w-full rounded bg-transparent p-3 dashinput"
          />
          <Form.Item name="default" label={i18n?.t("Set Default")}>
            <Switch
              checked={defaultEmail === "sendgrid"}
              onChange={(checked) => {
                setDefaultEmail(checked ? "sendgrid" : "gmail");
              }}
              className={
                defaultEmail === "sendgrid"
                  ? "bg-primary mt-1"
                  : "bg-gray-500 mt-1"
              }
              checkedChildren={
                <span className="text-white">{i18n?.t("On")}</span>
              }
              unCheckedChildren={
                <span className="text-white">{i18n?.t("Off")}</span>
              }
            />
          </Form.Item>
          <div className="relative">
            <Button type="submit" className="mt-2.5 rounded-lg">
              {i18n?.t("Submit")}
            </Button>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default SendGridManageEmail;
