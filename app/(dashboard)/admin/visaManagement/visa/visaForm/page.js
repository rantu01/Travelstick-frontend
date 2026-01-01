/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import { useEffect, useState } from "react";
import { useI18n } from "@/app/contexts/i18n";
import { Form } from "antd";
import {
  createVisa,
  getAllVisaType,
  singleImageUpload,
  updateVisa,
} from "@/app/helper/backend";
import { useAction, useFetch } from "@/app/helper/hooks";
import FormInput, { HiddenInput } from "@/app/components/form/input";
import MultipleImageInput from "@/app/components/form/multiImage";
import FormSelect from "@/app/components/form/select";
import JodiEditor from "@/app/components/form/jodiEditor";
import Button from "@/app/(dashboard)/components/common/button";
import { noSelected } from "@/app/helper/utils";
import { useRouter } from "next/navigation";
import { FaTrash } from "react-icons/fa6";

const VisaForm = ({ isEdit = false, data }) => {
  const router = useRouter();
  const [form] = Form.useForm();
  const i18n = useI18n();
  const [visaType] = useFetch(getAllVisaType, { limit: 100 });
  let { languages, langCode } = useI18n();
  const [selectedLang, setSelectedLang] = useState(langCode);
  const [submitLoading, setSubmitLoading] = useState(false);
  useEffect(() => {
    setSelectedLang(langCode);
  }, [langCode]);
  useEffect(() => {
    if (isEdit && data) {
      form.resetFields();
      form.setFieldsValue({
        ...data,
        // 1. Banner Image
        banner_image: data?.banner_image
          ? [
              {
                uid: "-1",
                name: "image",
                status: "done",
                url: data.banner_image,
              },
            ]
          : [],

        // 2. Card Image
        card_image: data?.card_image
          ? [
              {
                uid: "-2",
                name: "card.png",
                status: "done",
                url: data.card_image,
              },
            ]
          : [],

        // 3. Multiple Images
        images: Array.isArray(data?.images)
          ? data.images.map((url, index) => ({
              uid: String(index),
              name: `image-${index}.png`,
              status: "done",
              url,
            }))
          : [],

        // 4. Title (multilingual)
        title: data?.title || {},

        // 5. Visa Type
        visa_type: data?.visa_type?._id || null,

        // 6. Language, Validity, Mode, Country
        language: data?.language,
        validity: data?.validity,
        processing_type: data?.processing_type,
        visa_mode: data?.visa_mode,
        country: data?.country,

        // 7. Price
        price: {
          amount: data?.price?.amount,
          discount_type: data?.price?.discount_type,
          discount: data?.price?.discount,
        },

        // 8. Overview (multilingual rich text)
        overview: data?.overview || {},

        // 9. Document About (multilingual)
        document_about: data?.document_about || {},

        // 10. Documents (multi-language key-value)
        documents: Array.isArray(data?.documents)
          ? data.documents.map((item) => ({
              key: item.key,
              value: item.value,
            }))
          : [],

        // 11. Features (called `feathers` in your data)
        feathers: Array.isArray(data?.feathers)
          ? data.feathers.map((item, index) => ({
              ...item,
              logo: item?.logo
                ? [
                    {
                      uid: `${index}`,
                      name: `feather-logo-${index}.png`,
                      status: "done",
                      url: item.logo,
                    },
                  ]
                : [],
            }))
          : [],

        // 12. FAQs
        faqs: Array.isArray(data?.faqs)
          ? data.faqs.map((item) => ({
              heading: item.heading,
              description: item.description,
            }))
          : [],
      });
    }
  }, [data, form, isEdit]);
  return (
    <div className="">
      <div className="flex justify-start flex-wrap gap-3 mt-4">
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
      <Form
        form={form}
        layout="vertical"
        onFinish={async (values) => {
          let bannerImageUrl = "";
          let cardImageUrl = "";

          if (values?.banner_image?.[0]?.originFileObj) {
            const { data } = await singleImageUpload({
              image: values.banner_image[0].originFileObj,
              image_name: "visa_banner",
            });
            bannerImageUrl = data?.image || "";
          } else {
            bannerImageUrl = values?.banner_image?.[0]?.url || "";
          }

          if (values?.card_image?.[0]?.originFileObj) {
            const { data } = await singleImageUpload({
              image: values.card_image[0].originFileObj,
              image_name: "visa_card",
            });
            cardImageUrl = data?.image || "";
          } else {
            cardImageUrl = values?.card_image?.[0]?.url || "";
          }
          const feathersData = await Promise.all(
            (values?.feathers || []).map(async (feather) => {
              let logo = "";

              if (feather?.logo?.[0]?.originFileObj) {
                const { data } = await singleImageUpload({
                  image: feather.logo[0].originFileObj,
                  image_name: "feature_logo",
                });
                logo = data?.image || "";
              } else {
                logo = feather?.logo?.[0]?.url || "";
              }

              const text = {};
              languages?.forEach((lang) => {
                text[lang.code] = feather?.text?.[lang.code] || "";
              });

              return {
                logo,
                text,
              };
            })
          );

          let images = [];

          if (values?.images?.length > 0) {
            const uploadPromises = values.images.map(async (file) => {
              if (!file.url) {
                const { data } = await singleImageUpload({
                  image: file.originFileObj,
                });
                return data?.image || "";
              }
              return file.url;
            });

            images = await Promise.all(uploadPromises);
          }

          const requestData = {
            ...values,
            _id: isEdit ? values._id : undefined,
            banner_image: bannerImageUrl,
            card_image: cardImageUrl,
            feathers: feathersData,
            images,
          };

          setSubmitLoading(true);
          await useAction(
            isEdit ? updateVisa : createVisa,
            { body: requestData },
            () => {
              form.resetFields();
              setSubmitLoading(false);
              router.push("/admin/visaManagement/visa");
            }
          );
        }}
        className="mt-2"
      >
        {isEdit && <HiddenInput name="_id" />}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5 ">
          <MultipleImageInput
            label="Banner Image"
            name="banner_image"
            required
          />
          <MultipleImageInput label="Card Image" name="card_image" required />
        </div>
        <MultipleImageInput
          name="images"
          label="visa Images"
          required
          max={12}
        />
        {languages?.map((l) => (
          <div
            key={l.code}
            style={{
              display: l.code === selectedLang ? "block" : "none",
            }}
          >
            <FormInput
              label="Visa Title"
              name={["title", l.code]}
              required
              className="!w-full rounded bg-transparent p-3 dashinput"
              placeholder={i18n.t("Visa Title")}
            />
            <JodiEditor
              name={["overview", l.code]}
              label={i18n?.t("Visa Overview")}
              className="w-full rounded bg-transparent p-3 dashinput"
              required
              value={form.getFieldValue("overview") || ""}
              onChange={(newDescription) =>
                form.setFieldValue("overview", newDescription)
              }
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
              <FormSelect
                label={i18n.t("Visa Type")}
                name="visa_type"
                placeholder={i18n.t("Select visa type")}
                required
                className="!w-full rounded bg-transparent py-6 px-2 dashinput"
                options={visaType?.docs?.map((visa) => ({
                  label: visa?.name?.[langCode],
                  value: visa?._id,
                }))}
              />
              <FormSelect
                label="Country"
                name="country"
                required
                className="w-full rounded bg-transparent py-6 px-2 dashinput "
                placeholder={i18n.t("Select Country")}
                options={[
                  { value: "usa", label: "United States" },
                  { value: "uk", label: "United Kingdom" },
                  { value: "uae", label: "United Arab Emirates" },
                  { value: "canada", label: "Canada" },
                  { value: "germany", label: "Germany" },
                  { value: "australia", label: "Australia" },
                  { value: "malaysia", label: "Malaysia" },
                  { value: "turkey", label: "Turkey" },
                  { value: "italy", label: "Italy" },
                  { value: "japan", label: "Japan" },
                ]}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
              <FormInput
                label="Validity"
                name="validity"
                required
                type={"text"}
                className="w-full rounded bg-transparent p-3 dashinput"
                placeholder={i18n.t("eg. 6 months")}
              />
              <FormInput
                label="Processing Time"
                name="processing_type"
                required
                type={"text"}
                className="w-full rounded bg-transparent p-3 dashinput"
                placeholder={i18n.t("eg. 6-8 days")}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
              {/* Popular Languages */}
              <FormSelect
                label={i18n.t("Select Language")}
                name="language"
                placeholder={i18n.t("Select Language")}
                required
                className="w-full rounded bg-transparent py-6 px-2 dashinput "
                options={[
                  { value: "english", label: "English" },
                  { value: "arabic", label: "Arabic" },
                  { value: "hindi", label: "Hindi" },
                  { value: "spanish", label: "Spanish" },
                  { value: "french", label: "French" },
                  { value: "chinese", label: "Chinese" },
                  { value: "bengali", label: "Bengali" },
                  { value: "russian", label: "Russian" },
                  { value: "portuguese", label: "Portuguese" },
                  { value: "urdu", label: "Urdu" },
                ]}
              />

              {/* Visa Mode */}
              <FormSelect
                label={i18n.t("Visa Mode")}
                name="visa_mode"
                placeholder={i18n.t("Select Visa Mode")}
                required
                className="w-full rounded bg-transparent py-6 px-2 dashinput !text-white"
                options={[
                  { value: "B2B", label: "B2B" },
                  { value: "B2C", label: "B2C" },
                ]}
              />
            </div>
            <FormInput
              label="Document about"
              name={["document_about", l.code]}
              required
              textArea={true}
              className="!w-full rounded bg-transparent p-3 dashinput"
              placeholder={i18n.t("Document about")}
            />
          </div>
        ))}
        <div className="mt-6 border rounded-md p-3">
          <h3 className="description-2 mb-2">Features</h3>
          <Form.List name="feathers" initialValue={[{ text: {} }]}>
            {(fields, { add, remove }) => (
              <div className="mt-4">
                <div className="flex flex-wrap gap-4">
                  {fields.map(({ key, name: fieldName }, index) => (
                    <div key={key} className="w-full md:w-[48%] rounded">
                      {/* Multilingual Texts */}
                      {languages?.map((l) => (
                        <div
                          key={l.code}
                          style={{
                            display: l.code === selectedLang ? "block" : "none",
                          }}
                        >
                          {/* Single Image Logo */}
                          <MultipleImageInput
                            label="Features Image"
                            name={[fieldName, "logo"]} // Use the correct field name here {'logo'}
                            required
                          />
                          <FormInput
                            name={[fieldName, "text", l.code]}
                            placeholder={`Input feature ${index + 1}`}
                            type="text"
                            required
                            className="!w-full rounded bg-transparent p-3 dashinput"
                            label="Features Title"
                          />
                        </div>
                      ))}

                      {/* Remove Button */}
                      <div className="text-right mt-3">
                        {fields.length > 1 && (
                          <button
                            type="button"
                            className="text-red-500 hover:text-primary"
                            onClick={() => remove(fieldName)}
                          >
                            <FaTrash />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => add({ text: {}, logo: "" })}
                  className="mt-4 bg-primary text-white px-4 py-2 rounded-md"
                >
                  Add Feathers
                </button>
              </div>
            )}
          </Form.List>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
          <FormInput
            label={i18n.t("Price")}
            name={["price", "amount"]}
            type="number"
            required
            getValueFromEvent={(e) => +e.target.value}
            className="w-full rounded bg-transparent p-3 dashinput"
            placeholder={i18n.t("Input Price")}
          />
          <FormSelect
            label={i18n.t("Discount Type")}
            name={["price", "discount_type"]}
            placeholder={i18n.t("Select Discount Type")}
            required
            className="w-full rounded bg-transparent py-6 px-2 dashinput !text-white"
            options={[
              { value: "percent", label: "Percentage" },
              { value: "flat", label: "Flat" },
            ]}
          />
          <FormInput
            label={i18n.t("Discount Amount")}
            name={["price", "discount"]}
            type="number"
            required
            getValueFromEvent={(e) => +e.target.value}
            className="w-full rounded bg-transparent p-3 dashinput"
            placeholder={i18n.t("Discount Amount")}
          />
        </div>
        {/* Documents */}
        <div className="mt-6 border rounded-md p-3">
          <h3 className="description-2 mb-2">Documents</h3>
          <Form.List name="documents" initialValue={[{ key: {}, value: {} }]}>
            {(fields, { add, remove }) => (
              <div className="mt-4">
                <div className="flex flex-wrap gap-4">
                  {fields.map(({ key, name: fieldName }, index) => (
                    <div key={key} className="w-full rounded border p-3">
                      {languages?.map((l) => (
                        <div
                          key={l.code}
                          style={{
                            display: l.code === selectedLang ? "block" : "none",
                          }}
                        >
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Key field */}
                            <FormInput
                              name={[fieldName, "key", l.code]}
                              placeholder={`Key`}
                              type="text"
                              required
                              className="!w-full rounded bg-transparent p-3 dashinput"
                              label={`Key ${index + 1}`}
                            />
                            {/* Value field */}
                            <FormInput
                              name={[fieldName, "value", l.code]}
                              placeholder={`Value`}
                              type="text"
                              required
                              className="!w-full rounded bg-transparent p-3 dashinput"
                              label={`Value ${index + 1}`}
                            />
                          </div>
                        </div>
                      ))}

                      {/* Remove Button */}
                      <div className="text-right mt-3">
                        {fields.length > 1 && (
                          <button
                            type="button"
                            className="text-red-500 hover:text-primary"
                            onClick={() => remove(fieldName)}
                          >
                            <FaTrash />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add Button */}
                <button
                  type="button"
                  onClick={() => add({ key: {}, value: {} })}
                  className="mt-4 bg-primary text-white px-4 py-2 rounded-md"
                >
                  Add Documents
                </button>
              </div>
            )}
          </Form.List>
        </div>

        {/* Faq */}
        {/* FAQs Section */}
        <div className="mt-6 border rounded-md p-3">
          <h3 className="description-2 mb-2">FAQs</h3>
          <Form.List
            name="faqs"
            initialValue={[{ heading: {}, description: {} }]}
          >
            {(fields, { add, remove }) => (
              <div className="mt-4">
                <div className="flex flex-wrap gap-4">
                  {fields.map(({ key, name: fieldName }, index) => (
                    <div key={key} className="w-full border rounded p-3">
                      {languages?.map((l) => (
                        <div
                          key={l.code}
                          style={{
                            display: l.code === selectedLang ? "block" : "none",
                          }}
                        >
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormInput
                              name={[fieldName, "heading", l.code]}
                              placeholder={`FAQ Heading`}
                              type="text"
                              required
                              className="!w-full rounded bg-transparent p-3 dashinput"
                              label={`Heading ${index + 1}`}
                            />
                            <FormInput
                              name={[fieldName, "description", l.code]}
                              placeholder={`FAQ Description`}
                              type="text"
                              required
                              className="!w-full rounded bg-transparent p-3 dashinput"
                              label={`Description ${index + 1}`}
                            />
                          </div>
                        </div>
                      ))}

                      {/* Remove FAQ */}
                      <div className="text-right mt-3">
                        {fields.length > 1 && (
                          <button
                            type="button"
                            className="text-red-500 hover:text-primary"
                            onClick={() => remove(fieldName)}
                          >
                            <FaTrash />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add FAQ */}
                <button
                  type="button"
                  onClick={() => add({ heading: {}, description: {} })}
                  className="mt-4 bg-primary text-white px-4 py-2 rounded-md"
                >
                  Add FAQ
                </button>
              </div>
            )}
          </Form.List>
        </div>

        <Button
          type="submit"
          onClick={() => noSelected({ form, setSelectedLang })}
          className="my-6"
          loading={submitLoading}
        >
          {i18n.t("Submit")}
        </Button>
      </Form>
    </div>
  );
};

export default VisaForm;
