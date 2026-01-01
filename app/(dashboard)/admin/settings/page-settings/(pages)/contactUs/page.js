"use client";
import React, { useEffect, useState } from "react";
import { Form } from "antd";
import { fetchPageContent, updatePageContent } from "@/app/helper/backend";
import { useAction, useFetch } from "@/app/helper/hooks";
import FormInput from "@/app/components/form/input";
import Button from "@/app/(dashboard)/components/common/button";
import { useI18n } from "@/app/contexts/i18n";
import { noSelected } from "@/app/helper/utils";
import JodiEditor from "@/app/components/form/jodiEditor";

const ContactUs = () => {
  const i18n = useI18n();
  const { languages, langCode } = i18n;
  const [form] = Form.useForm();
  const [lang, setLang] = useState(langCode);
  const [data, getData, { loading }] = useFetch(fetchPageContent, {}, false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [selectedLang, setSelectedLang] = useState(langCode);

  useEffect(() => {
    setSelectedLang(langCode);
  }, [langCode]);

  useEffect(() => {
    if (lang) {
      getData({ langCode: lang, slug: "contact_us" });
    }
  }, [lang]);

  useEffect(() => {
    if (data?.content) {
      const { title, description } = data.content;

      // Set the form values
      form.setFieldsValue({
        title,
        description,
        company_name: data?.content?.company_name,
        company_phone: data?.content?.company_phone,
        company_address: data?.content?.company_address,
        video_url: data?.content?.video_url,
      });
    }
  }, [data, form]);

  const handleSubmit = async (values) => {
    setSubmitLoading(true);

    const payload = {
      body: {
        _id: data._id, // Using form values (_id) here
        slug: "contact_us",
        content: {
          title: values.title,
          company_name: values.company_name,
          company_phone: values.company_phone,
          company_address: values.company_address,
          video_url: values.video_url,
          description: languages.reduce((acc, l) => {
            acc[l.code] = values.description[l.code] || "";
            return acc;
          }, {}),
        },
      },
    };

    await useAction(
      updatePageContent,
      payload,
      () => {
        getData({ lang: selectedLang, slug: "contact_us" });
        setSubmitLoading(false);
      },
      setSubmitLoading
    );
  };

  return (
    <div className="w-full overflow-x-auto mb-6 dashboardModal">
      <div className="rounded dashboardInput mx-6 bg-white ">
        <div className="flex justify-between  items-center mb-4">
          <h1 className="text-[#05073C] heading-3">{i18n?.t("Contact Us")}</h1>
        </div>

        <div className="flex justify-start flex-wrap gap-3 my-4">
          {languages?.map((l) => (
            <button
              key={l.code}
              onClick={() => setSelectedLang(l.code)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${
                l.code === selectedLang
                  ? "bg-primary text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {l.name}
            </button>
          ))}
        </div>

        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <div className="rounded mb-4 pb-5">
            <div className="flex gap-5">
              <div className="w-full md:w-full">
                <FormInput
                  label="Title"
                  name="title"
                  required
                  placeholder="Contact Information"
                  className="w-full rounded bg-transparent p-3 dashinput"
                />
              </div>
              <div className="w-full md:w-full">
                <FormInput
                  label="Company Name"
                  name="company_name"
                  required
                  placeholder="eg. Appstick Limited"
                  className="w-full rounded bg-transparent p-3 dashinput"
                />
              </div>
            </div>
            <div className="flex gap-5">
              <div className="w-full md:w-full">
                <FormInput
                  label="Company Address"
                  name="company_address"
                  required
                  placeholder="eg. 85, KDA Outer Bypass Rd, Khulna 9100"
                  className="w-full rounded bg-transparent p-3 dashinput"
                />
              </div>
              <div className="w-full md:w-full">
                <FormInput
                  label="Video Url"
                  name="video_url"
                  required
                  type="url"
                  placeholder="Contact Information"
                  className="w-full rounded bg-transparent p-3 dashinput"
                />
              </div>
            </div>
            <div className="w-full md:w-full">
              <FormInput
                label="Company Number"
                name="company_phone"
                required
                placeholder="01404049797"
                className="w-full rounded bg-transparent p-3 dashinput"
              />
            </div>

            {languages?.map((l) => (
              <div
                key={l.code}
                style={{ display: l.code === selectedLang ? "block" : "none" }}
              >
                <JodiEditor
                  name={["description", l.code]}
                  label={i18n?.t("Description")}
                  className="w-full rounded bg-transparent p-3 dashinput"
                  required
                  value={form.getFieldValue(["description", l.code]) || ""}
                  onChange={(newContent) =>
                    form.setFieldValue(["description", l.code], newContent)
                  }
                />
              </div>
            ))}

            <Button
              type="submit"
              onClick={() => noSelected({ form, setSelectedLang })}
              className="mt-2.5"
              loading={submitLoading}
            >
              {i18n.t("Submit")}
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default ContactUs;
