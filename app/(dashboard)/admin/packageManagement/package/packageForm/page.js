/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import { useEffect, useState } from "react";
import { useI18n } from "@/app/contexts/i18n";
import { DatePicker, Form } from "antd";
import {
  createPackages,
  getActivity,
  getDestination,
  singleImageUpload,
  updatePackages,
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
import dayjs from "dayjs";

const PackageForm = ({ isEdit = false, data }) => {
  const router = useRouter();
  const [form] = Form.useForm();
  const i18n = useI18n();

  const [activity] = useFetch(getActivity, { limit: 100 });
  const [destination] = useFetch(getDestination, { limit: 100 });
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
        name: data?.name,
        check_in: data?.check_in ? dayjs(data.check_in) : null,
        check_out: data?.check_out ? dayjs(data.check_out) : null,
        group_size: data?.group_size,
        tour_type: data?.tour_type,
        section: data?.section || [],
        banner_video_url: data?.banner_video_url,
        about: data?.about || {},
        destination: data?.destination?._id,
        activity: Array.isArray(data?.activity)
            ? data?.activity.map((a) => ({
                label: a?.name?.[langCode], 
                value: a?._id,
              }))
            : [],
      
        banner_image: data?.banner_image
          ? [
              {
                uid: "-1",
                name: "banner",
                status: "done",
                url: data.banner_image,
              },
            ]
          : [],

        card_image: data?.card_image
          ? [
              {
                uid: "-1",
                name: "card.png",
                status: "done",
                url: data.card_image,
              },
            ]
          : [],

        images: Array.isArray(data?.images)
          ? data.images.map((url, index) => ({
              uid: String(index),
              name: `image-${index}.png`,
              status: "done",
              url,
            }))
          : [],

        // Feathers
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

        // Itinerary
        itinerary: Array.isArray(data?.itinerary) ? data.itinerary : [],
        highlight: Array.isArray(data?.highlight) ? data.highlight : [],
        include: Array.isArray(data?.include) ? data.include : [],
        exclude: Array.isArray(data?.exclude) ? data.exclude : [],
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
              image_name: "blog_banner",
            });
            bannerImageUrl = data?.image || "";
          } else {
            bannerImageUrl = values?.banner_image?.[0]?.url || "";
          }

          if (values?.card_image?.[0]?.originFileObj) {
            const { data } = await singleImageUpload({
              image: values.card_image[0].originFileObj,
              image_name: "blog_card",
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

          const multiLangFields = ["name", "about"];
          const formattedData = multiLangFields.reduce((acc, field) => {
            acc[field] = {};
            languages?.forEach((lang) => {
              acc[field][lang?.code] = values[field]?.[lang?.code] || "";
            });
            return acc;
          }, {});

          const requestData = {
            ...values,
            ...formattedData,
            _id: isEdit ? values._id : undefined,
            // activity: values.activity.map((a) => a.value),
            // destination: values.destination,
            banner_image: bannerImageUrl,
            card_image: cardImageUrl,
            feathers: feathersData,
            images,
            check_in: values.check_in
              ? values.check_in.format("YYYY-MM-DD")
              : null,
            check_out: values.check_out
              ? values.check_out.format("YYYY-MM-DD")
              : null,
          };

          setSubmitLoading(true);
          await useAction(
            isEdit ? updatePackages : createPackages,
            { body: requestData },
            () => {
              form.resetFields();
              setSubmitLoading(false);
              router.push("/admin/packageManagement/package");
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
          label="Images"
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
              label="Name"
              name={["name", l.code]}
              required
              className="!w-full rounded bg-transparent p-3 dashinput"
              placeholder={i18n.t("Package Name")}
            />
            <JodiEditor
              name={["about", l.code]}
              label={i18n?.t("About Package")}
              className="w-full rounded bg-transparent p-3 dashinput"
              required
              value={form.getFieldValue("about") || ""}
              onChange={(newDescription) =>
                form.setFieldValue("about", newDescription)
              }
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
              <FormSelect
                label={i18n.t("Destination")}
                name="destination"
                placeholder={i18n.t("Select Package Destination")}
                required
                className="!w-full rounded bg-transparent py-6 px-2 dashinput"
                options={destination?.docs?.map((cat) => ({
                  label: cat?.address?.name,
                  value: cat?._id,
                }))}
              />
              <FormSelect
                label={i18n.t("Package activity")}
                multi={true}
                name="activities"
                placeholder={i18n.t("Select Package activities")}
                required
                className="w-full rounded bg-transparent py-2 dashinput"
                options={activity?.docs?.map((cat) => ({
                  label: cat?.name?.[langCode],
                  value: cat?._id,
                }))}
              />
            </div>
          </div>
        ))}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
          <FormInput
            label="Group Size"
            name="group_size"
            required
            type={"number"}
            getValueFromEvent={(e) => +e.target.value}
            className="w-full rounded bg-transparent p-3 dashinput"
            placeholder={i18n.t("Group Size")}
          />
          <FormInput
            label="Tour Type"
            name="tour_type"
            required
            className="w-full rounded bg-transparent p-3 dashinput"
            placeholder={i18n.t("Tour Type")}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
          <Form.Item
            label={i18n.t("Check In Date")}
            name="check_in"
            className="package-date-picker"
          >
            <DatePicker
              disabledDate={(current) =>
                current && current < dayjs().startOf("day")
              }
              format="YYYY-MM-DD"
              className="w-full rounded p-3 !border bg-transparent"
            />
          </Form.Item>
          <Form.Item
            label={i18n?.t("Check Out Date")}
            name="check_out"
            className="package-date-picker"
          >
            <DatePicker
              disabledDate={(current) =>
                current && current < dayjs().startOf("day")
              }
              format="YYYY-MM-DD"
              className="w-full rounded bg-transparent p-3 dashinput border"
            />
          </Form.Item>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
          <FormSelect
            label={i18n.t("Trending")}
            multi={true}
            name="section"
            placeholder={i18n.t("Select Trending")}
            required
            className="w-full rounded bg-transparent py-2 dashinput"
            options={[
              { value: "trending", label: "Trending" },
              { value: "popular", label: "Popular" },
            ]}
          />
          <FormInput
            label="Video URL"
            name="banner_video_url"
            required
            className="w-full rounded bg-transparent p-3 dashinput"
            placeholder={i18n.t("Banner Video URL")}
          />
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
        {/* Highlights */}
        <div className="mt-1 border rounded-md p-3">
          <h3 className="description-2 mb-2">{i18n.t("Highlights")}</h3>
          <Form.List name="highlight" initialValue={[{}]}>
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
                          <FormInput
                            name={[fieldName, l.code]}
                            placeholder={`Highlight (${l.code})`}
                            type="text"
                            required
                            className="!w-full rounded bg-transparent p-3 dashinput"
                            label={`Highlight ${index + 1} (${l.code})`}
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
                  onClick={() => add({})}
                  className="mt-4 bg-primary text-white px-4 py-2 rounded-md"
                >
                  {i18n.t("Add Highlight")}
                </button>
              </div>
            )}
          </Form.List>
        </div>

        {/* Include */}
        <div className="mt-5 border rounded-md p-3">
          <h3 className="description-2 mb-2">{i18n.t("Includes")}</h3>
          <Form.List name="include" initialValue={[{}]}>
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
                          <FormInput
                            name={[fieldName, l.code]}
                            placeholder={`Input include ${index + 1}`}
                            type="text"
                            required
                            className="!w-full rounded bg-transparent p-3 dashinput"
                            label={`Include ${index + 1} (${l.code})`}
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
                  onClick={() => add({})}
                  className="mt-4 bg-primary text-white px-4 py-2 rounded-md"
                >
                  {i18n.t("Add Include")}
                </button>
              </div>
            )}
          </Form.List>
        </div>

        {/* exclude */}
        <div className="mt-5 border rounded-md p-3">
          <h3 className="description-2 mb-2">{i18n.t("Excludes")}</h3>
          <Form.List name="exclude" initialValue={[{}]}>
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
                          <FormInput
                            name={[fieldName, l.code]}
                            placeholder={`Input exclude ${index + 1}`}
                            type="text"
                            required
                            className="!w-full rounded bg-transparent p-3 dashinput"
                            // label={`Exclude ${index + 1}`}
                            label={`Exclude ${index + 1} (${l.code})`}
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
                  onClick={() => add({})}
                  className="mt-4 bg-primary text-white px-4 py-2 rounded-md"
                >
                  {i18n.t("Add Exclude")}
                </button>
              </div>
            )}
          </Form.List>
        </div>
        {/* itinerary */}
        <Form.List
          name="itinerary"
          initialValue={[{ heading: {}, description: {} }]}
        >
          {(fields, { add, remove }) => (
            <div className="mt-4">
              <div className="flex flex-wrap gap-4">
                {fields.map(({ key, name: fieldName }, index) => (
                  <div key={key} className="w-full border p-4 rounded-md">
                    <h3 className="description-1 mb-2">
                      {i18n.t("Itinerary")} {index + 1}
                    </h3>
                    {languages?.map((l) => (
                      <div
                        key={`heading-${l.code}`}
                        style={{
                          display: l.code === selectedLang ? "block" : "none",
                        }}
                      >
                        <FormInput
                          name={[fieldName, "heading", l.code]}
                          placeholder={`Heading (${l.code}) for Day ${
                            index + 1
                          }`}
                          type="text"
                          required
                          className="!w-full rounded bg-transparent p-3 dashinput"
                          label={`Heading (${l.code})`}
                        />
                      </div>
                    ))}

                    {languages?.map((l) => (
                      <div
                        key={`description-${l.code}`}
                        style={{
                          display: l.code === selectedLang ? "block" : "none",
                        }}
                      >
                        <FormInput
                          name={[fieldName, "description", l.code]}
                          placeholder={`Description (${l.code}) for Day ${
                            index + 1
                          }`}
                          type="text"
                          required
                          className="!w-full rounded bg-transparent p-3 dashinput"
                          label={`Description (${l.code})`}
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
                onClick={() => add({ heading: {}, description: {} })}
                className="mt-4 bg-primary text-white px-4 py-2 rounded-md"
              >
                {i18n.t("Add Itinerary")}
              </button>
            </div>
          )}
        </Form.List>

        {/* feathers */}
        <Form.List name="feathers" initialValue={[{ text: {} }]}>
          {(fields, { add, remove }) => (
            <div className="mt-4">
              <div className="flex flex-wrap gap-4">
                {fields.map(({ key, name: fieldName }, index) => (
                  <div key={key} className="w-full md:w-[48%] rounded">
                    <h3 className="description-1 mb-2">{i18n.t("Feathers")} {index + 1}</h3>

                    {/* Multilingual Texts */}
                    {languages?.map((l) => (
                      <div
                        key={l.code}
                        style={{
                          display: l.code === selectedLang ? "block" : "none",
                        }}
                      >
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

                    <MultipleImageInput
                      label="feathers Logo"
                      name={[fieldName, "logo"]} 
                      required
                    />

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
                {i18n.t("Add Feathers")}
              </button>
            </div>
          )}
        </Form.List>

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

export default PackageForm;
