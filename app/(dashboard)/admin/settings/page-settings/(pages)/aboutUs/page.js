/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import React, { useEffect, useState } from "react";
import { Form } from "antd";
import { useI18n } from "@/app/contexts/i18n";
import { useAction, useFetch } from "@/app/helper/hooks";
import MultipleImageInput from "@/app/components/form/multiImage";
import FormInput from "@/app/components/form/input";
import Button from "@/app/(dashboard)/components/common/button";
import {
  fetchPageContent,
  singleImageUpload,
  updatePageContent,
} from "@/app/helper/backend";
import JodiEditor from "@/app/components/form/jodiEditor";
import { noSelected } from "@/app/helper/utils";

const AboutUs = () => {
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
      getData({ langCode: lang, slug: "about" });
    }
  }, [lang]);

  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        title: data?.content?.title || "",
        description: data?.content?.description || {},
        short_description: data?.content?.short_description || {},
        text: data?.content?.text || {},
        leftImage: data?.content?.leftImage ? [{ url: data.content.leftImage }] : [],
        centerImage: data?.content?.centerImage ? [{ url: data.content.centerImage }] : [],
        rightImage: data?.content?.rightImage ? [{ url: data.content.rightImage }] : [],
        features: data?.content?.features?.map((f) => ({
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
    <div className="w-full overflow-x-auto mb-6">
      <div className="rounded dashboardInput mx-6 bg-white ">
        <div className="flex justify-between mx-4 items-center">
          <h1 className="text-[#05073C] heading-3">{i18n?.t("About Us")}</h1>
        </div>
        <Form
          form={form}
          layout="vertical"
          onFinish={async (values) => {
            let imageUrl1 = values?.leftImage?.[0]?.url || "";

            // Upload Cover Image
            if (values?.leftImage?.[0]?.originFileObj) {
              const { data } = await singleImageUpload({
                image: values.leftImage[0].originFileObj,
                image_name: "Left Image",
              });
              imageUrl1 = data?.image || "";
            }
            let imageUrl2 = values?.centerImage?.[0]?.url || "";

            // Upload Cover Image
            if (values?.centerImage?.[0]?.originFileObj) {
              const { data } = await singleImageUpload({
                image: values.centerImage[0].originFileObj,
                image_name: "Center Image",
              });
              imageUrl2 = data?.image || "";
            }
            let imageUrl3 = values?.rightImage?.[0]?.url || "";

            // Upload Cover Image
            if (values?.rightImage?.[0]?.originFileObj) {
              const { data } = await singleImageUpload({
                image: values.rightImage[0].originFileObj,
                image_name: "Right Image",
              });
              imageUrl3 = data?.image || "";
            }

            // Upload feature icons and clean feature titles and descriptions
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

                // Clean language fields
                const cleanedFeatureTitle = cleanLangFields(item.feature_title);
                const cleanedFeatureDesc = cleanLangFields(item.feature_shortDescription);

                return {
                  feature_icon,
                  feature_title: cleanedFeatureTitle,
                  feature_shortDescription: cleanedFeatureDesc,
                };
              })
            );

            const payload = {
              body: {
                _id: data?._id,
                slug: "about",
                lang: lang,
                content: {
                  leftImage: imageUrl1,
                  centerImage: imageUrl2,
                  rightImage: imageUrl3,
                  title: values.title,
                  short_description: values.short_description,
                  text: values.text,
                  description: values.description,
                  features,
                },
              },
            };

            setSubmitLoading(true);
            return useAction(
              updatePageContent,
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
            {/* Language Switch */}
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
              <div className="flex space-x-1 rounded-full flex-wrap justify-between">
                <MultipleImageInput
                name={"leftImage"}
                label={"Left Image"}
                required
              />
              <MultipleImageInput
                name={"centerImage"}
                label={"Center Image"}
                required
              />
              <MultipleImageInput
                name={"rightImage"}
                label={"Right Image"}
                required
              />
              </div>

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
                    placeholder={"Ex: Who We Are"}
                    className="w-full rounded bg-transparent p-3 dashinput"
                    required
                  />
                  <FormInput
                    name={["short_description", l.code]}
                    label={"Short Description"}
                    placeholder={
                      "Ex: Our Journey: From Vision to Reality in short"
                    }
                    className="w-full rounded bg-transparent p-3 dashinput"
                    required
                  />
                  <FormInput
                    name={["text", l.code]}
                    label={"Text Description"}
                    placeholder={
                      "Ex: Join us today and start showcasing your tours, activities, and attraction tickets."
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

            {/* Features List */}
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
                        const langCode = typeof lang === "string" ? lang : lang.code;

                        return (
                          <div
                            key={langCode}
                            style={{
                              display: langCode === selectedLang ? "block" : "none",
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
                              name={[name, "feature_shortDescription", langCode]}
                              label={i18n?.t("Feature Short Description")}
                              placeholder={i18n?.t("Ex: We ensure fast delivery within 24 hours")}
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

                  {fields.length < 3 && (
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


            {/* Submit Button */}
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

export default AboutUs;
