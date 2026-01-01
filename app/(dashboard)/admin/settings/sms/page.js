/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import BackButton from "@/app/(dashboard)/components/common/backButton";
import Button from "@/app/(dashboard)/components/common/button";
import { Loader } from "@/app/(dashboard)/components/common/loader";
import FormInput from "@/app/components/form/input";
import FormSelect from "@/app/components/form/select";
import { useI18n } from "@/app/contexts/i18n";
import { fetchsSMSSettings, postsSMSSettings } from "@/app/helper/backend";
import { useAction, useFetch } from "@/app/helper/hooks";
import { Form } from "antd";
import React, { useEffect } from "react";

const SMSSettings = () => {
  const [form] = Form.useForm();
  const i18n = useI18n();
  const [settings, getSettings, loading] = useFetch(fetchsSMSSettings);
  useEffect(() => {
    if (settings?.phone_config) {
      form.setFieldsValue(settings.phone_config);
    }
  }, [settings, form]);

  return (
    <>
      <div className="w-full overflow-x-auto mt-7 dashboardModal">
      <div className=" rounded dashboardInput mx-8 bg-white">
      <div className="flex justify-between px-8 pt-8 items-center">
            <h1 className="text-[#05073C] heading-3">SMS Settings</h1>
            <BackButton />
          </div>
          <div className=" p-6 rounded  !text-[#C7D1DA] ">
            <Form
              layout="vertical"
              form={form}
              onFinish={async (values) => {
                const postData = {
                  body: {
                    phone_config: {
                      ...values,
                    },
                  },
                };
                return useAction(postsSMSSettings, postData, () => {
                  getSettings();
                });
              }}
            >
              <FormInput
                name={["twilio_auth_token"]}
                label={i18n?.t("Twilio Auth Token")}
                required
                placeholder={i18n?.t("Please Your Twilio Auth Token")}
                className="w-full rounded bg-transparent p-3 dashinput"
              />
              <FormInput
                name={["twilio_sender_number"]}
                label={i18n.t("Twilio Sender Number")}
                placeholder={i18n.t("Your Twilio Sender number")}
                className="w-full rounded bg-transparent p-3 dashinput"
                required
              />
              <FormInput
                name={["twilio_account_sid"]}
                label={i18n.t("Twilio Account SID")}
                placeholder={i18n.t("Your Twilio Account SID")}
                className="w-full rounded bg-transparent p-3 dashinput"
                required
              />
              <FormSelect
                name={["is_active"]}
                label={i18n.t("Status")}
                className="w-full rounded bg-transparent px-2 py-[23px] dashinput"
                placeholder={i18n.t("Select Status")}
                options={[
                  { label: i18n?.t("Enable"), value: true },
                  { label: i18n?.t("Disable"), value: false },
                ]}
                required
              />

              <div className="relative mt-2">
                <Button type="submit" className="mt-2.5 rounded-lg">
                  {i18n?.t("Submit")}
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
};

export default SMSSettings;
