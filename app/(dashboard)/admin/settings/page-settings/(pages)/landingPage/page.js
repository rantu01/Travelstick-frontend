/* eslint-disable react-hooks/exhaustive-deps */
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
  fetchPageContentTheme1,
  singleImageUpload,
  updatePageContent,
} from "@/app/helper/backend";
import { noSelected } from "@/app/helper/utils";
import FormSelect from "@/app/components/form/select";

const LandingPage = () => {
  const i18n = useI18n();
  const { languages, langCode } = i18n;
  const [form] = Form.useForm();
  const [data, getData] = useFetch(fetchPageContentTheme1);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [selectedLang, setSelectedLang] = useState(langCode);
  const [selectedTheme, setSelectedTheme] = useState("one");

  const selectedId = data?._id;
  useEffect(() => {
    setSelectedLang(langCode);
  }, [langCode]);

  useEffect(() => {
    if (selectedTheme) {
      getData({ theme: selectedTheme });
    }
  }, [selectedTheme]);

  useEffect(() => {
    if (!data) return;

    const selectedData = data;
    const formValues = {
      theme: selectedTheme,
      status: selectedData?.status,
    };

    // ✅ Theme-specific values
    if (selectedTheme === "one") {
      formValues.newsletter_video =
        selectedData?.content?.newsletter_video || "";

      const heroData = selectedData?.content?.hero;
      if (heroData) {
        formValues.heading = {};
        formValues.title = {};
        formValues.short_description = {};

        languages.forEach((l) => {
          formValues.heading[l.code] = heroData?.heading?.[l.code] || "";
          formValues.title[l.code] = heroData?.title?.[l.code] || "";
          formValues.short_description[l.code] =
            heroData?.short_description?.[l.code] || "";
        });

        formValues.image = heroData?.image ? [{ url: heroData.image }] : [];
      }

      const sections = [
        "offer",
        "destination",
        "tourGuides",
        "testimonial",
        "visa",
        "packages",
        "blog",
        "newsletter",
        "faq",
        "product",
      ];

      sections.forEach((section) => {
        const sectionData = selectedData?.content?.[section];
        if (sectionData) {
          formValues[`${section}_heading`] = {};
          formValues[`${section}_title`] = {};
          formValues[`${section}_description`] = {};

          languages.forEach((l) => {
            formValues[`${section}_heading`][l.code] =
              sectionData?.heading?.[l.code] || "";
            formValues[`${section}_title`][l.code] =
              sectionData?.title?.[l.code] || "";
            formValues[`${section}_description`][l.code] =
              sectionData?.offer_description?.[l.code] || "";
          });
        }
      });
    }

    if (selectedTheme === "two") {
      formValues.banner_video = selectedData?.content?.banner_video || "";

      const heroData = selectedData?.content?.hero;
      if (heroData) {
        formValues.heading = {};
        formValues.title = {};
        formValues.short_description = {};

        languages.forEach((l) => {
          formValues.heading[l.code] = heroData?.heading?.[l.code] || "";
          formValues.title[l.code] = heroData?.title?.[l.code] || "";
          formValues.short_description[l.code] =
            heroData?.short_description?.[l.code] || "";
        });
      }
      // 👆 Notice: no `image` or `sections` because theme two form doesn’t have them
    }

    // ✅ Update form only if values differ
    const currentValues = form.getFieldsValue();
    const isValuesChanged =
      JSON.stringify(currentValues) !== JSON.stringify(formValues);

    if (isValuesChanged) {
      form.setFieldsValue(formValues);
    }
  }, [data, selectedTheme, languages]);

  const sections = [
    { key: "offer", title: i18n.t("Offer Section Information") },
    { key: "destination", title: i18n.t("Destination Section Information") },
    { key: "tourGuides", title: i18n.t("Tour Guides Section Information") },
    { key: "testimonial", title: i18n.t("Testimonial Section Information") },
    { key: "visa", title: i18n.t("Visa Section Information") },
    { key: "packages", title: i18n.t("Packages Section Information") },
    { key: "blog", title: i18n.t("Blog Section Information") },
    { key: "newsletter", title: i18n.t("Newsletter Section Information") },
    { key: "faq", title: i18n.t("FAQ Section Information") },
    { key: "product", title: i18n.t("Product Section Information") },
  ];

  return (
    <div className="w-full overflow-x-auto mb-6 dashboardModal">
      <div className="rounded dashboardInput mx-6 bg-white ">
        <div className="flex justify-between px-3  items-center">
          <h1 className="text-[#05073C] heading-3">
            {i18n?.t("Home Page Settings")}
          </h1>
        </div>
        <Form
          form={form}
          layout="vertical"
          onFinish={async (values) => {
            let selectedTheme = "";
            if (data?._id === selectedId) {
              selectedTheme = data.theme;
            } else {
              console.error("⚠️ No theme found for selectedId:", selectedId);
            }

            let image = values?.image?.[0]?.url || "";
            setSubmitLoading(true);

            try {
              // ✅ Handle image upload for theme one only
              if (selectedTheme === "one") {
                if (values?.image?.[0]?.originFileObj) {
                  const { data } = await singleImageUpload({
                    image: values.image[0].originFileObj,
                    image_name: "About Image",
                  });
                  image = data?.image || "";
                }
              }

              // ✅ Base payload
              const payload = {
                body: {
                  _id: selectedId,
                  slug: "home_page",
                  theme: selectedTheme,
                  status: values.status,
                  content: {},
                },
              };

              // ✅ Shared: both themes may have a video (but different key)
              if (selectedTheme === "one") {
                payload.body.content.newsletter_video = values.newsletter_video;
              } else if (selectedTheme === "two") {
                payload.body.content.banner_video = values.banner_video;
              }

              // ✅ Theme-specific content
              if (selectedTheme === "one") {
                payload.body.content.hero = {
                  heading: values.heading,
                  title: values.title,
                  short_description: values.short_description,
                  image,
                };

                const sections = [
                  "offer",
                  "destination",
                  "tourGuides",
                  "testimonial",
                  "visa",
                  "packages",
                  "blog",
                  "newsletter",
                  "faq",
                  "product",
                ];

                sections.forEach((section) => {
                  payload.body.content[section] = {
                    heading: values[`${section}_heading`],
                    title: values[`${section}_title`],
                    offer_description: values[`${section}_description`],
                  };
                });
              }

              if (selectedTheme === "two") {
                payload.body.content.hero = {
                  title: values.title,
                  heading: values.heading,
                  short_description: values.short_description,
                  // theme two doesn’t have image upload in your form
                };
              }

              return useAction(
                updatePageContent,
                { ...payload },
                () => {
                  getData({ theme: selectedTheme });
                  setSubmitLoading(false);
                },
                setSubmitLoading(true)
              );
            } catch (error) {
              console.error("Image upload failed:", error);
              setSubmitLoading(false);
            }
          }}
        >
          <div className="p-3 rounded mb-4 pb-5">
            <div className="mb-4 mt-4 flex flex-wrap justify-start gap-3">
              {i18n?.languages?.map((l, index) => (
                <span
                  onClick={() => {
                    setSelectedLang(l?.code);
                  }}
                  className={`rounded-full px-3 py-1 text-sm font-medium transition-colors duration-200 ${
                    l?.code === selectedLang
                      ? "cursor-pointer bg-primary text-white"
                      : "cursor-pointer bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                  key={index}
                >
                  {l?.name}
                </span>
              ))}
            </div>

            <FormSelect
              label={i18n.t("Theme")}
              name="theme"
              placeholder={i18n.t("Select Theme")}
              required
              className="w-full mt-1 rounded bg-transparent py-6 px-2 dashinput !text-white"
              options={[
                { label: "One", value: "one" },
                { label: "Two", value: "two" },
              ]}
              onChange={(value) => {
                setSelectedTheme(value);
                form.setFieldValue("theme", value);
              }}
            />

            <FormSelect
              label={i18n.t("Status")}
              name="status"
              placeholder={i18n.t("Select Status")}
              required
              className="w-full mt-1 rounded bg-transparent py-6 px-2 dashinput !text-white"
              options={[
                { label: "Active", value: true },
                { label: "Inactive", value: false },
              ]}
            />

            {selectedTheme === "one" && (
              <div>
                {languages?.map((l) => (
                  <div
                    key={l.code}
                    style={{
                      display: l.code === selectedLang ? "block" : "none",
                    }}
                  >
                    <div className="flex flex-col md:flex-row gap-3">
                      <div className="w-full md:w-1/2">
                        <FormInput
                          name={["heading", l.code]}
                          label={"Heading"}
                          placeholder={
                            "Ex: Our Journey: From Vision to Reality"
                          }
                          className="w-full rounded bg-transparent p-3 dashinput"
                          required
                        />
                      </div>
                      <div className="w-full md:w-1/2">
                        <FormInput
                          name={["title", l.code]}
                          label={"Title"}
                          placeholder={
                            "Ex: Our Journey: From Vision to Reality"
                          }
                          className="w-full rounded bg-transparent p-3 dashinput"
                          required
                        />
                      </div>
                    </div>
                    <FormInput
                      name={["short_description", l.code]}
                      label={"Short Description"}
                      textArea={true}
                      placeholder={"Ex: Our Journey: From Vision to Reality"}
                      className="w-full rounded bg-transparent p-3 dashinput"
                      required
                    />
                    <FormInput
                      name={"newsletter_video"}
                      label={"Newsletter Video"}
                      type={"url"}
                      placeholder={
                        "https://www.youtube.com/watch?v=KFQj_Slteks"
                      }
                      className="w-full rounded bg-transparent p-3 dashinput"
                      required
                    />
                  </div>
                ))}
                <MultipleImageInput
                  name={"image"}
                  label="Bakground Image"
                  required
                />
                {sections.map((section) => (
                  <div key={section.key} className="w-full">
                    <h1 className="text-[#05073C] description-3 mb-4">
                      {i18n.t(section.title)}
                    </h1>
                    {languages?.map((l) => (
                      <div
                        key={l.code}
                        style={{
                          display: l.code === selectedLang ? "block" : "none",
                        }}
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div cllassName="w-full md:w-1/2">
                            <FormInput
                              name={[`${section.key}_heading`, l.code]}
                              label={`${section.title.split(" ")[0]} Heading`}
                              placeholder={
                                "Ex: Our Journey: From Vision to Reality1"
                              }
                              className="w-full rounded bg-transparent p-3 dashinput"
                              required
                            />
                          </div>
                          <div cllassName="w-full md:w-1/2">
                            <FormInput
                              name={[`${section.key}_title`, l.code]}
                              label={`${section.title.split(" ")[0]} Title`}
                              placeholder={
                                "Ex: Our Journey: From Vision to Reality2"
                              }
                              className="w-full rounded bg-transparent p-3 dashinput"
                              required
                            />
                          </div>
                        </div>
                        <FormInput
                          name={[`${section.key}_description`, l.code]}
                          textArea={true}
                          label={`${section.title.split(" ")[0]} Description`}
                          placeholder={
                            "Ex: Our Journey: From Vision to Reality3"
                          }
                          className="w-full rounded bg-transparent p-3 dashinput"
                          required
                        />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
            {selectedTheme === "two" && (
              <div>
                {languages?.map((l) => (
                  <div
                    key={l.code}
                    style={{
                      display: l.code === selectedLang ? "block" : "none",
                    }}
                  >
                    <div className="flex flex-col md:flex-row gap-3">
                      <div className="w-full md:w-1/2">
                        <FormInput
                          name={["title", l.code]}
                          label={"Title"}
                          placeholder={
                            "Ex: Our Journey: From Vision to Reality"
                          }
                          className="w-full rounded bg-transparent p-3 dashinput"
                          required
                        />
                      </div>
                      <div className="w-full md:w-1/2">
                        <FormInput
                          name={["heading", l.code]}
                          label={"Heading"}
                          placeholder={
                            "Ex: Our Journey: From Vision to Reality"
                          }
                          className="w-full rounded bg-transparent p-3 dashinput"
                          required
                        />
                      </div>
                    </div>
                    <FormInput
                      name={["short_description", l.code]}
                      label={"Short Description"}
                      textArea={true}
                      placeholder={"Ex: Our Journey: From Vision to Reality"}
                      className="w-full rounded bg-transparent p-3 dashinput"
                      required
                    />
                    <FormInput
                      name={"banner_video"}
                      label={"Banner Video"}
                      type={"url"}
                      placeholder={
                        "https://www.youtube.com/watch?v=KFQj_Slteks"
                      }
                      className="w-full rounded bg-transparent p-3 dashinput"
                      required
                    />
                  </div>
                ))}
              </div>
            )}

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

export default LandingPage;
