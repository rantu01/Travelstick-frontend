"use client";

import { Form } from "antd";
import { useEffect, useState } from "react";
import { useI18n } from "@/app/contexts/i18n";
import FormInput from "../form/input";
import FormSelect from "../form/select";
import { useAction, useFetch } from "@/app/helper/hooks";
import {
  createVisaQuery,
  getAllPublicVisaType,
  singlePDFUpload,
} from "@/app/helper/backend";
import Button from "@/app/(dashboard)/components/common/button";
import UploadFileInput from "../form/UploadFileInput";
import { useUser } from "@/app/contexts/user";
import AuthModal from "../site/common/component/authModal";
import { useRouter } from "next/navigation";

const VisaForm = ({ id }) => {
  const router = useRouter();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const i18n = useI18n();
  const { user } = useUser();
  const { langCode } = useI18n();
  const [form] = Form.useForm();
  const [submitLoading, setSubmitLoading] = useState(false);
  const [data] = useFetch(getAllPublicVisaType, { limit: 100 });

  const onFinish = async (values) => {
    if (user) {
      setSubmitLoading(true);
      try {
        let file = "";
        if (values?.file?.[0]?.originFileObj) {
          const { data } = await singlePDFUpload({
            pdf: values.file[0].originFileObj,
            file_name: "file",
          });
          file = data || "";
        } else {
          file = values?.file?.[0]?.url || "";
        }

        const payload = {
          full_name: values.name,
          email: values.email,
          phone: values.phone,
          visa_type: values.visa_type,
          message: values.message,
          file: file,
        };

        await useAction(createVisaQuery, { body: payload });
        form.resetFields();
        router.push("/user/visaInquery");
      } catch (error) {
        console.error("Submission Error:", error);
      } finally {
        setSubmitLoading(false);
      }
    } else {
      setAuthModalOpen(true);
    }
  };

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        name: user?.name || "",
        email: user?.email || "",
        phone: user?.phone || "",
      });
    }
  }, [user, form]);

  return (
    <div className="w-full relative">
      <Form form={form} layout="vertical" className="w-full" onFinish={onFinish}>
        <div className="shadow-lg rounded-[20px] overflow-hidden border bg-white w-full">
          {/* Header - Padding Reduced */}
          <div className="bg-[#FEF5EE] border-b px-5 py-4 lg:px-6 lg:py-5">
            <h3 className="text-xl font-bold text-[#05073C]">{i18n.t("Inquiry Form")}</h3>
          </div>

          <div className="p-4 lg:p-6">
            {/* Input Grid - 2 Columns to save height */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
              <FormInput
                name="name"
                label={i18n.t("Full Name")}
                placeholder="Full name"
                required
                className="w-full p-3 border rounded-xl focus:outline-primary mb-0"
              />
              <FormInput
                name="email"
                label={i18n.t("Email Address")}
                placeholder={i18n.t("Email Address")}
                required
                className="w-full p-3 border rounded-xl focus:outline-primary mb-0"
              />
              <FormInput
                name="phone"
                label={i18n.t("Phone Number")}
                placeholder={i18n.t("Phone Number")}
                required
                className="w-full p-3 border rounded-xl focus:outline-primary mb-0"
              />
              <FormSelect
                name="visa_type"
                required
                options={data?.docs?.map((visa) => ({
                  label: visa?.name?.[langCode],
                  value: visa?._id,
                }))}
                className="w-full border rounded-xl h-[50px]"
                placeholder="Select Visa Type"
                label={i18n.t("Visa Type")}
              />
            </div>

            <FormInput
              name="message"
              textArea
              rows={3} // Reduced rows from 4 to 3
              label={i18n.t("Your Message")}
              placeholder={i18n.t("Your Message")}
              required
              className="w-full p-3 border rounded-xl focus:outline-primary mb-0"
            />

            {/* Document Upload - Compact Design */}
            <div className="mt-3">
              <UploadFileInput
                className="!h-[50px] !pt-2"
                max={1}
                accept=".pdf"
                name="file"
                label={i18n.t("Visa Document")}
                required={true}
                rules={[
                  {
                    required: true,
                    message: i18n.t("Please upload visa document"),
                  },
                ]}
              />
            </div>

            <div className="mt-6">
              <Button type="submit" className="w-full h-[50px] !rounded-xl text-base font-semibold" loading={submitLoading}>
                {i18n.t("Submit Now")}
              </Button>
            </div>
          </div>
        </div>
      </Form>
      <AuthModal
        authModalOpen={authModalOpen}
        setAuthModalOpen={setAuthModalOpen}
        slug={`/visa/${id}`}
      />
    </div>
  );
};

export default VisaForm;