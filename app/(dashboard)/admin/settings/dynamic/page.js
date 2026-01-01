/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import React, { useEffect, useState } from "react";
import { Form, Spin } from "antd";
import { useI18n } from "@/app/contexts/i18n";
import { useAction, useFetch } from "@/app/helper/hooks";
import MultipleImageInput from "@/app/components/form/multiImage";
import FormInput from "@/app/components/form/input";
import Button from "@/app/(dashboard)/components/common/button";
import {
  fetchDynamicSettings,
  singleImageUpload,
  updatedtDynamicSettings,
} from "@/app/helper/backend";
import JodiEditor from "@/app/components/form/jodiEditor";
import { noSelected } from "@/app/helper/utils";
import FormSelect from "@/app/components/form/select";

const DynamicUs = () => {
  const i18n = useI18n();
  const { languages, langCode } = i18n;
  const [form] = Form.useForm();
  const [lang, setLang] = useState(langCode);
  const [data, getData, { loading }] = useFetch(
    fetchDynamicSettings,
    {},
    false
  );

  const [submitLoading, setSubmitLoading] = useState(false);
  const [selectedLang, setSelectedLang] = useState(langCode);

  useEffect(() => {
    setSelectedLang(langCode);
  }, [langCode]);

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        status: data[0]?.status,
        title: data[0]?.content?.title || "",
        description: data[0]?.content?.description || {},
        short_description: data[0]?.content?.short_description || {},
        image: data[0]?.content?.image ? [{ url: data[0]?.content?.image }] : [],
        features: data[0]?.content?.features?.map((f) => ({
          feature_icon: f?.feature_icon ? [{ url: f.feature_icon }] : [],
          feature_title: f?.feature_title || "",
          feature_shortDescription: f?.feature_shortDescription || "",
        })) || [{}],
      });
    }
  }, [data]);
  const cleanLangFields = (obj) => {
    const result = {};
    for (const key in obj) {
      if (isNaN(Number(key))) {
        result[key] = obj[key];
      }
    }
    return result;
  };

  return (
    <div className="w-full overflow-x-auto my-6 dashboardModal ">
      <div className="rounded dashboardInput mx-6 p-6 bg-white ">
        <div className="flex justify-between mx-4 items-center pb-4">
          <h1 className="text-[#05073C] heading-3">
            {i18n?.t("Why Choose Us")}
          </h1>
        </div>
        <Form
          form={form}
          layout="vertical"
          onFinish={async (values) => {
            let imageUrl = values?.image?.[0]?.url || "";
            if (values?.image?.[0]?.originFileObj) {
              const { data } = await singleImageUpload({
                image: values.image[0].originFileObj,
                image_name: "Cover Image",
              });
              imageUrl = data?.image || "";
            }
            const features = await Promise.all(
              (values?.features || []).map(async (item) => {
                let feature_icon = item?.feature_icon?.[0]?.url || "";
                if (item?.feature_icon?.[0]?.originFileObj) {
                  const { data } = await singleImageUpload({
                    image: item.feature_icon[0].originFileObj,
                    image_name: "Feature Icon",
                  });
                  feature_icon = data?.image || "";
                }
                const cleanedFeatureTitle = cleanLangFields(item.feature_title);
                const cleanedFeatureDesc = cleanLangFields(
                  item.feature_shortDescription
                );

                return {
                  feature_icon,
                  feature_title: cleanedFeatureTitle,
                  feature_shortDescription: cleanedFeatureDesc,
                };
              })
            );

            const payload = {
              body: {
                _id: data[0]?._id,
                status: values?.status,
                name: "Why Choose US",
                lang: lang,
                content: {
                  image: imageUrl,
                  title: values.title,
                  short_description: values.short_description,
                  description: values.description,
                  features,
                },
              },
            };

            setSubmitLoading(true);
            return useAction(
              updatedtDynamicSettings,
              { ...payload },
              () => {
                getData();
                setSubmitLoading(false);
              },
              setSubmitLoading
            );
          }}
        >
          <div className="p-3 rounded mb-4 pb-5">
            <div className="mb-2 flex flex-wrap justify-start gap-3">
              {i18n?.languages?.map((l, index) => (
                <span
                  onClick={() => setSelectedLang(l?.code)}
                  className={`rounded-full px-3 py-1 text-sm font-medium transition-colors duration-200 ${l?.code === selectedLang
                    ? "cursor-pointer bg-primary text-white"
                    : "cursor-pointer bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  key={index}
                >
                  {l?.name}
                </span>
              ))}
            </div>

            <div className="space-y-5 my-2">
              <div className="flex flex-col md:flex-row gap-5 -mb-6">
                <div className="w-full md:w-1/2">
                  <FormSelect
                    label={i18n.t("Status")}
                    name="status"
                    placeholder={i18n.t("Select Status")}
                    required
                    className="w-full  rounded bg-transparent py-[22px] px-2 dashinput !text-white"
                    options={[
                      { label: "Active", value: true },
                      { label: "Inactive", value: false },
                    ]}
                  />
                </div>
              </div>

              <MultipleImageInput
                name={"image"}
                label={"Image"}
                required
              />

              {languages?.map((l) => (
                <div
                  key={l.code}
                  style={{
                    display: l.code === selectedLang ? "block" : "none",
                  }}
                >
                  <FormInput
                    name={["title", l.code]}
                    label={"Title"}
                    placeholder={"Ex: Why Choose US"}
                    className="w-full rounded bg-transparent p-3 dashinput"
                    required
                  />
                  <FormInput
                    name={["short_description", l.code]}
                    label={"Short Description"}
                    placeholder={
                      "Ex: Partnering with You on Every Journey"
                    }
                    className="w-full rounded bg-transparent p-3 dashinput"
                    required
                  />

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
            </div>
            <Form.List name="features" initialValue={[{}]}>
              {(fields, { add, remove }) => (
                <>
                  <div className="mt-6 mb-2">
                    <h3 className="text-base font-semibold text-gray-700">
                      {i18n?.t("Features")}
                    </h3>
                  </div>

                  {fields.map(({ key, name, ...restField }, index) => (
                    <div
                      key={key}
                      className="bg-gray-50 border p-4 rounded mb-4 relative space-y-4"
                    >
                      <MultipleImageInput
                        name={[name, "feature_icon"]}
                        label={i18n?.t("Feature Icon")}
                        required
                      />

                      {languages?.map((lang) => {
                        const langCode =
                          typeof lang === "string" ? lang : lang.code;

                        return (
                          <div
                            key={langCode}
                            style={{
                              display:
                                langCode === selectedLang ? "block" : "none",
                            }}
                          >
                            <FormInput
                              name={[name, "feature_title", langCode]}
                              label={i18n?.t("Feature Title")}
                              placeholder={i18n?.t("Ex: Fast Delivery")}
                              required
                              className="w-full bg-transparent p-3 dashinput"
                            />
                            <FormInput
                              name={[
                                name,
                                "feature_shortDescription",
                                langCode,
                              ]}
                              label={i18n?.t("Feature Short Description")}
                              placeholder={i18n?.t(
                                "Ex: We ensure fast delivery within 24 hours"
                              )}
                              required
                              className="w-full bg-transparent p-3 dashinput"
                            />
                          </div>
                        );
                      })}

                      {fields.length > 1 && (
                        <button
                          type="button"
                          className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                          onClick={() => remove(name)}
                        >
                          ❌
                        </button>
                      )}
                    </div>
                  ))}

                  {
                    fields.length < 4 && (
                      <button
                        type="button"
                        onClick={() => add()}
                        className="bg-primary text-white px-4 py-2 rounded hover:bg-opacity-80 transition"
                      >
                        ➕ {i18n?.t("Add Feature")}
                      </button>
                    )}
                </>
              )}
            </Form.List>

            <div className="mt-10">
              <Button
                type="submit"
                onClick={() => noSelected({ form, setSelectedLang })}
                className="mt-2"
                loading={submitLoading}
              >
                {i18n.t("Submit")}
              </Button>
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default DynamicUs;
