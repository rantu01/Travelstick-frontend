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
import { countries } from "countries-list";

// ─── Build country options once (sorted A→Z) with flagcdn.com images ──────────
const countryOptions = Object.entries(countries)
  .map(([code, country]) => ({
    value: code.toLowerCase(),
    label: (
      <div className="flex items-center gap-2">
        <img
          src={`https://flagcdn.com/w40/${code.toLowerCase()}.png`}
          alt={country.name}
          width={22}
          height={15}
          style={{ objectFit: "cover", borderRadius: 2, flexShrink: 0 }}
          onError={(e) => {
            e.target.style.display = "none";
          }}
        />
        <span>{country.name}</span>
      </div>
    ),
    searchLabel: country.name.toLowerCase(),
  }))
  .sort((a, b) => a.searchLabel.localeCompare(b.searchLabel));
// ──────────────────────────────────────────────────────────────────────────────

// ─── Entry Type options ───────────────────────────────────────────────────────
const entryTypeOptions = [
  { value: "single", label: "Single Entry" },
  { value: "double", label: "Double Entry" },
  { value: "multiple", label: "Multiple Entry" },
];

// ─── Visa Category options ────────────────────────────────────────────────────
const visaCategoryOptions = [
  { value: "tourist", label: "Tourist" },
  { value: "business", label: "Business" },
  { value: "student", label: "Student" },
  { value: "work", label: "Work" },
  { value: "transit", label: "Transit" },
  { value: "medical", label: "Medical" },
  { value: "family", label: "Family / Dependent" },
  { value: "investor", label: "Investor" },
  { value: "diplomatic", label: "Diplomatic" },
  { value: "other", label: "Other" },
];
// ──────────────────────────────────────────────────────────────────────────────

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
        citizen_of: data?.citizen_of || null,
        travelling_to: data?.travelling_to || null,
        banner_image: data?.banner_image
          ? [{ uid: "-1", name: "image", status: "done", url: data.banner_image }]
          : [],
        card_image: data?.card_image
          ? [{ uid: "-2", name: "card.png", status: "done", url: data.card_image }]
          : [],
        images: Array.isArray(data?.images)
          ? data.images.map((url, index) => ({
            uid: String(index),
            name: `image-${index}.png`,
            status: "done",
            url,
          }))
          : [],
        title: data?.title || {},
        visa_type: data?.visa_type?._id || null,
        validity: data?.validity,
        processing_type: data?.processing_type,
        visa_mode: data?.visa_mode,
        country: data?.country,
        visa_code: data?.visa_code || "",
        max_stay_days: data?.max_stay_days || null,
        entry_type: data?.entry_type || null,
        visa_category: data?.visa_category || null,
        price: {
          amount: data?.price?.amount,
          discount_type: data?.price?.discount_type,
          discount: data?.price?.discount,
        },
        overview: data?.overview || {},
        document_about: data?.document_about || {},
        documents: Array.isArray(data?.documents)
          ? data.documents.map((item) => ({ key: item.key, value: item.value }))
          : [],
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
      {/* ── Language Switcher ── */}
      <div className="flex justify-start flex-wrap gap-3 mt-4">
        {languages?.map((l) => (
          <button
            key={l.code}
            onClick={() => setSelectedLang(l.code)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${l.code === selectedLang
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
          setSubmitLoading(true);
          try {
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
                return { logo, text };
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

            await useAction(
              isEdit ? updateVisa : createVisa,
              { body: requestData },
              () => {
                form.resetFields();
                router.push("/admin/visaManagement/visa");
              }
            );
          } catch (err) {
            console.error("Submit error:", err);
          } finally {
            setSubmitLoading(false);
          }
        }}
        className="mt-2"
      >
        {isEdit && <HiddenInput name="_id" />}

        {/* ── Images ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
          <MultipleImageInput label="Banner Image" name="banner_image" required />
          <MultipleImageInput label="Card Image" name="card_image" required />
        </div>
        <MultipleImageInput name="images" label="Visa Images" required max={12} />

        {/* ── Language-specific fields ── */}
        {languages?.map((l) => (
          <div
            key={l.code}
            style={{ display: l.code === selectedLang ? "block" : "none" }}
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
              value={form.getFieldValue(["overview", l.code]) || ""}
              onChange={(newDescription) =>
                form.setFieldValue(["overview", l.code], newDescription)
              }
            />

            {/* ── Visa Type ── */}
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
            </div>

            {/* ── Citizen of / Travelling to ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
              <FormSelect
                label={i18n.t("Citizen of")}
                name="citizen_of"
                placeholder={i18n.t("Select Citizen Country")}
                required
                showSearch
                filterOption={(input, option) =>
                  option?.searchLabel?.includes(input.toLowerCase())
                }
                className="!w-full rounded bg-transparent py-6 px-2 dashinput"
                options={countryOptions}
              />
              <FormSelect
                label={i18n.t("Travelling to")}
                name="travelling_to"
                placeholder={i18n.t("Select Destination")}
                required
                showSearch
                filterOption={(input, option) =>
                  option?.searchLabel?.includes(input.toLowerCase())
                }
                className="!w-full rounded bg-transparent py-6 px-2 dashinput"
                options={countryOptions}
              />
            </div>

            {/* ── Validity & Processing Time ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
              <FormInput
                label="Validity"
                name="validity"
                required
                type="text"
                className="w-full rounded bg-transparent p-3 dashinput"
                placeholder={i18n.t("eg. 6 months")}
              />
              <FormInput
                label="Processing Time"
                name="processing_type"
                required
                type="text"
                className="w-full rounded bg-transparent p-3 dashinput"
                placeholder={i18n.t("eg. 6-8 days")}
              />
            </div>

            {/* ── Visa Code & Max Stay Days ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
              <FormInput
                label="Visa Code"
                name="visa_code"
                type="text"
                className="w-full rounded bg-transparent p-3 dashinput"
                placeholder={i18n.t("eg. VN-TV-30")}
              />
              <FormInput
                label="Max Stay Days"
                name="max_stay_days"
                type="number"
                getValueFromEvent={(e) => +e.target.value}
                className="w-full rounded bg-transparent p-3 dashinput"
                placeholder={i18n.t("eg. 30")}
              />
            </div>

            {/* ── Entry Type & Visa Category ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
              <FormSelect
                label={i18n.t("Entry Type")}
                name="entry_type"
                placeholder={i18n.t("Select Entry Type")}
                className="!w-full rounded bg-transparent py-6 px-2 dashinput"
                options={entryTypeOptions}
              />
              <FormSelect
                label={i18n.t("Visa Category")}
                name="visa_category"
                placeholder={i18n.t("Select Visa Category")}
                showSearch
                filterOption={(input, option) =>
                  option?.label?.toLowerCase().includes(input.toLowerCase())
                }
                className="!w-full rounded bg-transparent py-6 px-2 dashinput"
                options={visaCategoryOptions}
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


        {/* ── Features ── */}
        <div className="mt-6 border rounded-md p-3">
          <h3 className="description-2 mb-2">Features</h3>
          <Form.List name="feathers" initialValue={[{ text: {} }]}>
            {(fields, { add, remove }) => (
              <div className="mt-4">
                <div className="flex flex-wrap gap-4">
                  {fields.map(({ key, name: fieldName }, index) => (
                    <div key={key} className="w-full md:w-[48%] rounded">
                      {languages?.map((l) => (
                        <div
                          key={l.code}
                          style={{
                            display: l.code === selectedLang ? "block" : "none",
                          }}
                        >
                          <MultipleImageInput
                            label="Features Image"
                            name={[fieldName, "logo"]}
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

        {/* ── Price ── */}
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

            getValueFromEvent={(e) => +e.target.value}
            className="w-full rounded bg-transparent p-3 dashinput"
            placeholder={i18n.t("Discount Amount")}
          />
        </div>

        <div className="mt-4 p-3 bg-yellow-50 border rounded text-sm">
          Note: The fields below ( Citizen Of, Travelling To, Processing Time)
          and ( Documents ) are displayed under "Other Information" on the public visa page.
        </div>

        {/* ── Documents ── */}
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
                            <FormInput
                              name={[fieldName, "key", l.code]}
                              placeholder="Key"
                              type="text"
                              required
                              className="!w-full rounded bg-transparent p-3 dashinput"
                              label={`Key ${index + 1}`}
                            />
                            <FormInput
                              name={[fieldName, "value", l.code]}
                              placeholder="Value"
                              type="text"
                              required
                              className="!w-full rounded bg-transparent p-3 dashinput"
                              label={`Value ${index + 1}`}
                            />
                          </div>
                        </div>
                      ))}
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
                  onClick={() => add({ key: {}, value: {} })}
                  className="mt-4 bg-primary text-white px-4 py-2 rounded-md"
                >
                  Add Documents
                </button>
              </div>
            )}
          </Form.List>
        </div>

        {/* ── FAQs ── */}
        <div className="mt-6 border rounded-md p-3">
          <h3 className="description-2 mb-2">FAQs</h3>
          <Form.List name="faqs" initialValue={[{ heading: {}, description: {} }]}>
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
                              placeholder="FAQ Heading"
                              type="text"
                              required
                              className="!w-full rounded bg-transparent p-3 dashinput"
                              label={`Heading ${index + 1}`}
                            />
                            <FormInput
                              name={[fieldName, "description", l.code]}
                              placeholder="FAQ Description"
                              type="text"
                              required
                              className="!w-full rounded bg-transparent p-3 dashinput"
                              label={`Description ${index + 1}`}
                            />
                          </div>
                        </div>
                      ))}
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