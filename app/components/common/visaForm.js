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
  const router = useRouter()
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const i18n = useI18n();
  const { user } = useUser();
  const { langCode } = useI18n();
  const [form] = Form.useForm();
  const [submitLoading, setSubmitLoading] = useState(false);
  const [data] = useFetch(getAllPublicVisaType, { limit: 100 });

  const onFinish = async (values) => {
    if (user) {
      try {
        let file = "";

        if (values?.file?.[0]?.originFileObj) {
          const { data } = await singlePDFUpload({
            pdf: values.file[0].originFileObj,
            file_name: "file",
          });
          file = data || "";
        } else {
          file = values.file[0].url || "";
        }

        const payload = {
          full_name: values.name,
          email: values.email,
          phone: values.phone,
          visa_type: values.visa_type,
          message: values.message,
          file: file,
        };

        await useAction(createVisaQuery, {
          body: payload,
        });
        form.resetFields();
        router.push('/user/visaInquery')
      } catch (error) {
        console.error("Submission Error:", error);
      } finally {
        setSubmitLoading(false);
      }
    }
    else {
      setAuthModalOpen(true)
    }
  };

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || ''
      });
    }
  }, [user, form]);


  return (
    <div className="w-full relative">
      <Form
        form={form}
        layout="vertical"
        className="w-full"
        onFinish={onFinish}
      >
        <div className="shadow-lg rounded-[10px] lg:rounded-[20px] border-b bg-white w-full">
          <div className="bg-[#FEF5EE] border rounded-t-[10px] lg:rounded-t-[20px] xl:p-[30px] lg:p-6 md:p-5 sm:p-4 p-3">
            <h3 className="heading-3">{i18n.t("Inquiry Form")}</h3>
          </div>

          <div className="xl:m-6 lg:m-5 md:m-4 m-3">
            <FormInput
              name="name"
              label={i18n.t("Full Name")}
              placeholder="Full name"
              required
              className="w-full p-2 sm:p-3 xl:p-4 border rounded-2xl focus:outline-primary"
            />
            <FormInput
              name="email"
              label={i18n.t("Email Address")}
              placeholder={i18n.t("Email Address")}
              required
              className="w-full p-2 sm:p-3 xl:p-4 border rounded-2xl focus:outline-primary"
            />
            <FormInput
              name="phone"
              label={i18n.t("Phone Number")}
              placeholder={i18n.t("Phone Number")}
              required
              className="w-full p-2 sm:p-3 xl:p-4 border rounded-2xl focus:outline-primary"
            />
            <FormSelect
              name="visa_type"
              required
              options={data?.docs?.map((visa) => ({
                label: visa?.name?.[langCode],
                value: visa?._id,
              }))}
              className="w-full lg:p-4 md:p-3 p-2 !py-7 border rounded-2xl"
              placeholder="Select Visa Type"
              label={i18n.t("Visa Type")}
            />
            <FormInput
              name="message"
              textArea
              rows={4}
              label={i18n.t("Your Message")}
              placeholder={i18n.t("Your Message")}
              required
              className="w-full p-2 sm:p-3 xl:p-4 border rounded-2xl focus:outline-primary"
            />

            <div className="visa-image flex items-center justify-center w-full border xl:mt-4 lg:mt-3 mt-2 rounded-[10px] lg:rounded-[20px]">
              <UploadFileInput
                className={"!pt-[19px] !pb-[18px] !h-[56px] !px-[20px]"}
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

            <div className="xl:mt-14 lg:mt-10 md:mt-8 mt-6 w-full">
              <Button type="submit" className="my-6 w-full" loading={submitLoading}>
                {i18n.t("Submit")}
              </Button>
            </div>
          </div>
        </div>
      </Form>
      <AuthModal authModalOpen={authModalOpen} setAuthModalOpen={setAuthModalOpen} slug={`/visa/${id}`} />
    </div>
  );
};

export default VisaForm;
