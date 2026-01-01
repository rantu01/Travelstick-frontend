"use client";
import Brevo from "@/app/(dashboard)/components/brevo";
import BackButton from "@/app/(dashboard)/components/common/backButton";
import { Loader } from "@/app/(dashboard)/components/common/loader";
import GmailEmailProvider from "@/app/(dashboard)/components/gmail";
import SendGridManageEmail from "@/app/(dashboard)/components/sendGridManageEmail";
import { useI18n } from "@/app/contexts/i18n";
import { fetchEmailSettings } from "@/app/helper/backend";
import { useFetch } from "@/app/helper/hooks";
import { Tabs, Form } from "antd";
import React, { useEffect, useState } from "react";

const EmailSettings = () => {
  const [form] = Form.useForm();
  const i18n = useI18n();
  const [settings, getSettings, { loading }] = useFetch(fetchEmailSettings);
  
  const [checkedValue, setCheckedValue] = useState(false);

  useEffect(() => {
    if (settings?._id) {
      form.resetFields();
    }
  }, [settings]);

  const tabItems = [
    {
      label: i18n?.t("SendGrid SMTP"),
      key: "1",
      children: (
        <SendGridManageEmail
          settings={settings}
          getSettings={getSettings}
          loading={loading}
          checkedValue={checkedValue}
          setCheckedValue={setCheckedValue}
        />
      ),
    },
    {
      label: i18n?.t("Gmail Provider"),
      key: "2",
      children: (
        <GmailEmailProvider
          settings={settings}
          getSettings={getSettings}
          loading={loading}
          checkedValue={checkedValue}
          setCheckedValue={setCheckedValue}
        />
      ),
    },
    {
      label: i18n?.t("brevo"),
      key: "3",
      children: (
        <Brevo
          settings={settings}
          getSettings={getSettings}
          loading={loading}
          checkedValue={checkedValue}
          setCheckedValue={setCheckedValue}
        />
      ),
    },
  ];

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="w-full overflow-x-auto mt-7 dashboardModal">
        <div className=" rounded dashboardInput mx-8 bg-white">
        <div className="flex justify-between px-8 pt-8 items-center">
              <h1 className="text-[#05073C] heading-3">{i18n.t("Email Settings")}</h1>
              <BackButton />
            </div>
            <div className="p-4 rounded emailTab !text-[#05073C] ">
              <Tabs defaultActiveKey="1" centered type="card" items={tabItems} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EmailSettings;
